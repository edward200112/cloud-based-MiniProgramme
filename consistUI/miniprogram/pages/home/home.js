const app = getApp();
var openId;
var userInfo;
var user;
wx.cloud.init({
  env: 'zynch-9g9w03iff67ab65a'
})
const DB = wx.cloud.database()
const _ = DB.command
var that;
var credit;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginOk:true,
    nickName:'',
    avatarUrl:'',
    btnflag:1,
    user:{},
    credit
  },
   
  refresh(){
    wx.redirectTo({
      url: '..//home/home'
  })
  },
  userAdd(openId) {
    that = this
    that.userInfo = wx.getStorageSync('user')
    console.log(openId)
    console.log(wx.getStorageSync('user'))
    var user = {
      nickName: that.userInfo.nickName,
      avatarUrl: that.userInfo.avatarUrl,
      openId: that.openId,
      credit:0
    };
    console.log(this.user)
    wx.setStorageSync('user', user);
 
    DB.collection('user').add({
      // data 字段表示需新增的 JSON 数据
      data: user
    }).then(res => {
      console.log(res)
      // wx.relaunch({
      //   url: './home',
      // })
    })
    wx.reLaunch({
      url: '../home/home',
    })
  },


  getUserProfile: function (e) {
    that = this
    wx.getUserProfile({
      desc: '获取信息进行登录哦~',
      success:(res)=>{
        console.log(res)
        that.data.user = res.userInfo;
        that.userInfo = res.userInfo
        that.avatarUrl = res.userInfo.avatarUrl;
        that.nickName = res.userInfo.nickName;
        console.log(that.userInfo)
        wx.setStorageSync('user', res.userInfo)
      }
    })
    

    wx.cloud.callFunction({
      name: "getOpenid",
      success(res) {
        that.openId = res.result.openid
        console.log(that.openId)
        // 判断数据库中是否已经有数据
        DB.collection('user').where({
          openId: that.openId,
        })
        .get().then(ress => {
          console.log('ressressressressressressressress',ress.data[0])
          loginOk:true;      
          if (ress.data.length == 0) {
            that.userAdd(that.openId)
            wx.reLaunch({
              url: '../index/index',
            })
          } else {
            wx.setStorageSync('user', ress.data[0]);
            console.log(ress.data[0])
            this.credit = ress.data[0].credit
            that.credit = ress.data[0].credit
            wx.reLaunch({
              url: '../index/index',
            })
          }
        })
      },
      fail(res) {
        loginOk:false;
        console.log('登录失败', res)
      }
    })
 
  },


  login:function(e){
    var that=this
    wx.cloud.callFunction({//调用名为“name"的云函数
      name:"login",
      success:res=>{
        // console.log(e)
        that.setData({
          openid:res.result.openid,
          userinfo:e.detail.userInfo,
          
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
    that = this
    // const ui=wx.getStorageSync('user')//获取key为"userinfo"的缓存信息
    // console.log(ui)
    //逻辑语句，如果没有信息，跳转到addUser函数，如果有，就进行这个函数
    wx.cloud.callFunction({
      name:'getOpenid',
      success(res){
        that.openId = res.result.openid
        console.log(that.openId)
        // wx.cloud.callFunction({
        //   name: 'getInfo',
        //   config: {
        //     env: 'zynch-9g9w03iff67ab65a'
        //   },
        //   data: {
        //     openid:that.openId
        //   }
        // }).then((resp) => {
        //   console.log(resp)
        //   console.log(resp)
        //   that.credit = resp.result.data[0].credit
           wx.cloud.callFunction({
              name: 'getInfo',
              config: {
                env: 'zynch-9g9w03iff67ab65a'
              },
              data: {
                openid:that.openId
              }
            }).then((resp) => {
              console.log(resp)
              console.log(resp)
              that.credit = resp.result.data[0].credit  
              console.log(that.credit)
              wx.setStorageSync('credit', resp.result.data[0])
            })
        // })
      }
    })
    that.userInfo = wx.getStorageSync('credit') 
    console.log(that.userInfo)
    this.credit = that.userInfo.credit
    this.setData({
      credit : that.userInfo.credit
    })
    //
    console.log(this.credit)
    console.log(that.credit)
    if(wx.getStorageSync('user')){
      loginOk:true;
    }

  },

     //小程序声明周期的可见性函数里面来控制显示
  onShow(){
    that = this
    let user = wx.getStorageSync('user')
    console.log("我的缓存信息",user);
    if(user){
      this.setData({
        loginOk:true,
        nickName:user.nickName,   //从缓存中拿数据
        avatarUrl:user.avatarUrl
      })

      wx.cloud.callFunction({
        name:'getOpenid',
        success(res){
          that.openId = res.result.openid
          console.log(that.openId)
        var users = {
          nickName: user.nickName,
          avatarUrl: user.avatarUrl,
          openId: that.openId,
          credit:0
        };
        
        DB.collection('user').where({
          openId:_.eq(that.openId)
        }).get().then(res=>{
          console.log(res)
          that.setData({
              credit :res.data[0].credit 
          })
        })
        wx.setStorageSync('user', users);
      }
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
downPdf(){
  wx.navigateTo({
    url: '../trea/trea',
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
  // wx.reLaunch({
  //   //将微信头像和微信名称传递给【我的】页面
  //   url: '/pages/home/home?nickName='+res.userInfo.nickName+'&avatarUrl='+res.userInfo.avatarUrl,
  // })
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
  // onPullDownRefresh: function () {
  // },
  onPullDownRefresh:function(){
    console.log('开始下拉刷新')
    wx.showNavigationBarLoading()//在标题栏中显示加载图标
    this.data.currentPage = 1
    this.data.dataList = []  //dataList为获取到的列表数组，自行替换
    this.onLoad()//重新获取列表页
    setTimeout(() => {
      wx.hideNavigationBarLoading();//完成停止加载
      wx.stopPullDownRefresh(); //得到数据后停止下拉刷新
    }, 400)
    console.log('下拉刷新成功')
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
