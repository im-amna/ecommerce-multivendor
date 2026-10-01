
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  deleteEvent,
  getAllEventsShop,
} from "../../redux/actions/event";

import Loader from "../Layout/Loader";

const AllEvents = () => {
  const { events, isLoading } = useSelector(
    (state) => state.events
  );

  const { seller } = useSelector(
    (state) => state.seller
  );

  const dispatch = useDispatch();

  // Get seller events
  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllEventsShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  // Delete event
  const handleDelete = async (id) => {
    if (!id) {
      console.log("Event ID not found!");
      return;
    }

    try {
      await dispatch(deleteEvent(id));

      // Refresh events after delete
      if (seller?._id) {
        dispatch(getAllEventsShop(seller._id));
      }
    } catch (error) {
      console.log(
        "DELETE EVENT ERROR:",
        error?.response?.data || error?.message
      );
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Event Id",
      minWidth: 180,
      flex: 1,
    },

    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },

    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },

    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },

    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 100,
      flex: 0.6,
    },

    // =========================
    // PREVIEW
    // =========================
    {
      field: "preview",
      headerName: "Preview",
      minWidth: 100,
      flex: 0.6,
      sortable: false,

      renderCell: (params) => {
        const eventId = params?.value;

        if (!eventId) {
          return null;
        }

        return (
          <Link to={`/product/${eventId}?isEvent=true`}>
            <Button>
              <AiOutlineEye size={20} />
            </Button>
          </Link>
        );
      },
    },

    // =========================
    // DELETE
    // =========================
    {
      field: "delete",
      headerName: "Delete",
      minWidth: 100,
      flex: 0.6,
      sortable: false,

      renderCell: (params) => {
        const eventId = params?.value;

        if (!eventId) {
          return null;
        }

        return (
          <Button
            onClick={() => handleDelete(eventId)}
          >
            <AiOutlineDelete size={20} />
          </Button>
        );
      },
    },
  ];

  // =========================
  // CREATE ROWS
  // =========================

  const rows =
    events?.map((item) => ({
      id: item._id,

      name: item.name,

      price: "US$ " + item.discountPrice,

      Stock: item.stock,

      sold: item.sold_out || 0,

      // Important:
      // These values are directly used
      // by Preview and Delete buttons.
      preview: item._id,

      delete: item._id,
    })) || [];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </>
  );
};

export default AllEvents;