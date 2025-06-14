import { Link, useLocation, useParams } from "react-router-dom";
import "./detailJob.scss";
import banner from "./images/banner.png";
import { Menu, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFile } from "@fortawesome/free-regular-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Spark } from "../../../components/clients/customIcon";

import ApplyCv from "./appllyCv";
import ViewedJob from "./viewedJob";
import FollowedCv from "./followedCv";
import SuggestedCv from "./suggestedCv";
import { useEffect, useState } from "react";
import { infoJobsEmployer } from "../../../services/employers/jobsApi";
import { decData } from "../../../helpers/decData";
import MemoizedInfoJobEmployer from "./infoJob";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function DetailJob() {
  const param = useParams();
  const query = useQuery();
  const queryGet = query.get("active_tab");
  const [data, setData] = useState({});
  const [cv_open_contact, setCvOpenContact] = useState(0);
  const [countViewCv, setCountViewCv] = useState(0);
  const [loading, setLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage();

  const fetchApi = async (status="") => {
    setLoading(true)
    const result = await infoJobsEmployer(param.id,status);
    if (result.code === 200) {
      setLoading(false)
      setData(decData(result.data));
    }    
  };
  useEffect(() => {
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param.id]);

  useEffect(() => {
    if (Object.keys(data)?.length > 0) {
      const lengthOpenContact = data?.listProfileRequirement.filter(
        (item) => item.status === "accept"
      ).length;
     
      const countViewCv = data?.listProfileRequirement.reduce((acc, item) => {
        return (acc += item.countView);
      }, 0);
      setCountViewCv(countViewCv);
    
      setCvOpenContact(lengthOpenContact);
    }
  }, [data]);

  const messageHandlers = () => ({
    fetching: () => {
      messageApi.open({
        key: 'fetching',
        type: 'loading',
        content: 'Đang xử lý...',
        duration: 0,
      });
    },
    success: () => {
      messageApi.open({
        key: 'fetching',
        type: 'success',
        content: 'Hoàn thành!',
        duration: 2,
      });
    },
    fail: () => {
      messageApi.open({
        key: 'fetching',
        type: 'error',
        content: 'Đã xảy ra lỗi!',
        duration: 2,
      });
    },
    final: () => {
      messageApi.destroy('fetching')
    }
  });

  //job , apply_cv , viewed_job , followed_cv service
  const items = [
    {
      label: <Link to={"./?active_tab=job"}>Tin tuyển dụng</Link>,
      key: "job",
      icon: <MailOutlined />,
    },
    {
      label: <Link to={"./?active_tab=apply_cv"}>CV ứng tuyển</Link>,
      key: "apply_cv",
      icon: <FontAwesomeIcon icon={faFile} />,
    },
    {
      label: <Link to={"./?active_tab=viewed_job"}>Ứng viên đã xem tin</Link>,
      key: "viewed_job",
      icon: <FontAwesomeIcon icon={faEye} />,
    },
    {
      label: <Link to={"./?active_tab=followed_cv"}>Hồ sơ đang theo dõi</Link>,
      key: "followed_cv",
      icon: <FontAwesomeIcon icon={faPlus} />,
    },
    {
      label: <Link  to={"./?active_tab=suggested_cv"}>Ứng viên đề xuất</Link>,
      key: "suggested_cv",
      icon: <Spark size={18} style={{display: "inline-block"}}/>
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="container-fluid page-content mt-4 detail-job reset-button-employer">
        <div className="title title-employer-setting  mb-3 ">
          <h3>{data?.title || ""}</h3>
        </div>
        <div className="detail-job__card mb-3">
          <div className="row gx-2">
            <div className="col-3">
              <div className="card-item ">
                <p>TỔNG LƯỢNG CV ỨNG VIÊN</p>
                <h4>{data?.listProfileRequirement?.length || 0}</h4>
              </div>
            </div>
            <div className="col-3">
              <div className="card-item color-green">
                <p>CV ỨNG TUYỂN</p>
                <h4>
                  {data?.listProfileRequirement?.length - cv_open_contact || 0}
                </h4>
              </div>
            </div>
            <div className="col-3">
              <div className="card-item color-red">
                <p>CV ĐÃ PHÊ DUYỆT</p>
                <h4>{cv_open_contact || 0}</h4>
              </div>
            </div>
            <div className="col-3">
              <div className="card-item color-blue">
                <p>LƯỢT MỞ CV ỨNG TUYỂN</p>
                <h4>{countViewCv || 0}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="detail-job__banner mb-3">
          <div className="images">
            <img src={banner} alt="banne-detail" />
          </div>

          <div className="content">
            <p>
              Xem xét chi tiết mô tả công việc của bạn để đảm bảo tìm ra ứng
              viên phù hợp nhất và đáp ứng được yêu cầu công việc một cách{" "}
              <strong style={{ color: "rgb(255 70 145)" }}>
                tốt nhất có thể
              </strong>
              .
            </p>
          </div>
        </div>
        <div className="detail-job__menu">
          <Menu selectedKeys={queryGet} mode="horizontal" items={items} />
          <div className="item-box">
            {queryGet === "job" && <MemoizedInfoJobEmployer record={data} />}
            {queryGet === "apply_cv" && (
              <ApplyCv record={data} fetchApi={fetchApi} loading={loading} messageHandlers={messageHandlers}/>
            )}
            {queryGet === "viewed_job" && <ViewedJob record={data} />}
            {queryGet === "followed_cv" && <FollowedCv record={data} />}
            {queryGet === "suggested_cv" && <SuggestedCv record={data} />}
          </div>
        </div>
      </div>
    </>
  );
}
export default DetailJob;
