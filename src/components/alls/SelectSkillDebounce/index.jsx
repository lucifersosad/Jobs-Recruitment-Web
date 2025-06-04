import { Select, Spin } from "antd"
import { useRef, useState } from "react";
import { getListSkill } from "../../../services/common";

const contentStyle = {
  padding: 50,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 4,
  };

const SelectSkillDebounce = ({...rest}) => {
  const [optionsSkill, setOptionsSkill] = useState([]);
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null);

  const handleSearchSkills = async (searchText) => {    
    setLoading(true)
    setOptionsSkill([]);

    if (!searchText || searchText.trim() === "") {
      setOptionsSkill([]);
      setLoading(false)
      return;
    }
    
    const result = await getListSkill(searchText)
    
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
  
  return (
    <Select 
      mode="multiple"
      placeholder="Tìm kiếm kĩ năng"
      notFoundContent={loading ? <Spin tip="Đang tải" size="large"><div style={contentStyle} /></Spin> : 'Không Tìm Thấy Kĩ Năng!'}
      filterOption={false}
      onSearch={handleSearchDebounce}
      options={optionsSkill}
      allowClear={true}
      autoClearSearchValue={false}
      onBlur={() => setOptionsSkill([])}
      onChange={(value) => console.log(value)}
      {...rest}
    />
  )
}
export default SelectSkillDebounce