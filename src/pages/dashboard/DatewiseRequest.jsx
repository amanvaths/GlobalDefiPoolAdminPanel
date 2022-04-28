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

export default function DatewiseRequest() {
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
  const [showRecords, setShowRecords] = useState(false);
  const [recordData, setRecordData] = useState([]);

  const columns = [
    { field: "_id", headerName: "Date" },
    { field: "totalwr_amount", headerName: "Total Withdrawal Amount", flex: 1 },
    /* {
      headerName: "Wallet Address", minWidth: 100, flex: 1,renderCell: (params) => {
        return params.row.userInfo[0].xcelpay_wallet ?? "Wallet not updated.";
      },
    }, */
    {
      field: "totalwr",
      headerName: "Total Withdrawals",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          label="View Withdrawals"
          onClick={(e) => {
            //approveRequest(params.row);
            setRecordData([...params.row.wr]);
            setShowRecords(true);
          }}
          showInMenu
        />,
      ],
    },
    /* {
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
    }, */
  ];

  const appColumns = [
    { field: "member_id", headerName: "Member ID" },
    {
      field: "txn_hash",
      headerName: "Transaction Hash",
      minWidth: 100,
      flex: 1,
    },
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
      headerName: "Withdrawal Date",
      type: "date",
      minWidth: 100,
      flex: 1,
    },
  ];

  async function dateWise() {
    api
      .post("datewise_withdraw_req", {}, apiHeaders)
      .then((res) => {
        // console.log("",res.data);
        //const pending = res.data.pending.filter((item) => item.is_approved == 0);
        // const approved = res.data.filter((item) => item.is_approved == 1);
        // const rejected = res.data.filter((item) => item.is_approved == 2);
        setPendingFundRequests([...res.data.pending]);
        setApprovedFundRequests([...res.data.approved]);
        setRejectedFundRequests([...res.data.rejected]);
        //console.log("datewise",res.data.pending);
        //console.log("datewise2",pending);
        setTableData([...res.data.data]);
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
    //getFundRequests();
    dateWise();
  }, []);
  return (
    <>
      {showRecords ? (
        <>
          <div className="my-2">
            <div className="d-flex justify-content-between">
                <div><h5>Pending Requests</h5></div>
                <div>
                    <button onClick={(e)=>{
                        setShowRecords(false);
                    }}>Close</button>
                </div>
            </div>
            
            <DataGrid
              getRowId={(r) => r._id}
              rows={recordData}
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
        </>
      ) : (
        <>
          <div className="my-2">
            <div className="d-flex justify-content-between">
              <div>
                <h2 className="h4">DateWise Requests</h2>
              </div>
            </div>
          </div>

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
              <h5>Rejected Requests</h5>
              <DataGrid
                getRowId={(r) => r._id}
                rows={rejectedFundRequests}
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
          </div>
        </>
      )}
    </>
  );
}
