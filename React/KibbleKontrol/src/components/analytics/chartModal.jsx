import React, { useEffect, useRef } from "react";

const ChartModal = ({ handleIsOpen, isOpen, chart, chartFilters }) => {
  const chartModal = useRef();
  const handleOffImageClick = (e) => {
    if (!chartModal.current.contains(e.target)) {
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
    if (isOpen) {
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
  }, [isOpen]);
  return (
    <div>
      {isOpen ? <div className="modal-backdrop fade show"></div> : ""}
      <div
        className={isOpen ? "modal show fade" : "modal show"}
        style={isOpen ? { display: "block" } : { display: "none" }}
        tabIndex={-1}
        aria-hidden={!isOpen}
      >
        <div className="modal-dialog modal-dialog-centered chart-modal-view ">
          <div className="modal-content border-solid">
            <div className="modal-body">
              <div className="card-body">
                <div className="row">
                  <div>{chartFilters}</div>

                  <button
                    className="btn-close position-absolute top-0 end-0 m-2"
                    aria-label="close"
                    onClick={() => handleIsOpen(false)}
                  ></button>

                  <div className="row">
                    <div
                      className="chart-container"
                      style={{ minHeight: "60vh" }}
                    >
                      {chart}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartModal;
