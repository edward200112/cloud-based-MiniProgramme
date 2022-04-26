// pages/demo9/demo9.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showUploadTip: false,
    haveGetRecord: false,
    envId: 'zynch-9g9w03iff67ab65a',
    record: '',
    chosen: '',
    imgSrc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      envId: 'zynch-9g9w03iff67ab65a'
    });
  },
  formSubmit(e) {
    wx.showLoading()
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    const data = e.detail.value;
    if (data.goods_content && data.goods_integral){
      wx.cloud.callFunction({
        name: 'addGoods',
        config: {
          env: this.data.envId
        },
        data: {
          type: 'addGoods',
          data: {
            goods_name:data.goods_name,
            goods_content: data.goods_content,
            goods_integral: data.goods_integral,
            goods_image: this.data.imgSrc
          }
        }
      }).then(resp => {
        wx.hideLoading()
        wx.showToast({
          title: '新增成功',
          icon: 'success',
          duration: 2000,
          success: () => {
            setTimeout(() => {
              // wx.navigateBack()
              wx.reLaunch({
                url: '../market/market',
              })
            }, 2000)
          }
        })
      })
    } else {
      wx.showToast({
        title: '请输入完整信息',
        icon: 'error',
        duration: 2000
      })
    }
    
  },

  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  },

  uploadImg() {
    wx.showLoading({
      title: '',
    });
    // 让用户选择一张图片
    wx.chooseImage({
      count: 1,
      success: chooseResult => {
        // 将图片上传至云存储空间
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: new Date().getTime()+'.png',
          // 指定要上传的文件的小程序临时文件路径
          filePath: chooseResult.tempFilePaths[0],
          config: {
            env: this.data.envId
          }
        }).then(res => {
          console.log('上传成功', res);
          this.setData({
            haveGetImgSrc: true,
            imgSrc: res.fileID
          });
          wx.hideLoading();
        }).catch((e) => {
          console.log(e);
          wx.hideLoading();
        });
      },
    });
  },

  clearImgSrc() {
    this.setData({
      haveGetImgSrc: false,
      imgSrc: ''
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