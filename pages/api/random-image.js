// pages/api/random-image.js
export default function handler(req, res) {
  const images = [
    "/images/image1.jpg",
    "/images/image2.jpg",
    "/images/image3.jpg",
    "/images/image4.jpg",
    "/images/image5.jpg",
    "/images/image6.jpg",
    "/images/image7.jpg",
    "/images/image8.jpg",
    "/images/image9.jpg",
  ];

  const randomIndex = Math.floor(Math.random() * images.length);
  const selectedImage = images[randomIndex];

  const host = req.headers.host;
  const protocol = host.includes("localhost") ? "http" : "https";

  res.redirect(`${protocol}://${host}${selectedImage}`);
}
