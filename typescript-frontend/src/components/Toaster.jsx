import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toaster = ({ type, message, options }) => {

  return toast[type](message, options);
  // </ToastContainer>
};

export default Toaster;
