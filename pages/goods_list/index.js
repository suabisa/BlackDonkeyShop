import {request} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime"

Page({
  data: {
    tabs:[
      {
        id:0,
        value:'综合',
        isActive:true
      },
      {
        id:1,
        value:'销量',
        isActive:false
      },
      {
        id:2,
        value:'价格',
        isActive:false
      }
    ],
    goodsList:[],
    //总页数
    totalPages:1,
    //接口需要的参数
    queryParams:{
      query:"",
      cid:"",
      pagenum:1,
      pagesize:10
    }
  },

  onLoad: function (options) {
    this.data.queryParams.cid=options.cid||''
    this.data.queryParams.query=options.query||''
    this.getGoodsList()
  },

  //获取商品列表的数据
  async getGoodsList(){
    const result = await request({url:"/goods/search",data:this.data.queryParams})
    //总条数
    const total = result.total
    //总页数 = 总条数/每页的容量(每页10条) = 23 / 10 (向上取整) = 3
    let totalPages = Math.ceil(total/this.data.queryParams.pagesize)
    this.setData({
      goodsList:[...this.data.goodsList,...result.goods],
      totalPages
    })
    //关闭刷新效果
    wx.stopPullDownRefresh()
  },

  //标题点击事件
  handleTabsItemChange(event){
    const {index} = event.detail
    let {tabs} = this.data
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
    this.setData({
      tabs
    })
  },

  //滚动条触底事件--加载下一页数据
  onReachBottom(){
    //判断是否有下一页数据
    if(this.data.queryParams.pagenum>=this.data.totalPages){
       wx.showToast({title: '没有更多商品了'});
    }else{
      this.data.queryParams.pagenum++
      this.getGoodsList()
    }
  },

  //下拉刷新事件
  onPullDownRefresh(){
    //重置数据数组&重置页码
    this.setData({
      goodsList:[],
      // 修改data里的数组或对象的属性,需将数组或对象的属性转换成字符串，再用中括号括起来就可以修改了
      ['queryParams.pagenum']:1
    })
    //重新发送请求
    this.getGoodsList();
    //数据请求回来，自动关闭刷新等待效果,写在了getGoodsList方法中
  }
})