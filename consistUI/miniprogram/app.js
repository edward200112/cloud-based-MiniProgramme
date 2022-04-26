// app.js
App({
  //打开小程序会限制性onlaunch方法

  onLaunch: function () {
    // wx.cloud.init({
    //   env:"zynch-9g9w03iff67ab65a"
    // })
    // wx.cloud.callFunction({
    //   name:'login_get_openid',
    //   success(res){
    //     console.log(res)
    //     that.globalData.openid = res.result.openid
    //     //查看数据库用户表中是否存在记录
    //     wx.cloud.database().collection('user_info').where({
    //       _openid:res.result.openid
    //     }).get({
    //       success(result){
    //         console.log(result)
    //         that.globalData.userInfo = result.data[0]
    //       }
    //     })
    //   }
    // })

    // this.globalData = {
    //   openid:null,
    //   userInfo:null
    // };
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        //   env 如不填则使用默认环境（第一个创建的环境）
        env: 'zynch-9g9w03iff67ab65a',
        traceUser: true,
      })
    }
    
    this.globalData = {
    }
    // if (!wx.cloud) {
    //   console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    // } else {
    //   wx.cloud.init({
    //     // env 参数说明：
    //     //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
    //     //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
    //     //   如不填则使用默认环境（第一个创建的环境）
    //     // env: 'my-env-id',
    //     traceUser: true,
    //   });
    // }
  },
   


});
