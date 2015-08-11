$(function() {
  var status = 'fail';
  var requestData = sap.creditManagement.db.getRequest('customer.apply.create.js');
  /*
    amount: "123"
    priority: "high"
    reason: ""
    userid: 1
  */
  
  function getCurrentDate(objDate) {
    var nowDate = {};
    if (objDate) {
      nowDate = objDate;
    } else {
      nowDate = new Date();
    }
    var year = nowDate.getFullYear();
    var month = nowDate.getMonth() + 1;
    var day = nowDate.getDate();
    
    month = (month<10)?'0'+month:month;
    day = (day<10)?'0'+day:day;
    
    return year + '-' + month + '-' + day;
  }
  //logic start
  var allCreditApplys = sap.creditManagement.db.getAllCreditApplys();console.log(allCreditApplys);
  var customer = sap.creditManagement.db.getCustomerById(1);
  var nowDate = new Date();
  var newOne = {
    analystSuggest: "",
    applyId: nowDate.getTime(),
    creditRequestAmount: requestData.amount,
    customerId: customer.id,
    customerName: customer.name,
    date: getCurrentDate(nowDate),
    priority: requestData.priority,
    reason: requestData.reason,
    status: "process",
    suggestion: "",
  };
  console.log(newOne);
  allCreditApplys.undo.unshift(newOne);
  sap.creditManagement.db.setAllCreditApplys(allCreditApplys);
  //logic end  
  
  status = 'success';
  var results = {
    status: status,
    data: {}
  };
  
  jsonp_callback(results);
});