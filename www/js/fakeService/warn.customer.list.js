$(function () {
  var status = 'fail';
  var data = {};
  var results = {};
  var warnCustomers = sap.creditManagement.db.getAllWarningCustomers();
 
  data = {
    warningList: warnCustomers['warningList'],
    processed: warnCustomers['processed']
  };
  
  status = 'success';
  results = {
    message: '',
    status: status,
    data: data
  };
  
  jsonp_callback(results);
});
