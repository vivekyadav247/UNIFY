
export default function AnnouncementCard({ color, heading, text }) {
  return (
    <div className={`p-4 rounded-lg mb-4 ${color} w-full max-w-4xl mx-auto`}>
      <p className="font-medium text-gray-800">{heading}</p>
      <p className="text-gray-600 text-sm mt-1">{text}</p>
    </div>
  );
}
