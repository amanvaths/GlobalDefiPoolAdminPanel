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
import { useEffect, useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import React from "react";
import { Button, Modal } from "react-bootstrap";

import { connection, setWalletInfo } from "../../redux/User";
import { useDispatch, useSelector } from "react-redux";
import { getFormData } from "../../helpers/helpers";

export default function WithdrawlRequest() {
  const dispatch = useDispatch();
  const { isLoggedIn, userInfo, isWalletConnected, walletInfo } = useSelector(
    (state) => state?.user?.value
  );
  const authToken = userInfo.token;
  const apiHeaders = { headers: { Authorization: `Bearer ${authToken}` } };
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [pendingFundRequests, setPendingFundRequests] = useState([]);
  const [approvedFundRequests, setApprovedFundRequests] = useState([]);
  const [rejectedFundRequests, setRejectedFundRequests] = useState([]);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [withdrawlReq, setWithdrawlReq] = useState({});

  const columns = [
    { field: "member_id", headerName: "Member ID" },
    {
      headerName: "Wallet Address",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return params.row.userInfo[0].xcelpay_wallet ?? "Wallet not updated.";
      },
    },
    { field: "amount", headerName: "Amount", minWidth: 100, flex: 1 },
    {
      field: "wallet_type",
      headerName: "From Wallet",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return {
          income_wallet: "Cashoneer Wallet",
          cashback_wallet: "Moneypal Wallet",
        }[params.value];
      },
    },
    {
      field: "createdAt",
      headerName: "Request Date",
      type: "date",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          label="Approve Request"
          onClick={(e) => {
            approveRequest(params.row);
          }}
          showInMenu
        />,
        <GridActionsCellItem
          label="Reject Request"
          onClick={(e) => {
            //history.replace(``);
            setModalShow(true);
            setWithdrawlReq(params.row);
            console.log(params.row);
            //navigate(`associate/${params.row.member_id}`, true);
          }}
          showInMenu
        />,
      ],
    },
  ];

  const appColumns = [
    { field: "member_id", headerName: "Member ID" },
    {
      headerName: "Wallet Address",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return params.row.userInfo[0].xcelpay_wallet ?? "Wallet not updated.";
      },
    },
    {
      field: "txn_hash",
      headerName: "Txn Hash",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return {
          income_wallet: "Cashoneer Wallet",
          cashback_wallet: "Moneypal Wallet",
        }[params.value];
      },
    },
    /* {
      field: "txn_hash",
      headerName: "Transaction Hash",
      minWidth: 100,
      flex: 1,
    }, */
    { field: "amount", headerName: "Amount", minWidth: 100 },
    {
      field: "wallet_type",
      headerName: "From Wallet",
      minWidth: 150,
      renderCell: (params) => {
        return {
          income_wallet: "Cashoneer Wallet",
          cashback_wallet: "Moneypal Wallet",
        }[params.value];
      },
    },
    /* {
      field: "is_approved",
      headerName: "Request Status",
      //type: "boolean",
      width: 150,
      renderCell: (params) =>
        params.value == 1 ? (
          <Chip label="Approved" color="success" size="small" />
        ) : params.value == 2 ? (
          <Chip label="Rejected" color="warning" size="small" />
        ) : (
          <Chip label="Pending" color="warning" size="small" />
        ),
    }, */
    {
      field: "createdAt",
      headerName: "Request Date",
      type: "date",
      minWidth: 100,
      flex: 1,
    },
  ];

  async function approveRequest(requestData) {
    const apprReq = api.post("approve_withdrawl_request", {
      id: requestData._id,
      txn_hash: requestData.txn_hash,
    }, apiHeaders);
    toast.promise(apprReq, {
      loading: "Approving request...",
      success: "Request approved successfully.",
      error: "Something went wrong.",
    });
  }

  async function rejectRequest(e) {
    e.preventDefault();
    const formData = getFormData(e.target);
    const apprReq = api.post("reject_withdrawl_request", {
      request_id: formData.request_id,
      remark: formData.remark,
    },apiHeaders);
    toast.promise(apprReq, {
      loading: "Rejecting request...",
      success: (data) => {
        e.target.reset();
        setModalShow(false);
        return "Request rejected successfully.";
      },
      error: "Something went wrong.",
    });
  }

  async function getFundRequests() {
    api
      .post("all_withdrawl_requests", {}, apiHeaders)
      .then((res) => {
        console.log(res.data);
        const pending = res.data.filter((item) => item.is_approved == 0);
        const approved = res.data.filter((item) => item.is_approved == 1);
        const rejected = res.data.filter((item) => item.is_approved == 2);
        setPendingFundRequests([...pending]);
        setApprovedFundRequests([...approved]);
        setRejectedFundRequests([...rejected]);
      })
      .catch((error) => {
        toast.error(
          error.response.data.message ??
            error.message ??
            "OOPs, something went wrong."
        );
      });
  }
  async function dateWise() {
    api
      .post("datewise_withdraw_req", {}, apiHeaders)
      .then((res) => {
        // console.log(res.data);
        // const pending = res.data.filter((item) => item.is_approved == 0);
        // const approved = res.data.filter((item) => item.is_approved == 1);
        // const rejected = res.data.filter((item) => item.is_approved == 2);
        // setPendingFundRequests([...pending]);
        // setApprovedFundRequests([...approved]);
        // setRejectedFundRequests([...rejected]);
        console.log("response...",res.data)
      })
      .catch((error) => {
        toast.error(
          error.response.data.message ??
            error.message ??
            "OOPs, something went wrong."
        );
      });
  }

  function CustomToolbar() {
    return (
      <Stack direction="row" justifyContent="flex-end">
        <GridToolbarContainer className={gridClasses.toolbarContainer}>
          <GridToolbarExport />
          <GridToolbarFilterButton />
        </GridToolbarContainer>
      </Stack>
    );
  }

  const onFilterChange = React.useCallback(async (filterModel) => {
    if (
      filterModel?.items?.[0]?.value &&
      filterModel?.items?.[0]?.value.length > 0
    ) {
      setFilterColumn(filterModel?.items?.[0]?.columnField);
      setFilterValue(filterModel?.items?.[0]?.value);
    }
  }, []);

  useEffect(() => {
    getFundRequests();
    dateWise()
  }, []);
  return (
    <>
      <div className="my-2">
        <div className="d-flex justify-content-between">
          <div>
            <h2 className="h4">Withdrawal Requests</h2>
          </div>
        </div>
      </div>

      {modalShow && (
        <form
          onSubmit={(e) => {
            rejectRequest(e);
          }}
        >
          <input type="hidden" name="request_id" value={withdrawlReq._id} />
          <div>
            <label for="support_message">Remark for request</label>
            <textarea
              className="form-control"
              id="support_message"
              placeholder="Add Remark"
              name="remark"
              required
            ></textarea>
          </div>
          <div className="mt-2 text-end">
            <button
              type="button"
              className="btn btn-primary mr-2"
              onClick={(e) => {
                setModalShow(false);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Reject Request
            </button>
          </div>
        </form>
      )}
      <div className="table-settings mb-4">
        <div className="my-2">
          <h5>Pending Requests</h5>
          <DataGrid
            getRowId={(r) => r._id}
            rows={pendingFundRequests}
            columns={columns}
            pageSize={10}
            autoHeight={true}
            className="bg-white"
            components={{
              Toolbar: CustomToolbar,
            }}
            density="compact"
          />
        </div>

        <div className="my-2">
          <h5>Approved Requests</h5>
          <DataGrid
            getRowId={(r) => r._id}
            rows={approvedFundRequests}
            columns={appColumns}
            pageSize={10}
            autoHeight={true}
            className="bg-white"
            components={{
              Toolbar: CustomToolbar,
            }}
            density="compact"
          />
        </div>

        <div className="my-2">
          <h5>Rejected Requests</h5>
          <DataGrid
            getRowId={(r) => r._id}
            rows={rejectedFundRequests}
            columns={[...appColumns, { field: "remark", headerName: "Remark", minWidth: 100 }]}
            pageSize={10}
            autoHeight={true}
            className="bg-white"
            components={{
              Toolbar: CustomToolbar,
            }}
            density="compact"
          />
        </div>
      </div>
    </>
  );
}
