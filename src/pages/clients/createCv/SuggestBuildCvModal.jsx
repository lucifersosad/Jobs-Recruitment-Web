import { Alert, Button, Col, Flex, Form, Input, message, Modal, notification, Row, Spin, Tag, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFileZipper } from "@fortawesome/free-regular-svg-icons";
import { handleFileChangeCustom } from "../../../helpers/imagesHelper";
import { convertThumbUrl } from "../../../helpers/convertThumbUrl";
import { uploadCV } from "../../../services/clients/user-userApi";
import uploadCloud from "/images/upload-cloud.webp";
import { extractMyCv, suggestBuildMyCv } from "../../../services/clients/myCvsApi";

const MOCK_PROMPTS = [
  "Tôi là sinh viên năm cuối tốt nghiệp chuyên ngành công nghệ sinh học Đại học Công Nghệ Thành phố Hồ Chí Minh. Tôi muốn tìm một công việc liên quan đến quản lý chất lượng ngành chế biến thực phẩm. Tôi chưa có kinh nghiệm về ngành này, chỉ có kinh nghiệm bán hàng part-time ở cửa hàng quần áo thời trang trong 6 tháng.",
  "Tôi học khoa Ngôn ngữ Anh trường Đại học Thăng Long. Tôi muốn tìm việc về content marketing. Tôi có thể làm được kịch bản và quay clip Tiktok, viết nội dung quảng cáo Facebook Ads và viết bài PR cho báo. Tôi đã có 6 tháng thực tập làm content tại Revu, nền tảng kết nối influencer với nhãn hàng.",
  "Tôi có 1 năm kinh nghiệm thực tập lập trình Front-end ở FSoft và 1 năm Fresher lập trình hệ thống Java ở Rikkeisoft. Tôi muốn tìm vị trí lập trình viên Full-stack. Tôi có thể giao tiếp tốt bằng Tiếng Anh.",
  "Tôi có 2 năm kinh nghiệm telesale mảng giáo dục ở công ty ILA. Tôi là leader 1 team 3 người và thường xuyên đạt & vượt KPI. Tôi mong muốn tìm một vị trí Sale Leader mới cùng ngành hoặc trong mảng bán hàng doanh nghiệp (B2B)"
]

const SuggestBuildCvModal = ({ open, setOpen, handleSuggestBuildCv }) => {
  const [filePdf, setFilePdf] = useState(null);
  const [warning, setWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");
  const refFile = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();


  const defaultValue = {
    description: "",
  };

  const handleMockPrompt = (tag) => {
    setSelectedTag(tag)
    form.setFieldsValue({description: tag})
  }

  const handleForm = async (values) => {
      // console.log("🚀 ~ CreateCv ~ values:", values);
      // return;
      setLoading(true);
      try {
        const result = await suggestBuildMyCv(values);
        if (result?.code === 200) {
          console.log("🚀 ~ handleForm ~ result:", result)
          handleSuggestBuildCv(result?.data)
          messageApi.success({
            type: "success",
            content: result.success,
          });
          setOpen(false)
  
        } else {
          messageApi.error({
            type: "error",
            content: result.error,
          });
        }
      } catch (error) {
        console.log("🚀 ~ handleForm ~ error:", error);
      }
      setLoading(false);
    };

  return (
    <>
      {contextHolder}
      <Modal
        destroyOnClose
        onCancel={() => setOpen(false)}
        width={"75%"}
        title="Gợi ý viết CV"
        open={open}
        footer={null}
        centered
        // style={{top: 20, backgroundColor: "#000"}}
      >
        <Form
              layout="vertical"
              encType="multipart/form-data"
              onFinish={handleForm}
              form={form}
              initialValues={defaultValue}
            >
              <Row>
                  <Col xs={24}>
                    <Typography.Title level={4}>Mô tả bản thân</Typography.Title>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      label="Viết một đoạn mô tả ngắn giới thiệu bản thân như kinh nghiệm làm việc, học vấn, và vị trí công việc bạn đang muốn tìm kiếm."
                      name="description"
                      rules={[
                        {
                          required: true,
                          message: "Vui Lòng Nhập Mô Tả!",
                        },
                      ]}>
                      <Input.TextArea
                        style={{fontSize: 16}}
                        rows={4}
                        minLength={4}
                        placeholder="Nhập mô tả bản thân"
                      />
                    </Form.Item>
                    <Typography.Title level={5}>Tham khảo thêm một vài ví dụ về mẫu prompt giới thiệu bản thân ở bên dưới</Typography.Title>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24}>
                    <Flex vertical gap={20}>
                      {MOCK_PROMPTS.map((item, index) => (
                        <Tag.CheckableTag 
                          key={index}
                          checked={selectedTag === item}
                          onChange={() => handleMockPrompt(item)}  
                          className="suggest-prompt-tag"
                        >
                            {item}
                        </Tag.CheckableTag>
                      ))}
                    </Flex>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6} offset={18}>
                    <Form.Item>
                      <Button
                        style={{ marginTop: "40px" }}
                        htmlType="submit"
                        type="primary"
                        block
                        size="large"
                        loading={loading}
                      >
                        Hoàn Thành
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
            </Form>
        
      </Modal>
    </>
  );
};
export default SuggestBuildCvModal;
