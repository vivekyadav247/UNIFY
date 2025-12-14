import PastEventRow from "./PastEventRow";


export default function PastEventsList({ events }) {
return (
<div className="bg-white border rounded-xl p-5 space-y-4">
{events.map((event, index) => (
<PastEventRow key={index} event={event} />
))}
</div>
);
}