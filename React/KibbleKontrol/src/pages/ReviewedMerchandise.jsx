import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigation } from "react-router";
import api from "../services/api";
import MerchCategory from "../components/Merchandise/merchCategory";
import MerchImage from "../components/Merchandise/MerchImage";
const ReviewedMerchandise = () => {
  const location = useLocation();
  const { merchId } = useParams();

  //image array data
  const [pendingPowerWingData, setPowerWingData] = useState([]);
  const [pendingClipStripData, setClipStripData] = useState([]);
  const [pendingFullDropData, setFullDropData] = useState([]);
  const [pendingIslandData, setIslandData] = useState([]);
  const [pendingBinData, setBinData] = useState([]);

  //points data
  const [pwPointValue, setPWPointValue] = useState(0);
  const [csPointValue, setCSPointValue] = useState(0);
  const [isPointValue, setISPointValue] = useState(0);
  const [fdPointValue, setFDPointValue] = useState(0);
  const [bnPointValue, setBNPointValue] = useState(0);

  //Feedback Data
  //Feedback Assignment
  const [pwFeedback, setPwFeedback] = useState("");
  const [csFeedback, setCsFeedback] = useState("");
  const [isFeedback, setIsFeedback] = useState("");
  const [fdFeedback, setFdFeedback] = useState("");
  const [bnFeedback, setBnFeedback] = useState("");

  const [editMode, setEditMode] = useState(false);
  const { storeName, storeRegion, postedDate, reviewDate } =
    location.state || {};
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `shelf/get_Merch_Pics_Reviewed/${merchId}`
        );

        if (response.data.success) {
          const pwArray = response.data.Power_Wings || [];
          const csArray = response.data.Clip_Strips || [];
          const fdArray = response.data.Full_Drop || [];
          const isArray = response.data.Islands || [];
          const bnArray = response.data.Bins || [];

          setPowerWingData([...pwArray]);
          setClipStripData([...csArray]);
          setFullDropData([...fdArray]);
          setIslandData([...isArray]);
          setBinData([...bnArray]);

          console.log(response.data);

          if (pwArray.length <= 0) {
            setPWPointValue(0);
          } else {
            setPWPointValue(pwArray[0].picPoints);
            setPwFeedback(pwArray[0].picFeedback);
          }

          if (csArray.length <= 0) {
            setCSPointValue(0);
          } else {
            setCSPointValue(csArray[0].picPoints);
            setCsFeedback(csArray[0].picFeedback);
          }

          if (fdArray.length <= 0) {
            setFDPointValue(0);
          } else {
            setFDPointValue(fdArray[0].picPoints);
            setFdFeedback(fdArray[0].picFeedback);
          }

          if (isArray.length <= 0) {
            setISPointValue(0);
          } else {
            setISPointValue(isArray[0].picPoints);
            setIsFeedback(isArray[0].picFeedback);
          }

          if (bnArray.length <= 0) {
            setBNPointValue(0);
          } else {
            setBNPointValue(bnArray[0].picPoints);
            setBnFeedback(bnArray[0].picFeedback);
          }
        } else {
          console.error("failed getting data", error);
        }
      } catch (error) {
        console.error("error occured getting data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-header d-flex justify-content-center">
            <h4 className="card-title ">{storeName}</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-12 col-lg-12">
                <MerchCategory
                  pointValue={pwPointValue}
                  setPointValue={setPWPointValue}
                  feedback={pwFeedback}
                  imageData={pendingPowerWingData}
                  readOnly={!editMode}
                  CategoryName={"Power Wing"}
                />
                <MerchCategory
                  pointValue={csPointValue}
                  setPointValue={setCSPointValue}
                  feedback={csFeedback}
                  imageData={pendingClipStripData}
                  readOnly={!editMode}
                  CategoryName={"Clip Strips"}
                />
                <MerchCategory
                  pointValue={fdPointValue}
                  setPointValue={setFDPointValue}
                  feedback={fdFeedback}
                  imageData={pendingFullDropData}
                  readOnly={!editMode}
                  CategoryName={"Full Drop"}
                />
                <MerchCategory
                  pointValue={isPointValue}
                  setPointValue={setISPointValue}
                  feedback={isFeedback}
                  imageData={pendingIslandData}
                  readOnly={!editMode}
                  CategoryName={"Island"}
                />
                <MerchCategory
                  pointValue={bnPointValue}
                  setPointValue={setBNPointValue}
                  feedback={bnFeedback}
                  imageData={pendingBinData}
                  readOnly={!editMode}
                  CategoryName={"Bins"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReviewedMerchandise;
