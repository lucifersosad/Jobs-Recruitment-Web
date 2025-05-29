import { useEffect, useState } from "react";
import "./overViewCompany.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faChevronDown,
  faChevronUp,
  faLink,
  faUser,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { dataNumberOfWorkers } from "./js/options";
import JobByCompany from "../../../components/clients/jobByCompany";
function OverviewCompany({ record }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [infoCompany, setInfoCompany] = useState({});

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (Object.keys(record).length > 0) {
      record.employerId.numberOfWorkers = dataNumberOfWorkers.find(
        (item) => item.value === record?.employerId?.numberOfWorkers
      )?.label;
      setInfoCompany(record?.employerId);
    }
  }, [record]);

  return (
    <div className="container">
      <div className="box-info-company">
        <div className="box-info mt-3 mb-3">
          <a target="_blank" rel="noreferrer" href={`/cong-ty/${infoCompany?.slug}`}>
            <h3 className="mb-3  title-all">{infoCompany?.companyName}</h3>
          </a>
          <div className="box-flex">
            <div className="image-company">
              <a target="_blank" rel="noreferrer" href={`/cong-ty/${infoCompany?.slug}`}><img src={infoCompany?.logoCompany} alt="" style={{objectFit: "contain"}}/></a>
            </div>
            <div className="content">
              <div className="address mb-2">
                <strong>Địa điểm: </strong>
                {infoCompany?.specificAddressCompany?.split("-")[0] || "Chưa cập nhật"}
              </div>

              <div className="title-info mb-2">Thông tin công ty</div>
              <div className="contact-company row gx-0 gy-2">
                <div className="col-6">
                  <div className="item">
                    <FontAwesomeIcon icon={faUser} />
                    <span>Người liên hệ: {infoCompany?.fullName}</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="item">
                    <FontAwesomeIcon icon={faUserGroup} />
                    <span>Quy mô công ty: {infoCompany?.numberOfWorkers || "Chưa cập nhật"}</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="item">
                    <FontAwesomeIcon icon={faAddressCard} />
                    <span>Loại hình hoạt động: Chưa cập nhật</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="item">
                    <FontAwesomeIcon icon={faLink} />
                    <span>Website: {infoCompany?.website || "Chưa cập nhật"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dest-info mb-3">
          <h3 className="mb-3 title-all">GIỚI THIỆU VỀ CÔNG TY</h3>
          <hr />
          <div className="content">
            {/* <div
              dangerouslySetInnerHTML={{
                __html: infoCompany?.descriptionCompany,
              }}
            /> */}

            {infoCompany?.descriptionCompany ? (
              <>
                <div
                  className={"dest " + (isExpanded ? "expanded " : "")}
                  dangerouslySetInnerHTML={{
                    __html: infoCompany?.descriptionCompany,
                  }}
                />
                {!isExpanded && <div className="filter-blue"></div>}

                <div className="view" onClick={toggleExpand}>
                {isExpanded ? (
                  <div>
                    <span>Thu gọn</span>
                    <FontAwesomeIcon icon={faChevronUp} />
                  </div>
                ) : (
                  <div>
                    <span>Xem thêm</span>
                    <FontAwesomeIcon icon={faChevronDown} />
                  </div>
                )}
                </div>
              </>) : (
                <div>Chưa cập nhật</div>
              )
            }
          </div>
        </div>
        <div className="job-company">
        <h3 className="mb-3 title-all">TUYỂN DỤNG</h3>
        <hr />
          <JobByCompany slug={infoCompany?.slug}/>
        </div>
      </div>
    </div>
  );
}
export default OverviewCompany;
