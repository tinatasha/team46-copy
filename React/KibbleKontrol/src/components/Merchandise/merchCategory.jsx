import MerchImage from "./MerchImage";
import PointsSlider from "./PointsSlider";
import Rating from "@mui/material/Rating";
const MerchCategory = ({
  pointValue,
  pointCount,
  setPointValue,
  imageData,
  CategoryName,
  readOnly,
  feedback,
  setFeedback,
}) => {
  const displayImages = (arr) => {
    let merchImages = [];

    for (const element of arr) {
      merchImages.push(
        <MerchImage
          imgSrc={element.picPath}
          imgType={element.picType}
          imgId={element.picID}
          key={element.picID}
        />
      );
    }
    return merchImages;
  };
  if (imageData.length <= 0) {
    return;
  }
  return (
    <div className="form-group">
      <div className="row align-items-end">
        <div className="col-sm-12 col-md-2">
          <h4 className="h4">
            <b>{CategoryName}</b>
          </h4>

          <div className="form-group" style={{ marginTop: "60%" }}>
            <div style={{ fontSize: "40px" }}>
              {/** **/}
              <Rating
                name={CategoryName}
                defaultValue={pointValue}
                value={pointValue}
                precision={0.5}
                readOnly={readOnly}
                className="start-rating-size"
                onChange={(event, value) => {
                  setPointValue(value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="row">
            {displayImages(imageData)}
            {displayImages(imageData)}
          </div>
        </div>
        <div className="col-md-4">
          <textarea
            className="form-control"
            style={{
              border: "2px solid",
              resize: "none",

              fontSize: "28px",
            }}
            value={feedback}
            rows={4}
            readOnly={readOnly}
            onChange={(e) => {
              setFeedback(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default MerchCategory;
