# 🎬 Drive Video Downloader Extension

> **Stop recording your screen. Start downloading.**  
> Download audio and video file(muted) directly from Google Drive.  
> Merge them later using `ffmpeg` into a complete `.mp4` file.

---

## 🚀 What is this?

**Drive Video Downloader** is a Chrome Extension that helps you download videos and audio tracks directly from Google Drive, even when Google disables native download buttons. No more screen recording. No more low-quality rips.

🔹 Download:
- 📼 Video (muted stream)
- 🔊 Audio (separate .m4a)

🛠️ Coming soon: A tool to merge video and audio using `ffmpeg`.

---

## 🧰 Why this tool?

Because creators, freelancers, students (like me 👋) often get stuck with shared videos on Drive that can't be downloaded. This extension simplifies the process – one click, two files, full control.

---

## 🔧 How it works

1. PLay a video preview on Google Drive
2. The extension adds a **"Download Video / Download Audio"** button
3. Click to save the streams
4. Use `ffmpeg` (or the bundled tool – coming soon) to merge them into `.mp4`

---

## 📦 Installation

> ⚠️ This project is in active development.

1. Clone this repo or download as ZIP  
2. Go to `chrome://extensions`  
3. Enable **Developer Mode**  
4. Click **"Load Unpacked"** and select this extension's folder  
5. Visit a Google Drive video → test the download buttons 🎉

---
## 💖 Support the Project

> I'm an independent designer building tools for creators, freelancers, and everyday users like you.

If you find this extension helpful or want to help speed up development (like hiring a dev for the merging tool), you can buy me a coffee here:

👉 **[https://ko-fi.com/drivevideodownload](https://ko-fi.com/drivevideodownload)**

Your support will go directly to:
- 🧠 Developer costs
- ⚙️ Feature improvements
- 🧪 Testing & maintenance
- 💙 Keeping the extension ad-free forever

Every small donation means a lot. Thank you for being part of the journey!

## 🧪 ffmpeg Merge Tool (optional)

After downloading:
```bash
ffmpeg -i video.mp4 -i audio.m4a -c copy output-final.mp4
