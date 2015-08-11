$(function () {
  var msg = '';
  var status = 'fail';
  var results = {};
  
  var requestData = sap.creditManagement.db.getRequest('sale.add.collection.task.js');
  console.log(requestData);
  
  status = 'success';
  results = {
    message: msg,
    status: status
  }; 
  jsonp_callback(results);
});