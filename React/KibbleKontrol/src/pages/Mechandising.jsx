import React, { useEffect, useState, useContext } from "react";
import MerchCard from "../components/Merchandise/MerchCard";
import AuthContext from "../context/authentication/authContext";
import api from "../services/api";
const Merchandising = () => {
  const { user, userRegion } = useContext(AuthContext);

  const [pendingShelves, setPendingShelves] = useState([]);
  const [ReviewedShelves, setReviewedShelves] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDetails = {
          regionSelected: userRegion,
        };

        const Response = await api.get("shelf/manager_view_shelves", {
          params: userDetails,
        });

        if (Response.data.success) {
          const pendingMerchArray = Response.data.pendingMerch;
          const reviwedMerchArray = Response.data.reviwedMerch;

          setPendingShelves([...pendingMerchArray]);
          setReviewedShelves([...reviwedMerchArray]);
        }
      } catch (error) {
        console.log("Failed to get data Error:" + error);
      }
    };

    fetchData();
  }, [userRegion]);

  const OutputPendingCards = () => {
    let merchCards = [];

    for (const element of pendingShelves) {
      const trimmedDate = new Date()
        .toISOString(element.UploadDateTime)
        .split("T")[0];
      merchCards.push(
        <MerchCard
          storeName={element.Store.Name}
          storeRegion={element.Store.Region}
          postDate={trimmedDate}
          merchId={element.Id}
          key={element.Id}
          type="PEN"
        />
      );
    }
    return merchCards;
  };
  const OutputReviewedCards = () => {
    let merchCards = [];

    for (const element of ReviewedShelves) {
      const trimmedDate = new Date(element.UploadDateTime)
        .toISOString()
        .split("T")[0];

      const trimmedReviewDate = new Date(element.ReviewDate)
        .toISOString()
        .split("T")[0];

      merchCards.push(
        <MerchCard
          storeName={element.Store.Name}
          storeRegion={element.Store.Region}
          postDate={trimmedDate}
          ReviewDate={trimmedReviewDate}
          merchId={element.Id}
          key={element.Id}
          type="REV"
        />
      );
    }
    return merchCards;
  };

  return (
    <>
      <div>
        <h3 className="h3">Pending</h3>
        <div className="row">{OutputPendingCards()}</div>
      </div>

      <div>
        <h3 className="h3">Reviewed</h3>
        <div className="row">{OutputReviewedCards()}</div>
      </div>
    </>
  );
};
export default Merchandising;
