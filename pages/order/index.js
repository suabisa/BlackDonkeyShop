/*
1 页面被打开的时候 onShow
  0 onShow不同于onLoad 无法再形参上接收options参数
  0.5 检查是否有token值 若无跳转到登录授权
  1 获取url上的参数type
  2 根据type发请求
  3 渲染页面
2 点击不同的标签 重新发送请求并渲染  
*/

import regeneratorRuntime from "../../lib/runtime/runtime.js"
import {request} from "../../request/index.js"

Page({
  data: {
    tabs:[
      {
        id:0,
        value:'全部',
        isActive:true
      },
      {
        id:1,
        value:'待付款',
        isActive:false
      },
      {
        id:2,
        value:'待发货',
        isActive:false
      },
      {
        id:3,
        value:'退款/退货',
        isActive:false
      }
    ],
    orders:[],
    currentIndex:0
  },
  
  onShow(){
    const token = wx.getStorageSync("token")
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return
    };
    //获取当前小程序的页面栈
    let pages = getCurrentPages();
    //数组中 最大索引就是当前页面
    let currentPage = pages[pages.length-1]
    //获取type参数
    let {type} = currentPage.options
    this.getOrder(type)
    this.changeTitleByIndex(type - 1)
  },

  //获取订单列表
  async getOrder(type){
    const token = wx.getStorageSync("token");
    let res = await request({url:"/my/orders/all",header:{Authorization: token},data:{type}})
    let orders = res.orders.map(item=>{
      return {...item,create_time:new Date(item.create_time*1000).toLocaleString().replace(/\//g,"-")}
    })
    //splice返回被删除的项目
    orders.splice(0,2)
    this.setData({
      orders
    })
  },
  
  //根据标签索引来激活选中
  changeTitleByIndex(index){
    let {tabs} = this.data
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
    this.setData({
      tabs
    })
  },

  //标题点击事件
  handleTabsItemChange(event){
    const {index} = event.detail
    this.changeTitleByIndex(index)
    //重新发送请求
    this.getOrder(index+1)
  }  
})