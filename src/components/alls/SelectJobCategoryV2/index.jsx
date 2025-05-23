import { Cascader, Divider } from "antd";
import "./cascader.scss";
import { removeAccents } from "../../../helpers/removeAccents";

const DisplayRender = (labels, selectedOptions = []) =>
  labels.map((label, i) => {
    const option = selectedOptions[i];
    if (i === labels.length - 1) {
      return <span key={option.value}>{label}</span>;
    }
    return (
      <span key={option.value}>
        {label} {" > "}{" "}
      </span>
    );
  });

const SelectJobCategoryV2 = ({
  options = [],
  placeholder = "Vui lòng chọn",
  trigger = "click",
  displayRender = DisplayRender,
  ...rest
}) => {
  const { SHOW_CHILD } = Cascader;

  const onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };

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
    <div className="ant-cascader-dropdown-custom">{menus}</div>
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
      displayRender={displayRender}
      {...rest}
    />
  );
};
export default SelectJobCategoryV2;
