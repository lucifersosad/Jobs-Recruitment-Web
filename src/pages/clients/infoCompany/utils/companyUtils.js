import { getCoordinateAddress } from "../../../../services/locations/locationsApi";
import { dataNumberOfWorkers } from "../js/options";

export const handleNumberOfWorkers = (data) => {
  data.numberOfWorkers = dataNumberOfWorkers.find((item) => item?.value === data?.numberOfWorkers)?.label;
};

export const isAddressValid = (address) => {
  return typeof address === "string" && address.includes("-");
};

export const getPlaceIdFromAddress = (address) => {
  return address.split("-")[1];
};

export const getAddressFromAddressString = (address) => {
  return address.split("-")[0];
};

export const fetchLocation = async (placeId) => {
  const result = await getCoordinateAddress({ placeid: placeId });
  if (result.code !== 200) return null;
  return [result?.data?.location?.lat, result?.data?.location?.lng];
};

export const handleAddress = async (data) => {
  if (!isAddressValid(data?.specificAddressCompany)) return [0, 0];

  const placeId = getPlaceIdFromAddress(data.specificAddressCompany);
  const location = await fetchLocation(placeId);
  
  const address = getAddressFromAddressString(data.specificAddressCompany);
  data.specificAddressCompany = address;
  
  return location || [0, 0];
}; 