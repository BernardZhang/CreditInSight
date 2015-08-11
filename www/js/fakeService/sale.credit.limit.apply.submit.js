$(function () {
  var status = 'fail';
  var msg = '';
  var results = {};
  var db = sap.creditManagement.db;
  var requestData = sap.creditManagement.db.getRequest('sale.credit.limit.apply.submit.js');
  var applicationId = requestData.applicationId;
  applicationId = sap.creditManagement.db.getLocationParams('sale-credit-limit-apply-detail.html').applicationId;
  var applicationInfo = db.getCreditApplyByApplyIdAndStatus();
  
  sap.creditManagement.db.moveCreditApply(applicationId, 'undo', 'waiting');
  status = 'success';
  results = {
    message: msg,
    status: status,
    data:null
  };
  
  jsonp_callback(results);
});