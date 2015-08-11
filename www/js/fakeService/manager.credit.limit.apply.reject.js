$(function () {
  var status = 'fail';
  var results = {};
  var requestData = sap.creditManagement.db.getRequest('manager.credit.limit.apply.reject.js');
  
  var applyId = requestData.applicationId;
  var rejectedReason = requestData.reason;
  requestData.status = sap.creditManagement.db.getLocationParams('credit-limit-approval-detail.html').status;
  switch (requestData.status) {
  case 'process':
    requestData.status = 'waiting';
    break;
  }
  var applyInfo = sap.creditManagement.db.getCreditApplyByApplyIdAndStatus(applyId, requestData.status);
  applyInfo.status = 'rejected';
  applyInfo.rejectedReason = rejectedReason;
  
  var unProcessedList = sap.creditManagement.db.getCreditApprovalListByStatus('undo');
  var processedList = sap.creditManagement.db.getCreditApprovalListByStatus('done');
  
  for (var i = 0; i < unProcessedList.length; i++) {
    if (unProcessedList[i].applyId === applyId) {
      processedList.push(applyInfo); // Add the submit apply record to the approvedList
      unProcessedList.splice(i, 1); // Remove the apply record from the unProcessedList
      break;
    }
  }
  
  //Update the credit applys in the localStorage
  var allApplys = sap.creditManagement.db.getAllCreditApplys();
  allApplys['waiting'] = unProcessedList;
  allApplys['done'] = processedList;
  sap.creditManagement.db.setAllCreditApplys(allApplys);
  
  results = {
    message: '',
    status: 'success'
  };
  
  jsonp_callback(results);
});