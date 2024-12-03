import CryptoJS from 'crypto-js';

const secretKey = 'utemp';
export function decData(encryptedDataFromServer) {
    let bytes = CryptoJS.AES.decrypt(encryptedDataFromServer,secretKey);
    let data = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(data)

}