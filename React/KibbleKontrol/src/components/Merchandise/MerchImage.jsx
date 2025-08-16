import React, { useState } from "react";
import ImageFocusModal from "./imageFocusModal";

const MerchImage = ({ imgSrc, imgType, imgId }) => {
  const [imgDisplayOpen, setImgDisplayOpen] = useState(false);

  return (
    <div className="col-md-3 d-flex gap-2">
      <div className="imagecheck" onClick={() => setImgDisplayOpen(true)}>
        <img
          src={imgSrc}
          alt={imgType}
          className="imagecheck-image img-fluid"
        />
      </div>

      <ImageFocusModal
        handleIsOpen={setImgDisplayOpen}
        focusState={imgDisplayOpen}
        imgsrc={imgSrc}
        imgtype={imgType}
        key={"Modal" + imgId}
      />
    </div>
  );
};
export default MerchImage;
