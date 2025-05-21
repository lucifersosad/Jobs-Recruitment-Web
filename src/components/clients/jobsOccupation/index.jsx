import { Fragment, memo, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { getListJobsOccupation } from "../../../services/clients/jobsApi";
import { Pagination } from "antd";

import { decData } from "../../../helpers/decData";
import "./jobsOccupation.scss";
import { formatSalaryNoVND } from "../../../helpers/salaryConvert";
import { Link } from "react-router-dom";
import Sliders from "../sliders";
// import Slider from "react-slick";

const settingsliders = {
  dots: true,
  arrows: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  // autoplay: true,
  autoplaySpeed: 1000,
  prevArrow: true,
  nextArrow: true,
  appendDots: dots => (
      <div
        style={{
          bottom: "-60px",
          borderRadius: "10px",
          padding: "10px"
        }}
      >
        <ul style={{ margin: "0px" }} className="slick-dots-custom"> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div
        className="slick-dot-custom"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          color: "#5D677A",
          background: "#fff",
          border: "1px solid #ddd",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {i + 1}
      </div>
    )
};

function JobsOccupation() {
  const [listOccupationOne, setListOccupationOne] = useState([]);
  const [listOccupationTwo, setListOccupationTwo] = useState([]);
  const [listOccupationThreed, setListOccupationThreed] = useState([]);

  //Lấy công việc nổi bật
  const getListJobsOne = async (page) => {
    const record = await getListJobsOccupation(
      "dien-dien-tu-dien-lanh",
      page,
      "title salaryMax salaryMin city employerId slug"
    );

    if (record.code === 200) {
      setListOccupationOne({ record: decData(record.data) });
    }
  };
  const getListJobsTwo = async (page) => {
    const record = await getListJobsOccupation(
      "ke-toan-kiem-toan-vxGgTzPsa",
      page,
      "title salaryMax salaryMin city employerId slug"
    );

    if (record.code === 200) {
      setListOccupationTwo({ record: decData(record.data) });
    }
  };
  const getListJobsThreed = async (page) => {
    const record = await getListJobsOccupation(
      "dich-vu-khach-hang-123",
      page,
      "title salaryMax salaryMin city employerId slug"
    );
    if (record.code === 200) {
      setListOccupationThreed({ record: decData(record.data) });
    }
  };
  useEffect(() => {
    const fetchApi = async () => {
      await getListJobsOne(1);
      await getListJobsTwo(1);
      await getListJobsThreed(1);
    };
    fetchApi();
  }, []);
  const changePaginationFeture = async (page) => {
    await getListJobsOne(page);
    await getListJobsTwo(page);
    await getListJobsThreed(page);
  };

  const Custom = () => {
    const item = <div>cc</div>
    return (item, item, item, item)
      
    
  }

  return (
    <div className="cb-section" style={{paddingBottom: 60}}>
      <div className="job__occupation">
        <div className="container">
          <h2 className="text-center title-text">
            VIỆC LÀM THEO NGHỀ NGHIỆP HOT
          </h2>
          <div className="row g-0">
          <div className="col-4 item-box" style={{height: "auto"}}>
          <div className="job__occupation-title col-12">
                <h2 className="text-center">Điện Tử / Điện Lạnh</h2>
              </div>
            </div>
          <div className="col-4 item-box" style={{height: "auto"}}>
              <div className="job__occupation-title col-12">
                <h2 className="text-center">Kế Toán / Kiểm Toán</h2>
              </div>
            </div>
          <div className="col-4 item-box" style={{height: "auto"}}>
              <div className="job__occupation-title col-12">
                <h2 className="text-center">Dịch Vụ / Khách Hàng</h2>
              </div>
            </div>
            
          </div>
          <div className="row">
            <Sliders settings={settingsliders} custom={Array(5).fill(0).map((item, index) => (
        <div key={index}><div className="row g-0">
            <div className="col-4 item-box">
              <div className="job__occupation-item">
                {listOccupationOne?.record?.length > 0 &&
                  listOccupationOne.record.map((dataMapOne, index) => (
                    <div
                      key={index}
                      className="job__occupation-boxJob row justify-content-center align-items-center "
                    >
                      <div className="job__occupation-boxImage col-3">
                        <a href={`/tim-viec-lam/${dataMapOne.slug}`} target="_blank" rel="noreferrer"><img
                          src={dataMapOne.employerId.logoCompany}
                          alt="testok"
                          style={{objectFit: "contain"}}
                        ></img></a>
                      </div>
                      <div className="job__occupation-content col-9">
                        <a  href={`/tim-viec-lam/${dataMapOne.slug}`} target="_blank" rel="noreferrer">
                        <h2 title={dataMapOne.title}>{dataMapOne.title}</h2>
                      </a>
                        <h3 className="mt-1">
                          {dataMapOne.employerId.companyName}
                        </h3>
                        <h4 className="mt-1">
                          Lương:{" "}
                          {formatSalaryNoVND(
                            dataMapOne?.salaryMin,
                            dataMapOne?.salaryMax
                          )}{" "}
                          VNĐ
                        </h4>
                        <h5 className="mt-1 ">
                            <FontAwesomeIcon icon={faLocationDot} />
                            <span style={{marginLeft:"5px",fontWeight:"500",color:"#5d677a"}}>{dataMapOne.city.name}</span>
                          </h5>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="col-4 item-box">
              
              <div className="job__occupation-item">
                {listOccupationTwo?.record?.length > 0 &&
                  listOccupationTwo.record.map((dataMapOne, index) => (
                    <div
                    to={`/tim-viec-lam/${dataMapOne.slug}`}    
                      key={index}
                      className="job__occupation-boxJob row justify-content-center align-items-center "
                    >
                      <div className="job__occupation-boxImage col-3">
                      <a href={`/tim-viec-lam/${dataMapOne.slug}`} target="_blank" rel="noreferrer">
                        <img
                          src={dataMapOne.employerId.logoCompany}
                          alt="testok"
                          style={{objectFit: "contain"}}
                        ></img>
                      </a>
                        
                      </div>
                      <div className="job__occupation-content col-9">
                        <a  href={`/tim-viec-lam/${dataMapOne.slug}`} target="_blank" rel="noreferrer">
                        <h2 title={dataMapOne.title}>{dataMapOne.title}</h2>
                      </a>
                        <h3 className="mt-1">
                          {dataMapOne.employerId.companyName}
                        </h3>
                        <h4 className="mt-1">
                          Lương:{" "}
                          {formatSalaryNoVND(
                            dataMapOne?.salaryMin,
                            dataMapOne?.salaryMax
                          )}{" "}
                          VNĐ
                        </h4>
                        <h5 className="mt-1 ">
                            <FontAwesomeIcon icon={faLocationDot} />
                            <span style={{marginLeft:"5px",fontWeight:"500",color:"#5d677a"}}>{dataMapOne.city.name}</span>
                          </h5>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="col-4 item-box">
              
              <div className="job__occupation-item">
                {listOccupationThreed?.record?.length > 0 &&
                  listOccupationThreed.record.map((dataMapOne, index) => (
                    <div
                        to={`/tim-viec-lam/${dataMapOne.slug}`}    
                      key={index}
                      className="job__occupation-boxJob row justify-content-center align-items-center "
                    >
                      <div className="job__occupation-boxImage col-3">
                      <a  href={`/tim-viec-lam/${dataMapOne.slug}`} target="_blank" rel="noreferrer">
                        <img
                          src={dataMapOne.employerId.logoCompany}
                          alt="testok"
                          style={{objectFit: "contain"}}
                        ></img>
                      </a>
                        
                      </div>
                      <div className="job__occupation-content col-9">
                      <a  href={`/tim-viec-lam/${dataMapOne.slug}`} target="_blank" rel="noreferrer">
                        <h2 title={dataMapOne.title}>{dataMapOne.title}</h2>
                      </a>
                        
                        <h3 className="mt-1">
                          {dataMapOne.employerId.companyName}
                        </h3>
                        <h4 className="mt-1">
                          Lương:{" "}
                          {formatSalaryNoVND(
                            dataMapOne?.salaryMin,
                            dataMapOne?.salaryMax
                          )}{" "}
                          VNĐ
                        </h4>
                        <h5 className="mt-1 ">
                            <FontAwesomeIcon icon={faLocationDot} />
                            <span style={{marginLeft:"5px",fontWeight:"500",color:"#5d677a"}}>{dataMapOne.city.name}</span>
                          </h5>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div></div>
      ))}>
        
    </Sliders>
          </div>
          {/* <div className="row">
            <div className="col-4 item-box">
              <div className="job__occupation-title col-12">
                <h2 className="text-center">Điện Tử / Điện Lạnh</h2>
              </div>
              <div className="job__occupation-item col-12 ">
                {listOccupationOne?.record?.length > 0 &&
                  listOccupationOne.record.map((dataMapOne, index) => (
                    <Link
                    to={`/tim-viec-lam/${dataMapOne.slug}`}    
                      key={index}
                      className="job__occupation-boxJob row justify-content-center align-items-center "
                    >
                      <div className="job__occupation-boxImage col-3">
                        <img
                          src={dataMapOne.employerId.logoCompany}
                          alt="testok"
                          style={{objectFit: "contain"}}
                        ></img>
                      </div>
                      <div className="job__occupation-content col-9">
                        <h2 title={dataMapOne.title}>{dataMapOne.title}</h2>
                        <h3 className="mt-1">
                          {dataMapOne.employerId.companyName}
                        </h3>
                        <h4 className="mt-1">
                          Lương:{" "}
                          {formatSalaryNoVND(
                            dataMapOne?.salaryMin,
                            dataMapOne?.salaryMax
                          )}{" "}
                          VNĐ
                        </h4>
                        <h5 className="mt-1 ">
                            <FontAwesomeIcon icon={faLocationDot} />
                            <span style={{marginLeft:"5px",fontWeight:"500",color:"#5d677a"}}>{dataMapOne.city.name}</span>
                          </h5>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

            <div className="col-4 item-box">
              <div className="job__occupation-title col-12">
                <h2 className="text-center">Kế Toán / Kiểm Toán</h2>
              </div>
              <div className="job__occupation-item col-12 ">
                {listOccupationTwo?.record?.length > 0 &&
                  listOccupationTwo.record.map((dataMapOne, index) => (
                    <Link
                    to={`/tim-viec-lam/${dataMapOne.slug}`}    
                      key={index}
                      className="job__occupation-boxJob row justify-content-center align-items-center "
                    >
                      <div className="job__occupation-boxImage col-3">
                        <img
                          src={dataMapOne.employerId.logoCompany}
                          alt="testok"
                          style={{objectFit: "contain"}}
                        ></img>
                      </div>
                      <div className="job__occupation-content col-9">
                        <h2 title={dataMapOne.title}>{dataMapOne.title}</h2>
                        <h3 className="mt-1">
                          {dataMapOne.employerId.companyName}
                        </h3>
                        <h4 className="mt-1">
                          Lương:{" "}
                          {formatSalaryNoVND(
                            dataMapOne?.salaryMin,
                            dataMapOne?.salaryMax
                          )}{" "}
                          VNĐ
                        </h4>
                        <h5 className="mt-1 ">
                            <FontAwesomeIcon icon={faLocationDot} />
                            <span style={{marginLeft:"5px",fontWeight:"500",color:"#5d677a"}}>{dataMapOne.city.name}</span>
                          </h5>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

            <div className="col-4 item-box">
              <div className="job__occupation-title col-12">
                <h2 className="text-center">Dịch Vụ / Khách Hàng</h2>
              </div>
              <div className="job__occupation-item col-12 ">
                {listOccupationThreed?.record?.length > 0 &&
                  listOccupationThreed.record.map((dataMapOne, index) => (
                    <Link
                        to={`/tim-viec-lam/${dataMapOne.slug}`}    
                      key={index}
                      className="job__occupation-boxJob row justify-content-center align-items-center "
                    >
                      <div className="job__occupation-boxImage col-3">
                        <img
                          src={dataMapOne.employerId.logoCompany}
                          alt="testok"
                          style={{objectFit: "contain"}}
                        ></img>
                      </div>
                      <div className="job__occupation-content col-9">
                        <h2 title={dataMapOne.title}>{dataMapOne.title}</h2>
                        <h3 className="mt-1">
                          {dataMapOne.employerId.companyName}
                        </h3>
                        <h4 className="mt-1">
                          Lương:{" "}
                          {formatSalaryNoVND(
                            dataMapOne?.salaryMin,
                            dataMapOne?.salaryMax
                          )}{" "}
                          VNĐ
                        </h4>
                        <h5 className="mt-1 ">
                            <FontAwesomeIcon icon={faLocationDot} />
                            <span style={{marginLeft:"5px",fontWeight:"500",color:"#5d677a"}}>{dataMapOne.city.name}</span>
                          </h5>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div> */}
        </div>
      </div>
      {/* {listOccupationOne?.record?.length > 0 && (
        <Pagination
          onChange={changePaginationFeture}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "43px",
          }}
          defaultCurrent={1}
          total={30}
        />
      )} */}
    </div>
  );
}

const MemoizedJobsOccupation = memo(JobsOccupation);
export default MemoizedJobsOccupation;
