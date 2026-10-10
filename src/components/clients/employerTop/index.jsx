import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./employerTop.scss";

import Sliders from "../sliders";
import { memo } from "react";
import useIsMobile from "../../../hooks/useIsMobile";

function EmployerTop(props) {
  const { listEmployers } = props;
  const isMobile = useIsMobile();

  const settingsliders = {
    arrows: true, // Đảm bảo rằng arrows đã được đặt là true
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 1000,
    prevArrow: true,
    nextArrow: true,
  };

  const employerItems = listEmployers.map((data, index) => (
    <div key={index} className={`employer__top-item${isMobile ? "" : " col-2"}`}>
      <div className="image">
        <a
          target={isMobile ? undefined : "_blank"} rel="noreferrer"
          href={`/cong-ty/${data?.slug}`}
        >
          <img
            style={{objectFit: "contain"}}
            src={data.logoCompany}
            alt={`Anh${data.companyName}`}
          ></img>
        </a>
      </div>
    </div>
  ));

  return (
    <div className="employer__top cb-section" style={{paddingBottom: 60}}>
      <div className="container">
        <h2 className="text-center title-text">NHÀ TUYỂN DỤNG HÀNG ĐẦU</h2>
        {isMobile ? (
          <div className="dir-line employer__top-scroll">{employerItems}</div>
        ) : (
          <div className="row dir-line">
            <Sliders settings={settingsliders} custom={employerItems} />
          </div>
        )}
      </div>
    </div>
  );
}
const MemoizedEmployerTop = memo(EmployerTop);
export default MemoizedEmployerTop;
