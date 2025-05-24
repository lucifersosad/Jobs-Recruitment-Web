import { Cascader, Divider, Typography } from "antd";
import "./cascader.scss";
import { removeAccents } from "../../../helpers/removeAccents";

const DisplayRender = (labels, selectedOptions = []) =>
  labels.map((label, i) => {
    const option = selectedOptions[i];
    if (i === labels.length - 1) {
      return <span key={option?.value}>{label}</span>;
    }
    return (
      <span key={option?.value}>
        {label} {" > "}{" "}
      </span>
    );
  });

const OnChange = (value, selectedOptions) => {
  value.flatMap(item => {
    console.log("🚀 ~ onChange ~ item:", item)
    
  })
};

const SelectJobCategoryV2 = ({
  type = "single",
  options = [],
  placeholder = "Vui lòng chọn",
  trigger = "click",
  displayRender = DisplayRender,
  onChange = OnChange,
  ...rest
}) => {
  
  const { SHOW_CHILD } = Cascader;

  const onSearch = (value) => {
    // console.log(value)
  };

  const filter = (inputValue, path) =>
    path.some(
      (option) =>
        removeAccents(option.label.toLowerCase()).indexOf(
          removeAccents(inputValue.toLowerCase())
        ) > -1
    );

  const dropdownRender = (menus) => (
    <div className="ant-cascader-dropdown-custom">
      <Typography.Title level={5} style={{marginLeft: "8px", marginTop: "10px"}}>Ngành nghề</Typography.Title>
      {menus}
    </div>
  );

  return (
    <Cascader
      placeholder={placeholder}
      expandTrigger={trigger}
      options={options}
      onChange={onChange}
      showSearch={{ filter }}
      onSearch={onSearch}
      maxTagCount="responsive"
      dropdownRender={dropdownRender}
      displayRender={type !== "multiple" && displayRender}
      multiple={type === "multiple"}
      {...rest}
    />
  );
};
export default SelectJobCategoryV2;
