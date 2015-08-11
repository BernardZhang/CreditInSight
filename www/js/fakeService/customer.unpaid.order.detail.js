$(function(){
  var status = 'fail',
      msg = '';
  
  var requestData = sap.creditManagement.db.getRequest('customer.unpaid.order.detail.js');

  var orderInfo = sap.creditManagement.db.getOrderById(requestData.orderId);
  console.log(orderInfo);
  var collectionList = sap.creditManagement.db.getCollectionsByOrderId(requestData.orderId);
  
  var data = {
    orderInfo: orderInfo,
    collections: collectionList
  };
  status = 'success';
  
  var results = {
    status: status,
    message : msg,
    data: data
  };
  //results = JSON.stringify(results);
  
  jsonp_callback(results);
});