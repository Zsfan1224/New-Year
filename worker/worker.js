const FILES_NAMESPACE = FILES_NAMESPACE; // KV 命名空间绑定

async function handleUpload(request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) {
    return new Response("No file uploaded", { status: 400 });
  }

  const fileName = file.name;
  const fileContent = await file.arrayBuffer();

  await FILES_NAMESPACE.put(fileName, fileContent);
  return new Response(`File ${fileName} uploaded successfully`, { status: 200 });
}

async function handleDownload(request) {
  const url = new URL(request.url);
  const fileName = url.pathname.split("/").pop();

  const fileContent = await FILES_NAMESPACE.get(fileName, { type: "arrayBuffer" });

  if (!fileContent) {
    return new Response("File not found", { status: 404 });
  }

  return new Response(fileContent, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}

async function handleList() {
  const list = await FILES_NAMESPACE.list();
  const fileNames = list.keys.map((entry) => entry.name);

  return new Response(JSON.stringify(fileNames), {
    headers: { "Content-Type": "application/json" },
  });
}

addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const { pathname } = url;

  if (pathname === "/upload" && event.request.method === "POST") {
    event.respondWith(handleUpload(event.request));
  } else if (pathname.startsWith("/download/") && event.request.method === "GET") {
    event.respondWith(handleDownload(event.request));
  } else if (pathname === "/list" && event.request.method === "GET") {
    event.respondWith(handleList());
  } else {
    event.respondWith(new Response("Not Found", { status: 404 }));
  }
});
