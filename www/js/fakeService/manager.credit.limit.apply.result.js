$(function() {
  var status = 'fail';
  var data = {};
  var results = {};
  var requestData = sap.creditManagement.db.getLocationParams('credit-limit-approval-detail.html');
  var applyId = requestData.applicationId;
  
  switch (requestData.status) {
  case 'reject':
    requestData.status = 'rejected';
    break;
  case 'approve':
    requestData.status = 'approved';
    break;
  case 'process':
    requestData.status = 'waiting';
    break;
  }
  //Get the apply record according to the specific applyId and status
  var applyInfo = sap.creditManagement.db.getCreditApplyByApplyIdAndStatus(applyId, requestData.status);
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
  var customerId = applyInfo.customerId;
  var customerInfo = sap.creditManagement.db.getCustomerById(customerId);
  var amountUsage = {};
  
  //reject/process/approve
  switch (applyInfo['status']) {
    case 'waiting':
    case 'undo':
    case 'process':
      apply_status = 'process';
      break;
    case 'approved':
    case 'approve':
      apply_status = 'approve';
      break;
    case 'rejected':
    case 'reject':
      apply_status = 'reject';
      break;
  }
  //priority: high,normal,low
  switch (applyInfo['priority']) {
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
      date: applyInfo['date'],
      priority: priority,
      amount: applyInfo['creditRequestAmount'],
      unit: 'CNY',
      status: apply_status,
      applicationReason: applyInfo['reason'],
      sellerSuggestion: applyInfo['suggestion'],
      analystSuggestion: applyInfo['analystSuggest']
    },
    amountUsage: {
      used: customerInfo.creditUsed,
      total: customerInfo.creditLimit,
      requestAmount: applyInfo['creditRequestAmount'],
      unit: 'CNY'
    }
  };
  
  status = 'success';
  results = {
    message: '',
    status: status,
    data: data
  };
  jsonp_callback(results);
});