import { EditOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import {
  Card,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Spin,
  notification,
} from "antd";
import TinyMce from "../../../components/admins/tinyEditor";
import { LoadingOutlined } from "@ant-design/icons";
import {
  editCategories,
  getTreeCategories,
} from "../../../services/admins/jobsCategoriesApi";
import { SelectTree } from "../../../helpers/selectTree";
import { convertThumbUrl } from "../../../helpers/convertThumbUrl";
import { decData } from "../../../helpers/decData";
import {
  handleCancel,
  handleUpdateDataAccounts,
  handleUpdateDataCategories,
} from "../../../helpers/modelHelper";
import { handleFileChange } from "../../../helpers/imagesHelper";
import { getContentTiny } from "../../../helpers/getContentTinymce";
import { editAdmins } from "../../../services/admins/adminsApi";
import { getAllRoles } from "../../../services/admins/rolesApi";

function FormEdit(props) {
  const { record, fetchApiLoad } = props;

  //Notification
  const [api, contextHolder] = notification.useNotification();
  //Reff
  const tinyMceRef = useRef(null);
  //Sate
  const [fileImage, setFileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModal, setIsModalOpen] = useState(false);
  const [optionsRole, setOptionsRole] = useState([]);
  //Form
  const [form] = Form.useForm();

  //Function fetch api
  const fetchApi = async () => {
    const records = await getAllRoles();
    const roles = decData(records.data).map((item, index) => ({
      value: item._id,
      label: item.title,
    }));
    setOptionsRole(roles);
  };

  useEffect(() => {
    fetchApi();
  }, []);

  //Function handleForm
  const handleForm = async (valueForm) => {
    try {
      //Lấy ra id của record
      const id = record._id;
      //Khi mới chạy vào cho loading = true
      setLoading(true);
      // console.log("🚀 ~ handleForm ~ valueForm:", valueForm)
      // return;
      const result = await editAdmins(id, valueForm);

      if (result.code === 200) {
        form.resetFields();
        api.success({
          message: `Success`,
          description: (
            <>
              <i>{result.success}</i>
            </>
          ),
        });
      } else {
        api.error({
          message: <span style={{ color: "red" }}>Failed</span>,
          description: (
            <>
              <i>{result.error}</i>
            </>
          ),
        });
      }
    } catch (error) {
      api.error({
        message: <span style={{ color: "red" }}>Failed</span>,
        description: (
          <>
            <i>Lỗi Gì Đó Rồi!</i>
          </>
        ),
      });
    }
    setFileImage(null);
    fetchApiLoad();
    setIsModalOpen(false);
    //Khi chạy xong ta cho loading = false
    setLoading(false);
  };

  return (
    <>
      {contextHolder}
      {/* //Do đoạn này ta truyển form và record lên ta sẽ không cần setDefaultForm nữa vì bên handleUpdateDataJobs đã setDefaultForm rồi */}
      <span
        onClick={() => handleUpdateDataAccounts(form, setIsModalOpen, record)}
        className="button-edit"
      >
        <EditOutlined />
      </span>
      <Modal
        centered
        title="Chỉnh Sửa Tài Khoản"
        open={isModal}
        onCancel={() => handleCancel(form, setIsModalOpen)}
        footer={null}
        width={"50%"}
      >
        <Card className="addAccounts">
          {contextHolder}
          <div className="row justify-content-center align-items-center">
            <Spin
              spinning={loading}
              size="large"
              tip={
                <span style={{ color: "#35b9f1", fontSize: "20px" }}>
                  Vui Lòng Đợi...
                </span>
              }
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 36,
                    color: "#35b9f1",
                  }}
                  spin
                />
              }
            >
              <Form
                layout="vertical"
                encType="multipart/form-data"
                onFinish={handleForm}
                form={form}
              >
                <Row gutter={20}>
                  <Col xs={24} lg={12}>
                    <Form.Item
                      label="Họ Và Tên"
                      name="fullName"
                      rules={[
                        {
                          required: true,
                          message: "Vui Lòng Nhập Họ Và Tên!",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập Họ Và Tên" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Form.Item
                      label="Địa Chỉ Email"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Vui Lòng Nhập Địa Chỉ Email!",
                        },
                      ]}
                    >
                      <Input disabled placeholder="Nhập Địa Chỉ Email" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Form.Item
                      label="Số Điện Thoại"
                      name="phoneNumber"
                      rules={[
                        {
                          required: true,
                          message: "Vui Lòng Nhập Số Điện Thoại!",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập Số Điện Thoại" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Form.Item label="Mật Khẩu" name="password">
                      <Input type="password" placeholder="Nhập Mật Khẩu" />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      label="Giới Tính"
                      name="gender"
                      rules={[
                        {
                          required: true,
                          message: "Vui Lòng Nhập Giới Tính!",
                        },
                      ]}
                    >
                      <Radio.Group>
                        <Radio value="Nam">Nam</Radio>
                        <Radio value="Nu">Nữ</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      label="Địa Chỉ"
                      name="address"
                      rules={[
                        {
                          required: true,
                          message: "Vui Lòng Nhập Địa Chỉ!",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập Địa Chỉ" />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      label="Vai Trò"
                      name="role_id"
                      rules={[
                        {
                          required: true,
                          message: "Vui Lòng Nhập Vai Trò!",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Chọn Vai Trò"
                        options={optionsRole}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item>
                      <button className="button-submit-admin" type="submit">
                        Cập Nhập
                      </button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Spin>
          </div>
        </Card>
      </Modal>
    </>
  );
}
export default FormEdit;
