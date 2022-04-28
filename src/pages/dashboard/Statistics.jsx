import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getFormData } from "../../helpers/helpers";
import api from "../../utils/api";
import { ranks } from "./data";
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
import { useDispatch, useSelector } from "react-redux";
import React from "react";

export default function Settings() {
  const { isLoggedIn, userInfo } = useSelector((state) => state?.user?.value);
  const authToken = userInfo.token;
  const apiHeaders = { headers: { Authorization: `Bearer ${authToken}` } };
  const [userData, setUserData] = useState({});
  const [directChilds, setDirectChilds] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const columns = [
    
    { field: "date", headerName: "Date", width: 150 ,flex:1 },
    { field: "investment", headerName: "Investment", width: 250 ,flex:1 },
    { field: "registration", headerName: "Registration", width: 250 ,flex:1, renderCell: (params) => { console.log(params.value);return params.value[0].count }
      },
    { field: "depostit_coin", headerName: "Depostit Coin", width: 250 ,flex:1  },
    { field: "staking_coin", headerName: "Staking Coin", width: 250 ,flex:1 },
  ];

  

  async function getstatistics() {
    api
      .post("getstatistics", {},apiHeaders)
      .then((res) => {
      console.log("getstatistics",res.data);
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
  useEffect(() => {
    getstatistics();
  }, []);


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

  return (
    <>

<div className="col-lg-8 col-md-6">
            <div className="row row-cols-8">
              <div className="col mb-2 ">
                <div className="card card-body border-0 shadow-sm h-100">
                  <h6 className="fw-bold my-0">Total Investment</h6>
                  <div className="d-flex">
                    <div>
                      {/* {dashboardData?.totalInvestment?.[0]?.totalInvestment ??
                        0} */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col mb-2">
                <div className="card card-body border-0 shadow-sm h-100">
                  <h6 className="fw-bold my-0">Total Withdrawal</h6>
                  <div className="d-flex">
                    <div>
                      {/* {dashboardData?.totalWidthdrawl?.[0]?.totalWidthdrawl ??
                        0} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>           
          </div>

          <div className="table-settings mb-4">
       
       <div className="my-2">
         <DataGrid
           getRowId={(r) => r._id}
        //    rows={}
           columns={columns}
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
