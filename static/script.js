window.addEventListener("DOMContentLoaded", () => {
    const dropArea = document.getElementById("drop-area");
    const fileInput = document.getElementById("fileElem");

    // 拖拽高亮
    ["dragenter", "dragover"].forEach(event => {
        dropArea.addEventListener(event, e => {
            e.preventDefault();
            dropArea.classList.add("highlight");
        });
    });

    ["dragleave", "drop"].forEach(event => {
        dropArea.addEventListener(event, e => {
            e.preventDefault();
            dropArea.classList.remove("highlight");
        });
    });

    // 拖拽上传
    dropArea.addEventListener("drop", e => {
        const files = e.dataTransfer.files;
        fileInput.files = files;
        showPreview(files);
    });

    // 点击上传
    fileInput.addEventListener("change", () => {
        showPreview(fileInput.files);
    });

    // 预览函数
    function showPreview(files) {
        const preview = document.getElementById("preview");
        if (!preview) return;

        preview.innerHTML = "";

        Array.from(files).forEach(file => {
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = e => {
                    const wrapper = document.createElement("div");
                    wrapper.className = "preview-item";

                    const img = document.createElement("img");
                    img.src = e.target.result;
                    img.className = "thumb";

                    const label = document.createElement("p");
                    label.textContent = file.name;
                    label.className = "filename";

                    wrapper.appendChild(img);
                    wrapper.appendChild(label);
                    preview.appendChild(wrapper);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 暗色模式
    const toggleBtn = document.getElementById("theme-toggle");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            const isDark = document.body.classList.contains("dark");
            toggleBtn.textContent = isDark ? "☀️ 浅色模式" : "🌙 暗色模式";
        });
    }

    // 多选下载
    const downloadBtn = document.getElementById("download-selected");
    if (downloadBtn) {
        downloadBtn.addEventListener("click", () => {
            const checkboxes = document.querySelectorAll(".file-checkbox:checked");
            if (checkboxes.length === 0) {
                alert("请先选择要下载的文件！");
                return;
            }

            checkboxes.forEach((checkbox, index) => {
                const filename = checkbox.value;
                const link = document.createElement("a");
                link.href = `/download/${encodeURIComponent(filename)}`;
                link.download = filename;
                document.body.appendChild(link);
                setTimeout(() => {
                    link.click();
                    document.body.removeChild(link);
                }, index * 300);
            });
        });
    }

    // 全选 / 取消全选
    const selectAllBtn = document.getElementById("select-all");
    if (selectAllBtn) {
        const checkboxes = document.querySelectorAll(".file-checkbox");
        if (checkboxes.length > 0) {
            selectAllBtn.style.display = "inline-block";
            downloadBtn.style.display = "inline-block";

            let allSelected = false;
            selectAllBtn.addEventListener("click", () => {
                allSelected = !allSelected;
                checkboxes.forEach(cb => cb.checked = allSelected);
                selectAllBtn.textContent = allSelected ? "❎ 取消全选" : "✅ 全选";
            });
        }
    }
});