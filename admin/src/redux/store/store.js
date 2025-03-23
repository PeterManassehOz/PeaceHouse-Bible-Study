import { configureStore } from "@reduxjs/toolkit";
import { adminStudyAuthApi } from "../adminStudyAuthApi/adminStudyAuthApi";
import adminAuthApi from "../adminAuthApi/adminAuthApi";

const store = configureStore({
  reducer: {
    [adminStudyAuthApi.reducerPath]: adminStudyAuthApi.reducer,
    [adminAuthApi.reducerPath]: adminAuthApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminStudyAuthApi.middleware, adminAuthApi.middleware),
});

export default store;