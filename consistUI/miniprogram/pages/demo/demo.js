// pages/demo/demo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cloneIner: null,
    loading:false,
    errorSum:0,
    errorNum:3,
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  attached() {
    //判断微信是否可以使用wx.getUserProfile
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  methods: {
    getUserProfile(e) {
      wx.showLoading()
      wx.getUserProfile({
        desc: '用于完善会员资料',
        success: (res) => {
          console.log(res)
          this.getWxUserInfo(res);
        }
      })
    },
    getUserInfo:function(e) {
      console.log(e)
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    },
    getWxUserInfo(res){
      console.log(res);
      let that = this;
      // let code = res.code;
      let nickName = res.userInfo.nickName;
      let avatarUrl = res.userInfo.avatarUrl;
      console.log(avatarUrl);
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

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

  }
})