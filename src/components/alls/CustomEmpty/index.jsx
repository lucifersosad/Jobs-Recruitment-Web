import { Empty } from "antd"

const CustomEmpty = ({description = "Không có dữ liệu"}) => {
  return <Empty description={description} />
}
export default CustomEmpty