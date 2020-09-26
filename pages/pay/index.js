/*
1 页面加载
  1 从缓存中获取购物车数据 渲染到页面中
2 支付按钮
  1 先判断缓存中是否有token值
  2 没有  跳转至授权页面，获取token
    有    正常执行 
*/

import {getSetting,chooseAddress,openSetting,showModal,showToast,requestPayment} from "../../utils/asyncWx.js"
import regeneratorRuntime from "../../lib/runtime/runtime.js"
import {request} from "../../request/index.js"

Page({
  data: {
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    //获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    //获取缓存中的微信数据
    let cart = wx.getStorageSync("cart")||[];
    //过滤后的购物车数组
    cart = cart.filter(v=>v.checked)
    //总价和总数
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v=>{
        totalPrice += v.num*v.goods_price
        totalNum += v.num
    })
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })
  },

  //点击支付功能
  async handleOrderPay(){
    try{
      //缓存中是否有token
      const token = wx.getStorageSync("token");
      //没有token跳转至授权页面
      if(!token){
        wx.navigateTo({
          url: '/pages/auth/index'
        });
      }
      //创建订单
      //请求头参数--封装进request中了
      //请求体参数
      const order_price = this.data.totalPrice
      const consignee_addr = this.data.address.all
      const cart = this.data.cart
      let goods = []
      cart.forEach(v=>goods.push({
        goods_id:v.goods_id,
        goods_number:v.num,
        goods_price:v.goods_price
      }))
      const orderParams = {order_price,consignee_addr,goods}
      //准备发送请求 创建订单 获取订单编号
      const {order_number} = await request({url:"/my/orders/create",method:"POST",data:orderParams})
      //发起 预支付接口
      const {pay} = await request ({url:"/my/orders/req_unifiedorder",method:"POST",data:{order_number}})
      //发起 微信支付
      await requestPayment(pay)
      //查询后台订单状态
      const res = await request({url:"/my/orders/chkOrder",method:"POST",data:{order_number}})
      await showToast({title:"支付成功"})
      //支付成功 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      });
    }catch(err){
      await showToast({title:"支付失败"})
      console.log(err)
    }
  }
})