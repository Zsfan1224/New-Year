const API_BASE_URL = "https://file-share-worker.workers.dev";

// 上传文件
document.getElementById("uploadForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const fileInput = document.getElementById("fileInput");
  if (!fileInput.files.length) {
    alert("Please select a file.");
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      alert("File uploaded successfully!");
      loadFiles();
    } else {
      alert("Failed to upload file.");
    }
  } catch (error) {
    alert("Error uploading file.");
  }
});

// 获取文件列表
async function loadFiles() {
  try {
    const response = await fetch(`${API_BASE_URL}/list`);
    const files = await response.json();

    const fileList = document.getElementById("fileList");
    fileList.innerHTML = files.length
      ? files
          .map(
            (file) => `
        <li>
          <a href="${API_BASE_URL}/download/${file}" target="_blank">${file}</a>
        </li>`
          )
          .join("")
      : "<li>No files uploaded yet.</li>";
  } catch (error) {
    alert("Error loading files.");
  }
}

// 初始化加载文件
loadFiles();
