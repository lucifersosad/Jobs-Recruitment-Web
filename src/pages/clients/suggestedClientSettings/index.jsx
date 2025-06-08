import { Col, DatePicker, Form, Radio, Row, Select, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useDebounce } from "use-debounce";
import { useCallback, useEffect, useState } from "react";
import NotifyClient from "../../../components/clients/notify";
import { faBriefcase, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useDispatch, useSelector } from "react-redux";
import { dataDegree, dataExperience, dataLevel, optionsSalary, optionsYearsOfExperience } from "./js/options";

import { fetchApi, loadApi } from "./js/fetchApi";
import { removeAccents } from "../../../helpers/removeAccents";
import banner from "./images/banner.png";
import { changeJobSuggestions } from "../../../services/clients/user-userApi";

import { UpdateDataAuthClient } from "../../../update-data-reducer/clients/updateDataClient";
import moment from "moment";
import SelectSkillDebounce from "../../../components/alls/SelectSkillDebounce";
function SuggestedClientSettings() {
  const [message, setMessage] = useState("");
  const [noti, setNoti] = useState(false);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState([]);
  const [jobCategoires, setJobCategories] = useState([]);
  const [skill, setSkill] = useState([]);
  const [jobPosition, setJobPosition] = useState([]);
  const [text, setText] = useState("");

  const MAX_COUNT = 5;

  const [contentSelect, setContentSelect] = useState(
    "Vui lòng nhập tối thiểu 2 ký tự để tìm kiếm!"
  );
  const dispatch = useDispatch();
  const [valueDebounce] = useDebounce(text, 300);
  const [form] = Form.useForm();

  const authenMainClient = useSelector(
    (status) => status.authenticationReducerClient
  );

  useEffect(() => {
    fetchApi(setCity, setSkill, setJobCategories);
  }, [])

  useEffect(() => {
    //Lấy ra trạng thái của authenMainClient false là chưa đăng nhập true là đã đăng nhập
    const { infoUser } = authenMainClient;
    //Nếu đã đăng nhập thì sẽ set giá trị mặc định cho form
    const objectVlue = {
      ...infoUser
    };
    if(infoUser?.dateOfBirth){
      objectVlue.dateOfBirth = moment(infoUser?.dateOfBirth);
    }
    if (infoUser?.skills?.length > 0 ) {
      const newSkills = objectVlue.skills.map(item => item?.title)
      objectVlue.skills = newSkills;
    } else {
      objectVlue.skills = []
    }
    form.setFieldsValue(objectVlue);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenMainClient]);
  useEffect(() => {
    loadApi(setJobPosition, valueDebounce);
  }, [valueDebounce]);

  const handleForm = async (valueForm) => {
    try {
   
     //Chuyển đổi thành dạng date của moment
      //Chuyển đổi thành dạng iso
      valueForm.dateOfBirth = valueForm.dateOfBirth.toISOString();
      const newSkills = valueForm.skills?.map(item => ({title: item}))
      valueForm.skills = newSkills
      console.log("🚀 ~ handleForm ~ valueForm:", valueForm)
      // return;
    
      setLoading(true);

      const result = await changeJobSuggestions(valueForm);
      if (result.code === 200) {
        await UpdateDataAuthClient(dispatch);
        setMessage(result.success);
        setNoti(true);
      } else if (result.code === 401) {
        setMessage(result.error);
        setNoti(false);
      } else {
        setMessage("Cập nhật thất bại!");
        setNoti(false);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(true);
      setMessage("Lỗi server. Vui lòng thử lại sau!");
      setNoti(false);
    }
  };

  const changeValue = useCallback((input) => {
    if (input.length > 1) {
      setContentSelect("Đang tìm kiếm...");
      setText(input); // Cập nhật giá trị để debounce
    } else {
      setText("");
      setContentSelect("Vui lòng nhập tối thiểu 2 ký tự để tìm kiếm!");
    }
  }, []);
  
  useEffect(() => {
    if (valueDebounce) {
      setContentSelect("Đang tìm kiếm...");
      loadApi(setJobPosition, valueDebounce)
        .then(() => {
          setContentSelect("Không tìm thấy kết quả phù hợp");
        })
        .catch(() => {
          setContentSelect("Lỗi khi tải dữ liệu");
        });
    }
  }, [valueDebounce]);
  

  return (
    <div className="col-8 ">
      <div className="box-settings-info">
        <div className="box-settings-info__image">
          <img src={banner} alt="banner" />
        </div>
        <div className="box-settings-info__title2">
          <h1>Vui lòng hoàn thiện các thông tin dưới đây</h1>
          <p>(*) Các thông tin dưới đây đều là bắt buộc</p>
        </div>
        {message !== "" && <NotifyClient noti={noti}>{message}</NotifyClient>}
        <div className="box-settings-info__form">
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
            <Form layout="vertical" onFinish={handleForm} form={form}>
              <hr />
              <div className="box-settings-info__h2">
                <FontAwesomeIcon icon={faUser} />
                <h2 className="col-6">Thông tin cơ bản</h2>
              </div>

              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn giới tính",
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value={1}>Nữ</Radio>
                  <Radio value={2}>Nam</Radio>
                  <Radio value={3}>Khác</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label="Ngày sinh"
                name="dateOfBirth"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập ngày sinh",
                  },
                ]}
              >
                <DatePicker
                  format={{
                    format: "YYYY-MM-DD",
                    type: "mask",
                  }}
                />
              </Form.Item>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="Bằng cấp cao nhất"
                    name="educationalLevel"
                    rules={[
                      {
                        required: true,
                        message: "Bằng cấp bắt buộc",
                      },
                    ]}
                  >
                    <Select 
                      filterOption={(input, option) =>
                        removeAccents(option.label)
                          .toLowerCase()
                          .includes(removeAccents(input).toLowerCase()) ||
                        removeAccents(option.value)
                          .toLowerCase()
                          .includes(removeAccents(input).toLowerCase())
                      }
                      showSearch
                      placeholder="-- Chọn bằng cấp cao nhất --"
                      size="large"
                      options={dataDegree}
                    />
                  </Form.Item>
                </Col>
                
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="Cấp bậc hiện tại"
                    name="level"
                    rules={[
                      {
                        required: true,
                        message: "Cấp bậc bắt buộc",
                      },
                    ]}
                  >
                    <Select 
                      filterOption={(input, option) =>
                        removeAccents(option.label)
                          .toLowerCase()
                          .includes(removeAccents(input).toLowerCase()) ||
                        removeAccents(option.value)
                          .toLowerCase()
                          .includes(removeAccents(input).toLowerCase())
                      }
                      showSearch
                      placeholder="-- Chọn cấp bậc hiện tại --"
                      size="large"
                      options={dataLevel}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="Kinh nghiệm"
                    name="yearsOfExperience"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn kinh nghiệm",
                      },
                    ]}
                  >
                    <Select
                      filterOption={(input, option) =>
                        removeAccents(option.label)
                          .toLowerCase()
                          .includes(removeAccents(input).toLowerCase()) ||
                        removeAccents(option.value)
                          .toLowerCase()
                          .includes(removeAccents(input).toLowerCase())
                      }
                      showSearch
                      placeholder="-- Chọn kinh nghiệm làm việc mong muốn --"
                      size="large"
                      options={dataExperience}
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <hr />

              <div className="box-settings-info__h2">
                <FontAwesomeIcon icon={faBriefcase} />
                <h2>Nhu cầu công việc</h2>
              </div>
              <Form.Item
                label="Ngành nghề"
                name="job_categorie_id"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập ngành nghề",
                  },
                ]}
              >
                <Select
                  filterOption={(input, option) =>
                    removeAccents(option.label)
                      .toLowerCase()
                      .includes(removeAccents(input).toLowerCase()) ||
                    removeAccents(option.value)
                      .toLowerCase()
                      .includes(removeAccents(input).toLowerCase())
                  }
                  showSearch
                  placeholder="-- Chọn ngành nghề mong muốn của bạn --"
                  size="large"
                  options={jobCategoires}
                  // mode="multiple"
                  // maxTagCount={3}
                  // maxCount={5}
                />
              </Form.Item>
              {/* <Form.Item
                label="Kinh nghiệm"
                name="yearsOfExperience"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn kinh nghiệm",
                  },
                ]}
              >
                <Select
                  filterOption={(input, option) =>
                    removeAccents(option.label)
                      .toLowerCase()
                      .includes(removeAccents(input).toLowerCase()) ||
                    removeAccents(option.value)
                      .toLowerCase()
                      .includes(removeAccents(input).toLowerCase())
                  }
                  showSearch
                  placeholder="-- Chọn kinh nghiệm làm việc mong muốn --"
                  size="large"
                  options={optionsYearsOfExperience}
                />
              </Form.Item> */}
              <Form.Item
                label="Mức lương"
                name="desiredSalary"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn mức lương",
                  },
                ]}
              >
                <Select
                  filterOption={(input, option) =>
                    removeAccents(option.label)
                      .toLowerCase()
                      .includes(removeAccents(input).toLowerCase()) ||
                    removeAccents(option.value)
                      .toLowerCase()
                      .includes(removeAccents(input).toLowerCase())
                  }
                  showSearch
                  placeholder="-- Chọn mức lương mong muốn --"
                  size="large"
                  options={optionsSalary}
                />
              </Form.Item>
              <Form.Item
                label="Địa điểm làm việc"
                name="workAddress"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn địa điểm làm việc",
                  },
                ]}
              >
                <Select
                  placeholder="-- Chọn địa điểm làm việc mong muốn --"
                  filterOption={(input, option) =>
                    removeAccents(option.label)
                      .toLowerCase()
                      .includes(removeAccents(input).toLowerCase()) ||
                    removeAccents(option.value)
                      .toLowerCase()
                      .includes(removeAccents(input).toLowerCase())
                  }
                  maxTagCount={3}
                  maxTagTextLength={10}
                  maxCount={MAX_COUNT}
                  mode="multiple"
                  showSearch
                  size="large"
                  options={city}
                />
              </Form.Item>
              <Form.Item>
                <button className="button-submit" type="submit">
                  Cập nhật
                </button>
              </Form.Item>
            </Form>
          </Spin>
        </div>
      </div>
    </div>
  );
}
export default SuggestedClientSettings;
