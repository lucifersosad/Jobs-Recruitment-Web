import { Flex, Skeleton, Space, Tabs, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faLinkedinIn,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";
import { faFlag } from "@fortawesome/free-regular-svg-icons";
import { ShareAltOutlined } from "@ant-design/icons";
import banner from "./images/banner.png";
import InfoJob from "./infoJob";

const JobSkeleton = () => {
  const items = [
    {
      key: "1",
      label: "Chi Tiết",
    },
    {
      key: "2",
      label: "Tổng Quan Công Ty",
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

  return (
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
              <div className="job-search-one__content" style={{ maxHeight: "71px"}}>
                <div className="job-search-one__desc">
                  <Flex vertical >
                    <Skeleton.Input active size={20} />
                    <Skeleton.Button
                      active
                      size={18}
                      style={{ width: "100px" }}
                    />
                  </Flex>
                </div>
                <div className="job-search-one__apply">
                  <Skeleton.Button
                    active
                    size={35}
                    block
                    style={{ width: "200px" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-9 ">
            <Tabs items={items} tabBarExtraContent={{ right: <ExtraTab /> }} />
            <InfoJob record={{}} loading={true} />
          </div>
          <div className="col-lg-3">
            <div className="side-wrapper">
              <div className="side-wrapper__title">
                <p>Các công việc tương tự</p>
              </div>
              <section className="side-wrapper__list">{/*  */}</section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default JobSkeleton;
