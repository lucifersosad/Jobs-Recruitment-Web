import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faUserGroup, faPhone } from "@fortawesome/free-solid-svg-icons";

function CompanyHeader({ companyData }) {
  return (
    <div className="box-info-company mb-3">
      <div className="header-company">
        <div className="banner">
          <img src={companyData?.bannerCompany} alt="Banner công ty" />
        </div>
        <div className="comapany-logo">
          <div className="company-image-logo">
            <img src={companyData?.logoCompany} alt="Logo công ty" />
          </div>
        </div>
        <div className="company-detail">
          <div className="box-detail">
            <h1>CÔNG TY {companyData?.companyName}</h1>
            <div className="box-icon">
              <div className="item">
                <FontAwesomeIcon icon={faLink} />
                <span>{companyData?.website}</span>
              </div>
              <div className="item">
                <FontAwesomeIcon icon={faUserGroup} />
                <span>{companyData?.numberOfWorkers} nhân viên</span>
              </div>
              <div className="item">
                <FontAwesomeIcon icon={faPhone} />
                <span>{companyData?.phoneCompany}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyHeader; 