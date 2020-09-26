import {request} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime"

Page({
  data: {
    goodsObj:{},
    isCollect:false
  },

  onShow(){
    //获取当前页面栈
    let pages =  getCurrentPages();
    let currentPage = pages[pages.length-1]
    let options = currentPage.options
    const {goods_id} = options
    this.getGoodsDetail(goods_id)
  },

  //获取商品的详情数据
  async getGoodsDetail(goods_id){
    const goodsObj = await request({url:"/goods/detail",data:{goods_id}})
    this.setData({
      goodsObj,
      //原本为webp格式图片，部分iphone手机无法识别该格式图片
      //暂时将.webp替换为.jpg
      ['goodsObj.goods_introduce']:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg')
    })
    //获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect")||[]
    //判断当前商品是否被收藏
    let isCollect = collect.some(item=>item.goods_id === this.data.goodsObj.goods_id)
    this.setData({
      isCollect
    })
  },

  // 点击轮播图预览大图功能
  handlePreviewImage(event){
    const urls = this.data.goodsObj.pics.map(v=>v.pics_mid)
    // current为当前显示图片的链接，默认为urls的第一张，获取所点击的图片对应的url
    // 接受从wxml文件中传来的url数据
    const current = event.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
  },

  // 点击加入购物功能
  handleCartAdd(){
    //获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart")||[]
    //判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(v=>v.goods_id === this.data.goodsObj.goods_id)
    console.log(index)
    if(index === -1){
      //不存在 首次添加
      this.data.goodsObj.num = 1
      this.data.goodsObj.checked = true
      cart.push(this.data.goodsObj)
    }else{
      //购物车中存在 数量+1
      cart[index].num++
    }
    //把购物车数据返回缓存中
    wx.setStorageSync("cart",cart)
    //弹窗提示 添加成功
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true
    });
  },
  //点击收藏
  handleCollect(){
    let isCollect = false
    //获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect")||[];
    //判断该商品是否被收藏
    let index = collect.findIndex(v=>v.goods_id === this.data.goodsObj.goods_id)
    if(index === -1) {
      //没有收藏
      collect.push(this.data.goodsObj)
      isCollect = true
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }else{
      //已经收藏 点击删除
      collect.splice(index,1)
      isCollect = false
      wx.showToast({
        title: '取消收藏',
        icon: 'success',
        mask: true
      });
    }
    wx.setStorageSync("collect", collect);
    this.setData({
      isCollect
    })
  }
})