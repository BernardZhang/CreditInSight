$(function() {
  var status = 'fail', applyInfo;
  var requestData = sap.creditManagement.db.getRequest('customer.apply.detail.js');
  var applyId = requestData.applyId;
  var apply_status, priority;
  //Get the apply info according to the specific applyId
  if (!applyId ) {
    console.log('no apply id');
  }
  applyInfo = sap.creditManagement.db.getApplyByApplyId(applyId);
  
  var allApplys = sap.creditManagement.db.getAllCreditApplys();
  var applyList = applyInfo['status'] === 'undo' ? allApplys['undo'] : (applyInfo['status'] === 'waiting' ? allApplys['waiting'] : allApplys['done']);
  for (var i in applyList) {
    if (applyList[i].applyId === applyId) {
      applyList[i].unread = false;
    }
  }
  
  //reject/process/approve
  switch (applyInfo['status']) {
    case 'waiting':
    case 'undo':
    case 'process':
      apply_status = 'process';
      allApplys[applyInfo['status']] = applyList;
      break;
    case 'approved':
    case 'approve':
      apply_status = 'approve';
      allApplys['done'] = applyList;
      break;
    case 'rejected':
    case 'reject':
      apply_status = 'reject';
      allApplys['done'] = applyList;
      break;
  }
  sap.creditManagement.db.setAllCreditApplys(allApplys);
  
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
  
  //Get the customer info
  var customerId = sap.creditManagement.db.getCurrentUser().id;
  var customerInfo = sap.creditManagement.db.getCustomerById(customerId);

  var data = {
    applyInfo: {
      id: applyInfo['applyId'],
      amount: applyInfo['creditRequestAmount'],
      unit: 'CNY',
      date: applyInfo['date'],
      status: apply_status,
      priority: priority,
      applyReason: applyInfo['reason'],
      rejectReason: applyInfo['suggestion']
    },
    amount:{
      used: customerInfo.creditUsed,
      total: customerInfo.creditLimit,
      unit: 'CNY'
    }
  };
  
  if (applyInfo['orderId']) {
    data.applyInfo.orderInfo = sap.creditManagement.db.getOrderById(applyInfo['orderId']);
  }
  
  status = 'success';
  var results = {
    status: status,
    data: data
  };
  console.log(results);
  jsonp_callback(results);
});