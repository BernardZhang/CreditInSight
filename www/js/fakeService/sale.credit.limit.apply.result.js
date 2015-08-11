$(function() {
  var status = 'fail';
  var msg = '';
  var data = {};
  var results = {};
  
  var db = sap.creditManagement.db;
  var requestData = db.getLocationParams('sale-credit-limit-apply-detail.html');
  var applyId = requestData.applicationId;
  var applyStatus = requestData.status;
  var orderHistorys = [];
  var priority = '';
  
  switch (applyStatus) {
  case 'reject':
    applyStatus = 'rejected';
    break;
  case 'approve':
    applyStatus = 'approved';
    break;
  }
  
  //Get the apply record according to the specific applyId and status
  var applicationInfo = sap.creditManagement.db.getCreditApplyByApplyIdAndStatus(applyId, applyStatus);
  
  var allApplys = sap.creditManagement.db.getAllCreditApplys();
  var applyList = allApplys['done'];
  for (var i in applyList) {
    if (applyList[i].applyId == applyId) {
      applyList[i].unread = false;
    }
  }
  allApplys['done'] = applyList;
  sap.creditManagement.db.setAllCreditApplys(allApplys);
  
  //Get the customer info
  var customerId = applicationInfo.customerId;
  var customerInfo = db.getCustomerById(customerId);
  
  switch (applicationInfo['priority']) {
  case 'h':
  case 'high':
    priority = 'high';
    break;
  case 'n':
  case 'normal':
    priority = 'normal';
    break;
  case 'l':
  case 'low':
    priority = 'low';
    break;
  } 
  data = {
    customerInfo: {
      name: customerInfo['name'],
      contactor: customerInfo['contact'],
      phone: customerInfo['tel']
    },
    applicationInfo: {
      date: applicationInfo['date'],
      priority: priority,
      amount: applicationInfo['creditRequestAmount'],
      unit: 'cny',
      status: requestData.status,
      reason: applicationInfo['reason'],
      processSuggestion: applicationInfo['suggestion']
    },
    amountUsage: {
      used: customerInfo['creditUsed'],
      total: customerInfo['creditLimit'],
      unit: 'cny'
    }
  };
  
  status = 'success';
  results = {
    message: msg,
    status: status,
    data: data
  };
  
  jsonp_callback(results);
});