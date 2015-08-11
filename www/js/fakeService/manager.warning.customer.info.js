$(function () {
  var status = 'fail';
  var data = {};
  var results = {};
  var requestData = sap.creditManagement.db.getRequest('manager.warning.customer.info.js');
  var customerId = requestData.customerId;
  var customerInfo = sap.creditManagement.db.getCustomerById(customerId);
  
  data = {
    used: customerInfo.creditUsed,
    limit:  customerInfo.creditLimit,
    unit: customerInfo.unit,
    // customerName: customerInfo.name
  };
  status = 'success';
  results = {
    message: '',
    status: status,
    data: data
  };
  jsonp_callback(results);
});