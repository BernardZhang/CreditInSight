$(function() {
  var status = 'fail';
  var message = '';
  var data = {};
  var results = {};
  var db_unProcessed = sap.creditManagement.db.getCreditApprovalListByStatus('undo');
  var db_processed = sap.creditManagement.db.getCreditApprovalListByStatus('done');
  var unProcessed = [];
  var processed = [];
  var applyInfo;
  var applyStatus = 'process', priority = 'normal';
  
  for (i in db_unProcessed) {
    applyInfo = db_unProcessed[i];
    
    switch (applyInfo['status']) {
    case 'waiting':
      applyStatus = 'process';
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
    unProcessed.push({ //id:123,company:苏宁电器，date:2012-07-12,priority:紧急
      id: applyInfo['applyId'],
      company: applyInfo['customerName'],
      date: applyInfo['date'],
      status: applyStatus,
      priority: priority,
      unread: applyInfo['unread']
    });
  }
  for (i in db_processed) {
    applyInfo = db_processed[i];
    //reject/process/approve
    switch (applyInfo['status']) {
      case 'approved':
        applyStatus = 'approve';
        break;
      case 'rejected':
        applyStatus = 'reject';
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
    processed.push({ //id:123,company:苏宁电器，date:2012-07-12,priority:紧急
      id: applyInfo['applyId'],
      company: applyInfo['customerName'],
      date: applyInfo['date'],
      status: applyStatus,
      priority: priority,
      unread: true
    });
  }
  status = 'success';
  data = {
      unProcessed: unProcessed,
      processed: processed
  };
  results = {
    message: '',
    status: status,
    data: data
  };
  
  jsonp_callback(results);
});