export default function ChatBubble({ text }) {
  return (
    <div className="bg-white rounded-lg shadow px-4 py-2 w-fit">
      {text}
    </div>
  );
}