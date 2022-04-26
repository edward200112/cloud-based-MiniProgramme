const addMission = require('./addMission/index');

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'addMission':
      return await addMission.main(event, context);  
  }
};
