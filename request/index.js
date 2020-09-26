//同时发送异步代码的次数
let ajaxTime = 0
//能够在当同时有多次异步代码发送时，只在最后一次异步请求结束后进行操作

export const request=(params)=>{
    //判断url中是否带有 '/my/' 请求头 如果有加上header token
    let header = {...params.header}
    if(params.url.includes("/my/")){
        header["Authorization"] = wx.getStorageSync('token');
    }

    ajaxTime++
    //显示加载中动画
    wx.showLoading({
        title: '加载中',
        mask:true,
    })

    //定义公共url
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve,reject)=>{
        wx.request({
            ...params,
            header,
            url:baseUrl+params.url,
            success:(result)=>{
                resolve(result.data.message)
            },
            fail:(err)=>{
                reject(err)
            },
            complete:()=>{
                ajaxTime--
                //当所有异步请求都i完成后
                if(ajaxTime === 0){
                    //关闭Loading动画
                    wx.hideLoading();
                }
            }
        })
    })
}