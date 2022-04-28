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
import React from "react";
import { useDispatch, useSelector } from "react-redux";
export default function Investments() {
  const { isLoggedIn, userInfo } = useSelector((state) => state?.user?.value);
  const authToken = userInfo.token;
  const apiHeaders = { headers: { Authorization: `Bearer ${authToken}` } };
  const [tableData, setTableData] = useState([]);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const columns = [
    { field: "_id", headerName: "Member ID", width: 150, flex: 1 },
    { field: "amount", headerName: "Investment", width: 250, flex:1 }, 
    { field: "trans_hash", headerName: "Transaction Hash", width: 250, flex: 1 },
    { field: "createdAt", headerName: "Invested On", width: 250, flex:1  }
  ];

  async function getInvestmentList() {
    api
      .post("currentInvestment", {},apiHeaders)
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
    getInvestmentList();
  }, []);
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <h2 className="h4">All Orders</h2>
          <p className="mb-0">Your web analytics dashboard template.</p>
        </div>
      </div>
      <div className="table-settings mb-4">
        {/* <div className="row align-items-center justify-content-between">
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
         <div className="col-4 col-md-2 col-xl-1 pl-md-0 text-right">
            <div className="btn-group">
              <button
                className="btn btn-link text-dark dropdown-toggle dropdown-toggle-split m-0 p-0"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span className="icon icon-sm icon-gray">
                  <span className="fas fa-cog"></span>
                </span>
                <span className="sr-only">Toggle Dropdown</span>
              </button>
              <div className="dropdown-menu dropdown-menu-xs dropdown-menu-right">
                <span className="dropdown-item font-weight-bold text-dark">
                  Show
                </span>
                <a className="dropdown-item d-flex font-weight-bold" href="#">
                  10{" "}
                  <span className="icon icon-small ml-auto">
                    <span className="fas fa-check"></span>
                  </span>
                </a>
                <a className="dropdown-item font-weight-bold" href="#">
                  20
                </a>
                <a className="dropdown-item font-weight-bold" href="#">
                  30
                </a>
              </div>
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
            //pageSize={perPage}
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
