import React from "react";
import { Link } from "react-router";

const MerchCard = ({
  storeName,
  storeRegion,
  postDate,
  ReviewDate,
  merchId,
  type,
  storeId,
}) => {
  const linkTO = type === "PEN" ? "merch_pending_review/" : "merch_reviewed/";

  return (
    <div className="col-12 col-sm-6 col-md-6 col-xl-3">
      <div className="card">
        <div className="card-body">
          <Link
            to={`${linkTO}${merchId}`}
            state={{ storeName, storeRegion, postDate, ReviewDate }}
          >
            <h5>
              <b>{storeName}</b>
            </h5>
            <p className="text-muted">{storeRegion}</p>
            <p>{!!postDate ? `Posted ${postDate}` : ``}</p>
            <p>{!!ReviewDate ? `Reviewed ${ReviewDate}` : ``}</p>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default MerchCard;
