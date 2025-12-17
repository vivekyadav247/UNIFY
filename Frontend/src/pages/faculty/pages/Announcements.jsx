
// src/pages/faculty/pages/Announcements.jsx

import { useState } from "react";
import SearchFilterCard from "../components/AnnouncementCards/SearchFilterCard";
import AnnouncementCard from "../components/AnnouncementCards/AnnouncementCard";
import { announcementsData } from "../components/AnnouncementCards/AnnouncementsData";

export default function Announcements() {
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("all");

  const filteredData = announcementsData.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priority === "all" || item.priority === priority;
    return matchSearch && matchPriority;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
        <button className="bg-blue-600 text-white px-5 py-2 rounded-xl">
          Create Announcement
        </button>
      </div>

      <SearchFilterCard
        search={search}
        setSearch={setSearch}
        priority={priority}
        setPriority={setPriority}
      />

      {filteredData.map((item) => (
        <AnnouncementCard key={item.id} data={item} />
      ))}
    </div>
  );
}
