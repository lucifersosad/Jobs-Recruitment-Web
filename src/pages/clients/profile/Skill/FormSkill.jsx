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
  Rate,
  Row,
  Spin,
  Typography,
} from "antd";

import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { removeAccents } from "../../../../helpers/removeAccents";
import { companies, positions } from "../../../../helpers/mockData";
import UploadImages from "../../../../components/alls/UploadImage";
import { updateSkill } from "../../../../services/clients/user-userApi";
import { getListSkill } from "../../../../services/common";

const FormSkill = ({ getData, skill, skills, closeModal, api }) => {
  const [openAlert, setOpenAlert] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [optionsSkill, setOptionsSkill] = useState([]);
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null);

  const [form] = Form.useForm();

  const { TextArea } = Input;

  const handleSearchSkills = async (searchText) => {    
    setLoading(true)

    if (!searchText || searchText.trim() === "") {
      setOptionsSkill([]);
      setLoading(false)
      return;
    }
    
    const result = await getListSkill(searchText)
    console.log("🚀 ~ handleSearchSkills ~ result:", result)
    
    const valueUniversity = result.data.map((item) => ({ key: item._id, value: item.title }));
    const options = valueUniversity.length === 0 ? [] : valueUniversity;

    setOptionsSkill(options);
    setLoading(false)
  };

  const handleSearchDebounce = (searchText) => {
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      handleSearchSkills(searchText);
    }, 500);
  }

  // const handleSearchSkills = async (searchText) => {
  //   if (!searchText) {
  //     setOptionsSkill([]);
  //     return;
  //   }

  //   const filterSkill = skillOptions.filter((item) =>
  //     removeAccents(item.title.toLowerCase()).includes(
  //       removeAccents(searchText.toLowerCase())
  //     )
  //   );
  //   const valueSkill = filterSkill.map((item) => ({ value: item.title }));
  //   const options = valueSkill.length === 0 ? [] : valueSkill;
  //   setOptionsSkill(options);
  // };

  const defaultValue = {
    title: skill ? skill.title : "",
    description: skill ? skill.description : "",
    rate: skill ? parseFloat(skill.rate) : "",
  };

  const handleForm = async (valueForm) => {
    setLoadingSubmit(true)
    try {
      // console.log("🚀 ~ handleForm ~ valueForm:", valueForm);
      // console.log("🚀 ~ Formskill ~ skills:", skills);
      // console.log("🚀 ~ Formskill ~ skill:", skill);

      const index = skills?.findIndex((exp) => exp._id === skill?._id);

      if (index !== undefined && index !== -1) {
        skills[index] = { ...skills[index], ...valueForm }
      } else {
        skills.push(valueForm)
      }
        
      // console.log("🚀 ~ handleForm ~ skills:", skills)

      // return;

      const result = await updateSkill(skills);
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
      const newSkills = skills.filter(item => item._id !== skill._id)
      const result = await updateSkill(newSkills);
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
            <Form.Item label="Tên kỹ năng" name="title" rules={[
                {
                  required: true,
                  message: "Vui Lòng Nhập Tên Kỹ Năng!",
                },
              ]}>
              <AutoComplete
                autoFocus
                options={optionsSkill}
                onSearch={handleSearchDebounce}
              >
                <Input placeholder="Nhập kỹ năng" suffix={loading && <Spin indicator={<LoadingOutlined spin />} />}/>
              </AutoComplete>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Đánh giá" name="rate">
              <Rate style={{fontSize: "28px"}} allowHalf/>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Mô tả chi tiết" name="description">
              <TextArea rows={4} minLength={4} placeholder="Mô tả chi tiết kỹ năng"/>
            </Form.Item>
          </Col>


          {skill && (
            <Col xs={12}>
              <Form.Item>
                <Button block danger size="large" onClick={() => setOpenAlert(true)}>Xóa</Button>
              </Form.Item>  
            </Col>
          )}

          <Col xs={12} offset={skill ? 0 : 6}>
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
            <Typography.Text>Tất cả thông tin về kỹ năng sẽ bị xóa vĩnh viễn</Typography.Text>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
};
export default FormSkill;
