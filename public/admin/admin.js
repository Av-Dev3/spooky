async function uploadMedia(file, { title="", tags=[], published=true } = {}) {
  const kind = file.type.startsWith("video/") ? "video" : "image";

  const r1 = await fetch("/api/admin/media/signed-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ contentType: file.type })
  });
  if (!r1.ok) throw new Error("Signed URL failed");
  const { uploadUrl, storagePath } = await r1.json();

  const put = await fetch(uploadUrl, { method: "PUT", body: file });
  if (!put.ok) throw new Error("Upload failed");

  const r2 = await fetch("/api/admin/media/commit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title, tags, kind, storagePath, published })
  });
  if (!r2.ok) throw new Error("Commit failed");
}

async function loadMedia() {
  const r = await fetch("/api/admin/list/media", { credentials: "include" });
  if (!r.ok) throw new Error("List failed");
  const { items } = await r.json();
  return items;
}

function previewSrc(storage_path) {
  return `/api/admin/media/preview?path=${encodeURIComponent(storage_path)}`;
}

async function deleteMedia(id) {
  const r = await fetch("/api/admin/media/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ id })
  });
  if (!r.ok) throw new Error("Delete failed");
}

async function renderGrid() {
  const items = await loadMedia();
  const grid = document.getElementById("grid");
  grid.innerHTML = items.map(m => `
    <div class="card">
      <div class="thumb">
        ${m.kind === 'image'
          ? `<img src="${previewSrc(m.storage_path)}" alt="${m.title||""}" />`
          : `<video src="${previewSrc(m.storage_path)}" controls></video>`}
      </div>
      <div class="meta">
        <div><strong>${m.title || "Untitled"}</strong></div>
        <div><small>${(m.tags||[]).join(", ")}</small></div>
        <div class="row">
          <button data-id="${m.id}" class="del">Delete</button>
        </div>
      </div>
    </div>
  `).join("");

  grid.querySelectorAll(".del").forEach(btn => {
    btn.addEventListener("click", async () => {
      await deleteMedia(btn.dataset.id);
      renderGrid();
    });
  });
}

document.getElementById("uploadBtn")?.addEventListener("click", async () => {
  const file = document.getElementById("file").files[0];
  if (!file) return alert("Pick a file");
  const title = document.getElementById("title").value.trim();
  const tags = document.getElementById("tags").value.split(",").map(t => t.trim()).filter(Boolean);
  const published = document.getElementById("published").checked;
  await uploadMedia(file, { title, tags, published });
  document.getElementById("file").value = "";
  renderGrid();
});

renderGrid();
