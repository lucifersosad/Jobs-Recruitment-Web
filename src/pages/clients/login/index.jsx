import { Form, Input, Spin } from "antd";
import { KeyOutlined, LoadingOutlined } from "@ant-design/icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faLinkedinIn,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";
import "./login.scss";

import banner from "./images/banner.png";
import { Link } from "react-router-dom";
import { loginUser } from "../../../services/clients/user-userApi";
import Cookies from "js-cookie";
import { useState } from "react";
import NotifyClient from "../../../components/clients/notify";

function Login() {

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [noti, setNoti] = useState(false);
  const handleForm = async (valueForm) => {
    try {
      setLoading(true);
      const result = await loginUser(valueForm);
     
      if (result.code === 200) {
        console.log("🚀 ~ handleForm ~ result:", result)
        
        Cookies.set("token-user", result.token, { expires: 3 }); // expires: số ngày cookie sẽ hết hạn
      
        window.location.href = "/";
       
      } else {
        setMessage(result.error);
        setNoti(false);
      }
      setLoading(false);
    } catch (error) {
      setMessage("Lỗi rồi");
      setNoti(false);
    }
  };
  return (
    <>

      <div className="cb-section client-login">
        <div className="container">
          <div className="row">
            <div className="col-7">
              <div className="client-login__form">
                <h2 className="title">Chào mừng bạn quay trở lại</h2>
                <p className="description">
                  Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự
                  nghiệp lý tưởng
                </p>
                {message !== "" && (
                  <NotifyClient noti={noti}>{message}</NotifyClient>
                )}
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
                  <Form layout="vertical" onFinish={handleForm}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập đúng định dạng email!",
                        },
                      ]}
                    >
                      <Input
                        prefix={
                          <FontAwesomeIcon
                            icon={faEnvelope}
                            style={{ padding: "0 10px 0 0" }}
                          />
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      label="Mật khẩu"
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mật khẩu!",
                        },
                      ]}
                    >
                      <Input.Password
                        prefix={
                          <KeyOutlined style={{ padding: "0 10px 0 0" }} />
                        }
                      />
                    </Form.Item>
                    <Form.Item style={{ textAlign: "right" }}>
                      <Link
                        to={"/forgot-password"}
                        style={{ color: "#25a6dd" }}
                        href=""
                      >
                        Quên mật khẩu
                      </Link>
                    </Form.Item>

                    <Form.Item>
                      <button className="button-submit" type="submit">
                        Đăng nhập
                      </button>
                    </Form.Item>
                  </Form>
                </Spin>

                <p className="flast-login">Đăng nhập nhanh</p>
                <div className="box-flast-login">
                  <div className="row">
                    <div className="col-4">
                      <div className="box-icon google">
                        <FontAwesomeIcon icon={faGoogle} />
                        <span>Google</span>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="box-icon facebook">
                        <FontAwesomeIcon icon={faFacebookF} />
                        <span>Facebook</span>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="box-icon linkedin">
                        <FontAwesomeIcon icon={faLinkedinIn} />
                        <span>Linkedin</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box-register">
                  <p>
                    Bạn chưa có tài khoản?{" "}
                    <Link to={"/register"} style={{ color: "#25a6dd" }}>
                      Đăng ký ngay
                    </Link>
                  </p>
                </div>
                <hr />
                <div className="box-helper">
                  <p>Bạn gặp khó khăn khi tạo tài khoản?</p>
                  <p>
                    Vui lòng liên hệ tới số{" "}
                    <a href="tel:+84879279678" style={{ color: "#69b5d6" }}>
                      (+84) 879279678
                    </a>{" "}
                    để được hỗ trợ
                  </p>
                </div>
              </div>
            </div>
            <div className="col-5">
              <div className="client-login__image">
                <img src={banner} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;
