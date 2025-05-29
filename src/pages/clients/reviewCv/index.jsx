import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  message,
  notification,
  Row,
  Space,
  Typography,
  Alert,
  Spin,
  Divider,
  Avatar,
  Progress,
} from "antd";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusSquareOutlined,
  DeleteOutlined,
  DeleteFilled,
  UserOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import MemoizedTinyMce from "../../../components/clients/tinyEditor";
import { createMyCv } from "../../../services/clients/myCvsApi";
import banner from "/images/banner-cv.png";
import DropCvModal from "./DropCvModal";
import "./reviewCv.scss"
import { Spark, Spark2, Suggestion } from "../../../components/clients/customIcon";

const ReviewCv = () => {
  const [api, contextHolder] = notification.useNotification();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [form] = Form.useForm();
  const { Text, Title, Link } = Typography;
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const defaultValue = {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    position: "",
    objective: "",
    skills: [],
    experiences: [],
    educations: [],
    awards: [],
    certifications: [],
    activities: [],
    projects: [],
  };

  const handleForm = async (values) => {
    console.log("🚀 ~ CreateCv ~ values:", values);
    setLoadingSubmit(true);
    try {
      const result = await createMyCv(values);
      if (result.code === 200) {
        const idCv = result.data._id;

        api.success({
          message: `Success`,
          description: (
            <>
              <i>{result.success}</i>
            </>
          ),
        });

        navigate(`/xem-cv/${idCv}`);
      } else {
        api.error({
          message: <span style={{ color: "red" }}>Thất bại</span>,
          description: (
            <>
              <i>{result.error}</i>
            </>
          ),
        });
      }
    } catch (error) {
      console.log("🚀 ~ handleForm ~ error:", error);
    }
    setLoadingSubmit(false);
  };

const handleImportCv = (values) => {
  if (!values) return;

  // Format skills
  const skills = values.skills?.map(skill => ({
    skill_name: skill
  })) || [];

  const newValues = { ...values, skills };

  // Duyệt qua từng phần tử trong newValues
  for (const key in newValues) {
    newValues[key] = newValues[key]?.map?.(item => {
      if (item?.description) {
        const descriptions = item.description
          .split(".")
          .map(desc => desc.trim())
          .filter(desc => desc);

        const htmlList = `<ul>${descriptions.map(d => `<li>${d}</li>`).join("")}</ul>`;

        return {
          ...item,
          description: htmlList
        };
      }
      return item;
    }) || newValues[key];
  }

  console.log("🚀 ~ handleImportCv ~ newValues:", newValues)

  form.setFieldsValue(newValues);
};

const conicColors = {
  '0%': 'rgb(255, 98, 0)',
  '40%': 'rgb(253, 185, 46)',
  '70%': 'rgb(220, 30, 175)',
};

  return (
    <>
      {contextHolder}
      <div className="section-review-cv cb-section cb-section-padding-bottom bg-grey2">
        <div className="container">
          <div style={{ maxWidth: 1000, margin: "0 auto"}}>
            <Space direction="vertical" size={"large"} style={{width: "100%"}}>
              <Flex vertical>
                <div className="box-overview-cv__banner box-settings-info__banner" style={{ zIndex: 1 }}>
                  <div className="left">
                    <h1 className="title">
                      Phân tích mức độ phù hợp với công việc
                    </h1>
                    <h2 className="sub-title">
                      <div><Spark /></div>
                      <span>UTEM AI</span>
                    </h2>
                  </div>
                <div>
                    <Spark2 />
                  </div>
                </div>
                <Card
                  style={{
                    borderTopRightRadius: 0,
                    borderTopLeftRadius: 0,
                    border: 0,
                  }}
                >
                  <Flex className="mb-2" style={{width: "100%"}}>
                    <Flex vertical style={{width: "100%", marginBottom: 40}} gap={10}>
                      <Title level={5}>Thông tin hồ sơ</Title>
                      <Flex gap={12}>
                        <Avatar style={{background: "#fff", color: "#c9c9c9", border: "2px solid #E1E3E8"}} shape="square" size={70} icon={undefined || <UserOutlined />} src={undefined}/>
                        <Flex vertical style={{}}>
                          <Text strong style={{fontSize: 18}}>Phat Dang</Text>
                          <Text style={{fontSize: 16}}>LẬP TRÌNH VIÊN</Text>
                          <Text style={{fontSize: 16}}>Nguyen Thi Tuyet Mai (CV).pdf</Text>
                        </Flex>
                      </Flex>
                    </Flex>
                    <div>
                      <Divider type="vertical" style={{height: "100%"}}/>
                    </div>
                    <Flex vertical style={{width: "100%", marginLeft: 15}} gap={10}>
                      <Title level={5}>Đánh giá cho vị trí</Title>
                      <Flex gap={12}>
                        <Avatar style={{background: "#fff", color: "#c9c9c9", border: "2px solid #E1E3E8"}} shape="square" size={70} icon={undefined || <UserOutlined />} src={undefined}/>
                        <Flex vertical style={{}}>
                          <Link style={{fontSize: 18}}>Entity Data Management Associate</Link>
                          <Text style={{fontSize: 16}}>PwC (Vietnam) Ltd.</Text>
                          <Text style={{fontSize: 16}}>Thương lượng</Text>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Flex>
                  <Title level={2} style={{fontSize: 28, fontWeight: 600}}>Đánh giá chung: 78% Cao</Title>
                  <div style={{width: "100%", background: "#F8F9FA", padding: "15px 5px 0px", borderRadius: 14}}>
                    <Flex gap={5} style={{paddingLeft: 7}}>
                      <div><Spark color={"#FF7D55"}/></div>
                      <Title level={5}>Nhận xét hồ sơ với yêu cầu công việc</Title>
                    </Flex>
                    <Space>
                      <ul>
                        <li>Bạn có kỹ năng phân tích dữ liệu vững chắc và thành thạo SQL cùng các công cụ trực quan hóa dữ liệu như Tableau.</li>
                        <li>Kinh nghiệm làm việc trong các vị trí nghiên cứu và quản lý tài khoản thể hiện khả năng xử lý dữ liệu và nghiên cứu thông tin. Kinh nghiệm làm việc trong các vị trí nghiên cứu và quản lý tài khoản thể hiện khả năng xử lý dữ liệu và nghiên cứu thông tin.</li>
                      </ul>
                    </Space>
                  </div>
                </Card>
              </Flex>

              <Card
                className="box-review"
              >
                <div className="box-review__title">
                  <Title level={1} className="box-review__title-text">Kỹ năng công việc</Title>
                </div>
                <Flex gap={10}>
                  <Flex style={{width: "45%"}} align="center" justify="center">
                    <Progress strokeWidth={8} strokeColor={"#FF7D55"} strokeLinecap="round" size={200} type="circle" percent={75} format={(percent) => (<Flex vertical><span>{percent}%</span><Title level={5}>Phù hợp</Title></Flex>)}/>
                  </Flex>
                  <Space className="box-review__summary" direction="vertical" size={"middle"}>
                    <Flex align="center" gap={7} className="box-review__summary-item">
                      <CheckOutlined className="box-review__summary-icon--checked"/>
                      <Text className="box-review__summary-text">Có bằng Cử nhân Quản trị Kinh doanh với chuyên ngành Quản lý Công nghệ và Đổi mới. Có bằng Cử nhân Quản trị Kinh doanh với chuyên ngành Quản lý Công nghệ và Đổi mới</Text>
                    </Flex>
                    <Flex align="center" gap={7} className="box-review__summary-item">
                      <CloseOutlined className="box-review__summary-icon--unchecked"/>
                      <Text className="box-review__summary-text">Có bằng Cử nhân Quản trị Kinh doanh với chuyên ngành Quản lý Công nghệ và Đổi mới</Text>
                    </Flex>
                  </Space>
                </Flex>
                <div style={{width: "100%", background: "#F8F9FA", padding: "15px 0 15px 5px", borderRadius: 14, marginTop: 20}}>
                  <Flex gap={5} style={{paddingLeft: 7}}>
                  <div>
                    <Suggestion />
                  </div>
                    <Title level={5}>Gợi ý</Title>
                  </Flex>
                  <ul className="box-review__suggestion">
                      <li className="box-review__suggestion-item">Bạn có kỹ năng phân tích dữ liệu vững chắc và thành thạo SQL cùng các công cụ trực quan hóa dữ liệu như Tableau.</li>
                      <li className="box-review__suggestion-item">Kinh nghiệm làm việc trong các vị trí nghiên cứu và quản lý tài khoản thể hiện khả năng xử lý dữ liệu và nghiên cứu thông tin. Kinh nghiệm làm việc trong các vị trí nghiên cứu và quản lý tài khoản thể hiện khả năng xử lý dữ liệu và nghiên cứu thông tin. thể hiện khả năng xử lý dữ liệu và nghiên cứu thông tin</li>
                    </ul>
                </div>
              </Card>
          </Space>
          </div>
        </div>
      </div>
      <DropCvModal open={open} setOpen={setOpen} handleImportCv={handleImportCv}/>
    </>
  );
};
export default ReviewCv;
