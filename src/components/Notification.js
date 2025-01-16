import React, { useEffect, useState } from "react";
import "./Notification.css";

const Notification = ({ visible, message, type, onClose }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (visible) {
      setFade(true);
    } else {
      const timer = setTimeout(() => {
        setFade(false);
      }, 300); // Wait for the exit animation to complete
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible && !fade) return null;

  return (
    <div
      className={`fixed top-0 right-0 m-4 p-4 rounded-lg shadow-lg text-white ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } notification ${
        fade ? "notification-enter-active" : "notification-exit-active"
      }`}
    >
      <p className="pr-6 ">{message}</p>
      <button
        onClick={onClose}
        className={`absolute top-0 right-0 p-2 mt-1  rounded-full bg-transparent text-white ${
          type == "success" ? "hover:bg-green-300" : "hover:bg-red-300"
        }  transition-colors duration-200 focus:outline-none`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default Notification;
