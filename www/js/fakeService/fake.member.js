sap.creditManagement.CONST_DATA.serviceUri = {
  common:{
    userLogin : 'js/fakeService/login.check.js',
    userLogout : '',
    getWarningCustomers: 'js/fakeService/warn.customer.list.js',
    getCustomerWarningDetail: 'js/fakeService/warn.custome.detail.js',
    getWarningRecords: 'js/fakeService/friendship.remind.js',
    getWarningRecordDetail: 'js/fakeService/friendship.remind.detail.js'
  },
  customer:{
    getCustomerCreditInfo : 'js/fakeService/customer.credit.usage.js',
    getCustomerUnpaidOrderDetail: 'js/fakeService/customer.unpaid.order.detail.js',
    getCustomerApplyList: 'js/fakeService/customer.apply.list.js',
    getCustomerApplyDetail: 'js/fakeService/customer.apply.detail.js',
    postCreditApply: 'js/fakeService/customer.apply.create.js',
    getCustomerCreditAmount: 'js/fakeService/customer.credit.amount.js',//'queryCredit',
    getCustomerApplicationNotification: 'js/fakeService/customer.notification.js'
  },
  sales:{
    getSaleApplicationNotification: 'js/fakeService/sale.notification.js',
    getCreditLimitApplyList: 'js/fakeService/sale.credit.limit.apply.list.js',
    getCreditLimitApplyDetail: 'js/fakeService/sale.credit.limit.apply.detail.js',
    getCreditLimitApplyResult: 'js/fakeService/sale.credit.limit.apply.result.js',
    submitCreditLimitApply: 'js/fakeService/sale.credit.limit.apply.submit.js',
    rejectCreditLimitApply: 'js/fakeService/sale.credit.limit.apply.reject.js',
    getFrozenOrderList: 'js/fakeService/sale.frozen.order.list.js',
    getFrozenOrderDetail: 'js/fakeService/sale.frozen.order.detail.js',
    getFrozenOrderResult: 'js/fakeService/sale.frozen.order.result.js',
    submitFrozenOrderApply: 'js/fakeService/sale.frozen.order.apply.submit.js',
    rejectFrozenOrderApply: 'js/fakeService/sale.frozen.order.apply.reject.js',
    getUnpaidOrderDetail: 'js/fakeService/sale.unpaid.order.detail.js',
    addCollectionTask: 'js/fakeService/sale.add.collection.task.js'
  },
  manager:{
    getManagerNotification: 'js/fakeService/manager.notification.js',
    getCreditLimitApprovalList: 'js/fakeService/manager.credit.limit.approval.list.js',
    getCreditLimitApplyDetail: 'js/fakeService/manager.credit.limit.apply.detail.js',
    getCreditLimitApplyResult: 'js/fakeService/manager.credit.limit.apply.result.js',
    approveCreditLimitApply: 'js/fakeService/manager.credit.limit.apply.approve.js',
    rejectCreditLimitApply: 'js/fakeService/manager.credit.limit.apply.reject.js',
    getWarningCustomerInfo: 'js/fakeService/manager.warning.customer.info.js',
    reduceCreditLimitConfirm: 'js/fakeService/manager.reduce.customer.credit.limit.js',
    frozenCustomerMasterData: 'js/fakeService/manager.frozen.customer.master.data.js'
  }  
};

//from db.extend
sap.creditManagement.db.DB_CONST = {
  INIT : 'Ready',
  LANG : 'lang',
  SECURID : 'secur_id',
  LOCATIONPARAMS : 'location_params',
  CURRENTUSER : 'current_user',
  ROOTDIR : 'root_dir',
  SERVERURL : 'server_url',
  REMEMBEREDUSER : 'remembered_user',
  REQUESTDATA : 'request_data',
  ALLUSERS : 'all_users',
  ALLCUSTOMERS : 'all_customers',
  ALLCOLLECTIONS : 'all_collections',
  ALLORDERS : 'all_orders',
  ALLFROZENORDERS : 'all_frozen_orders',
  ALLCREDITAPPLYS : 'all_credit_applys',
  CURRENTORDER : 'current_order',
  WARNCUSTOMERS : 'warn_customers',
  WARNSUMMARIES: 'warn_summaries',
  WARNRECORDS: 'warn_records'
};

var DB_CONST = sap.creditManagement.db.DB_CONST;

//Override funtion for fake AJAX services
sap.creditManagement.ajaxRequest.prototype.send = function(obj){
  console.log('in fake AJAX send');
  var db = sap.creditManagement.db;
  if(!obj) {
    obj = this;
  }
  var type = (obj.type) ? obj.type : 'GET',
    splits = obj.url.split('/'),
    len = splits.length;

  // store the params.
  if (obj.data) {
    var queryStr = obj.url.split('?');
    var splits = queryStr[0].split('/');
    var len = splits.length;
    key = splits[len-1];
    db.setRequest(obj.data, key);//
  }
  
  obj.data["token"] = db.getSecurId();
  obj.error = obj.error ? obj.error:errorHandle;
  $.ajax({
    jsonpCallback:"jsonp_callback",
    dataType:"jsonp",
    type: "GET",
    url: db.getServerUrl() + obj.url,//http://www.ncm.dev/jsonp.php
    data: obj.data,//object, array, string .etc. "name=John&location=Boston",
    success: obj.success,
    error: obj.error
  });
};

sap.creditManagement.db.getServerUrl = function () {
  return sap.creditManagement.db.get(DB_CONST.SERVERURL);
};

/* All Users */
sap.creditManagement.db.setAllUsers = function(users) {
  sap.creditManagement.db.set(DB_CONST.ALLUSERS, users);
}
sap.creditManagement.db.getAllUsers = function() {
  return sap.creditManagement.db.get(DB_CONST.ALLUSERS);
}
/* All Customers*/
sap.creditManagement.db.setAllCustomers = function(customers) {
  for(i in customers) {
    customers[i].id = parseInt(i) + 1;
  }
  sap.creditManagement.db.set(DB_CONST.ALLCUSTOMERS, customers);
}
sap.creditManagement.db.getAllCustomers = function() {
  return sap.creditManagement.db.get(DB_CONST.ALLCUSTOMERS);
}
/**
 * {id: 1, name:'', contact:'', tel: '', creditLimit: 2000, creditUsed: 1500}
 */
sap.creditManagement.db.getCustomerById = function(id) {
  var allCustomers = this.getAllCustomers();
  return allCustomers[id - 1];
}
sap.creditManagement.db.setAllOrders = function(data) {
  sap.creditManagement.db.set(DB_CONST.ALLORDERS, data);
}
sap.creditManagement.db.getOrdersByCustomerId = function(customerId) {
  var orders = [];

  var allOrders = sap.creditManagement.db.get(DB_CONST.ALLORDERS);
  for(i in allOrders) {
    var order = allOrders[i];
    if(customerId == order.customerId) {
      orders.push(order);
    }
  }
  return orders;
}
sap.creditManagement.db.setCurrentOrder = function(order) {
  return sap.creditManagement.db.set(DB_CONST.CURRENTORDER, order);
}
sap.creditManagement.db.getCurrentOrder = function() {
  return sap.creditManagement.db.get(DB_CONST.CURRENTORDER);
}
sap.creditManagement.db.getOrderById = function(id) {
  var allOrders = sap.creditManagement.db.get(DB_CONST.ALLORDERS);
  for (var i in allOrders) {
    var order = allOrders[i];
    if (id === order.id) {
      return order;
    }
  }
}
/*sap.creditManagement.db.getAllOrders = function() {
 return sap.creditManagement.db.get(DB_CONST.ALLORDERS);
 }*/

/*Set and get all frozen orders*/
sap.creditManagement.db.setAllFrozenOrders = function(data) {
  sap.creditManagement.db.set(DB_CONST.ALLFROZENORDERS, data);
}

sap.creditManagement.db.getAllFrozenOrders = function() {
  return sap.creditManagement.db.get(DB_CONST.ALLFROZENORDERS);
}

sap.creditManagement.db.setAllCollections = function(data) {
  sap.creditManagement.db.set(DB_CONST.ALLCOLLECTIONS, data);
}

sap.creditManagement.db.getCollectionsByOrderId = function(orderId) {
  var collections = [];

  var allCollections = sap.creditManagement.db.get(DB_CONST.ALLCOLLECTIONS);
  for(i in allCollections) {
    var collection = allCollections[i];
    if(orderId == collection.orderId) {
      collections.push(collection);
    }
  }

  return collections;
}
/*sap.creditManagement.db.getAllCollections = function() {
 return sap.creditManagement.db.get(DB_CONST.ALLCOLLECTIONS);
 }*/

/*All credit usage applys*/
sap.creditManagement.db.setAllCreditApplys = function(data) {
  sap.creditManagement.db.set(DB_CONST.ALLCREDITAPPLYS, data);
}
/*Get all credit usage applys*/
sap.creditManagement.db.getAllCreditApplys = function() {
  return sap.creditManagement.db.get(DB_CONST.ALLCREDITAPPLYS);
}
/*Get the apply record according to the status and applyId*/
sap.creditManagement.db.getCreditApplyByApplyIdAndStatus = function(applyId, status) {
  status = (status == 'rejected' || status == 'approved') ? 'done' : status;
  var applyList = sap.creditManagement.db.getAllCreditApplys()[status];

  for(var i in applyList) {
    if(applyList[i].applyId == applyId) {
      return applyList[i];
    }
  }
};
/*Move one credit apply record from one list to another list*/
sap.creditManagement.db.moveCreditApply = function(applyId, status1, status2, suggestion) {
  var allApplys = sap.creditManagement.db.getAllCreditApplys();
  var fromList = allApplys[status1];
  var toList = allApplys[status2];

  for(var i in fromList) {
    if(fromList[i].applyId == applyId) {

      if('done' == status2) {//Change the record status and set the rejectedReason
        fromList[i].status = 'rejected';
        fromList[i].suggestion = suggestion;
      } else {//Change the record status
        fromList[i].status = status2;
      }
      toList.push(fromList[i]);
      //Add this record to the specific list
      fromList.splice(i, 1);
      //Remove the record from the list
      break;
    }
  }

  //Update the credit applys in the localStorage
  allApplys[status1] = fromList;
  allApplys[status2] = toList;
  sap.creditManagement.db.setAllCreditApplys(allApplys);
  return fromList;
}
//Get credit applys by customerId
sap.creditManagement.db.getApplysByCustomerId = function(customerId) {
  var applys = [];
  var allApplys = sap.creditManagement.db.getAllCreditApplys();

  for(var status in allApplys) {
    for(var i in allApplys[status]) {
      if(allApplys[status][i].customerId == customerId) {
        applys.push(allApplys[status][i]);
      }
    }
  }
  return applys;
}

sap.creditManagement.db.getApplyByApplyId = function (applyId) {
  var apply = [],
      end=false,
      allApplys = sap.creditManagement.db.getAllCreditApplys();
  
  for(var status in allApplys) {
    for(var i in allApplys[status]) {
      if(allApplys[status][i].applyId == applyId) {
        console.log('found');
        apply = allApplys[status][i];
        end = true;
        break;
      }
    }
    if (end) {
      break;
    }
  }
  return apply;
}

/*Get the frozen order record according to the applyStatus and orderId*/
sap.creditManagement.db.getFrozenOrderByOrderIdAndStatus = function(orderId, status) {
  status = (status == 'rejected' || status == 'approved') ? 'done' : status;
  var frozenOrderList = sap.creditManagement.db.getAllFrozenOrders()[status];

  for(var i in frozenOrderList) {
    if(frozenOrderList[i].orderId == orderId) {
      return frozenOrderList[i];
    }
  }
};
/*Move one credit apply record from one list to another list*/
sap.creditManagement.db.moveFrozenOrder = function(orderId, status1, status2, suggestion) {
  var allFrozenOrders = sap.creditManagement.db.getAllFrozenOrders();
  var fromList = allFrozenOrders[status1];
  var toList = allFrozenOrders[status2];
  
  for(var i in fromList) {
    if(fromList[i].orderId == orderId) {
      if('done' == status2) {//Change the record status and set the rejectedReason
        fromList[i].applyStatus = 'rejected';
        fromList[i].suggestion = suggestion;
      } else {//Change the record status
        fromList[i].applyStatus = status2;
        fromList[i].suggestion = suggestion;
      }
      toList.push(fromList[i]); //Add this record to the specific list
      fromList.splice(i, 1);  //Remove the record from the list
      break;
    }
  }
  
  //Update the credit applys in the localStorage
  allFrozenOrders[status1] = fromList;
  allFrozenOrders[status2] = toList;
  sap.creditManagement.db.setAllFrozenOrders(allFrozenOrders);

  return fromList;
}
//Get credit applys by customerId
sap.creditManagement.db.getFrozenOrdersByCustomerId = function(customerId) {
  var fozenOrders = [];
  var allFozenOrders = sap.creditManagement.db.getAllFrozenOrders();

  for(var status in allApplys) {
    for(var i in allFozenOrders[status]) {
      if(allFozenOrders[status][i].customerId == customerId) {
        fozenOrders.push(allFozenOrders[status][i]);
      }
    }
  }
  return fozenOrders;
}

sap.creditManagement.db.getProductsByOrderIdAndStatus = function(orderId, status) {
  status = (status == 'rejected' || status == 'approved') ? 'done' : status;
  var orders = sap.creditManagement.db.getAllFrozenOrders()[status];
  var products = [];

  for(var i in orders) {
    if(orderId == orders[i].orderId) {
      products = orders[i].productList;
    }
  }
  return products;
}
/*Get all approved credit approval list */
sap.creditManagement.db.getApprovedList = function () {
  var doneApplys = sap.creditManagement.db.getAllCreditApplys()['done'];
  var approvalList = [];
  for (var i = 0; i < doneApplys.length; i++) {
    if (doneApplys[i].status === 'approved') {
      approvalList.push(doneApplys[i]);
    }
  }
  return approvalList;
};
/*Get rejected credit approval list */
sap.creditManagement.db.getRejectedList = function () {
  var doneApplys = sap.creditManagement.db.getAllCreditApplys()['done'];
  var approvalList = [];
  for (var i = 0; i < doneApplys.length; i++) {
    if (doneApplys[i].status === 'rejected') {
      approvalList.push(doneApplys[i]);
    }
  }
  return approvalList;
};
/*Get undo credit approval list */
sap.creditManagement.db.getCreditApprovalListByStatus = function (status) {
  var creditApprovalList = [];
  switch (status) {
  case 'undo':
    creditApprovalList = sap.creditManagement.db.getAllCreditApplys()['waiting'];
    break;
  case 'done':
    creditApprovalList = sap.creditManagement.db.getAllCreditApplys()['done'];
    break;
  case 'approved':
    creditApproveList = sap.creditManagement.db.getApprovedApplys();
    break;
  case 'rejected':
    creditApprovalList = sap.creditManagement.db.getRejectedList();
    break;
  default:
    break;
  }
  return creditApprovalList;
};
/*Get done credit approvel list*/
sap.creditManagement.db.getApprovedList = function () {
  return sap.creditManagement.db.getAllCreditApplys()['done'];
}

/*Waring customers setter and getter method*/
sap.creditManagement.db.setWarningCustomers = function (warningCustomers) {
  sap.creditManagement.db.set(DB_CONST.WARNCUSTOMERS, warningCustomers);
}
sap.creditManagement.db.getAllWarningCustomers = function () {
  return sap.creditManagement.db.get(DB_CONST.WARNCUSTOMERS);
}
/*Get warning customer by id*/
sap.creditManagement.db.getWarningCustomerById = function (id) {
  var warningCustomers = sap.creditManagement.db.getAllWarningCustomers();
  var warnList = warningCustomers['warningList'];
  var processedList = warningCustomers['processed'];
  
  for (i in warnList) {
    if (warnList[i].id == id) {
      return warnList[i];
    }
  }
  for (i in processedList) {
    if (processedList[i].id == id) {
      return processedList[i];
    }
  }
}
/*Warning summaries setter and getter method*/
sap.creditManagement.db.setAllCustomerWarningSummary = function(data) {
  sap.creditManagement.db.set(DB_CONST.WARNSUMMARIES, data);
}
sap.creditManagement.db.getAllCustomerWarningSummary = function() {
  return sap.creditManagement.db.get(DB_CONST.WARNSUMMARIES);
}
/*Get warning summary by customerId*/
sap.creditManagement.db.getWarningSummaryById = function(id) {
  var warningSummaries = sap.creditManagement.db.getAllCustomerWarningSummary()['warningSummaries'];
  for (i in warningSummaries) {
    if (warningSummaries[i].warningSummaryId == id) {
      return warningSummaries[i].warningSummary;
    }
  }
}

/*Warning Records setter and getter method*/
sap.creditManagement.db.setWarningRecords = function (data) {
  sap.creditManagement.db.set(DB_CONST.WARNRECORDS, data);
}
sap.creditManagement.db.getWarningRecords = function () {
  return sap.creditManagement.db.get(DB_CONST.WARNRECORDS);
}

/*Get warning record by id*/
sap.creditManagement.db.getWarningRecordById = function(id) {
  var warningRecords = sap.creditManagement.db.getWarningRecords()['list'];
  console.log('getWarningRecords');
  console.log(warningRecords);
  for (var i in warningRecords) {
    if (warningRecords[i].warningId == id) {
      return warningRecords[i];
    }
  }
}
