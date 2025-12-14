
import StatCard from "./StatCard";


export default function EventsStats() {
return (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
<StatCard title="Upcoming Events" value="5" />
<StatCard title="This Month" value="8" />
<StatCard title="Total Attendees" value="1,127" />
<StatCard title="Events This Year" value="42" />
</div>
);
}