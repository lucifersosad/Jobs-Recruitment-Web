import {
  faAddressCard,
  faCalendarPlus,
  faFile,
  faHeart,
  faSquareCheck,
} from "@fortawesome/free-regular-svg-icons";
import {
  faArrowRight,
  faDisplay,
  faLocationDot,
  faMagnifyingGlass,
  faSuitcaseMedical,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export const searchJob = [
  {
    label: (
      <a
        className="item-ok"
       
        rel="noopener noreferrer"
        href={"/viec-lam/tim-viec-lam"}
      >
        <div className="item-flex">
        <FontAwesomeIcon icon={faCalendarPlus} />
          <span>Việc làm mới nhất</span>
        </div>
        <div className="item-arrow">
          <FontAwesomeIcon icon={faArrowRight} />
        </div>
      </a>
    ),
    key: "/viec-lam/tim-viec-lam",
  },
  {
    label: (
      <a
        className="item-ok"
       
        rel="noopener noreferrer"
        href={"/viec-lam/tat-ca-viec-lam"}
      >
        <div className="item-flex">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <span>Tìm việc làm</span>
        </div>
        <div className="item-arrow">
          <FontAwesomeIcon icon={faArrowRight} />
        </div>
      </a>
    ),
    key: "/viec-lam/tat-ca-viec-lam",
  },
 
  {
    type: "divider",
  },
  // {
  //   label: (
  //     <a
  //       className="item-ok"
  //       target="_blank"
  //       rel="noopener noreferrer"
  //       href="#!"
  //     >
  //       <div className="item-flex">
  //         <FontAwesomeIcon icon={faLocationDot} />
  //         <span>Ngành nghề / Địa điểm</span>
  //       </div>
  //       <div className="item-arrow">
  //         <FontAwesomeIcon icon={faArrowRight} />
  //       </div>
  //     </a>
  //   ),
  //   key: "1",
  // },
  
  {
    label: (
      <a
        className="item-ok"
      
        rel="noopener noreferrer"
        href="/viec-lam/viec-lam-da-luu"
      >
        <div className="item-flex">
          <FontAwesomeIcon icon={faHeart} />
          <span>Việc làm đã lưu</span>
        </div>
        <div className="item-arrow">
          <FontAwesomeIcon icon={faArrowRight} />
        </div>
      </a>
    ),
    key: "/viec-lam/viec-lam-da-luu",
  },
  {
    label: (
      <a
        className="item-ok"
      
        rel="noopener noreferrer"
        href="/viec-lam/viec-lam-da-ung-tuyen"
      >
        <div className="item-flex">
        <FontAwesomeIcon icon={faSuitcaseMedical} />
          <span>Việc làm đã ứng tuyển</span>
        </div>
        <div className="item-arrow">
          <FontAwesomeIcon icon={faArrowRight} />
        </div>
      </a>
    ),
    key: "/viec-lam/viec-lam-da-ung-tuyen",
  },

  // {
  //   type: "divider",
  // },
  // {
  //   label: (
  //     <a
  //       className="item-ok"
  //       target="_blank"
  //       rel="noopener noreferrer"
  //       href="#!"
  //     >
  //       <div className="item-flex">
  //         <FontAwesomeIcon icon={faSquareCheck} />
  //         <span>Việc làm phù hợp</span>
  //         <div className="item-ok-hot">
  //           HOT
  //         </div>
  //       </div>
  //       <div className="item-arrow">
  //         <FontAwesomeIcon icon={faArrowRight} />
  //       </div>
  //     </a>
  //   ),
  //   key: "4",
  // },
  // {
  //   label: (
  //     <a
  //       className="item-ok"
  //       target="_blank"
  //       rel="noopener noreferrer"
  //       href="#!"
  //     >
  //       <div className="item-flex">
  //         <FontAwesomeIcon icon={faDisplay} />
  //         <span>Việc làm IT</span>
  //         <div className="item-ok-new">
  //           MỚI
  //         </div>
  //       </div>
  //       <div className="item-arrow">
  //         <FontAwesomeIcon icon={faArrowRight} />
  //       </div>
  //     </a>
  //   ),
  //   key: "5",
  // },
  // {
  //   label: (
  //     <a
  //       className="item-ok"
  //       target="_blank"
  //       rel="noopener noreferrer"
  //       href="#!"
  //     >
  //       <div className="item-flex">
  //         <FontAwesomeIcon icon={faAddressCard} />
  //         <span>Thực tập sinh</span>
  //         <div className="item-ok-new">
  //           MỚI
  //         </div>
  //       </div>
  //       <div className="item-arrow">
  //         <FontAwesomeIcon icon={faArrowRight} />
  //       </div>
  //     </a>
  //   ),
  //   key: "6",
  // },
];

export const searchCv = [
  {
    label: (
      <Link
        className="item-ok"
       
        rel="noopener noreferrer"
        to={"/cv/tao-cv"}
      >
        <div className="item-flex" style={{marginLeft: "-5px"}}>
        <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24"><path fill="currentColor" d="M14 2H6c-1.11 0-2 .89-2 2v16c0 1.11.89 2 2 2h7.81c-.53-.91-.81-1.95-.81-3c0-3.31 2.69-6 6-6c.34 0 .67.03 1 .08V8zm-1 7V3.5L18.5 9zm10 11h-3v3h-2v-3h-3v-2h3v-3h2v3h3z"></path></svg>
          <span>Tạo CV</span>
        </div>
        <div className="item-arrow">
          <FontAwesomeIcon icon={faArrowRight} />
        </div>
      </Link>
    ),
    key: "/cv/tao-cv",
  },
  {
    type: "divider",
  },
  {
    label: (
      <Link
        className="item-ok"
       
        rel="noopener noreferrer"
        to={"/cv/quan-ly-cv"}
      >
        <div className="item-flex">
        <FontAwesomeIcon icon={faFile} />
          <span>Quản lý CV</span>
        </div>
        <div className="item-arrow">
          <FontAwesomeIcon icon={faArrowRight} />
        </div>
      </Link>
    ),
    key: "/cv/quan-ly-cv",
  },
  {
    label: (
      <Link
        className="item-ok"
       
        rel="noopener noreferrer"
        to={"/cv/upload-cv"}
      >
        <div className="item-flex">
        <FontAwesomeIcon icon={faUpload} />
          <span>Tải CV lên</span>
        </div>
        <div className="item-arrow">
          <FontAwesomeIcon icon={faArrowRight} />
        </div>
      </Link>
    ),
    key: "/cv/upload-cv",
  },
]