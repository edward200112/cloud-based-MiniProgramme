const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  const data = event.data
  // 返回数据库查询结果
  const user = await db.collection('user').where({openId:data.openid}).get();
  return await db.collection('user').where({openId: data.openid}).update({data:{credit: user.data[0].credit + data.integral}})
};
