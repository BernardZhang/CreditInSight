/**
  * (c) Copyright 2012 SAP AG. All rights reserved
  *
  * Summary: Provides client(manager) related script
  *
  * Dependency files: Jquery.js;Jquery.mobile.js;knockout.js;
  *
  * Author: Bernard Zhang
  */ 

/**
 * Initial function for credit approve 
 */
$(document).delegate("#credit_limit_approval_list", "pageinit", function() {
  var db = sap.creditManagement.db;
  
  function myCallBack(data) {
    var _this = this;
    var listTab = listTab = db.getListTab() ? db.getListTab() : 'unProcessed';;
    var viewModel = {};
    data = data.data;
    
    if(data){
      var unProcessedApprovelList = data.unProcessed;
      var processedApprovelList = data.processed;
      var creditLimitApprovalList = [];
      
      viewModel.listTab = ko.observable(listTab);
      if (listTab === 'unProcessed') {
        creditLimitApprovalList = unProcessedApprovelList;
      } 
      else if (listTab === 'processed') {
        creditLimitApprovalList = processedApprovelList;
      }
      viewModel.creditLimitApprovalList = ko.observable(creditLimitApprovalList);
    } 
    else {
      viewModel.creditLimitApprovalList = [];
    }
    viewModel.clearTab = function () {
      db.setListTab('');
      $.mobile.changePage('index.html', { transition: 'slide', reverse: true });
    };
    
    //this is necessary
    this.viewModel = viewModel;
    
    //Add click event to the tabs in the footer
    $('#footer ul.status span').bind('vclick', function (evt) {
      if ($(this).attr('id') === 'footer_tab_processed') {
        creditLimitApprovalList = processedApprovelList;
        listTab = 'processed';
      } 
      else if ($(this).attr('id') === 'footer_tab_unprocessed') {
        creditLimitApprovalList = unProcessedApprovelList;
        listTab = 'unProcessed';
      }
      _this.viewModel.creditLimitApprovalList(creditLimitApprovalList);
      _this.viewModel.listTab(listTab);
      db.setListTab(listTab);
    });
  }
  
  sap.creditManagement.sapcmrequest({
    url: sap.creditManagement.CONST_DATA.serviceUri.manager.getCreditLimitApprovalList,
    success: myCallBack,//will be extended from the baseCallback.should extend from the basic callback function which includes - render translation/mapping/viewModel/applyBinding,so it should be a clear interface with the template
    containerId: 'credit_limit_approval_list'
  });
});


/**
 * Initial function for credit limit approve detail
 */
$(document).delegate('#credit_limit_apply_detail', 'pageinit', function() {
  var serviceUri = sap.creditManagement.CONST_DATA.serviceUri;
  var db = sap.creditManagement.db;
  var requestData = db.getLocationParams('credit-limit-approval-detail.html');
  var status = requestData.status;
  
  var url = '';
  if (status !== 'process') { // According to the application status to set the service url(detail/result)
    url = serviceUri.manager.getCreditLimitApplyResult;
  } 
  else {
    url = serviceUri.manager.getCreditLimitApplyDetail;
  }
  
  function myCallBack(data) {
    var viewModel = {};
    data = data.data;
    
    if(data){
      data.applicationInfo.status = data.applicationInfo.status ? data.applicationInfo.status : 'process';
      viewModel.applicationInfo = data.applicationInfo;
      viewModel.customerInfo = data.customerInfo;
      viewModel.creditUsageData = sap.creditManagement.viewModel.usageDiagram({
        creditUsed : parseInt(data.amountUsage.used),
        creditLimit : parseInt(data.amountUsage.total),
        creditRequest : parseInt(data.applicationInfo.amount),
        unit: data.applicationInfo.unit,
        status : data.applicationInfo.status === 'approve' ? data.applicationInfo.status : ''  // According to status to choose usageDiagram type
      });
    }
    else {
      viewModel.applicationInfo = {};
      viewModel.customerInfo = {};
      viewModel.amountUsage = {};
    }
    
    viewModel.onSubmitApply = function (event) {
      sap.creditManagement.sapcmrequest({
        url: serviceUri.manager.approveCreditLimitApply,
        success: function () {$.mobile.changePage('credit-limit-approval-list.html', {transition: 'slide', reverse: true});},
        data: {applicationId: requestData.applicationId}
      });
    };
    viewModel.onRejectApply = function () {
      sap.creditManagement.dialog({
       'title': 'Reject Application',
       'content': ' <textarea id="textarea_b" class="textarea-a" placeholder="'+sap.creditManagement.translate('Please input reject reason')+'"></textarea>',
       'buttons': {
         'Cancle': {
           'class': 'button-a',
           'action': function() {},
           'text': sap.creditManagement.translate('Cancle')
         },
         'Send': {
           'class': 'button-b',
           'action': function(){
             var data = {
                applicationId: requestData.applicationId,
                userId: db.getCurrentUser().id,
                reason: $('#dialogOverlay #textarea_b').val(),
             };
             //Add validation
             var msg = sap.creditManagement.validate({reason: data.reason});
             if (msg) {
               sap.creditManagement.sapAlert(msg, 'reject_dialog', function(){ return false; });
               return false;
             }
             // if (!data.reason) {
               // sap.creditManagement.sapAlert('Reason can not be empty!', 'reject_dialog', function(){ return false; });
               // return false;
             // }
             sap.creditManagement.sapcmrequest({ 
               url: serviceUri.manager.rejectCreditLimitApply,
               success: function () { $.mobile.changePage('credit-limit-approval-list.html', {transition: 'slide', reverse: true}); },
               data: data,
               type: 'post'
             });
           },
           'text': sap.creditManagement.translate('Send')
         }
       }
      });
    };
  
    this.viewModel = viewModel;
  }
  
  sap.creditManagement.sapcmrequest({
    url: url,
    success: myCallBack,//will be extended from the baseCallback.should extend from the basic callback function which includes - render translation/mapping/viewModel/applyBinding,so it should be a clear interface with the template
    data: {applicationId: requestData.applicationId},
    containerId: 'credit_limit_apply_detail'
  });
});

/**
 * Initial function for reduce credit limit page
 */
$(document).delegate('#manager_reduce_credit_limit', 'pageinit', function () {
  var serviceUri = sap.creditManagement.CONST_DATA.serviceUri;
  var db = sap.creditManagement.db;
  var params = db.get('manager-reduce-credit-limit.html');
  var customerId = params.customerId;
  var customerName = params.customerName;
  
  function callback(data) {
    var viewModel = {};
    var limit = 0; 
    data = data.data;
    
    if (data) {
      console.log(data);
      viewModel.creditUsageData = {
        creditUsed: data.used,
        creditLimit: data.limit,
        unit: data.unit,
        customerName: customerName
      };
      
      limit = viewModel.creditUsageData.creditLimit;
      viewModel.onConfirm = function() {
        // Add validation about limit, limit should between creditUsed and creditLimit after reduce credit limit
        if (limit < data.used || limit > data.limit) {
          sap.creditManagement.sapAlert('The range of limit should between used limit and current limit!');
          return false;
        }
        sap.creditManagement.sapcmrequest({
          url: serviceUri.manager.reduceCreditLimitConfirm,
          success: function () { $.mobile.changePage('warning-customer-list.html', {transition: 'slide', reverse: true});},
          data: {limit: limit, customerId: customerId},
          type: 'post'
        });
      };
      
      /* =======Slider section start ==== */
      var is_clicked = 0;
      var s_mouseX;
      var e_mouseX;
      var lineX;
      var circleX;
      var smallCircleX;
      var textX;
      var textInLeft = 0; // Wether changed limit text is in the left side of the slider line
      var totalWidth;
      var docWidth;
      var minusAmount = 0;
      var creditLimit;
      var moveDistance = 0;
      var sliderLowLimit;
      var sliderHightLimit;
      
      function getElementsRightPostion() {
        lineX = $('.slider-line').css('right');
        circleX = $('.circle').css('right');
        smallCircleX = $('.small-circle').css('right');
        textX = $('.text').css('right');
      }
      
      function setElementsRightPostion() {
        $('.slider-line').css('right', parseInt(lineX) + parseInt(moveDistance));
        $('.circle').css('right', parseInt(circleX) + parseInt(moveDistance));
        $('.small-circle').css('right', parseInt(smallCircleX) + parseInt(moveDistance));
      }
      
      function sliderInit(pageX) {
        s_mouseX = document.width - pageX;
        e_mouseX = s_mouseX;
        totalWidth = parseInt($('.rec-a').css('width'));
        docWidth = document.width||document.body.clientWidth;
        creditLimit = viewModel.creditUsageData.creditLimit;
        getElementsRightPostion();
      }
      
      function computeMoveableArea() {
        var progressBarPadding = creditManagement.getNumberInStr($('.progress-bar').css('padding-left'));
        var progressBarBorder = creditManagement.getNumberInStr($('.rec-a').css('border'));
        var usedLimitWidth = parseInt($('.rec-b').width());
        sliderLowLimit = docWidth - progressBarPadding - progressBarBorder - usedLimitWidth;
        sliderHightLimit = creditManagement.getNumberInStr($('.progress-bar').css('padding-right')) - progressBarBorder;
      }
      
      function setTextPostion(pageX) {
        var textPos;  // The right position of the changed limit text 
        getElementsRightPostion();
        
        if (pageX < 60) { // When left distance < 60, move the limit text to the right side of the slider line
          textPos = parseInt(circleX) + parseInt(moveDistance) - 50;
          textInLeft = 1; // Right side of the slider line
        } 
        else {
          if (textInLeft) {
            textPos = parseInt(circleX) + parseInt(moveDistance) + 40;
            textInLeft = 0;
          }
          else {
            textPos = parseInt(textX) + parseInt(moveDistance);
          }
        }
        $('.text').css('right', textPos);
      }
      
      function updateLimit() {
        minusAmount = (moveDistance / totalWidth) * creditLimit;
        limit = Math.round(limit - minusAmount);
        $('.text span:first-child').html(limit);
        s_mouseX = e_mouseX;
      }
      
      function setElementsPostion(pageX) {
        e_mouseX = docWidth - pageX;
        moveDistance = parseInt(e_mouseX) - parseInt(s_mouseX);
        getElementsRightPostion();
        setElementsRightPostion();
        computeMoveableArea();
        var sliderLineX = creditManagement.getNumberInStr($('.slider-line').css('right'));
        
        if (sliderLineX < sliderLowLimit && sliderLineX > sliderHightLimit) {
          setTextPostion(pageX);
        }
        else {
          is_clicked = 0;
          console.log('Can not move now!');
        }
      }
      
      // Bind events
      $('#changeLimit').bind('vmousedown', function (event) {
        is_clicked = 1;
        sliderInit(event.pageX);
      }).bind('vmousdeup', function () {
        is_clicked = 0;
        updateLimit();
      });
      
      $(document).bind('vmousemove', function (event) {
        if (1 === is_clicked) {
          setElementsPostion(event.pageX);
          updateLimit();
        }
      }).bind('vmouseup', function(event) {
        if (1 === is_clicked) {
          is_clicked = 0;
          updateLimit();
        }
      });
      /* ====Slider section end ==== */
    }
    else {
      viewModel.creditUsageData = {};
    }
    this.viewModel = viewModel;
  };
  
  sap.creditManagement.sapcmrequest({
    url: serviceUri.manager.getWarningCustomerInfo,
    success: callback,
    data: {customerId: customerId},
    containerId: 'manager_reduce_credit_limit'
  });
});
