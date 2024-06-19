import { useRef } from "react";
import classes from "./TopNavbar.module.css";
import TopNavbarOptionsSection from "./TopNavbarOptionsSection/TopNavbarOptionsSection";
import { useNavigate } from "react-router-dom";

export default function TopNavbar() {
  const navigate = useNavigate();

  const togglerRef = useRef(null);

  const toggleFunction = () => {
    togglerRef.current.classList.toggle(`${classes.togglerActive}`);
  };

  return (
    <div className={`${classes.navbar}`}>
      <div
        onClick={() => {
          toggleFunction();
        }}
        ref={togglerRef}
        className={`${classes.toggler} flexCenterColumn`}
      >
        <span className={`${classes.spanOne}`}></span>
        <span className={`${classes.spanTwo}`}></span>
        <span className={`${classes.spanThree}`}></span>
      </div>
      <div className={`${classes.logoSection}`}>
        <img
          onClick={() => {
            navigate("/medilight");
          }}
          className={`${classes.logoImg}`}
          src="/logoTrans.svg"
          alt="Medilight Logo"
        />
      </div>
      <TopNavbarOptionsSection />
    </div>
  );
}
