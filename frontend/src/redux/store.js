import { configureStore } from "@reduxjs/toolkit";

import { userReducer } from "./reducers/user";
import { productReducer } from "./reducers/product";
import { eventReducer } from "./reducers/event";
import { sellerReducer } from "./reducers/seller";
import { orderReducer } from "./reducers/order";
import { wishlistReducer } from "./reducers/wishlist";
import { cartReducer } from "./reducers/cart";

const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    events: eventReducer,
    seller: sellerReducer,
    order: orderReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
  },
});

export default store;
