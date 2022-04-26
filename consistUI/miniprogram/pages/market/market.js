const app = getApp();
var userInfo;
var date;
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

  onLoad(options) {
    let user = wx.getStorageSync('user')
    console.log(user)
    this.setData({
      envId: 'zynch-9g9w03iff67ab65a'
    });
    // this.getData();
    this.getRecord();
  },

  formatDateTime() {
    var date = new Date();
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

  showMissionModal(event){
    console.log(event)
    const goodsId = event.target.id;
    const data = this.data.record.find(item => {
      return item._id === goodsId
    })
    console.log(data)
    const exchangeRewards = this.exchangeRewards;
    wx.showModal({
      title: '请确认',
      content: '兑换 '+data.goods_name,
      success (res) {
        if (res.confirm) {
          exchangeRewards(data)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  exchangeRewards(goods) {
    that = this
    let userInfo = wx.getStorageSync('user')
    console.log(goods)
    console.log(userInfo)
    wx.showLoading();


    wx.cloud.callFunction({
      name:'getOpenid',
      success(res){
        console.log(res)
        that.openId = res.result.openid
        console.log(that.openId)
      }
    })
    console.log(that.openId)


    wx.cloud.callFunction({
      name: 'getInfo',
      config: {
        env: 'zynch-9g9w03iff67ab65a'
      },
      data: {
        openid:that.openId
      }
    }).then((resp) => {
      console.log(userInfo)
      console.log(resp)
      const userCredit = resp.result.data[0].credit
      if (userCredit < goods.goods_integral) {
        wx.showToast({
          title: '再去完成多点任务吧！',
          icon: 'error',
          duration: 2000
        })
      } else {
        let date = this.formatDateTime();
        wx.cloud.callFunction({
        name: 'setOperator',
        config: {
          env: this.data.envId
        },
        data: {
          type: 'setOperator',
          data: {
            goods_id: goods._id,
            operator_type: 'exchange rewards',
            operator_time: date,
            openid:that.openId
          }
        }
      }).then((resp) => {
        wx.cloud.callFunction({
          name: 'updateUser',
          config: {
            env: this.data.envId
          },
          data: {
            data: {
              integral: -1*goods.goods_integral,
              openid:that.openId
            }
          }
        }).then(resp => {
          wx.hideLoading()
          console.log("success")
          wx.showToast({
            title: '兑换成功！',
            icon: 'success',
            duration: 2000
          })
          wx.hideLoading()
        })
      }).catch((e) => {
        console.log(e)
        console.log("fail")
      });
      wx.cloud.callFunction({
        name: 'deleteGoods',
        config: {
          env: 'zynch-9g9w03iff67ab65a'
        },
        data: {
          data: {
            id: goods._id
          }
        }
      }).then(resp => {
        console.log("success")
        this.getRecord()
      })
      }
      wx.hideLoading()
    })
 },
 deleteGoods(event){

  const goodsId = event.target.id;
  const data = this.data.record.find(item => {
    return item._id === goodsId
  })
  console.log(data)
  const deleteRewards = this.deleteRewards;
  wx.showModal({
    title: '请确认',
    content: '删除 '+data.goods_name,
    success (res) {
      if (res.confirm) {
        deleteRewards(data)
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
},
 deleteRewards(data){
  wx.cloud.callFunction({
    name: 'deleteGoods',
    config: {
      env: 'zynch-9g9w03iff67ab65a'
    },
    data: {
      data: {
        id: data._id
      }
    }
  }).then(resp => {
    console.log("success")
    this.getRecord()
  })
}, 
  // // 页面刷新获取数据
  // getData: function (e) {
  //   //数据库存储不同留言板
  //   wx.cloud.callFunction({
  //     name: 'getData',
  //     data: {
  //       db: 'goods',
  //       id: null,
  //     }
  //   }).then(res => {
  //     var rrd = res.result.data;
  //     console.log(rrd)
  //     this.setData({
  //       record: res.result.data,
  //       loading: false
  //     })
  //     // wx.stopPullDownRefresh
  //   })
  // },
  getRecord() {
    wx.showLoading({
      title: '',
    });
    wx.cloud.callFunction({
      name: 'getRecord',
      data: {
        db: 'goods',
        id: null,
      }
    }).then((resp) => {
      var rrd = resp.result.data;
      console.log(rrd)
      this.setData({
        haveGetRecord: true,
        record: resp.result.data
      });
      wx.hideLoading();
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
  onShow: function () {
    that = this
    let user = wx.getStorageSync('user')
    console.log("我的缓存信息",user);
    if(user){
      wx.cloud.callFunction({
        name:'getOpenid',
        success(res){
          that.openId = res.result.openid
          console.log(res)
          console.log(that.openId)
        }
      })
      console.log(that.openId)
    }else{
      wx.showToast({
        title: '好像没登陆诶',
        icon:"loading",
        duration:1000
      })
      // wx.reLaunch({
      //   url: '../home/home',
      // })
    }
  },
  onPullDownRefresh:function(){
    console.log('开始下拉刷新')
    wx.showNavigationBarLoading()//在标题栏中显示加载图标
    this.data.currentPage = 1
    this.data.dataList = []  //dataList为获取到的列表数组，自行替换
    this.getRecord()//重新获取列表页
    setTimeout(() => {
      wx.hideNavigationBarLoading();//完成停止加载
      wx.stopPullDownRefresh(); //得到数据后停止下拉刷新
    }, 400)
    console.log('下拉刷新成功')
  },
});
