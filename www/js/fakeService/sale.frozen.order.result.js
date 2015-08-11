$(function() {
  var status = 'fail';
  var msg = '';
  var data = {};
  var results = {};
  
  var db = sap.creditManagement.db;
  var requestData = db.getLocationParams('sale-frozen-order-detail.html');
  var orderId = requestData.orderId;
  var orderStatus = requestData.status;
  var tStatus = orderStatus;
  var priority = '';
  switch (tStatus) {
  case 'unProcess':
    tStatus = 'undo';
    break;
  case 'process':
    tStatus = 'waiting';
    break;
  case 'reject':
    tStatus = 'rejected';
    break;
  case 'approve':
    tStatus = 'approved';
    break;
  }
  //Get the apply record according to the specific applyId and status
  var frozenOrderInfo = db.getFrozenOrderByOrderIdAndStatus(orderId, tStatus);
  
  var frozenOrders = sap.creditManagement.db.getAllFrozenOrders();
  var orderList = frozenOrders['done'];
  for (var i in orderList) {
    if (orderList[i].orderId == orderId) {
      orderList[i].unread = false;
    }
  }
  frozenOrders['done'] = orderList;
  sap.creditManagement.db.setAllFrozenOrders(frozenOrders);
  
  //Get the customer info
  var customerId = frozenOrderInfo.customerId;
  var customerInfo = db.getCustomerById(customerId);
  switch (frozenOrderInfo['applyPriority']) {
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
      orderId: frozenOrderInfo['orderId'],
      displayOrderId: frozenOrderInfo['orderId'],
      date: frozenOrderInfo['applyDate'],
      priority: priority,
      amount: frozenOrderInfo['orderAmount'],
      unit: 'CNY',
      status: orderStatus,
      reason: frozenOrderInfo['applyReason'],
      processSuggestion: frozenOrderInfo['applySuggestion']
    },
    amountUsage: {
      used: customerInfo['creditUsed'],
      total: customerInfo['creditLimit'],
      applied: frozenOrderInfo['applyCreditRequestAmount'],
      orderAmount: frozenOrderInfo['orderAmount'],
      unit: 'CNY'
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