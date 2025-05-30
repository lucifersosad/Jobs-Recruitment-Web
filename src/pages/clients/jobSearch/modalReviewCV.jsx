import { faFile, faFolder } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Button, Flex, Form, Input, Modal, Radio, Space, Spin, message } from "antd";
import { useEffect, useRef, useState } from "react";
import uploadCloud from "./images/upload-cloud.webp";
import { phoneCheck } from "../../admins/addJobs/js/validate";
import { handleFileChangeCustom } from "../../../helpers/imagesHelper";
import { convertThumbUrl } from "../../../helpers/convertThumbUrl";

import { useNavigate } from "react-router-dom";
import { recruitmentJob } from "../../../services/clients/user-userApi";
import { Spark } from "../../../components/clients/customIcon";
import { getMyCvs } from "../../../services/clients/myCvsApi";

function ModalReviewCV({ record, infoUser, showModel }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filePdf, setFilePdf] = useState(null);
  const [warning, setWarning] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [dataCvs, setDataCvs] = useState();
  const [optionsMyCvs, setOptionsMyCvs] = useState();
  const refFile = useRef(null);
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const naviagate = useNavigate();

  const [valueMyCvs, setValueMyCvs] = useState();

  const onChange = e => {
    setValueMyCvs(e.target.value);
  };

  const style = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  };

  const showModal = () => {
    if (!infoUser) {
      naviagate("/login");
      return;
    }
    if (Object.keys(infoUser).length === 0) {
      naviagate("/login");
      return;
    }
    form.setFieldsValue(infoUser);
    setIsModalOpen(true);
  };

  const getDataCvs = async () => {
    try {
      const result = await getMyCvs()
      const options = result?.data?.map((item) => ({
        value: JSON.stringify(item),
        label: item?.nameFile
      }))
      setOptionsMyCvs(options)
      if (options?.length > 0) {
        setValueMyCvs(options[0])
      }
    } catch (error) {
      console.log("🚀 ~ getDataCvs ~ error:", error)
    }
  }

  useEffect(() => {
    getDataCvs()
  }, [])
  
  // useEffect(() => {
  //   if (showModel === "show") {
  //     showModal();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChanges = (e) => {
    if (e.target.files.length === 0) return;
    if (
      e.target.files[0].type !== "application/pdf" &&
      e.target.files[0].size > 5 * 1024 * 1024
    ) {
      setWarning(true);
      return;
    }
    setFilePdf(e.target.files[0]);
  };
  //Hàm này để mở file input lấy ảnh
  const onButtonClick = () => {
    // `current` points to the mounted file input element
    refFile.current.click();
  };
  //Hàm này để xử lý kéo thả file vào ô input nó sẽ set file vào state chỉ một file duy nhất
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.items) {
      for (var i = 0; i < 1; i++) {
        if (e.dataTransfer.items[i].kind === "file") {
          var file = e.dataTransfer.items[i].getAsFile();
          if (file.type === "application/pdf" && file.size <= 5 * 1024 * 1024) {
            setFilePdf(e.dataTransfer.files[0]);
            // Note: refFile.current.files is read-only, so you can't directly assign new files to it
          } else {
            setWarning(true);
          }
        }
      }
    }
  };
  //
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleFormSubmit = async (valueForm) => {
    try {
      setLoading(true);
      if (!filePdf) {
        messageApi.open({
          type: "error",
          content: "Vui lòng chọn CV để ứng tuyển!",
        });
        setLoading(false);
        return;
      }
      if (filePdf) {
        const fileToBase64 = await handleFileChangeCustom(filePdf);

        const base64Convert = await convertThumbUrl(fileToBase64);
        valueForm.file = base64Convert;
      }
      if (record) {
        valueForm.idJob = record._id;
        valueForm.employerId = record.employerId;
        valueForm.title = record.title
      }

      const result = await recruitmentJob(valueForm);
      if (result.code === 201) {
        form.resetFields();
        messageApi.success({
          type: "error",
          content: result.success,
        });
        handleOk()
      } else {
        messageApi.error({
          type: "error",
          content: result.error,
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      messageApi.error({
        type: "error",
        content: "Lỗi gì đó rồi!",
      });
      setLoading(false);
      console.log(error);
    }
  };

  const handleEvaluate = async () => {
    console.log("🚀 ~ ModalReviewCV ~ valueMyCvs:", valueMyCvs)
    if (!valueMyCvs) {
      messageApi.open({
        type: "error",
        content: "Vui lòng chọn ít nhất 1 CV để đánh giá!",
      });
      setLoading(false);
      return;
    }
  }

  return (
    <div>
      {contextHolder}
      <button className="button-review-ai" onClick={showModal} disabled={(record?.listProfileRequirement?.some(item => item?.idUser === infoUser?.id))}>
        <a style={{display: "flex", gap: 7, alignItems: "center"}}>
          <Spark />
          Đánh giá CV với AI
        </a>
      </button>
      <Modal
        open={isModalOpen}
        className="model-job-search"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={588}
      >
        <div className="box-title mb-3">
          <FontAwesomeIcon icon={faFolder} />
          <p>
            Chọn CV để ứng tuyển: <span>{record?.title}</span>{" "}
          </p>
        </div>
        <Spin spinning={loading}>
          <div className="box-upload">
            {warning && (
              <Alert
                className="mb-3"
                onClose={() => setWarning(false)}
                message="Thông báo"
                description="Bạn chỉ được upload file theo định dạng PDF và kích thước file nhỏ hơn 5MB."
                type="warning"
                showIcon
                closable
              />
            )}

            <div
              className="form-upload"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                onChange={handleChanges}
                ref={refFile}
                type="file"
                style={{ display: "none" }}
              />
              <div className="box-css">
                <div className="headt mb-2">
                  <img src={uploadCloud} alt="upload-cloud" />
                  <span>Tải lên Cv từ máy tính, chọn kéo thả</span>
                </div>
                <div className="bodyt mb-2">
                  <span>Hỗ trợ định dạng PDF có kích thước dưới 5MB</span>
                </div>
                <div className="footert">
                  {filePdf && (
                    <div className="view-file mb-2">
                      <FontAwesomeIcon icon={faFile} />
                      <span>{filePdf?.name}</span>
                    </div>
                  )}

                  <button onClick={onButtonClick}>Chọn CV</button>
                </div>
              </div>
            </div>
            <Radio.Group
              style={style}
              onChange={onChange}
              value={valueMyCvs}
              options={optionsMyCvs}
            />
            {/* <div className="form-post">
              <div className="content">
                <span>Vui lòng nhập đầy đủ thông tin chi tiết</span>
                <span>(*) Thông tin bắt buộc</span>
              </div>
              <Form
                form={form}
                onFinish={handleFormSubmit}
                className="formjs"
                layout="vertical"
                name="basic"
              >
                <Form.Item
                  label="Họ và tên"
                  name="fullName"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập họ tên!",
                    },
                  ]}
                >
                  <Input disabled placeholder="Họ tên hiển thị với NTD" />
                </Form.Item>
                <div className="row">
                  <Form.Item
                    className="col-6"
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập email!",
                        type: "email",
                      },
                    ]}
                  >
                    <Input
                      type="email"
                      disabled
                      placeholder="Email hiển thị với NTD"
                    />
                  </Form.Item>
                  <Form.Item
                    className="col-6"
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        type: "number",
                        validator: async (_, value) => {
                          await phoneCheck(value);
                        },
                      },
                    ]}
                  >
                    <Input placeholder="Số điện thoại hiển thị với NTD" />
                  </Form.Item>
                </div>
                <Form.Item label="Thư giới thiệu" name="introducing_letter">
                  <TextArea
                    rows={4}
                    placeholder="Viết giới thiệu ngắn gọn về bản thân (điểm mạnh, điểm yếu) và nêu rõ mong muốn, lý do bạn muốn ứng tuyển cho vị trí này."
                  />
                </Form.Item>
                <div className="button-submito">
                  <Form.Item onClick={handleCancel}>
                    <span type="submit">Hủy</span>
                  </Form.Item>
                  <Form.Item className="">
                    <button type="submit">Nộp hồ sơ ứng tuyển</button>
                  </Form.Item>
                </div>
              </Form>
            </div> */}
          </div>
        </Spin>

        <hr />
        <Flex>
          <Space gap={10} style={{marginLeft: "auto"}}>
            <Button>Hủy</Button>
            <Button type="primary" onClick={handleEvaluate}>Xem kết quả</Button>
          </Space>
        </Flex>
      </Modal>
    </div>
  );
}
export default ModalReviewCV;
