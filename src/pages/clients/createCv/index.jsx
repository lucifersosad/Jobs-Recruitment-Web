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
} from "antd";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusSquareOutlined,
  DeleteOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import MemoizedTinyMce from "../../../components/clients/tinyEditor";
import { createMyCv } from "../../../services/clients/myCvsApi";
import banner from "/images/banner-cv.png";
import DropCvModal from "./DropCvModal";

const CreateCv = () => {
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


  return (
    <>
      {contextHolder}
      <div className="cb-section cb-section-padding-bottom bg-grey2">
        <div className="container">
          <div className="box-settings-info__banner" style={{ zIndex: 1 }}>
            <div className="left">
              <h1 className="title">
                Tạo CV để các cơ hội việc làm tự tìm đến bạn
              </h1>
              <h2 className="sub-title">
                Giảm đến 50% thời gian cần thiết để tìm được một công việc phù
                hợp
              </h2>
            </div>
            <div className="right">
              <img src={banner} alt="" />
            </div>
          </div>
          <Card
            style={{
              borderTopRightRadius: 0,
              borderTopLeftRadius: 0,
              border: 0,
            }}
          >
            <Flex className="mb-2" gap={4}>
              <Text>Bạn đã có sẵn CV?</Text>
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(true);
                }}
              >
                Import ngay
              </Link>
            </Flex>
            <Form
              layout="vertical"
              encType="multipart/form-data"
              onFinish={handleForm}
              form={form}
              initialValues={defaultValue}
            >
              <Space
                style={{ width: "100%" }}
                direction="vertical"
                size={"large"}
              >
                <Row gutter={20}>
                  <Col xs={24}>
                    <Title level={4}>Thông tin cá nhân</Title>
                  </Col>
                  <Col xs={12}>
                    <Form.Item
                      label="Họ và tên"
                      name="fullName"
                      rules={[
                        {
                          required: true,
                          message: "Vui Lòng Nhập Họ Và Tên!",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập họ và tên" />
                    </Form.Item>
                  </Col>
                  <Col xs={12}>
                    <Form.Item
                      label="Vị trí ứng tuyển"
                      name="position"
                      rules={[
                        {
                          required: true,
                          message: "Vui Lòng Nhập Vị Trí Ứng Tuyển!",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập vị trí ứng tuyển" />
                    </Form.Item>
                  </Col>
                  <Col xs={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Vui Lòng Nhập Email!",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập email" />
                    </Form.Item>
                  </Col>
                  <Col xs={12}>
                    <Form.Item
                      label="Số điện thoại"
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: "Vui Lòng Nhập Số Điện Thoại!",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                  </Col>
                  <Col xs={12}>
                    <Form.Item
                      label="Địa chỉ"
                      name="address"
                      rules={[
                        {
                          required: true,
                          message: "Vui Lòng Nhập Địa Chỉ!",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập địa chỉ" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24}>
                    <Title level={4}>Mục tiêu nghề nghiệp</Title>
                  </Col>
                  <Col xs={24}>
                    <Form.Item name="objective">
                      <Input.TextArea
                        rows={4}
                        minLength={4}
                        placeholder="Mục tiêu nghề nghiệp của bạn, bao gồm mục tiêu ngắn hạn và dài hạn"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24}>
                    <Flex
                      align="center"
                      style={{ marginBottom: 10 }}
                      justify="space-between"
                    >
                      <Title level={4} style={{ margin: 0 }}>
                        Học vấn
                      </Title>
                    </Flex>
                  </Col>
                  <Col xs={24}>
                    <Form.List name="educations">
                      {(fields, { add, remove }) => (
                        <>
                          <Space
                            direction="vertical"
                            size={"large"}
                            style={{ width: "100%" }}
                          >
                            {fields.map(
                              ({ key, name, ...restField }, index) => (
                                <Card
                                  key={key}
                                  type="inner"
                                  extra={
                                    <DeleteOutlined
                                      className="icon-delete"
                                      onClick={() => remove(name)}
                                    />
                                  }
                                >
                                  <Row gutter={20}>
                                    <Col xs={12}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, "title"]}
                                        label="Ngành học"
                                      >
                                        <Input placeholder="Nhập ngành học" />
                                      </Form.Item>
                                    </Col>
                                    <Col xs={12}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, "school_name"]}
                                        label="Trường học"
                                      >
                                        <Input placeholder="Nhập tên trường học" />
                                      </Form.Item>
                                    </Col>
                                    <Col xs={12}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, "start_date"]}
                                        label="Ngày bắt đầu"
                                      >
                                        <Input placeholder="MM-YYYY" />
                                      </Form.Item>
                                    </Col>
                                    <Col xs={12}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, "end_date"]}
                                        label="Ngày kết thúc"
                                      >
                                        <Input placeholder="MM-YYYY" />
                                      </Form.Item>
                                    </Col>
                                    <Col xs={24}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, "description"]}
                                        label="Mô tả"
                                      >
                                        <MemoizedTinyMce
                                          value={form.getFieldValue([
                                            "educations",
                                            index,
                                            "description",
                                          ])}
                                          onChange={(val) => {
                                            const updated = [
                                              ...form.getFieldValue(
                                                "educations"
                                              ),
                                            ];
                                            updated[index] = {
                                              ...updated[index],
                                              description: val,
                                            };
                                            form.setFieldsValue({
                                              educations: updated,
                                            });
                                          }}
                                        />
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                </Card>
                              )
                            )}

                            <Button
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusSquareOutlined />}
                            >
                              Thêm học vấn
                            </Button>
                          </Space>
                        </>
                      )}
                    </Form.List>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24}>
                    <Flex
                      align="center"
                      style={{ marginBottom: 10 }}
                      justify="space-between"
                    >
                      <Title level={4} style={{ margin: 0 }}>
                        Kinh nghiệm
                      </Title>
                    </Flex>
                  </Col>
                  <Col xs={24}>
                    <Form.List name="experiences">
                      {(fields, { add, remove }) => (
                        <>
                          <Space
                            direction="vertical"
                            size={"large"}
                            style={{ width: "100%" }}
                          >
                            {fields.map(
                              ({ key, name, ...restField }, index) => (
                                <Card
                                  key={key}
                                  type="inner"
                                  extra={
                                    <DeleteOutlined
                                      className="icon-delete"
                                      onClick={() => remove(name)}
                                    />
                                  }
                                >
                                  <Row gutter={20}>
                                    <Col xs={12}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, "position_name"]}
                                        label="Vị trí công việc"
                                      >
                                        <Input placeholder="Nhập vị trí công việc" />
                                      </Form.Item>
                                    </Col>
                                    <Col xs={12}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, "company_name"]}
                                        label="Công ty"
                                      >
                                        <Input placeholder="Nhập tên công ty" />
                                      </Form.Item>
                                    </Col>
                                    <Col xs={12}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, "start_date"]}
                                        label="Ngày bắt đầu"
                                      >
                                        <Input placeholder="MM-YYYY" />
                                      </Form.Item>
                                    </Col>
                                    <Col xs={12}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, "end_date"]}
                                        label="Ngày kết thúc"
                                      >
                                        <Input placeholder="MM-YYYY" />
                                      </Form.Item>
                                    </Col>
                                    <Col xs={24}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, "description"]}
                                        label="Mô tả"
                                      >
                                        <MemoizedTinyMce
                                          value={form.getFieldValue([
                                            "experiences",
                                            index,
                                            "description",
                                          ])}
                                          onChange={(val) => {
                                            const updated = [
                                              ...form.getFieldValue(
                                                "experiences"
                                              ),
                                            ];
                                            updated[index] = {
                                              ...updated[index],
                                              description: val,
                                            };
                                            form.setFieldsValue({
                                              experiences: updated,
                                            });
                                          }}
                                        />
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                </Card>
                              )
                            )}

                            <Button
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusSquareOutlined />}
                            >
                              Thêm kinh nghiệm
                            </Button>
                          </Space>
                        </>
                      )}
                    </Form.List>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24}>
                    <Flex
                      align="center"
                      style={{ marginBottom: 10 }}
                      justify="space-between"
                    >
                      <Title level={4} style={{ margin: 0 }}>
                        Kỹ năng
                      </Title>
                    </Flex>
                  </Col>
                  <Col xs={24}>
                    <Form.List name="skills">
                      {(fields, { add, remove }) => (
                        <>
                          <Space
                            direction="vertical"
                            size={"large"}
                            style={{ width: "100%" }}
                          >
                            {fields.map(
                              ({ key, name, ...restField }, index) => (
                                <Card
                                  key={key}
                                  type="inner"
                                  extra={
                                    <DeleteOutlined
                                      className="icon-delete"
                                      onClick={() => remove(name)}
                                    />
                                  }
                                >
                                  <Row gutter={20}>
                                    <Col xs={24}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, "skill_name"]}
                                        label="Kỹ năng"
                                      >
                                        <Input placeholder="Nhập tên kỹ năng" />
                                      </Form.Item>
                                    </Col>
                                    <Col xs={24}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, "description"]}
                                        label="Mô tả"
                                      >
                                        <MemoizedTinyMce
                                          value={form.getFieldValue([
                                            "skills",
                                            index,
                                            "description",
                                          ])}
                                          onChange={(val) => {
                                            const updated = [
                                              ...form.getFieldValue("skills"),
                                            ];
                                            updated[index] = {
                                              ...updated[index],
                                              description: val,
                                            };
                                            form.setFieldsValue({
                                              skills: updated,
                                            });
                                          }}
                                        />
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                </Card>
                              )
                            )}

                            <Button
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusSquareOutlined />}
                            >
                              Thêm kỹ năng
                            </Button>
                          </Space>
                        </>
                      )}
                    </Form.List>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24}>
                    <Flex
                      align="center"
                      style={{ marginBottom: 10 }}
                      justify="space-between"
                    >
                      <Title level={4} style={{ margin: 0 }}>
                        Danh hiệu và giải thưởng
                      </Title>
                    </Flex>
                  </Col>
                  <Col xs={24}>
                    <Form.List name="awards">
                      {(fields, { add, remove }) => (
                        <>
                          <Space
                            direction="vertical"
                            size={"large"}
                            style={{ width: "100%" }}
                          >
                            {fields.map(
                              ({ key, name, ...restField }, index) => (
                                <Card
                                  key={key}
                                  type="inner"
                                  extra={
                                    <DeleteOutlined
                                      className="icon-delete"
                                      onClick={() => remove(name)}
                                    />
                                  }
                                >
                                  <Row gutter={20}>
                                    <Col xs={12}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, "date"]}
                                        label="Thời gian"
                                      >
                                        <Input placeholder="YYYY" />
                                      </Form.Item>
                                    </Col>
                                    <Col xs={12}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, "title"]}
                                        label="Giải thưởng"
                                      >
                                        <Input placeholder="Nhập tên giải thưởng" />
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                </Card>
                              )
                            )}

                            <Button
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusSquareOutlined />}
                            >
                              Thêm giải thưởng
                            </Button>
                          </Space>
                        </>
                      )}
                    </Form.List>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24}>
                    <Flex
                      align="center"
                      style={{ marginBottom: 10 }}
                      justify="space-between"
                    >
                      <Title level={4} style={{ margin: 0 }}>
                        Chứng chỉ
                      </Title>
                    </Flex>
                  </Col>
                  <Col xs={24}>
                    <Form.List name="certifications">
                      {(fields, { add, remove }) => (
                        <>
                          <Space
                            direction="vertical"
                            size={"large"}
                            style={{ width: "100%" }}
                          >
                            {fields.map(
                              ({ key, name, ...restField }, index) => (
                                <Card
                                  key={key}
                                  type="inner"
                                  extra={
                                    <DeleteOutlined
                                      className="icon-delete"
                                      onClick={() => remove(name)}
                                    />
                                  }
                                >
                                  <Row gutter={20}>
                                    <Col xs={12}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, "date"]}
                                        label="Thời gian"
                                      >
                                        <Input placeholder="YYYY" />
                                      </Form.Item>
                                    </Col>
                                    <Col xs={12}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, "title"]}
                                        label="Chứng chỉ"
                                      >
                                        <Input placeholder="Nhập tên chứng chỉ" />
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                </Card>
                              )
                            )}

                            <Button
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusSquareOutlined />}
                            >
                              Thêm chứng chỉ
                            </Button>
                          </Space>
                        </>
                      )}
                    </Form.List>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24}>
                    <Flex
                      align="center"
                      style={{ marginBottom: 10 }}
                      justify="space-between"
                    >
                      <Title level={4} style={{ margin: 0 }}>
                        Hoạt động
                      </Title>
                    </Flex>
                  </Col>
                  <Col xs={24}>
                    <Form.List name="activities">
                      {(fields, { add, remove }) => (
                        <>
                          <Space
                            direction="vertical"
                            size={"large"}
                            style={{ width: "100%" }}
                          >
                            {fields.map(
                              ({ key, name, ...restField }, index) => (
                                <Card
                                  key={key}
                                  type="inner"
                                  extra={
                                    <DeleteOutlined
                                      className="icon-delete"
                                      onClick={() => remove(name)}
                                    />
                                  }
                                >
                                  <Row gutter={20}>
                                    <Col xs={12}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, "position_name"]}
                                        label="Vị trí"
                                      >
                                        <Input placeholder="Nhập vị trí của bạn" />
                                      </Form.Item>
                                    </Col>
                                    <Col xs={12}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, "group_name"]}
                                        label="Tổ chức"
                                      >
                                        <Input placeholder="Nhập tên tổ chức" />
                                      </Form.Item>
                                    </Col>
                                    <Col xs={12}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, "start_date"]}
                                        label="Ngày bắt đầu"
                                      >
                                        <Input placeholder="MM-YYYY" />
                                      </Form.Item>
                                    </Col>
                                    <Col xs={12}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, "end_date"]}
                                        label="Ngày kết thúc"
                                      >
                                        <Input placeholder="MM-YYYY" />
                                      </Form.Item>
                                    </Col>
                                    <Col xs={24}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, "description"]}
                                        label="Mô tả"
                                      >
                                        <MemoizedTinyMce
                                          value={form.getFieldValue([
                                            "activities",
                                            index,
                                            "description",
                                          ])}
                                          onChange={(val) => {
                                            const updated = [
                                              ...form.getFieldValue(
                                                "activities"
                                              ),
                                            ];
                                            updated[index] = {
                                              ...updated[index],
                                              description: val,
                                            };
                                            form.setFieldsValue({
                                              activities: updated,
                                            });
                                          }}
                                        />
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                </Card>
                              )
                            )}

                            <Button
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusSquareOutlined />}
                            >
                              Thêm hoạt động
                            </Button>
                          </Space>
                        </>
                      )}
                    </Form.List>
                  </Col>
                </Row>

                <Row>
                  <Col xs={24}>
                    <Form.Item>
                      <Button
                        style={{ marginTop: "40px" }}
                        htmlType="submit"
                        type="primary"
                        block
                        size="large"
                        loading={loadingSubmit}
                      >
                        Hoàn Thành
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>

                {/* <Form.Item>
                  <Button
                    htmlType="submit"
                    type="primary"
                    ty
                    block
                    size="large"
                    loading={loadingSubmit}
                  >
                    Hoàn Thành
                  </Button>
                </Form.Item> */}
              </Space>
            </Form>
          </Card>
        </div>
      </div>
      <DropCvModal open={open} setOpen={setOpen} handleImportCv={handleImportCv}/>
    </>
  );
};
export default CreateCv;
