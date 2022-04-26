//cloudfuctions/login/login.js
const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
exports.main = async(event, context) => {
  console.log(event)
  console.log(context)
  const wxContext = await cloud.getWXContext()
  // let openid =  wxContext.OPENID;
  // let appid =  wxContext.APPID;
  // let unionid = wxContext.UNIONID;
  // let env =  wxContext.ENV;
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    env: wxContext.ENV,
  }
}
