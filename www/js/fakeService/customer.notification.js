$(function(){
  var status = 'fail',
      msg = '';
      data='';
  var requestData = sap.creditManagement.db.getRequest('customer.notification.js');
  
  var userId = requestData.userId;
  data = {applicationCount:3, creditChangeCount: 1};
  status = 'success';
  
  var results = {
    status: status,
    message:msg,
    data:data
  };
  jsonp_callback(results);
});