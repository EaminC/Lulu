import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const imagesDirectory = path.join(process.cwd(), "public", "images");

  // 读取 public/images 目录下所有图片文件
  let images = fs.readdirSync(imagesDirectory);

  // 过滤掉不是图片的文件（保险）
  images = images.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(ext);
  });

  if (images.length === 0) {
    return res.status(404).send("No images found.");
  }

  // 随机选一张
  const randomIndex = Math.floor(Math.random() * images.length);
  const selectedImage = images[randomIndex];

  const host = req.headers.host;
  const protocol = host.includes("localhost") ? "http" : "https";

  // 加防缓存参数（防止 GitHub/CDN 缓存图片）
  const cacheBuster = Math.random().toString(36).substring(2, 8);

  // 301 跳转到随机图片
  res.redirect(
    `${protocol}://${host}/images/${selectedImage}?v=${cacheBuster}`
  );
}
