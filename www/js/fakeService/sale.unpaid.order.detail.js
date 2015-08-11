$(function(){
  var status = 'fail';
  var msg = '';
  var data = {};
  var results = {};
  
  var db = sap.creditManagement.db;
  var requestData = db.getRequest('sale.unpaid.order.detail.js');
  var orderInfo = db.getOrderById(requestData.orderId);
  var collectionList = db.getCollectionsByOrderId(requestData.orderId);
  var collectorName = '';
  
  if (collectionList.length) { // At least have one collection record
    collectorName = collectionList[collectionList.length - 1].collector;
  }
  data = {
    orderInfo: {//id: 'S010099230', amount: 7000, date: '2011-02-06', status: '逾期未处理', customerId: 1}
      orderId: orderInfo.id,
      date: orderInfo.date,
      priority: orderInfo.priority ? orderInfo.priority : 'high',
      amount: orderInfo.amount,
      unit: 'cny',
      status: orderInfo.status
    },
    collector: {
      id: 4,
      name: collectorName
    },
    collectionHistory: collectionList
  };
  status = 'success';
  results = {
    status: status,
    message : msg,
    data: data
  }
  console.log(results);
  jsonp_callback(results);
});