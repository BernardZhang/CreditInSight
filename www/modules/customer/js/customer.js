/**
  * (c) Copyright 2012 SAP AG. All rights reserved
  *
  * Summary: Provides client(customer) related script
  *
  * Dependency files: Jquery.js;Jquery.mobile.js;knockout.js;
  *
  */ 


/**
 * Initial function for Customer Credit Usage Query/Check
 */
$(document).delegate("#customer_credit_check", "pageinit", function() {
    function myCallBack(data){
        var viewModel = {};
        data = data.data;
        if(data){
          viewModel.creditUsageData=sap.creditManagement.viewModel.usageDiagram({
            creditUsed: parseInt(data.credit.used),
            creditLimit: parseInt(data.credit.total)
          });
          viewModel.orderListData=data.records;
        }
        else {
          viewModel.creditUsageData={creditLimit:0, creditUsed: 0};
          viewModel.orderListData={total:0,items:[]};
        }
        //this is necessary
        this.viewModel = viewModel;
    };        
    sap.creditManagement.sapcmrequest({
        url:sap.creditManagement.CONST_DATA.serviceUri.customer.getCustomerCreditInfo,
        success:myCallBack,//will be extended from the baseCallback.should extend from the basic callback function which includes - render translation/mapping/viewModel/applyBinding,so it should be a clear interface with the template
        data:{userId: sap.creditManagement.db.getCurrentUser().id, count: 5},//TODO remove count
        containerId:"customer_credit_check"
    });
});

/******************************************************* credit apply list **************************************/
$(document).delegate('#customer_credit_apply_list', 'pageinit', function() {
  function myCallBack(data){
    var viewModel = {};
    data = data.data;
    if(data){
      viewModel.applyList = data.history;
    } else {
      viewModel.applyList = {};
    }
    
    //this is necessary
    this.viewModel = viewModel;
  };
  sap.creditManagement.sapcmrequest({
    url:sap.creditManagement.CONST_DATA.serviceUri.customer.getCustomerApplyList,
    success:myCallBack,
    data:{userId: sap.creditManagement.db.getCurrentUser().id},
    containerId:"customer_credit_apply_list"
  });
});

$(document).delegate('#customer_credit_apply_detail', 'pageinit', function() {
  function myCallBack(data){
    var viewModel = {};
  
    data = data.data;
    if(data){
      data.applyInfo.orderInfo = data.applyInfo.orderInfo || {id:''};
      viewModel.applyInfoData = ko.observable(data.applyInfo);
      viewModel.usageDiagramData = sap.creditManagement.viewModel.usageDiagram({
        creditUsed: parseInt(data.amount.used), 
        creditLimit: parseInt(data.amount.total), 
        creditRequest: parseInt(data.applyInfo.amount),
        orderInfo: data.applyInfo.orderInfo, 
        status: data.applyInfo.status
      });
    } else {
      viewModel.applyInfoData = {};
      viewModel.usageDiagramData = {};
    }
  
    //this is necessary
    this.viewModel = viewModel;
  }
  
  sap.creditManagement.sapcmrequest({
    url:sap.creditManagement.CONST_DATA.serviceUri.customer.getCustomerApplyDetail,
    success:myCallBack,
    data:{applyId: sap.creditManagement.db.getLocationParams('customer-credit-apply-detail.html').applyId},
    containerId:"customer_credit_apply_detail"
  });
});

$(document).delegate('#customer_credit_apply_create', 'pageinit', function() {
  function myCallBack(data){
    var viewModel = {};

    data = data.data;
    if(data){
      viewModel.usageDiagramData = sap.creditManagement.viewModel.usageDiagram({
        creditUsed: parseInt(data.credit.used),
        creditLimit: parseInt(data.credit.total)
      });
      viewModel.unit = data.credit.unit;
    } 
    else {
      viewModel.usageDiagramData = {creditLimit:0, creditUsed: 0};
      viewModel.unit = 'CNY';
    }

    viewModel.commitCreditApply = function (data, event) {
      var viewModel = {};
      function successPost(data) {
        $.mobile.changePage('customer-credit-apply-list.html', {
          transition: 'slide',
          reverse: true
        });
      };
      
      var priority = $('#credit_apply_priority').val();
      var amount = $('#credit_apply_amount').val();
      var reason = $('#credit_apply_reason').val();
      var unit = $('#currency_unit').attr('data-unit');
      
      var params = {
        priority: priority,
        amount: amount,
        unit:unit,
        reason: reason
      };
      
      //validate form
      // if (!amount || !priority || !reason) {
        // msg = !amount ? 'Amount' : (!priority ? 'Priority' : 'Reason');
        // msg += ' can not be empty!';
        // sap.creditManagement.sapAlert(msg);
        // return false;
      // }
      var msg = sap.creditManagement.validate({priority: priority, amount: amount, reason: reason});
      if ('' !== msg) {
        sap.creditManagement.sapAlert(msg);
        return false;
      }
      
      sap.creditManagement.sapcmrequest({
        url:sap.creditManagement.CONST_DATA.serviceUri.customer.postCreditApply,
        success:successPost,
        data:params,
        type:"post",
        containerId:"justAjaxCall"
      });
      return false;
    };
    
    //this is necessary
    this.viewModel = viewModel;
  };
  
  sap.creditManagement.sapcmrequest({
    url: sap.creditManagement.CONST_DATA.serviceUri.customer.getCustomerCreditAmount,
    success:myCallBack,
    data:{userId: sap.creditManagement.db.getCurrentUser().id, count:5},
    containerId:"customer_credit_apply_create"
  });
});
