import Image from "next/image";

function Home() {
  return (
    <>
      <h1>A sorte segue a coragem!</h1>
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "600px",
          aspectRatio: "16/9",
        }}
      >
        <Image
          src="/images/taia.jpg"
          alt="A sorte segue a coragem!"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
    </>
  );
}

export default Home;
