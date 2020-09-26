import {request} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime"

Page({
  data: {
    //左侧滚动菜单
    leftMenuList:[],
    //右侧滚动内容
    rightContent:[],
    //选中的左侧菜单
    currentIndex:0,
    //右侧内容滚动条距离顶部的距离
    scrollTop:0,
    //分类页面，接口返回的数据
    Cates:[]
  },

  onLoad: function () {
    //web中的本地存储方式和小程序的本地存储方式的区别
    // 1 代码不同
    //   web:localStorage.setItem("key","value") localStorage.getItem("key","value")
    //2 web进行数据类型转换，最后都成为字符串类型存储，小程序不进行类型转换
    //判断是否有缓存数据，有则使用缓存数据，没有则重新获取数据
    const Cates = wx.getStorageSync("cates");
    if(!Cates){
      this.getCates()
    }else{
      //判断旧数据是否过期
      if(Date.now()-Cates.time>1000*10){
        this.getCates()
      }else{
        this.setData({
          Cates:Cates.data
        }) 
        let leftMenuList = this.data.Cates.map(v=>v.cat_name);
        let rightContent = this.data.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  
  //获取右侧商品内容
  async getCates(){
    // request({
    //   url:"/categories"
    // }).then(result => {
   //   this.setData({
    //     Cates:result.data.message
    //   })

    //   //把接口的数据存入到本地存储中
    //   wx.setStorageSync("cates", {time:Date.now(),data:this.data.Cates});

    //   let leftMenuList = this.data.Cates.map(v=>v.cat_name);
    //   let rightContent = this.data.Cates[0].children
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   }) 
    // })

    const result = await request({url:"/categories"});
    this.setData({
      Cates:result
    })

    //把接口的数据存入到本地存储中
    wx.setStorageSync("cates", {time:Date.now(),data:this.data.Cates});

    let leftMenuList = this.data.Cates.map(v=>v.cat_name);
    let rightContent = this.data.Cates[0].children
    this.setData({
      leftMenuList,
      rightContent
    }) 
  },
  
  //左侧滚动菜单的点击事件
  handleItemTap(event){
    const {index} = event.currentTarget.dataset
    let rightContent = this.data.Cates[index].children
    this.setData({
      currentIndex:index,
      rightContent,
      //重置右侧滚动条与顶部间的距离
      scrollTop:0
    })
  }
})