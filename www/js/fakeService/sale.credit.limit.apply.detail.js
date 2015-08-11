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
  console.log(applyStatus);
  switch (applyStatus) {
  case 'unProcessed':
    applyStatus = 'undo';
    break;
  case 'processing':
    applyStatus = 'waiting';
    break;
  }
  
  //Get the apply record according to the specific applyId and status
  var applicationInfo = sap.creditManagement.db.getCreditApplyByApplyIdAndStatus(applyId, applyStatus);
  
  var allApplys = sap.creditManagement.db.getAllCreditApplys();
  var applyList = [];
  
  if (applyStatus === 'undo') {
    applyList = allApplys['undo'];
  } else {
    applyList = allApplys['waiting'];
  }
  for (var i in applyList) {
    if (applyList[i].applyId == applyId) {
      applyList[i].unread = false;
    }
  }
  if (applyStatus === 'undo') {
    allApplys['undo'] = applyList;
  } else {
    allApplys['waiting'] = applyList;
  }
  
  sap.creditManagement.db.setAllCreditApplys(allApplys);
  
  //Get the customer info
  var customerId = applicationInfo.customerId;
  var customerInfo = db.getCustomerById(customerId);
  
  //Get the orders association with the customer
  var orderRecords = sap.creditManagement.db.getOrdersByCustomerId(customerId);
  var total = 0;
  for (var i in orderRecords) {
    total += orderRecords[i].amount;
    orderHistorys.push({//id:s01010101,diplayId:s01001002,date:2012-01-03,amount:2000,unit:cny,status:逾期未付款}
      id: orderRecords[i].id,
      displayId: orderRecords[i].id,
      date: orderRecords[i].date,
      amount: orderRecords[i].amount,
      unit: orderRecords[i].unit,
      status: orderRecords[i].status
    });
  }
  
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
      reason: applicationInfo['reason']
    },
    amountUsage: {
      used: customerInfo['creditUsed'],
      total: customerInfo['creditLimit'],
      unit: 'cny'
    },
    records: {
      total: total,
      unit: 'cny',
      orderHistorys: orderHistorys
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