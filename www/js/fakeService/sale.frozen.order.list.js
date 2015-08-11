$(function(){
  var status = 'fail';
  var msg = '';
  var data = {};
  var results = {};
  
 
  var unProcessed = [];
  var processing = [];
  var processed = [];
  
  var frozenOrderList = sap.creditManagement.db.getAllFrozenOrders();
  var undoOrderList = frozenOrderList['undo'];
  var waitOrderList = frozenOrderList['waiting'];
  var doneOrderList = frozenOrderList['done'];
  var frozenOrderInfo = {};
  for (i in undoOrderList) {
    frozenOrderInfo = undoOrderList[i];
    //priority: high,normal,low
    switch (frozenOrderInfo['applyPriority']) {
    case 'h':
    case 'high':
      frozenOrderInfo.applyPriority = 'high';
      break;
    case 'n':
    case 'normal':
      frozenOrderInfo.applyPriority = 'normal';
      break;
    case 'l':
    case 'low':
      frozenOrderInfo.applyPriority = 'low';
      break;
    } 
    frozenOrderInfo.applyStatus = 'unProcess';
    
    unProcessed.push({ //{orderId:123,displayOrderId:S010101,date:2012-07-12,priority:紧急，status:status,unread:true}
      orderId: frozenOrderInfo['orderId'],
      displayOrderId: frozenOrderInfo['orderId'],
      date: frozenOrderInfo['applyDate'],
      priority: frozenOrderInfo['applyPriority'],
      status: frozenOrderInfo['applyStatus'],
      unread: frozenOrderInfo['unread']
    });
  }
  for (i in waitOrderList) {
     frozenOrderInfo = waitOrderList[i];
    //priority: high,normal,low
     switch (frozenOrderInfo['applyPriority']) {
    case 'h':
    case 'high':
      frozenOrderInfo.applyPriority = 'high';
      break;
    case 'n':
    case 'normal':
      frozenOrderInfo.applyPriority = 'normal';
      break;
    case 'l':
    case 'low':
      frozenOrderInfo.applyPriority = 'low';
      break;
    } 
    frozenOrderInfo.applyStatus = 'process';
    
    processing.push({ 
      orderId: frozenOrderInfo['orderId'],
      displayOrderId: frozenOrderInfo['orderId'],
      date: frozenOrderInfo['applyDate'],
      priority: frozenOrderInfo['applyPriority'],
      status: frozenOrderInfo['applyStatus'],
      unread: frozenOrderInfo['unread']
    });
  }
  for (i in doneOrderList) {
     frozenOrderInfo = doneOrderList[i];
    //priority: high,normal,low
    switch (frozenOrderInfo['applyPriority']) {
    case 'h':
    case 'high':
      frozenOrderInfo.applyPriority = 'high';
      break;
    case 'n':
    case 'normal':
      frozenOrderInfo.applyPriority = 'normal';
      break;f
    case 'l':
    case 'low':
      frozenOrderInfo.applyPriority = 'low';
      break;
    } 
    switch (frozenOrderInfo.applyStatus) {
    case 'rejected':
      frozenOrderInfo.applyStatus = 'reject';
      break;
    case 'approved':
      frozenOrderInfo.applyStatus = 'approve';
      break;
    }
    
    processed.push({ 
      orderId: frozenOrderInfo['orderId'],
      displayOrderId: frozenOrderInfo['orderId'],
      date: frozenOrderInfo['applyDate'],
      priority: frozenOrderInfo['applyPriority'],
      status: frozenOrderInfo['applyStatus'],
      unread: frozenOrderInfo['unread']
    });
  }
  data = {
    unProcessed: unProcessed,
    processing: processing,
    processed: processed
  };
  status = 'success';
  results = {
    message: msg,
    status: status,
    data: data
  };
  
  jsonp_callback(results);
});