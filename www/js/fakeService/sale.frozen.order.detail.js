$(function() {
  var status = 'fail';
  var msg = '';
  var data = {};
  var results = {};
  
  var db = sap.creditManagement.db;
  var requestData = db.getLocationParams('sale-frozen-order-detail.html');
  var orderId = requestData.orderId;
  var orderStatus = requestData.status;
  var priority = '';
  switch (orderStatus) {
  case 'unProcessed':
    orderStatus = 'undo';
    break;
  case 'processing':
    orderStatus = 'waiting';
    break;
  case 'reject':
    orderStatus = 'rejected';
    break;
  case 'approve':
    orderStatus = 'approved';
    break;
  }
  //Get the apply record according to the specific orderId and status
  var frozenOrderInfo = db.getFrozenOrderByOrderIdAndStatus(orderId, orderStatus);
  
  
  var frozenOrders = sap.creditManagement.db.getAllFrozenOrders();
  var orderList = [];
  
  if (orderStatus === 'undo') {
    orderList = frozenOrders['undo'];
  } else {
    orderList = frozenOrders['waiting'];
  }
  for (var i in orderList) {
    if (orderList[i].orderId == orderId) {
      orderList[i].unread = false;
    }
  }
  
  if (orderStatus === 'undo') {
    frozenOrders['undo'] = orderList;
  } else {
    frozenOrders['waiting'] = orderList;
  }
  
  sap.creditManagement.db.setAllFrozenOrders(frozenOrders);
  
  //Get the customer info
  var customerId = frozenOrderInfo.customerId;
  var customerInfo = db.getCustomerById(customerId);
  var products = [];
  var productInfo = {};
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
  for (var i in frozenOrderInfo.productList) {
    productInfo = frozenOrderInfo.productList[i];
    products.push({ // {name:微波炉，id:bx10101,count:10,price:400,total:40000,unit:cny}
      name: productInfo['productName'],
      id: productInfo['productNo'],
      count: productInfo['productNum'],
      price: productInfo['productPrice'],
      total: productInfo['productPrice'] * productInfo['productNum'],
      unit: 'cny'
    });
  }
  data = {
    customerInfo: {
      name: customerInfo['name'],
      contactor: customerInfo['contact'],
      phone: customerInfo['tel']
    },
    orderInfo: {
      id: frozenOrderInfo['orderId'],
      displayId: frozenOrderInfo['orderId'],
      date: frozenOrderInfo['orderDate'],
      priority: priority,
      amount: frozenOrderInfo['orderAmount'],
      expectedProfit: frozenOrderInfo['expectation'],
      unit: 'cny',
      details: products
    },
    amountUsage: {
      used: customerInfo['creditUsed'],
      total: customerInfo['creditLimit'],
      // applied: frozenOrderInfo['applyCreditRequestAmount'],   //API not include TODO::
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