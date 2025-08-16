import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router";
import PointsSlider from "../components/Merchandise/PointsSlider";
import MerchImage from "../components/Merchandise/MerchImage";
import api from "../services/api";
import MerchCategory from "../components/Merchandise/merchCategory";
import ShowAlert from "../components/alertModal";

const PendingMerchandise = () => {
  const location = useLocation();
  const { merchId } = useParams();
  const navigation = useNavigate();
  //image array data
  const [pendingPowerWingData, setPowerWingData] = useState([]);
  const [pendingClipStripData, setClipStripData] = useState([]);
  const [pendingFullDropData, setFullDropData] = useState([]);
  const [pendingIslandData, setIslandData] = useState([]);
  const [pendingBinData, setBinData] = useState([]);

  //point assignment
  const [pwPointValue, setPWPointValue] = useState(0);
  const [csPointValue, setCSPointValue] = useState(0);
  const [isPointValue, setISPointValue] = useState(0);
  const [fdPointValue, setFDPointValue] = useState(0);
  const [bnPointValue, setBNPointValue] = useState(0);

  //Feedback Assignment
  const [pwFeedback, setPwFeedback] = useState("");
  const [csFeedback, setCsFeedback] = useState("");
  const [isFeedback, setIsFeedback] = useState("");
  const [fdFeedback, setFdFeedback] = useState("");
  const [bnFeedback, setBnFeedback] = useState("");

  const { storeName, storeRegion, postedDate, reviewDate } =
    location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `shelf/get_Merch_Pics_Pending/${merchId}`
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
        }
      } catch (error) {
        console.error("error occured", error);
      }
    };

    fetchData();
  }, []);

  const handleFeedbackSubmit = async () => {
    try {
      const sendData = {
        merchId: merchId,
        PW: {
          Score: pwPointValue,
          feedback: pwFeedback,
          category: "Power-Wing",
          isNotNull: !!pendingPowerWingData.length,
        },
        CS: {
          Score: csPointValue,
          feedback: csFeedback,
          category: "Clip-Strip",
          isNotNull: !!pendingClipStripData.length,
        },
        FD: {
          Score: fdPointValue,
          feedback: fdFeedback,
          category: "Full-Drop",
          isNotNull: !!pendingFullDropData.length,
        },
        IS: {
          Score: isPointValue,
          feedback: isFeedback,
          category: "Island",
          isNotNull: !!pendingIslandData.length,
        },
        BN: {
          Score: bnPointValue,
          feedback: bnFeedback,
          category: "Bin",
          isNotNull: !!pendingBinData.length,
        },
      };

      const response = await api.put("shelf/assign_merch_Feedback", sendData);

      if (response.data.success) {
        ShowAlert(
          "success",
          "Feedback Succesfully Submitted",
          "Merchandise Feedback",
          navigation
        );
      } else if (!response.data.success) {
        ShowAlert("error", "Try Again Later", "Merchandise Feedback");
      }
    } catch (error) {
      ShowAlert("error", "Try Again Later", "Merchandise Feedback");
      console.error("Error submitting feedback", error);
    }
  };

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
                  imageData={pendingPowerWingData}
                  CategoryName={"Power Wing"}
                  feedback={pwFeedback}
                  setFeedback={setPwFeedback}
                />
                <MerchCategory
                  pointValue={csPointValue}
                  setPointValue={setCSPointValue}
                  imageData={pendingClipStripData}
                  CategoryName={"Clip Strips"}
                  feedback={csFeedback}
                  setFeedback={setCsFeedback}
                />
                <MerchCategory
                  pointValue={fdPointValue}
                  setPointValue={setFDPointValue}
                  imageData={pendingFullDropData}
                  CategoryName={"Full Drop"}
                  feedback={fdFeedback}
                  setFeedback={setFdFeedback}
                />
                <MerchCategory
                  pointValue={isPointValue}
                  setPointValue={setISPointValue}
                  imageData={pendingIslandData}
                  CategoryName={"Island"}
                  feedback={isFeedback}
                  setFeedback={setIsFeedback}
                />
                <MerchCategory
                  pointValue={bnPointValue}
                  setPointValue={setBNPointValue}
                  imageData={pendingBinData}
                  CategoryName={"Bins"}
                  feedback={bnFeedback}
                  setFeedback={setBnFeedback}
                />

                <div className="form-group">
                  <div className="row align-items-center">
                    <div className="text-end">
                      <button
                        className="btn btn-black"
                        onClick={handleFeedbackSubmit}
                      >
                        Submit
                      </button>
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
export default PendingMerchandise;
