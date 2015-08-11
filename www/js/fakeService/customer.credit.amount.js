$(function(){
  var status = 'fail',
      credit;
  var requestData = sap.creditManagement.db.getRequest('customer.credit.amount.js');
  
  var customerId = requestData.userId;
  sap.creditManagement.db.getCustomerById

  data = sap.creditManagement.db.getCustomerById(customerId);
  
  credit = {
      total: data.creditLimit,
      unit: "CNY",
      used: data.creditUsed
  };
  status = 'success';
  var results = {
    status: status,
    data: {credit: credit}
  };
  jsonp_callback(results);
});