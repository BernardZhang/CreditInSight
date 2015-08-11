$(function(){
  var status = 0,
      data=[];
  var requestData = sap.creditManagement.db.getRequest('customer.order.js');
  
  var customerId = requestData.customerId;
  
  /*
  construct of the data, looks like:
    [
      {id: 1, serialNo: 'S010099230', amount: 2000, date: 20110206, status: '逾期未处理'},
      {id: 1, serialNo: 'S010099231', amount: 2500, date: 20110706, status: '逾期未处理'},
      {id: 1, serialNo: 'S010099232', amount: 2600, date: 20111126, status: '逾期未处理'},
      {id: 1, serialNo: 'S010099233', amount: 3000, date: 20120316, status: '逾期未处理'}
    ];
  */
  data = sap.creditManagement.db.getOrdersByCustomerId(customerId);
  
  var results = {
    status: status,
    data: data
  };
  
  jsonp_callback(results);
});