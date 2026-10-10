import { Avatar, Badge } from "antd";
import "./header.scss";
import { MenuOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faBell,
  faChartLine,
  faPen,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";
import NotificationEmployer from "../../../components/employers/notification";
import useIsMobile from "../../../hooks/useIsMobile";

function Header({ setIsCollapsed, isCollapsed, onOpenMenu }) {
  const isMobile = useIsMobile();
  const handleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };
  const handleLogout = () => {
    Cookies.remove("token-employer");
    window.location.href = "/nha-tuyen-dung/login";
  };
  
  if (isMobile) {
    return (
      <nav className="headerEmployer headerEmployer--mobile">
        <div className="headerEmployer__header">
          <button onClick={onOpenMenu} className="headerEmployer__button" aria-label="Mở menu">
            <MenuOutlined />
          </button>
          <Link to="/nha-tuyen-dung/app/dashboard">
            <span className="headerEmployer__logo"><img className="logo-img" src="/images/UTEM_LOGO.svg" alt="UTEM" /></span>
          </Link>
        </div>
        <ul className="headerEmployer__icons">
          <li>
            <Link to={"./add-jobs-employer"} aria-label="Đăng tin">
              <FontAwesomeIcon icon={faPen} />
            </Link>
          </li>
          <li>
            <Link to={"./chat-box"} aria-label="Kết nối">
              <FontAwesomeIcon icon={faFacebookMessenger} />
            </Link>
          </li>
          <li className="no-check">
            <NotificationEmployer />
          </li>
        </ul>
      </nav>
    );
  }

  return (
    <>
      <nav className="headerEmployer text-left">
        <div className="flex-div gx-1 align-items-center">
          <div className="headerEmployer__header">
            <button
              onClick={handleCollapsed}
              className="headerEmployer__button"
            >
              <MenuOutlined />
            </button>
            <a href="#!">
              <span className=" headerEmployer__logo"><img className="logo-img" src="/images/UTEM_LOGO.svg" alt="UTEM" /></span>
            </a>
          </div>

          <div className="headerEmployer__navbar">
            <ul className="navbar__ul">
              {/* <li className="navbar__item main">
                <FontAwesomeIcon icon={faChartLine} />
                <span>Báo cáo thị trường tuyển dụng</span>
              </li> */}
              <li className="navbar__item check">
                <Link to={"./add-jobs-employer"}>
                  <FontAwesomeIcon icon={faPen} />
                  <span to={"./add-jobs-employer"}>Đăng tin</span>
                </Link>
              </li>
              <li className="navbar__item check">
                <Link>
                  <FontAwesomeIcon icon={faPen} />
                  <span>Tìm CV</span>
                </Link>
              </li>
              <li className="navbar__item check">
                <Link to={"./chat-box"}>
                  <FontAwesomeIcon icon={faFacebookMessenger} />
                  <span to={"./chat-box"}>Kết nối</span>
                </Link>
              </li>
              {/* <li className="navbar__item check">
                <Link>
                  <FontAwesomeIcon icon={faQuestion} />
                  <span>Trợ giúp</span>
                </Link>
              </li> */}
              <li className="navbar__item no-check">
                <NotificationEmployer />
              </li>
              <li className="navbar__item check" onClick={handleLogout}>
                <span>Đăng xuất</span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
export default Header;
