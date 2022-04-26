// pages/msgPages/msgPages.js
//连接数据库
const db = wx.cloud.database();
const message = db.collection("message");
const author = db.collection("author");
var that;
var openId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maxNumber: 140,//可输入最大字数
    number: 0,//已输入字数
    
    show: false,  //是否弹出留言面板
    showReply: false, //是否弹出回复面板
    authority: false, //鉴权
    loading: true,  //是否正在加载
    textValue:"",	//输入框内容
    replyMsgId:"",	//回复留言的id
    qr:"",	//小程序码的路径

    //留言数据
    pageId:"",
    name:"",
    imageSrc:"",
    msgList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.id)
    this.authentication();	//判读权限
    this.setData({
    pageId: options.id	//当前页面参数
    })
    this.getData();	//刷新页面数据
  },
  //判断用户权限

  authentication:function(){   
    wx.cloud.callFunction({	//调用云函数返回openid
      name: 'login',
      complete: res => {
        console.log(res)
        db.collection('author').get().then(res2 => {
          console.log(res)
          // if (res.result.openId === res2.data[0]._openid)
          if (res.result.openId === res2.data._openid){
            this.setData({
              authority:true	//如果和数据库中管理员id一致，则管理员权限打开
            })
          }
        })
      }
    })
  },
// 页面刷新获取数据
getData:function(e){
  wx.cloud.callFunction({	//使用云函数
    name: 'getData',
    data: {
      id:this.data.pageId,
      db:'message',
    }
  }).then(res => {
    console.log(res.result.data)
    this.setData({
      msgList: res.result.data,	//将云函数返回的云数据库的内容赋给msgList
      loading: false	//停止页面加载动画
    })
  })
},
//获取用户信息
onInfo:function(e){
  console.log(e)
  that = this;
  console.log(e.detail.userInfo)

  if (e.detail.errMsg === "getUserInfo:ok"){
    this.showPopup()	//调用弹出面板函数
    wx.cloud.callFunction({
      name:'getOpenid',
      success(res){
        that.openId = res.result.openid
        console.log(that.openId)
        db.collection('user').get().then(res=>{
          console.log(res)
          that.setData({
            imageSrc: res.data[0].avatarUrl,
            name: res.data[0].nickName,
          })
        })
      }
    })
  }
},
//弹出面板函数
showPopup() {
  this.setData({ show: true });
},
onClose() {
  this.setData({ show: false });
},
//pages/msgPages/msgPages.js
//提交留言
onSubmit:function(e){
  // console.log(e.detail.value.msgInput);
  message.add({	//存入数据库
    data: {
      imageSrc: this.data.imageSrc,
      name: this.data.name,
      text: e.detail.value.msgInput,
      pageId:this.data.pageId,
    }
  }).then(res => {
    wx.showToast({	//提示弹窗
      title: "留言成功",
      icon: "success",
      success: res2 => {
        this.setData({
          textValue: ""	//让输入框内容清空
        });
        this.getData();	//调用刷新页面函数（进入页面时讲了）
      }
    })
  })
},

//监听记录输入字数
inputText: function (e) {
  let value = e.detail.value;
  let len = value.length;
  this.setData({
    'number': len
  })
},
//pages/msgPages/msgPages.js
// 置顶
toTop:function(e){
  var flag = 0;
  console.log("指定功能的数据测试"+e)
  if (!e.currentTarget.dataset.msgdata.top) {	//判断现在是否为置顶状态
    wx.cloud.callFunction({
      name: 'toTop',
      data: {
        id: e.currentTarget.dataset.msgid,
      }
    }).then(res => {
      flag = 1;
      wx.showToast({
        title: "置顶成功",
        icon: "success",
        success: res2 => {
          this.getData();	//重新刷新页面
        }
      })
    })
  }else{
    wx.cloud.callFunction({
      name: 'notTop',
      data: {
        id: e.currentTarget.dataset.msgid,
      }
    }).then(res => {
      flag = 0;
      wx.showToast({
        title: "取消成功",
        icon: "success",
        success: res2 => {
          this.getData();	//重新刷新页面
        }
      })
    })
  }
},
    
//删除
delect:function(e){
  console.log(e.currentTarget.dataset.msgid)
  wx.cloud.callFunction({
    name: 'delect',
    data:{
      id: e.currentTarget.dataset.msgid,
    }
  }).then(res => {
    wx.showToast({
      title: "删除成功",
      icon: "success",
      success: res2 => {
        this.getData();	//重新刷新页面
      }
    })
  })
},
//pages/msgPages/msgPages.js
//留言弹窗设置
showRe(e){
  this.setData({
    showReply: true ,
    replyMsgId: e.currentTarget.dataset.msgid
  });
},
closeRe() {
  this.setData({ showReply: false });
},
    
//提交回复
reSubmit: function (e) {
  wx.cloud.callFunction({
    name: 'reply',
    data: {
      id: this.data.replyMsgId,
      reply: e.detail.value.msgInput,
    }
  }).then(res => {
    wx.showToast({
      title: "回复成功",
      icon: "success",
      success: res2 => {
        this.setData({
          textValue: ""
        });
        this.getData();	//刷新页面
      }
    })
  })
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