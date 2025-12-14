import { Calendar } from "lucide-react";


export default function PastEventRow({ event }) {
return (
<div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
<div className="flex gap-4 items-center">
<div className="bg-gray-200 p-2 rounded-lg">
<Calendar />
</div>
<div>
<h4 className="font-medium">{event.title}</h4>
<div className="flex gap-2 text-sm mt-1">
<span>{event.date}</span>
<span className="bg-blue-100 px-2 rounded">{event.type}</span>
<span className="bg-gray-200 px-2 rounded">{event.attended} attended</span>
</div>
</div>
</div>


<span className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm">
Completed
</span>
</div>
);
}