const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  try {
  return await db.collection('user').where({
    _openId : event.openid
  }).get();
  }catch(e){
    console.error(e)
  }
};
