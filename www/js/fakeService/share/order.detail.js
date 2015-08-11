$(function(){
  var status = 1;
  
  var requestData = sap.creditManagement.db.getRequest('order.detail.js');

  var orderInfo = sap.creditManagement.db.getOrderById(requestData.orderId);
  
  var data = {
    orderInfo: orderInfo
  };
  status = 0;
  
  var results = {
    status: status,
    data: data
  };
  jsonp_callback(results);
});