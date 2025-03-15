import {
  AutoComplete,
  Avatar,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  Typography,
} from "antd";

import { DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { removeAccents } from "../../../helpers/removeAccents";
import { companies, positions } from "../../../helpers/mockData";
import UploadImages from "../../../components/alls/UploadImage";
import { updateExperience } from "../../../services/clients/user-userApi";

const FormExperience = ({ getData, experience, experiences, closeModal, api, skills }) => {
  const [openAlert, setOpenAlert] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [optionsCompany, setOptionsCompany] = useState([]);
  const [optionsPosition, setOptionsPosition] = useState([]);
  const [present, setPresent] = useState(false);
  const [images, setImages] = useState([]);

  const [form] = Form.useForm();

  const { TextArea } = Input;

  useEffect(() => {
    setImages(
      getFieldValue("attachments").map((item) => ({
        url: item.image,
      }))
    );

    const present = experience && !getFieldValue("end_time")

    setPresent(present)
  }, []);

  const handleSearchCompanies = async (searchText) => {
    if (!searchText) {
      setOptionsCompany([]);
      return;
    }

    const filterCompany = companies.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    const valueCompany = filterCompany.map((item) => ({
      value: item.name,
      label: <i>{item.name + " - " + item.address}</i>,
    }));
    const options = valueCompany.length === 0 ? [] : valueCompany;
    setOptionsCompany(options);
  };

  const handleSearchPositions = async (searchText) => {
    if (!searchText) {
      setOptionsPosition([]);
      return;
    }

    const filterPosition = positions.filter((item) =>
      removeAccents(item.toLowerCase()).includes(
        removeAccents(searchText.toLowerCase())
      )
    );
    const valuePosition = filterPosition.map((item) => ({ value: item }));
    const options = valuePosition.length === 0 ? [] : valuePosition;
    setOptionsPosition(options);
  };

  const defaultValue = {
    company_name: experience ? experience.company_name : "",
    position_name: experience ? experience.position_name : "",
    start_time: experience ? dayjs(`${experience.start_month}/${experience.start_year}`, "MM/YYYY") : "",
    end_time: (experience?.end_month && experience?.end_year) ? dayjs(`${experience.end_month}/${experience.end_year}`, "MM/YYYY") : "",
    description: experience ? experience.description : "",
    attachments: experience ? experience.attachments : [],
  };

  const handleForm = async (valueForm) => {
    setLoadingSubmit(true)
    try {
      const startTime = valueForm.start_time.format("MM/YYYY").split("/");
      valueForm.start_month = startTime[0];
      valueForm.start_year = startTime[1];

      const endTime = !present && valueForm.end_time.format("MM/YYYY").split("/");
      valueForm.end_month = present ? "" : endTime[0];
      valueForm.end_year = present ? "" : endTime[1];

      valueForm.attachments = images.map((item) => ({
        type: "image",
        image: item?.url || item?.response?.data?.url,
      }));

      // console.log("🚀 ~ handleForm ~ valueForm:", valueForm);
      // console.log("🚀 ~ FormExperience ~ experiences:", experiences);
      // console.log("🚀 ~ FormExperience ~ experience:", experience);

      const index = experiences.findIndex((exp) => exp._id === experience?._id);

      if (index !== -1) {
        experiences[index] = { ...experiences[index], ...valueForm }
      } else {
        experiences.push(valueForm)
      }
        
      // console.log("🚀 ~ handleForm ~ experiences:", experiences)

      // return;

      const result = await updateExperience(experiences);
      if (result.code === 200) {
        api.success({
          message: `Success`,
          description: (
            <>
              <i>{result.success}</i>
            </>
          ),
        });
        setLoadingSubmit(false)
        closeModal();
        getData()
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
      console.log("🚀 ~ handleForm ~ error:", error);
    }
  };

  const handleDelete = async () => {
    setLoadingDelete(true)
    try {
      const newExperiences = experiences.filter(item => item._id !== experience._id)
      const result = await updateExperience(newExperiences);
      if (result.code === 200) {
        api.success({
          message: `Success`,
          description: (
            <>
              <i>{result.success}</i>
            </>
          ),
        });
        setLoadingDelete(false)
        setOpenAlert(false)
        closeModal();
        getData()
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
      console.log("🚀 ~ handleForm ~ error:", error);
    }
  }

  const { getFieldValue } = form;

  return (
    <>
      <Form
        layout="vertical"
        encType="multipart/form-data"
        onFinish={handleForm}
        form={form}
        initialValues={defaultValue}
      >
        <Row gutter={20}>
          <Col xs={24}>
            <Form.Item
              label="Công ty"
              name="company_name"
              rules={[
                {
                  required: true,
                  message: "Vui Lòng Nhập Công Ty!",
                },
              ]}
            >
              <AutoComplete
                options={optionsCompany}
                onSearch={handleSearchCompanies}
              >
                <Input placeholder="Công Ty" />
              </AutoComplete>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Chức vụ" name="position_name">
              <AutoComplete
                options={optionsPosition}
                onSearch={handleSearchPositions}
              >
                <Input placeholder="Chức vụ" />
              </AutoComplete>
            </Form.Item>
          </Col>

          <Col xs={12}>
            <Form.Item
              label="Thời gian bắt đầu"
              name="start_time"
              rules={[
                {
                  required: true,
                  message: "Vui Lòng Nhập Thời Gian Bắt Đầu!",
                },
              ]}
            >
              <DatePicker
                format="MM/YYYY"
                picker="month"
                placeholder="YYYY-MM"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          {!present && (
            <Col xs={12}>
              <Form.Item
                label="Thời gian kết thúc"
                name="end_time"
                rules={[
                  {
                    required: !present,
                    message: "Vui Lòng Nhập Thời Gian Kết Thúc!",
                  },
                ]}
              >
                <DatePicker
                  format="MM/YYYY"
                  picker="month"
                  placeholder="YYYY-MM"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          )}

          <Col xs={24}>
            <Checkbox
              checked={present}
              style={{ marginBottom: "20px" }}
              onChange={(e) => {
                setPresent(e.target.checked);
              }}
            >
              Tôi đang làm việc ở đây
            </Checkbox>
          </Col>

          <Col xs={24}>
            <Form.Item label="Mô tả chi tiết" name="description">
              <TextArea rows={4} minLength={4} />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Thêm liên kết hoặc tải lên hình ảnh về kinh nghiệm của bạn"
              name="attachments"
            >
              <UploadImages fileList={images} setFileList={setImages} />
            </Form.Item>
          </Col>

          {experience && (
            <Col xs={12}>
              <Form.Item>
                <Button block danger size="large" onClick={() => setOpenAlert(true)}>Xóa</Button>
              </Form.Item>  
            </Col>
          )}

          <Col xs={12} offset={experience ? 0 : 6}>
            <Form.Item>
              <Button htmlType="submit" type="primary" ty block size="large" loading={loadingSubmit}>Cập nhật</Button>
            </Form.Item>  
          </Col>

        </Row>
      </Form>
      <Modal
        open={openAlert}
        onOk={handleDelete}
        confirmLoading={loadingDelete}
        onCancel={() => setOpenAlert(false)}
      >
        <Flex align="center" vertical gap={10}>
          <Avatar size={50} icon={<DeleteOutlined />} style={{backgroundColor: "#FFF1F0", color: "#FF4D4F"}}/>
          <Flex align="center" vertical>
            <Typography.Title level={3}>Bạn có chắc muốn xóa</Typography.Title>
            <Typography.Text>Tất cả thông tin về kinh nghiệm sẽ bị xóa vĩnh viễn</Typography.Text>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
};
export default FormExperience;
