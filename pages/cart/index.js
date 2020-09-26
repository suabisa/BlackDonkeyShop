/*
获取用户的收货地址的逻辑
  1 绑定点击事件
  2 获取用户对小程序所授予 获取地址 的权限的状态 scope
    1 假设 用户点击获取收货地址的提示框 点击了确定
      scope的值为true 直接调用 获取收货地址
    2 假设 用户从未调用过收货地址的api
      scope的值为undefined  直接调用 获取收货地址
    3 假设 用户 点击获取收货地址的提示框时 选择了取消
      scope的值为false
      1 引导用户 自己打开授权设置页面 当用户重新基于获取地址权限时
      2 获取收货地址
    4 把地址数据存入缓存 
页面加载完毕
  0 onLoad onShow
  1 获取本地存储中的地址数据
  2 把数据存入data中    
handleChooseAddress(event){
    //1 获取权限状态
    // wx.getSetting({
    //   success: (result)=>{
    //     // 如果属性名中带有'.' 用[]来写入属性名
    //     const scopeAddress =result.authSetting["scope.address"]
    //     if(scopeAddress === true||scopeAddress === undefined){
    //       wx.chooseAddress({
    //         success: (result1)=>{
    //           console.log(result1)
    //         }
    //       })
    //     }else{
    //       //2 用户曾拒绝过授予权限 先引导用户打开授权页面
    //       wx.openSetting({
    //         success: (result2)=>{
    //           //可以调用 收货地址代码
    //           wx.chooseAddress({
    //             success: (result3)=>{
    //               console.log(result3)
    //             }
    //           })
    //         },
    //         fail: ()=>{},
    //         complete: ()=>{}
    //       });
    //     }
    //   },
    //   fail: ()=>{},
    //   complete: ()=>{}
    // })      
3 onShow
  0 在goodsObj中添加num和checked属性
  1 获取缓存中的购物车数量
  2 把购物车数据 填充到data中    
4 全选的实现  
5 总价和总数
6 商品的选中功能
  1 绑定change事件
  2 获取到被修改的商品对象
  3 商品对象的选中状态 取反
  4 重新填充回data中&缓存中
  5 重新计算全选 总价 总数
7 结算功能
  1 判断是否有收货地址信息
  2 判断用户是否有选购商品
  3 以上都有 跳转结算页面
*/  

import {getSetting,chooseAddress,openSetting,showModal,showToast} from "../../utils/asyncWx.js"
import regeneratorRuntime from "../../lib/runtime/runtime"

Page({
  data: {
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    //获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    //获取缓存中的微信数据
    const cart = wx.getStorageSync("cart")||[];
    this.setData({
      address
    })
    //使用setCart方法更新数据
    this.setCart(cart);
  },

  // 点击 收货地址
  async handleChooseAddress(event){
    try {
          //获取权限状态
    const res1 = await getSetting()
    const scopeAddress =res1.authSetting["scope.address"]
    //判断权限状态
    if(scopeAddress === false){
      //引导用户打开授权界面
      await openSetting()
    }
    //调用获取收货地址的api
    let address = await chooseAddress()
    address.all = address.provinceName+address.cityName+address.detailInfo
    //存入缓存
    wx.setStorageSync("address", address)
    } catch (error) {
      console.log(error)
    }
  },
  //商品的选中
  handleItemChange(event){
    //获取被修改的商品的ID
    const goods_id = event.currentTarget.dataset.id
    //获取购物车数组
    let {cart} = this.data
    //找到被修改的商品对象
    let index = cart.findIndex(v=>v.goods_id===goods_id)
    cart[index].checked = !cart[index].checked
    //使用setCart方法更新数据
    this.setCart(cart);
  },

  //设置购物车状态的同时 重新计算底部功能栏的数据
  setCart(cart){
    //判断是否被选中
    let allChecked = cart.length?cart.every(v=>v.checked):false
    //总价和总数
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v=>{
      if(v.checked){
        totalPrice += v.num*v.goods_price
        totalNum += v.num
      }
    })
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    })
    wx.setStorageSync("cart",cart)
  },

  //商品全选功能
  handleItemAllCheck(){
    let {cart,allChecked} = this.data
    allChecked = !allChecked
    cart.forEach(v=>v.checked = allChecked)
    this.setCart(cart)
  },

  //加减商品数量 当数量将减至零时询问是否删除
  async handleItemNumEdit(event){
    const {operation,id} = event.currentTarget.dataset;
    let {cart} = this.data;
    const index = cart.findIndex(v=>v.goods_id === id);
    if(cart[index].num===1 && operation===-1){
      const res = await showModal({content:'确定删除该商品吗?'})
      console.log('woshi',res)
      if(res.confirm){
        cart.splice(index,1)
        this.setCart(cart)
      }
    }else{
      cart[index].num += operation;
      this.setCart(cart);
    }
  },

  //结算功能
  async handlePay(){
    //判断收货地址
    const {address,totalNum} = this.data
    if(!address.userName){
      await showToast({title:'您还没有选择收货地址'})
      return
    }
    //判断购物车有无商品
    if(totalNum === 0){
      await showToast({title:"您还没有选购商品"})
      return
    }
    //跳转至支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  }
})