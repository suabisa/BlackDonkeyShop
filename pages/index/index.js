import {request} from "../../request/index.js"
//使用花括号明明的方式引入(import {xxx})，需要有export xxx 

Page({
  data: {
    //轮播图数组
    swiperList:[],
    cateList:[],
    floorList:[]
  },
  onLoad: function(options){
    this.getSwiperList()
    this.getCateList()
    this.getFloorList()
  },

  //获取轮播图
  getSwiperList(){
    request({
      url:"/home/swiperdata"
    }).then(result=>{
      this.setData({
        swiperList:result
      })
    })
  },

  //获取分类导航栏
  getCateList(){
    request({
      url:"/home/catitems"
    }).then(result=>{
      this.setData({
        cateList:result
      })
    })
  },
  
  //获取楼层数据
  async getFloorList(){
    const floor = await request({
      url: '/home/floordata'
    })
    const new_floor=floor.map(item=>{
      return {...item,product_list:item.product_list.map(item1=>{
        return  {...item1,navigator_url:item1.navigator_url.replace('?','/index?')}
      })}
    })
    this.setData({
      floorList:new_floor
    })
  },
});