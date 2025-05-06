import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

function IntroductionCard({ companyData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="description-box mb-3">
      <div className="title-header1">
        <h2>Giới thiệu công ty</h2>
      </div>
      <div className="box-item-content">
        <div
          className={"dest " + (isExpanded ? "expanded " : "")}
          dangerouslySetInnerHTML={{
            __html: companyData?.descriptionCompany,
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
      </div>
    </div>
  );
}

export default IntroductionCard; 