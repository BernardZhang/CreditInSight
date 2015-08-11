$(function () {
  var status = 'fail';
  var msg = '';
  var results = {};
  var db = sap.creditManagement.db;
  var params = db.getLocationParams('warning-customer-detail.html');
  var customerId = params.customerId;
  var warningCustomerInfo = db.getWarningCustomerById(customerId);
  var warningSummaryId = warningCustomerInfo.warningSummaryId;
  var warningSummaryInfo = db.getWarningSummaryById(warningSummaryId);
  
  data = {
    basicInfo: {
      warningDate: warningCustomerInfo['date'],
      customerName: warningCustomerInfo['name'],
      customerCode: warningCustomerInfo['customerCode'],
      companyCode: warningCustomerInfo['companyCode'],
      warningLevel: warningCustomerInfo['degree']
    },
    warningSummary: warningSummaryInfo
  };
  
  status = 'success';
  results = {
    message: '',
    status: status,
    data: data
  };
  jsonp_callback(results);
});