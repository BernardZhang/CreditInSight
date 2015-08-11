$(function () {
  var status = 'fail';
  var data = {};
  var results = {};
  var db = sap.creditManagement.db;
  var requestData = db.getRequest('manager.reduce.customer.credit.limit.js');
  console.log(requestData);
  var limit = requestData.limit;
  var customerId = requestData.customerId;
  var customerInfo = db.getWarningCustomerById(customerId);
  var customers = db.getAllCustomers();
  console.log(customers);
  for (var i = 0; i < customers.length; i++) {
    if (customers[i].id == customerId) {
      customers[i].creditLimit = limit;
      break;
    }
  }
  console.log(customers);
  sap.creditManagement.db.setAllCustomers(customers);
  var warningCustomers = sap.creditManagement.db.getAllWarningCustomers();
  var warningList = warningCustomers['warningList'];
  var processedList = warningCustomers['processed'];
  
  for (var i = 0; i < warningList.length; i++) {
    if (warningList[i].id == customerId) {
      customerInfo.action = 'minus';
      processedList.push(customerInfo);
      warningList.splice(i, 1);
    }
  }
  sap.creditManagement.db.setWarningCustomers({
    warningList: warningList,
    processed: processedList
  });
  status = 'success';
  results = {
    message: '',
    status: status
  }
  jsonp_callback(results);
});