import { useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBolt,
  faBriefcase,
  faFileLines,
  faHandshake,
  faPaperPlane,
  faShieldHalved,
  faStar,
  faUserTie,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import "./EmptyChatBox.scss";

//Nội dung riêng cho từng phía, giao diện dùng chung
const CONFIG = {
  client: {
    selectName: (state) =>
      state.authenticationReducerClient?.infoUser?.fullName,
    friendIcon: faUserTie,
    friendText: "CV của bạn rất ấn tượng!",
    meText: "Cảm ơn anh/chị nhiều ạ 🎉",
    desc: "Chọn một cuộc trò chuyện để bắt đầu kết nối với nhà tuyển dụng. Cơ hội tiếp theo có thể chỉ cách bạn một tin nhắn.",
    cta: {
      to: "/viec-lam/tat-ca-viec-lam",
      icon: faBriefcase,
      label: "Khám phá việc làm",
    },
    features: [
      { icon: faBolt, label: "Phản hồi tức thì" },
      { icon: faUserTie, label: "Kết nối trực tiếp HR" },
      { icon: faShieldHalved, label: "Riêng tư & bảo mật" },
    ],
  },
  employer: {
    selectName: (state) =>
      state.authenticationReducerEmployer?.infoUserEmployer?.fullName,
    friendIcon: faUsers,
    friendText: "Em rất mong được phỏng vấn ạ!",
    meText: "Hẹn bạn 9h sáng thứ Hai nhé 🤝",
    desc: "Chọn một ứng viên để bắt đầu trao đổi. Phản hồi nhanh giúp bạn giữ chân những ứng viên tốt nhất.",
    cta: {
      to: "/nha-tuyen-dung/app/management-cvs",
      icon: faFileLines,
      label: "Xem CV ứng tuyển",
    },
    features: [
      { icon: faBolt, label: "Phản hồi tức thì" },
      { icon: faUsers, label: "Kết nối trực tiếp ứng viên" },
      { icon: faShieldHalved, label: "Riêng tư & bảo mật" },
    ],
  },
};

const ORBIT_ICONS = [faBriefcase, faFileLines, faHandshake, faStar, faPaperPlane, faUserTie];

function EmptyChatBox({ role = "client" }) {
  const config = CONFIG[role] || CONFIG.client;
  const rootRef = useRef(null);
  const fullName = useSelector(config.selectName);
  const firstName = fullName?.trim().split(" ").pop() || "bạn";

  //Hiệu ứng nghiêng nhẹ theo chuột (parallax)
  const handleMouseMove = (e) => {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--mx", x.toFixed(3));
    el.style.setProperty("--my", y.toFixed(3));
  };
  const handleMouseLeave = () => {
    rootRef.current?.style.setProperty("--mx", 0);
    rootRef.current?.style.setProperty("--my", 0);
  };

  return (
    <div
      className={`empty-chat empty-chat--${role}`}
      ref={rootRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="empty-chat__bg" aria-hidden="true">
        <span className="blob blob--accent" />
        <span className="blob blob--blue" />
        <span className="blob blob--navy" />
        <span className="grid" />
      </div>

      <div className="empty-chat__inner">
        {/* Khung cảnh chat minh hoạ */}
        <div className="empty-chat__scene" aria-hidden="true">
          <div className="ring ring--outer">
            {ORBIT_ICONS.map((icon, index) => (
              <span
                key={index}
                className="ring__item"
                style={{ "--i": index, "--n": ORBIT_ICONS.length }}
              >
                <span className="orbit-icon">
                  <FontAwesomeIcon icon={icon} />
                </span>
              </span>
            ))}
          </div>
          <div className="ring ring--inner" />

          <div className="phone">
            <div className="phone__head">
              <span className="phone__dot" />
              <span className="phone__title">UTEM Chat</span>
            </div>
            <div className="bubble bubble--friend">
              <FontAwesomeIcon icon={config.friendIcon} />
              {config.friendText}
            </div>
            <div className="bubble bubble--me">{config.meText}</div>
            <div className="bubble bubble--friend bubble--typing">
              <span />
              <span />
              <span />
            </div>
          </div>

          <span className="spark spark--1" />
          <span className="spark spark--2" />
          <span className="spark spark--3" />
        </div>

        <h2 className="empty-chat__title">
          Xin chào, <span>{firstName}</span> <i className="wave">👋</i>
        </h2>
        <p className="empty-chat__desc">{config.desc}</p>

        <Link to={config.cta.to} className="empty-chat__cta">
          <FontAwesomeIcon icon={config.cta.icon} />
          {config.cta.label}
        </Link>

        <div className="empty-chat__features">
          {config.features.map((item) => (
            <span key={item.label}>
              <FontAwesomeIcon icon={item.icon} /> {item.label}
            </span>
          ))}
        </div>

        <div className="empty-chat__hint">
          <FontAwesomeIcon icon={faArrowLeft} /> Danh sách hội thoại ở bên trái
        </div>
      </div>
    </div>
  );
}
export default EmptyChatBox;
