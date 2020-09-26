import {request} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime"
import {login} from "../../utils/asyncWx.js"

Page({

  //获取用户信息
  async handleGetUserInfo(event){
    try{
      //获取用户信息
      const {encryptedData,rawData,iv,signature} = event.detail
      //获取小程序登录成功后的code
      const {code} = await login()
      //封装用户信息
      const loginParams = {encryptedData,rawData,iv,signature,code}
      //发送请求获取用户的token
      // const {token} = await request({url:'/users/wxlogin',data:loginParams,method:"post"})
      //使用API文档中的示例token
      const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
      //把token存入缓存中
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1
      });
    } catch(err){
      console.log(err)
    }
  }
})