import { useEffect, useRef, useState } from "react";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

const DateRangeSelection = ({ range, onRangeChagne }) => {
  const [openModal, setOpenModal] = useState(false);
  const modalRef = useRef();

  const selectedRange = range
    ? `${range?.from.toLocaleDateString()}-${
        range?.to.toLocaleDateString() || "..."
      }`
    : "Select a Date Range";

  const handleOffCalendarClick = (e) => {
    if (!modalRef.current.contains(e.target)) {
      setOpenModal(false);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Escape") {
      setOpenModal(false);
    }
  };

  useEffect(() => {
    if (!openModal) {
      return;
    }
    if (openModal) {
      document.body.addEventListener("mousedown", handleOffCalendarClick);
      document.body.addEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.removeEventListener("mousedown", handleOffCalendarClick);
      document.body.removeEventListener("keydown", handleKeyPress);
    };
  }, [openModal]);

  const rangeInfo = range
    ? `Selected from ${range?.from?.toLocaleDateString() || "-"} to ${
        range?.to?.toLocaleDateString() || "-"
      }`
    : "Select a start Date";
  const footer = (
    <div className="row">
      <div
        className="col d-flex align-items-center"
        style={{ minWidth: "285px" }}
      >
        <div className="input-group">{rangeInfo}</div>
      </div>
      <div className="col-auto">
        <div className="input-group">
          <span
            className="input-group-text bg-dark border-end-0 text-light"
            onClick={() => onRangeChagne(null)}
          >
            Clear Selection
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dataTables_length">
      <div className="input-group">
        <span className="input-group-text bg-light border-end-0">
          Open Calendar
        </span>
        <input
          type="text"
          className="form-control text-dark "
          readOnly={true}
          value={selectedRange}
          onClick={() => setOpenModal(!openModal)}
        />
      </div>

      {openModal ? (
        <div>
          <div className="modal-backdrop fade show"></div>
          <div
            className={openModal ? "modal show fade" : "modal show"}
            style={{ display: "block" }}
            tabIndex={-1}
            aria-hidden={!openModal}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content   border-0" ref={modalRef}>
                <div className="modal-body d-flex justify-content-center align-items-center ">
                  <DayPicker
                    animate={true}
                    mode="range"
                    selected={range}
                    onSelect={onRangeChagne}
                    captionLayout="dropdown"
                    footer={footer}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
export default DateRangeSelection;
