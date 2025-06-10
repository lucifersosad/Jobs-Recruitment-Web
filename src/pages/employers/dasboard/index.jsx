import { Card, Carousel, Flex, Slider } from "antd";

import "./dashboard.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faFilePdf,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import BoxInfoColor from "../../../components/employers/box-info-color";
import { Column } from "@ant-design/plots";
import {
  faEnvelope,
  faFileCode,
  faFileLines,
  faStar,
} from "@fortawesome/free-regular-svg-icons";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

import { PhoneOutlined } from "@ant-design/icons";
import MEMBER from "./images/MEMBER.gif";
import SLIVER from "./images/SLIVER.gif";
import GOLD from "./images/GOLD.gif";
import PLATINUM from "./images/PLATINUM.gif";
import DIAMOND from "./images/DIAMOND.gif";
import { marks } from "./js/options";
import point from "./images/point.png";

import "aplayer/dist/APlayer.min.css";
import APlayer from "aplayer";
import { useSelector } from "react-redux";
import { statisticCompany } from "../../../services/employers/employer-userApi";
// import { onMessageListener, requestForToken } from "../../../helpers/firebase";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function DashboardEmployer() {
  const [imageRole, setImageRole] = React.useState(MEMBER);
  const [data, setData] = useState([]);
  const [objectCount, setObjectCount] = useState({
    coutCompaignIsOpen: 0,
    coutCompaignIsPending: 0,
    coutCvApplication: 0,
    coutCvApproved: 0,
  });
  const carouselRef = React.createRef();
  const authenMainEmployer = useSelector(
    (status) => status.authenticationReducerEmployer
  );
  const [infoUserEmployer, setInfoUserEmployer] = useState({});

const config = {
    data,
    xField: "type",
    yField: "value",
    height: 313,
    // autoFit: true,
    // shapeField: "column25D",
    style: {
      maxWidth: 55,
      // fill: "rgb(241 150 187 / 90%)",
    },
    axis: {
      y: {
        labelFormatter: ".0%",
      },
    },
    label: {
      text: (d) => `${(d.value * 100).toFixed(0)}%`,
      textBaseline: 'bottom',
    },
    colorField: "rgb(233 107 158)",
  };

  const handleChangeSlider = (value) => {
    const roles = [
      { limit: 300, role: MEMBER },
      { limit: 800, role: SLIVER },
      { limit: 1500, role: GOLD },
      { limit: 2500, role: PLATINUM },
      { limit: Infinity, role: DIAMOND },
    ];

    const { role } = roles.find(({ limit }) => value < limit);
    setImageRole(role);
  };

  const viewsData = [
    { date: 'T1', views: 150, applications: 30 },
    { date: 'T2', views: 220, applications: 45 },
    { date: 'T3', views: 180, applications: 35 },
    { date: 'T4', views: 320, applications: 60 },
    { date: 'T5', views: 250, applications: 50 },
    { date: 'T6', views: 280, applications: 55 },
  ];

  const jobStatusData = [
    { name: 'Đang hiển thị', value: 12 },
    { name: 'Chờ duyệt', value: 5 },
    { name: 'Hết hạn', value: 3 },
  ];

  const applicationStatusData = [
    { status: 'Chờ duyệt', count: 25 },
    { status: 'Đã duyệt', count: 32 },
    { status: 'Từ chối', count: 15 },
  ];

  useEffect(() => {
    // if (authenMainEmployer?.status === true) {
    //   new APlayer({
    //     container: document.getElementById("aplayer"),
    //     audio: [
    //       {
    //         name: "Closure",
    //         artist: "Hayd",
    //         url: "https://res.cloudinary.com/dmmz10szo/video/upload/v1709551928/music_ik8qur.mp3",
    //         cover:
    //           "https://media.istockphoto.com/id/917367814/photo/pink-abstract-background-bright-colorful-textured-sparkling-backdrop.webp?b=1&s=170667a&w=0&k=20&c=E5TRBRXj9Ldm8gR09gYaK8JB8mu5Stbq4FLWuOg5BXE=",
    //       },
    //     ],
    //   });
    // }

    const { infoUserEmployer } = authenMainEmployer;

    setInfoUserEmployer(infoUserEmployer);
  }, [authenMainEmployer]);

  useEffect(() => {
    const fetchApi = async () => {
      const result = await statisticCompany();
      if (result.code === 200) {
        setObjectCount({
          coutCompaignIsOpen: result?.data?.coutCompaignIsOpen,
          coutCompaignIsPending: result?.data?.coutCompaignIsPending,
          coutCvApplication: result?.data?.coutCvApplication,
          coutCvApproved: result?.data?.coutCvApproved,
        });

        setData(result?.data?.groupedCvs);
      }
    };
    fetchApi();
  }, []);

  return (
    <>
      {authenMainEmployer?.status === true && (
        <div className="container-fluid page-content dashboar-employer mt-4">
          <div className=" title-employer-setting  ml-10 mb-4">
            <h3>Bảng tin</h3>
          </div>
          {/* <div className="banner-slick ">
            <Carousel
              autoplay
              ref={carouselRef}
              dots={false}
              infinite={true}
              slidesToShow={2}
              slidesToScroll={2}
            >
              <a href="#!" className="slick-box col-6">
                <img
                  src="https://res.cloudinary.com/dt10idnhk/image/upload/v1733476645/xzcikhm78pduzjzelgq1.png"
                  alt=""
                />
              </a>
              <a href="#!" className="slick-box col-6">
                <img
                  src="https://res.cloudinary.com/dt10idnhk/image/upload/v1733476737/mpnqrgiavucjiwazucrw.png"
                  alt=""
                />
              </a>
              <a href="#!" className="slick-box col-6">
                <img
                  src="https://res.cloudinary.com/dt10idnhk/image/upload/v1733476737/mpnqrgiavucjiwazucrw.png"
                  alt=""
                />
              </a>
              <a href="#!" className="slick-box col-6">
                <img
                  src="https://res.cloudinary.com/dt10idnhk/image/upload/v1733476645/xzcikhm78pduzjzelgq1.png"
                  alt=""
                />
              </a>
            </Carousel>
            <div
              onClick={() => {
                carouselRef.current.prev();
              }}
              className="button-pre"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            <div
              onClick={() => {
                carouselRef.current.next();
              }}
              className="button-next"
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </div>
          </div> */}
          <div className="box-content ml-10 mt-3">
            <div className="row gx-3 gy-3">
              <div className="col-12">
                <div className="item-box">
                  <div className="box-1 pd-item-d">
                    <div className="box-head">
                      <h3 className="title">Hiệu quả tuyển dụng</h3>
                      <span>
                        <FontAwesomeIcon icon={faInfo} />
                      </span>
                    </div>
                    <div className="box-body pb-3">
                      <div className="row gx-3 gy-3">
                        <div className="col-6">
                          <BoxInfoColor
                            desc="Chiến dịch đang mở"
                            color={"#2d7cf1"}
                            bgColor={"#ebf3ff"}
                            value={objectCount.coutCompaignIsOpen}
                            icon={<FontAwesomeIcon icon={faStar} />}
                          />
                        </div>
                        <div className="col-6">
                          <BoxInfoColor
                            desc="CV tiếp nhận"
                            color={"rgb(227 65 131)"}
                            bgColor={"rgb(249 197 218 / 12%)"}
                            value={objectCount.coutCvApproved}
                            icon={<FontAwesomeIcon icon={faFileCode} />}
                          />
                        </div>
                        <div className="col-6">
                          <BoxInfoColor
                            desc="Chiến dịch đang chờ duyệt"
                            color={"#e5b500"}
                            bgColor={"#fffae9"}
                            value={objectCount.coutCompaignIsPending}
                            icon={<FontAwesomeIcon icon={faFileLines} />}
                          />
                        </div>
                        <div className="col-6">
                          <BoxInfoColor
                            desc="Cv ứng tuyển mới"
                            color={"#da4538"}
                            bgColor={"#fff3f2"}
                            value={objectCount.coutCvApplication}
                            icon={<FontAwesomeIcon icon={faFilePdf} />}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="box-chart mt-3">
                      <Column {...config} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <Card title="Thống kê lượt xem và ứng tuyển" hoverable>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={viewsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="views"
                        name="Lượt xem"
                        stroke="#1890ff"
                        strokeWidth={2}
                        dot={{ stroke: '#1890ff', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="applications"
                        name="Lượt ứng tuyển"
                        stroke="#52c41a"
                        strokeWidth={2}
                        dot={{ stroke: '#52c41a', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              <div className="col-6">
                <Card title="Trạng thái tin tuyển dụng" hoverable>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={jobStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {jobStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              <div className="col-6">
                <Card title="Trạng thái ứng tuyển" hoverable>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={applicationStatusData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="status" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="count" 
                        name="Số lượng" 
                        fill="#722ed1"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              <div className="col-6">
                <Flex vertical style={{height: "100%"}}>
                  <div className="item-box" >
                  <div className="box-2 pd-item-d">
                    <div className="box-head-v">
                      <div className="user">
                        <div className="user__flex">
                          <div className="user-box">
                            <div className="images">
                              <img src={infoUserEmployer?.image} alt="avatar" />
                            </div>
                            <div className="info">
                              <div className="name">
                                {infoUserEmployer?.fullName}
                              </div>
                              <div className="code">
                                Mã NTD: {infoUserEmployer?.code}
                              </div>
                              <div className="contact-user">
                                <a href="#!" className="email-user">
                                  <FontAwesomeIcon icon={faEnvelope} />

                                  <span>{infoUserEmployer?.email}</span>
                                </a>
                                <a href="#!" className="phone-user">
                                  <PhoneOutlined />
                                  <span>{infoUserEmployer?.phone}</span>
                                </a>
                              </div>
                            </div>
                          </div>
                          <div className="user-role">
                            <div className="image">
                              <img src={imageRole} alt="role" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item-box mt-2  w-d-100 pb-2" style={{flex: 1}}>
                  <div className="box-2 pd-item-d">
                    <div className="box-body-v">
                      <div className="box-slider" style={{ padding: "0 10px" }}>
                        <Slider
                          onChange={handleChangeSlider}
                          styles={{
                            track: {
                              background: "rgb(255 167 202)",
                            },
                          }}
                          step={10}
                          max={2500}
                          marks={marks}
                        />
                      </div>
                    </div>
                    <div className="box-info-v mt-2">
                      <div className="info-noti ">
                        <div className="count__flex">
                          <div className="count">
                            <div className="point">Điểm hạng</div>
                            <div className="images-coint">
                              <div className="count-coint">
                                {infoUserEmployer?.cointsGP}
                              </div>
                              <img src={point} alt="point" />
                            </div>
                          </div>
                          <div className="button-coint">
                            <a href="#!" className="button-employer-bold">
                              <span>Nạp ngay</span>
                              <FontAwesomeIcon icon={faArrowRight} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                </Flex>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default DashboardEmployer;
