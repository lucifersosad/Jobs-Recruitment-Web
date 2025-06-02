import { EditOutlined } from "@ant-design/icons";
import { memo, useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Spin,
  Tag,
  notification,
} from "antd";
import TinyMce from "../../../components/admins/tinyEditor";
import { LoadingOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { getTreeCategories } from "../../../services/admins/jobsCategoriesApi";
import { FormatTree, SelectTree } from "../../../helpers/selectTree";

import { decData } from "../../../helpers/decData";
import {
  handleCancel,
  handleUpdateDataJobs,
} from "../../../helpers/modelHelper";
import "./managementJobs.scss";
import { getListEmployers } from "../../../services/admins/employersApi";
import ModelMapAddress from "../../../components/admins/modelMapAddress";
import BoxGoogleMap from "../../../components/admins/mapView/boxGoogleMap";
import ModelVideoYoutube from "../../../components/admins/modelVideoYoutube";
import { phoneCheck, salaryCheck } from "../addJobs/js/validate";
import CheckBoxCustom from "../../../components/admins/checkBoxCustom";
import {
  dataDegree,
  dataExperience,
  dataJobType,
  dataLevel,
  dataProfileRequirement,
  dataReceiveEmail,
  dataWelfare,
} from "../addJobs/js/dataAddJobs";
import moment from "moment";
import TourCustom from "../../../components/admins/tourCustom";
import Search from "antd/es/input/Search";
import { getContentTiny } from "../../../helpers/getContentTinymce";
import { editJobs } from "../../../services/admins/jobsApi";
import { getCity } from "../../../services/admins/headerApi";
import SelectJobCategoryV2 from "../../../components/alls/SelectJobCategoryV2";

function FormEdit(props) {
  const { record, fetchApiLoad } = props;

  //Notification
  const [api, contextHolder] = notification.useNotification();

  //Sate
  const [tags, setTags] = useState(record.listTagName);

  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(record.address.linkMap);
  const [isModal, setIsModalOpen] = useState(false);
  const [optionsSelectTreeJobCategories, setOptionsSelectTree] = useState([]);
  console.log("🚀 ~ FormEdit ~ optionsSelectTreeJobCategories:", optionsSelectTreeJobCategories)
  const [optionsEmployers, setOptionsEmployers] = useState([]);
  const [city, setCity] = useState([]);
  //Khai báo một biến ref để lấy dữ liệu cho tinymece
  const tinyMceRefDescription = useRef(null);
  const [inputLinkYoutube, setInputLinkYoutube] = useState("");
  const tinyMceRefDetailWorkExperience = useRef(null);
  //Form
  const [form] = Form.useForm();

  const tourData = {
    description: (
      <>
        <div>
          -Là các cụm từ xuất hiện trong hồ sơ ứng viên phù hợp cho nhu cầu
          tuyển dụng của quý công ty. <br />
          - Dựa vào resume tag name hệ thống sẽ tìm và gợi ý những hồ sơ ứng
          viên phù hợp với tag name mà quý công ty đã tạo. <br />- Lựa chọn các
          tag name phù hợp với vị trí tuyển dụng của quý công ty. <br />- Bạn
          được phép tạo tối đa 10 tag name cho một vị trí tuyển dụng.
        </div>
      </>
    ),
    title: "Resume Tag",
  };
  //Function fetch api
  const fetchApi = async () => {
    try {
      const [recordJobsCategory, recordEmployers, recordCity] =
        await Promise.all([getTreeCategories(), getListEmployers(), getCity()]);

      //Lấy danh mục công việc
      if (recordJobsCategory.code === 200) {
        setOptionsSelectTree(FormatTree(recordJobsCategory.data));
      }
      //Lấy thông tin công ty
      if (recordEmployers.code === 200) {
        const convertData = decData(recordEmployers.data).map((item) => ({
          value: item._id,
          label: item.companyName,
        }));

        setOptionsEmployers(convertData);
      }
      if(recordCity.code === 200){
        const options = recordCity.data.map((item) => {
          return {
            value: `${parseInt(item.code)}&${item.slug}&${item.name}`,
            label: item.name,
          };
        });
        setCity(options)
      }
  


    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (!isModal) return;
    fetchApi();
  }, [isModal]);

  const handleChangeCompany = async (value) => {
    const response = await getListEmployers(value);
    if (response.code === 200) {
      const record = decData(response.data)[0];
      form.setFieldsValue({
        phone: record.phoneNumber,
        email: record.email,
      });
    }
  };
  //Hàm này khi người dùng thêm tag thì sẽ chạy vào
  const addTag = (value) => {
    if (!tags.includes(value) && value !== "" && tags.length < 10) {
      const newTags = [...tags, value.trim()];
      setTags(newTags);
    }
    setInputValue(""); // Reset input value
  };
  //Hàm này khi người dùng xóa tag thì sẽ chạy vào
  const log = (_, __, index) => {
    const tempOne = tags.filter((item, i) => i !== index);
    setTags(tempOne);
  };
  //Function handleForm
  const handleForm = async (valueForm) => {
    try {
      //Lấy ra id của record
      const id = record._id;
      //   //Khi mới chạy vào cho loading = true
      setLoading(true);
      //Hàm này để lấy dữ liệu từ tinymce
      if (getContentTiny(tinyMceRefDescription)) {
        valueForm.description = getContentTiny(tinyMceRefDescription);
      }
      if (getContentTiny(tinyMceRefDetailWorkExperience)) {
        valueForm.detailWorkExperience = getContentTiny(
          tinyMceRefDetailWorkExperience
        );
      }
      //Nếu vị trí tọa độ lớn hơn 0 thì mới gán vào
      if (location[0] > 0 && location[1] > 0) {
        valueForm.location = location;
      }
      //Nếu tags có dữ liệu thì mới gán vào
      if (tags.length > 0) {
        valueForm.listTagName = tags;
      }
      if (valueForm.city) {
        const [code, slug, name] = valueForm.city.split("&");
        valueForm.city = {
          slug: slug,
          code: parseInt(code),
          name: name,
        };
      }
      valueForm.featured = valueForm.featured === "true" ? true : false;
      valueForm.end_date = valueForm.end_date.toISOString();
      //Xóa những trường không có dữ liệu
      for (const item in valueForm) {
        if (valueForm[item] === undefined) {
          delete valueForm[item];
        }
      }

      const result = await editJobs(id, valueForm);
      if (result.code === 200) {
        form.resetFields();
        api.success({
          message: `Success`,
          description: (
            <>
              <i>{result.success}</i>
            </>
          ),
        });
        fetchApiLoad();
        setIsModalOpen(false);
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
      api.error({
        message: <span style={{ color: "red" }}>Failed</span>,
        description: (
          <>
            <i>Lỗi Gì Đó Rồi!</i>
          </>
        ),
      });
    }

    // //Khi chạy xong ta cho loading = false
    setLoading(false);
  };
  //Hàm này để lấy link youtube
  const changeLinkYoutube = (value) => {
    setInputLinkYoutube(value.target.value);
  };


  return (
    <>
      {contextHolder}
      <span
      //Do đoạn này ta truyển form và record lên ta sẽ không cần setDefaultForm nữa vì bên handleUpdateDataJobs đã setDefaultForm rồi
        onClick={() => handleUpdateDataJobs(form, setIsModalOpen, record)}
        className="button-edit"
      >
        <EditOutlined />
      </span>
      <Modal
        style={{
          top: 20
        }}
        width={"80%"}
        title="Chỉnh Công Việc"
        open={isModal}
        onCancel={() => handleCancel(form, setIsModalOpen)}
        footer={null}
      >
        <Card className="form-edit-jobs">
          {contextHolder}
          <div className="row justify-content-center align-items-center">
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
              <Form
                layout="vertical"
                encType="multipart/form-data"
                onFinish={handleForm}
                form={form}
                // initialValues={defaultValueForm}
              >
                <Card className="card-form-admin">
                  <div
                    className="card-header-job"
                    style={{ borderBottom: "none !important" }}
                  >
                    <h2 className="title-header">
                      <strong>THÔNG TIN TUYỂN DỤNG</strong>
                    </h2>
                  </div>

                  <Form.Item
                    label="Chức Danh Tuyển Dụng"
                    name="title"
                    rules={[
                      {
                        required: true,
                        message: "Vui Lòng Nhập Chức Danh Tuyển Dụng!",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập tiêu đề danh mục" />
                  </Form.Item>

                  <Form.Item
                    label="Ngành Nghề"
                    name="job_categorie_id"
                    rules={[
                      {
                        required: true,
                        message: "Vui Lòng Chọn Ngành Nghề!",
                      },
                    ]}
                  >
                    <SelectJobCategoryV2 
                      placeholder="Chọn Ngành Nghề"
                      options={optionsSelectTreeJobCategories}
                    />
                  </Form.Item>
                  
                  <Form.Item
                   
                    label="Tỉnh/Thành Phố"
                    name="city" // This is important
                    rules={[
                      {
                        required: true,
                        message: "Vui Lòng Chọn Thành Phố!",
                      },
                    ]}
                  >
                    <Select
                      style={{
                        width: "100%",
                      }}
                      placeholder="Chọn địa chỉ..."
                      optionLabelProp="label"
                      options={city}
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <>
                        <span>Nơi Làm Việc</span>
                        <ModelMapAddress setLocation={setLocation} />
                        {location[0] > 0 && location[1] > 0 && (
                          <p style={{ marginTop: "20px" }}>
                            <BoxGoogleMap
                              latitude={location[0]}
                              longitude={location[1]}
                            />
                          </p>
                        )}
                      </>
                    }
                    name="address"
                    rules={[
                      {
                        required: true,
                        message: "Vui Lòng Nhập Chi Tiết Địa Chỉ!",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập Chi Tiết Địa Chỉ" />
                  </Form.Item>

                  <Form.Item
                    label="Công Ty"
                    name="employerId"
                    rules={[
                      {
                        required: true,
                        message: "Vui Chọn Công Ty!",
                      },
                    ]}
                  >
                    <Select
                      onChange={handleChangeCompany}
                      placeholder="Chọn Công Ty"
                      options={optionsEmployers}
                    />
                  </Form.Item>

                  <Form.Item name="description" label="Mô Tả Công Việc">
                    <TinyMce ref={tinyMceRefDescription} />
                  </Form.Item>

                  <Form.Item
                    name="detailWorkExperience"
                    label="Yêu Cầu Công Việc"
                  >
                    <TinyMce ref={tinyMceRefDetailWorkExperience} />
                  </Form.Item>

                  <Form.Item
                    label={
                      <>
                        <span>Link Youtube Giới Thiệu Công Việc</span>
                        <ModelVideoYoutube link={inputLinkYoutube} />
                      </>
                    }
                    name="linkVideoAboutIntroducingJob"
                  >
                    <Input onChange={changeLinkYoutube} />
                  </Form.Item>

                  <Form.Item
                    label="Lương Tối Thiểu"
                    name="salaryMin"
                    style={{ display: "inline-block", marginRight: "10px" }}
                    rules={[
                      {
                        required: true,
                        message: "Vui Nhập Lương!",
                      },
                      {
                        validator: async (_, value) => {
                          await salaryCheck(value);
                        },
                      },
                    ]}
                  >
                    <InputNumber min={1000000} placeholder="Tối Thiểu*" />
                  </Form.Item>

                  <Form.Item
                    label="Lương Tối Đa"
                    name="salaryMax"
                    style={{ display: "inline-block" }}
                    rules={[
                      {
                        required: true,
                        message: "Vui Nhập Lương!",
                      },
                      {
                        validator: async (_, value) => {
                          await salaryCheck(value);
                        },
                      },
                    ]}
                  >
                    <InputNumber min={1000000} placeholder="Tối Đa*" />
                  </Form.Item>

                  <Form.Item
                    label="Hình Thức"
                    name="jobType"
                    rules={[
                      {
                        required: true,
                        message: "Vui Lòng Chọn Hình Thức Công Việc!",
                      },
                    ]}
                  >
                    <CheckBoxCustom data={dataJobType} col={6} />
                  </Form.Item>

                  <Form.Item
                    label="Hạn Nhận Hồ Sơ"
                    name="end_date"
                    rules={[
                      {
                        required: true,
                        message: "Vui Lòng Chọn Ngày Nhận Hồ Sơ!",
                      },
                    ]}
                  >
                    <DatePicker
                      disabledDate={(current) =>
                        current && current < moment().startOf("day")
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Ngôn Ngữ Trình Bày Hồ Sơ"
                    name="presentationLanguage"
                    rules={[
                      {
                        required: true,
                        message: "Vui Lòng Chọn Ngôn Ngữ Trình Bày Hồ Sơ!",
                      },
                    ]}
                  >
                    <CheckBoxCustom
                      data={dataProfileRequirement}
                      gutter={[20, 20]}
                      col={8}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<TourCustom tourData={tourData} />}
                    rules={[
                      {
                        required: true,
                        message: "Vui Lòng Chọn Trạng Thái!",
                      },
                    ]}
                  >
                    <div>
                      <Search
                        placeholder="Tag Name..."
                        enterButton={
                          <Button
                            style={{
                              backgroundColor: "#5dcaf9",
                              borderColor: "#5dcaf9",
                              height: "39px",
                            }}
                          >
                            <span style={{ color: "white" }}>Thêm Tag</span>
                          </Button>
                        }
                        size="large"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onSearch={addTag}
                      />
                      {tags.length > 0 &&
                        tags.map((item, index) => (
                          <Tag
                            style={{ marginTop: "10px" }}
                            key={item} // Use item as key
                            closeIcon={<CloseCircleOutlined />}
                            onClose={(e) => log(e, item, index)}
                          >
                            {item}
                          </Tag>
                        ))}
                    </div>
                  </Form.Item>

                  <Form.Item
                    label="Trạng Thái"
                    name="status"
                    rules={[
                      {
                        required: true,
                        message: "Vui Lòng Chọn Trạng Thái!",
                      },
                    ]}
                  >
                    <Radio.Group>
                      <Radio value="active"> Hoạt Động </Radio>
                      <Radio value="inactive"> Dừng Hoạt Động </Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    label="Nổi Bật"
                    name="featured"
                    rules={[
                      {
                        required: true,
                        message: "Vui Lòng Chọn Nổi Bật!",
                      },
                    ]}
                  >
                    <Radio.Group>
                      <Radio value="true"> Nổi Bật </Radio>
                      <Radio value="false"> Không Nổi Bật </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Card>

                <Card className="card-form-admin">
                  <div
                    className="card-header-job"
                    style={{ borderBottom: "none !important" }}
                  >
                    <h2 className="title-header">
                      <strong>PHÚC LỢI</strong>
                    </h2>
                  </div>
                  <Form.Item
                    name="welfare"
                    rules={[
                      {
                        required: true,
                        message: "Vui Lòng Chọn Phúc Lợi!",
                      },
                    ]}
                  >
                    <CheckBoxCustom
                      data={dataWelfare}
                      gutter={[20, 20]}
                      col={6}
                    />
                  </Form.Item>
                </Card>

                <Card className="card-form-admin">
                  <div
                    className="card-header-job"
                    style={{ borderBottom: "none !important" }}
                  >
                    <h2 className="title-header">
                      <strong>YÊU CẦU CHUNG</strong>
                    </h2>
                  </div>
                  <Form.Item
                    name="gender"
                    label="Giới Tính"
                    rules={[
                      {
                        required: true,
                        message: "Vui Lòng Chọn Giới Tính!",
                      },
                    ]}
                  >
                    <Radio.Group>
                      <Radio value="all"> Nam/Nữ </Radio>
                      <Radio value="boy"> Nam </Radio>
                      <Radio value="girl"> Nữ </Radio>
                    </Radio.Group>
                  </Form.Item>

                  <h3 style={{ marginBottom: "10px" }}>Tuổi</h3>
                  <Form.Item
                    name="ageMin"
                    style={{ display: "inline-block", marginRight: "10px" }}
                  >
                    <InputNumber min={18} placeholder="Từ" />
                  </Form.Item>

                  <Form.Item name="ageMax" style={{ display: "inline-block" }}>
                    <InputNumber min={18} placeholder="Đến" />
                  </Form.Item>
                  <div className="row">
                    <Form.Item
                      name="workExperience"
                      label="Kinh Nghiệm"
                      className="col-5"
                      rules={[
                        {
                          required: true,
                          message: "Vui Lòng Chọn Kinh Nghiệm!",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Chọn Kinh Nghiệm"
                        options={dataExperience}
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item
                      name="level"
                      label="Cấp Bậc"
                      className="col-4"
                      rules={[
                        {
                          required: true,
                          message: "Vui Lòng Chọn Cấp Bậc!",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Chọn Cấp Bậc"
                        options={dataLevel}
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item
                      name="educationalLevel"
                      label="Bằng Cấp"
                      className="col-3"
                      rules={[
                        {
                          required: true,
                          message: "Vui Lòng Chọn Bằng Cấp!",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Chọn Bằng Cấp"
                        options={dataDegree}
                        size="large"
                      />
                    </Form.Item>
                  </div>
                </Card>

                <Card className="card-form-admin">
                  <div
                    className="card-header-job"
                    style={{ borderBottom: "none !important" }}
                  >
                    <h2 className="title-header">
                      <strong>THÔNG TIN LIÊN HỆ</strong>
                    </h2>
                  </div>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      {
                        required: true,
                        message: "Vui Lòng Chọn Bằng Cấp!",
                      },
                    ]}
                  >
                    <Input type="email" placeholder="Nhập Email" />
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    label="Số Điện Thoại"
                    rules={[
                      {
                        required: true,
                        message: "Vui Lòng Nhập Số Điện THoại!",
                      },
                      {
                        validator: async (_, value) => {
                          await phoneCheck(value);
                        },
                      },
                    ]}
                  >
                    <Input placeholder="Nhập Email" />
                  </Form.Item>
                  <Form.Item name="website" label="Website">
                    <Input placeholder="Nhập Website" />
                  </Form.Item>
                  <Form.Item
                    name="receiveEmail"
                    label="Nhận Nội Dung Email Ngôn Ngữ"
                    rules={[
                      {
                        required: true,
                        message: "Vui Lòng Chọn Ngôn Ngữ Gửi Email!",
                      },
                    ]}
                  >
                    <Select
                      options={dataReceiveEmail}
                      placeholder="Ngôn Ngữ Nhận Email"
                    />
                  </Form.Item>
                </Card>

                <div className="row justify-content-center align-items-center">
                  <Form.Item className=" col-4">
                    <button
                      className="button-submit-admin"
                      type="submit"
                      style={{ display: "inline-block" }}
                    >
                      LƯU & ĐĂNG TUYỂN
                    </button>
                  </Form.Item>
                </div>
              </Form>
            </Spin>
          </div>
        </Card>
      </Modal>
    </>
  );
}


const MemoizedFormEdit = memo(FormEdit);
export default MemoizedFormEdit;
