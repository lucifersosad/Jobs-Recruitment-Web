import { useEffect, useState } from "react";
import MemoizedNewsJobHeader from "../../../components/clients/newsJobHeader";
import { jobApplyUser } from "../../../services/clients/jobsApi";
import { decData } from "../../../helpers/decData";
import "./jobApply.scss";
import { Pagination, Select } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faMessage } from "@fortawesome/free-solid-svg-icons";
import { formatSalaryNoVND2 } from "../../../helpers/salaryConvert";
import moment from "moment";

import { useQuery } from "../../../helpers/getQuery";
import MemoizedItemBoxCustom from "../../../components/clients/itemBoxCustom";
import { Link } from "react-router-dom";
import EmptyJob from "../../../components/clients/emptyJob";
function ListJobAppy() {
  const query = useQuery();
  const page = query.get("page") || 1;
  const [data, setData] = useState([]);
  const [countPagination, setCountPagination] = useState(0);
  const fetchApi = async (status = "") => {
    const result = await jobApplyUser(status, page);
    if (result.code === 200) {
      setData(decData(result.data));
      setCountPagination(result.countCvs);
    }
      console.log("🚀 ~ fetchApi ~ result.data:", decData(result.data))
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const options = [
    {
      value: "",
      label: "Tất cả",
    },
    {
      value: "pending",
      label: "Đã ứng tuyển",
    },
    {
      value: "employer-seen-cv",
      label: "NTD đã xem hồ sơ",
    },
    {
      value: "accept",
      label: "Hồ sơ được chấp nhận",
    },
    {
      value: "refuse",
      label: "Hồ sơ bị từ chối",
    },
  ];
  const handleChangeSelect = (value) => {
    fetchApi(value);
  };
  const handleChangePagination = (value) => {};
  return (
    <>
      <div className="col-8 ">
        <div className="box-settings-info mb-3">
          <div className="job-saves">
            <div className="job-saves__header mb-3">
              <MemoizedNewsJobHeader
                title={"Việc làm đã ứng tuyển"}
                description={
                  "Xem lại danh sách những việc làm mà bạn đã ứng tuyển trước đó. Xem ngay để không bỏ lỡ cơ hội nghề nghiệp dành cho bạn."
                }
              />
            </div>
            <div className="job-saves__body">
              <div className="search-saves mb-4">
                <div className="title">Công việc đã ứng tuyển</div>
                <div className="select">
                  <Select
                    onChange={handleChangeSelect}
                    style={{
                      width: 180,
                    }}
                    defaultValue={""}
                    optionFilterProp="children"
                    options={options}
                  />
                </div>
              </div>
              <div className="info-job-save">
                {data.length > 0 &&
                  data.map((item, index) => (
                    <div key={index} className="item-job mb-4">
                      <div className="logo-company">
                        <img
                          src={item?.employerId?.logoCompany}
                          alt="logo"
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      <div className="info">
                        <div className="box-content">
                          <Link to={`/tim-viec-lam/${item?.slug}`}>
                            {item?.title}
                          </Link>
                          <div>
                            {formatSalaryNoVND2(
                              item?.salaryMin,
                              item?.salaryMax
                            )}{" "}
                            triệu
                          </div>
                        </div>
                        <div className="name-company">{item?.employerId?.companyName}</div>
                        <div className="time-apply">
                          Thời gian ứng tuyển:{" "}
                          {moment(item?.createdAtApplyJob).format(
                            "DD-MM-YYYY hh:mm A"
                          )}
                        </div>
                        <div className="box-content2">
                          <div className="view-cv">
                            CV đã ứng tuyển:{" "}
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={`https://drive.google.com/file/d/${item?.id_file_cv}/preview`}
                              style={{
                                color: "#5dcaf9",
                                textDecoration: "underline",
                                cursor: "pointer",
                              }}
                            >
                              CV tải lên
                            </a>
                          </div>
                          <div className="box-icon">
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={`/chat-box/t/${item?.employerId?._id}`}
                              className="icons"
                            >
                              <FontAwesomeIcon icon={faMessage} />
                              Nhắn tin
                            </a>
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={`https://drive.google.com/file/d/${item?.id_file_cv}/preview`}
                              className="icons"
                            >
                              <FontAwesomeIcon icon={faEye} />
                              Xem cv
                            </a>
                          </div>
                        </div>
                        <hr />
                        <div className="box-content3">
                          <div className="status">
                            Trạng thái:
                            {item?.statusApplyJob === "pending" && (
                              <span className="pending"> Đã ứng tuyển </span>
                            )}
                            {item?.statusApplyJob === "refuse" && (
                              <span className="refuse"> Bị từ chối </span>
                            )}
                            {item?.statusApplyJob === "accept" && (
                              <span className="accept"> Được chấp nhận </span>
                            )}
                          </div>
                          <div className="time">
                            Vào lúc:{" "}
                            {moment(item?.createdAtApplyJob).format(
                              "DD-MM-YYYY hh:mm A"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="tag">
                        {item?.employerViewCv > 0 ? (
                          <span className="seen">NTD Đã xem CV</span>
                        ) : (
                          <span className="no-seen">NTD Chưa xem CV</span>
                        )}
                      </div>
                    </div>
                  ))}
                {data.length === 0 && <EmptyJob />}
              </div>
              <div className="pagination-save">
                <Pagination
                  onChange={handleChangePagination}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "2rem",
                  }}
                  current={page}
                  total={countPagination * 10}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="box-settings-info">
          <MemoizedItemBoxCustom />
        </div>
      </div>
    </>
  );
}
export default ListJobAppy;
