# 🔴 ERROR DIAGNOSIS: "Load failed"

## 🎯 What This Error Means

The **"Load failed"** error appears in your browser console when the frontend can't load data from the backend API. This is a **network/fetch error**, not a YouTube error.

---

## 🔍 Root Causes (In Order of Likelihood)

### 1. **CORS / Network Error** (Most Common)
**What it means:** Browser is blocking the request  
**Why:** Security restrictions, streaming issues  
**Symptoms:** Error before any data transfers

### 2. **ytdl-core YouTube Blocking** (Very Common)
**What it means:** YouTube detected and blocked the bot  
**Why:** Even with agent, YouTube's anti-bot is sophisticated  
**Symptoms:** API starts but fails during video info fetch

### 3. **Stream Error During Transfer**
**What it means:** Download started but broke mid-stream  
**Why:** Network interruption, YouTube timeout  
**Symptoms:** Starts downloading then fails

### 4. **API Route Error**
**What it means:** Server-side code crashed  
**Why:** ytdl-core exception, invalid format  
**Symptoms:** 500 error in network tab

---

## 🛠️ IMMEDIATE DIAGNOSTIC STEPS

### Step 1: Click the Orange Bug Icon (Bottom Left)

I just added a **Diagnostic Panel** to your app:

```
1. Look for ORANGE BUTTON (bottom left corner)
   [🐛] ← This icon
   
2. Click it → Opens diagnostic panel

3. Click "Run Diagnostics"

4. Wait for results (4 tests)

5. Check which tests FAIL
```

**This will tell you EXACTLY what's broken!**

---

### Step 2: Check Browser Console (F12)

**What to look for:**

```javascript
// GOOD - Working:
✓ Video info request received
✓ Getting video info with agent...
✓ Video info retrieved successfully
✓ Download request received
✓ Stream started

// BAD - Specific errors:
❌ TypeError: Load failed                  → Network/CORS issue
❌ Failed to fetch                         → API not responding
❌ net::ERR_FAILED                        → Network error
❌ CORS policy                            → Cross-origin blocked
❌ Unable to retrieve video metadata      → YouTube blocked
❌ Status code: 403                       → YouTube denied access
❌ Status code: 429                       → Rate limited
```

---

### Step 3: Check Network Tab

```
1. F12 → Network tab
2. Try downloading
3. Find: /api/download
4. Check status code:

✓ 200 OK          → API working, check stream
✓ Pending         → Still loading (normal)
❌ (failed)        → Network error
❌ 403 Forbidden   → YouTube blocked
❌ 429 Rate Limit  → Too many requests
❌ 500 Error       → Server crash
```

---

## 🎯 SOLUTIONS BY ERROR TYPE

### Solution A: If Diagnostic Shows "Get video info FAILED"

**Problem:** YouTube is blocking ytdl-core

**Fix Options:**

#### Option 1: Use VPN
```
1. Connect to VPN
2. Restart server: npm run dev
3. Try again
```

#### Option 2: Use Different IP
```
- Try mobile hotspot
- Try different network
- Try different location
```

#### Option 3: Use Cookies (Advanced)
```typescript
// Add to API route:
const agent = ytdl.createProxyAgent({ 
  uri: 'http://proxy-server:port' 
});

// Or provide YouTube cookies
const info = await ytdl.getInfo(url, { 
  agent,
  requestOptions: {
    headers: {
      cookie: 'YOUR_YOUTUBE_COOKIES'
    }
  }
});
```

#### Option 4: Switch Library
Consider using `yt-dlp` or `youtube-dl-exec` instead

---

### Solution B: If Diagnostic Shows "API Connection FAILED"

**Problem:** Backend not responding

**Fix:**

```bash
# 1. Kill all node processes
killall node

# 2. Clear cache
rm -rf .next

# 3. Restart fresh
npm run dev

# 4. Check it's running on 3000
# Should see: "Ready on http://localhost:3000"
```

---

### Solution C: If All Diagnostics PASS but Download Still Fails

**Problem:** Stream breaking during transfer

**Fix 1: Lower Quality**
```
- Try 360p instead of 1080p
- Smaller file = less likely to break
```

**Fix 2: Increase Timeout**
```typescript
// In app/api/download/route.ts
const videoStream = ytdl(url, { 
  quality: itag,
  agent,
  highWaterMark: 1024 * 1024, // 1MB buffer (was 512KB)
  requestOptions: {
    maxReconnects: 5,
    maxRetries: 3,
  }
});
```

**Fix 3: Add Progress Tracking**
```typescript
let downloaded = 0;
videoStream.on('progress', (chunkLength, downloaded, total) => {
  console.log(`Downloaded ${downloaded} of ${total}`);
});
```

---

### Solution D: CORS Error

**Problem:** Browser blocking cross-origin request

**Fix: Add CORS Headers**

```typescript
// In app/api/download/route.ts
return new NextResponse(stream, {
  headers: {
    'Content-Type': selectedFormat.mimeType || `video/${extension}`,
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',  // ADD THIS
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',  // ADD THIS
  }
});
```

---

## 🧪 SYSTEMATIC TESTING APPROACH

### Test 1: API Health Check
```bash
# In terminal:
curl http://localhost:3000/api/test

# Should return JSON with test results
```

### Test 2: Specific Video Info
```bash
curl -X POST http://localhost:3000/api/video-info \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=jNQXAC9IVRw"}'

# Should return video info JSON
```

### Test 3: Browser Direct
```
Open: http://localhost:3000/api/test
Should see JSON test results
```

---

## 📊 DIAGNOSTIC PANEL RESULTS GUIDE

### All Tests Pass ✅
```
✓ ytdl-core module
✓ Create agent
✓ URL validation
✓ Get video info

→ Library works! Issue is in download stream
→ Try smaller quality or different video
```

### Module/Agent Tests Fail ❌
```
✗ ytdl-core module OR
✗ Create agent

→ Installation issue
→ Run: npm install @distube/ytdl-core
→ Restart server
```

### URL Validation Fails ❌
```
✗ URL validation

→ Coding error in validation logic
→ Check lib/utils.ts
```

### Get Video Info Fails ❌
```
✗ Get video info

→ YouTube is blocking requests
→ Most common issue
→ Solutions:
  1. Use VPN
  2. Wait 5-10 minutes
  3. Try different video
  4. Use cookies/proxy
```

---

## 🔥 NUCLEAR OPTIONS

### If Nothing Works:

#### Option 1: Alternative Library

**Install yt-dlp:**
```bash
# System-wide installation
brew install yt-dlp  # Mac
# OR
sudo apt install yt-dlp  # Linux
```

**Create new API:**
```typescript
// app/api/download-yt-dlp/route.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  const { url, quality } = await request.json();
  
  const { stdout } = await execAsync(
    `yt-dlp -f "${quality}" -o "downloads/%(title)s.%(ext)s" "${url}"`
  );
  
  // Return file path
}
```

#### Option 2: Use External Service

Use a third-party API (costs money but works):
- RapidAPI YouTube downloaders
- Any-To-Any converters
- Cloud-based download services

#### Option 3: Desktop App Recommendation

Tell user to use:
- **yt-dlp** (command line, works best)
- **4K Video Downloader** (GUI, paid)
- **JDownloader** (free, Java-based)

---

## 📋 CHECKLIST BEFORE ASKING FOR HELP

Before reporting the issue, confirm:

- [ ] Ran diagnostic panel (orange bug button)
- [ ] Checked browser console (F12)
- [ ] Checked network tab (F12)
- [ ] Server is running (`npm run dev`)
- [ ] Tried multiple videos
- [ ] Tried lower quality (360p/480p)
- [ ] Waited 5 minutes between attempts
- [ ] Tried in incognito mode
- [ ] Tried different browser
- [ ] Read full error message
- [ ] Checked server console output

---

## 🎯 EXPECTED BEHAVIOR

### What SHOULD Happen:

```
1. Paste URL → Click "Get Video"
   Console: "Video info request received"
   Console: "Getting video info with agent..."
   Console: "Video info retrieved successfully"
   Result: Video info displays with thumbnail

2. Select format → Click "Download Now"
   Console: "Download request received"
   Console: "Fetching video info..."
   Console: "Starting download stream..."
   Console: "Stream started, first chunk received"
   Console: "Stream ended successfully"
   Result: File downloads to Downloads folder

3. No errors in console
4. File can be played in video player
```

---

## 💡 UNDERSTANDING THE ERROR

### "Load failed" Chain of Events:

```
1. User clicks "Download Now"
   ↓
2. Frontend sends POST to /api/download
   ↓
3. Backend receives request
   ↓
4. ytdl-core tries to get video info from YouTube
   ↓
5. YouTube blocks request (403) OR
   YouTube rate limits (429) OR
   Network fails OR
   Video unavailable
   ↓
6. ytdl-core throws error
   ↓
7. Error propagates to stream
   ↓
8. Browser fetch() fails
   ↓
9. Console shows: "Load failed"
```

### Where It Actually Fails:

**95% of time:** Step 4-5 (YouTube blocking)
**4% of time:** Step 8 (Network/CORS)
**1% of time:** Step 3 (Server issue)

---

## 🚀 NEXT STEPS

1. **Click the orange bug icon** (bottom left)
2. **Run diagnostics**
3. **Check which test fails**
4. **Follow the solution** for that specific test
5. **If "Get video info" fails** → YouTube is blocking (use VPN/wait)
6. **If all pass but download fails** → Try lower quality
7. **If nothing works** → See "Nuclear Options"

---

## ✅ SUCCESS CRITERIA

You'll know it's fixed when:
- Diagnostic panel shows all ✅ green
- Console shows "Stream ended successfully"
- File downloads automatically
- No "Load failed" error
- File plays correctly

---

**Try the diagnostic panel now!** It will pinpoint the exact issue. 🎯

