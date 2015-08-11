$(function () {
  var status = 'fail';
  var data = {};
  var results = {};
  var applyList = sap.creditManagement.db.getAllCreditApplys();
  var unProcessed = [];
  var processed = [];
  var undoApplyList, doneApplyList;
  var applyInfo;
 
  
  undoApplyList = applyList['waiting'];
  doneApplyList = applyList['done'];
  for (i in undoApplyList) {
    applyInfo = undoApplyList[i];
    //priority: high,normal,low
    switch (applyInfo['priority']) {
    case 'h':
    case 'high':
      applyInfo.priority = 'high';
      break;
    case 'n':
    case 'normal':
      applyInfo.priority = 'normal';
      break;
    case 'l':
    case 'low':
      applyInfo.priority = 'low';
      break;
    } 
    applyInfo.status = 'process';
    
    unProcessed.push({ 
      id: applyInfo['applyId'],
      company: applyInfo['customerName'],
      date: applyInfo['date'],
      priority: applyInfo['priority'],
      status: applyInfo['status']
    });
  }
  for (var i in doneApplyList) {
    //priority: high,normal,low
    applyInfo = doneApplyList[i];
    switch (applyInfo['priority']) {
    case 'h':
    case 'high':
      applyInfo.priority = 'high';
      break;
    case 'n':
    case 'normal':
      applyInfo.priority = 'normal';
      break;
    case 'l':
    case 'low':
      applyInfo.priority = 'low';
      break;
    } 
    switch (applyInfo.status) {
    case 'rejected':
      applyInfo.status = 'reject';
      break;
    case 'approved':
      applyInfo.status = 'approve';
      break;
    }
    
    processed.push({
      id: applyInfo['applyId'],
      company: applyInfo['customerName'],
      date: applyInfo['date'],
      priority: applyInfo['priority'],
      status: applyInfo['status']
    });
  }
  
  data = {
    applicationItems: {
      unProcessed: unProcessed,
      processed: processed
    }
  };
  
  status = 'success';
  results = {
    message: '',
    status: status,
    data: data
  };
  
  jsonp_callback(results);
});
