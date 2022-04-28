import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { getFormData } from "../../helpers/helpers";
import api from "../../utils/api";
import { ranks } from "./data";
//import Web3 from 'web3'

export default function Settings() {
  const { isLoggedIn, userInfo } = useSelector((state) => state?.user?.value);
  const authToken = userInfo.token;
  const apiHeaders = { headers: { Authorization: `Bearer ${authToken}` } };
  const [userData, setUserData] = useState({});
  const [directChilds, setDirectChilds] = useState([]);

  async function getUsersInfo() {
    api
      .post("userInfo", { member_id: userInfo?.user?.member_id }, apiHeaders)
      .then((res) => {
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

  async function changePassword(e) {
    e.preventDefault();
    const formData = getFormData(e.target);
    console.log(formData);
    const fundRes = api.post("/change_admin_password", formData, apiHeaders);

    toast.promise(fundRes, {
      loading: "Changing password....",
      success: (data) => {
        e.target.reset();
        return `Congratulations, your password has been changed.`;
      },
      error: (err) => {
        return (
          err?.response?.data?.errors ??
          err?.response?.data?.message ??
          err?.message ??
          "OOPs something went wrong."
        );
      },
    });
  }

 
  useEffect(async () => {
    //await getUsersInfo();
  }, []);
  return (
    <>
      <div className="row">
        <div className="col-12 col-xl-8">
          {/* Change Password Thing */}
          <div className="card card-body bg-white border-light shadow-sm mb-4">
            <h2 className="h5">Change Passwords</h2>
            <form
              onSubmit={(e) => {
                changePassword(e);
              }}
            >
              <input
                type="hidden"
                name="email"
                value={userInfo.admin.email}
              />
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div>
                    <label for="old_pass">Old Password</label>
                    <input
                      className="form-control"
                      id="old_pass"
                      type="password"
                      placeholder="Old Password"
                      name="old_pass"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div>
                    <label for="first_name">New password</label>
                    <input
                      className="form-control"
                      id="password"
                      type="password"
                      placeholder="New Password"
                      name="pass"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div>
                    <label for="last_name">Confirm Password</label>
                    <input
                      className="form-control"
                      id="confirm_pass"
                      type="password"
                      placeholder="Confirm Password"
                      name="confirm_pass"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="mt-1">
                <button type="submit" className="btn btn-primary">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
