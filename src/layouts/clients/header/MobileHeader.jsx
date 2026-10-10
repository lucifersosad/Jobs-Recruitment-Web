import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Drawer } from "antd";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarPlus,
  faEnvelope,
  faFile,
  faHeart,
  faMessage,
  faPenToSquare,
} from "@fortawesome/free-regular-svg-icons";
import {
  faArrowRightFromBracket,
  faBars,
  faBuilding,
  faFileCirclePlus,
  faGears,
  faLock,
  faMagnifyingGlass,
  faSuitcaseMedical,
  faUpload,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import "./mobileHeader.scss";

const jobLinks = [
  { to: "/viec-lam/tim-viec-lam", icon: faCalendarPlus, label: "Việc làm mới nhất" },
  { to: "/viec-lam/tat-ca-viec-lam", icon: faMagnifyingGlass, label: "Tìm việc làm" },
  { to: "/viec-lam/viec-lam-da-luu", icon: faHeart, label: "Việc làm đã lưu" },
  { to: "/viec-lam/viec-lam-da-ung-tuyen", icon: faSuitcaseMedical, label: "Việc làm đã ứng tuyển" },
];

const cvLinks = [
  { to: "/cv/tao-cv", icon: faFileCirclePlus, label: "Tạo CV" },
  { to: "/cv/quan-ly-cv", icon: faFile, label: "Quản lý CV" },
  { to: "/cv/upload-cv", icon: faUpload, label: "Tải CV lên" },
];

const getAccountLinks = (infoUser) => [
  { to: `/my-profile/${infoUser?.id}`, icon: faUserTie, label: "Hồ sơ của tôi" },
  { to: "/tai-khoan/thong-tin", icon: faPenToSquare, label: "Cài đặt thông tin cá nhân" },
  { to: "/tai-khoan/cai-dat-goi-y-viec-lam", icon: faGears, label: "Cài đặt gợi ý việc làm" },
  { to: "/tai-khoan/mat-khau", icon: faLock, label: "Đổi mật khẩu" },
  { to: "/tai-khoan/cai-dat-thong-bao-email", icon: faEnvelope, label: "Cài đặt nhận email" },
];

function MenuSection({ title, links }) {
  return (
    <div className="mobile-menu__section">
      <div className="mobile-menu__title">{title}</div>
      <ul className="mobile-menu__list">
        {links.map((item) => (
          <li key={item.to}>
            <NavLink className="mobile-menu__item" to={item.to}>
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileHeader({ authenMainClient }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isLogin = authenMainClient?.status;
  const infoUser = authenMainClient?.infoUser;

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const logout = () => {
    Cookies.remove("token-user");
    window.location.href = "/login";
  };

  return (
    <>
      <header className="header mobile-header">
        <NavLink className="mobile-header__logo" to="/">
          <img src="/images/UTEM_LOGO.svg" alt="UTEM" />
        </NavLink>
        <div className="mobile-header__actions">
          {isLogin && (
            <Link className="mobile-header__icon" to="/chat-box" aria-label="Tin nhắn">
              <FontAwesomeIcon icon={faMessage} />
            </Link>
          )}
          <button
            type="button"
            className="mobile-header__icon"
            aria-label="Mở menu"
            onClick={() => setOpen(true)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </header>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        placement="right"
        width="85%"
        rootClassName="mobile-menu"
        title={
          isLogin ? (
            <div className="mobile-menu__user">
              <img src={infoUser?.avatar} alt="avatar" />
              <div>
                <div className="mobile-menu__user-name">{infoUser?.fullName}</div>
                <div className="mobile-menu__user-email">{infoUser?.email}</div>
              </div>
            </div>
          ) : (
            <img className="mobile-menu__logo" src="/images/UTEM_LOGO.svg" alt="UTEM" />
          )
        }
        footer={
          isLogin ? (
            <button type="button" className="mobile-menu__logout" onClick={logout}>
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
              <span>Đăng xuất</span>
            </button>
          ) : (
            <div className="mobile-menu__auth">
              <Link className="mobile-menu__btn mobile-menu__btn--outline" to="/login">
                Đăng nhập
              </Link>
              <Link className="mobile-menu__btn" to="/register">
                Đăng ký
              </Link>
            </div>
          )
        }
      >
        <MenuSection title="Việc làm" links={jobLinks} />
        <MenuSection title="Hồ sơ & CV" links={cvLinks} />
        {isLogin ? (
          <MenuSection title="Tài khoản" links={getAccountLinks(infoUser)} />
        ) : (
          <div className="mobile-menu__section">
            <a className="mobile-menu__item" href="/nha-tuyen-dung">
              <FontAwesomeIcon icon={faBuilding} />
              <span>Dành cho nhà tuyển dụng</span>
            </a>
          </div>
        )}
      </Drawer>
    </>
  );
}

export default MobileHeader;
