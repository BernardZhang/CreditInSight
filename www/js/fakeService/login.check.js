$(function() {
  var status = 'fail', data = {}, msg = '';

  var requestData = sap.creditManagement.db.getRequest('login.check.js');
  var userInfo = sap.creditManagement.db.getAllUsers();
  var loginUserName = requestData.userName.toLowerCase();
  var loginUserPwd = requestData.psw;
  if(loginUserName && loginUserPwd) {
    if( loginUserInfo = userInfo[loginUserName]) {
      if(loginUserInfo.username == loginUserName && loginUserInfo.password == loginUserPwd) {
        status = 'success';
        data.role = loginUserInfo.role;
        data.userid = loginUserInfo.id;
        data.token = "sessionid" + loginUserInfo.id;
      } else {
        msg = 'Invalid username or password.';
      }
    } else {
      msg = 'Username is not exist.';
    }
  } else {
    msg = 'Empty username or password.';
  }
  var results = {
    status : status,
    message : msg,
    data : data
  };

  jsonp_callback(results);
});
