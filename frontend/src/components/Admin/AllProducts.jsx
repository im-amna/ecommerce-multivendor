
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getAllProductsShop,
  deleteProduct,
} from "../../redux/actions/product";
import Loader from "../Layout/Loader";
import { toast } from "react-toastify";

const AllProducts = () => {
  const { products, isLoading } = useSelector(
    (state) => state.products
  );

  const { seller } = useSelector(
    (state) => state.seller
  );

  const dispatch = useDispatch();

  // Load seller products
  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  // Delete product
  const handleDelete = async (id) => {
    if (!id) {
      toast.error("Product ID not found!");
      return;
    }

    try {
      await dispatch(deleteProduct(id));

      toast.success("Product deleted successfully!");

      if (seller?._id) {
        dispatch(getAllProductsShop(seller._id));
      }
    } catch (error) {
      console.log(
        "DELETE ERROR:",
        error?.response?.data || error?.message
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Product Id",
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
      flex: 0.7,
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
    // PREVIEW BUTTON
    // =========================
    {
      field: "preview",
      headerName: "Preview",
      minWidth: 100,
      flex: 0.6,
      sortable: false,

      renderCell: (params) => {
        const productId = params?.value;

        if (!productId) {
          return null;
        }

        return (
          <Link to={`/product/${productId}`}>
            <Button>
              <AiOutlineEye size={22} />
            </Button>
          </Link>
        );
      },
    },

    // =========================
    // DELETE BUTTON
    // =========================
    {
      field: "delete",
      headerName: "Delete",
      minWidth: 100,
      flex: 0.6,
      sortable: false,

      renderCell: (params) => {
        const productId = params?.value;

        if (!productId) {
          return null;
        }

        return (
          <Button
            onClick={() => handleDelete(productId)}
          >
            <AiOutlineDelete size={22} />
          </Button>
        );
      },
    },
  ];

  // Create DataGrid rows
  const rows =
    products?.map((item) => ({
      id: item._id,

      name: item.name,

      price: "US$ " + item.discountPrice,

      Stock: item.stock,

      sold: item.sold_out || 0,

      // IMPORTANT
      // These values are directly used by
      // Preview/Delete renderCell
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

export default AllProducts;
