import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./reducers/loginReducer";
import forgotPasswordReducer from "./reducers/forgotPasswordReducer";
// ...

export const store = configureStore({
  reducer: {
    loginStore: loginReducer,
    forgotPasswordStore: forgotPasswordReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
