const app = getApp();
var userInfo;
var user;
var that;
var openId;
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
    showUploadTip: false,
    haveGetRecord: false,
    envId: 'zynch-9g9w03iff67ab65a',
    record: '',
    operatorType: {
      COMPLETE_MISSION: 'complete mission',
      EXCHANGE_REWARDS: 'exchange rewards'
    }
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      envId: 'zynch-9g9w03iff67ab65a'
    });
    console.log('zynch-9g9w03iff67ab65a')
    let user = wx.getStorageSync('user')
    console.log(user)
    this.getRecord()
  },
  formatDateTime(date) {
    console.log('date', date)
    console.log('date', new Date())
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h=h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    return m + '-' + d+' '+h+':'+minute;
  },
  getRecord() {
    that = this
    let userInfo = wx.getStorageSync('user')
    console.log(userInfo)
    wx.showLoading({
      title: '',
    });
    wx.cloud.callFunction({
      name: 'selectOperator',
      config: {
        env: 'zynch-9g9w03iff67ab65a'
      },
      data: {
        openid:userInfo.openId
      }
    }).then((resp) => {
      const operatorData = resp.result.data.reverse();
      console.log('resp', resp)
      console.log('operatorData', operatorData)
      if(!operatorData.length){
        this.setData({
          haveGetRecord: true,
          record: ''
        });
        wx.hideLoading();
        return
      }
      operatorData.map(item => {
        item.operator_time = this.formatDateTime(new Date(item.operator_time))
        if (item.operator_type === this.data.operatorType.COMPLETE_MISSION){
          wx.cloud.callFunction({
            name: 'selectMission',
            config: {
              env: 'zynch-9g9w03iff67ab65a'
            },
            data: {
              type: 'selectMission',
              event: {
                id: item.mission_id
              }
            }
          }).then(resp => {
            const missionData = resp.result.data[0];
            if(!missionData){
              wx.hideLoading();
              return
            }
            item.content = missionData.mission_content;
            item.integral = missionData.mission_integral;
            this.setData({
              haveGetRecord: true,
              record: operatorData
            });
            wx.hideLoading();
          })
        } else {
          wx.cloud.callFunction({
            name: 'selectGoods',
            config: {
              env: 'zynch-9g9w03iff67ab65a'
            },
            data: {
              type: '',
              event: {
                id: item.goods_id
              }
            }
          }).then(resp => {
            console.log(resp)
            const goodsData = resp.result.data[0];
            if(!goodsData){
              wx.hideLoading();
              return
            }
            item.content = goodsData.goods_name;
            item.integral = goodsData.goods_integral;
            this.setData({
              haveGetRecord: true,
              record: operatorData
            });
            wx.hideLoading();
          })
        }
      })
   }).catch((e) => {
      console.log(e);
      this.setData({
        showUploadTip: true
      });
     wx.hideLoading();
   });
  },

  clearRecord() {
    this.setData({
      haveGetRecord: false,
      record: ''
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
   /**
       * 页面上拉触底事件的处理函数
       */
      onReachBottom: function () {
        var page = this.data.dataList.length;
        wx.showLoading({
          title: '加载中',
        })

        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
        this.getData(5,page)
      },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})