$(function () {
  var status = 'fail';
  var msg = '';
  var results = {};
  var db = sap.creditManagement.db;
  var requestData = db.getRequest('sale.frozen.order.apply.submit.js');
  var orderId = requestData.orderId;
  var orderInfo = db.getFrozenOrderByOrderIdAndStatus(orderId, 'undo');
  db.moveFrozenOrder(orderId, 'undo', 'waiting', requestData.reason);
  var applicationId = orderId + 'a';
  var customerId = orderInfo.customerId;
  var customerName = db.getCustomerById(customerId).name;
  var now = new Date();
  var month = now.getMonth() + 1;
  var date = now.getFullYear() + '-' + month + '-' + now.getDate();
  
  console.log(date);
  status = 'success';
  results = {
    message: msg,
    status: status,
    data:{
      applicationId: applicationId,
      orderId: orderInfo['orderId'],
      date: date,
      priority: requestData.priority,
      status: 'waiting'
    }
  };
  
  // New a reject application record according to the response data
  var applicationInfo = {
    'applyId' : results.data.applicationId,
    'orderId' : orderId,
    'customerId' : customerId,
    'customerName' : customerName,
    'date' : results.data.date,
    'creditRequestAmount' : requestData.amount,
    'status' : results.data.status,
    'reason' : requestData.reason,
    'suggestion' : orderInfo.applySuggestion,
    'analystSuggest' : '',
    'priority' : results.data.priority
  };
  console.log(applicationInfo);
  
  // Save the new submit application
  var allCreditApplys = db.getAllCreditApplys();
  var waitList = allCreditApplys['waiting'];
  waitList.push(applicationInfo);
  allCreditApplys['waiting'] = waitList;
  db.setAllCreditApplys(allCreditApplys);
  
  jsonp_callback(results);
  console.log(sap.creditManagement.db.getAllCreditApplys());
});