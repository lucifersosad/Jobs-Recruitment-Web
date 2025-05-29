import {
  Card,
  Flex,
  Space,
  Typography,
  Divider,
  Avatar,
  Progress,
} from "antd";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  UserOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "./reviewCv.scss"
import { Company, Spark, Spark2, Suggestion } from "../../../components/clients/customIcon";
import { getEvaluation } from "../../../services/clients/evaluateApi";

const ReviewCv = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState()
  const { Text, Title, Link } = Typography;

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await getEvaluation(id)
        console.log("🚀 ~ getData ~ result:", result)
        if (result.code === 200) {
          setData(result.data)
        } else {
          throw result
        }
        setLoading(false)
      } catch (error) {
        console.log("🚀 ~ getData ~ error:", error)
        navigate("/404")
      }
    }
    getData()
  }, [])

  const conicColors = {
    '0%': 'rgb(255, 98, 0)',
    '40%': 'rgb(253, 185, 46)',
    '70%': 'rgb(220, 30, 175)',
  };

  return (
    <>
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
                  loading={loading}
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
                        <Avatar style={{background: "#fff", color: "#c9c9c9", border: "1px solid #E1E3E8"}} shape="square" size={70} icon={<UserOutlined />} />
                        <Flex vertical style={{}}>
                          <Text strong style={{fontSize: 18}}>{data?.fullName}</Text>
                          <Text style={{fontSize: 16}}>{data?.email}</Text>
                          <Text style={{fontSize: 16}}>{data?.nameFile}</Text>
                        </Flex>
                      </Flex>
                    </Flex>
                    <div>
                      <Divider type="vertical" style={{height: "100%"}}/>
                    </div>
                    <Flex vertical style={{width: "100%", marginLeft: 15}} gap={10}>
                      <Title level={5}>Đánh giá cho vị trí</Title>
                      <Flex gap={12}>
                        <Avatar  style={{background: "#fff", color: "#c9c9c9", border: "1px solid #E1E3E8"}} shape="square" size={70} icon={<Company />}  src={data?.idJob?.employerId?.logoCompany && <img style={{objectFit: "contain"}} src={data?.idJob?.employerId?.logoCompany}/>}/>
                        <Flex vertical style={{}}>
                          <Link href={`/tim-viec-lam/${data?.idJob?.slug}`} target="_blank" rel="noreferrer" style={{fontSize: 18}}>{data?.idJob?.title}</Link>
                          <Text style={{fontSize: 16}}>{data?.idJob?.employerId?.companyName}</Text>
                          <Text style={{fontSize: 16}}>Thương lượng</Text>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Flex>
                  <Title level={2} style={{fontSize: 28, fontWeight: 600}}>Đánh giá chung: {data?.overview?.score}% {data?.overview?.rankingScore}</Title>
                  <div style={{width: "100%", background: "#F8F9FA", padding: "15px 5px 0px", borderRadius: 14}}>
                    <Flex gap={5} style={{paddingLeft: 7}}>
                      <div><Spark color={"#FF7D55"}/></div>
                      <Title level={5}>Nhận xét hồ sơ với yêu cầu công việc</Title>
                    </Flex>
                    <Space>
                      <ul>
                        {data?.overview?.summary?.map((item, index) => (
                          <li key={index} className="box-overview-cv__content-item">{item}</li>
                        ))}
                      </ul>
                    </Space>
                  </div>
                </Card>
              </Flex>

              {/* Kĩ năng */}
              <Card
                loading={loading}
                className="box-review"
              >
                <div className="box-review__title">
                  <Title level={1} className="box-review__title-text">Kỹ năng công việc</Title>
                </div>
                <Flex gap={10}>
                  <Flex style={{width: "45%"}} align="center" justify="center">
                    <Progress strokeWidth={8} strokeColor={"#FF7D55"} strokeLinecap="round" size={200} type="circle" percent={data?.skill?.score} format={(percent) => (<Flex vertical><span>{percent}%</span><Title level={5}>Phù hợp</Title></Flex>)}/>
                  </Flex>
                  <Space className="box-review__summary" direction="vertical" size={"middle"}>
                    {data?.skill?.matched?.map((item, index) => (
                      <Flex key={item} align="center" gap={7} className="box-review__summary-item">
                        <CheckOutlined className="box-review__summary-icon--checked"/>
                        <Text className="box-review__summary-text">{item}</Text>
                      </Flex>
                    ))}
                    {data?.skill?.unmatched?.map((item, index) => (
                      <Flex key={item} align="center" gap={7} className="box-review__summary-item">
                        <CloseOutlined className="box-review__summary-icon--unchecked"/>
                        <Text className="box-review__summary-text">{item}</Text>
                      </Flex>
                    ))}
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
                    {data?.skill?.suggestions?.map((item, index) => (
                      <li key={index} className="box-review__suggestion-item">{item}</li>
                    ))}
                  </ul>
                </div>
              </Card>

              {/* Kinh nghiệm */}
              <Card
                loading={loading}
                className="box-review"
              >
                <div className="box-review__title">
                  <Title level={1} className="box-review__title-text">Kinh nghiệm</Title>
                </div>
                <Flex gap={10}>
                  <Flex style={{width: "45%"}} align="center" justify="center">
                    <Progress strokeWidth={8} strokeColor={"#FF7D55"} strokeLinecap="round" size={200} type="circle" percent={data?.experience?.score} format={(percent) => (<Flex vertical><span>{percent}%</span><Title level={5}>Phù hợp</Title></Flex>)}/>
                  </Flex>
                  <Space className="box-review__summary" direction="vertical" size={"middle"}>
                    {data?.experience?.matched?.map((item, index) => (
                      <Flex key={item} align="center" gap={7} className="box-review__summary-item">
                        <CheckOutlined className="box-review__summary-icon--checked"/>
                        <Text className="box-review__summary-text">{item}</Text>
                      </Flex>
                    ))}
                    {data?.experience?.unmatched?.map((item, index) => (
                      <Flex key={item} align="center" gap={7} className="box-review__summary-item">
                        <CloseOutlined className="box-review__summary-icon--unchecked"/>
                        <Text className="box-review__summary-text">{item}</Text>
                      </Flex>
                    ))}
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
                    {data?.experience?.suggestions?.map((item, index) => (
                      <li key={index} className="box-review__suggestion-item">{item}</li>
                    ))}
                  </ul>
                </div>
              </Card>

              {/* Chức danh */}
              <Card
                loading={loading}
                className="box-review"
              >
                <div className="box-review__title">
                  <Title level={1} className="box-review__title-text">Chức danh</Title>
                </div>
                <Flex gap={10}>
                  <Flex style={{width: "45%"}} align="center" justify="center">
                    <Progress strokeWidth={8} strokeColor={"#FF7D55"} strokeLinecap="round" size={200} type="circle" percent={data?.jobTitle?.score} format={(percent) => (<Flex vertical><span>{percent}%</span><Title level={5}>Phù hợp</Title></Flex>)}/>
                  </Flex>
                  <Space className="box-review__summary" direction="vertical" size={"middle"}>
                    {data?.jobTitle?.matched?.map((item, index) => (
                      <Flex key={item} align="center" gap={7} className="box-review__summary-item">
                        <CheckOutlined className="box-review__summary-icon--checked"/>
                        <Text className="box-review__summary-text">{item}</Text>
                      </Flex>
                    ))}
                    {data?.jobTitle?.unmatched?.map((item, index) => (
                      <Flex key={item} align="center" gap={7} className="box-review__summary-item">
                        <CloseOutlined className="box-review__summary-icon--unchecked"/>
                        <Text className="box-review__summary-text">{item}</Text>
                      </Flex>
                    ))}
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
                    {data?.jobTitle?.suggestions?.map((item, index) => (
                      <li key={index} className="box-review__suggestion-item">{item}</li>
                    ))}
                  </ul>
                </div>
              </Card>

              {/* Học vấn */}
              <Card
                loading={loading}
                className="box-review"
              >
                <div className="box-review__title">
                  <Title level={1} className="box-review__title-text">Học vấn</Title>
                </div>
                <Flex gap={10}>
                  <Flex style={{width: "45%"}} align="center" justify="center">
                    <Progress strokeWidth={8} strokeColor={"#FF7D55"} strokeLinecap="round" size={200} type="circle" percent={data?.education?.score} format={(percent) => (<Flex vertical><span>{percent}%</span><Title level={5}>Phù hợp</Title></Flex>)}/>
                  </Flex>
                  <Space className="box-review__summary" direction="vertical" size={"middle"}>
                    {data?.education?.matched?.map((item, index) => (
                      <Flex key={item} align="center" gap={7} className="box-review__summary-item">
                        <CheckOutlined className="box-review__summary-icon--checked"/>
                        <Text className="box-review__summary-text">{item}</Text>
                      </Flex>
                    ))}
                    {data?.education?.unmatched?.map((item, index) => (
                      <Flex key={item} align="center" gap={7} className="box-review__summary-item">
                        <CloseOutlined className="box-review__summary-icon--unchecked"/>
                        <Text className="box-review__summary-text">{item}</Text>
                      </Flex>
                    ))}
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
                    {data?.education?.suggestions?.map((item, index) => (
                      <li key={index} className="box-review__suggestion-item">{item}</li>
                    ))}
                  </ul>
                </div>
              </Card>
            </Space>
          </div>
        </div>
      </div>
    </>
  );
};
export default ReviewCv;
