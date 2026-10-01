import React from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import EventCard from "./EventCard";

const Events = () => {
  const { allEvents, isLoading } = useSelector(
    (state) => state.events
  );

  // Make sure events is always treated as an array
  const events = Array.isArray(allEvents) ? allEvents : [];

  return (
    <div>
      {!isLoading && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading}`}>
            <h1>Popular Events</h1>
          </div>

          <div className="w-full grid">
            {events.length > 0 ? (
              <EventCard
                data={events[0]}
              />
            ) : (
              <h4 className="text-center text-gray-500 py-5">
                No Events have been added yet!
              </h4>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
