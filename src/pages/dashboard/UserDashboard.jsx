import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import NewTaskExport from "./NewTaskExport";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarExport,
  gridClasses,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridSearchIcon,
  GridFilterInputDate,
} from "@mui/x-data-grid";
import { Chip, Stack } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import {
  faCheck,
  faCheckDouble,
  faChevronCircleUp,
  faCoffee,
  faIdBadge,
} from "@fortawesome/free-solid-svg-icons";
import { ranks } from "./data";
import { getFormData } from "../../helpers/helpers";

export default function DashboardHome() {
  const { isLoggedIn, userInfo } = useSelector((state) => state?.user?.value);
  const authToken = userInfo.token;
  const apiHeaders = { headers: { Authorization: `Bearer ${authToken}` } };
  const { memberID } = useParams();
  const [userData, setUserData] = useState({});
  const [directChilds, setDirectChilds] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [editMemberInfo, setEditMemberInfo] = useState(false);
  const columns = [
    { field: "member_id", headerName: "Member ID", width: 150 },
    { field: "level", headerName: "Level", width: 200 },
    { field: "amount", headerName: "Amount", width: 200 },
    { field: "coin_wallet", headerName: "Coin Wallet", width: 200 },
    { field: "income_wallet", headerName: "Income Wallet", width: 200 },
    { field: "createdAt", headerName: "Joined On", type: "date", width: 150 },
  ];
  const newJoinings = [
    { member_id: "XELL000001", name: "Demo User", img: "" },
    { member_id: "XELL000003", name: "Demo User", img: "" },
    { member_id: "XELL000003", name: "Demo User", img: "" },
    { member_id: "XELL000004", name: "Demo User", img: "" },
  ];

  const infoArray = [
    { icon: "fas fa-coins", field: "bep20_wallet", label: "Smart Wallet" },
    { icon: "fas fa-coins", field: "investment", label: "Inexpress wallet" },
    { icon: "fas fa-wallet", field: "coin_wallet", label: "Vibration wallet" },
    {
      icon: "fas fa-wallet",
      field: "income_wallet",
      label: "Cashoneer wallet",
    },
    { icon: "fas fa-coins", field: "direct_coin", label: "Direct Business" },
    { icon: "fas fa-coins", field: "total_coin", label: "Total Business" },
    { icon: "fas fa-users", field: "direct_members", label: "Direct Members" },
    { icon: "fas fa-users", field: "total_members", label: "Total Members" },
    { icon: "fas fa-coins", field: "cashback_wallet", label: "Moneypal wallet" },
  ];

  async function getUsersInfo() {
    api
      .post("userInfo", { member_id: memberID },apiHeaders)
      .then((res) => {
        console.log("userInfo :: ", res.data.data);
        setUserData({ ...res.data.data });
        setDirectChilds([...res.data.directChild]);
      })
      .catch((error) => {
        toast.error(
          error.response.data.message ??
            error.message ??
            "OOPs, Something went wrong."
        );
      });
  }

  async function getLevelIncome() {
    api
      .post("getIncomeHistory", {
        member_id: memberID,
        income_type: "Incom from downline",
      },apiHeaders)
      .then((res) => {
        console.log("LevelIncome:: ", res.data.data);
        setTableData([...res.data.data]);
      })
      .catch((error) => {
        toast.error(
          error.response.data.message ??
            error.message ??
            "OOPs, Something went wrong."
        );
      });
  }

  async function updateMemberInfo(e) {
    e.preventDefault();
    const formData = getFormData(e.target);
    const updatePromise = api.post("updateUserInfo", formData,apiHeaders);
    toast
      .promise(updatePromise, {
        loading: "Updatng member's information",
        success: "Success, Member's information updated successfully.",
        error: "Error, Something went worng",
      })
      .then(() => {
        getUsersInfo();
      });
  }

  async function updateMemberRank(e) {
    e.preventDefault();
    const formData = getFormData(e.target);
    const updatePromise = api.post("update_rank", formData,apiHeaders);
    toast
      .promise(updatePromise, {
        loading: "Updatng member's rank",
        success: "Success, Member's rank updated successfully.",
        error: "Error, Something went worng",
      })
      .then(() => {
        getUsersInfo();
      });
  }

  async function creditMemberWallet(e) {
    e.preventDefault();
    const formData = getFormData(e.target);
    const updatePromise = api.post("credit_wallet", formData,apiHeaders);
    toast
      .promise(updatePromise, {
        loading: "Updatng member's wallet",
        success: "Success, Member's wallet updated successfully.",
        error: "Error, Something went worng",
      })
      .then(() => {
        getUsersInfo();
      });
  }

  async function debitMemberWallet(e) {
    e.preventDefault();
    const formData = getFormData(e.target);
    const updatePromise = api.post("debit_wallet", formData,apiHeaders);
    toast
      .promise(updatePromise, {
        loading: "Updatng member's wallet",
        success: "Success, Member's wallet updated successfully.",
        error: "Error, Something went worng",
      })
      .then(() => {
        getUsersInfo();
      });
  }

  useEffect(async () => {
    await getUsersInfo();
    //await getLevelIncome();
  }, []);
  return (
    <>
      <div className="container-fluid py-4">
        {editMemberInfo ? (
          <>
            <h2 className="h5 mb-1">General information</h2>
            <form
              onSubmit={(e) => {
                updateMemberInfo(e);
              }}
            >
              <input
                type="hidden"
                name="member_id"
                value={userData.member_id}
              />
              <div className="row">
                <div className="col-md mb-3">
                  <div>
                    <label for="full_name">Full Name</label>
                    <input
                      className="form-control"
                      id="full_name"
                      type="text"
                      placeholder="Name"
                      name="full_name"
                      defaultValue={userData.full_name}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="form-group">
                    <label for="email">Email</label>
                    <input
                      className="form-control"
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      name="email"
                      defaultValue={userData.email}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-group">
                    <label for="phone">Phone</label>
                    <input
                      className="form-control"
                      id="phone"
                      type="number"
                      placeholder="+12-345 678 910"
                      name="mobile"
                      defaultValue={userData.mobile}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md mb-3">
                  <div>
                    <label for="xcelpay_wallet">XcelPay Wallet Address</label>
                    <input
                      className="form-control"
                      id="xcelpay_wallet"
                      type="text"
                      placeholder="XcelPay Wallet Address"
                      name="xcelpay_wallet"
                      defaultValue={userData.xcelpay_wallet}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="mt-0 d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-warning me-2"
                  onClick={() => setEditMemberInfo(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Info
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="row">
            <div className="col-lg">
              <div className="row row-cols-1">
                <div className="col mb-2">
                  <div className="card card-body border-0 shadow-sm">
                    <div className="d-flex justify-content-between">
                      <div className="d-flex">
                        <div className="me-2">
                          <img
                            class="user-avatar md-avatar rounded-circle"
                            alt="Image placeholder"
                            src="/theme_files/assets/img/team/profile-picture-3.jpg"
                          />
                        </div>
                        <div>
                          <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                            {memberID}
                          </div>
                          <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                            <span className="fw-bold text-uppercase">
                              Sponsor ID :{" "}
                            </span>
                            {userData.sponsor_id}
                          </div>
                        </div>
                      </div>
                      <div>
                        <button
                          className="btn"
                          onClick={() => setEditMemberInfo(true)}
                        >
                          <span>
                            <FontAwesomeIcon icon={faEdit} />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row row-cols-4">
                {infoArray.map((info) => (
                  <div className="col mb-2">
                    <div className="card card-body border-0 shadow-sm">
                      <h6 className="fw-bold my-0">{info.label}</h6>
                      <div className="d-flex align-items-center">
                        <div className="mr-2">
                          <span className="flink-icon text-light">
                            <span className={info.icon}></span>
                          </span>
                        </div>
                        <div>
                          <span className="fw-bold fs-5">
                            {userData[info.field]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="my-2">
                <div className="card card-body border-0 shadow-sm">
                  <div className="d-block mb-4 mb-md-0 mb-2">
                    <h2 className="h4 my-0">
                      Credit Vibration Wallet or Smart Wallet
                    </h2>
                  </div>
                  <form
                    onSubmit={(e) => {
                      creditMemberWallet(e);
                    }}
                  >
                    <input
                      type="hidden"
                      name="member_id"
                      value={userData.member_id}
                    />
                    <div class="input-group mb-3">
                      <input
                        type="number"
                        name="amount"
                        class="form-control"
                        placeholder="Amount"
                        aria-label="Amount"
                        aria-describedby="button-addon2"
                        min="0"
                        required
                      />
                      <select
                        class="form-select"
                        id="inputGroupSelect03"
                        aria-label="Example select with button addon"
                        name="wallet_type"
                      >
                        <option selected disabled>
                          Select Wallet
                        </option>
                        <option value="bep20_wallet">Smart Wallet</option>
                        <option value="coin_wallet">Vibration Wallet</option>
                        <option value="income_wallet">Cashoneer Wallet</option>
                      </select>

                      <button
                        class="btn btn-outline-secondary"
                        type="submit"
                        id="button-addon2"
                      >
                        Credit Wallet
                      </button>
                    </div>
                  </form>
                </div>
              </div>


              <div className="my-2">
                <div className="card card-body border-0 shadow-sm">
                  <div className="d-block mb-4 mb-md-0 mb-2">
                    <h2 className="h4 my-0">
                      Debit Wallet
                    </h2>
                  </div>
                  <form
                    onSubmit={(e) => {
                      debitMemberWallet(e);
                    }}
                  >
                    <input
                      type="hidden"
                      name="member_id"
                      value={userData.member_id}
                    />
                    <div class="input-group mb-3">
                      <input
                        type="number"
                        name="amount"
                        class="form-control"
                        placeholder="Amount"
                        aria-label="Amount"
                        aria-describedby="button-addon2"
                        min="0"
                        required
                      />
                      <select
                        class="form-select"
                        id="inputGroupSelect03"
                        aria-label="Example select with button addon"
                        name="wallet_type"
                      >
                        <option selected disabled>
                          Select Wallet
                        </option>
                        <option value="bep20_wallet">Smart Wallet</option>
                        <option value="coin_wallet">Vibration Wallet</option>
                        <option value="income_wallet">Cashoneer Wallet</option>
                      </select>

                      <button
                        class="btn btn-outline-secondary"
                        type="submit"
                        id="button-addon2"
                      >
                        Debit Wallet
                      </button>
                    </div>
                  </form>
                </div>
              </div>






              <div className="my-2">
                <div className="card card-body border-0 shadow-sm">
                  <div className="d-block mb-4 mb-md-0 mb-2">
                    <h2 className="h4 my-0">Update Member's Rank</h2>
                  </div>
                  <form
                    onSubmit={(e) => {
                      updateMemberRank(e);
                    }}
                  >
                    <input
                      type="hidden"
                      name="member_id"
                      value={userData.member_id}
                    />
                    <div class="input-group mb-3">
                      <select
                        class="form-select"
                        id="inputGroupSelect03"
                        aria-label="Example select with button addon"
                        name="rank"
                      >
                        <option selected disabled>
                          Select New Rank
                        </option>
                        {ranks.map((rank, index) => (
                          <option value={index}>{rank}</option>
                        ))}
                      </select>

                      <button
                        class="btn btn-outline-secondary"
                        type="submit"
                        id="button-addon2"
                      >
                        Update Rank
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
