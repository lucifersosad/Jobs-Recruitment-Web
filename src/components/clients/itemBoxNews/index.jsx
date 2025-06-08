/* eslint-disable no-unused-vars */
import { memo, useEffect, useState } from "react";
import "./itemBoxNews.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {

  faClock,
  faLocationDot,
  faHeart as solidHeart
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { formatSalaryNoVND2 } from "../../../helpers/salaryConvert";
import {
  formatTimeDifferenceMongoDb,
  formatTimeRemainingMongoDb,
} from "../../../helpers/formartDate";
import { Link, useNavigate } from "react-router-dom";
import { Pagination, Skeleton, message } from "antd";

import { saveJob } from "../../../services/clients/user-userApi";
import { useDispatch, useSelector } from "react-redux";
import { UpdateDataAuthClient } from "../../../update-data-reducer/clients/updateDataClient";
import BoxNewSkeleton from "./boxNewSkeleton";
import CustomEmpty from "../../alls/CustomEmpty";
function ItemBoxNews({
  colGrid = 'col-md-8',
  recordItem,
  handleChangePagination,
  countPagination = 1,
  defaultValue = 1,
  loading,
}) {
  console.log("🚀 ~ recordItem:", recordItem)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dataUser, setDataUser] = useState({});
  const authenMainClient = useSelector(
    (status) => status.authenticationReducerClient
  );
  const [messageApi, contextHolder] = message.useMessage();
  const handleSaveJob = async (value, action = "save") => {
    try {
      if (!value) return;
      const objectNew = {
        action: action,
        idJob: value,
      };
      const result = await saveJob(objectNew);
      if(result.code === 402){
        //đây là chưa đăng nhập nên chuyển hướng qua trang đăng nhập
        navigate("/login");
        return;
      }
      if (result.code === 200) {
        messageApi.success({
          type: "success",
          content: result.success,
        });
        UpdateDataAuthClient(dispatch);
      } else {
        messageApi.error({
          type: "error",
          content: result.error,
        });
      }
    } catch (error) {
      messageApi.error({
        type: "error",
        content: "Lỗi gì đó rồi!",
      });
    }
  };

  useEffect(() => {
    if (authenMainClient?.infoUser) {
      setDataUser(authenMainClient?.infoUser);
    }
  }, [authenMainClient?.infoUser]);

  if (loading) return <BoxNewSkeleton colGrid={colGrid}/>

  return (
    <div className={`items-box__news ${colGrid}`}>
      {contextHolder}
      {recordItem.length > 0 ?
        recordItem.map((item, index) => (
          <div key={index} className="items-box__news-item ">
            <div className="items-box__avatar">
              <a target="_blank" rel="noreferrer" href={`/tim-viec-lam/${item?.slug}`}>
                <img
                  src={item?.logoCompany}
                  alt={item?.companyName}
                  title={item.title}
                  style={{objectFit: "contain"}}
                />
              </a>
            </div>
            <div className="items-box__body">
              <div className="title_all">
                <h3 className="title">
                  <a target="_blank" rel="noreferrer" href={`/tim-viec-lam/${item?.slug}`}>{item.title}</a>
                </h3>
                <label className="title-salary">
                  {" "}
                  {formatSalaryNoVND2(item?.salaryMin, item?.salaryMax)} triệu
                </label>
              </div>
              <div className="company">
                <a target="_blank" rel="noreferrer" href={`/cong-ty/${item?.slugCompany}`}>{item?.companyName}</a>
              </div>
              <div className="updateAt">
                Cập nhật {formatTimeDifferenceMongoDb(item.updatedAt)} trước
              </div>
              <div className="info-job">
                <div className="time-line">
                  <div className="address">
                    <FontAwesomeIcon icon={faLocationDot} />
                    <span>{item?.city?.name}</span>
                  </div>
                  <div className="end_date">
                    <FontAwesomeIcon icon={faClock} />
                    <div>
                      Còn{" "}
                      <strong>
                        {formatTimeRemainingMongoDb(item?.end_date)}
                      </strong>{" "}
                      để ứng tuyển
                    </div>
                  </div>
                </div>
                <div className="button-line">
                  <a
                    href={`/tim-viec-lam/${item?.slug}?modal=show`}
                    className={`button-all${item?.listProfileRequirement?.some(item => item?.idUser === dataUser?.id) ? ' disabled' : ''}`}
                  >
                    Ứng tuyển
                  </a>
                  {dataUser?.listJobSave?.some(job => item?._id === job.idJob) ? (
                    <div
                      title="Bỏ lưu công việc"
                      onClick={() => {
                        handleSaveJob(item?._id, "delete");
                      }}
                      className="box-heart"
                    >
                      <FontAwesomeIcon icon={solidHeart} />
                    </div>
                  ) : (
                    <div
                      title="Lưu công việc"
                      onClick={() => {
                        handleSaveJob(item?._id, "save");
                      }}
                      className="box-heart"
                    >
                      <FontAwesomeIcon icon={regularHeart} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )) : <CustomEmpty description="Không tìm thấy việc làm" />}
      {recordItem.length > 0 && (
        <Pagination
          onChange={handleChangePagination}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "2rem",
          }}
          current={defaultValue}
          total={countPagination * 10}
        />
      )}
      
    </div>
  );
}

const MemoizedItemBoxNews = memo(ItemBoxNews);

export default MemoizedItemBoxNews;
