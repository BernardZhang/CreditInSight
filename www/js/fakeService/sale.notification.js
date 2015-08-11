$(function(){
  var status = 'fail';
  var msg = '';
  var data = {};
  var results = {};
  
  var db = sap.creditManagement.db;
  var requestData = db.getRequest('sale.notification.js');
  var applyList = db.getAllCreditApplys();
  var applicationCount = applyList['undo'].length;
  var frozenOrders = db.getAllFrozenOrders();
  var frozenOrderApplicationCount = frozenOrders['undo'].length;
  var warningCustomersCount = 3;
  var creditChangeCount = 0;
  
  status = 'success';
  data = {
    applicationCount: applicationCount,
    frozenOrderApplicationCount: frozenOrderApplicationCount,
    warningCustomersCount: warningCustomersCount,
    creditChangeCount: creditChangeCount
  };
  
  status = 'success';
  results = {
    message: msg,
    status: status,
    data:data
  };
  jsonp_callback(results);
});