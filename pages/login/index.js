Page({
  handleGetUserInfo(event){
      const {userInfo} = event.detail
      wx.setStorageSync("userInfo",userInfo);
      wx.navigateBack({
        delta:1
      })
  }
})