const db = wx.cloud.database();
const msgpages = db.collection("msgpages");
const author = db.collection("author");
var userInfo;
var that;
var openId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authority: false,
    show: false,  //是否弹出留言面板
    textValue: "",
    loading: true,  //是否正在加载
    envId:'zynch-9g9w03iff67ab65a',
    pageList:[],

    nowDate:'',
    sign_in:"签到 !!",
    sign_in_color:"#ff6781",
    button_onclick:'sign_in',
    sign_credit:5,

    data: {
      background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
      indicatorDots: true,
      vertical: false,
      autoplay: false,
      interval: 1000,
      duration: 500
    },
  },
  onSubmit: function (e) {
    console.log(e.detail.value.msgInput);
    msgpages.add({
      data: {
        name: e.detail.value.pageName,
        discribe: e.detail.value.pageDiscribe,
      }
    }).then(res => {
      wx.showToast({
        title: "新建成功",
        icon: "success",
        success: res2 => {
          this.setData({
            textValue: ""
          });
          this.getData();
        }
      })
    })
  },

  // 页面刷新获取数据
  getData: function (e) {
    //数据库存储不同留言板
    wx.cloud.callFunction({
      name: 'getData',
      data: {
        db: 'msgpages',
        id: null,
      }
    }).then(res => {
      var rrd = res.result.data;
      console.log(rrd)
      this.setData({
        pageList: res.result.data,
        loading: false
      })
      // wx.stopPullDownRefresh
    })
  },

  //判断用户权限
  authentication: function () {
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        db.collection('author').get().then(res2 => {
          console.log(res)
          console.log(res2)
            // if (res.result.openId == res2.data[0]._openid) 
            if (res.result.openId == res2.data._openid) {
              this.setData({
                authority: true
              })
            }
        })
      }
    })
  },

  //弹出面板设置
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    let userInfo = wx.getStorageSync('user')
    console.log(userInfo)
    this.getData();
    this.authentication();
    this.setData({
      pageId: options.id	//当前页面参数
    })
    this.getData();	//刷新页面数据
    var nowDate = this.formatDateTime();
    var towDaysBetween = this.GetNumberOfDays('2021-05-02',nowDate);
    wx.showToast({
      title: '欢迎宝贝使用!!',
      mask: true,
      icon: 'loading'
      })
      this.setData({
        nowDate:nowDate,
        towDaysBetween:towDaysBetween
      })

      wx.cloud.callFunction({
        name:'getOpenid',
        success(res){
            that.openId = res.result.openid
            wx.cloud.callFunction({
              name: 'checkSign',
              config: {
                env: 'zynch-9g9w03iff67ab65a'
              },
              data: {
                data: {
                  nowdate:nowDate,
                  openid:that.openId
                } 
              }
            }).then((resp)=>{
              // console.log(this.data.envId)
              // console.log(nowDate)
              console.log('resp', resp)
              const sign_inData = resp.result.data.reverse();
              console.log('sign_inData', sign_inData)
              if(sign_inData.length > 0)
              {
                console.log('今天已签到')
                that.setData({
                  sign_in:"已签到",
                  sign_in_color:"#c3c9c7",
                  button_onclick:''
                })
              }
            })
        }
      })
     
  },
  sign_in(){
    that = this;
    let userInfo = wx.getStorageSync('user')
    console.log(userInfo)
    console.log(this.data.nowDate)
    wx.cloud.callFunction({
      name:'getOpenid',
      success(res){
        that.openId = res.result.openid;
        wx.cloud.callFunction({
          name: 'add_signINdate',
          config: {
            env: 'zynch-9g9w03iff67ab65a'
          },
          data: {
            type: 'add_signINdate',
            data:{
              nowdate:that.data.nowDate,
              openid:that.openId
            }
          }
        }).then(resp => {
    
          wx.cloud.callFunction({
            name: 'updateUser',
            config: {
              env: 'zynch-9g9w03iff67ab65a'
            },
            data: {
              type: 'updateUser',
              data: {
                integral: 5,
                openid:that.openId
              }
            }
          }).then(resp => {
            wx.showToast({
              title: '签到成功！获得5积分',
              icon: 'none',//当icon：'none'时，没有图标 只有文字
              duration: 2000
            })
            that.setData({
              sign_in:"已签到",
              sign_in_color:"#c3c9c7",
              button_onclick:''
            })
    
            that.selectUser();
          })
    
          
        })
      }
    })
    
  },

  selectUser() {
    wx.cloud.callFunction({
     name: 'selectUser',
     config: {
       env: 'zynch-9g9w03iff67ab65a'
     },
     data: {
       type: 'selectUser',
     }
   }).then((resp) => {
     this.setData({
      userIntegral: resp.result.data[0].user_integral,
      userName: resp.result.data[0].user_name
     })
   }).catch((e) => {
  });
 },

  GetNumberOfDays(date1,date2){
    var a1 = Date.parse(new Date(date1));
    var a2 = Date.parse(new Date(date2));
    var day = parseInt((a2-a1)/ (1000 * 60 * 60 * 24));
    return day
  },
formatDateTime() {
  var date = new Date();
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h=h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  minute = minute < 10 ? ('0' + minute) : minute;
  return y+'-'+m + '-' + d;

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
  
  onPullDownRefresh:function(){
    console.log('开始下拉刷新')
    wx.showNavigationBarLoading()//在标题栏中显示加载图标
    this.data.currentPage = 1
    this.data.dataList = []  //dataList为获取到的列表数组，自行替换
    this.getData()//重新获取列表页
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