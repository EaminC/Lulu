import fs from "fs";
import path from "path";

// ✨ 全局缓存，不用每次都 readdirSync
let cachedImages: { filename: string, weight: number, link?: string }[] | null =
  null;

function loadImages() {
  if (cachedImages) return cachedImages;

  const imagesDirectory = path.join(process.cwd(), "public", "images");
  const files = fs.readdirSync(imagesDirectory).filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(ext);
  });

  // 可以自己给每张图片定义权重和跳转链接
  cachedImages = files.map((filename) => {
    return {
      filename,
      weight: 1, // 默认权重1（越大越容易抽到）
      link: undefined, // 默认不跳转（可以后面按需要设置）
    };
  });

  // 这里你可以手动设定某些图片权重，比如让 image1.jpg 更容易出现
  cachedImages.forEach((img) => {
    if (img.filename === "special.jpg") {
      img.weight = 5; // special.jpg 出现概率是别人的5倍
      img.link = "https://your-special-link.com"; // 点击跳转到外链
    }
  });

  return cachedImages;
}

function weightedRandom(images: { filename: string, weight: number }[]) {
  const totalWeight = images.reduce((sum, img) => sum + img.weight, 0);
  let random = Math.random() * totalWeight;

  for (const img of images) {
    if (random < img.weight) {
      return img;
    }
    random -= img.weight;
  }

  return images[0]; // 保底
}

export default function handler(req, res) {
  const images = loadImages();

  if (images.length === 0) {
    return res.status(404).send("No images found.");
  }

  const selected = weightedRandom(images);
  const host = req.headers.host;
  const protocol = host.includes("localhost") ? "http" : "https";

  const cacheBuster = Math.random().toString(36).substring(2, 8);

  const imageUrl = `${protocol}://${host}/images/${selected.filename}?v=${cacheBuster}`;

  // 如果有 link，做跳转到 link，否则跳转到图片
  const finalUrl = selected.link ?? imageUrl;

  res.setHeader("Cache-Control", "no-store");
  res.redirect(finalUrl);
}
