$(function() {
  var i;
  var status = 'fail';
  var requestData = sap.creditManagement.db.getRequest('customer.apply.list.js');
  var customerId = requestData.userId;
  var db_applyList = sap.creditManagement.db.getApplysByCustomerId(customerId);
  var applyList = [];
  var applyInfo;
  var status = 'process', priority = 'normal';
  for (i in db_applyList) {
    applyInfo = db_applyList[i];
    //reject/process/approve
    switch (applyInfo['status']) {
      case 'waiting':
      case 'undo':
        status = 'process';
        break;
      case 'approved':
      case 'approve':
        status = 'approve';
        break;
      case 'rejected':
      case 'reject':
        status = 'reject';
        break;
    }
    //priority: high,normal,low
    switch (applyInfo['priority']) {
      case 'h':
      case 'high':
        priority = 'high';
        break;
      case 'n':
      case 'normal':
        priority = 'normal';
        break;
      case 'l':
      case 'low':
        priority = 'low';
        break;
    }
    applyList.push({
      id: applyInfo['applyId'],
      amount: applyInfo['creditRequestAmount'],
      unit: 'cny',
      date: applyInfo['date'],
      status: status,
      priority: priority,
      unread: applyInfo['unread']
    });
    console.log(applyList);
  }

  status = 'success';
  var results = {
    status: status,
    
    data: {
      history: applyList
    }
  };
  
  jsonp_callback(results);
});