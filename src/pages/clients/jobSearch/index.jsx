import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchApiJobSearch } from "./js/fetchApi";
import "./jobSearch.scss";
import { Flex, Space, Tabs, Tooltip } from "antd";
import InfoJob from "./infoJob";
import OverviewCompany from "./overviewCompany";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faFlag } from "@fortawesome/free-regular-svg-icons";
import { ShareAltOutlined } from "@ant-design/icons";
import {
  faFacebookF,
  faLinkedinIn,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";
import { formatSalaryNoVND } from "../../../helpers/salaryConvert";
import banner from "./images/banner.png";
import ModelJobSearch from "./modelJobSearch";
import { useSelector } from "react-redux";
import { userViewJob } from "../../../services/clients/jobsApi";
import { useQuery } from "../../../helpers/getQuery";
import JobSkeleton from "./jobSkeleton";
import ModalReviewCV from "./modalReviewCV";

function JobSearch() {
  const query = useQuery();
  const showModel = query.get("modal");
  const [loading, setLoading] = useState(true)

  const { slug } = useParams();
  const [recordMain, setRecordMain] = useState({});
  const navigate = useNavigate();
  const [infoUserC, setInfoUserC] = useState(null);
  const authenMainClient = useSelector(
    (status) => status.authenticationReducerClient
  );
  const items = [
    {
      key: "1",
      label: "Chi Tiết",
      children: <InfoJob record={recordMain} />,
    },
    {
      key: "2",
      label: "Tổng Quan Công Ty",
      children: <OverviewCompany record={recordMain}/>,
    },
  ];

  const ExtraTab = () => (
    <Space>
      <Tooltip
        className=""
        title={
          <ul className="tooltip-share">
            <li>
              <a href="#!">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
            </li>
            <li>
              <a href="#!">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
            </li>
            <li>
              <a href="#!">
                <FontAwesomeIcon icon={faGoogle} />
              </a>
            </li>
          </ul>
        }
        color="#fff"
      >
        <a href="#!">
          <ShareAltOutlined />
        </a>
      </Tooltip>
      <Tooltip
        color="#fff"
        title={<span style={{ color: "#5d677a" }}>Báo xấu</span>}
      >
        <a href="#!">
          <FontAwesomeIcon icon={faFlag} />
        </a>
      </Tooltip>
    </Space>
  );

  const loadViewJob = async () => {
    const objectNew = {
      idJob: recordMain._id,
      idUser: infoUserC.id,
    };
    await userViewJob(objectNew);
  };

  useEffect(() => {
    setLoading(true)
    window.scrollTo(0, 0);
    fetchApiJobSearch(setRecordMain, slug, navigate, setLoading);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    const { infoUser } = authenMainClient;
    if (!infoUser) return;
    if (Object.keys(infoUser).length > 0) {
      setInfoUserC(infoUser);
    }
    fetchApiJobSearch(setRecordMain, slug, navigate);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenMainClient?.infoUser]);

  useEffect(() => {
    if (!recordMain || !infoUserC) return;
    if (
      Object.keys(recordMain).length > 0 &&
      Object.keys(infoUserC).length > 0
    ) {
      loadViewJob();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoUserC, recordMain]);

  if (loading) return <JobSkeleton />

  return (
    <>
      <section className="cb-section cb-section-padding-bottom deltail-job">
          <div className="container">
            <div className="row">
              <div className="col-12 mb-15">
                <div className="job-search-one">
                  <div className="job-search-one__banner">
                    <div className="image">
                      <img src={banner} alt="ok" />
                    </div>
                  </div>
                  <div className="job-search-one__content">
                    <div className="job-search-one__desc">
                      <h1>{recordMain.title}</h1>
                      <a target="_blank" rel="noreferrer" href={"/cong-ty/" + recordMain?.employerId?.slug}>
                        {recordMain.companyName}
                      </a>
                    </div>
                    <div className="job-search-one__apply">
                      <Flex gap={10}>
                        <ModalReviewCV
                          showModel={showModel}
                          infoUser={infoUserC}
                          record={recordMain}
                        />
                        <ModelJobSearch
                          showModel={showModel}
                          infoUser={infoUserC}
                          record={recordMain}
                        />
                      </Flex>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-9 ">
                <Tabs
                  defaultActiveKey="1"
                  items={items}
                  tabBarExtraContent={{ right: <ExtraTab /> }}
                />
              </div>
              <div className="col-lg-3">
                <div className="side-wrapper">
                  <div className="side-wrapper__title">
                    <p>Các công việc tương tự</p>
                  </div>
                  <section className="side-wrapper__list">
                    <div className="jobs-list">
                      {recordMain &&
                        recordMain.jobByCategories?.length > 0 &&
                        recordMain.jobByCategories.map((item, index) => (
                          <div key={index}>
                            <div className="job-item">
                              <div className="figure row">
                                <div className="image col-5">
                                  <span title={item.employerId.companyName}>
                                    <a target="_blank" rel="noreferrer" href={`/tim-viec-lam/${item?.slug}`}>
                                      <img
                                      className="lazy-bg"
                                      src={item.employerId.logoCompany}
                                      alt={item.employerId.companyName}
                                      style={{ objectFit: "contain" }}
                                    />
                                    </a>
                                  </span>
                                </div>
                                <div className="figcaption col-7">
                                  <div className="title">
                                    <a
                                      target="_blank" rel="noreferrer"
                                      href={`/tim-viec-lam/${item.slug}`}
                                      className="job_link"
                                      title={item.title}
                                    >
                                      {item.title}
                                    </a>
                                  </div>
                                  <div className="caption">
                                    <a
                                      target="_blank" rel="noreferrer"
                                      className="company-name"
                                      href={`/cong-ty/${item.employerId.slug}`}
                                      title={item.employerId.companyName}
                                    >
                                      {item.employerId.companyName}
                                    </a>
                                    <p className="salary">
                                      <em className="fa fa-usd" />
                                      Lương:{" "}
                                      {formatSalaryNoVND(
                                        item?.salaryMin,
                                        item?.salaryMax
                                      )}
                                    </p>
                                    <div className="location">
                                      <em className="mdi mdi-map-marker" />
                                      <ul>
                                        <li>
                                          {" "}
                                          <FontAwesomeIcon
                                            icon={faLocationDot}
                                          />{" "}
                                          {item?.city?.name}
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr />
                          </div>
                        ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}
export default JobSearch;
