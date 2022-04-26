const app = getApp();
var userInfo;
wx.cloud.init({
  env: 'zynch-9g9w03iff67ab65a'
})
const DB = wx.cloud.database()
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginOk:true,
    nickName:"",
    avatarUrl:"",
    btnflag:1,
    credit:10
  },
  userAdd(openId) {
    var user = {

      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
      openId: openId,
      credit:10
    };
    wx.setStorageSync('user', user);
 
    DB.collection('user').add({
      // data 字段表示需新增的 JSON 数据
      data: user
    }).then(res => {
      console.log(res)
      wx.switchTab({
        url: '/pages/home/home',
      })
    })
  },


  getUserProfile: function (e) {

    console.log(e)
    // if(!this.data.userType){
    //   wx.showToast({
    //     title: '再试试宝子咋失败了',
    //     icon:'none'
    //   })
    //   return
    // }
    // console.log(e)
    userInfo = e.detail.userInfo;
    
    wx.cloud.callFunction({
      name: "getOpenid",
      success(res) {
        let openId = res.result.openid
        // 判断数据库中是否已经有数据
        DB.collection('user').where({
          openId: openId,
        })
        .get().then(ress => {
          console.log('ressressressressressressressress',ress.data[0])
          
          if (ress.data.length == 0) {
            that.userAdd(openId)
          } else {
            wx.setStorageSync('user', ress.data[0]);
            wx.switchTab({
              url: '/pages/home/home',
            })
          }
        })
      },
      fail(res) {
        console.log('登录失败', res)
      }
    })
 
  },


  login:function(e){
    var that=this
    wx.cloud.callFunction({//调用名为“name"的云函数
      name:"login",
      success:res=>{
        
        that.setData({
          openid:res.result.openid,
          userinfo:e.detail.userInfo
        })
        that.data.userinfo.openid=that.data.openid
        console.log(that.data.userinfo)
        wx.setStorageSync('userinfo', that.data.userinfo)//把userinfo放到缓存中，key为userinfo
      },
      fail:res=>{
        console.log("fail")
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("这里的options",options);
    const ui=wx.getStorageSync('user')//获取key为"userinfo"的缓存信息
    this.setData({
      nickName:ui.nickName,
      avatarUrl:ui.avatarUrl,
      // userInfo:ui,
      openid:ui.openid
    })
    that = this;
    if(wx.getStorageSync('user')){
      wx.reLaunch({
        url: '/pages/home/home',
      })
    }
  },

     //小程序声明周期的可见性函数里面来控制显示
  onShow(){
    let user = wx.getStorageSync('user')
    console.log("我的缓存信息",user);
    if(userInfo){
      this.setData({
        loginOk:true,
        nickName:user.nickName,   //从缓存中拿数据
        avatarUrl:user.avatarUrl
      })
    }else{
      this.setData({
        loginOk:false
      })
    }
  },
//退出登录
exit(){
  wx.showModal({
    content:"确定退出吗"
  }).then(res=>{
    if(res.confirm){
    console.log("用户点击了确定");
    this.setData({
      loginOk:false
    })
    //清空登录的缓存
    wx.setStorageSync('user', null)
    }else if(res.cancel){
      console.log("用户点击了取消");
    }
  })
},


//  点击登录
//  load(){
//   wx.navigateTo({
//     url: '/pages/login/login',
//   })
// },
// loadByWechat(){
//   wx.getUserProfile({
//     desc: '用户完善会员资料',
//   })
//   .then(res=>{
//   console.log("用户允许了微信授权登录",res.userInfo);
//   //注意：此时不能使用 wx.switchTab，不支持参数传递
//   wx.reLaunch({
//     //将微信头像和微信名称传递给【我的】页面
//     url: '/pages/home/home?nickName='+res.userInfo.nickName+'&avatarUrl='+res.userInfo.avatarUrl,
//   })
//   //保存用户登录信息到缓存
//   wx.setStorageSync('userInfo', res.userInfo)
//   loginOk:true
//   })
//   .catch(err=>{
//     loginOk:false
//     console.log("用户拒绝了微信授权登录",err);
//   })
// },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */




  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  
})








