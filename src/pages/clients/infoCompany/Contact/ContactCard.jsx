import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faMap } from "@fortawesome/free-solid-svg-icons";
import MemoizedBoxGoogleMap from "../../../../components/clients/boxGoogleMap";

function ContactCard({ companyData, mapLocation }) {
  return (
    <div className="info-contact">
      <div className="box-contact mb-2">
        <div className="title-header1">
          <h2>Thông tin liên hệ</h2>
        </div>
        <div className="box-item-content">
          <div className="box-address">
            <div className="item-grid mb-2">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>Địa chỉ công ty</span>
            </div>
            <div className="content-grid">
              {companyData?.specificAddressCompany}
            </div>
          </div>
          <hr />
          <div className="box-map">
            <div className="item-grid mb-2">
              <FontAwesomeIcon icon={faMap} />
              <span>Xem bản đồ</span>
            </div>
            <div className="content-grid">
              <div
                style={{ borderRadius: "10px", overflow: "hidden" }}
              >
                <MemoizedBoxGoogleMap
                  height={300}
                  latitude={mapLocation[0]}
                  longitude={mapLocation[1]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactCard; 