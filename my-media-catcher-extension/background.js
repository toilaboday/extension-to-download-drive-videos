// background.js
chrome.webRequest.onCompleted.addListener(
  async function(details) {
    const url = details.url;

    // Chỉ xử lý các URL video từ Google Drive
    if (!url.includes("drive.google.com/videoplayback")) {
      return;
    }

    try {
      const getParam = (url, param) => {
        const m = url.match(new RegExp('[?&]' + param + '=([^&]+)'));
        return m ? decodeURIComponent(m[1]) : null;
      };

      const tempIdFromUrl = getParam(url, 'id');
      if (!tempIdFromUrl) {
        return;
      }

      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const currentTab = tabs[0];
      
      if (!currentTab) {
        console.warn('Không tìm thấy tab đang hoạt động.');
        return;
      }

      let uniqueKey;
      let fileTitle;

      const match = currentTab.url ? currentTab.url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) : null;

      if (match) {
        uniqueKey = match[1];
        fileTitle = currentTab.title ? currentTab.title.replace(' - Google Drive', '') : uniqueKey;
      } else {
        uniqueKey = tempIdFromUrl;
        fileTitle = currentTab.title ? currentTab.title.split(' - ')[0] : 'Video (từ thư mục)';
      }

      const mime = getParam(url, 'mime');
      if (!mime) {
        return;
      }
      
      const cleanUrl = url.split('&range=')[0].split('?range=')[0];

      const { mediaMap = {} } = await chrome.storage.local.get('mediaMap');
      
      const entry = mediaMap[uniqueKey] || {};

      entry.title = fileTitle;
      if (mime.startsWith('audio')) {
        entry.audio = cleanUrl;
      } else if (mime.startsWith('video')) {
        entry.video = cleanUrl;
      }
      
      mediaMap[uniqueKey] = entry;
      
      await chrome.storage.local.set({ mediaMap });
      console.log('Saved media:', { id: uniqueKey, title: fileTitle, mime: mime });

    } catch (e) {
      console.error('!!! LỖI XẢY RA:', e);
    }
  },
  { urls: ["<all_urls>"], types: ["xmlhttprequest", "media"] }
);