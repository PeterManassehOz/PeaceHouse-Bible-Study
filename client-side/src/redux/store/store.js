import { configureStore } from '@reduxjs/toolkit';
import { userAuthApi } from '../userAuthApi/userAuthApi';
import profileAuthApi from '../profileAuthApi/profileAuthApi';
import { studyAuthApi } from '../studyAuthApi/studyAuthApi';
import { newsLetterAuthApi } from '../newsLetterAuthApi/newsLetterAuthApi';

const store = configureStore({
  reducer: {
    [userAuthApi.reducerPath]: userAuthApi.reducer,
    [profileAuthApi.reducerPath]: profileAuthApi.reducer,
    [studyAuthApi.reducerPath]: studyAuthApi.reducer,
    [newsLetterAuthApi.reducerPath]: newsLetterAuthApi.reducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userAuthApi.middleware, profileAuthApi.middleware, studyAuthApi.middleware, newsLetterAuthApi.middleware),
});

export default store;
