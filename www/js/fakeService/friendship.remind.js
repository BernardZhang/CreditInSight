$(function () {
  console.log('friendship remind service...');
  var status = '';
  var data = {};
  var results = {};
  var warningRecords = sap.creditManagement.db.getWarningRecords()['list'];
  var customerWarningList = [];
  for (var i in warningRecords) {
    if (warningRecords[i].customerId == 4) {
      customerWarningList.push(warningRecords[i]);
    }
  }
  var roleName = sap.creditManagement.db.getCurrentUserRole();
  var list = [];
  if (roleName === 'sale') {
    list = warningRecords;
  }
  else {
    list = customerWarningList;
  }
  
  data = {
    list: list
  };
  console.log(data);
  status = 'success';
  results = {
    message: '',
    status: status,
    data: data
  };
  jsonp_callback(results);
});