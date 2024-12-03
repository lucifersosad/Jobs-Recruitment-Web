import { Checkbox, Form, Input, Spin } from "antd";
import { KeyOutlined, LoadingOutlined } from "@ant-design/icons";

import "./resetPassword.scss";

import { Link, useParams } from "react-router-dom";
import {
  checkTokenReset,
  resetPassword,
} from "../../../services/clients/user-userApi";
import { useEffect, useState } from "react";

import NotifyClient from "../../../components/clients/notify";
import NotFound from "../notFound";
function ResetPassword() {
  const { token } = useParams();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [noti, setNoti] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const fetchApi = async () => {
    try {
      if (token) {
        const obj = {
          tokenReset: token,
        };
        const result = await checkTokenReset(obj);
        if (result.code === 200) {
          setEmail(result.email);
        } else {
          setEmail("");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchApi();
  }, []);

  const handleForm = async (valueForm) => {
    try {
      setLoading(true);
      if (!valueForm.accept) {
        delete valueForm.accept;
      }
      valueForm.email = email;
      const result = await resetPassword(valueForm);
      if (result.code === 200) {
        setMessage(result.success);
        setSuccess(true);
        setNoti(true);
      } else {
        setMessage(result.error);
        setNoti(false);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {email === "" ? (
        <NotFound />
      ) : (
        <>
          <div className="cb-section client-reset">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="client-reset__form">
                    <h2 className="title text-center">
                      {success
                        ? "Tạo mật khẩu thành công"
                        : "Tạo lại mật khẩu của bạn"}
                    </h2>
                    <p className="description text-center">
                      Tận hưởng những cơ hội sự nghiệp độc đáo ngay lập tức bằng
                      cách đăng nhập, xây dựng một hồ sơ đặc sắc, và mở đầu cho
                      hành trình thành công của bạn.
                    </p>
                    {!success ? (
                      email !== "" && (
                        <>
                          {message !== "" && (
                            <NotifyClient noti={noti}>{message}</NotifyClient>
                          )}
                          <Spin
                            spinning={loading}
                            size="large"
                            tip={
                              <span
                                style={{ color: "#35b9f1", fontSize: "20px" }}
                              >
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
                            <Form onFinish={handleForm} layout="vertical">
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
                                    <KeyOutlined
                                      style={{ padding: "0 10px 0 0" }}
                                    />
                                  }
                                />
                              </Form.Item>

                              <Form.Item
                                label="Nhập lại mật khẩu"
                                name="reEnterPassword"
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng nhập mật khẩu!",
                                  },
                                ]}
                              >
                                <Input.Password
                                  prefix={
                                    <KeyOutlined
                                      style={{ padding: "0 10px 0 0" }}
                                    />
                                  }
                                />
                              </Form.Item>

                              <Form.Item name="accept" valuePropName="checked">
                                <Checkbox>
                                  Đăng xuất ra khỏi thiết bị khác
                                </Checkbox>
                              </Form.Item>
                              <Form.Item>
                                <button className="button-submit" type="submit">
                                  Tạo mật khẩu mới
                                </button>
                              </Form.Item>
                            </Form>
                          </Spin>
                          <div className="row align-self-center justify-content-between">
                            <Link
                              className="col-6"
                              to={"/login"}
                              style={{ color: "#25a6dd", textAlign: "left" }}
                            >
                              Quay lại đăng nhập
                            </Link>
                            <Link
                              className="col-6"
                              to={"/register"}
                              style={{ color: "#25a6dd", textAlign: "right" }}
                            >
                              Đăng ký tài khoản mới
                            </Link>
                          </div>
                        </>
                      )
                    ) : (
                      <>
                        <a
                          className="col-6 button-login-succses"
                          href={"/login"}
                        >
                          Đăng nhập ngay
                        </a>
                      </>
                    )}

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
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
export default ResetPassword;
