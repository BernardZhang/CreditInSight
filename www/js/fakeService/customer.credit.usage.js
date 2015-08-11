$(function() {
  var status = 'fail',
      msg = '';
  var requestData = sap.creditManagement.db.getRequest('customer.credit.usage.js');
  var userid = requestData.userId;
  var totalAmount = 0;

  //Get the customer info
  var customer = sap.creditManagement.db.getCustomerById(userid);
  var orders = sap.creditManagement.db.getOrdersByCustomerId(userid);
  for(var index in orders) {
    var order = orders[index]
    totalAmount += order.amount;
  }
  
  var data = {
    credit : {
      used : customer.creditUsed,
      total : customer.creditLimit,
      unit : 'CNY'
    },
    records : {
      total : totalAmount,
      unit : 'CNY',
      items : orders
    }
  };
  status = 'success';
  var results = {
    status : status,
    message : msg,
    data : data
  };

  jsonp_callback(results);
});
