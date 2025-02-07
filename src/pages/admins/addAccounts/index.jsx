import {
  Card,
  Form,
  Image,
  Input,
  InputNumber,
  Radio,
  Select,
  Spin,
  notification,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import TinyMce from "../../../components/admins/tinyEditor";

import { useEffect, useRef, useState } from "react";
import { getContentTiny } from "../../../helpers/getContentTinymce";
import { convertThumbUrl } from "../../../helpers/convertThumbUrl";
import {
  getTreeCategories,
  uploadCategories,
} from "../../../services/admins/jobsCategoriesApi";
import { SelectTree } from "../../../helpers/selectTree";
import { decData } from "../../../helpers/decData";
import { handleFileChange } from "../../../helpers/imagesHelper";
import { useSelector } from "react-redux";
import NotFound from "../../../components/admins/notFound";
import { getAllRoles } from "../../../services/admins/rolesApi";
import { addAdmins } from "../../../services/admins/adminsApi";

function AddAccounts() {
  const [optionsRole, setOptionsRole] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileImage, setFileImage] = useState(null);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  //Khai báo một biến ref để lấy dữ liệu cho tinymece
  const tinyMceRef = useRef(null);
  //Lấy thông tin quyền từ store của  redux
  const userAdmin = useSelector(
    (dataCheck) => dataCheck.authenticationReducerAdmin
  );

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

  const handleForm = async (valueForm) => {
    //Tạo trycath bắt lỗi cho tối ưu chương trình
    try {
      //Khi mới chạy vào cho loading = true
      setLoading(true);

      const result = await addAdmins(valueForm);

      if (result.code === 201) {
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
      fetchApi();
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

    //Khi chạy xong ta cho loading = false
    setLoading(false);
  };

  const defaultValue = {
    gender: "Nam",
  };

  return (
    <Card className="addAccounts">
      {userAdmin?.status &&
      userAdmin.infoUser.permissions.includes("accounts-create") === false ? (
        <NotFound />
      ) : (
        <>
          {contextHolder}
          <h2 className="title-main-admin">Thêm Tài Khoản</h2>
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
                initialValues={defaultValue}
              >
                <div className="row">
                  <Form.Item
                    label="Họ Và Tên"
                    name="fullName"
                    className="col-12"
                    rules={[
                      {
                        required: true,
                        message: "Vui Lòng Nhập Họ Và Tên!",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập Họ Và Tên" />
                  </Form.Item>
                  <Form.Item
                    label="Địa Chỉ Email"
                    name="email"
                    className="col-12"
                    rules={[
                      {
                        required: true,
                        message: "Vui Lòng Nhập Địa Chỉ Email!",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập Địa Chỉ Email" />
                  </Form.Item>
                  <Form.Item
                    label="Số Điện Thoại"
                    name="phoneNumber"
                    className="col-12"
                    rules={[
                      {
                        required: true,
                        message: "Vui Lòng Nhập Số Điện Thoại!",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập Số Điện Thoại" />
                  </Form.Item>
                  <Form.Item
                    label="Mật Khẩu"
                    name="password"
                    className="col-12"
                    rules={[
                      {
                        required: true,
                        message: "Vui Lòng Nhập Mật Khẩu!",
                      },
                    ]}
                  >
                    <Input type="password" placeholder="Nhập Mật Khẩu" />
                  </Form.Item>
                  <Form.Item
                    label="Giới Tính"
                    name="gender"
                    className="col-12"
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
                  <Form.Item
                    label="Địa Chỉ"
                    name="address"
                    className="col-12"
                    rules={[
                      {
                        required: true,
                        message: "Vui Lòng Nhập Địa Chỉ!",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập Địa Chỉ" />
                  </Form.Item>

                  <Form.Item
                    label="Vai Trò"
                    name="role_id"
                    className="col-12"
                    rules={[
                      {
                        required: true,
                        message: "Vui Lòng Nhập Vai Trò!",
                      },
                    ]}
                  >
                    <Select placeholder="Chọn Vai Trò" options={optionsRole} />
                  </Form.Item>
                </div>

                <Form.Item>
                  <button className="button-submit-admin" type="submit">
                    Thêm
                  </button>
                </Form.Item>
              </Form>
            </Spin>
          </div>
        </>
      )}
    </Card>
  );
}

export default AddAccounts;
