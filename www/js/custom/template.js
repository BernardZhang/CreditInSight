/**
  * (c) Copyright 2012 SAP AG. All rights reserved
  *
  * Summary: Provides reusable functions for templates
  *
  * Dependency files: Jquery.js;knockout.js
  *
  */
// Common templates dir
infuser.defaults.templateUrl = "../../templates";

/**
 * Generate view model for diagram.
 * For example: 
 *  var viewModel = sap.creditManagement.viewModel.usageDiagram({
 *    creditUsed: 4000,//required int
 *    creditLimit: 5000,//required int
 *    creditRequest: 1000,//required int
 *    status: 'approve',//optional string. Default: process. include values: process, approve, reject.
 *    orderInfo: {//object optional. if the "orderIno" field exists means: this is requested for frozen order.
 *      id: 'S000912',//order id
 *      amount: '6000'//order amount
 *    }
 *  });
 */
(function(){
  sap.creditManagement.viewModel = sap.creditManagement.viewModel || {};
  var viewModel = sap.creditManagement.viewModel;
  
  viewModel.usageDiagram = function(objData) {
    var viewmodel = {};
    this.creditUsed = objData.creditUsed?objData.creditUsed:0;
    this.creditLimit = objData.creditLimit?objData.creditLimit:0;
    this.creditRequest = objData.creditRequest?objData.creditRequest:0;
    this.status = objData.status?objData.status:'process';
    this.unit = objData.unit ? objData.unit : 'CNY';
    
    if (objData.orderInfo && objData.orderInfo.id && objData.orderInfo.amount) {
      //frozen 
      this.orderInfo = objData.orderInfo;//{id: 'S009913', amount: '6000'}
      this.orderAmount = this.orderInfo.amount;
      this.orderId = this.orderInfo.id;
      this.frozenOrder = true;
    } 
    else {
      this.orderInfo = {};
      this.orderAmount = 0;
      this.orderId = '';
      this.frozenOrder = false;
    }
    
    /**
     * get the type of usage diagram.
     * @return type string. 
     * Return value enumerate:
     *  - usage-diagram, 
     *  - approve-usage-diagram,
     *  - frozen-usage-diagram,
     *  - approve-frozen-usage-diagram
     */
    this.getType = function() {
      var type = '';
      
      if (this.status === 'approve') {
        type +='approve-';
      }
      if (this.frozenOrder === true) {
        type +='frozen-';
      }
      
      type += 'usage-diagram';
      return type;
    };
    
    /**
     * Get frozen usage diagram percents.
     * Used for frozen usage diagram.
     * @return {
     *  creditLimit: '',
     *  creditUsed: '',
     *  bar1: '', //the width percent of first bar
     *  bar2: '', //the width percent of second bar
     * }
     */
    this.getFrozenUsageDiagramPercents = function () {
      var percentages = {};
      var creditAdjustLimit = parseInt(this.creditLimit) + parseInt(this.creditRequest);
      var creditCostsAmount = parseInt(this.creditUsed) + parseInt(this.orderAmount);
      var percentageCreditLimit = Math.round(100*this.creditLimit/creditAdjustLimit);
      var percentageCreditUsed = Math.round(100*this.creditUsed/creditCostsAmount);
      
      percentages.creditLimit = percentageCreditLimit;
      percentages.creditUsed = percentageCreditUsed;
      
      if (creditAdjustLimit > creditCostsAmount) {
        percentages.bar1 = 100; 
        percentages.bar2 = Math.round(100*creditCostsAmount/creditAdjustLimit);
      } 
      else {
        percentages.bar1 = Math.round(100*creditAdjustLimit/creditCostsAmount);
        percentages.bar2 = 100;
      }
      return percentages;
    };
    
    //init view model
    viewmodel = {
        diagramType: this.getType(),
        creditUsed: this.creditUsed, 
        creditLimit: this.creditLimit, 
        creditRequest: this.creditRequest,
        orderAmount: 0,
        unit: this.unit,
        frozenUsagePercents: {}
    };
    
    if (this.frozenOrder) {
      viewmodel.orderAmount = this.orderAmount;
      viewmodel.frozenUsagePercents = this.getFrozenUsageDiagramPercents();
    }
    return viewmodel;
  };

}());

// Bind homepage
$(document).delegate("#common_homepage", "pagebeforeshow", function() {
  var uri = sap.creditManagement.CONST_DATA.serviceUri,
      role = sap.creditManagement.db.getCurrentUserRole().toLowerCase(),
      roleName = '',
      myCallBack,
      url;
  
  sap.creditManagement.db.setListTab(''); // Fixed the listTab bug to ensure show unProcessed list when from home page to any other list page
  switch(role) {
    case 'customer':
      roleName = sap.creditManagement.translate('Customer');
      url = uri.customer.getCustomerApplicationNotification;
      myCallBack = customerNotificationCallBack;
      break;
    case 'sale':
      roleName = sap.creditManagement.translate('Sale');
      url = uri.sales.getSaleApplicationNotification;
      myCallBack = saleNotificationCallBack;
      break;
    case 'manager':
      roleName = sap.creditManagement.translate('Manager');
      url = uri.manager.getManagerNotification;
      myCallBack = managerNotificationCallBack;
      break;
    case 'collector':
      roleName = sap.creditManagement.translate('Collector');
      break;
    case 'admin':
      roleName = sap.creditManagement.translate('Admin');
      break;
    default:
      roleName = '';
      break;
  }
  if (url) {
    sap.creditManagement.sapcmrequest({
        url:url,
        success:myCallBack,//will be extended from the baseCallback.should extend from the basic callback function which includes - render translation/mapping/viewModel/applyBinding,so it should be a clear interface with the template
        data:{token: sap.creditManagement.db.getSecurId()},
        containerId:"common_homepage"
    });
  }
  
  function customerNotificationCallBack(data) {
    var viewModel = {},
        applicationCount = 0,
        creditChangeCount = 0;
     
    data = data.data;
    
    if(data){
      applicationCount = data.applicationCount;
      creditChangeCount = data.creditChangeCount;
    }
    viewModel.roleName = roleName;
    viewModel.applicationCount = applicationCount;
    viewModel.creditChangeCount = creditChangeCount;
    //this is necessary
    this.viewModel = viewModel;
  };
  
   /**
   * Sale notification callback function
   */ 
  function saleNotificationCallBack(data) {
    var viewModel = {};
    var count = {application: 0, frozenOrderApplication: 0, warningCustomers: 0, creditChange: 0};
    data = data.data;
    
    if(data){
      count['application'] = data.applicationCount;
      count['frozenOrderApplication'] = data.frozenOrderApplicationCount;
      count['warningCustomers'] = data.warningCustomersCount;
      count['creditChange'] = data.creditChangeCount;
    }
    
    viewModel.roleName = roleName;
    viewModel.count = count;
    this.viewModel = viewModel;
  };
  
  /**
   * Manager notification callback function
   */
  function managerNotificationCallBack(data) {
    var viewModel = {};
    var count = {applicationApprovel: 0, warning: 0};
    data = data.data;
    if(data){
      count['applicationApprovel'] = data.applicationApprovelCount;
      count['warning'] = data.warningCount;
    }
    
    viewModel.roleName = roleName;
    viewModel.count = count;
    this.viewModel = viewModel;
  }
});
  

//shared function for order detail info page
$(document).delegate("#order-detail", "pageinit", function() {
  //Always get param in localstorage
  var uri = sap.creditManagement.CONST_DATA.serviceUri;
  var params = sap.creditManagement.db.getLocationParams('customer-unpaid-order-detail.html'),
    orderId = '';
  if (!params) {
    console.log('no params in localstorage');
  }
  else if (undefined === params.orderId) {
    console.log('no order id in localstorage');
  }
  
  orderId = params.orderId;
  // define view model
  function myCallBack(data) {
    var viewModel = {};
    data = data.data;
    if(data) {
      viewModel.orderInfoData = {serialNo: data.orderInfo.id, amount: data.orderInfo.amount, unit: data.orderInfo.unit, status: data.orderInfo.status, date: data.orderInfo.date };
      viewModel.collectionUsageData = data.collections;
    } 
    else {
      viewModel.orderInfoData = {serialNo: '', amount: 0, unit: '', status: '', date: '' };
      viewModel.collectionUsageData = [];
    }
    //this is necessary
    this.viewModel = viewModel;
  };

  sap.creditManagement.sapcmrequest({
    url : uri.customer.getCustomerUnpaidOrderDetail,
    success : myCallBack, //will be extended from the baseCallback.should extend from the basic callback function which includes - render translation/mapping/viewModel/applyBinding,so it should be a clear interface with the template
    data : {orderId: orderId},
    containerId : "order-detail"
  });
});

/**
 * Initial function for warning customer list page
 */
$(document).delegate('#warning_customer_list', 'pageinit', function () {
  var serviceUri = sap.creditManagement.CONST_DATA.serviceUri;
  var db = sap.creditManagement.db;
  
  function myCallback(data) {
    var viewModel = {};
    var warningCustomerList = [];
    var listTab = db.getListTab() ? db.getListTab() : 'warning'; 
    data = data.data;
    
    if (data) {
      var warningList = data['warningList'];
      var processedList = data['processed'];
      
      viewModel.footerTabs = {
        listTab: ko.observable(listTab),  
          
        showWarningList: function (evt) {
          viewModel.warningCustomerList(warningList);
          viewModel.footerTabs.listTab('warning');
          db.setListTab('warning');   // Save listTab in localStorage in order to back to this listTab content
        },
        showProcessedList: function (evt) {
          viewModel.warningCustomerList(processedList);
          viewModel.footerTabs.listTab('processed');
          db.setListTab('processed');
        }
      };
      switch (viewModel.footerTabs.listTab()) {
      case 'warning':
        warningCustomerList = warningList;
        break;
      case 'processed':
        warningCustomerList = processedList;
        break;
      }
      viewModel.warningCustomerList = ko.observable(warningCustomerList);
    } 
    else {
      viewModel.warningCustomerList = [];
      viewModel.footerTabs = {};
    }
    this.viewModel = viewModel;
  }
  
  sap.creditManagement.sapcmrequest({
    url: serviceUri.common.getWarningCustomers,
    success: myCallback,
    containerId: 'warning_customer_list'
  });
});

/**
 * Initial functoin for customer warning detial page
 */
$(document).delegate('#warning_customer_detail', 'pageinit', function () {
  var serviceUri = sap.creditManagement.CONST_DATA.serviceUri;
  var db = sap.creditManagement.db;
  var requestData = db.getLocationParams('warning-customer-detail.html');
  var myScroll;
  var newIScroll = function() {
    myScroll = new iScroll('wrapper', {
      snap: true,
      momentum: false,
      hScrollbar: false,
      lockDirection: true,
      onScrollEnd: function () {
        if (document.querySelector('#indicator > li.active') && document.querySelector('#indicator > li:nth-child(' + (this.currPageX+1) + ')')) {
          document.querySelector('#indicator > li.active').className = '';
          document.querySelector('#indicator > li:nth-child(' + (this.currPageX+1) + ')').className = 'active';
        }
      }
    });
  };
  newIScroll();
  
  function myCallBack(data) {
    var viewModel = {};
    var bindingData = [];
    data = data.data;
    if(data){
      viewModel.status = db.getListTab();
      viewModel.basicInfo = data.basicInfo;
      data.warningSummary.orderMoneyChangeRate.label = sap.creditManagement.translate('Order Money Change Rate');
      data.warningSummary.withoutOrderTime.label = sap.creditManagement.translate('Without Order Time (Day)');
      data.warningSummary.oweMoney.label = sap.creditManagement.translate('Owe Money');
      data.warningSummary.oweMoneyTime.label = sap.creditManagement.translate('Owe Money Time (Day)');
      data.warningSummary.contractBreakRate.label = sap.creditManagement.translate('Contract Break Rate');
      //set diagram container id
      data.warningSummary.orderMoneyChangeRate.containerId = 'line_diagram_amount_changes_rate';
      data.warningSummary.withoutOrderTime.containerId = 'line_diagram_without_orders_date';
      data.warningSummary.oweMoney.containerId = 'line_diagram_owe_money';
      data.warningSummary.oweMoneyTime.containerId = 'line_diagram_owe_money_time';
      data.warningSummary.contractBreakRate.containerId = 'line_diagram_contract_break_rate';

      viewModel.warningSummary = [
          data.warningSummary.orderMoneyChangeRate,
          data.warningSummary.withoutOrderTime,
          data.warningSummary.oweMoney,
          data.warningSummary.oweMoneyTime,
          data.warningSummary.contractBreakRate
        ];
    } 
    else {
      viewModel.basicInfo = {};
      viewModel.warningSummary = {};
    }
    viewModel.drawCharts = function(e) {
      var width = document.width||document.body.clientWidth;
      width *= 0.78,
      enabledChart = 1;
      var radar = new RadarChart({
        containerId: 'radar_diagram_warning',
        width: width,
        height: width,
        nameColor: '#000',
        lineColor: '#FFC125',
        //lineCap: 'round',
        lineWidth: 4,
        backLineColor: '#666',
        backLineWidth: 1,
        valueArr: viewModel.warningSummary
      });
      radar.render();
      
      var strHeight = $('#wrapper').css('height');
      var height = sap.creditManagement.getNumberInStr(strHeight) + 100;
      $('<div></div>').css('height', height).appendTo('#nav');

      var obj,
        lineChartConfig = {
          containerId : '',
          width : width,
          height : width,
          nameColor : '#000',
          lineColor : '#436EEE',
          lineWidth : 4,
          backLineColor : '#666',
          backLineWidth : 1,
          warningLineColor : ['#FFC125', '#CD5555', '#EE0000'],
          value : {}
        };
      //set different value and id for 5 line chart.
      for(obj in viewModel.warningSummary) {
        obj = viewModel.warningSummary[obj];
        if (!obj.disable) {
          enabledChart++;
          lineChartConfig.containerId = obj.containerId;
          lineChartConfig.value = obj;
          var line = new LineChart(lineChartConfig);
          line.render();
        }
      }
      //set chart scroll screen width
      $('#scroller').css('width', enabledChart+'00%');
      $('#scroller li').css('width', 100/enabledChart+'%');
      sap.creditManagement.renderTranslation(e);
      myScroll.refresh();
    };
    
    if (db.getCurrentUserRole() === 'manager') {
      var customerId = db.getLocationParams('warning-customer-detail.html').customerId;
      var customerName = viewModel.basicInfo.customerName;
      
      viewModel.popupDialog = function(event) {
        
        sap.creditManagement.dialog({
        'title': sap.creditManagement.translate('Warning Process'),
        'content': '',
        'buttons': {
         'Reduce Credit Limit': {
           'class': 'botton-c',
           'action': function () {
             db.set('manager-reduce-credit-limit.html', {customerId: customerId, customerName: customerName});
             $.mobile.changePage('manager-reduce-credit-limit.html', {transition: 'slide'});
           },
           'text': sap.creditManagement.translate('Minus')
         },
         'Freeze Customer Data': {
           'class': 'botton-c',
           'action': function(){
             sap.creditManagement.sapcmrequest({
               url: serviceUri.manager.frozenCustomerMasterData,
               success: function () {$.mobile.changePage('warning-customer-list.html', {transition: 'slide'});},
               data: {customerId: customerId},
               type: 'post'
             });
           },
           'text': sap.creditManagement.translate('Frozen')
          }
        }
      });
     };
    }
    this.viewModel = viewModel;
  }
  
  sap.creditManagement.sapcmrequest({
    url: serviceUri.common.getCustomerWarningDetail,
    success: myCallBack,//will be extended from the baseCallback.should extend from the basic callback function which includes - render translation/mapping/viewModel/applyBinding,so it should be a clear interface with the template
    data: {customerId: requestData.customerId, startDate: requestData.statDate, endDate: requestData.endDate},
    containerId: 'warning_customer_detail'
  });
});


/**
 * Initial function for friendship remind page
 */
$(document).delegate('#credit_change_check', 'pageinit', function () {
  var serviceUri = sap.creditManagement.CONST_DATA.serviceUri;
  var db = sap.creditManagement.db;
  
  function myCallback(data) {
    var viewModel = {};
    data = data.data;
    
    if (data) {
      viewModel.creditChangeList = data['list'];
    } 
    else {
      viewModel.creditChangeList = [];
    }
    this.viewModel = viewModel;
  }
  sap.creditManagement.sapcmrequest({
    url: serviceUri.common.getWarningRecords,
    success: myCallback,
    containerId: 'credit_change_check'
  });
});

/**
 * Initial function for friendship remind detail page
 */
$(document).delegate('#friendship_remind_detail', 'pageinit', function () {
  var serviceUri = sap.creditManagement.CONST_DATA.serviceUri;
  var db = sap.creditManagement.db;
  
  function myCallback(data) {
    var viewModel = {};
    data = data.data;
    
    if (data) {
      viewModel.basicInfo = data.basicInfo;
      viewModel.warningReason = data.warningReason;
      viewModel.processResult = data.processResult;
    } 
    else {
      viewModel.basicInfo = {};
      viewModel.warningReason = '';
      viewModel.processResult = {};
    }
    // viewModel.afterRender = function (e) {sap.creditManagement.renderTranslation(e);};
    this.viewModel = viewModel;
  }
  
  sap.creditManagement.sapcmrequest({
    url: serviceUri.common.getWarningRecordDetail,
    success: myCallback,
    data: {warningId: db.getLocationParams('friendship-remind-detail.html').warningId},
    containerId: 'friendship_remind_detail'
  });
});

// Create IScroll 
(function () {
  document.addEventListener("touchmove",function(e){e.preventDefault();},false);
  
  $(function () {
    var iscrollList = [];
    var myScroll = new iScroll("content",{useTransform:true});
    
    $(':jqmData(role="page")').die('pageshow').live('pageshow',function(){
      var currentPage = $(this);
      var contentID = currentPage.find('.iscroll').attr('id'); 
      
      if (contentID) {
        if(iscrollList[contentID]!=null&&iscrollList[contentID] instanceof iScroll){
          iscrollList[contentID].destroy();
          iscrollList[contentID] = null;
        }
        iscrollList[contentID] = new iScroll(contentID,{useTransform:true,
          onBeforeScrollStart: function (e) { 
            var target = e.target; 
            while (target.nodeType != 1) {target = target.parentNode;} 
            if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {e.preventDefault();}
          }
        });
        sap.creditManagement.iscroll = iscrollList[contentID];
      }
    });
  });
})();



 
