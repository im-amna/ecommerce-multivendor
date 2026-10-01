
import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import styles from "../../styles/styles";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "./Ratings";
import axios from "axios";

const ProductDetails = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);

  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!data?._id) return;

    if (data?.shop?._id) {
      dispatch(getAllProductsShop(data.shop._id));
    }

    if (wishlist?.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [data, wishlist, dispatch]);

  // Increase quantity
  const incrementCount = () => {
    setCount((prev) => prev + 1);
  };

  // Decrease quantity
  const decrementCount = () => {
    if (count > 1) {
      setCount((prev) => prev - 1);
    }
  };

  // Remove from wishlist
  const removeFromWishlistHandler = (product) => {
    setClick(false);
    dispatch(removeFromWishlist(product));
  };

  // Add to wishlist
  const addToWishlistHandler = (product) => {
    setClick(true);
    dispatch(addToWishlist(product));
  };

  // Add to cart
  const addToCartHandler = (id) => {
    const isItemExists = cart?.find((i) => i._id === id);

    if (isItemExists) {
      toast.error("Item already in cart!");
      return;
    }

    if (data?.stock < 1) {
      toast.error("Product stock limited!");
      return;
    }

    const cartData = {
      ...data,
      qty: count,
    };

    dispatch(addTocart(cartData));
    toast.success("Item added to cart successfully!");
  };

  // Calculate total reviews
  const totalReviewsLength =
    products?.reduce(
      (acc, product) => acc + (product?.reviews?.length || 0),
      0
    ) || 0;

  // Calculate total ratings
  const totalRatings =
    products?.reduce(
      (acc, product) =>
        acc +
        (product?.reviews || []).reduce(
          (sum, review) => sum + (review?.rating || 0),
          0
        ),
      0
    ) || 0;

  const avg =
    totalReviewsLength > 0 ? totalRatings / totalReviewsLength : 0;

  const averageRating = avg.toFixed(2);

  // =========================
  // SEND MESSAGE TO SELLER
  // =========================
  const handleMessageSubmit = async () => {
    if (!isAuthenticated || !user?._id) {
      toast.error("Please login to message the seller");
      navigate("/login");
      return;
    }

    if (!data?.shop?._id) {
      toast.error("Seller information is not available");
      return;
    }

    try {
      const groupTitle = `${data._id}${user._id}`;
      const userId = user._id;
      const sellerId = data.shop._id;

      const response = await axios.post(
        `${server}/conversation/create-new-conversation`,
        {
          groupTitle,
          userId,
          sellerId,
        },
        {
          withCredentials: true,
        }
      );

      const conversationId = response?.data?.conversation?._id;

      if (!conversationId) {
        toast.error("Unable to create conversation");
        return;
      }

      toast.success("Conversation opened");

      navigate(`/inbox?${conversationId}`);
    } catch (error) {
      console.error("Create conversation error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create conversation"
      );
    }
  };

  return (
    <div className="bg-white">
      {data ? (
        <div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
          <div className="w-full py-5">
            <div className="block w-full 800px:flex">
              {/* ================= IMAGE SECTION ================= */}
              <div className="w-full 800px:w-[50%]">
                <img
                  src={data?.images?.[select]?.url}
                  alt={data?.name || "Product"}
                  className="w-[80%]"
                />

                <div className="w-full flex flex-wrap">
                  {data?.images?.map((image, index) => (
                    <div
                      key={image?._id || index}
                      className={`${
                        select === index ? "border-2 border-black" : ""
                      } cursor-pointer mr-3 mt-3`}
                    >
                      <img
                        src={image?.url}
                        alt={`${data?.name || "Product"} ${index + 1}`}
                        className="h-[100px] w-[100px] object-cover"
                        onClick={() => setSelect(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* ================= PRODUCT INFO ================= */}
              <div className="w-full 800px:w-[50%] pt-5">
                <h1 className={`${styles.productTitle}`}>
                  {data?.name}
                </h1>

                <p className="mt-2">{data?.description}</p>

                {/* Price */}
                <div className="flex pt-3 items-center">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    {data?.discountPrice}$
                  </h4>

                  {data?.originalPrice ? (
                    <h3 className={`${styles.price}`}>
                      {data.originalPrice}$
                    </h3>
                  ) : null}
                </div>

                {/* Quantity + Wishlist */}
                <div className="flex items-center mt-12 justify-between pr-3">
                  <div>
                    <button
                      type="button"
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300"
                      onClick={decrementCount}
                    >
                      -
                    </button>

                    <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                      {count}
                    </span>

                    <button
                      type="button"
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-r px-4 py-2 shadow-lg hover:opacity-75 transition duration-300"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>

                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() =>
                          removeFromWishlistHandler(data)
                        }
                        color="red"
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() =>
                          addToWishlistHandler(data)
                        }
                        color="#333"
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>

                {/* Add to Cart */}
                <button
                  type="button"
                  className={`${styles.button} !mt-6 !rounded !h-11 flex items-center justify-center w-full`}
                  onClick={() => addToCartHandler(data._id)}
                >
                  <span className="text-white flex items-center">
                    Add to cart
                    <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </button>

                {/* ================= SELLER SECTION ================= */}
                <div className="flex flex-col 600px:flex-row items-start 600px:items-center pt-8 gap-4">
                  {/* Seller */}
                  <Link
                    to={`/shop/preview/${data?.shop?._id}`}
                    className="flex items-center"
                  >
                    <img
                      src={data?.shop?.avatar?.url}
                      alt={data?.shop?.name || "Seller"}
                      className="w-[50px] h-[50px] rounded-full mr-2 object-cover"
                    />

                    <div className="pr-4">
                      <h3 className={`${styles.shop_name} pb-1 pt-1`}>
                        {data?.shop?.name}
                      </h3>

                      <h5 className="text-[15px]">
                        ({averageRating}/5) Ratings
                      </h5>
                    </div>
                  </Link>

                  {/* SEND MESSAGE BUTTON */}
                  <button
                    type="button"
                    onClick={handleMessageSubmit}
                    className="bg-[#6443d1] hover:bg-[#5234b5] text-white px-5 py-3 rounded flex items-center justify-center cursor-pointer transition duration-200"
                  >
                    Send Message
                    <AiOutlineMessage
                      className="ml-2"
                      size={20}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ProductDetailsInfo
            data={data}
            products={products}
            totalReviewsLength={totalReviewsLength}
            averageRating={averageRating}
          />

          <br />
          <br />
        </div>
      ) : null}
    </div>
  );
};

/* =========================================================
   PRODUCT DETAILS INFORMATION
========================================================= */

const ProductDetailsInfo = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
}) => {
  const [active, setActive] = useState(1);

  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded">
      {/* Tabs */}
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        {/* Product Details */}
        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(1)}
          >
            Product Details
          </h5>

          {active === 1 && (
            <div className={`${styles.active_indicator}`} />
          )}
        </div>

        {/* Reviews */}
        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(2)}
          >
            Product Reviews
          </h5>

          {active === 2 && (
            <div className={`${styles.active_indicator}`} />
          )}
        </div>

        {/* Seller Information */}
        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(3)}
          >
            Seller Information
          </h5>

          {active === 3 && (
            <div className={`${styles.active_indicator}`} />
          )}
        </div>
      </div>

      {/* ================= PRODUCT DETAILS ================= */}
      {active === 1 && (
        <div>
          <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">
            {data?.description}
          </p>
        </div>
      )}

      {/* ================= REVIEWS ================= */}
      {active === 2 && (
        <div className="w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-scroll">
          {data?.reviews?.map((item, index) => (
            <div
              key={item?._id || index}
              className="w-full flex my-2"
            >
              <img
                src={item?.user?.avatar?.url}
                alt={item?.user?.name || "User"}
                className="w-[50px] h-[50px] rounded-full object-cover"
              />

              <div className="pl-2">
                <div className="w-full flex items-center">
                  <h1 className="font-[500] mr-3">
                    {item?.user?.name}
                  </h1>

                  <Ratings rating={item?.rating || 0} />
                </div>

                <p>{item?.comment}</p>
              </div>
            </div>
          ))}

          {(!data?.reviews || data.reviews.length === 0) && (
            <h5>No Reviews for this product!</h5>
          )}
        </div>
      )}

      {/* ================= SELLER INFORMATION ================= */}
      {active === 3 && (
        <div className="w-full block 800px:flex p-5">
          <div className="w-full 800px:w-[50%]">
            <Link to={`/shop/preview/${data?.shop?._id}`}>
              <div className="flex items-center">
                <img
                  src={data?.shop?.avatar?.url}
                  className="w-[50px] h-[50px] rounded-full object-cover"
                  alt={data?.shop?.name || "Seller"}
                />

                <div className="pl-3">
                  <h3 className={`${styles.shop_name}`}>
                    {data?.shop?.name}
                  </h3>

                  <h5 className="pb-2 text-[15px]">
                    ({averageRating}/5) Ratings
                  </h5>
                </div>
              </div>
            </Link>

            <p className="pt-2">
              {data?.shop?.description}
            </p>
          </div>

          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
            <div className="text-left">
              <h5 className="font-[600]">
                Joined on:{" "}
                <span className="font-[500]">
                  {data?.shop?.createdAt?.slice(0, 10)}
                </span>
              </h5>

              <h5 className="font-[600] pt-3">
                Total Products:{" "}
                <span className="font-[500]">
                  {products?.length || 0}
                </span>
              </h5>

              <h5 className="font-[600] pt-3">
                Total Reviews:{" "}
                <span className="font-[500]">
                  {totalReviewsLength}
                </span>
              </h5>

              <Link to={`/shop/preview/${data?.shop?._id}`}>
                <div
                  className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}
                >
                  <h4 className="text-white">Visit Shop</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
