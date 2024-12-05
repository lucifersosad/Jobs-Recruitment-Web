import {
  getDetailedAddress,
  getFullAddress,
} from "../../../../services/locations/locationsApi";

// Hàm loadCityDeletai nhận vào 3 tham số: setAddress (một hàm để set địa chỉ), selectAddress (địa chỉ đã chọn), và keyword (từ khóa tìm kiếm)
export const loadCityFull = async (objectAddress, setAddress, keyword) => {
  const { city, district, ward } = objectAddress;
  const objectNew = {
    keyword,
    ward,
    district,
    city,
  };
  console.log("🚀 ~ loadCityFull ~ objectNew:", objectNew);
  // Gọi hàm
  const resultCity = await getDetailedAddress(objectNew);
  console.log("🚀 ~ loadCityFull ~ resultCity:", resultCity);

  // Nếu mã trả về từ hàm getDetailedAddress là 200
  if (resultCity.code === 200) {
    // Tạo một mảng mới từ resultCity.data, chỉ lấy những phần tử mà description của chúng chứa ward, district, và city
    // Mỗi phần tử trong mảng mới sẽ là một object với value và label đều là description của phần tử đó
    let convertData = resultCity?.data?.map((item) => ({
      value: item?.description,
      label: item?.description,
    }));

    // Nếu keyword không phải là chuỗi rỗng, thêm một object với value và label đều là keyword vào đầu mảng
    if (keyword !== "") {
      convertData = [{ value: keyword, label: keyword }, ...convertData];
    }
    console.log("🚀 ~ loadCityFull ~ convertData:", convertData);
    // Gọi hàm setAddress với convertData
    setAddress(convertData);
  }
};
