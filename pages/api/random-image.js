import fs from "fs";
import path from "path";

let cachedImages = null; // 全局缓存，避免每次都 readdirSync

function loadImages() {
  const imagesDirectory = path.join(process.cwd(), "public", "images");
  let images = fs.readdirSync(imagesDirectory);

  images = images.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(ext);
  });

  return images;
}

export default function handler(req, res) {
  if (!cachedImages) {
    cachedImages = loadImages();
  }

  if (cachedImages.length === 0) {
    return res.status(404).send("No images found.");
  }

  const randomIndex = Math.floor(Math.random() * cachedImages.length);
  const selectedImage = cachedImages[randomIndex];

  const host = req.headers.host;
  const protocol = host.includes("localhost") ? "http" : "https";

  // 防缓存参数
  const cacheBuster = Math.random().toString(36).substring(2, 8);

  // 重要！告诉浏览器不要缓存
  res.setHeader("Cache-Control", "no-store");

  res.redirect(
    `${protocol}://${host}/images/${selectedImage}?v=${cacheBuster}`
  );
}
