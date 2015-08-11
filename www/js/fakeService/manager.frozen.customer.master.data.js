$(function () {
  var status = 'fail';
  var results = {};
  var db = sap.creditManagement.db;
  var requestData = db.getRequest('manager.frozen.customer.master.data.js');
  var customerId = requestData.customerId;
  var customerInfo = db.getWarningCustomerById(customerId);
  
  var customers = db.getAllWarningCustomers();
  var warningList = customers['warningList'];
  var processedList = customers['processed'];
  
  for (var i = 0; i < warningList.length; i++) {
    if (warningList[i].id == customerId) {
      customerInfo.action = 'frozen';
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
  };
  jsonp_callback(results);
});