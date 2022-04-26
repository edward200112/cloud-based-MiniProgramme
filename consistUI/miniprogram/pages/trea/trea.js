import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    link:'https://7a79-zynch-9g9w03iff67ab65a-1305820780.tcb.qcloud.la/%E5%86%99%E5%9C%A8%E6%9C%80%E5%90%8E.pdf?sign=fe85ecc445579fef15e249ade5dd87f0&t=1650696216'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Dialog.confirm({
      title: '小提示',
      message: '复制到浏览器打开哦~'
    }).then(() => {
      // on confirm
    }).catch(() => {
      // on cancel
    });
  },
  copy: function (e) {
    let item = e.currentTarget.dataset.item;
    console.log("复制", e, item);
    wx.setClipboardData({
    data: item,
    success: function (res) {
        showToast({
            title: '复制成功',
            icon:"success"
        });
    }
});
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