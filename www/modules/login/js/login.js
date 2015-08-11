/**
  * (c) Copyright 2012 SAP AG. All rights reserved
  *
  * Summary: Provides user authentication service
  *
  * Dependency files: Jquery.js;Jquery.mobile.js;knockout.js;
  *
  */
$(document).bind('pageinit', function() {
  var username = '',
      passwd = '',
      isRemember = false,
      uri = sap.creditManagement.CONST_DATA.serviceUri,
      db = sap.creditManagement.db,
      loginInfo = db.getRememberedUser();
  if (loginInfo) {
    username = loginInfo.username;
    passwd = loginInfo.password;
    isRemember = true;
  }
  
  var successHandle = function(result){
    var userRole = result.data.role.toLowerCase();
    switch(userRole){
      case 'sales':
        userRole = 'sale';
        break;
      case 'customer representative':
        userRole = 'customer';
        break;
      case 'manager':
        userRole = 'manager';
        break;
      case 'admin':
      	userRole = 'admin';
      	break;
      default:
        userRole = "";
        break;
    }
    if (userRole) {
      var user = {role:userRole, id: result.data.userid};
      sap.creditManagement.db.setCurrentUser(user);
      sap.creditManagement.db.setSecurId(result.data.token);
      window.location.href = 'modules/' + user.role + '/index.html';
    } else {
      msg = 'userRoleUnavailable';
      sap.creditManagement.sapAlert(msg, '', function(){alert('sapAlert callback');});
    }
  };
  
  var loginViewModel= {
      username: username,
      password: passwd,
      isRemember: isRemember,

      onsubmit: function() {
        var locale = db.getLang();
        if (this.isRemember) {
          var rememberUser = {
            isRemember: false,
            username: this.username,
            password: ''
          };
          db.setRememberedUser(rememberUser);
        }
        //login?userName=c&psw=c&locale=en-US 
        var requestData = {userName: this.username, psw: this.password, locale: locale};
        //var requestData = {userName: this.username, password: this.password, isRemember: this.isRemember};
        sap.creditManagement.sapcmrequest({
          url:uri.common.userLogin,
          success:successHandle,
          data:requestData,
          type:"post",//default callback
        });
      }
  };

  // binding view model
  ko.applyBindings(loginViewModel, document.getElementById('login'));
  sap.creditManagement.renderTranslation();
});