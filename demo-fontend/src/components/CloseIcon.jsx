import React from "react";

const CloseIcon = (props) => {
  return (
    <svg
      onClick={props.onClick}
      class="h-8 w-8 text-gray-600"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      {" "}
      <line x1="18" y1="6" x2="6" y2="18" />{" "}
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
};

export default CloseIcon;
