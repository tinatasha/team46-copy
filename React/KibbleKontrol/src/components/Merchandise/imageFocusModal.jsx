import React, { useEffect, useRef } from "react";

const ImageFocusModal = ({ handleIsOpen, focusState, imgsrc, imgtype }) => {
  const image = useRef();
  const handleOffImageClick = (e) => {
    if (!image.current.contains(e.target)) {
      console.log("i fire");
      handleIsOpen(false);
    }
  };
  const handleKeyPress = (e) => {
    console.log("fire");
    if (e.key === "Escape") {
      handleIsOpen(false);
    }
  };

  useEffect(() => {
    if (focusState) {
      document.addEventListener("mousedown", handleOffImageClick);
      document.addEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keypress", handleKeyPress);
      document.removeEventListener("mousedown", handleOffImageClick);
    };
  }, [focusState]);
  return (
    <div>
      {focusState ? <div className="modal-backdrop fade show"></div> : ""}
      <div
        className={focusState ? "modal show fade" : "modal show"}
        style={focusState ? { display: "block" } : { display: "none" }}
        tabIndex={-1}
        aria-hidden={!focusState}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content  bg-transparent border-0">
            <div className="modal-body d-flex justify-content-center align-items-center ">
              <div
                className="position-relative"
                style={{
                  maxHeight: "90vh",
                  maxWidth: "90vw",
                  minHeight: "600px",
                  minWidth: "600px",
                }}
              >
                <img
                  src={imgsrc}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  alt={imgtype}
                  ref={image}
                />
                <button
                  className="btn-close position-absolute top-0 end-0 m-2"
                  aria-label="close"
                  onClick={() => handleIsOpen(false)}
                ></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageFocusModal;
