$(function(){
  var status = 'fail';
  var data = {};
  var results = {};
  var unProcessed = [];
  var processing = [];
  var processed = [];
  
  var creditApplyList = sap.creditManagement.db.getAllCreditApplys();
  var undoApplyList = creditApplyList['undo'];
  var waitingApplyList = creditApplyList['waiting'];
  var doneApplyList = creditApplyList['done'];
  var applyInfo = {};
  
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
    applyInfo.status = 'unProcess';
    
    unProcessed.push({ 
      id: applyInfo['applyId'],
      company: applyInfo['customerName'],
      date: applyInfo['date'],
      priority: applyInfo['priority'],
      status: applyInfo['status'],
      unread: applyInfo['unread']
    });
  }
  for (i in waitingApplyList) {
     applyInfo = waitingApplyList[i];
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
    
    processing.push({ 
      id: applyInfo['applyId'],
      company: applyInfo['customerName'],
      date: applyInfo['date'],
      priority: applyInfo['priority'],
      status: applyInfo['status'],
      unread: applyInfo['unread']
    });
  }
  for (i in doneApplyList) {
     applyInfo = doneApplyList[i];
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
      status: applyInfo['status'],
      unread: applyInfo['unread']
    });
  }
  data = {
    unProcessed: unProcessed,
    processing: processing,
    processed: processed
  };
  
  status = 'success';
  results = {
    status: status,
    data: data
  };
  
  jsonp_callback(results);
});