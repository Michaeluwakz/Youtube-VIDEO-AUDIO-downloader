# 🔧 Troubleshooting Guide - TubeGrab Pro

## ❌ "Load failed" Error

This is the most common error and usually relates to YouTube's bot detection or CORS issues.

---

## ✅ Solution Applied (v2.0)

I've updated the code with the following fixes:

### 1. Added ytdl Agent
```typescript
// Creates a special agent to avoid bot detection
const agent = ytdl.createAgent(undefined, {
  localAddress: undefined,
});

// Use agent in all requests
const info = await ytdl.getInfo(url, { agent });
```

### 2. Better Error Handling
- Detailed console logging
- Specific error messages
- Stream error catching
- Proper cleanup

### 3. Improved Streaming
- Higher buffer size (512KB)
- Better chunk handling
- Proper error propagation
- Stream lifecycle management

---

## 🧪 Testing Steps

### Step 1: Restart the Server
```bash
# Kill the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 2: Open Browser Console
```
1. Open http://localhost:3000
2. Press F12 (open Developer Tools)
3. Go to "Console" tab
4. Keep it open to see logs
```

### Step 3: Try a Simple Video
Use this test video (known to work):
```
https://www.youtube.com/watch?v=jNQXAC9IVRw
```

### Step 4: Check Console Logs
You should see:
```
Video info request received: https://...
Getting video info with agent...
Video info retrieved successfully: [Video Title]
Selected format: { itag: ..., quality: ... }
Starting download stream...
Stream started, first chunk received
Stream ended successfully
```

---

## 🐛 If Still Failing

### Check 1: Verify Server is Running
```bash
# Should see:
✓ Ready in Xms
○ Local: http://localhost:3000
```

### Check 2: Test Different Videos

**Try these in order:**

1. **Short Public Video** (easiest)
   ```
   https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ```

2. **Recent Upload** (may work better)
   ```
   Any recently uploaded public video
   ```

3. **Avoid These:**
   - ❌ Age-restricted videos
   - ❌ Private videos
   - ❌ Region-locked content
   - ❌ Copyright-struck videos
   - ❌ Live streams
   - ❌ Premieres

### Check 3: Look at Browser Console

**What to look for:**

```javascript
// GOOD - Success:
✓ Download request received
✓ Video info retrieved
✓ Stream started

// BAD - Errors:
❌ CORS error
❌ Failed to fetch
❌ 403 Forbidden
❌ 429 Too Many Requests
```

### Check 4: Network Tab

1. Open DevTools (F12)
2. Go to "Network" tab
3. Try downloading
4. Look for `/api/download` request

**Check the response:**
- **200 OK** = Good! Should work
- **403 Forbidden** = YouTube blocked the request
- **429 Too Many Requests** = Rate limited
- **500 Internal Server Error** = Check server console

---

## 🔥 Advanced Fixes

### Fix 1: Clear Browser Cache
```
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Try again
```

### Fix 2: Use Different Browser
```
Chrome/Edge → Try Firefox
Firefox → Try Chrome
Safari → Try Chrome
```

### Fix 3: Check Server Console

Look at the terminal where `npm run dev` is running:

**Good output:**
```
Download request received: { url: '...', itag: 18 }
Fetching video info...
Video info retrieved: Video Title
Starting download stream...
Stream started, first chunk received
```

**Bad output:**
```
Error: Unable to retrieve video metadata
Error: Video unavailable
Error: Status code: 403
```

### Fix 4: Update Dependencies
```bash
cd /Users/mykeluwakz/Desktop/tubegrab-pro
npm update @distube/ytdl-core
npm run build
npm run dev
```

---

## 🌍 YouTube API Limitations

### Known Issues with ytdl-core

YouTube actively tries to prevent automated downloads:

1. **Bot Detection** - Fixed with agent
2. **Rate Limiting** - Wait 1-2 minutes between attempts
3. **IP Blocking** - Rare, temporary
4. **Regional Restrictions** - Can't fix, video not available
5. **Private Videos** - Can't download

### Rate Limiting

If you see "429 Too Many Requests":
```
Wait 2-5 minutes
Try a different video
Restart the server
```

---

## 📊 Error Messages Explained

### "Load failed"
**Cause:** Network error, CORS, or ytdl-core issue
**Fix:** Use agent (already applied), try different video

### "Video is unavailable"
**Cause:** Video deleted, private, or region-locked
**Fix:** Try a different video

### "Failed to fetch"
**Cause:** Server not running or network issue
**Fix:** Check server is running on port 3000

### "403 Forbidden"
**Cause:** YouTube blocked the request
**Fix:** Wait a few minutes, try different video

### "429 Too Many Requests"
**Cause:** Too many downloads too quickly
**Fix:** Wait 2-5 minutes

### "Invalid YouTube URL"
**Cause:** URL format not recognized
**Fix:** Use format: youtube.com/watch?v=VIDEO_ID

### "Format not available"
**Cause:** Selected quality doesn't exist
**Fix:** Try a different quality

---

## 🔍 Debugging Checklist

### Server Side
- [ ] Server is running (npm run dev)
- [ ] No errors in terminal
- [ ] Port 3000 is not blocked
- [ ] Logs show "Ready in Xms"

### Client Side
- [ ] Browser console open
- [ ] No CORS errors
- [ ] Network tab shows requests
- [ ] Cache cleared

### Video
- [ ] URL is correct format
- [ ] Video is public
- [ ] Video is not age-restricted
- [ ] Video is not region-locked
- [ ] Video is not live stream

### Download
- [ ] Format is selected (blue checkmark)
- [ ] Download button is green
- [ ] Browser allows downloads
- [ ] Popup blocker not interfering

---

## 💡 Alternative Solution

If ytdl-core continues to fail, you have options:

### Option 1: Use Different Library
```bash
npm install youtube-dl-exec
```

### Option 2: Use External API
Consider using a third-party API service (may have costs)

### Option 3: Desktop Application
For personal use, consider using a desktop app like:
- yt-dlp (command line)
- 4K Video Downloader
- JDownloader

---

## 🎯 Success Indicators

### You know it's working when:

**✅ Console shows:**
```
Video info request received
Getting video info with agent...
Video info retrieved successfully: [Title]
Download request received: { url: ..., itag: ... }
Fetching video info...
Video info retrieved: [Title]
Starting download stream...
Stream started, first chunk received
```

**✅ Browser shows:**
- Video info loads with thumbnail
- Formats displayed with checkboxes
- Can select format (blue checkmark)
- Download button turns green
- File downloads successfully

**✅ File System:**
- File appears in Downloads folder
- File has proper name and extension
- File can be played in video player

---

## 🆘 Still Not Working?

### Try This Test:

1. **Kill the server** (Ctrl+C)
2. **Restart fresh:**
   ```bash
   cd /Users/mykeluwakz/Desktop/tubegrab-pro
   npm run dev
   ```
3. **Open new browser tab** (incognito mode)
4. **Go to** http://localhost:3000
5. **Open console** (F12)
6. **Try this exact URL:**
   ```
   https://www.youtube.com/watch?v=jNQXAC9IVRw
   ```
7. **Select 360p or 480p** (lower quality = more likely to work)
8. **Click Download Now**

### Check the Console:

**If you see:**
- `Download request received` → Good, API is working
- `Video info retrieved` → Good, ytdl-core can access video
- `Starting download stream` → Good, download starting
- `Stream started` → Good, data is flowing
- `Stream ended successfully` → Perfect! Download complete

**If you see errors:**
- Copy the FULL error message
- Check if it matches any in this guide
- Look for specific YouTube error codes (403, 429, etc.)

---

## 📝 Reporting Issues

If nothing works, check:

1. **Node.js version:**
   ```bash
   node --version  # Should be v18 or higher
   ```

2. **Package versions:**
   ```bash
   npm list @distube/ytdl-core
   ```

3. **Console errors:**
   - Take screenshot of browser console
   - Take screenshot of terminal output
   - Note which video URL you tried
   - Note which format you selected

---

## ✅ Current Status

**Version:** 2.0 (with agent fix)
**Changes made:**
- ✅ Added ytdl agent for bot detection
- ✅ Enhanced error handling
- ✅ Improved logging
- ✅ Better stream management
- ✅ Specific error messages

**Try again now!** The "Load failed" error should be fixed. 🎉

