import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { ranks } from "./data";
import NewTaskExport from "./NewTaskExport";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { getFormData } from "../../helpers/helpers";

export default function DashboardHome() {
  const { isLoggedIn, userInfo } = useSelector((state) => state?.user?.value);
  const authToken = userInfo.token;
  const apiHeaders = { headers: { Authorization: `Bearer ${authToken}` } };
  const [userData, setUserData] = useState({});
  const [dashboardData, setDashboardData] = useState({});
  const dispatch = useDispatch();

  async function getDashboardData() {
    api
      .get("dashboarddata",apiHeaders)
      .then((res) => {
        console.log("dashboardData :: ", res.data);
        setDashboardData({ ...res.data });
      })
      .catch((error) => {
        toast.error(
          error.response.data.message ??
            error.message ??
            "OOPs, Something went wrong."
        );
      });
  }

  async function updateTopupAmount(e) {
    e.preventDefault();
    const formData = getFormData(e.target);
    const updatePromise = api.post("change_min_max_topup_amount", formData,apiHeaders);
    toast
      .promise(updatePromise, {
        loading: "Updating topup amounts...",
        success: (data) => {
          e.target.reset();
          return "Success, topup amount updated successfully.";
        },
        error: "Error, Something went worng",
      })
      .then(() => {
        getDashboardData();
      });
  }


  useEffect(async () => {
    //await getUsersInfo();
    await getDashboardData();
  }, []);
  return (
    <>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-lg-8 col-md-6">
            <div className="row row-cols-8">
              <div className="col mb-2 ">
                <div className="card card-body border-0 shadow-sm h-100">
                  <h6 className="fw-bold my-0">Total Investment</h6>
                  <div className="d-flex">
                    <div>
                      {dashboardData?.totalInvestment?.[0]?.totalInvestment ??
                        0}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col mb-2">
                <div className="card card-body border-0 shadow-sm h-100">
                  <h6 className="fw-bold my-0">Total Withdrawal</h6>
                  <div className="d-flex">
                    <div>
                      {dashboardData?.totalWidthdrawl?.[0]?.totalWidthdrawl ??
                        0}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* UpdateTopup amount */}
            <div className="card card-body mt-3">
              <h5>Update topup amounts</h5>
              <form onSubmit={(e) => { updateTopupAmount(e)}}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div>
                      <label for="min_topup_amount">Min Topup Amount</label>
                      <input
                        className="form-control"
                        id="min_topup_amount"
                        type="number"
                        placeholder="Minimum Topup Amount"
                        required
                        name="min_topup_amount"
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div>
                      <label for="max_topup_amount">Max Topup Amount</label>
                      <input
                        className="form-control"
                        id="max_topup_amount"
                        type="number"
                        placeholder="Max Topup Amount"
                        required
                        name="max_topup_amount"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <button type="submit" className="btn btn-primary">
                    Update Topup Amount
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg col-md">
            <div className="card card-body border-0 shadow-sm">
              <div className="d-flex mb-1 justify-content-between align-items-center">
                <div style={{ fontSize: "13px", fontWeight: "bold" }}>
                  Levelwise Members...
                </div>
              </div>
              <div>
                {dashboardData?.levelWiseMemberCount &&
                  dashboardData?.levelWiseMemberCount.map((levelData) => (
                    <Link
                      to=""
                      className="d-flex my-2 justify-content-between align-items-center user-item  border rounded p-2"
                    >
                      <div className="d-flex align-items-center">
                        <div className="me-2">
                          <div className="">
                            <span className="flink-icon text-light">
                              <span className="fas fa-user"></span>
                            </span>
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: "bold" }}>
                            <span className="fw-bold">Member Level</span>
                          </div>
                          <div style={{ fontSize: "13px", fontWeight: "bold" }}>
                            <span className="fw-bold text-success">
                              {ranks[levelData.memberLevel]}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="fw-bold">
                          {levelData.membersCount}
                        </span>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
