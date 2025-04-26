export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Random Image API is working!</h1>
      <p>
        Visit{" "}
        <a href="/api/random-image" target="_blank">
          /api/random-image
        </a>{" "}
        to see a random image.
      </p>
    </div>
  );
}
