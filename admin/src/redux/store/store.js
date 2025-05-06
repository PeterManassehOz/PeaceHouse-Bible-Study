import { configureStore } from "@reduxjs/toolkit";
import { adminStudyAuthApi } from "../adminStudyAuthApi/adminStudyAuthApi";
import adminAuthApi from "../adminAuthApi/adminAuthApi";
import { newsLetterAuthApi } from "../adminNewsletterAuthApi/adminNewsletterAuthApi";

const store = configureStore({
  reducer: {
    [adminStudyAuthApi.reducerPath]: adminStudyAuthApi.reducer,
    [adminAuthApi.reducerPath]: adminAuthApi.reducer,
    [newsLetterAuthApi.reducerPath]: newsLetterAuthApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminStudyAuthApi.middleware, adminAuthApi.middleware, newsLetterAuthApi.middleware),
});

export default store;