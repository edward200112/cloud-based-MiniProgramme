import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';

const app = getApp();
var userInfo;
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
    openId:'',
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
    this.getRecord();
    let user = wx.getStorageSync('user')
    
    if(!user){
      Dialog.alert({
        title: '温馨提示',
        message: '还没有登录哦！！'
      }).then(() => {
        wx.reLaunch({
          url: '../home/home',
        })
      }).catch(() => {
        // on cancel
      });
    }
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getRecord();
  },
  toAddMission(e) {
    wx.navigateTo({
      url: `/miniprogram/pages/setupMission?envId=${this.data.envId}`,
      
    });
  },

  showMissionModal(event){
    const missionId = event.target.id;
    const data = this.data.record.find(item => {
      return item._id === missionId
    })
    const deleteRewards = this.deleteRewards;
    wx.showModal({
      title: '请确认',
      content: '删除 '+data.mission_content,
      success (res) {
        if (res.confirm) {
          deleteRewards(data)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  finishMission(event){
    const missionId = event.target.id;
    const data = this.data.record.find(item => {
      return item._id === missionId
    })
    const completeMission = this.completeMission
    console.log(data)
    wx.showModal({
      title: '请确认',
      content: '完成 '+data.mission_content,
      success (res) {
        if (res.confirm) {
          completeMission(data)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  getInfo(){
    wx.cloud.callFunction({
      name: "getOpenid",
      success(res) {
        console.log(res)
        openId = res.result.openid
        // 判断数据库中是否已经有数据
        DB.collection('user').where({
          openId: openId,
        })
        .get().then(ress => {
          console.log('ressressressressressressressress',ress.data[0])   
          if (ress.data.length == 0) {
            wx.showToast({
              title: '好像还没登陆~',
              icon:'loading',
              duration:1000
            })
          } else {
            wx.setStorageSync('user', ress.data[0]);
          }
        })
      },
      fail(res) {
        console.log('发生错误了T.T', res)
      }
    })
  },
  //完成任务
  completeMission(mission) {
    that = this
    console.log(mission)
    let userinfo = wx.getStorageSync('user')
    wx.cloud.callFunction({
      name:'getOpenid',
      success(res){
        that.openId = res.result.openid
        console.log(that.openId)
        //插入
        wx.showLoading();
        wx.cloud.callFunction({
         name: 'setOperator',
         config: {
           env: 'zynch-9g9w03iff67ab65a'
         },
         data: {
           type: 'setOperator', //用于存储完成任务的记录
           data: {
             mission_id: mission._id,
             operator_type: 'complete mission',
             missionName:mission._content,
            //  whoDidIt:userinfo.nickName,
            openid:that.openId 
           }
         }
       }).then((resp) => {
         console.log(userinfo._openid)
         console.log(mission)
         wx.cloud.callFunction({
           name: 'updateUser',
           config: {
             env: 'zynch-9g9w03iff67ab65a'
           },
           data: {
             type: 'updateUser',
             data: {
              integral: mission.mission_integral,
              openid:that.openId
             }
           }
         })
           .then(resp => {
            //  this.getRecord()
            wx.cloud.callFunction({
              name: 'deleteMission',
              config: {
                env: 'zynch-9g9w03iff67ab65a'
              },
              data: {
                data: {
                  id: mission._id
                }
              }
            }).then(resp => {
              that.getRecord()
            })
             wx.showToast({
               title: '完成任务',
               icon: 'success',
               duration: 1000
             })
           })
         // })
       }).catch((e) => {
         console.log("到底他妈的哪里出错了")
      });
      }
    })

   
 },
 
  deleteRewards(data){
    wx.cloud.callFunction({
      name: 'deleteMission',
      config: {
        env: 'zynch-9g9w03iff67ab65a'
      },
      data: {
        data: {
          id: data._id
        }
      }
    }).then(resp => {
      this.getRecord()
    })
  }, 

  getRecord() {
    wx.showLoading({
      title: '',
    });
   wx.cloud.callFunction({
      name: 'selectMission',
      config: {
        env: this.data.envId
      },data: {
        type: 'selectMission'
      }
    }).then((resp) => {
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

  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let user = wx.getStorageSync('user')
    console.log("我的缓存信息",user);
    if(user){
      this.setData({
        openId:user._openid
      })
    }else{
      wx.showToast({
        title: '好像没登陆诶',
        icon:"loading",
        duration:1000
      })
      wx.reLaunch({
        url: '../home/home',
      })
    }
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