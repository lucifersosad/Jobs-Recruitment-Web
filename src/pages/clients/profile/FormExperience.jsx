import { AutoComplete, Col, Form, Input, Radio, Row, Select, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { companies } from "./company";
import { useCallback, useEffect, useRef, useState } from "react";
import { removeAccents } from "../../../helpers/removeAccents";
import { getSkillList } from "../../../services/clients/skillApi";

const FormExperience = () => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const debounceRef = useRef(null);

  const fetchCompanies = async (searchText) => {
    if (!searchText) {
      setOptions([])
      return;
    }

    setLoading(true)

    const result = await getSkillList()

    const skills = result.skills.map(item => item.title)
    console.log("🚀 ~ handleSearch ~ skills:", skills)
    
    const filterCompany = skills.filter(item => item.toLowerCase().includes(searchText.toLowerCase()))
    console.log("🚀 ~ getPanelValue ~ filterCompany:", filterCompany)
    const valueCompany = filterCompany.map(item => ({value: item}))
    const options =  valueCompany.length === 0 ? [] : valueCompany
    setOptions(options)
    setLoading(false)
  }

  const handleSearch = (searchText) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchCompanies(searchText);
    }, 500);
  }

  const handleForm = async (valueForm) => {};

  return (
    <>
      <Form
        layout="vertical"
        encType="multipart/form-data"
        onFinish={handleForm}
        form={form}
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
                autoFocus
                options={options}
                onSearch={handleSearch}
              >
                <Input placeholder="Công Ty" suffix={loading && <Spin indicator={<LoadingOutlined spin />} />}/>
              </AutoComplete>
            </Form.Item>
            
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              label="Địa Chỉ Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Vui Lòng Nhập Địa Chỉ Email!",
                },
              ]}
            >
              <Input disabled placeholder="Nhập Địa Chỉ Email" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              label="Số Điện Thoại"
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: "Vui Lòng Nhập Số Điện Thoại!",
                },
              ]}
            >
              <Input placeholder="Nhập Số Điện Thoại" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item label="Mật Khẩu" name="password">
              <Input type="password" placeholder="Nhập Mật Khẩu" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              label="Giới Tính"
              name="gender"
              rules={[
                {
                  required: true,
                  message: "Vui Lòng Nhập Giới Tính!",
                },
              ]}
            >
              <Radio.Group>
                <Radio value="Nam">Nam</Radio>
                <Radio value="Nu">Nữ</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              label="Địa Chỉ"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Vui Lòng Nhập Địa Chỉ!",
                },
              ]}
            >
              <Input placeholder="Nhập Địa Chỉ" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              label="Vai Trò"
              name="role_id"
              rules={[
                {
                  required: true,
                  message: "Vui Lòng Nhập Vai Trò!",
                },
              ]}
            >
              <Select placeholder="Chọn Vai Trò" options={[]} />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item>
              <button className="button-submit-admin" type="submit">
                Cập Nhập
              </button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default FormExperience;
