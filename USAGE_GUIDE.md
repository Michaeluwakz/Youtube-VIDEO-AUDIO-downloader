# 🎯 TubeGrab Pro - Usage Guide

## ✅ NEW: Exclusive Selection System

---

## 🚀 How to Use (Step by Step)

### Step 1: Start the App
```bash
cd /Users/mykeluwakz/Desktop/tubegrab-pro
npm run dev
```
Open: **http://localhost:3000**

---

### Step 2: Enter YouTube URL

```
┌─────────────────────────────────────────────────┐
│  🔍 Paste YouTube video URL here...             │
│  [Paste]  [Get Video]                           │
└─────────────────────────────────────────────────┘
```

**Example URLs:**
- `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- `https://youtu.be/dQw4w9WgXcQ`
- `https://www.youtube.com/shorts/abc123`

---

### Step 3: Browse Available Formats

After clicking "Get Video", you'll see:

```
┌─────────────────────────────────────────────────┐
│  📹 Video Formats                               │
│  ┌──────────────────┐  ┌──────────────────┐    │
│  │  ○  1080p        │  │  ○  720p         │    │
│  │  MP4 • 1920x1080 │  │  MP4 • 1280x720  │    │
│  │  ✓ Video + Audio │  │  ✓ Video + Audio │    │
│  └──────────────────┘  └──────────────────┘    │
│                                                  │
│  🎵 Audio Only                                   │
│  ┌──────────────────┐  ┌──────────────────┐    │
│  │  ○  320kbps      │  │  ○  256kbps      │    │
│  │  MP3 • Audio Only│  │  M4A • Audio Only│    │
│  └──────────────────┘  └──────────────────┘    │
└─────────────────────────────────────────────────┘
```

---

### Step 4: Select ONE Format

**Click on ANY format** to select it:

```
BEFORE:                      AFTER:
┌──────────────────┐         ┌──────────────────┐
│  ○  1080p        │  →      │  ✓  1080p        │  ← SELECTED!
│  MP4 • 1920x1080 │         │  MP4 • 1920x1080 │     (Blue glow)
│  ✓ Video + Audio │         │  ✓ Video + Audio │
└──────────────────┘         └──────────────────┘
```

**Visual Changes:**
- ○ Empty circle → **✓ Blue checkmark**
- Gray border → **Blue glowing border**
- White background → **Light blue background**

---

### Step 5: Confirm Your Selection

Footer shows what you selected:

```
┌─────────────────────────────────────────────────┐
│  ℹ️  Selected: 1080p • MP4 (Video + Audio)      │
│                                                  │
│  ┌─────────────────────────────────────────┐   │
│  │   ⬇️  Download Now                       │   │
│  │      (BIG GREEN BUTTON)                  │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

### Step 6: Download!

**Click the green "Download Now" button**

```
┌─────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────┐   │
│  │   ⏳ Downloading...                      │   │
│  │      (Spinner animation)                 │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘

           ↓ (Wait a few seconds)

┌─────────────────────────────────────────────────┐
│  ✅ Download Complete! ✓                        │
│  Your file has been saved to downloads folder   │
└─────────────────────────────────────────────────┘
```

**File saved as:** `video_title.mp4` (or .mp3, .m4a, etc.)

---

## 🎯 Key Features

### ✅ EXCLUSIVE Selection
- **Only ONE format can be selected at a time**
- Previous selection automatically clears
- Clear visual feedback (blue checkmark)

### ✅ Universal Download Function
- **Works with ALL formats:**
  - 1080p, 720p, 480p, 360p videos
  - MP3, M4A audio files
  - Any container (MP4, WEBM, etc.)
- Single download button for everything

### ✅ Smart UI
```
No Selection:
  Button: "Select a Format First" (Gray, Disabled)
  Helper: "👆 Click on any format above to select it"

Format Selected:
  Button: "Download Now" (Green, Enabled)
  Info: Shows what's selected

Downloading:
  Button: "Downloading..." (Spinner)
  All formats: Disabled (can't change)

Complete:
  Notification: Green success message
  Auto-dismiss: After 5 seconds
```

---

## 📋 Complete Example

### Download a 1080p Video

```
1. Paste URL: https://youtube.com/watch?v=abc123
   → Click "Get Video"

2. Wait for info to load
   → See video thumbnail, title, formats

3. Click on "1080p • MP4"
   → Format shows blue checkmark ✓
   → Footer shows "Selected: 1080p • MP4"
   → Big green button enabled

4. Click "Download Now"
   → Button shows "Downloading..."
   → Progress indicator appears

5. Download Complete!
   → Green notification at top
   → File saved: "my_video.mp4"
   → Added to history
```

---

### Download Audio Only

```
1. Paste URL: https://youtube.com/watch?v=music123
   → Click "Get Video"

2. Scroll to "🎵 Audio Only" section

3. Click "320kbps • MP3"
   → Format selected (blue checkmark)
   → Footer: "Selected: 320kbps • MP3 (Audio Only)"

4. Click "Download Now"
   → Downloads audio file
   → Saved as: "song_title.mp3"
```

---

### Change Selection

```
1. Select "720p MP4"
   → Shows blue checkmark on 720p

2. Change mind, click "1080p MP4"
   → 720p checkmark removed automatically
   → 1080p now selected
   → Only ONE selection at a time! ✓

3. Click "Download Now"
   → Downloads the 1080p version
```

---

## 🎨 Visual States Reference

### Format Card States

**1. Not Selected (Default)**
```
┌──────────────────────────┐
│  ○  Quality              │  ← Empty circle
│  Format • Resolution     │
│  Type indicator          │
└──────────────────────────┘
Gray border | White bg
```

**2. Selected**
```
┌══════════════════════════┐  ← Blue glowing border
║  ✓  Quality              ║  ← Blue checkmark
║  Format • Resolution     ║
║  Type indicator          ║
└══════════════════════════┘
Blue border | Blue bg
```

**3. During Download**
```
┌──────────────────────────┐
│  [DISABLED]              │
│  All formats locked      │
│  Can't change selection  │
└──────────────────────────┘
Grayed out | Disabled
```

---

### Download Button States

**1. No Selection**
```
┌───────────────────────────────┐
│  ⬇️  Select a Format First    │  Gray | Disabled
└───────────────────────────────┘
Helper: 👆 Click on any format above
```

**2. Format Selected**
```
┌───────────────────────────────┐
│  ⬇️  Download Now             │  Green | Enabled
└───────────────────────────────┘
Info: Selected: 1080p • MP4 (Video + Audio)
```

**3. Downloading**
```
┌───────────────────────────────┐
│  ⏳ Downloading...            │  Green | Disabled
└───────────────────────────────┘
Spinner animation active
```

**4. Complete**
```
┌───────────────────────────────┐
│  ✅ Download Complete! ✓      │  Success popup
│  File saved to downloads      │
└───────────────────────────────┘
Auto-dismisses after 5 seconds
```

---

## 💡 Pro Tips

### 🎯 Selection Tips
1. **Click once** to select a format
2. **Click another** to change selection
3. **Only one** can be selected at a time
4. Look for the **blue checkmark** ✓

### ⬇️ Download Tips
1. **Green button** means ready to download
2. **Gray button** means select a format first
3. **Can't change** selection during download
4. **File saves** to your browser's download folder

### 🎵 Format Tips
- **1080p/720p** for high quality video
- **480p/360p** for smaller file sizes
- **MP3** for music (smaller files)
- **M4A** for music (better quality)

### 📊 File Sizes (Approximate)
- 1080p 10min video → ~500MB
- 720p 10min video → ~300MB
- 480p 10min video → ~150MB
- Audio only 10min → ~10-30MB

---

## ⚙️ Technical Details

### What Happens When You Click "Download Now"?

```typescript
1. Validates selection exists
2. Sends request to server with:
   - YouTube video URL
   - Selected format ID (itag)
3. Server streams video data
4. Creates downloadable file
5. Triggers browser download
6. Saves to history
7. Shows success notification
```

### File Naming

```typescript
Original title: "My Cool Video! (2024) [HD]"
Sanitized: "my_cool_video_2024_hd"
Final: "my_cool_video_2024_hd.mp4"
```

### Supported Formats

**Video:**
- MP4 (H.264 codec)
- WEBM (VP9 codec)

**Audio:**
- MP3 (MPEG Layer 3)
- M4A (AAC codec)
- WEBM (Opus codec)

---

## 🐛 Troubleshooting

### "Select a Format First" - Button is Gray
**Solution:** Click on any format card to select it

### Format Won't Select
**Solution:** Wait if download is in progress, then try again

### Download Doesn't Start
**Possible causes:**
- Video is private/restricted
- Network issue
- Invalid URL

**Solution:** Try a different video or check your internet

### Multiple Formats Selected
**This shouldn't happen!** 
- Only ONE format can be selected at a time
- If you see this, refresh the page

---

## ✅ Quick Checklist

Before downloading, make sure:
- [ ] YouTube URL is pasted
- [ ] Video info loaded successfully
- [ ] ONE format is selected (blue checkmark)
- [ ] Footer shows selection details
- [ ] Download button is GREEN
- [ ] You have internet connection
- [ ] Browser allows downloads

---

## 🎉 You're Ready!

The system is intuitive and easy to use:
1. **Paste URL** → Get video info
2. **Click format** → Select what you want
3. **Click download** → Get your file!

**Simple. Fast. Works for everything.** ✓

---

## 📞 Need Help?

- **Can't select format:** Make sure nothing is downloading
- **Download fails:** Try a different video or format
- **Button stays gray:** Click on a format card first
- **Want to change:** Just click a different format

**Enjoy TubeGrab Pro!** 🚀

