$(function(){
  var status = 0,
      data=[];
  var requestData = sap.creditManagement.db.getRequest('customer.collections.js');
  var orderId = requestData.orderId;
  data = sap.creditManagement.db.getCollectionsByOrderId(orderId);
  var results = {
    status: status,
    data: data
  };
  
  jsonp_callback(results);
});