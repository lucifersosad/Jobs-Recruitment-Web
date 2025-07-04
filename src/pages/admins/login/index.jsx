import { Form, Input, notification } from "antd";
import "./login.scss";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { loginAdmin } from "../../../services/admins/adminsApi";
import Cookies from "js-cookie";
import { authenticationAdmin } from "../../../stores/admins/actions/auth";
import { CheckAuthAdmin } from "../../../helpers/checkAuthAdmin";

function LoginAdmin() {
  const [api, contextHolder] = notification.useNotification();

  const dispatch = useDispatch();

  const handleFornm = async (valueForm) => {
    const newDataLoign = {
      email: valueForm.email,
      password: valueForm.password,
    };
    const result = await loginAdmin(newDataLoign);
    if (result.code === 200) {
      // Thiết lập cookie cho token
      Cookies.set("token-admin", result.token, { expires: 7 }); // expires: số ngày cookie sẽ hết hạn
      const CheckAuth = await CheckAuthAdmin();
      dispatch(authenticationAdmin(true, CheckAuth.infoUser));
      window.location.href = "/admin";
      // navigate("/admin");
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
  };
  return (
    <>
      {contextHolder}
      <div className="login">
        <Form
          className="login__form"
          name="basic"
          layout="vertical"
          onFinish={handleFornm}
          autoComplete="off"
          style={{
            width: "600px",
          }}
        >
          <h1
            style={{ fontSize: "28px", fontWeight: "600", color: "#5dcaf9" }}
            className="text-center"
          >
            LOGIN HERE
          </h1>
          <Form.Item
            label="Email"
            name="email"
            initialValue={"admin@gmail.com"}
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            initialValue={"123456"}
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
            />
          </Form.Item>

          <Form.Item>
            <button type="primary" style={{ width: "100%" }}>
              Đăng Nhập
            </button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
export default LoginAdmin;
