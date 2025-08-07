// popup.js
const mediaList = document.getElementById('mediaList');
const clearListBtn = document.getElementById('clearListBtn');

// SVG icon cho nút tải xuống
const downloadSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
</svg>
`;

// Hàm render danh sách media
function renderMediaList(mediaMap) {
  mediaList.innerHTML = ''; // Xóa nội dung cũ

  if (!mediaMap || Object.keys(mediaMap).length === 0) {
    const emptyState = document.createElement('p');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'No media files detected yet.';
    mediaList.appendChild(emptyState);
    return;
  }

  for (const id in mediaMap) {
    const { audio, video, title, log } = mediaMap[id];
    const cleanedTitle = cleanFilename(title || id);

    const div = document.createElement('div');
    div.className = 'media-block';
    div.innerHTML = `
      <div class="media-block-info">
        <textarea class="title-input" id="title-${id}" rows="1">${cleanedTitle}</textarea>
        ${log ? `<p class="log">${log}</p>` : ''}
      </div>
      <div class="action-buttons">
        ${audio ? `<button class="btn btn-primary dl-audio" data-id="${id}">${downloadSvg} Audio</button>` : `<button class="btn btn-secondary" disabled>Audio: waiting</button>`}
        ${video ? `<button class="btn btn-primary dl-video" data-id="${id}">${downloadSvg} Video</button>` : `<button class="btn btn-secondary" disabled>Video: waiting</button>`}
      </div>
    `;
    mediaList.appendChild(div);
    
    const titleInput = document.getElementById(`title-${id}`);

    // ✨ Hàm tự động thay đổi chiều cao của textarea ✨
    const autoResize = (el) => {
        // Tạm thời đặt chiều cao về 'auto' để tính toán lại scrollHeight
        el.style.height = 'auto';
        // Đặt chiều cao mới bằng với chiều cao nội dung
        el.style.height = (el.scrollHeight) + 'px';
    };

    // Gán sự kiện 'input' để tự động thay đổi kích thước khi gõ
    titleInput.addEventListener('input', () => autoResize(titleInput));
    
    // Lưu tiêu đề khi người dùng chỉnh sửa xong
    titleInput.addEventListener('change', (e) => {
      const newTitle = e.target.value;
      updateTitle(id, newTitle);
    });
    
    // Gọi một lần lúc đầu để đặt chiều cao chính xác
    autoResize(titleInput);
  }

  attachDownloadEventListeners();
}

// Hàm cập nhật tiêu đề trong storage
async function updateTitle(id, newTitle) {
  const { mediaMap } = await chrome.storage.local.get('mediaMap');
  if (mediaMap && mediaMap[id]) {
    mediaMap[id].title = newTitle;
    await chrome.storage.local.set({ mediaMap });
  }
}

// Hàm gán sự kiện cho các nút tải xuống
function attachDownloadEventListeners() {
  document.querySelectorAll('.dl-audio').forEach(btn => {
    btn.onclick = e => {
      const button = e.target.closest('button');
      const id = button.dataset.id;
      const title = document.getElementById(`title-${id}`).value;
      chrome.storage.local.get('mediaMap', ({ mediaMap }) => {
        const audio = mediaMap[id]?.audio;
        if (audio) {
          downloadFile(audio, `${cleanFilename(title)}.m4a`);
        }
      });
    };
  });

  document.querySelectorAll('.dl-video').forEach(btn => {
    btn.onclick = e => {
      const button = e.target.closest('button');
      const id = button.dataset.id;
      const title = document.getElementById(`title-${id}`).value;
      chrome.storage.local.get('mediaMap', ({ mediaMap }) => {
        const video = mediaMap[id]?.video;
        if (video) {
          downloadFile(video, `${cleanFilename(title)}.mp4`);
        }
      });
    };
  });
}

// Gán sự kiện cho nút "Clear list"
clearListBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear the media list?')) {
    chrome.storage.local.remove('mediaMap', () => {
      renderMediaList({});
      console.log('Cleared media list.');
    });
  }
});

// Hàm làm sạch tên tệp
function cleanFilename(filename) {
  return filename.replace(/[<>:"/\\|?*]/g, '_').trim();
}

// Hàm tải xuống tệp
function downloadFile(url, filename) {
  chrome.downloads.download({ url, filename: filename });
}

// Tải dữ liệu ban đầu khi popup mở
chrome.storage.local.get('mediaMap', ({ mediaMap }) => {
  renderMediaList(mediaMap || {});
});

// Lắng nghe thay đổi của storage để cập nhật UI tự động
chrome.storage.onChanged.addListener(changes => {
  if (changes.mediaMap) {
    renderMediaList(changes.mediaMap.newValue || {});
  }
});