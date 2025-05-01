import { Avatar, Divider, Flex, List, Space, Typography } from "antd";
import {
  CalendarOutlined,
  CompassOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./userCv.scss";

const data = [
  {
    icon: <CalendarOutlined />,
    title: "26/02/2003",
  },
  {
    icon: <UserOutlined />,
    title: "Nam",
  },
  {
    icon: <PhoneOutlined />,
    title: "0933758487",
  },
  {
    icon: <MailOutlined />,
    title: "1@s",
  },
  {
    icon: <CompassOutlined />,
    title: "Thủ Đức, Hồ Chí Minh",
  },
];

const UserCv = () => {
  const { Title, Text, Paragraph, Link } = Typography

  return (
    <div className="cv-user">
      <div className="cv-user__wrapper">
        <div className="cv-user__col-1">
          <div className="cv-user__section" direction="vertical">
            <Space direction="vertical" size={"middle"}>
              <Avatar
                className="cv-user__avatar"
                shape="square"
                src={"https://s3-utem.s3.ap-southeast-2.amazonaws.com/profile/1746072696658.jpeg" || "https://static.topcv.vn/cv-builder/assets/default-avatar.fc9c40ba.png"}
                alt="avatar"
              />
              <Space direction="vertical" style={{width: "100%"}} size={0}>
                <Title level={3} style={{margin: 0, color: "#ff277d"}}>Đặng Tiến Phát</Title>
                <Text style={{fontWeight: "bold", textTransform: "uppercase", margin: 0, color: "#ff277d", fontSize: "13px"}}>Lập trình viên</Text>
              </Space>
            </Space>
          </div>
          <div className="cv-user__section">
            <Divider
              orientation="left"
              orientationMargin="0"
              className="cv-user__section-title"
              style={{marginBottom: 0}}
            >
              Thông tin cá nhân
            </Divider>
            <div className="cv-user__section-body">
              <Space direction="vertical">
                {data.map((item, index) => (
                  <Flex key={index} align="center" gap={8}>
                    {item.icon}
                    <Text>{item.title}</Text>
                  </Flex>
                ))}
              </Space>
            </div>
          </div>
          <div className="cv-user__section">
            <Divider
              orientation="left"
              orientationMargin="0"
              className="cv-user__section-title"
              style={{fontWeight: "bold"}}
            >
              Các kỹ năng
            </Divider>
            <div className="cv-user__section-body">
              <Paragraph>
                Kỹ năng chuyên môn
                Có kiến thức vững về về JavaScript
                Làm việc tốt với HTML, CSS, Javascripts và GitLab, Node js
                Thành thạo SQL, noSQL
                Có kiến thức  về Framework Vuejs, Angular, React
                Có kỹ năng lập trình NET, lập trình C++
                Phân tích và thiết kế hệ thống
                Lập trình hướng đối tượng
                Setup, bảo trì hệ thống chạy Microsoft Windows
                Quản lý hệ thống cơ sở dữ liệu SQL
              </Paragraph>
            </div>
          </div>
        </div>
        <div className="cv-user__col-2">
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
                Với 6 năm trong nghề lập trình, triển khai trực tiếp hơn 30 dự
                án, tôi mong muốn ứng tuyển vào vị trí Senio của Công ty để có
                thể áp dụng những kiến thức, kinh nghiệm lập trình của bản thân
                để nâng cấp sản phẩm và mang lại những giá trị hữu ích cho doanh
                nghiệp. Đồng thời, mục tiêu phát triển trong vòng 2 năm tới của
                tôi sẽ trở thành một Lead giỏi.
              </Paragraph>
            </div>
          </div>
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
                <Space direction="vertical" style={{width: "100%"}}>
                  <Flex justify="space-between" align="center">
                    <Title level={5} style={{margin: 0, textTransform: "uppercase"}}>Front End Developer</Title>
                    <Title level={5} style={{margin: 0, textTransform: "uppercase"}}>2021 - 2024</Title>
                  </Flex>
                  <Title level={5} style={{margin: 0}}>Công ty XYZ TopCV</Title>
                  <Paragraph>
                    Quản lý các dự án phát triển trang web từ thiết kế ban đầu cho đến hoàn thiện, tối ưu hóa tất cả khả năng tương thích trên nhiều trình duyệt và đa nền tảng.
                    Tham gia đánh giá và thử nghiệm các tính năng mới để đảm bảo web tương thích với các tính năng hiện có.
                    Hợp tác chặt chẽ với các lập trình viên và khách hàng để đáp ứng các yêu cầu, mục tiêu và chức năng mong muốn của dự án.
                    Phát triển và tích hợp các chủ đề tùy chỉnh vào WordPress, PHP-Fusion và Concrete5.
                    Tiến hành đào tạo cho khách hàng về cách xử lý hệ thống quản lý nội dung trang web.
                    Cho phép quảng cáo trên toàn trang web bằng cách lập trình canvas HTML5 để tạo hoạt ảnh cho các phần tử trên nền web. 
                    Nghiên cứu, phát triển công nghệ mới để ứng dụng xây dựng các sản phẩm dịch vụ mới
                    Hỗ trợ các thành viên trong nhóm với các chức năng phức tạp, tham gia nhận xét, đánh giá source code của các thành viên trong nhóm
                  </Paragraph>
                </Space>
                <Space direction="vertical" style={{width: "100%"}}>
                  <Flex justify="space-between">
                    <Title level={5} style={{margin: 0, textTransform: "uppercase"}}>Front End Developer</Title>
                    <Title level={5} style={{margin: 0, textTransform: "uppercase"}}>2021 - 2024</Title>
                  </Flex>
                  <Title level={5} style={{margin: 0}}>Công ty XYZ TopCV</Title>
                  <Paragraph>
                    cc
                  </Paragraph>
                </Space>
              </Space>
            </div>
          </div>
          <div className="cv-user__section cv-user__educations">
            <Divider
              orientation="left"
              orientationMargin="0"
              className="cv-user__section-title"
            >
              Học vấn
            </Divider>
            <div className="cv-user__section-body">
              <Space direction="vertical" style={{width: "100%"}}>
                <Flex justify="space-between" align="center">
                  <Title level={5} style={{margin: 0, textTransform: "uppercase"}}>Công nghệ thông tin</Title>
                  <Title level={5} style={{margin: 0, textTransform: "uppercase"}}>2014 - 2017</Title>
                </Flex>
                <Title level={5} style={{margin: 0}}>Đại học TopCV</Title>
                <Paragraph>
                  Tốt nghiệp loại Giỏi
                  Đạt học bổng 2 năm 2016 và 2017 
                  Đạt giải nhì nghiên cứu khoa học công nghệ
                </Paragraph>
              </Space>
            </div>
          </div>
          <div className="cv-user__section">
            <Divider
              orientation="left"
              orientationMargin="0"
              className="cv-user__section-title"
            >
              Danh hiệu và giải thưởng
            </Divider>
            <div className="cv-user__section-body">
              <Space direction="vertical" style={{width: "100%"}}>
                <Space align="center" size={"large"}>
                  <Title level={5} style={{margin: 0}}>2023</Title>
                  <Text>Nhân viên xuất sắc của năm công ty XYZ</Text>
                </Space>
                <Space align="center" size={"large"}>
                  <Title level={5} style={{margin: 0}}>2020</Title>
                  <Text>Nhân viên cống hiến của năm DEF </Text>
                </Space>
              </Space>
            </div>
          </div>
          <div className="cv-user__section">
            <Divider
              orientation="left"
              orientationMargin="0"
              className="cv-user__section-title"
            >
              Chứng chỉ
            </Divider>
            <div className="cv-user__section-body">
              <Space direction="vertical" style={{width: "100%"}}>
                <Space align="center" size={"large"}>
                  <Title level={5} style={{margin: 0}}>2016</Title>
                  <Text>PHP, MY SQL , JAVA SCRIPTION</Text>
                </Space>
                <Space align="center" size={"large"}>
                  <Title level={5} style={{margin: 0}}>2017</Title>
                  <Text>LARAVER, FRAMWORK, JQUERY, REACT</Text>
                </Space>
                <Space align="center" size={"large"}>
                  <Title level={5} style={{margin: 0}}>2018</Title>
                  <Text>LINUX, REDIS, MONGODB</Text>
                </Space>
              </Space>
            </div>
          </div>
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
                <Space direction="vertical" style={{width: "100%"}}>
                  <Flex justify="space-between" align="center">
                    <Title level={5} style={{margin: 0, textTransform: "uppercase"}}>Thành viên</Title>
                    <Title level={5} style={{margin: 0, textTransform: "uppercase"}}>2015 - 2017</Title>
                  </Flex>
                  <Title level={5} style={{margin: 0, textTransform: "uppercase"}}>THAM GIA CÂU LẠC BỘ HIT CỦA TRƯỜNG</Title>
                  <Paragraph>
                    Tham gia trao đổi kiến thức chuyên ngành
                    Tham gia các khóa học lập trình cơ bản và nâng cao do CLB tổ chức để hiểu sâu hơn và nâng cao kiến thức, dự án sát với thực tế
                  </Paragraph>
                </Space>
              </div>
            </div>
          </div>
          <div className="cv-user__section">
            <Divider
              orientation="left"
              orientationMargin="0"
              className="cv-user__section-title"
            >
              Dự án
            </Divider>
            <div className="cv-user__section-body">
              <Space className="cv-user__section-item" direction="vertical" style={{width: "100%"}}>
                <Title level={5} style={{margin: 0, textTransform: "uppercase"}}>Lead dự án</Title>
                <Flex justify="space-between" align="center">
                  <Title level={5} style={{margin: 0}}>THIẾT KẾ WEBISTE BÁN HÀNG CHO CÔNG TY X</Title>
                  <Title level={5} style={{margin: 0}}>2018 - 2018</Title>
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
                  <Title level={5} style={{margin: 0}}>Công nghệ sử dụng</Title>
                  <Typography level={5} style={{margin: 0}}>HTML, CSS, JavaScript và các công nghệ back-end như Node.js</Typography>
                </Space>
                <Space direction="vertical">
                  <Title level={5} style={{margin: 0}}>Vị trí</Title>
                  <Typography style={{margin: 0}}>
                    Thu thập thông tin từ khách hàng về yêu cầu cụ thể cho trang web bán hàng, bao gồm các tính năng như quản lý sản phẩm, giỏ hàng, thanh toán, đăng nhập và đăng ký người dùng.
                    Thiết kế giao diện website 
                    Sử dụng HTML, CSS và JavaScript để tạo giao diện người dùng (UI) dựa trên thiết kế đã được xác định.
                    Tối ưu hóa giao diện để đảm bảo tương tác người dùng mượt mà và thân thiện.
                    Xây dựng các tính năng như hiển thị sản phẩm, thêm vào giỏ hàng, quản lý giỏ hàng và thanh toán.
                    Thiết kế và triển khai các API để tương tác với cơ sở dữ liệu và cung cấp dữ liệu cho phần front-end.
                    Xử lý các yêu cầu từ phía máy khách (client-side) như thêm sản phẩm vào giỏ hàng, xử lý thanh toán và quản lý người dùng.
                    Hoàn thiện website, đồng thời kiểm tra tính ổn định và tính năng của trang web trên nhiều trình duyệt và thiết bị khác nhau
                    Triển khai trang web lên môi trường thật. Đồng thời theo dõi bảo đảm trang web hoạt động một cách ổn định.
                    Bàn giao Webiste tới khách hàng. Đồng thời tiếp tục theo dõi và phân tích dữ liệu về hoạt động của người dùng để cải thiện trải nghiệm và tăng hiệu suất trang web.
                  </Typography>
                </Space>
              </Space>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserCv;
