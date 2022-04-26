//cloudfuctions/getData/getData.js
const cloud = require('wx-server-sdk')
cloud.init(
  { env: 'zynch-9g9w03iff67ab65a' }
)
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('user').where({
     _openid:event.openid
    }).get()
  } catch (e) {
    console.error(e)
  }
}
