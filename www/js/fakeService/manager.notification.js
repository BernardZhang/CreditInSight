$(function(){
  var status = 'fail';
  var msg = '';
  var data = {};
  var results = {};
  
  var db = sap.creditManagement.db;
  var requestData = db.getRequest('manager.notification.js');
  var applyList = db.getAllCreditApplys();
  var applicationApprovelCount = applyList['waiting'].length;
  var warningCount = db.getAllWarningCustomers()['warningList'].length;
 
  data = {
    applicationApprovelCount: applicationApprovelCount,
    warningCount: warningCount
  };
  
  status = 'success';
  results = {
    message: msg,
    status: status,
    data:data
  };
  jsonp_callback(results);
});