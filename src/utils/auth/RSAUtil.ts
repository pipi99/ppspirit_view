//RSA加密处理

import { JSEncrypt } from 'jsencrypt';
import CryptoJS from 'crypto-js';
// 加密
function encryptedData(publicKey: string, data: any) {
  // 新建JSEncrypt对象
  const encryptor = new JSEncrypt();
  // 设置公钥
  encryptor.setPublicKey(publicKey);
  // 加密数据
  return encryptor.encrypt(data);
}

// 解密
function decryptData(privateKey: string, data: any) {
  data = CryptoJS.enc.Base64.stringify(data);
  // 新建JSEncrypt对象
  const decrypt = new JSEncrypt();
  // 设置私钥
  decrypt.setPrivateKey(privateKey);
  // 解密数据
  decrypt.decrypt(data);
}

export default {
  encryptedData,
  decryptData,
};
