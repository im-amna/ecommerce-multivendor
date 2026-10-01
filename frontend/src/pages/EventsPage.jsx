import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";

const EventsPage = () => {
const { allEvents, isLoading } = useSelector(
(state) => state.events
);

return (
<>
{isLoading ? ( <Loader />
) : ( <div> <Header activeHeading={4} />

```
      <div className="w-11/12 mx-auto py-8">
        {allEvents && allEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allEvents.map((event) => (
              <EventCard
                key={event._id}
                active={true}
                data={event}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold">
              No events available
            </h2>
            <p className="text-gray-500 mt-2">
              There are currently no events to display.
            </p>
          </div>
        )}
      </div>
    </div>
  )}
</>

);
};

export default EventsPage;
