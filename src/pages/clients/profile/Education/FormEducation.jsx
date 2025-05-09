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
  Spin,
  Typography,
} from "antd";

import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { removeAccents } from "../../../../helpers/removeAccents";
import {  majors } from "../../../../helpers/mockData";
import UploadImages from "../../../../components/alls/UploadImage";
import { updateEducation, updateExperience } from "../../../../services/clients/user-userApi";
import { getSkillList } from "../../../../services/clients/skillApi";
import { getListSchool } from "../../../../services/common";

const FormEducation = ({ getData, education, educations, closeModal, api, skills }) => {
  const [openAlert, setOpenAlert] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [optionsUniversity, setOptionsUniversity] = useState([]);
  const [optionsMajor, setOptionsMajor] = useState([]);
  const [present, setPresent] = useState(false);

  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null);

  const [form] = Form.useForm();

  const { TextArea } = Input;

  useEffect(() => {
    const present = education && !getFieldValue("end_time")
    setPresent(present)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getUniversities = async () => {
      const result = await getListSchool();
      const valueUniversity = result.data.map((item) => ({ value: item.name }));
      setOptionsUniversity(valueUniversity)
    }
    getUniversities();
  }, [])

  const handleSearchUniversities = async (searchText) => {

    setLoading(true)

    const result = await getListSchool(searchText)
    
    const valueUniversity = result.data.map((item) => ({ value: item.name }));
    const options = valueUniversity.length === 0 ? [] : valueUniversity;

    setOptionsUniversity(options);
    setLoading(false)
  };

  const handleSearchMajor = async (searchText) => {
    if (!searchText) {
      setOptionsMajor([])
      return;
    }

    const filterMajor = majors.filter((item) =>
      removeAccents(item.toLowerCase()).includes(removeAccents(searchText.toLowerCase()))
    );
    const valueMajor = filterMajor.map((item) => ({ value: item }));
    const options = valueMajor.length === 0 ? [] : valueMajor;

    setOptionsMajor(options);
  };

  const handleSearchDebounce = (searchText) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      handleSearchUniversities(searchText);
    }, 500);
  }

  const defaultValue = {
    school_name: education ? education.school_name : "",
    title: education ? education.title : "",
    start_time: education ? dayjs(`${education.start_month}/${education.start_year}`, "MM/YYYY") : "",
    end_time: (education?.end_month && education?.end_year) ? dayjs(`${education.end_month}/${education.end_year}`, "MM/YYYY") : "",
    description: education ? education.description : "",
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

      // console.log("🚀 ~ handleForm ~ valueForm:", valueForm);
      // console.log("🚀 ~ FormExperience ~ educations:", educations);
      // console.log("🚀 ~ FormExperience ~ education:", education);

      const index = educations?.findIndex((exp) => exp._id === education?._id);

      if (index !== undefined && index !== -1) {
        educations[index] = { ...educations[index], ...valueForm }
      } else {
        educations.push(valueForm)
      }
        
      // console.log("🚀 ~ handleForm ~ educations:", educations)

      // return;

      const result = await updateEducation(educations);
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
      const newEducations = educations.filter(item => item._id !== education._id)
      const result = await updateEducation(newEducations);
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
            <Form.Item label="Trường" name="school_name" rules={[
                {
                  required: true,
                  message: "Vui Lòng Nhập Trường!",
                },
              ]}>
              <AutoComplete
                autoFocus
                options={optionsUniversity}
                onSearch={handleSearchDebounce}
              >
                {/* <Input placeholder="Trường" /> */}
                <Input placeholder="Nhập tên trường/Mã trường" suffix={loading && <Spin indicator={<LoadingOutlined spin />} />}/>
              </AutoComplete>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Chuyên ngành" name="title" rules={[
                {
                  required: true,
                  message: "Vui Lòng Nhập Chuyên Ngành!",
                },
              ]}>
              <AutoComplete
                autoFocus
                options={optionsMajor}
                onSearch={handleSearchMajor}
              >
                <Input placeholder="Nhập chuyên ngành" />
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
                placeholder="MM/YYYY"
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
                  placeholder="MM/YYYY"
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
              Tôi đang học ở đây
            </Checkbox>
          </Col>

          <Col xs={24}>
            <Form.Item label="Mô tả chi tiết" name="description">
              <TextArea rows={4} minLength={4} placeholder="Mô tả chi tiết quá trình học của bạn để nhà tuyển dụng có thể hiểu bạn hơn"/>
            </Form.Item>
          </Col>

          {education && (
            <Col xs={12}>
              <Form.Item>
                <Button block danger size="large" onClick={() => setOpenAlert(true)}>Xóa</Button>
              </Form.Item>  
            </Col>
          )}

          <Col xs={12} offset={education ? 0 : 6}>
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
            <Typography.Text>Tất cả thông tin về học vấn sẽ bị xóa vĩnh viễn</Typography.Text>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
};
export default FormEducation;
