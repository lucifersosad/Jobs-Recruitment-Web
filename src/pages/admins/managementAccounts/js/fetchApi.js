import { decData } from "../../../../helpers/decData";
import { SelectTreeArr } from "../../../../helpers/selectTree";
import { getAllAdmins } from "../../../../services/admins/adminsApi";
import { getAllJobsCategories } from "../../../../services/admins/jobsCategoriesApi";

export const fetchApiCategorieManage = async (
  setAccounts,
  valueStatus = "",
  keyword = "",
  sortKey = "",
  sortValue = "",
  tree = "false"
) => {
  //Cái valueStatus nếu người dùng muốn lọc theo status thì điền giá trị vào mặc định là 1
  //Nếu có tree thì nó mới tạo ra một cây không thì thôi
  const records = await getAllAdmins(
    valueStatus,
    keyword,
    sortKey,
    sortValue,
    tree
  );

  if (records.code === 200) {
    const convertData = records.data.map((dataMap, index) => ({
      ...dataMap,
      key: index,
    }));
    let convertTree = convertData;
    setAccounts(convertTree);
  }
};
