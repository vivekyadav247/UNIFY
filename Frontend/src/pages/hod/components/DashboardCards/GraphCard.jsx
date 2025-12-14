export default function GraphCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}
