/**
  * (c) Copyright 2012 SAP AG. All rights reserved
  *
  * Summary: Provides client(sale) related script
  *
  * Dependency files: Jquery.js;Jquery.mobile.js;knockout.js;
  *
  * Author: Bernard Zhang
  */ 


/**
 * Initial function for Sale credit limit apply list
 */
$(document).delegate('#sale_credit_limit_apply_list', 'pageinit', function () {
  var serviceUri = sap.creditManagement.CONST_DATA.serviceUri;
  var db = sap.creditManagement.db;
  var const_status = sap.creditManagement.CONST_DATA.status;
 
  function myCallback(data) {
    var viewModel = {};
    viewModel.status = ko.observable(const_status.UNPROCESSED);
    data = data.data;
    
    if (data) {
      var unProcessed = data[const_status.UNPROCESSED];
      var processing = data[const_status.PROCESSING];
      var processed = data[const_status.PROCESSED];
      var creditLimitApplyList = [];
      
      var listTab = db.getListTab() ? db.getListTab() : const_status.UNPROCESSED;
      var db_status = (listTab === const_status.PROCESSED) ? '' : listTab;
      viewModel.status(db_status);
      
      viewModel.footerTabs = {
        listTab: ko.observable(listTab),  
        
        showUnProcessedList: function (evt) {
          viewModel.creditLimitApplyList(unProcessed);
          viewModel.footerTabs.listTab(const_status.UNPROCESSED);
          viewModel.status(const_status.UNPROCESSED);
          db.setListTab(const_status.UNPROCESSED);
        }, 
        showProcessingList: function (evt) {
          viewModel.creditLimitApplyList(processing);
          viewModel.footerTabs.listTab(const_status.PROCESSING);
          db.setListTab(const_status.PROCESSING);
          viewModel.status(const_status.PROCESSING);
        }, 
        showProcessedList: function (evt) {
          viewModel.creditLimitApplyList(processed);
          viewModel.footerTabs.listTab(const_status.PROCESSED);
          db.setListTab(const_status.PROCESSED);
          viewModel.status('');
        }
      };
      
      switch (viewModel.footerTabs.listTab()) {     // According to listTab to decide which list to show
      case const_status.UNPROCESSED:
        creditLimitApplyList = unProcessed;
        break;
      case const_status.PROCESSING:
        creditLimitApplyList = processing;
        break;
      case const_status.PROCESSED:
        creditLimitApplyList = processed;
        break;
      }
      viewModel.creditLimitApplyList = ko.observable(creditLimitApplyList);
    } 
    else {
      viewModel.creditLimitApplyList = [];
    }
    
    this.viewModel = viewModel;
  };        
  
  // Send ajax request
  sap.creditManagement.sapcmrequest({
    url: serviceUri.sales.getCreditLimitApplyList,
    success: myCallback,
    containerId: 'sale_credit_limit_apply_list'
  });
});

/**
 * Initial functoins for apply detail, order detail and new apply page
 * 
 * Binding data for the follow three pages and all the data need in html pages are from sale-credit-limit-detail.html page
 *    sale-credit-limit-detail.html:   The response data from this page contained the follow pages data
 *    sale_credit_limit_apply_page.html: Data from sale-credit-limit-detail.html page
 *    customer-unpaid-order-detail.html: Data from sale-credit-limit-detail.html page
 *        
 */
(function () {
  var viewModel = {}; // Credit limit application detail viewModel
  var serviceUri = sap.creditManagement.CONST_DATA.serviceUri;
  var db = sap.creditManagement.db;
  var applicationId;
  
  /**
   * Initial function for sale to view credit limit apply detail
   */
  $(document).delegate("#sale_credit_limit_apply_detail", "pageinit", function() {
    var requestData = db.getLocationParams('sale-credit-limit-apply-detail.html');
    applicationId = requestData.applicationId;
    var status = requestData.status;
    var url = '';   // service url, application detail url and application result url
    var data = {};
    var const_status = sap.creditManagement.CONST_DATA.status;
    
    // According to the application status to set the service url(detail/result)
    if (status !== const_status.REJECT && status !== const_status.APPROVE) {
      url = serviceUri.sales.getCreditLimitApplyDetail;
      data.id = applicationId;
    } 
    else {
      url = serviceUri.sales.getCreditLimitApplyResult;
      data.applicationId = applicationId;
    }
    
    /**
     * Get credit limit application detail info callback function
     */ 
    function myCallback(data) {
      data = data.data;
      
      /**
       * Initial the credit limit applicaiton detail viewModel with response data
       */
      if (data) {
        viewModel.status = status;
        viewModel.customerInfo = data.customerInfo;
        viewModel.applicationInfo = data.applicationInfo;
       
        viewModel.creditUsageData = sap.creditManagement.viewModel.usageDiagram({
          creditUsed : parseInt(data.amountUsage.used),
          creditLimit : parseInt(data.amountUsage.total),
          creditRequest : parseInt(data.applicationInfo.amount),
          unit: data.applicationInfo.unit,
          status : status === const_status.APPROVE ? status : ''  // According to status to choose usageDiagram type
        });
  
        if (data.records) {
          viewModel.records = { total: data.records.total, unit: data.records.unit, items: data.records.orderHistorys};
        } 
        else {
          viewModel.records = {total: 0, unit: '', items: []};
        }
      } 
      else {
        viewModel.customerInfo = {};  
        viewModel.applicationInfo = {};
        viewModel.creditUsageData = {};
        viewModel.records = {};
      }
     
      viewModel.onRejectApply = function (evt) {  
        sap.creditManagement.dialog({
         'title': 'Reject Application',
         'content': ' <textarea id="textarea_b" class="textarea-a" placeholder="'+sap.creditManagement.translate('Please input reject reason')+'"></textarea>',
         'buttons': {
           'Cancle': {
             'class': 'button-a',
             'action': function(){},// Nothing to do in this case. You can as well omit the action property.
             'text': sap.creditManagement.translate('Cancle')
          },
           'Send': {
             'class': 'button-b',
             'action': function(){
               //Add validation
               // if ('' === $('#textarea_b').val()) {
                 // sap.creditManagement.sapAlert('Reason can not be empty!', 'reject_dialog', function(){ return false; });
                 // return false;
               // }
               var msg = sap.creditManagement.validate({reason: $('#textarea_b').val()});
               if ('' !== msg) {
                 sap.creditManagement.sapAlert(msg, 'reject_dialog', function(){ return false; });
                 return false;
               }
               
               sap.creditManagement.sapcmrequest({
                url: serviceUri.sales.rejectCreditLimitApply,
                success: function () {sap.creditManagement.dialog.hide('dialog_reject');$.mobile.changePage('sale-credit-limit-apply-list.html', { transition: 'slide', reverse: true });}, 
                data: {applicationId: applicationId, reason: $('#dialogOverlay #textarea_b').val()},
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
    
    // Send ajax request for credit limit application detail info
    sap.creditManagement.sapcmrequest({
      url: url,
      success: myCallback,
      data: data,
      containerId: 'sale_credit_limit_apply_detail'
    });
  });
  
  /**
   * Initail function for new an applicaiton page
   */
  $(document).delegate('#sale_credit_limit_apply_page', 'pageinit', function () {
    var params = db.getLocationParams('sale-credit-limit-apply-page.html');
    
    var newViewModel = {
      priority: params.priority,
      amount: params.amount,
      reason: '',
      unit: params.unit,
      usageDiagramData: viewModel.creditUsageData
    };
   
    newViewModel.onSubmitApply = function () {
      var requestData = {
        applicationId: applicationId,
        reason: newViewModel.reason
      };
      
      //Add validation for apply reason
      var msg = sap.creditManagement.validate({reason: requestData.reason});
      if ('' !== msg) {
        sap.creditManagement.sapAlert(msg);
        return false; 
      }
      
      // Send ajax request for submit credit limit apply 
      sap.creditManagement.sapcmrequest({ 
        url: serviceUri.sales.submitCreditLimitApply,
        success: function () { $.mobile.changePage('sale-credit-limit-apply-list.html', { transition: 'slide', reverse: true});}, 
        data: requestData,
        type: 'post'
      });
    };
    newViewModel.afterRender = function (elements) {sap.creditManagement.renderTranslation(elements.parent);}
    ko.applyBindings(newViewModel, document.getElementById('sale_credit_limit_apply_page'));
  });
  
  
  /**
   * Initial function for order detail page 
   */
  $(document).delegate("#order_detail", "pageinit", function() {
    var params = db.getLocationParams('customer-unpaid-order-detail.html');
    var orderId = params.orderId;
    
    function myCallBack(data) {
      var orderDetailViewModel = {};
      data = data.data;
      
      orderDetailViewModel.params = {
        applicationId: applicationId,
        priority: viewModel.applicationInfo.priority,
        amount: viewModel.applicationInfo.amount,
        unit: viewModel.applicationInfo.unit,
        creditUsageData: viewModel.creditUsageData
      };
      
      if(data) {
        orderDetailViewModel.orderInfoData = {serialNo: data.orderInfo.orderId, amount: data.orderInfo.amount, status: data.orderInfo.status, date: data.orderInfo.date, unit: data.orderInfo.unit };
        orderDetailViewModel.collector = data.collector;
        orderDetailViewModel.collectionUsageData = data.collectionHistory;
        orderDetailViewModel.applicationStatus = db.getLocationParams('sale-credit-limit-apply-detail.html').status;
      } 
      else {
        orderDetailViewModel.orderInfoData = {serialNo: '', amount: 0, status: '', date: '', unit: '' };
        orderDetailViewModel.collector = {id: '', name: ''};
        orderDetailViewModel.collectionUsageData = [];
      }
      
      orderDetailViewModel.onRejectApply = viewModel.onRejectApply;
      orderDetailViewModel.onSubmitApply = viewModel.onSubmitApply;
      this.viewModel = orderDetailViewModel;
    }
    
    sap.creditManagement.sapcmrequest({
      url : serviceUri.sales.getUnpaidOrderDetail,
      success : myCallBack, //will be extended from the baseCallback.should extend from the basic callback function which includes - render translation/mapping/viewModel/applyBinding,so it should be a clear interface with the template
      data : {orderId: orderId},
      containerId : 'order_detail'
    });
    
  });
})();

/**
 * Initial function for  frozen orders 
 */
$(document).delegate('#sale_frozen_order_list', 'pageinit', function() {
  var serviceUri = sap.creditManagement.CONST_DATA.serviceUri;
  var db = sap.creditManagement.db;
  
  function myCallback(data) {
    var viewModel = {};
    var const_status = sap.creditManagement.CONST_DATA.status;
    
    viewModel.status = ko.observable(const_status.UNPROCESSED);
    data = data.data;
    
    if (data) {
      var unProcessed = data[const_status.UNPROCESSED];
      var processing = data[const_status.PROCESSING];
      var processed = data[const_status.PROCESSED];
      var frozenOrderList = [];
      
      var listTab = db.getListTab() ? db.getListTab() : const_status.UNPROCESSED;
      var db_status = (listTab === const_status.PROCESSED) ? '' : listTab;
      
      viewModel.status(db_status);
      viewModel.footerTabs = {
        listTab: ko.observable(listTab),  
        
        showUnProcessedList: function (evt) {
          viewModel.frozenOrderList(unProcessed);
          viewModel.footerTabs.listTab(const_status.UNPROCESSED);
          db.setListTab(const_status.UNPROCESSED);   // Save listTab in localStorage in order to back to this listTab content
          viewModel.status(const_status.UNPROCESSED);
        }, 
        showProcessingList: function (evt) {
          viewModel.frozenOrderList(processing);
          viewModel.footerTabs.listTab(const_status.PROCESSING);
          db.setListTab(const_status.PROCESSING);
          viewModel.status(const_status.PROCESSING);
        }, 
        showProcessedList: function (evt) {
          viewModel.frozenOrderList(processed);
          viewModel.footerTabs.listTab(const_status.PROCESSED);
          db.setListTab(const_status.PROCESSED);
          viewModel.status('');
        },
        clearListTab: function (evt) {  // Clear listTab: Make first access list page to show unProcessedList
          db.setListTab('');
          $.mobile.changePage('index.html', { transition: 'slide', reverse: true});
        }
      };
      
      switch (viewModel.footerTabs.listTab()) {
      case '':  
      case const_status.UNPROCESSED:
        frozenOrderList = unProcessed;
        break;
      case const_status.PROCESSING:
        frozenOrderList = processing;
        break;
      case const_status.PROCESSED:
        frozenOrderList = processed;
        break;
      }
      viewModel.frozenOrderList = ko.observable(frozenOrderList);
    } 
    else {
      viewModel.frozenOrderList = [];
    }
    
    this.viewModel = viewModel;
  };        
  
  // Send ajax request
  sap.creditManagement.sapcmrequest({
    url: serviceUri.sales.getFrozenOrderList,
    success: myCallback,
    containerId: 'sale_frozen_order_list'
  });
});

/**
 * Initial function for frozen order detail, order product list and new apply page
 *
 *  Binding data for the follow three pages and all the data need in html pages are from sale-credit-limit-detail.html page
 *    sale-frozen-order-detail.html:   The response data from this page contained the follow pages data
 *    sale-credit-limit-apply-new.html: Data from sale-credit-limit-detail.html page
 *    sale-order-product-list.html: Data from sale-credit-limit-detail.html page
 */
(function () {
  var viewModel = {}; // Credit limit application detail viewModel
  var serviceUri = sap.creditManagement.CONST_DATA.serviceUri;
  var db = sap.creditManagement.db;
  
  /**
   * Initial function for frozen order detail
   * 
   * Frozen order detail and frozen order apply result use the common viewModel with a little different as follow:
   *  orderInfo: Frozen order detail with this data
   *  applicationInfo: Frozen order apply result with this data 
   * 
   */
  $(document).delegate('#sale_frozen_order_detail', 'pageinit', function () {
    var requestData = db.getLocationParams('sale-frozen-order-detail.html');
    var orderId = requestData.orderId;
    var status = requestData.status;
    var url = '';
    var const_status = sap.creditManagement.CONST_DATA.status;
    
    if (status !== const_status.REJECT && status !== const_status.APPROVE) { // According to the application status to set the service url(detail/result)
      url = serviceUri.sales.getFrozenOrderDetail;
    } 
    else {
      url = serviceUri.sales.getFrozenOrderResult;
    }
    function myCallback(data) {
      data = data.data;
      
      if (data) { 
        viewModel.customerInfo = data.customerInfo;  
        viewModel.status = status;
        
        if (data.orderInfo) { // From frozen order detail response data
          // Compute the application limit about frozen order. (orderAmount + usedLimit - currentCreditLimit)
          data.amountUsage.applied = (data.orderInfo.amount + data.amountUsage.used - data.amountUsage.total).toFixed(2); 
          viewModel.orderInfo = data.orderInfo;
        } 
        else {
          viewModel.orderInfo = {date: '', displayId: '', amount: '', id: '', status: '', priority: '', expectedProfit: '', unit: ''};
        }
        
        if (data.applicationInfo) { // From frozen order apply result response data
          viewModel.applicationInfo = data.applicationInfo;
        } 
        else {
          viewModel.applicationInfo = {date: '', orderId: '', displayOrderId: '', priority: '', applied: '', status: '', reason: '', processSuggestion: '', unit: ''};
        }
        viewModel.creditUsageData = sap.creditManagement.viewModel.usageDiagram({
          creditUsed : parseInt(data.amountUsage.used),
          creditLimit : parseInt(data.amountUsage.total ? data.amountUsage.total : data.amountUsage.currentLimit), // detail || result
          orderInfo : data.orderInfo ? data.orderInfo : { id: data.applicationInfo.orderId, amount: data.amountUsage.orderAmount}, //detail || result
          creditRequest : data.amountUsage.applied,
          unit: viewModel.orderInfo.unit ? viewModel.orderInfo.unit : viewModel.applicationInfo.unit, // order detail unit || apply result unit
          status : status == const_status.APPROVE ? status : '' //according to the status set the different diagram
        });
      } 
      else {
        viewModel.customerInfo = {};  
        viewModel.orderInfo = {};
        viewModel.applicationInfo = {};
        viewModel.creditUsageData = {};
      }

      viewModel.onRejectApply = function (evt) {  
        sap.creditManagement.dialog({
         'title': 'Reject Application',
         'content': ' <textarea id="textarea_b" class="textarea-a" placeholder="'+sap.creditManagement.translate('Please input reject reason')+'"></textarea>',
         'buttons': {
           'Cancle': {
             'class': 'button-a',
             'action': function(){},// Nothing to do in this case. You can as well omit the action property.
             'text': sap.creditManagement.translate('Cancle')
           },
           'Send': {
             'class': 'button-b',
             'action': function(){
               //Add validation
               var msg = sap.creditManagement.validate({reason: $('#textarea_b').val()});
               if ('' !== msg) {
                 sap.creditManagement.sapAlert(msg, 'reject_dialog', function(){ return false; });
                 return false;
               }
               
               sap.creditManagement.sapcmrequest({
                 url: serviceUri.sales.rejectFrozenOrderApply,
                 success: function () {sap.creditManagement.dialog.hide('dialog_reject');$.mobile.changePage('sale-frozen-order-list.html', { transition: 'slide', reverse: true});}, 
                 data: {orderId: orderId, reason: $('#dialogOverlay #textarea_b').val()},
                 type: 'post'
              });
             },
             'text': sap.creditManagement.translate('Send')
           }
         }
        });
      };
      
      viewModel.afterRender = function (elements) {
        sap.creditManagement.renderTranslation(elements.parent);  // This afterRender function be used to translate pages which not send ajax request.
      };
      this.viewModel = viewModel;
    }
    
    // Send ajax request
    sap.creditManagement.sapcmrequest({
      url: url,
      success: myCallback,
      data: {orderId: orderId},
      containerId: 'sale_frozen_order_detail'
    });
  });

  /**
   * Initail function for new an applicaiton page
   */
  $(document).delegate('#sale_credit_limit_apply_new', 'pageinit', function () {
    var serviceUri = sap.creditManagement.CONST_DATA.serviceUri;
    var params = sap.creditManagement.db.getLocationParams('sale-credit-limit-apply-new.html');
    var newViewModel = {
      priority: params.priority,
      amount: params.amount,
      reason: '',
      unit: 'CNY',
    };
   
    newViewModel.onSubmitApply = function () {
      var requestData = {
        orderId: params.orderId,
        priority: newViewModel.priority,
        amount: newViewModel.amount,
        reason: newViewModel.reason,
        unit: newViewModel.unit
      };
      
      // Add validation
      // var msg = ''; 
      // if (!requestData.priority || !requestData.amount || !requestData.reason) {
        // msg = !requestData.priority ? 'Priority' : (!requestData.amount ? 'Amount' : 'Reason');
        // msg += ' can not be empty!';
        // sap.creditManagement.sapAlert(msg);
        // return false;
      // }
      var msg = sap.creditManagement.validate({priority: requestData.priority, amount: requestData.amount, reason: requestData.reason}); 
      if ('' !== msg) {
        sap.creditManagement.sapAlert(msg);
        return false;
      }
      
      // Send ajax request for submit frozen order apply 
      sap.creditManagement.sapcmrequest({ 
        url: serviceUri.sales.submitFrozenOrderApply,
        success: function () { $.mobile.changePage('sale-frozen-order-list.html',  { transition: 'slide', reverse: true }); }, 
        data: requestData,
        type: 'post'
      });
    }
    newViewModel.afterRender = viewModel.afterRender;
    ko.applyBindings(newViewModel, document.getElementById('sale_credit_limit_apply_new'));
  });

  /**
   * Initial function for products of the order
   */
  $(document).delegate('#sale_order_product_list', 'pageinit', function () {  
    var productsViewModel = {};
    productsViewModel.productList = viewModel.orderInfo.details;
    productsViewModel.afterRender = viewModel.afterRender;
    productsViewModel.onRejectApply = viewModel.onRejectApply;
    productsViewModel.onSubmitApply = viewModel.onSubmitApply;
    
    productsViewModel.id = viewModel.orderInfo.id;
    productsViewModel.priority = viewModel.orderInfo.priority;
    productsViewModel.amount = viewModel.orderInfo.amount;
    productsViewModel.status = db.getLocationParams('sale-frozen-order-detail.html').status;
    ko.applyBindings(productsViewModel, document.getElementById('sale_order_product_list'));
  });

})();



