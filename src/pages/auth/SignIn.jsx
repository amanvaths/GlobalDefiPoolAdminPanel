import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getFormData } from "../../helpers/helpers";
import { login } from "../../redux/User";
import api from "../../utils/api";
import { useEffect, useState } from "react";

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hidePass, setHidePass] = useState(true);
  const [adminEmail, setAdminEmail] = useState();
  const [isAdminEmailVerified, setIsAdminEmailVerified] = useState(false);

  function authenticateUser(e) {
    e.preventDefault();
   //if (isAdminEmailVerified) {
      const formData = getFormData(e.target);
      api
        .post("/admin/signin", formData)
        .then((res) => {
          toast.success("Congratulations, you have successfully logged in.");
          const uData = { isLoggedIn: true, userInfo: res.data };
          localStorage.setItem("xceltrip_admin", JSON.stringify(uData));
          dispatch(login({ isLoggedIn: true, userInfo: res.data }));
          navigate("../dashboard", { replace: true });
        })
        .catch((error) => {
          toast.error(
            error?.response?.data?.message ??
              error?.message ??
              "OOPs something went wrong."
          );
        });
    /* } else {
      toast.error("Please verify admin email first.");
    } */
  }

  function sendOTP() {
    const signinRes = api.post("/sendotp", {email: adminEmail});
    toast
      .promise(signinRes, {
        loading: "Verifying email address.",
        success: (data) => {
          return `An email verification email has been sent to your email address.`;
        },
        error: (err) => {
          return (
            err?.response?.data?.errors ??
            err?.response?.data?.message ??
            err?.message ??
            "OOPs something went wrong."
          );
        },
      })
  }

  return (
    <div className="bg-soft">
      <section className="vh-lg-100 d-flex align-items-center">
        <div className="container">
          <div
            className="row justify-content-center form-bg-image"
            //data-background-lg="/theme_files/assets/img/illustrations/signin.svg"
            style={{
              backgroundImage:
                "url(/theme_files/assets/img/illustrations/signin.svg)",
            }}
          >
            <div className="col-12 d-flex align-items-center justify-content-center">
              <div className="signin-inner my-3 my-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h1 className="mb-0 h3">Administrative Panel</h1>
                </div>
                <form
                  className="mt-4"
                  onSubmit={(e) => {
                    authenticateUser(e);
                  }}
                >
                  {/* <div className="form-group mb-4">
                    <label for="email">Your Email</label>
                    <div className="input-group">
                      <span className="input-group-text" id="basic-addon1">
                        <span className="fas fa-envelope"></span>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="example@company.com"
                        id="email"
                        name="email"
                        autofocus
                        required
                        onChange={(e) => {
                          setAdminEmail(e.target.value);
                        }}
                      />
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        id="sendOTP"
                        onClick={(e) => {
                          sendOTP();
                        }}
                      >
                        Send OTP
                      </button>
                    </div>
                  </div> */}

                  <div className="form-group mb-4">
                    <label for="otp">Email</label>
                    <div className="input-group">
                      <span className="input-group-text" id="basic-addon1">
                        <span className="fas fa-lock"></span>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Email"
                        id="email"
                        name="email"
                        autofocus
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="form-group mb-4">
                      <label for="password">Your Password</label>
                      <div className="input-group">
                        <span className="input-group-text" id="basic-addon2">
                          <span className="fas fa-unlock-alt"></span>
                        </span>
                        <input
                          type={hidePass ? "password" : "text"}
                          placeholder="Password"
                          className="form-control"
                          id="password"
                          name="password"
                          required
                        />
                        <button
                          class="btn btn-outline-secondary"
                          type="button"
                          id="show_hide_pass"
                          onClick={(e) => {
                            setHidePass(!hidePass);
                          }}
                        >
                          <span
                            className={
                              hidePass ? "fas fa-eye" : "fas fa-eye-slash"
                            }
                          ></span>
                        </button>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="defaultCheck5"
                          name="rememberme"
                        />
                        <label className="form-check-label" for="defaultCheck5">
                          Remember me
                        </label>
                      </div>
                      {/* <div>
                        <Link
                          to="/forgot-password"
                          className="small text-right"
                        >
                          Lost password?
                        </Link>
                      </div> */}
                    </div>
                  </div>
                  <button type="submit" className="btn btn-block btn-primary">
                    Sign In
                  </button>
                </form>
                {/*<div className="mt-3 mb-4 text-center">
                  <span className="font-weight-normal">or login with</span>
                </div>
               <div className="btn-wrapper my-4 text-center">
                  <button
                    className="btn btn-icon-only btn-pill btn-outline-light text-facebook mr-2"
                    type="button"
                    aria-label="facebook button"
                    title="facebook button"
                  >
                    <span
                      aria-hidden="true"
                      className="fab fa-facebook-f"
                    ></span>
                  </button>
                  <button
                    className="btn btn-icon-only btn-pill btn-outline-light text-twitter mr-2"
                    type="button"
                    aria-label="twitter button"
                    title="twitter button"
                  >
                    <span aria-hidden="true" className="fab fa-twitter"></span>
                  </button>
                  <button
                    className="btn btn-icon-only btn-pill btn-outline-light text-facebook"
                    type="button"
                    aria-label="github button"
                    title="github button"
                  >
                    <span aria-hidden="true" className="fab fa-github"></span>
                  </button>
                </div>
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <span className="font-weight-normal">
                    Not registered? 
                    <Link to="/signup" className="font-weight-bold">
                      Create account
                    </Link>
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
