import React from "react";

const InfoCard = ({ category, value, iconType, iconColor }) => {
  return (
    <div className="col-sm-6 col-md-3">
      <div className="card card-stats card-round">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-icon">
              <div
                className={`icon-big text-center icon-${iconColor} bubble-shadow-small`}
              >
                <i className={iconType}></i>
              </div>
            </div>
            <div className="col col-stats ms-3 ms-sm-0">
              <div className="numbers">
                <p className="card-category">{category}</p>
                <h4 className="card-title">{value}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InfoCard;
