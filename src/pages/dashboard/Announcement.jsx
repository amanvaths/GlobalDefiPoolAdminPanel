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
  const [active, setActive] = useState(true);

  const [tableData, setTableData] = useState([]);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const[announce, setannounce] = useState();
  const[announcements,setAnnouncements] = useState([]);
  const[announcement_for,setannouncement_for] = useState();

  const columns = [
    // { field: "_id", headerName: "Member ID", width: 150 },
    { field: "announcement", headerName: "Announcement", width: 250, flex: 1 },
    { field: "announcement_for", headerName: "Announcement For", width: 250},
    { field: "createdAt", headerName: "Created  At", width: 250 },
  ];

  async function Announcement(e) {
    e.preventDefault();
    const formData = getFormData(e.target);
    api
      .post("makeAnnouncement", formData,apiHeaders)
      .then((res) => {

        console.log("aaa",res.data);
        setannounce([...res.data.data]);
        toast.success("Announcement created successfully.");
      })
      .catch((error) => {
        toast.error(
          error.response.data.message ??
            error.message ??
            "OOPs, something went wrong."
        );
      });
  }

  async function getAllAnnouncements() {
    api
      .post("getAllAnnouncement", {},apiHeaders)
      .then((res) => {
        console.log("aaa",res.data);
        setAnnouncements([...res.data]);
      })
      .catch((error) => {
        toast.error(
          error.response.data.message ??
            error.message ??
            "OOPs, something went wrong."
        );
      });
  }
  
  useEffect(()=>{
    getAllAnnouncements();
  },[])

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

  // useEffect(() => {
  //   getInvestmentList();
  // }, []);

  return (
    <>
      <div className="row">
        <div className="col-12 col-xl-12">
          {/* Change Password Thing */}
          <div className="card card-body bg-white border-light shadow-sm mb-4">
            <h2 className="h5">Announcement</h2>

          
            <form onSubmit={(e)=>{Announcement(e)}}>
            <label for="sdd">Make Announcement For</label>
            <div>
              <select
              className="form-control"
                id="mfi_4_a_i"
                onChange={(e) => {
                  if (e.target.value == "0") {
                    setActive(true);
                  } else {
                    setActive(false);
                  }
                }}
              >
                <option value="0">For All</option>
                <option value="1">Only For</option>
              </select>
              </div>
              <div className="pt-2">
             
                <input
                className="form-control"
                placeholder="Member ID"
                  type="text"
                  name="announcement_for"
                  id="sdd"
                  disabled={active}
                />
              </div>
              <div className="form-floating pt-2">
                <textarea
                name="announcement"
                  className="form-control"
                  placeholder="Leave a comment here"
                  id="floatingTextarea2"
                  style={{ height: "100px" }}
                ></textarea>
                <label for="floatingTextarea2">Text</label>
              </div>
              <div className="mt-1">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="table-settings mb-4">
       
        <div className="my-2">
          <DataGrid
            getRowId={(r) => r._id}
            rows={announcements}
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
