//cloudfuctions/getData/getData.js
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection(event.db).where({
      pageId:event.id
      // is_online:true
    })
    .get()
  } catch (e) {
    console.error(e)
  }
}
