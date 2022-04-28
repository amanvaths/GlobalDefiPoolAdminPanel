import { useDispatch, useSelector } from "react-redux";
import { Link , useNavigate} from "react-router-dom";
import { logout } from "../../redux/User";

export default function DashboardAreaNav() {
  const { isLoggedIn, userInfo } = useSelector((state) => state?.user?.value);
  const authToken = userInfo.token;
  const apiHeaders = { headers: { Authorization: `Bearer ${authToken}` } };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(userInfo);
  return (
    <nav className="navbar navbar-top navbar-expand navbar-dashboard navbar-dark pl-0 pr-2 pb-0">
      <div className="container-fluid px-0">
        <div
          className="d-flex justify-content-end w-100"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav align-items-center">
        
            {/* UserDropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link pt-1 px-0"
                href="#"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <div className="media d-flex align-items-center">
                  <img
                    className="user-avatar md-avatar rounded-circle"
                    alt="Image placeholder"
                    src="/theme_files/assets/img/team/profile-picture-3.jpg"
                  />
                  <div className="media-body ml-2 text-dark align-items-center d-none d-lg-block">
                    <span className="mb-0 font-small font-weight-bold">
                      {userInfo?.user?.email}
                    </span>
                  </div>
                </div>
              </a>
              <div className="dropdown-menu dashboard-dropdown dropdown-menu-right mt-2">
                <a className="dropdown-item font-weight-bold" href="/dashboard/settings">
                  <span className="fas fa-cog"></span>Settings
                </a>
                <div role="separator" className="dropdown-divider"></div>
                <a
                  className="dropdown-item font-weight-bold"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    localStorage.removeItem("xceltrip_admin");
                    dispatch(logout());
                    navigate("/", { replace: true });
                  }}
                >
                  <span className="fas fa-sign-out-alt text-danger"></span>
                  Logout
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
