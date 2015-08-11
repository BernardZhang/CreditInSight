$(function () {
  var status = 'fail';
  var data = {};
  var results = {};
  
  var warningId = sap.creditManagement.db.getLocationParams('friendship-remind-detail.html').warningId;
  var warningRecord = sap.creditManagement.db.getWarningRecordById(warningId);
  var customerId = warningRecord.customerId;
  var warningCustomerInfo = sap.creditManagement.db.getWarningCustomerById(customerId);
  var customerInfo = sap.creditManagement.db.getCustomerById(customerId);
  var basicInfo = {
    warningDate: warningRecord.date,
    customerName: warningCustomerInfo.name,
    customerCode: warningCustomerInfo.customerCode,
    companyCode: warningCustomerInfo.companyCode,
    warningLevel: warningRecord.level
  };
  console.log(basicInfo);
  var warningReason = warningCustomerInfo.warningReason;
  
  var result;
  if (warningRecord.action === 'frozen') {
    result = '客户主数据已冻结，无法进行交易';
  }
  else {
    result = {
      usedLimit: customerInfo.creditUsed,
      beforeAdjust: customerInfo.beforeAdjust,
      afterAdjust: customerInfo.creditLimit,
      unit: customerInfo.unit
    }
    console.log('result---->');
    console.log(result);
  }
  var processResult = {
    action: warningRecord.action,
    result: result
  };
  console.log(processResult);
  status = 'success';
  results = {
    message: '',
    status: status,
    data: {
      basicInfo: basicInfo,
      warningReason: warningReason,
      processResult: processResult
    }
  };
  jsonp_callback(results);
  console.log(results);       
});
