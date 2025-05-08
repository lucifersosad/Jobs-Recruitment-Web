import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  message,
  Row,
  Space,
  Typography,
} from "antd";
import { useState } from "react";
import {
  PlusSquareOutlined,
  DeleteOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import MemoizedTinyMce from "../../../components/clients/tinyEditor";
import { createMyCv } from "../../../services/clients/myCvsApi";

const CreateCv = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [form] = Form.useForm();
  const { Text, Title } = Typography;

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
    try {
      const result = await createMyCv(values)
      console.log("🚀 ~ handleForm ~ result:", result)
    } catch (error) {
      console.log("🚀 ~ handleForm ~ error:", error)
    }
  };

  return (
    <>
      {contextHolder}
      <div className="cb-section cb-section-padding-bottom bg-grey2">
        <div className="container">
          <Card>
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
                            {fields.map(({ key, name, ...restField }, index) => (
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
                                        value={form.getFieldValue(['educations', index, 'description'])}
                                        onChange={(val) => {
                                          const updated = [...form.getFieldValue('educations')];
                                          updated[index] = {
                                            ...updated[index],
                                            description: val,
                                          };
                                          form.setFieldsValue({ educations: updated });
                                        }}
                                      />
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </Card>
                            ))}

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
                            {fields.map(({ key, name, ...restField }, index) => (
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
                                        value={form.getFieldValue(['experiences', index, 'description'])}
                                        onChange={(val) => {
                                          const updated = [...form.getFieldValue('experiences')];
                                          updated[index] = {
                                            ...updated[index],
                                            description: val,
                                          };
                                          form.setFieldsValue({ experiences: updated });
                                        }}
                                      />
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </Card>
                            ))}

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
                            {fields.map(({ key, name, ...restField }, index) => (
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
                                        value={form.getFieldValue(['skills', index, 'description'])}
                                        onChange={(val) => {
                                          const updated = [...form.getFieldValue('skills')];
                                          updated[index] = {
                                            ...updated[index],
                                            description: val,
                                          };
                                          form.setFieldsValue({ skills: updated });
                                        }}
                                      />
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </Card>
                            ))}

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
                            {fields.map(({ key, name, ...restField }, index) => (
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
                            ))}

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
                            {fields.map(({ key, name, ...restField }, index) => (
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
                            ))}

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
                            {fields.map(({ key, name, ...restField }, index) => (
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
                                        value={form.getFieldValue(['activities', index, 'description'])}
                                        onChange={(val) => {
                                          const updated = [...form.getFieldValue('activities')];
                                          updated[index] = {
                                            ...updated[index],
                                            description: val,
                                          };
                                          form.setFieldsValue({ activities: updated });
                                        }}
                                      />
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </Card>
                            ))}

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

                <Form.Item>
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
                </Form.Item>
              </Space>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );
};
export default CreateCv;
