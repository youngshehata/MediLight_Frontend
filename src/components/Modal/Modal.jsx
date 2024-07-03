import { useRef, useState } from "react";
import { useEffect } from "react";
import "./Modal.css";

const Modal = ({
  yesText,
  noText,
  message,
  title,
  type,
  yesFunction,
  noFunction,
}) => {
  const iconsUrls = { warning: "/warning.svg", info: "/info.svg" };

  const modalContainerRef = useRef();

  const [activeClass, setActiveClass] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setActiveClass(true);
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section className="comp_modal_section_blur flexCenterColumn">
      <article
        ref={modalContainerRef}
        className={
          activeClass
            ? "comp_modal_container flexCenterColumn comp_modal_container_active"
            : "comp_modal_container flexCenterColumn"
        }
      >
        <img
          src="/close.svg"
          alt="close"
          className="comp_modal_closeImg"
          onClick={() => noFunction()}
        />
        <div className="comp_modal_titleBar flexCenterRow">{title}</div>
        <img
          src={type ? iconsUrls[type] : iconsUrls.info}
          alt="Hint"
          className="comp_modal_img"
        />
        <p className="comp_modal_message">{message}</p>
        <div className="comp_modal_buttonsContainer">
          <button
            className="comp_modal_button"
            onClick={() => {
              yesFunction();
            }}
          >
            {yesText}
          </button>
          <button
            className="comp_modal_button comp_modal_button_cancel"
            onClick={() => {
              noFunction();
            }}
          >
            {noText}
          </button>
        </div>
      </article>
    </section>
  );
};

export default Modal;
