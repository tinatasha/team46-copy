import React, { useEffect, useState, useContext } from "react";
import InfoCard from "../components/analytics/InfoCard";

import api from "../services/api";
import DoubleEndedBarChart from "../components/analytics/barGraph";
import CustomAreaChart from "../components/analytics/areaGraph";
import SingleEndedBarChart from "../components/analytics/singleBarChart";
import Table from "../components/analytics/table";
import { useDebouncer } from "../custom hooks/useDebouncer";
import AuthContext from "../context/authentication/authContext";
import ChartModal from "../components/analytics/chartModal";

const Analytics = () => {
  const [selectedRep, setSelectedRep] = useState(null);
  const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);
  const [repPointsData, setRepPointsData] = useState([]);
  //const [expandedReps, setexpandedReps] = useState({});

  const { user, userRegion } = useContext(AuthContext);

  //Regional Sales Data Variables
  const [regionalData, setRegionalData] = useState([{}]);
  const [currYear, setCurrYear] = useState(new Date().getFullYear());
  const [breakdownList, setBreakdownList] = useState([]);

  //Table Data Product
  const [productData, setProductData] = useState([]);
  const [currentPageProd, setCurrentPageProd] = useState(1);
  const [pageCountProd, setPageCountProd] = useState(1);
  const Limit = 2;
  const [limitUnderFlow, setLimitUnderFlow] = useState(1);
  const [totalRecordsProd, setTotalRecordsProd] = useState(0);

  //Table Data Sales Reps
  const [repData, setRepDat] = useState([]);
  const [currentPageRep, setCurrentPageRep] = useState(1);
  const [pageCounRep, setPageCountRep] = useState(1);
  const LimitRep = 2;
  const [limitUnderFlowRep, setLimitUnderFlowRep] = useState(1);
  const [totalRecordsRep, setTotalRecordsRep] = useState(0);

  //Chart Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProdID, setSelectedProdID] = useState("");
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [startYear, setStartYear] = useState(new Date().getFullYear() - 1);
  const [endYear, setEndYear] = useState(new Date().getFullYear());
  const [modalDispType, setModalDispType] = useState("PC");

  //Table Filters
  const [productOrder, setOrder] = useState("DESC"); //ASC for viewing worst products first desc for viewing best first
  const [fieldTypeOrder, setFieldTypeOrder] = useState("PC"); //PC for product cost PQ for product quantity
  const [phrase, setPhrase] = useState("");
  const debouncesSearch = useDebouncer(phrase, 500); //set time to 500ms by default (half a second)

  const yearOnYearOptions = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
          font: { weight: "bold" },
        },
      },
      y: {
        title: {
          display: true,
          text: "Sales Amount (ZAR)",
          font: { weight: "bold" },
        },
      },
    },
  };
  useEffect(() => {
    const fetchRepPoints = async () => {
      if (!user) return;
      try {
        const response = await api.get("/shelf/rep_points_by_store", {
          params: { managerId: user.id },
        });
        if (response.data.success) {
          console.log("Resp", response.data);
          setRepPointsData(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fethc sales rep points", error);
      }
    };
    fetchRepPoints();
  }, [user]);
  useEffect(() => {
    const loadSalesRegionalSales = async () => {
      try {
        const response = await api.get("/salesdata/region/sales_performance", {
          params: { Year: currYear },
        });

        if (response.data.success) {
          console.log("response regional", response.data);
          setRegionalData([...response.data.salesData]);
        }
      } catch (error) {
        console.error("error while getting sales data", error);
      }
    };
    loadSalesRegionalSales();
  }, [userRegion]);

  //Use effect for rentrieving product data

  useEffect(() => {
    if (!user) return;
    const loadProducts = async () => {
      try {
        const response = await api.get(
          "/salesdata/PrevYear_Vs_CurrYear_Product_Performance",
          {
            params: {
              managerId: user.id,
              region: userRegion,
              page: currentPageProd,
              limit: Limit,
              field: fieldTypeOrder,
              direction: productOrder,
            },
          }
        );

        if (response.data.success) {
          setProductData([...response.data.dataRecords]);
          setTotalRecordsProd(response.data.totalRecords);
          console.log(response.data);
        } else if (!response.data.success) {
          setProductData([]);
          setTotalRecordsProd(0);
        }
      } catch (error) {
        console.error("Failure to get Product data", error);
        return;
      }
    };

    loadProducts();
  }, [currentPageProd, userRegion]);

  useEffect(() => {
    setPageCountProd(Math.ceil(totalRecordsProd / Limit));
  }, [totalRecordsProd]);

  const showChart = async (Id) => {
    setModalOpen(true);

    try {
      const response = await api.get(
        `/salesdata/single_product_performance/${Id}/${userRegion}`,
        {
          params: {
            type: modalDispType,
            startYear: startYear,
            endYear: endYear,
          },
        }
      );

      if (response.data.success) {
        setSelectedProdID(Id);
        setSelectedProduct([...response.data.data]);
        setStartYear(response.data.startYear);
        setEndYear(response.data.endYear);
      }
    } catch (error) {
      console.error("Failure getting products", error);
      alert("you failed");
    }
  };

  useEffect(() => {
    if (!!selectedProdID) {
      showChart(selectedProdID);
    }
  }, [modalDispType]);

  const renderTableEntries = () => {
    let arrayEntries = [];

    productData.forEach((PD) => {
      const differenceSales = PD.currYearSalesVal - PD.prevYearSalesVal;
      const ratioSales = differenceSales / PD.prevYearSalesVal;
      const displayRatioSales = Math.floor(ratioSales * 1000) / 100;

      arrayEntries.push(
        <tr>
          <td>{PD.prodRank}</td>
          <td>{PD.prodName}</td>
          <td>{PD.currYearSalesVal}</td>
          <td>{PD.prevYearSalesVal}</td>
          <td>{PD.currYearSalesQuant}</td>
          <td>{PD.prevYearSalesQuant}</td>
          <td>{displayRatioSales}</td>

          <td>
            <button className="submit-btn" onClick={() => showChart(PD.prodId)}>
              Show Chart
            </button>
          </td>
        </tr>
      );
    });

    return arrayEntries;
  };

  const renderRepEntries = () => {
    return repPointsData.map((rep, index) => (
      <tr
        key={rep.repId}
        onClick={() => {
          setSelectedRep(rep);
          setIsBreakdownModalOpen(true);
        }}
        style={{ cursor: "pointer" }}
        title="Click to view store breakdown"
      >
        <td>{index + 1}</td>
        <td>{rep.name}</td>
        <td>{rep.surname}</td>
        <td>{rep.totalPoints}</td>
      </tr>
    ));
  };

  const productTableHeadings = [
    "Rank",
    "Name",
    `Sales 2025 (ZAR)`,
    "Sales 2024 (ZAR)",
    "Units Sold 2025",
    "Units Sold 2024",
    "Growth %",
    "View Chart ",
  ];

  const tableHeadingsReps = [
    "Rank",
    "Name",
    "Surname",
    "Total Merchandise Points",
  ];

  return (
    <div className="container">
      <div className="page-inner">
        <div className="row">
          <div className="col-md-8">
            <div className="card card-round">
              <div className="card-header">
                <div className="card-head-row">
                  <div className="card-title d-flex justify-content-center">
                    Regional Sales 2025{" "}
                  </div>
                </div>
              </div>
              <div>
                <div className="row">
                  <div className="card-body col-12 ">
                    <SingleEndedBarChart
                      Data={regionalData}
                      borderColours={["#add8e6"]}
                      barName={[" Regional Sales 2025"]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GUideline for sales Rep Perfomance */}
        <div className="row">
          <Table
            renderTableEntries={renderRepEntries}
            tableName={"Sales Rep Performance"}
            tableHeadings={tableHeadingsReps}
            filters={<></>}
            currentPage={currentPageRep}
            updateCurrentPage={setCurrentPageRep}
            pageCount={pageCounRep}
            totalRecords={totalRecordsRep}
            limitUnderFlow={limitUnderFlowRep}
            Limit={LimitRep}
          />
        </div>

        {/*End GUideline for sales Rep Perfomance */}

        <div className="row" style={{ margin: "20px" }}>
          <Table
            renderTableEntries={renderTableEntries}
            tableName={"Product Performance"}
            tableHeadings={productTableHeadings || []}
            filters={<></>}
            currentPage={currentPageProd}
            updateCurrentPage={setCurrentPageProd}
            pageCount={pageCountProd}
            totalRecords={totalRecordsProd}
            limitUnderFlow={limitUnderFlow}
            Limit={Limit}
          />

          <ChartModal
            handleIsOpen={setModalOpen}
            isOpen={modalOpen}
            chart={
              <DoubleEndedBarChart
                Data={selectedProduct}
                borderColours={["#add8e6", "#e6bbad"]}
                barName={[startYear, endYear]}
              />
            }
            chartFilters={
              <div className="d-flex flex-row justify-content-between">
                <label className="d-flex align-items-center">
                  Store Size
                  <select
                    className="form-control form-control-sm"
                    value={modalDispType}
                    onChange={(prev) => setModalDispType(prev.target.value)}
                  >
                    <option value={"PQ"}>Units Sold</option>

                    <option value={"PC"}>ZAR Sales</option>
                  </select>
                </label>
              </div>
            }
          />

          <ChartModal
            handleIsOpen={setIsBreakdownModalOpen}
            isOpen={isBreakdownModalOpen}
            chart={
              selectedRep && (
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <h4>
                      {selectedRep.name} {selectedRep.surname} - Store Points
                      Breakdown
                    </h4>
                    <ul>
                      {Object.entries(selectedRep.breakdown).map(
                        ([storeName, points]) => (
                          <li key={storeName}>
                            {storeName} : {points} points
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              )
            }
            chartFilters={<></>}
          />
        </div>
      </div>
    </div>
  );
};
export default Analytics;
