/**
 * (c) Copyright 2012 SAP AG. All rights reserved
 *
 * Summary: Provides common configuration in Credit Management System.
 *
 * Dependency files: Jquery.js,JqueryMobile.js
 *
 */

(function() {
  if(!window.sap) {
    window.sap = {};
  }
  if(!sap.creditManagement) {
    sap.creditManagement = {};
  }
  var creditManagement = sap.creditManagement;

  /*local storage begin*/
  var db = {}, defaultPrefix = "_sap_credit_";
  sap.creditManagement.db = db;

  /**
   * Summary: store one item into the localStorage
   *
   * params:
   *  @key: string, required. used to identify one storage item�� 
   *  @value: any, required.
   *
   * return: 
   *  N/A
   */
  db.set = function(key, value) {
    localStorage[defaultPrefix + key] = JSON.stringify(value);
  };

  /**
   * Summary: get one item from the localStorage
   *
   * params:
   *  @key: string, required. used to identify one storage item
   *
   * return: 
   *  value if exists, otherwise null.
   */
  db.get = function (key) {
    key = defaultPrefix + key;
    
    if (localStorage[key] && localStorage[key] !== "undefined") {
      return JSON.parse(localStorage[key]);
    } 
    
    return null;
  };
    
  /**
   * Summary: remove one item from the localStorage
   *
   * params:
   *  @key: string, required. used to identify one storage item
   *
   * return: 
   *  N/A
   */
  db.remove = function (key) {
    key = defaultPrefix + key;
    localStorage.removeItem(key);
  };

  /**
   * Summary: remove all items from the localStorage which belongs to prefix categories
   *
   * params:
   *  N/A
   *
   * return: 
   *  N/A
   */
  db.destory = function() {
    var key,
        reg;

    reg = new RegExp('^'+defaultPrefix);
      for(key in localStorage) {
        if (reg.test(key)) {
          localStorage.removeItem(key);
        }
      }
  };
  /*local storage end*/

  // Constant
  creditManagement.CONST_DATA = {
    defaultLanguage : 'en-us', //'zh-cn'
    serviceDomain : 'http://10.58.151.158:8080/ncm-web-0.0.1-SNAPSHOT/',//TODO remember to add the domain in XCode white list
   
    langUrl: "lang.{0}.js",//TODO:: replace it with the live url
    //this is real service, fake service located in fakeService/init.js
    serviceUri : {
      common:{
        userLogin : 'login',
        userLogout : 'logout',
        getWarningCustomers: 'getWarningCustomers',
        getCustomerWarningDetail: 'getCustomerWarningDetail',
        getWarningRecords: 'getWarningRecords',
        getWarningRecordDetail: 'getWarningRecordDetail'
      },
      customer:{
        getCustomerCreditInfo : 'queryCreditAndOrders',
        getCustomerUnpaidOrderDetail: 'queryDunHistoryByOrderId',
        getCustomerApplyList: 'queryCreditApplicationHistory',
        getCustomerApplyDetail: 'queryCreditApplicationResultByCustomer',
        postCreditApply: 'submitApplication',
        getCustomerCreditAmount: 'queryCredit',
        getCustomerApplicationNotification: 'queryCustomerNotification'
      },
      sales:{
        getSaleApplicationNotification: 'queryNotificationBySales',
        getCreditLimitApplyList: 'queryCreditApplicationHistoryBySales',
        getCreditLimitApplyDetail: 'queryCreditApplicationDetailBySales',
        getCreditLimitApplyResult: 'queryCreditApplicationResultBySales',
        submitCreditLimitApply: 'submitApplicationBySales',
        rejectCreditLimitApply: 'refuseApplicationBySales',
        getFrozenOrderList: 'queryForzenOrdersBySales',
        getFrozenOrderDetail: 'queryForzenOrderDetailBySales',
        getFrozenOrderResult: 'queryCreditApplicationResultForFrozenOrderBySales',
        submitFrozenOrderApply: 'submitApplicationForFrozenOrderBySales',
        rejectFrozenOrderApply: 'refuseApplicationForFrozenOrderBySales',
        getUnpaidOrderDetail: 'queryCollectionHistoryBySales',
        addCollectionTask: 'addCollectionTask'        
      },
      manager:{
        getManagerNotification: 'queryManagerNotification',
        getCreditLimitApprovalList: 'queryCreditApplicationItems',
        getCreditLimitApplyDetail: 'queryCreditApplicationDetail',
        getCreditLimitApplyResult: 'queryCreditApplicationResultByManager',
        approveCreditLimitApply: 'approveCreditApplication',
        rejectCreditLimitApply: 'rejectCreditApplication'
      }    
    },
    roles : {
      customer : 'customer',
      manager : 'manager',
      sale : 'sale',
      collector : 'collector',
      admin : 'admin'
    },
    status : {//TODO refine the status
      approved : 'approved',
      waiting : 'waiting',
      rejected : 'rejected',
      UNPROCESSED : 'unProcessed',
      PROCESSING : 'processing',
      PROCESSED : 'processed',
      REJECT : 'reject',
      APPROVE : 'approve' 
    },
    priority : {//TODO refine the priority
      high : 'h',
      normal : 'n',
      low : 'l'
    },
    warning_level : {//TODO refine the warning level
      p1 : 'p1',
      p2 : 'p2',
      p3 : 'p3'
    },
    DIALOG_CONST : {
      title:'Dialog Title',
      titleAlert:'Alert',
      set:'Dialog Set',
      yes:'Dialog Yes',
      cancle:'Dialog Cancle',
      retry:'Dialog Retry',
      okay:'Dialog Okay'
    },
    debug: true //window.location.search.indexOf("debug=true") > -1
  };

  /**
   * Summary: Check device network connection status
   */
  creditManagement.checkConnection = function () {
    var networkState = navigator.network.connection.type;
  
    var states = [];
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';
  
    if ((Connection.NONE === networkState) || (Connection.UNKNOWN === networkState)) {
      creditManagement.sapAlert('Please check network connection!','', function(){});
    }
  }

  /**
   * Summary: Go back to previous page
   */
  creditManagement.goBackPage = function() {
    //check whether current page is login page.
    if ($('.login-page').length != 1) {
      // $('#dialogOverlay').fadeout(function(){$(this).remove();});
      $('#dialogOverlay').remove();
      window.history.back();
    }
    return false;
  }

  /**
   * Summary: Logout user.
   */
  creditManagement.logout = function() {
    if (db.getSecurId()) {
      //delete securid
      db.setSecurId(null);
      //TODO:: logout from backend services
      if(!creditManagement.CONST_DATA.debug){
        //
      }
    }
    creditManagement.goLoginPage();
  }

  /**
   * Summary: Go to login page
   */
  creditManagement.goLoginPage = function() {
    if ($('#login').length != 1) {
       window.location.href = '../../index.html';
    }
  }
  /**
   * Summary: Translation function.
   *
   * params:
   *  @str string reqired
   * @toLang string optional translate to specify language.
   * @fromLang string translate from specify language.
   *
   * return:
   *  Translated string
   */
  creditManagement.translate = function(str, toLang, fromLang) {
    var ret;
    if(!toLang){
      toLang = db.getLang();
    }
    ret = langs[str];
    return ret ? ret : str;
  }

  /**
   * Summary: Translate string in HTML after page render
   * @param container mixed string or object.
   */
  creditManagement.renderTranslation = function(container) {
    var container;
    if(typeof container === 'string'){
      container = $("#"+container);
    }
    else if(typeof container === "object"){
      container = $(container);
    }
    $('[data-translation]',container).each(function(e) {
      var current = $(this),
        content = current.data('translation');
        content = creditManagement.translate(content);
        current.text(content);
    });
  }

  /**
   * Summary: Format number with thousandth
   * e.g. 12000 => 12,000
   *
   * params:
   *  @amtStr string required
   *
   * return:
   *  Formatted string
   */
  creditManagement.convertNumberWithComma = function(amtStr) {
    var a, 
      renum = '',
      j = 0,
      symbol = '', integerPart = '', floatPart = '';
      tes = /^-/;
    
    amtStr = amtStr.toString();
    a = amtStr.replace(/,/g, '');
    a = a.replace(/[^-\.,0-9]/g, '');
    a = a.replace(/(^\s*)|(\s*$)/g, '');
    if(tes.test(a))
      symbol = '-';
    a = a.replace(/-/g, '');
    a = parseFloat(a).toString();
    if(a != "0" && a.substr(0, 2) != "0.")
      a = a.replace(/^0*/g, '');
    j = a.indexOf('.');
    if(j < 0)
      j = a.length;
    integerPart = a.substr(0, j);
    floatPart = a.substr(j);
    j = 0;
    for(var i = integerPart.length; i > 3; i = i - 3) {
      renum = "," + integerPart.substr(i - 3, 3) + renum;
      j++;
    }
    renum = symbol + integerPart.substr(0, integerPart.length - j * 3) + renum + floatPart;

    return renum;
  };

  /**
   * Summary: Save parameter in URL to localstorage
   * This function used to pass params when changing pages,
   * Do differentiate setResut() in fakeService.
   *
   * params:
   *  @evt dom element
   */
  creditManagement.saveLocationParams = function(evt) {
    var target = evt.attr('href'),
        queryStr = target.split('?'),
        fullPath = queryStr[0].split('/'),
        key = fullPath[fullPath.length - 1],
        params = creditManagement.queryStringToObject(queryStr[1]);
    
    db.setLocationParams(key, params);
  };

  /**
   * Summary: Convert parameter from string to object
   *
   * params:
   *  @qstr string required
   *
   * return:
   *  object
   */
  creditManagement.queryStringToObject = function(qstr) {
    var result = {}, nvPairs = ((qstr || '' ).replace(/^\?/, '').split(/&/) ), i, pair, name, value;

    for( i = 0; i < nvPairs.length; i++) {
      var pstr = nvPairs[i];
      if(pstr) {
        pair = pstr.split(/=/);
        name = pair[0];
        value = pair[1];
        if(result[name] === undefined) {
          result[name] = value;
        } else {
          if( typeof result[name] !== "object") {
            result[name] = [result[name]];
          }
          result[name].push(value);
        }
      }
    }

    return result;
  };

  /**
    * Summary: string utililty - "my name is {0}, i am {1} years old" => "may name is tom, i am 18 years old"
    *    Example:
    *      var sentence = "my name is {0}, i am {1} years old";
    *      sentence = sentence.sapformate("tom","18"); // then value of sentnce is "may name is tom, i am 18 years old"
    * params:
    *  string
    * 
    * return: 
    *  
    */
   String.prototype.sapformate = function () {
     var arg = arguments, matchResult, matLength, str = this, reg = new RegExp();
     reg = /\{\d+\}/g;
     matchResult = str.match(reg);
     matLength = matchResult.length;
     if (arg.length >= matLength) {
         for (var i = 0; i < matLength; i++) {
             str = str.replace(matchResult[i], arg[i]);
         }
     }
     return str;
   };
   
  // dialog object
  /**
    * Popup dialog
    * Dependency files: common.js, ../css/dialog.css, ../images/dialog/*
    * 
    * e.g:
    *  HTML Code: 
    *  <div class="popup-demo">Click Me</div>
    *  JS Code:
    *  $('.popup-demo').click(function(){
    *   var elem = $(this).closest('.item');
    *   
    *   sap.creditManagement.dialog({
    *     'title': 'Popup Dialog Title',
    *     'content': 'You are about to delete this item. <br />It cannot be restored at a later time! Continue?',
    *     'buttons': {
    *       'Yes': {
    *         'class': 'button-a',
    *         'action': function(){
    *           // Do something here.
    *         },
    *         'text': 'Button Description'
    *       },
    *       'No': {
    *         'class': 'button-b',
    *         'action': function(){}// Nothing to do in this case. You can as well omit the action property.
    *       }
    *     }
    *   });
    * });
    *
    */
  (function($){
  var CONST_IDS = {
    DIALOG_OVERLAY: 'dialogOverlay',
    DIALOG_BOX: 'dialogBox',
    DIALOG_BUTTON: 'dialogButton'
  };
  var popup = sap.creditManagement,
    doNothing = function(){};
  
  popup.dialog = function(params){
    var parent = params.parent, buttonHTML = '',key,_markup,buttons,i = 0,markup;
    var contentHtml = '';
    if($('#'+CONST_IDS.DIALOG_OVERLAY).length){
      if (!params.id) {
        // A dialog is already shown on the page:
        return false;
      }
    }
    params.id = params.id ? params.id : CONST_IDS.DIALOG_OVERLAY;
    if (params.content) {
      contentHtml = '<div class="dialog-content">' + sap.creditManagement.translate(params.content) + '</div>';
    }
    
    for (key in params.buttons) {
      // Generating the markup for the buttons:
      buttonHTML += '<a href="#" class="button '+params.buttons[key]['class']+'">'+params.buttons[key]['text']+'<span></span></a>';
      
      if (typeof(params.buttons[key].action) !== 'function'){
        params.buttons[key].action = doNothing;
      } 
    }
    
    /*
    $.each(params.buttons,function(name,obj){
      // Generating the markup for the buttons:
      buttonHTML += '<a href="#" class="button '+obj['class']+'">'+name+'<span></span></a>';
      
      if(!obj.action){
        obj.action = function(){};
      }
    });
    */
    markup = [
      // '<div id="', CONST_IDS.DIALOG_OVERLAY, '">',
      '<div id="', params.id, '" class="dialogOverlay">',
      '<div id="', CONST_IDS.DIALOG_BOX, '">',
      '<div class="layout-top"></div>',
      '<div class="layout-content">',
      '<h1>', sap.creditManagement.translate(params.title), '</h1>',
      // '<div class="dialog-content">', sap.creditManagement.translate(params.content), '</div>',
      contentHtml,
      '<div id="', CONST_IDS.DIALOG_BUTTON, '">', buttonHTML,'</div>',
      '</div>',
      '<div class="layout-bottom"></div>',
      '</div></div>'
    ].join('');
    markup = $(markup);//.hide();
    if ($.mobile.activePage) {
      $.mobile.activePage.append(markup);
    } else {
      $('.ui-page').append(markup);
    }
    // markup.hide().fadeIn();
    $(markup).hide().appendTo('body').fadeIn();
    
    buttons = $('#' + params.id + ' #'+CONST_IDS.DIALOG_BOX+' .button');
    $.each(params.buttons,function(name,obj){
      var is_remove = true; // Decide wheather remove the reject dialog
      
      buttons.eq(i++).click(function(){
        // Calling the action attribute when a
        // click occurs, and hiding the dialog.
        is_remove = (obj.action() === false) ? false : true;
        obj.id = obj.id ? obj.id : CONST_IDS.DIALOG_OVERLAY;
        
        if (is_remove || obj.id !== CONST_IDS.DIALOG_OVERLAY) {
          popup.dialog.hide(obj.id);
        }
        return false;
      });
    });
  }
  
  popup.dialog.hide = function(id){
    $('#'+id).fadeOut(function(){
      $(this).remove();
    });
  }
  
})(jQuery);

  //define sap request
  (function(){
    var mapType;

    /**
      * Summary: extend Function, add the paras to the callers prototype chain
      * 
      * params:
      *   @param parent function, required.
      * 
      * return: 
      *    n/a
      */
    Function.prototype.sapinherit = function(parent){
      if(parent instanceof Function){
        this.prototype = new parent();
        this.prototype.constructor = this;
      }
    };

    /**
      * Summary: wraps the ajax request, generally all ajax in this project should use this method
      * Example-
      *   sap.creditManagement.sapcmrequest({
          url:"",
          success:funciton(res){
            ....
            
            this.viewModel = .... //this part of code is required
          },
          type:"",//optional,default callback
          data:"",//optional
          error:null,//optional
          manualSend:false, // optional
          mapping:[
                    {
                      'data.applicationApprovelCount':'approveCount',
                      mtype:mapType.OBSERVABLE
                    },
                    {
                      "data.applicationApprovelCount":"showApproveCount",
                      mtype:mapType.OBSERVABLE,
                      mfunc:function(value){
                        if(value > 0){
                          return true;
                        }
                        else{
                          return false;
                        }
                      }
                    }
                  ],
          afterRender:function(){
            //this is optional.
          },
          containerId:"home"
        });
      * 
      * params:
      *   @obj - object, required. contains - 
      *      url: string,required. the request url
      *      success: function, optional. success callback function.either mapping or success is required. if exists,should to assign the viewModel: this.viewMode = {....}
      *      mapping: object or array, optional. either mapping or success is required.
      *      afterRender: function, optional. will be used by knockout external templating.
      *      data: string or object. optional.
      *      type: string, optional. default value is 'get'
      *      error: function,optional. error callback
      *      manualSend: bool, optional. send request manually or automatically. default value is false.
      *      
      * 
      * return: 
      *    an instance of ajaxRequest which contains the send method. 
      */
    creditManagement.sapcmrequest = function(obj){
      var container = obj.containerId, mapping = obj.mapping,request,afterRender = obj.afterRender ? obj.afterRender : function() {};
      // hide the current page, will display it once all data is ready(see postProcess)
      if(container){
          if(typeof container === 'string'){
            container = $('#'+container);
          }else{
            container = $(container);
          }
          container.addClass('sap-hide');
      }
      if(mapping){
        obj.success = function(data){
          this.json2viewmodel(data,mapping);
        };
      }

      if(obj.success){
        var subCallBack = obj.success;
        subCallBack.sapinherit(baseCallBack);
        obj.success = function(data){
          var callBack = new subCallBack(data),
              viewModel = callBack.viewModel;
          if(viewModel){
            afterRender = viewModel.afterRender? viewModel.afterRender : afterRender;
            if (afterRender) {
            viewModel.afterRender = function(elements){
              if(typeof afterRender === 'function'){
                afterRender(elements);
              }
              if (sap.creditManagement.iscroll) {
                sap.creditManagement.iscroll.refresh(); // Refresh iscroll of this page 
              }
              
              //TODO:: add the common logic here
              if(elements && elements.length > 1){
                elements = $(elements).parent();
              }
              sap.creditManagement.renderTranslation(elements);
              if(container){
                container.removeClass('sap-hide');
              }
            };
            }
          }
          if(!obj.type || obj.type.toLowerCase() === 'get'){
            callBack.postProcess(container);
          }
        };
      }else{
        console.log("either mapping or callback is required");
      }

      request = new sap.creditManagement.ajaxRequest(obj.url,obj.success,obj.data,obj.type,obj.error);
      if(!obj.manualSend){
        request.send(); 
      }
      return request;
    };

    /**
      * Summary: the mapping type. you can extend it.but key and process is required
      * TODO: Refine
      */
    mapType = creditManagement.requestMapType = {
        PLAIN:{
          key:"no-observable",
          process:function(viewModel,key,value){
            viewModel[key] = value;
          }
        },
        OBSERVABLE:{
          key:"observable",
          process:function(viewModel,key,value){
            viewModel[key] = ko.observable(value);
          }
        },
        OARRAY:{
          key:"observable-array",
          process:function(viewModel,key,value){
            var item;
            viewModel[key]= item = ko.observableArray();
            for(var inx = 0; inx < value.length; inx++){
              item.push(value[inx]);
            }
          }
        }
    };

    /**
      * Summary: define the base call back function, every success callback will inherit from it     
      * 
      * params:
      *   n/a
      *      
      * 
      * return: 
      *    n/a
      */
    function baseCallBack(){}
    baseCallBack.prototype.viewModel = {};

    /**
     * Summary: translate json data to viewModel according to mapping     
     * 
     * params:
     *   @data: json formate, required
     *   @mapping: array or object, required
     *      
     * 
     * return: 
     *    n/a
     */
    baseCallBack.prototype.json2viewmodel = function(data,mapping){
      // construct the view model
      
      var viewModel = {};
      if(mapping instanceof Array){
        processArray(mapping,data);
      }else if(mapping instanceof Object){
        processObject(mapping,data);
      }

      this.viewModel = viewModel;

      /**
        * Summary: get the value from data
        *
        * params:
        *  @key: string,required, sample: 'mykey' or 'data.mykey'
        *  @data: object,required. sample:{mykey:3} or {data:{mykey:3}}
        *  
        * return: 
        *   the vaule of the data[key]
        */
      function getValue(key,data){
        var length,inx;
        key = key.split('.');
        length = key.length;
        for(inx = 0; inx < length; inx++){
          data = data[key[inx]];
        }
        return data;
      }
      
      function processArray(array,data){
          var item,inx,length = array.length;
          for(inx = 0; inx < length; inx++ ){
            item = array[inx];
            if(item instanceof Array){
              processArray(item,data);
            }
            else if(item instanceof Object){
              processObject(item,data);
            }
          }
      }
      
      function processObject(object,data){
          var key,value,mtype,mfunc;
          for(key in object){
            if(object.hasOwnProperty(key)){
              if(key === "mtype" || key === "mfunc")
              {
                continue;
              }
              else{
                mtype = object['mtype'],mfunc = object['mfunc'];
                if(key.indexOf('.') > 0){
                  value = getValue(key,data);
                }
                else{
                  value = data[key];
                }
                
                construct(object[key],value,mtype,mfunc);
                break;
              }
              
            }
          }
      }
      
      function construct(key,value,type,func){
        var item,length,handler;
        if(func){
          value = func(value);
        }
        switch(type){        
          case mapType.OBSERVABLE.key:
            handler = mapType.OBSERVABLE;
            break;
          case mapType.OARRAY.key:
            handler = mapType.OARRAY;
            break;
          default: 
            handler = mapType.PLAIN;
            break;
        }
        handler.process(viewModel, key, value);
      }
    };
    
    /**
      * Summary: common process before update the page. currently it is not used, keep it for future purpose     
      * 
      * params:
      *   n/a
      *      
      * 
      * return: 
      *    n/a
      */
    baseCallBack.prototype.beforeProcess = function(){
      //TODO:: should update sap.creditManagement.ajaxRequest
      //the logic before the ajax request
    };
    
    /**
      * Summary: common proccess logic after process data successfully. include render translation + applybinding     
      * 
      * params:
      *   container: jquery dom object
      *      
      * 
      * return: 
      *    n/a
      */
    baseCallBack.prototype.postProcess = function(container){
      if(container){
       sap.creditManagement.renderTranslation(container);
       ko.applyBindings(this.viewModel, container.get(0));
       if(!this.viewModel.afterRender){
         container.removeClass('sap-hide');
       }
      }
      else{
        sap.creditManagement.renderTranslation();
          ko.applyBindings(this.viewModel);
      }
    };
  })();

  // Define ajax request object. Important: , do not use it directly. use creditManagement.sapcmrequest instead of
  (function(){
    var ajaxRequest;
    
    /**
      * Summary: the constructor of the ajaxRequest object.
      *
      * params:
      *  @url,string,required, the url of the request
      *  @postdata, string, required, post data in format of key1=value1&key2=value2...
      * @successCallback, function,required, wraps process logical when status code is "success"
      * @type, get or post, optional, ajax request type
      * 
      * @errorCallback, function,optional, wraps process logical when ajax request failed.
      * 
      * return: 
      *  N/A
      */
    ajaxRequest = creditManagement.ajaxRequest = function(url,successCallback,postData,type,errorCallback){
      var callBack;
      this.url = "",
      this.callback = "",
      this.type = "GET",
      this.data = "";
     
      if(url) this.url = url;
          
      if(successCallback){
        callBack = new creditManagement.ajaxCallback(successCallback, type);
        this.success = callBack.execute;
        this.error = callBack.error;
      } 
      if(errorCallback){
        this.error = errorCallback;
      }
      if(type) this.type = type;
      if(postData) this.data = postData;
    };
    
    /**
      * Summary: send ajax request
      *
      * params:
      * @obj, ajax request object, optional, includes
      *    @url,string,required, the url of the request
      *   @successCallback, function,required, wraps process logical when status code is "success"
      *   @type, get or post, optional, ajax request type
      *   @postdata, string, optional, post data in format of key1=value1&key2=value2...
      *   @errorCallback, function,optional, wraps process logical when ajax request failed.
      * 
      * return: 
      *  N/A
      */
    ajaxRequest.prototype.send = function(obj){
      if(!obj) {
        obj = this;
      }
      var type = (obj.type) ? obj.type : 'GET',
        splits = obj.url.split('/'),
        len = splits.length;

      db.setRequest(obj.data, splits[len-1]);
      if (typeof obj.data !== "object") {
        obj.data = {};
      }
      obj.data["token"] = db.getSecurId();
      obj.error = obj.error ? obj.error:errorHandle;

      $.ajax({
        type: type,
		contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: "json",
        url: db.getServerUrl() + obj.url,//http://www.ncm.dev/jsonp.php
        data: obj.data,//object, array, string .etc. "name=John&location=Boston",
        success: obj.success,
        error: obj.error
      });
    };
  })();

  // define the ajaxCallback object
  (function(){
    var ajaxCallback;
    
    /**
      * Summary: the constructor of the ajaxCallback object.
      *
      * params:
      *  @success, an function which will be used when the response status is 'success'
      * 
      * return: 
      *  N/A
      */
    creditManagement.ajaxCallback = function(success, type){
      this.type = "GET";
      if(typeof success === "function"){
        this.success = success;
      }
      if(type) this.type = type;
      this.execute = this.execute.bind(this);
    };
    
    ajaxCallback = creditManagement.ajaxCallback;
    
    /**
      * Summary: main logic when we get the expected response
      *
      * params:
      *  @data, the response data from server, generally the formate is {message:"",satatus:"successs/fail/expire",data:{}}
      * 
      * return: 
      *  N/A
      */
    ajaxCallback.prototype.execute = function(data){
      var status;
      if(data){
        status = data.status;
        if(status === "success"){
          this.success(data);
        }
        else if(status === "fail"){
          this.fail(data.message);
        }
        else if(status === "expire"){
          this.expire(data.message);
        }
        else{
          this.unkown(data.message);
        }
      }
      else{
        this.error("Error happens.");
      }
    };
    
    /**
      * Summary: process logical when status is "success"
      *
      * params:
      *  N/A
      * 
      * return: 
      *  N/A
      */
    ajaxCallback.prototype.success = function(){
      if(creditManagement.CONST_DATA.debug){
        console.log("success message");
      }
    };
    
    /**
      * Summary: process logical when status is "fail"
      *
      * params:
      *  @msg, string, required. failed message
      * 
      * return: 
      *  N/A
      */
    ajaxCallback.prototype.fail = function(msg){
      var callback = function(){};
      if(creditManagement.CONST_DATA.debug){
        console.log(msg);
      }
      if ('GET' === this.type) {
        callback = creditManagement.goBackPage;
      }
      
      creditManagement.sapAlert(msg, '', callback);
    };
    
    /**
     * Summary: process logical when status is "expire"
     * 
     * params: 
     * @msg, string, required. expired message
     * 
     * return: N/A
     */
    ajaxCallback.prototype.expire = function(msg){
      if(creditManagement.CONST_DATA.debug){
        console.log(msg);
      }
      if (!msg) {
        msg = 'sessionExpire';
      }
      creditManagement.sapAlert(msg, '', creditManagement.logout);
    };

    /**
      * Summary: process logical when receiving unexpected response
      *
      * params:
      *  N/A
      * 
      * return: 
      *  N/A
      */
    ajaxCallback.prototype.unkown = function(msg){
      var callback = function(){};
      if(creditManagement.CONST_DATA.debug){
        console.log(msg);
      }
      if ('GET' === this.type) {
        callback = creditManagement.goBackPage;
      }
      creditManagement.sapConfirm(msg, callback);
    };
    
    /**
      * Summary: process logical when ajax request error happens
      *
      * params:
      *  N/A
      * 
      * return: 
      *  N/A
      */
    ajaxCallback.prototype.error = function(msg){
      var callback = function(){};
      if(creditManagement.CONST_DATA.debug){
        console.log(msg);
      }
      if ('GET' === this.type) {
        callback = creditManagement.goBackPage;
      }
      creditManagement.sapAlert(msg, '', callback);
    };
  })();

  /**
   * Summary: Display alert box for different environment.
   *
   * param:
   * @msg: sring, required.  Message in alert box.
   * @callback: function, Optional.  Callback function.
   * @title: string, Optional.
   * @buttons: string, Optional.
   *
   * return:
   * N/A
   */
  creditManagement.sapAlert = function (msg, id, callback, title, buttons) {
    //set default error message
    if ((typeof msg === 'object') || (!msg)) {
      msg = 'serviceUnavailable';
    }
    msg = creditManagement.translate(msg);
    if (title) {
      title = creditManagement.translate(title);
    } else {
      title = langs[creditManagement.CONST_DATA.DIALOG_CONST.titleAlert];
    }
    if (buttons && (typeof buttons === 'string')) {
      buttons = creditManagement.translate(buttons);
    } else {
      buttons = langs[creditManagement.CONST_DATA.DIALOG_CONST.okay];
    }
    if (navigator.notification) {
      if (!callback && (typeof callback !== 'function')) {
        callback = function(){};
      }
      navigator.notification.alert(
          msg,
          callback,
          title,
          buttons 
      );
    }
    else {
      creditManagement.dialog({
        'id': id,
        'title' : title,
        'content' : msg,
        'buttons' : {
          'yes' : {
            'id': id,
            'text': buttons,
            'class' : 'button-a',
            'action' : callback
          }
        }
      });
    }
  };

  /**
   * Summary: Display confirm box for different environment.
   *
   * param:
   * @msg: sring, required.  Message in confirm box.
   * @callback: function, Optional.  Callback function.  
   *    Callback function should handle different button return value for different environment.
   *      <strong>Web</strong>: true/false
   *      <strong>Device</strong>: index of button pressed (1, 2 or 3)
   * @title: string, Optional.
   * @buttons: Array, Optional. Button names.  Example: "[Yes,No]"
   *
   * return:
   * N/A
   */
  creditManagement.sapConfirm = function (msg, callback, title, buttons) {
    if ((typeof msg === 'object') || (!msg)) {
      msg = 'serviceUnavailable';
    }
    msg = creditManagement.translate(msg);
    if (title) {
      title = creditManagement.translate(title);
    } else {
      title = langs[creditManagement.CONST_DATA.DIALOG_CONST.titleAlert];
    }
    if (buttons) {
      for (var index in buttons) {
        buttons[index] = creditManagement.translate(buttons[index]);
      }
      if (1 === buttons.length()) {
        buttons[1] = langs[creditManagement.CONST_DATA.DIALOG_CONST.cancle];
      }
    } else {
      buttons = [langs[creditManagement.CONST_DATA.DIALOG_CONST.yes], langs[creditManagement.CONST_DATA.DIALOG_CONST.cancle]];
    }

    if (navigator.notification) {
      if (!callback && (typeof callback !== 'function')) {
        callback = function(){};
      }
      buttons = buttons.join(',');
      navigator.notification.confirm(
          msg,
          callback,
          title,
          buttons 
      );
    }
    else {
      creditManagement.dialog({
        'title' : title,
        'content' : msg,
        'buttons' : {
          'yes' : {
            'text': buttons[0],
            'class' : 'button-a',
            'action' : callback
          },
          'No' : {
            'text': buttons[1],
            'class' : 'button-b'
          }
        }
      });
    }
  };

  /**
   * Summary: Get number section from css attribute string. Like: height: 500px --> 500
   * 
   * param:
   * @str: string, required. CSS attirbute string
   *
   * return:
   * num: Number 
   */
  creditManagement.getNumberInStr = function (str) {
    var regExp = /[0-9]+/;
    var num = regExp.exec(str);
  
    return parseInt(num ? num[0] : 0);
  }
  
  /**
   * Summary: Validate the form data
   * 
   * param:
   * @params: object required. Data fields which need to verify
   *
   * return:
   *  msg: string, warning message
   */
  sap.creditManagement.validate = function (params) {
    var msg = '';
    for (var key in params) {
      if (!params[key]) {
        msg += sap.creditManagement.translate(key + ' can not be empty!');
      }
    }
    if (params['amount'] !== '' && params['amount'] <= 0) {
      msg += sap.creditManagement.translate('amount can not be nagetive!');
    }
 
    return msg;
  }
})();


