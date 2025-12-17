export default function FeedbackCard() {
const feedbacks = [
{ name: "Alice Johnson", count: 8, date: "2025-12-10" },
{ name: "Bob Smith", count: 6, date: "2025-12-11" },
{ name: "Carol Williams", count: 9, date: "2025-12-12" },
{ name: "David Brown", count: 12, date: "2025-12-13" },
{ name: "Emma Davis", count: 7, date: "2025-12-09" },
];


return (
<div className="bg-white rounded-xl p-5 shadow">
<h3 className="font-semibold mb-4">Feedback & Mentorship Notes</h3>
<div className="space-y-3">
{feedbacks.map((item, index) => (
<div
key={index}
className="flex justify-between items-center border rounded-lg p-3"
>
<div>
<p className="font-medium">{item.name}</p>
<span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
{item.count} feedbacks given
</span>
</div>
<p className="text-xs text-gray-500">Last: {item.date}</p>
</div>
))}
</div>
</div>
);
}