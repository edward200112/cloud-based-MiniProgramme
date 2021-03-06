const cloud = require('wx-server-sdk');

cloud.init({
  env: 'zynch-9g9w03iff67ab65a'
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event,context) => {
  const data = event.data
  // 返回数据库查询结果
  return await db.collection('sign_in').add({
    data: [{
      date:data.nowdate,
      openid:data.openid
    }]
  });
};

