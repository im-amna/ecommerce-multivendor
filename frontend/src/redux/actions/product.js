import axios from "axios";
import { server } from "../../server";

// ==========================================
// CREATE PRODUCT
// ==========================================
export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch({
      type: "productCreateRequest",
    });

    const { data } = await axios.post(
      `${server}/product/create-product`,
      productData,
      {
        withCredentials: true,
      }
    );

    console.log("CREATE PRODUCT SUCCESS:", data);

    dispatch({
      type: "productCreateSuccess",
      payload: data.product,
    });
  } catch (error) {
    console.log(
      "CREATE PRODUCT ERROR:",
      error.response?.data || error.message
    );

    dispatch({
      type: "productCreateFail",
      payload:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Product creation failed",
    });
  }
};

// ==========================================
// GET ALL PRODUCTS OF A SHOP
// ==========================================
export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsShopRequest",
    });

    const { data } = await axios.get(
      `${server}/product/get-all-products-shop/${id}`
    );

    console.log("SHOP PRODUCTS API RESPONSE:", data);

    dispatch({
      type: "getAllProductsShopSuccess",
      payload: data.products,
    });
  } catch (error) {
    console.log(
      "GET SHOP PRODUCTS ERROR:",
      error.response?.data || error.message
    );

    dispatch({
      type: "getAllProductsShopFailed",
      payload:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to get shop products",
    });
  }
};

// ==========================================
// DELETE PRODUCT
// ==========================================
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteProductRequest",
    });

    const { data } = await axios.delete(
      `${server}/product/delete-shop-product/${id}`,
      {
        withCredentials: true,
      }
    );

    console.log("DELETE PRODUCT SUCCESS:", data);

    dispatch({
      type: "deleteProductSuccess",
      payload: data.message,
    });

    // Important: return success so component knows delete completed
    return data;
  } catch (error) {
    console.log(
      "DELETE PRODUCT ERROR:",
      error.response?.data || error.message
    );

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Product deletion failed";

    dispatch({
      type: "deleteProductFailed",
      payload: errorMessage,
    });

    // Important: allow component to catch the error
    throw error;
  }
};


// ==========================================
// GET ALL PRODUCTS
// ==========================================
export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsRequest",
    });

    const { data } = await axios.get(
      `${server}/product/get-all-products`
    );

    console.log("ALL PRODUCTS API RESPONSE:", data);

    dispatch({
      type: "getAllProductsSuccess",
      payload: data.products,
    });
  } catch (error) {
    console.log(
      "GET ALL PRODUCTS ERROR:",
      error.response?.data || error.message
    );

    dispatch({
      type: "getAllProductsFailed",
      payload:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to get products",
    });
  }
};
