$(function () {
  var status = 'fail';
  var msg = '';
  var results = {};
  var requestData = sap.creditManagement.db.getRequest('sale.credit.limit.apply.reject.js');
  var applicationId = requestData.applicationId;
  sap.creditManagement.db.moveCreditApply(applicationId, 'undo', 'done', requestData.reason);
  
  status = 'success';
  results = {
      message: msg,
      status: status
  };
  
  jsonp_callback(results);
});