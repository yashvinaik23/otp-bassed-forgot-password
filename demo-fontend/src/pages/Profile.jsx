import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../Actions/action";
import EmailIcon from "../components/emailIcon";
import PhoneIcon from "../components/phoneIcon";
import ProfileImage from "../components/profile";

const Profile = (props) => {
  const dispatch = useDispatch();
  const logoutHandler = (event) => {
    event?.preventDefault();
    dispatch(logoutUser());
  };

  const { user } = useSelector((state) => state.loginStore);

  return (
    <div className="max-w-4xl flex items-center h-auto lg:h-screen flex-wrap mx-auto my-32 lg:my-0">
      <div
        id="profile"
        className="w-full rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-white opacity-75 mx-6 lg:mx-0"
      >
        <div className="p-4 md:p-12 text-center lg:text-left">
          {!!user.image_path ? (
            <img
              src={user.image_path}
              alt={"user"}
              className="block rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center"
            />
          ) : (
            <ProfileImage />
          )}
          <h1 className="text-3xl font-bold pt-8 lg:pt-0">{`${user.name}  ${user.last_name}`}</h1>
          <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-blue-500 opacity-25"></div>
          <p className="pt-4 text-base font-bold flex items-center justify-center lg:justify-start">
            <div className="mr-2.5">
              <EmailIcon className="mr-5" />
            </div>
            {user.email ? user.email : "Not applicable"}
          </p>
          <p className="pt-2 font-bold text-gray-600 text-xs lg:text-sm flex items-center justify-center lg:justify-start">
            <div className="mr-2.5">
              <PhoneIcon />
            </div>
            {user?.contact?.length && user?.contact?.length < 13
              ? user.contact
              : "Not applicable"}
          </p>

          <div className="flex justify-evenly pt-12 pb-8">
            <button
              onClick={logoutHandler}
              className="bg-blue-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
