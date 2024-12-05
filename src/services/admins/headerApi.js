import {Get} from "../../utils/admins/request"

export const getCity = async ()=>{
    const result = await Get("",{},"https://vn-locations-api.vercel.app/city");
    return result;
}

export const getCitySearch = async (code)=>{
    const result = await Get("",{},`https://vn-locations-api.vercel.app/city/${code}`);
    return result;
}

export const getDistrictSearch = async (code)=>{
    const result = await Get("",{},`https://vn-locations-api.vercel.app/district/${code}`);
    return result;
}
