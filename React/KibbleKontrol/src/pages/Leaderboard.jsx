import { useContext, useEffect, useState } from "react";
import api from "../services/api";
import AuthContext from "../context/authentication/authContext";
import { useDebouncer } from "../custom hooks/useDebouncer";
import TablePagination from "../components/tables/tablePagination";
import Table from "../components/analytics/table";

const sizes = ["Small", "Medium", "Large"];

const LeaderboardPage = () => {
  const { user, userRegion } = useContext(AuthContext);

  const [boardData, setBoardData] = useState([]);

  const [phrase, setPhrase] = useState("");
  const debouncesSearch = useDebouncer(phrase, 500); //set time to 500ms by default (half a second)
  const [selectedSize, setSelectedSize] = useState(sizes[1]);
  const [topXStoreIds, setTopXStoreIds] = useState([]);

  //number of entries
  const Limit = 5; //at max we want 30 entries per table page
  const [limitUnderFlow, setLimitUnderFlow] = useState(Limit); //if we get back less entries than the limit change this to that value
  const [currpage, setCurrPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const params = { limit: Limit, page: currpage };

        if (debouncesSearch) {
          setCurrPage(1);
          params.searchPhrase = debouncesSearch;
        }

        const response = await api.get(
          `/leaderboard/size/${selectedSize}/region/${userRegion}`,
          {
            params,
          }
        );
        if (response.data.success === true) {
          const arrLeaderboard = [...response.data.StoreRanks];

          //we no longer run sort as data should come back in sorted form from first to last

          setBoardData(arrLeaderboard);
          setTotalRecords(response.data.totalStoreCount);
          setTopXStoreIds([...response.data.topXStoreIds]);

          console.log(response.data.topXStoreIds);

          //if the length of the board is under the limit we know we lacking
          //can never be greater tan the limit for obvious reasons

          if (arrLeaderboard.length < Limit) {
            setLimitUnderFlow(arrLeaderboard.length * currpage);
          } else {
            const offset = Limit * currpage;

            setLimitUnderFlow(offset);
          }
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };

    fetchLeaderboard();
  }, [currpage, selectedSize, debouncesSearch, userRegion]);

  useEffect(() => {
    //set the number of entries on the page

    setPageCount(Math.ceil(totalRecords / Limit));
  }, [totalRecords]);

  const updateCurrentPage = (pageNumber) => {
    setCurrPage(pageNumber);
  };

  const renderTableEntries = () => {
    let arrEntries = [];

    const goldMedal = (
      <i
        className="fas fa-medal"
        style={{ color: "gold", fontSize: "30px" }}
      ></i>
    );
    const silverMedal = (
      <i
        className="fas fa-medal"
        style={{ color: "silver", fontSize: "30px" }}
      ></i>
    );

    const bronzeMedal = (
      <i
        className="fas fa-medal"
        style={{ color: "#CD7F32", fontSize: "30px" }}
      ></i>
    );

    arrEntries = boardData.map((entry) => {
      let posToSet = entry.storePosition;
      if (posToSet <= 3) {
        if (posToSet === 1) {
          posToSet = goldMedal;
        }
        if (posToSet === 2) {
          posToSet = silverMedal;
        }
        if (posToSet === 3) {
          posToSet = bronzeMedal;
        }
      }

      return (
        <tr key={entry.Store_Id}>
          <td>{posToSet}</td>
          <td>{entry?.storeName ?? "Unknown"}</td>
          <td>{parseFloat(entry.storeSalesScore).toFixed(2)}</td>
          <td>{parseFloat(entry.storeMerchScore).toFixed(2)}</td>
          <td>{parseFloat(entry.storeTotalScore).toFixed(2)}</td>
        </tr>
      );
    });

    return arrEntries;
  };
  const renderFilters = () => {
    return (
      <div className="d-flex-row justify-content-between">
        <div className="dataTables_length ">
          <label>
            Store Size
            <select
              className="form-control form-control-sm"
              value={selectedSize}
              onChange={(prev) => setSelectedSize(prev.target.value)}
            >
              <option value={sizes[0]}>Small</option>

              <option value={sizes[1]}>Medium</option>

              <option value={sizes[2]}>Large</option>
            </select>
          </label>
        </div>

        <div className="dataTables_filter">
          <label>
            Search:
            <input
              className=" form-control form-control-sm"
              onChange={(e) => setPhrase(e.target.value)}
            />
          </label>
        </div>
      </div>
    );
  };

  const renderHeadings = () => {
    const arr = [
      "Rank",
      "Store Name",
      "Sales Score",
      "Merchandise Score",
      "Total Score",
    ];
    return arr;
  };

  return (
    <div className="col-md-12">
      <div className="card p-3">
        <div className="row">
          <div className="col-8">
            <Table
              renderTableEntries={renderTableEntries}
              tableName={`${selectedSize} Store Leaderboard`}
              tableHeadings={renderHeadings()}
              filters={renderFilters()}
              currentPage={currpage}
              updateCurrentPage={setCurrPage}
              pageCount={pageCount}
              totalRecords={totalRecords}
              limitUnderFlow={limitUnderFlow}
              Limit={Limit}
            />
          </div>

          <div className="col-4">
            <div className="card card-round">
              <div className="card-header">
                <div className="card-head-row card-tools-still-center">
                  <div className="card-title">Medal Legend</div>
                </div>
              </div>
              <div className="card-body pb-0">
                <div className="d-flex">
                  <div className="avatar">
                    <i
                      className="fas fa-medal"
                      style={{ color: "gold", fontSize: "30px" }}
                    ></i>
                  </div>
                  <div className="flex-1 pt-1 ms-2">
                    <h6 class="fw-bold mb-1">Gold Medal</h6>
                  </div>
                  <div className="d-flex ms-auto align-items-center">
                    <h4 className="text fw-bold">R1000</h4>
                  </div>
                </div>
                <div className="seperator-dashed"></div>
                <div className="d-flex">
                  <div className="avatar">
                    <i
                      className="fas fa-medal"
                      style={{ color: "silver", fontSize: "30px" }}
                    ></i>
                  </div>
                  <div className="flex-1 pt-1 ms-2">
                    <h6 class="fw-bold mb-1">Silver Medal</h6>
                  </div>
                  <div className="d-flex ms-auto align-items-center">
                    <h4 className="text fw-bold">R800</h4>
                  </div>
                </div>
                <div className="seperator-dashed"></div>
                <div className="d-flex">
                  <div className="avatar">
                    <i
                      className="fas fa-medal"
                      style={{ color: "#CD7F32", fontSize: "30px" }}
                    ></i>
                  </div>
                  <div className="flex-1 pt-1 ms-2">
                    <h6 class="fw-bold mb-1">Bronze Medal</h6>
                  </div>
                  <div className="d-flex ms-auto align-items-center">
                    <h4 className="text fw-bold">R500</h4>
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

export default LeaderboardPage;
