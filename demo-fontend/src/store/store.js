import { configureStore } from "@reduxjs/toolkit";
import loginReducer from './reducers/loginReducer'
import forgotPasswordReducer from "./reducers/forgotPasswordReducer";

const store = configureStore({
  reducer: {
    loginStore : loginReducer,
    forgotPasswordStore: forgotPasswordReducer,
  }
});

export default store;

