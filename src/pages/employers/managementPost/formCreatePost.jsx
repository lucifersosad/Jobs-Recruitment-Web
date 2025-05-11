import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Upload, message, Card, Spin } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { createPost } from "../../../services/employers/postApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import "./managementPost.scss";

const { TextArea } = Input;

const FormCreatePost = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Bạn chỉ có thể tải lên tệp hình ảnh!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Hình ảnh phải nhỏ hơn 5MB!');
    }
    return false;
  };

  const handleSubmit = async (values) => {
    try {
      // Kiểm tra điều kiện trước khi submit
      if (!values.caption || !values.caption.trim()) {
        message.error('Nội dung bài viết không được để trống');
        return;
      }

      if (fileList.length === 0) {
        message.error('Vui lòng tải lên ít nhất một hình ảnh');
        return;
      }

      setLoading(true);
      const formData = new FormData();
      
      // Thêm caption vào formData - đảm bảo đúng tên trường
      formData.append('caption', values.caption.trim());
      
      // Thêm các file ảnh vào formData với key là "images"
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('images', file.originFileObj);
        }
      });

      // Log để debug
      console.log("FormData values:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? value.name : value}`);
      }

      const result = await createPost(formData);
      if (result?.code === 200 || result?._id) {
        message.success({
          content: "Tạo bài viết thành công",
          icon: (
            <span className="icon-message-employer-success">
              <FontAwesomeIcon icon={faCheck} />
            </span>
          ),
        });
        form.resetFields();
        setFileList([]);
        navigate("/nha-tuyen-dung/app/management-posts");
      } else {
        message.error({
          content: result?.message || "Không thể tạo bài viết",
          icon: (
            <span className="icon-message-employer-error">
              <FontAwesomeIcon icon={faCheck} />
            </span>
          ),
        });
      }
    } catch (error) {
      console.error("Error creating post:", error);
      message.error({
        content: error?.response?.data?.message || "Có lỗi xảy ra khi tạo bài viết",
        icon: (
          <span className="icon-message-employer-error">
            <FontAwesomeIcon icon={faCheck} />
          </span>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/nha-tuyen-dung/app/management-posts");
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="reset-button-employer">
          <div className="row justify-content-center align-items-center">
            <Spin
              spinning={loading}
              size="large"
              tip={
                <span style={{ color: "#f77bac", fontSize: "20px" }}>
                  Vui Lòng Đợi...
                </span>
              }
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 36,
                    color: "#f77bac",
                  }}
                  spin
                />
              }
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="space-y-4"
                encType="multipart/form-data"
              >
                <Card className="card-form-admin">
                  <div className="card-header-job" style={{ borderBottom: "none !important" }}>
                    <h2 className="title-header">
                      <strong>TẠO BÀI VIẾT MỚI</strong>
                    </h2>
                  </div>

                  <Form.Item
                    name="caption"
                    label="Nội dung bài viết"
                    rules={[
                      { required: true, message: "Vui lòng nhập nội dung bài viết" },
                      { whitespace: true, message: "Nội dung bài viết không được chỉ chứa khoảng trắng" },
                      { min: 1, message: "Nội dung bài viết không được để trống" }
                    ]}
                  >
                    <TextArea
                      placeholder="Chia sẻ thông tin về công ty, tuyển dụng..."
                      autoSize={{ minRows: 6, maxRows: 10 }}
                      style={{ 
                        borderRadius: 0,
                        resize: 'none'
                      }}
                      maxLength={1000}
                      showCount={{
                        formatter: ({ count, maxLength }) => `${count}/${maxLength}`
                      }}
                    />
                  </Form.Item>

                  <Form.Item 
                    label="Hình ảnh (tối đa 10 ảnh)"
                    name="images"
                    rules={[{ required: true, message: "Vui lòng chọn ít nhất một hình ảnh" }]}
                  >
                    <Upload
                      listType="picture-card"
                      fileList={fileList}
                      onChange={handleUploadChange}
                      beforeUpload={beforeUpload}
                      multiple
                      accept="image/*"
                    >
                      {fileList.length >= 10 ? null : uploadButton}
                    </Upload>
                  </Form.Item>
                </Card>

                <Form.Item className="col-12">
                  <div className="flex justify-end space-x-4">
                    <Button onClick={handleCancel}>
                      Hủy
                    </Button>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      style={{ background: "#f77bac", borderColor: "#f77bac" }}
                    >
                      Đăng bài
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </Spin>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FormCreatePost; 