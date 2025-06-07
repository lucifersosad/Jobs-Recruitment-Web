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
import { updateProfile, updateSkill } from "../../../../services/clients/user-userApi";
import { getListSkill } from "../../../../services/common";

const FormInfo = ({ profile, getData, closeModal, api }) => {
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
    jobTitle: profile.jobTitle,
    jobObjective: profile.jobObjective
  };

  const handleForm = async (valueForm) => {
    setLoadingSubmit(true)
    try {

      const result = await updateProfile(valueForm);
      if (result.code === 200) {
        api.success({
          message: `Success`,
          description: (
            <>
              <i>{result.success}</i>
            </>
          ),
        });
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
    setLoadingSubmit(false)
  };



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
            <Form.Item label="Chức danh" name="jobTitle" rules={[
                {
                  required: true,
                  message: "Vui Lòng Nhập Chức Danh",
                },
              ]}>
              <AutoComplete
                autoFocus
                options={optionsSkill}
                onSearch={handleSearchDebounce}
              >
                <Input placeholder="Nhập chức danh" suffix={loading && <Spin indicator={<LoadingOutlined spin />} />}/>
              </AutoComplete>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Mục tiêu nghề nghiệp" name="jobObjective">
              <TextArea rows={4} placeholder="Nhập mục tiêu nghề nghiệp"/>
            </Form.Item>
          </Col>


          <Col xs={12} offset={6}>
            <Form.Item>
              <Button htmlType="submit" type="primary" ty block size="large" loading={loadingSubmit}>Cập nhật</Button>
            </Form.Item>  
          </Col>

        </Row>
      </Form>
    </>
  );
};
export default FormInfo;
