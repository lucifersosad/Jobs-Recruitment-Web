import { Avatar, Divider, Flex, List, Space, Typography } from "antd";
import {
  CalendarOutlined,
  CompassOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./userCv.scss";

const UserCv = ({ data }) => {
  console.log("🚀 ~ UserCv ~ data:", data)
  const { Title, Text, Paragraph, Link } = Typography;

  const DATA = [
    {
      icon: <CalendarOutlined />,
      title: data?.title,
    },
    {
      icon: <UserOutlined />,
      title: data?.gender,
    },
    {
      icon: <PhoneOutlined />,
      title: data?.phone,
    },
    {
      icon: <MailOutlined />,
      title: data?.email,
    },
    {
      icon: <CompassOutlined />,
      title: data?.address,
    },
  ];

  return (
    <div className="cv-user">
      <div className="cv-user__wrapper">
        <div className="cv-user__col-1">
          <div className="cv-user__section" direction="vertical">
            <Space direction="vertical" size={"middle"}>
              <Avatar
                className="cv-user__avatar"
                shape="square"
                src={
                  data?.avatar || "https://static.topcv.vn/cv-builder/assets/default-avatar.fc9c40ba.png"
                }
                alt="avatar"
              />
              <Space direction="vertical" style={{ width: "100%" }} size={0}>
                <Title level={3} style={{ margin: 0, color: "#ff277d" }}>
                  {data?.fullName}
                </Title>
                <Text
                  style={{
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    margin: 0,
                    color: "#ff277d",
                    fontSize: "13px",
                  }}
                >
                  {data?.position}
                </Text>
              </Space>
            </Space>
          </div>
          <div className="cv-user__section">
            <Divider
              orientation="left"
              orientationMargin="0"
              className="cv-user__section-title"
              style={{ marginBottom: 0 }}
            >
              Thông tin cá nhân
            </Divider>
            <div className="cv-user__section-body">
              <Space direction="vertical">
                {DATA.map((item, index) => (
                  <Flex key={index} align="center" gap={8}>
                    {item.icon}
                    <Text>{item.title}</Text>
                  </Flex>
                ))}
              </Space>
            </div>
          </div>
          {data?.skills?.length > 0 && (
            <div className="cv-user__section">
              <Divider
                orientation="left"
                orientationMargin="0"
                className="cv-user__section-title"
                style={{ fontWeight: "bold" }}
              >
                Các kỹ năng
              </Divider>
              <div className="cv-user__section-body">
                <Paragraph>
                  <ul>
                    {data.skills.map((item, index) => (
                      <>
                        <li>{item.skill_name}</li>
                      </>
                    ))}
                  </ul>
                </Paragraph>
              </div>
            </div>
          )}
        </div>
        <div className="cv-user__col-2">
          {data?.objective && (
            <div className="cv-user__section cv-user__objective">
              <Divider
                orientation="left"
                orientationMargin="0"
                className="cv-user__section-title"
              >
                Mục tiêu nghề nghiệp
              </Divider>
              <div className="cv-user__section-body">
                <Paragraph>
                  {data?.objective}
                </Paragraph>
              </div>
            </div>
          )}
          {data?.experiences?.length > 0 && (
            <div className="cv-user__section cv-user__experiences">
              <Divider
                orientation="left"
                orientationMargin="0"
                className="cv-user__section-title"
              >
                Kinh nghiệm làm việc
              </Divider>
              <div className="cv-user__section-body">
                <Space direction="vertical" size={"large"}>
                  {data?.experiences.map((item, index) => (
                    <>
                      <Space key={index} direction="vertical" style={{ width: "100%" }}>
                        <Flex justify="space-between" align="center">
                          <Title
                            level={5}
                            style={{ margin: 0, textTransform: "uppercase" }}
                          >
                            {item?.position_name}
                          </Title>
                          <Title
                            level={5}
                            style={{ margin: 0, textTransform: "uppercase" }}
                          >
                            {item?.start_date} - {item?.end_date}
                          </Title>
                        </Flex>
                        <Title level={5} style={{ margin: 0 }}>
                          {item?.company_name}
                        </Title>
                        <Paragraph>
                          <div dangerouslySetInnerHTML={{ __html: item?.description }} />
                        </Paragraph>
                      </Space>
                    </>
                  ))}
                </Space>
              </div>
            </div>
          )}
          {data?.educations?.length > 0 && (
            <div className="cv-user__section cv-user__educations">
              <Divider
                orientation="left"
                orientationMargin="0"
                className="cv-user__section-title"
              >
                Học vấn
              </Divider>
              <div className="cv-user__section-body">
                <Space direction="vertical" style={{width: "100%"}} size={"large"}>
                  {data?.educations?.map((item, index) => (
                    <>
                      <Space key={index} direction="vertical" style={{ width: "100%" }}>
                        <Flex justify="space-between" align="center">
                          <Title
                            level={5}
                            style={{ margin: 0, textTransform: "uppercase" }}
                          >
                            {item?.title}
                          </Title>
                          <Title
                            level={5}
                            style={{ margin: 0, textTransform: "uppercase" }}
                          >
                            {item?.start_date} - {item?.end_date}
                          </Title>
                        </Flex>
                        <Title level={5} style={{ margin: 0 }}>
                          {item?.school_name}
                        </Title>
                        <Paragraph>
                          <div dangerouslySetInnerHTML={{ __html: item?.description }} />
                        </Paragraph>
                      </Space>
                    </>
                  ))}
                </Space>
              </div>
            </div>
          )}
          {data?.awards?.length > 0 && (
            <div className="cv-user__section">
              <Divider
                orientation="left"
                orientationMargin="0"
                className="cv-user__section-title"
              >
                Danh hiệu và giải thưởng
              </Divider>
              <div className="cv-user__section-body">
                <Space direction="vertical" style={{ width: "100%" }}>
                  {data?.awards?.map((item, index) => (
                    <>
                      <Space key={index} align="center" size={"large"}>
                        <Title level={5} style={{ margin: 0 }}>
                          {item?.date}
                        </Title>
                        <Text>{item?.title}</Text>
                      </Space>
                    </>
                  ))}
                </Space>
              </div>
            </div>
          )}
          {data?.certifications?.length > 0 && (
            <div className="cv-user__section">
              <Divider
                orientation="left"
                orientationMargin="0"
                className="cv-user__section-title"
              >
                Chứng chỉ
              </Divider>
              <div className="cv-user__section-body">
                <Space direction="vertical" style={{ width: "100%" }}>
                  {data?.certifications?.map((item, index) => (
                    <>
                      <Space key={index} align="center" size={"large"}>
                        <Title level={5} style={{ margin: 0 }}>
                          {item?.date}
                        </Title>
                        <Text>{item?.title}</Text>
                      </Space>
                    </>
                  ))}
                </Space>
              </div>
            </div>
          )}
          {data?.activities?.length > 0 && (
            <div className="cv-user__section">
              <Divider
                orientation="left"
                orientationMargin="0"
                className="cv-user__section-title"
              >
                Hoạt động
              </Divider>
              <div className="cv-user__section-body">
                <div className="cv-user__section-item">
                  <Space direction="vertical" size={"large"} style={{width: "100%"}}>
                    {data?.activities?.map((item, index) => (
                      <>
                        <Space key={index} direction="vertical" style={{ width: "100%" }}>
                          <Flex justify="space-between" align="center">
                            <Title
                              level={5}
                              style={{ margin: 0, textTransform: "uppercase" }}
                            >
                              {item?.position_name}
                            </Title>
                            <Title
                              level={5}
                              style={{ margin: 0, textTransform: "uppercase" }}
                            >
                              {item?.start_date} - {item?.end_date}
                            </Title>
                          </Flex>
                          <Title
                            level={5}
                            style={{ margin: 0, textTransform: "uppercase" }}
                          >
                            {item?.group_name}
                          </Title>
                          <Paragraph>
                            <div dangerouslySetInnerHTML={{ __html: item?.description }} />
                          </Paragraph>
                        </Space>
                      </>
                    ))}
                  </Space>
                </div>
              </div>
            </div>
          )}
          {data?.projects?.length > 0 && (
            <div className="cv-user__section">
              <Divider
                orientation="left"
                orientationMargin="0"
                className="cv-user__section-title"
              >
                Dự án
              </Divider>
              <div className="cv-user__section-body">
                <Space
                  className="cv-user__section-item"
                  direction="vertical"
                  style={{ width: "100%" }}
                >
                  <Title
                    level={5}
                    style={{ margin: 0, textTransform: "uppercase" }}
                  >
                    Lead dự án
                  </Title>
                  <Flex justify="space-between" align="center">
                    <Title level={5} style={{ margin: 0 }}>
                      THIẾT KẾ WEBISTE BÁN HÀNG CHO CÔNG TY X
                    </Title>
                    <Title level={5} style={{ margin: 0 }}>
                      2018 - 2018
                    </Title>
                  </Flex>
                  <Space direction="vertical">
                    <Space size={"large"}>
                      <Text>Khách hàng</Text>
                      <Text>Công ty A</Text>
                    </Space>
                    <Space size={"large"}>
                      <Text>Số lượng người tham gia</Text>
                      <Text>1</Text>
                    </Space>
                  </Space>
                  <Space direction="vertical">
                    <Title level={5} style={{ margin: 0 }}>
                      Công nghệ sử dụng
                    </Title>
                    <Typography level={5} style={{ margin: 0 }}>
                      HTML, CSS, JavaScript và các công nghệ back-end như Node.js
                    </Typography>
                  </Space>
                  <Space direction="vertical">
                    <Title level={5} style={{ margin: 0 }}>
                      Vị trí
                    </Title>
                    <Typography style={{ margin: 0 }}>
                      Thu thập thông tin từ khách hàng về yêu cầu cụ thể cho trang
                      web bán hàng, bao gồm các tính năng như quản lý sản phẩm,
                      giỏ hàng, thanh toán, đăng nhập và đăng ký người dùng. Thiết
                      kế giao diện website Sử dụng HTML, CSS và JavaScript để tạo
                      giao diện người dùng (UI) dựa trên thiết kế đã được xác
                      định. Tối ưu hóa giao diện để đảm bảo tương tác người dùng
                      mượt mà và thân thiện. Xây dựng các tính năng như hiển thị
                      sản phẩm, thêm vào giỏ hàng, quản lý giỏ hàng và thanh toán.
                      Thiết kế và triển khai các API để tương tác với cơ sở dữ
                      liệu và cung cấp dữ liệu cho phần front-end. Xử lý các yêu
                      cầu từ phía máy khách (client-side) như thêm sản phẩm vào
                      giỏ hàng, xử lý thanh toán và quản lý người dùng. Hoàn thiện
                      website, đồng thời kiểm tra tính ổn định và tính năng của
                      trang web trên nhiều trình duyệt và thiết bị khác nhau Triển
                      khai trang web lên môi trường thật. Đồng thời theo dõi bảo
                      đảm trang web hoạt động một cách ổn định. Bàn giao Webiste
                      tới khách hàng. Đồng thời tiếp tục theo dõi và phân tích dữ
                      liệu về hoạt động của người dùng để cải thiện trải nghiệm và
                      tăng hiệu suất trang web.
                    </Typography>
                  </Space>
                </Space>
              </div>
            </div>
          )}          
        </div>
      </div>
    </div>
  );
};
export default UserCv;
