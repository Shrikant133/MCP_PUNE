export default function ImageBlock({ src }) {
  return (
    <div className="w-1/3">
      <img src={src} alt="result" className="rounded-lg shadow" />
    </div>
  );
}