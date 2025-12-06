import React from "react";
import FeedbackCard from "./FeedbackCard";

export default function FeedbackList({ data, active }) {
  const filterData =
    active === "all" ? data : data.filter((item) => item.tag === active);

  return (
    <div>
      {filterData.map((fb, index) => (
        <FeedbackCard key={index} {...fb} />
      ))}
    </div>
  );
}
