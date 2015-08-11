$(function () {
  var status = 'fail';
  var msg = '';
  var results = {};
  var db = sap.creditManagement.db;
  var requestData = db.getRequest('sale.frozen.order.apply.reject.js');
  var orderId = requestData.orderId;
  var orderStatus = db.getLocationParams('sale-frozen-order-detail.html');
 
  var allOrders = db.getAllFrozenOrders();
  var unProcessList = allOrders['undo'];
  var processedList = allOrders['done'];
  var orderInfo = db.getFrozenOrderByOrderIdAndStatus(orderId, 'undo');
  db.moveFrozenOrder(orderId, 'undo', 'done', requestData.reason);
  var applicationId = orderId + 'a';
  var customerId = orderInfo.customerId;
  var now = new Date();
  var month = now.getMonth() + 1;
  var date = now.getFullYear() + '-' + month + '-' + now.getDate();
  
  status = 'success';
  results = {
    message: msg,
    status: status,
    data:{
      applicationId: applicationId,
      orderId: orderInfo['orderId'],
      date: date,
      priority: orderInfo['applyPriority'],
      status: 'rejected'
    }
  };
  
  // New a reject application record according to the response data
  var applicationInfo = {
    'applyId' : results.data.applicationId,
    'orderId' : orderId,
    'customerId' : customerId,
    'customerName' : '',
    'date' : results.data.date,
    'creditRequestAmount' : orderInfo.applyCreditRequestAmount,
    'status' : results.data.status,
    'reason' : orderInfo.applyReason,
    'rejectedReason' : requestData.reason,
    'suggestion' : orderInfo.applySuggestion,
    'analystSuggest' : '',
    'priority' : results.data.priority
  };
  
  // Save the new reject application
  var allCreditApplys = db.getAllCreditApplys();
  var doneList = allCreditApplys['done'];
  doneList.push(applicationInfo);
  allCreditApplys['done'] = doneList;
  db.setAllCreditApplys(allCreditApplys);
  
  jsonp_callback(results);
});