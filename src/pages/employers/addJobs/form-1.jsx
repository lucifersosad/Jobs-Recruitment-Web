import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Tag,
} from "antd";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { removeAccents } from "../../../helpers/removeAccents";
import MemoizedModelMapAddress from "../../../components/admins/modelMapAddress";
import MemoizedBoxGoogleMap from "../../../components/admins/mapView/boxGoogleMap";
import MemoizedTinyMce from "../../../components/admins/tinyEditor";
import MemoizedModelVideoYoutube from "../../../components/admins/modelVideoYoutube";
import { salaryCheck } from "../../admins/addJobs/js/validate";
import MemoizedCheckBoxCustom from "../../../components/admins/checkBoxCustom";
import { dataJobType, dataProfileRequirement } from "./js/dataAddJobs";
import moment from "moment";
import Search from "antd/es/input/Search";
import { CloseCircleOutlined } from "@ant-design/icons";
import MemoizedTourCustom from "../../../components/admins/tourCustom";
import { getCity } from "../../../services/admins/headerApi";

import { decData } from "../../../helpers/decData";
import { getAllJobsCategories } from "../../../services/employers/jobsCategoriesApi";
import { getContentTiny } from "../../../helpers/getContentTinymce";
import { useDebounce } from "use-debounce";
import { loadCityFull } from "./js/loadCity";
function FormOne({ setForm_one, next, form_one }) {
  const [optionsSelectTreeJobCategories, setOptionsSelectTree] = useState([]);
  const [fullAddressCompany, setfullAddressCompany] = useState([]);
  const [objectAddress, setObjectAddress] = useState();
  const [loadingSelect, setLoadingSelect] = useState(false);
  const [textFullAddress, setTextFullAddress] = useState("");
  const [valueDebounceFullAddress] = useDebounce(textFullAddress, 300);
  const [city, setCity] = useState([]);
  const [location, setLocation] = useState([0, 0]);
  const [tags, setTags] = useState([]);
  const [inputLinkYoutube, setInputLinkYoutube] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [form] = Form.useForm();
  //Khai báo một biến ref để lấy dữ liệu cho tinymece
  const tinyMceRefDescription = useRef(null);
  const tinyMceRefDetailWorkExperience = useRef(null);
  //Hàm này để lấy link youtube
  const changeLinkYoutube = useCallback((value) => {
    setInputLinkYoutube(value.target.value);
  }, []);
  useEffect(() => {
    const fetchApi = async () => {
      const recordJobsCategory = await getAllJobsCategories();

      const recordCity = await getCity();

      if (recordJobsCategory.code === 200) {
        const convertData = recordJobsCategory.data.map((item) => {
          return {
            value: item._id,
            label: item.title,
          };
        });
        setOptionsSelectTree(convertData);
      }

      if (recordCity.code === 200) {
        console.log("🚀 ~ fetchApi ~ recordCity:", recordCity);
        const options = recordCity.data.map((item) => {
          return {
            value: `${parseInt(item.code)}&${item.slug}&${item.name}`,
            label: item.name,
          };
        });

        console.log("🚀 ~ options ~ options:", options);

        setCity(options);
      }
      if (form_one?.title) {
        const defaultValue = {
          address: form_one.address,
          description: form_one.description,
          detailWorkExperience: form_one.detailWorkExperience,
          end_date: moment(form_one.end_date),
          featured: form_one.featured ? "true" : "false",
          job_categorie_id: form_one.job_categorie_id,
          linkVideoAboutIntroducingJob: form_one.linkVideoAboutIntroducingJob,
          presentationLanguage: form_one.presentationLanguage,
          salaryMax: form_one.salaryMax,
          salaryMin: form_one.salaryMin,
          title: form_one.title,
          status: form_one.status,
          jobType: form_one.jobType,
        };
        if (form_one?.listTagName) {
          setTags(form_one.listTagName);
        }

        if (form_one?.city) {
          defaultValue.city = `${form_one.city.code}&${form_one.city.slug}&${form_one.city.name}`;
        }
        if (form_one?.location) {
          setLocation(form_one.location);
        }
        form.setFieldsValue(defaultValue);
      }
    };

    fetchApi();
  }, []);

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

  //Hàm này khi người dùng thêm tag thì sẽ chạy vào
  const addTag = (value) => {
    if (!tags.includes(value) && value !== "" && tags.length < 10) {
      const newTags = [...tags, value.trim()];
      setTags(newTags);
    }
    setInputValue(""); // Reset input value
  };
  const log = (_, __, index) => {
    const tempOne = tags.filter((item, i) => i !== index);
    setTags(tempOne);
  };
  const handleFinish = useCallback(
    (valueForm) => {
      try {
        if (getContentTiny(tinyMceRefDescription)) {
          valueForm.description = getContentTiny(tinyMceRefDescription);
        }
        //Lấy thông tin từ tinymce về chi tiết công việc
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

        setForm_one(valueForm);
        next();
      } catch (error) {
        console.log(error);
      }
    },
    [tags, location, setForm_one, next]
  );
  //Hàm này để lấy thông tin chi tiết địa chỉ khi người dùng nhập vào
  const changeValueAddress = useCallback(async (input) => {
    setLoadingSelect(true);
    if (input === "") return setTextFullAddress("");
    setTextFullAddress(input);
  }, []);

  //Check xem debaunce address có thay đổi không để lấy thông tin chi tiết địa  chỉ
  useEffect(() => {
    loadCityFull(
      objectAddress,
      setfullAddressCompany,
      valueDebounceFullAddress
    );
    setLoadingSelect(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueDebounceFullAddress]);

  console.log("🚀 ~ FormOne ~ fullAddressCompany:", fullAddressCompany);

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      layout="vertical"
      encType="multipart/form-data"
    >
      <Card className="">
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
          <Select
            showSearch
            filterOption={(input, option) =>
              removeAccents(option.label)
                .toLowerCase()
                .includes(removeAccents(input).toLowerCase()) ||
              removeAccents(option.value)
                .toLowerCase()
                .includes(removeAccents(input).toLowerCase())
            }
            mode="multiple"
            placeholder="Chọn Ngành Nghề"
            options={optionsSelectTreeJobCategories}
            dropdownRender={(menu) => {
              return (
                <>
                  <div className="search-custom-info-company">
                    <span className="item">{menu}</span>
                  </div>
                </>
              );
            }}
          />
        </Form.Item>

        <Form.Item
          className="col-4"
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
            showSearch
            filterOption={(input, option) =>
              removeAccents(option.label)
                .toLowerCase()
                .includes(removeAccents(input).toLowerCase()) ||
              removeAccents(option.value)
                .toLowerCase()
                .includes(removeAccents(input).toLowerCase())
            }
            style={{
              width: "100%",
            }}
            placeholder="Chọn địa chỉ..."
            optionLabelProp="label"
            options={city}
            dropdownRender={(menu) => {
              return (
                <>
                  <div className="search-custom-info-company">
                    <span className="item">{menu}</span>
                  </div>
                </>
              );
            }}
          />
        </Form.Item>
        <Form.Item
          label={
            <>
              <span>Nơi Làm Việc</span>
              <MemoizedModelMapAddress
                setObjectAddress={setObjectAddress}
                top={70}
                color={"#fda4c8"}
                setLocation={setLocation}
              />
              {location[0] > 0 && location[1] > 0 && (
                <p style={{ marginTop: "20px" }}>
                  <MemoizedBoxGoogleMap
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
          <Select
            loading={loadingSelect}
            showSearch
            placeholder="Nhập địa chỉ công ty"
            options={fullAddressCompany}
            filterOption={(input, option) => {
              const words = removeAccents(input).toLowerCase().split(",");
              const label = removeAccents(option.label).toLowerCase();
              const value = removeAccents(option.value).toLowerCase();

              return words.every(
                (word) =>
                  label.includes(word.trim()) || value.includes(word.trim())
              );
            }}
            onSearch={(input) => changeValueAddress(input)}
            dropdownRender={(menu) => {
              return (
                <>
                  <div className="search-custom-info-company">
                    <span className="item">{menu}</span>
                  </div>
                  {/* {!loadingSelect && (
                    <div className="search-custom-info-company">
                      <span className="item">{menu}</span>
                    </div>
                  )}
                  {loadingSelect && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      className="search-custom-info-company"
                    >
                      <img
                        style={{ width: "150px" }}
                        src="https://img.pikbest.com/png-images/20190918/cartoon-snail-loading-loading-gif-animation_2734139.png!bw700"
                      />
                    </div>
                  )} */}
                </>
              );
            }}
          />
        </Form.Item>

        <Form.Item name="description" label="Mô Tả Công Việc">
          <MemoizedTinyMce ref={tinyMceRefDescription} height={300} />
        </Form.Item>

        <Form.Item name="detailWorkExperience" label="Yêu Cầu Công Việc">
          <MemoizedTinyMce ref={tinyMceRefDetailWorkExperience} height={230} />
        </Form.Item>

        <Form.Item
          label={
            <>
              <span>Link Youtube Giới Thiệu Công Việc</span>
              <MemoizedModelVideoYoutube
                color={"#fda4c8"}
                link={inputLinkYoutube}
              />
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
          <MemoizedCheckBoxCustom data={dataJobType} col={6} />
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
          label={<MemoizedTourCustom color={"#fda4c8"} tourData={tourData} />}
        >
          <div>
            <Search
              placeholder="Tag Name..."
              enterButton={
                <Button
                  style={{
                    backgroundColor: "#fda4c8",
                    borderColor: "#fda4c8",
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
            {tags?.length > 0 &&
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
          label="Ngôn Ngữ Trình Bày Hồ Sơ"
          name="presentationLanguage"
          rules={[
            {
              required: true,
              message: "Vui Lòng Chọn Ngôn Ngữ Trình Bày Hồ Sơ!",
            },
          ]}
        >
          <MemoizedCheckBoxCustom
            data={dataProfileRequirement}
            gutter={[20, 20]}
            col={8}
          />
        </Form.Item>

        <Form.Item className="form-button">
          <button type="submit">Hoàn tất</button>
        </Form.Item>
      </Card>
    </Form>
  );
}
const MemoizedFormOne = memo(FormOne);
export default MemoizedFormOne;
