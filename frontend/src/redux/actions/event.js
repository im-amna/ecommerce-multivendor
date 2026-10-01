import axios from "axios";
import { server } from "../../server";

// ======================================================
// CREATE EVENT
// ======================================================
export const createevent = (data) => async (dispatch) => {
try {
dispatch({
type: "eventCreateRequest",
});

const { data: responseData } = await axios.post(
  `${server}/event/create-event`,
  data,
  {
    withCredentials: true,
  }
);

dispatch({
  type: "eventCreateSuccess",
  payload: responseData.event,
});


} catch (error) {
dispatch({
type: "eventCreateFail",
payload:
error.response?.data?.message ||
error.message ||
"Event creation failed",
});
}
};

// ======================================================
// GET ALL EVENTS OF A SHOP
// ======================================================
export const getAllEventsShop = (id) => async (dispatch) => {
try {
dispatch({
type: "getAlleventsShopRequest",
});

const { data } = await axios.get(
  `${server}/event/get-all-events/${id}`
);

dispatch({
  type: "getAlleventsShopSuccess",
  payload: data.events,
});

} catch (error) {
dispatch({
type: "getAlleventsShopFailed",
payload:
error.response?.data?.message ||
error.message ||
"Unable to get shop events",
});
}
};

// ======================================================
// DELETE EVENT OF A SHOP
// ======================================================
export const deleteEvent = (id) => async (dispatch) => {
try {
dispatch({
type: "deleteeventRequest",
});

const { data } = await axios.delete(
  `${server}/event/delete-shop-event/${id}`,
  {
    withCredentials: true,
  }
);

dispatch({
  type: "deleteeventSuccess",
  payload: data.message,
});


} catch (error) {
dispatch({
type: "deleteeventFailed",
payload:
error.response?.data?.message ||
error.message ||
"Unable to delete event",
});
}
};

// ======================================================
// GET ALL EVENTS
// ======================================================
export const getAllEvents = () => async (dispatch) => {
try {
dispatch({
type: "getAlleventsRequest",
});

const { data } = await axios.get(
  `${server}/event/get-all-events`
);

dispatch({
  type: "getAlleventsSuccess",
  payload: data.events,
});

} catch (error) {
dispatch({
type: "getAlleventsFailed",
payload:
error.response?.data?.message ||
error.message ||
"Unable to get events",
});
}
};
