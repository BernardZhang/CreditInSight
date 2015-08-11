$(function(){
  var status = 1,
      data=[];
  var requestData = sap.creditManagement.db.getRequest('collection.list.js');
  var orderId = requestData.orderId;
  data = sap.creditManagement.db.getCollectionsByOrderId(orderId);
  
  status = 0;
  var results = {
    status: status,
    data: data
  };
  
  jsonp_callback(results);
});