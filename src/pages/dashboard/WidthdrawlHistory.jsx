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
import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"
export default function WidthdrawlHistory() {
  const { isLoggedIn, userInfo } = useSelector((state) => state?.user?.value);
  const authToken = userInfo.token;
  const apiHeaders = { headers: { Authorization: `Bearer ${authToken}` } };
  const navigate = useNavigate()
  const [tableData, setTableData] = useState([]);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const columns = [
    { field: "member_id", headerName: "Member ID", width: 150, flex: 1 },
    { field: "amount", headerName: "Amount", width: 200, flex: 1 },
    { field: "coin_wallet", headerName: "Coin Wallet", width: 200, flex: 1 },
    { field: "income_wallet", headerName: "Income Wallet", width: 200, flex: 1 },
    { field: "createdAt", headerName: "Date of Withdraw", type: "date", width: 150, flex: 1 }
  ];

  async function getWidthdrawlHistory() {
    api
      .post("getIncomeHistory", {income_type: "widthdrawl"},apiHeaders)
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
    getWidthdrawlHistory();
  }, []);
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-2 mb-md-0">
          <h2 className="h4">Withdrawl History</h2>
        </div>
      </div>
      <div className="table-settings mb-4">
       {/*  <div className="row align-items-center justify-content-between">
          <div className="col col-md-6 col-lg-3 col-xl-4">
            <div className="input-group">
              <span className="input-group-text" id="basic-addon2">
                <span className="fas fa-search"></span>
              </span>
              <input
                type="text"
                className="form-control"
                id="exampleInputIconLeft"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="basic-addon2"
              />
            </div>
          </div>
        </div> */}
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
          />
        </div>
      </div>
    </>
  );
}
