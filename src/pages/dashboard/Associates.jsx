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
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { ranks } from "./data";
export default function Associates() {
  const navigate = useNavigate();
  const { isLoggedIn, userInfo } = useSelector((state) => state?.user?.value);
  const authToken = userInfo.token;
  const apiHeaders = { headers: { Authorization: `Bearer ${authToken}` } };
  const [tableData, setTableData] = useState([]);
  const [rankWiseMembers, setRankWiseMembers] = useState([]);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [loadingRWMembers, setLoadingRWMembers] = useState(false);

  async function blockMember(e, memberInfo) {
    e.preventDefault();
    console.log(memberInfo);
    const updatePromise = api.post(
      "admin/blockuser",
      {
        member_id: memberInfo.member_id,
        status: memberInfo.status == 1 || memberInfo.status == 0 ? 2 : 1,
      },
      apiHeaders
    );
    toast
      .promise(updatePromise, {
        loading: "Updatng member's status",
        success: "Success, Member's status updated successfully.",
        error: "Error, Something went worng",
      })
      .then(() => {
        getMembersList();
      });
  }

  async function deleteDepositAddress(e, memberInfo) {
    e.preventDefault();
    console.log(memberInfo);
    const updatePromise = api.post("admin/delete_deposit_address", {
      member_id: memberInfo.member_id,
    },apiHeaders);
    toast
      .promise(updatePromise, {
        loading: "Deleting deposit address...",
        success: (data) => {
          return "Address deleted successfully.";
        },
        error: "Error, Something went worng",
      })
      .then(() => {
        getMembersList();
      });
  }

  const columns = [
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          label="User Dashboard"
          onClick={(e) => {
            //history.replace(``);
            console.log(params.row);
            navigate(`associate/${params.row.member_id}`, true);
          }}
          showInMenu
        />,
        <GridActionsCellItem
          label={
            params.row?.status == 2 ? "Unblock Associate" : "Block Associate"
          }
          onClick={(e) => {
            blockMember(e, params.row);
          }}
          showInMenu
        />,
        <GridActionsCellItem
          label="Delete Deposit Address"
          onClick={(e) => {
            deleteDepositAddress(e, params.row);
          }}
          showInMenu
        />,
      ],
    },
    { field: "member_id", headerName: "Member ID" },
    { field: "sponsor_id", headerName: "Sponsor ID" },
    { field: "email", headerName: "Email", minWidth: 150, flex: 1 },
    { field: "password", headerName: "Password", width: 150 },
    { field: "txn_password", headerName: "Transaction Password", width: 150 },
    {
      field: "deposit_wallet",
      headerName: "Deposit Address",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "bep20_wallet",
      headerName: "Smart wallet",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "investment",
      headerName: "Inexpress wallet",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "coin_wallet",
      headerName: "Vibration wallet",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "income_wallet",
      headerName: "Cashoneer wallet",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "cashback_wallet",
      headerName: "Moneypal wallet",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "direct_members",
      headerName: "Direct Members",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "total_members",
      headerName: "Total Members",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "direct_coin",
      headerName: "Direct Business",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "total_coin",
      headerName: "Total Business",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "level",
      headerName: "Present Rank",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={ranks[params.value] ?? "New Registration"}
          color="success"
          size="small"
        />
      ),
    },
    {
      field: "status",
      headerName: "User's Status",
      //type: "boolean",
      width: 150,
      renderCell: (params) =>
        params.value == 1 ? (
          <Chip label="Active" color="success" size="small" />
        ) : params.value == 2 ? (
          <Chip label="Blocked" color="warning" size="small" />
        ) : (
          <Chip label="InActive" size="small" />
        ),
    },
    /* 
    { field: "sponsor_name", headerName: "Sponsor Name", width: 250 },
    { field: "contact", headerName: "Contact No.", width: 150 },
    
    { field: "hash_password", headerName: "Password", width: 150 },
    
    { field: "new_wallet_amount", headerName: "Wallet", width: 150 },
    { field: "withdrawl_amount", headerName: "Total Withdrawl", width: 150 },*/
    {
      field: "createdAt",
      headerName: "Joined On",
      type: "date",
      minWidth: 100,
      flex: 1,
    },
  ];

  async function getMembersList() {
    api
      .post("userInfo", {}, apiHeaders)
      .then((res) => {
        console.log(res.data);
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

  async function getRankwiseMembers() {
    api
      .post("rankWiseMembers", {}, apiHeaders)
      .then((res) => {
        setRankWiseMembers([...res.data])
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
    getMembersList();
    getRankwiseMembers();
  }, []);
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <h2 className="h4">All Associates</h2>
        </div>
      </div>
      <div className="table-settings mb-4">
        <div className="my-2">
          <DataGrid
            //loading={loadingData}
            getRowId={(r) => r._id}
            rows={tableData}
            columns={columns}
            //rowCount={totalUsers}
            pageSize={10}
            //rowsPerPageOptions={[10, 25, 25, 50, 100]}
            //checkboxSelection
            //paginationMode="server"
            //onFilterModelChange={onFilterChange}
            //onPageChange={handlePageChange}
            autoHeight={true}
            className="bg-white"
            components={{
              Toolbar: CustomToolbar,
            }}
            density="compact"
          />
        </div>
      </div>

      {rankWiseMembers &&
        rankWiseMembers.map((rankWiseData) => (
          <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
              <div className="d-block mb-4 mb-md-0">
                <h2 className="h4">{ranks[rankWiseData._id] ?? "New Registration"}</h2>
              </div>
            </div>
            <div className="table-settings mb-4">
              <div className="my-2">
                <DataGrid
                  //loading={loadingData}
                  getRowId={(r) => r._id}
                  rows={rankWiseData.members}
                  columns={columns}
                  //rowCount={totalUsers}
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
        ))}
    </>
  );
}
