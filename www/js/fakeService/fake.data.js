/**
  * (c) Copyright 2012 SAP AG. All rights reserved
  *
  * Summary: Initial fake data in localstorage.
  *
  * Dependency files: Jquery.js; db.js;
  *
  * Author: Quentin Yang
  */
fakeData = (function() {
  return function(){
    if (! sap.creditManagement.db.getAllUsers()) {
      console.log('Start to prepare data');
      // user info
      var users = {
        c : {username: 'c', password: 'c', role: 'Customer Representative', id: 1},//id refer to customer id.
        s : {username: 's', password: 's', role: 'Sales', id:2},
        m : {username: 'm', password: 'm', role: 'Manager', id:3},
        collector : {username: 'collector', password: 'collector', role: 'Collector',id:4},
        admin : {username: 'admin', password: 'admin', role: 'Admin', id:5}
      };
      
      sap.creditManagement.db.setAllUsers(users);
      
      // Customer info, generate id automatically by the array index.
      var customers = [
        {name: '苏宁电器', contact: '张庆亮', tel: '021-1234567', beforeAdjust: 20000, creditLimit: 20000, creditUsed: 1000, unit: 'CNY', 'unread': 'true'},
        {name: '家乐福', contact: '张百胜', tel: '021-1234567', beforeAdjust: 20000, creditLimit: 25000, creditUsed: 10000, unit: 'CNY', 'unread': 'true'},
        {name: '沃尔玛', contact: '马晓波', tel: '021-1234567', beforeAdjust: 20000, creditLimit: 20000, creditUsed: 8000, unit: 'CNY', 'unread': 'true'},
        {name: '国美电器', contact: '陈美琪', tel: '021-1234567', beforeAdjust: 20000, creditLimit: 20000, creditUsed: 8000, unit: 'CNY', 'unread': 'true'},
        {name: '永乐电器', contact: '李乐', tel: '021-1234567', beforeAdjust: 20000, creditLimit: 25000, creditUsed: 16000, unit: 'CNY', 'unread': 'true'},
        {name: '欧尚超市', contact: '杨永善', tel: '021-1234567', beforeAdjust: 25000, creditLimit: 20000, creditUsed: 15000, unit: 'CNY', 'unread': 'true'},
      ];
      
      sap.creditManagement.db.setAllCustomers(customers);
      
      // Orders info and Collections info
      var orders = [
        {id: 'S010099230', amount: 7000, unit: 'CNY', date: '2011-02-06', status: '逾期未处理', customerId: 1, 'unread': 'true',},
        {id: 'S010099231', amount: 2500, unit: 'CNY', date: '2011-07-06', status: '逾期未处理', customerId: 1, 'unread': 'true',},
        {id: 'S010099232', amount: 2600, unit: 'CNY', date: '2011-11-26', status: '逾期未处理', customerId: 1, 'unread': 'true',},
        {id: 'S010099233', amount: 3000, unit: 'CNY', date: '2012-03-16', status: '逾期未处理', customerId: 2, 'unread': 'true',},
        {id: 'S010099234', amount: 2000, unit: 'CNY', date: '2011-02-06', status: '逾期未处理', customerId: 2, 'unread': 'true',},
        {id: 'S010099235', amount: 2500, unit: 'CNY', date: '2011-07-06', status: '逾期未处理', customerId: 3, 'unread': 'true',},
        {id: 'S010099236', amount: 2600, unit: 'CNY', date: '2011-11-26', status: '逾期未处理', customerId: 3, 'unread': 'true',},
        {id: 'S010099237', amount: 3000, unit: 'CNY', date: '2012-03-16', status: '逾期未处理', customerId: 4, 'unread': 'true',}
       ];
      sap.creditManagement.db.setAllOrders(orders);
      
      var collections = [
        {id: 1, orderId: 'S010099230', dunDate: '2011-04-05', promisedAmount: 2000, unit: 'CNY', promisedDate: '2011-04-20', collector:'Tom'},
        {id: 2, orderId: 'S010099230', dunDate: '2011-04-21', promisedAmount: 2000, unit: 'CNY', promisedDate: '2011-05-01', collector:'Lily'},
        {id: 3, orderId: 'S010099230', dunDate: '2011-05-02', promisedAmount: 2000, unit: 'CNY', promisedDate: '2011-05-10', collector:'Sky'},
        {id: 4, orderId: 'S010099231', dunDate: '2011-07-10', promisedAmount: 2000, unit: 'CNY', promisedDate: '2011-07-20', collector:'Jacky'},
        {id: 5, orderId: 'S010099231', dunDate: '2011-07-21', promisedAmount: 2000, unit: 'CNY', promisedDate: '2011-07-30', collector:'Lucky'},
      ];
      sap.creditManagement.db.setAllCollections(collections);
      
      //Credit usage apply info
      var sale_creditApplyList = {
        "undo" : [ {
          'applyId' : 'a_014',
          'customerId' : 1,
          'customerName' : '苏宁电器',
          'date' : '2012-03-16',
          'creditRequestAmount' : 1000,
          'status' : 'undo',
          'reason' : '近期有需要集中签订几笔大的订单，信用额度可能不够，希望能提高额度。',
          'rejectedReason': '',
          'suggestion' : '',
          'analystSuggest' : '',
          'priority' : 'h',
          'unread': 'true',
        }, {//credit apply for frozen order.
          'applyId' : 'f_014',
          'customerId' : 1,
          'customerName' : '苏宁电器',
          'date' : '2011-12-16',
          'creditRequestAmount' : 2000,
          'status' : 'undo',
          'reason' : '近期有需要集中签订几笔大的订单，信用额度可能不够，希望能提高额度。',
          'rejectedReason': '',
          'suggestion' : '',
          'analystSuggest' : '',
          'priority' : 'h',
          'orderId': 'S010099230',
          'unread': 'true',
        }, {
          'applyId' : 'a_024',
          'customerId' : 2,
          'customerName' : '家乐福',
          'date' : '2012-03-16',
          'creditRequestAmount' : 2000,
          'status' : 'undo',
          'reason' : '近期有需要集中签订几笔大的订单，信用额度可能不够，希望能提高额度。',
          'rejectedReason': '',
          'suggestion' : '',
          'analystSuggest' : '',
          'priority' : 'n',
          'unread': 'true',
        }, {
          'applyId' : 'a_034',
          'customerId' : 3,
          'customerName' : '沃尔玛超市',
          'date' : '2012-03-16',
          'creditRequestAmount' : 3000,
          'status' : 'undo',
          'reason' : '近期有需要集中签订几笔大的订单，信用额度可能不够，希望能提高额度。',
          'rejectedReason': '',
          'suggestion' : '',
          'analystSuggest' : '',
          'priority' : 'l',
          'unread': 'true',
        }, {
          'applyId' : 'a_035',
          'customerId' : 4,
          'customerName' : '国美电器',
          'date' : '2012-03-17',
          'creditRequestAmount' : 1000,
          'status' : 'undo',
          'reason' : '近期有需要集中签订几笔大的订单，信用额度可能不够，希望能提高额度。',
          'rejectedReason': '',
          'suggestion' : '',
          'analystSuggest' : '',
          'priority' : 'h',
          'unread': 'true',
        } ],
        "waiting" : [ {
          'applyId' : 'a_010',
          'customerId' : 1,
          'customerName' : '苏宁电器',
          'date' : '2012-01-15',
          'creditRequestAmount' : 3000,
          'status' : 'waiting',
          'reason' : '近期有需要集中签订几笔大的订单，信用额度可能不够，希望能提高额度。',
          'rejectedReason': '',
          'suggestion' : '该客户过去一年内信用不良，建议拒绝客户的额度申请。',
          'analystSuggest' : '',
          'priority' : 'h',
          'unread': 'true',
        }, {
          'applyId' : 'a_020',
          'customerId' : 2,
          'customerName' : '家乐福',
          'date' : '2012-04-16',
          'creditRequestAmount' : 2500,
          'status' : 'waiting',
          'reason' : '近期有需要集中签订几笔大的订单，信用额度可能不够，希望能提高额度。',
          'rejectedReason': '',
          'suggestion' : '',
          'analystSuggest' : '',
          'priority' : 'h',
          'unread': 'true',
        }, {
          'applyId' : 'a_030',
          'customerId' : 3,
          'customerName' : '沃尔玛超市',
          'date' : '2012-05-01',
          'creditRequestAmount' : 1500,
          'status' : 'waiting',
          'reason' : '近期有需要集中签订几笔大的订单，信用额度可能不够，希望能提高额度。',
          'rejectedReason': '',
          'suggestion' : '',
          'analystSuggest' : '',
          'priority' : 'h',
          'unread': 'true',
        } ],
        "done" : [ {
          'applyId' : 'a_012',
          'customerId' : 1,
          'customerName' : '苏宁电器',
          'date' : '2012-04-15',
          'creditRequestAmount' : 1000,
          'status' : 'rejected',
          'reason' : '近期有需要集中签订几笔大的订单，信用额度可能不够，希望能提高额度。',
          'rejectedReason': '',
          'suggestion' : '您有一笔订单到期未付款，请先付款。',
          'analystSuggest' : '',
          'priority' : 'h',
          'unread': 'true',
        }, {
          'applyId' : 'a_021',
          'customerId' : 2,
          'customerName' : '家乐福',
          'date' : '2012-02-16',
          'creditRequestAmount' : 2000,
          'status' : 'approved',
          'reason' : '近期有需要集中签订几笔大的订单，信用额度可能不够，希望能提高额度。',
          'rejectedReason': '',
          'suggestion' : '',
          'analystSuggest' : '',
          'priority' : 'h',
          'unread': 'true',
        }, {
          'applyId' : 'a_032',
          'customerId' : 3,
          'customerName' : '沃尔玛超市',
          'date' : '2012-01-17',
          'creditRequestAmount' : 3000,
          'status' : 'rejected',
          'reason' : '近期有需要集中签订几笔大的订单，信用额度可能不够，希望能提高额度。',
          'rejectedReason': '',
          'suggestion' : '您有一笔订单到期未付款，请先付款。',
          'analystSuggest' : '',
          'priority' : 'h',
          'unread': 'true',
        } ]
      };
      sap.creditManagement.db.setAllCreditApplys(sale_creditApplyList);
      
      //Frozen orders info 
      var frozenOrders = {
        'undo' : [{
          'orderId' : 'S1100120000', 'orderAmount' : 10000, 'orderStatus' : '逾期未付款', 'orderDate' : '20120501',
          'customerId' : 1, 'expectation' : '+6500',
          'productList' : [{'productName' : '电烤箱', 'productNo' : 'BX11220', 'productNum' : 10, 'productPrice' : 350},
                           {'productName' : '微波炉', 'productNo' : 'KT93093', 'productNum' : 10, 'productPrice' : 650}],
  
          'applyDate' : 20120415, 'applyStatus' : 'undo', 
          'applyPriority' : 'n', 'applyReason' : '近期有需要集中签订几笔大的订单，信用额度可能不够，希望能提高额度。',
          'applyCreditRequestAmount' : 5000, 'applySuggestion' : '您有一笔订单到期未付款，请先付款。','unread': 'true',
        }, { 
          'orderId' : 'S1100120010',  'orderAmount' : 18000,  'orderStatus' : '逾期未付款', 'orderDate' : '20120501',
          'customerId' : 2, 'expectation' : '+6500',
          'productList' : [{'productName' : '电冰箱', 'productNo' : 'BX12220', 'productNum' : 2, 'productPrice' : 3000},
                           {'productName' : '洗衣机', 'productNo' : 'KT98093', 'productNum' : 3, 'productPrice' : 4000}],
  
          'applyDate' : 20120415, 'applyStatus' : 'undo', 'applyPriority' : 'h', 
          'applyReason' : '近期有需要集中签订几笔大的订单，信用额度可能不够，希望能提高额度。',
          'applyCreditRequestAmount' : 3000, 'applySuggestion' : '您有一笔订单到期未付款，请先付款。', 'unread': 'true',
        }, {
          'orderId' : 'S1100120020', 'orderAmount' : 12000, 'orderStatus' : '逾期未付款', 'orderDate' : '20120501',
          'customerId' : 3, 'expectation' : '+6500',
          'productList' : [{'productName' : '微波炉', 'productNo' : 'BX10220', 'productNum' : 10, 'productPrice' : 400},
                           {'productName' : '照相机', 'productNo' : 'KT99093', 'productNum' : 1, 'productPrice' : 1000}],
         
          'applyDate' : 20120415, 'applyStatus' : 'undo', 'applyPriority' : 'h',
          'applyReason' : '近期有需要集中签订几笔大的订单，信用额度可能不够，希望能提高额度。',
          'applyCreditRequestAmount' : 2000, 'applySuggestion' : '您有一笔订单到期未付款，请先付款。', 'unread': 'true',
        }],
        
        'waiting' : [{
          'orderId' : 'S1100120012', 'orderAmount' : 85000, 'orderStatus' : '逾期未付款', 'orderDate' : '20120501',
          'customerId' : 2, 'expectation' : '+6500',
          'productList' : [{'productName' : '洗衣机', 'productNo' : 'BX10220', 'productNum' : 1, 'productPrice' : 3000},
                           {'productName' : 'iPhone', 'productNo' : 'KT99093', 'productNum' : 1, 'productPrice' : 5500}],
  
          'applyDate' : 20120415, 'applyStatus' : 'waiting', 'applyPriority' : 'h',
          'applyReason' : '近期有需要集中签订几笔大的订单，信用额度可能不够，希望能提高额度。',
          'applyCreditRequestAmount' : 4000, 'applySuggestion' : '您有一笔订单到期未付款，请先付款。', 'unread': 'true',
        }, {
          'orderId' : 'S1100120021', 'orderAmount' : 4000, 'orderStatus' : '逾期未付款', 'orderDate' : '20120502',
          'customerId' : 3, 'expectation' : '+6500',
          'productList' : [{'productName' : '洗衣机', 'productNo' : 'BX10220', 'productNum' : 13, 'productPrice' : 3000},
                           {'productName' : 'iPhone', 'productNo' : 'KT99093', 'productNum' : 1, 'productPrice' : 5500}],
          'applyDate' : 20120415, 'applyStatus' : 'waiting', 'applyPriority' : 'h',
          'applyReason' : '近期有需要集中签订几笔大的订单，信用额度可能不够，希望能提高额度。',
          'applyCreditRequestAmount' : 4000, 'applySuggestion' : '您有一笔订单到期未付款，请先付款。', 'unread': 'true',
        }, {
          'orderId' : 'S1100120022', 'orderAmount' : 14000, 'orderStatus' : '逾期未付款', 'orderDate' : '20120503',
          'customerId' : 3, 'expectation' : '+6500',
          'productList' : [{'productName' : '洗衣机', 'productNo' : 'BX10220', 'productNum' : 1, 'productPrice' : 3000},
                           {'productName' : 'iPhone', 'productNo' : 'KT99093', 'productNum' : 2, 'productPrice' : 5500}],
          'applyDate' : 20120415, 'applyStatus' : 'waiting', 'applyPriority' : 'h',
          'applyReason' : '近期有需要集中签订几笔大的订单，信用额度可能不够，希望能提高额度。',
          'applyCreditRequestAmount' : 6000, 'applySuggestion' : '您有一笔订单到期未付款，请先付款。', 'unread': 'true',
        }],
  
        'done' : [{
            'orderId' : 'S1100120001', 'orderAmount' : 20000, 'orderStatus' : '逾期未付款', 'orderDate' : '20120502',
            'customerId' : 1, 'expectation' : '+6500',
            'productList' : [{'productName' : '洗衣机', 'productNo' : 'BX10220', 'productNum' : 3, 'productPrice' : 3000}, 
                             {'productName' : 'iPhone', 'productNo' : 'KT99093', 'productNum' : 2, 'productPrice' : 5500}],
    
            'applyDate' : 20120415, 'applyStatus' : 'approved', 
            'applyPriority' : 'h', 'applyReason' : '近期有需要集中签订几笔大的订单，信用额度可能不够，希望能提高额度。',
            'applyCreditRequestAmount' : 10000, 'applySuggestion' : '您有一笔订单到期未付款，请先付款。', 'unread': 'true',
          }, { 
            'orderId' : 'S1100120002', 'orderAmount' : 8000, 'orderStatus' : '逾期未付款', 'orderDate' : '20120503',
            'customerId' : 1, 'expectation' : '+6500',
            'productList' : [{'productName' : '洗衣机', 'productNo' : 'BX10220', 'productNum' : 1, 'productPrice' : 3000},
                             {'productName' : 'iPhone', 'productNo' : 'KT99093', 'productNum' : 1, 'productPrice' : 5000}],
  
             'applyDate' : 20120415, 'applyStatus' : 'rejected', 'applyPriority' : 'h', 
             'applyReason' : '近期有需要集中签订几笔大的订单，信用额度可能不够，希望能提高额度。',
             'applyCreditRequestAmount' : 4000, 'applySuggestion' : '您有一笔订单到期未付款，请先付款。', 'unread': 'true',
          }, {
            'orderId' : 'S1100120011', 'orderAmount' : 14000, 'orderStatus' : '逾期未付款', 'orderDate' : '20120501',
            'customerId' : 2, 'expectation' : '+6500',
            'productList' : [{'productName' : '洗衣机', 'productNo' : 'BX10220', 'productNum' : 3, 'productPrice' : 3000},
                             {'productName' : 'iPhone', 'productNo' : 'KT99093', 'productNum' : 1, 'productPrice' : 5000}],
  
            'applyDate' : 20120415, 'applyStatus' : 'approved', 'applyPriority' : 'h',
            'applyReason' : '近期有需要集中签订几笔大的订单，信用额度可能不够，希望能提高额度。',
            'applyCreditRequestAmount' : 4000, 'applySuggestion' : '您有一笔订单到期未付款，请先付款。', 'unread': 'true',
          }]
      };
      sap.creditManagement.db.setAllFrozenOrders(frozenOrders);
      
      var warningCustomers = {
        warningList: [
          {id: 1, name: '苏宁电器', customerCode: 'C00110', date: '2012-04-16', endDate: '', degree: 'caution', companyCode: 'A00201', warningSummaryId: 1, action: '', warningReason: '您已超过30天没有生成订单', processResult: ''},
          {id: 2, name: '家乐福', customerCode: 'C00111', date:'2012-05-16', endDate: '', degree: 'caution', companyCode: 'A00202', warningSummaryId: 2, action: '', warningReason: '您已超过30天没有生成订单', processResult: ''},
          {id: 3, name: '沃尔玛', customerCode: 'C00112', date:'2012-06-16', endDate: '', degree: 'caution', companyCode: 'A00203', warningSummaryId: 3, action: '', warningReason: '您已超过30天没有生成订单', processResult: ''}
        ],
        processed: [
          {id: 4, name: '国美电器', customerCode: 'C00113', date: '2012-07-16', endDate: '2012-08-16', degree: 'alert', companyCode: 'A00204', warningSummaryId: 4, action: 'frozen', warningReason: '您已超过30天没有生成订单', processResult: ''},
          {id: 5, name: '永乐电器', customerCode: 'C00114', date: '2012-08-16', endDate: '2012-09-16', degree: 'alert', companyCode: 'A00205', warningSummaryId: 5, action: 'frozen', warningReason: '您已超过30天没有生成订单', processResult: ''},
          {id: 6, name: '欧尚超市', customerCode: 'C00115', date: '2012-09-16', endDate: '2012-10-16', degree: 'risk', companyCode: 'A00206', warningSummaryId: 6, action: 'minus', warningReason: '您已超过30天没有生成订单', processResult: ''}
        ]
      };
      sap.creditManagement.db.setWarningCustomers(warningCustomers);
      
      var customerWarningSummary = {
       warningSummaries: [
         {
           'warningSummaryId': 1,
           'warningSummary': {
             'orderMoneyChangeRate': {'value':0.4,disable:false,warningLevel:'注意','warningReason':'预警原因',
                                      'history':[
                                                {date:'2012-03-05',value:0.1},
                                                {date:'2012-04-05',value:0.4},
                                                {date:'2012-04-25',value:0.3},
                                                {date:'2012-05-05',value:0.1},
                                                {date:'2012-05-15',value:0.9},
                                                {date:'2012-06-13',value:0.7},
                                                {date:'2012-06-25',value:0.3}
                                                ], 
                                      'params':[0.2,0.4,0.5,1]},
             'withoutOrderTime': {'value':20, disable:true,warningLevel:'注意', 'warningReason':'预警原因',
                                      'history':[
                                                {date:'2012-03-05',value:30},
                                                {date:'2012-04-05',value:40},
                                                {date:'2012-04-25',value:55},
                                                {date:'2012-05-05',value:66},
                                                {date:'2012-05-15',value:28},
                                                {date:'2012-06-13',value:79},
                                                {date:'2012-06-25',value:54}
                                                ],
                                      params:[20,60,70,100]},
             'oweMoney': {value:300000, disable:false,warningLevel:'注意', warningReason:'预警原因', 
                                      history:[
                                                {date:'2012-03-05',value:300000},
                                                {date:'2012-04-05',value:400000},
                                                {date:'2012-04-25',value:550000},
                                                {date:'2012-05-05',value:660000},
                                                {date:'2012-05-15',value:280000},
                                                {date:'2012-06-13',value:790000},
                                                {date:'2012-06-25',value:540000}
                                                ], 
                                      params:[200000,600000,700000,1000000]},
             'oweMoneyTime': {value:50,disable:false,warningLevel:'注意',warningReason:'预警原因', 
                                      history:[
                                                {date:'2012-03-05',value:30},
                                                {date:'2012-04-05',value:40},
                                                {date:'2012-04-25',value:55},
                                                {date:'2012-05-05',value:66},
                                                {date:'2012-05-15',value:28},
                                                {date:'2012-06-13',value:79},
                                                {date:'2012-06-25',value:54}
                                                ],
                                      params:[20,60,80,100]},
             'contractBreakRate': {value:0.2, disable:false,warningLevel:'注意', warningReason:'预警原因', 
                                      history:[
                                                {date:'2012-03-05',value:0.1},
                                                {date:'2012-04-05',value:0.4},
                                                {date:'2012-04-25',value:0.3},
                                                {date:'2012-05-05',value:0.1},
                                                {date:'2012-05-15',value:0.9},
                                                {date:'2012-06-13',value:0.7},
                                                {date:'2012-06-25',value:0.3}
                                                ], 
                                      params:[0.1,0.6,0.8,1]}
           }
         },
         {
           'warningSummaryId': 2,
           'warningSummary': {
             'orderMoneyChangeRate': {'value':0.4,disable:false,warningLevel:'警戒','warningReason':'预警原因',
                                      'history':[
                                                {date:'2012-03-05',value:0.1},
                                                {date:'2012-04-05',value:0.4},
                                                {date:'2012-04-25',value:0.3},
                                                {date:'2012-05-05',value:0.1},
                                                {date:'2012-05-15',value:0.9},
                                                {date:'2012-06-13',value:0.7},
                                                {date:'2012-06-25',value:0.3}
                                                ], 
                                      'params':[0.1,0.6,0.8,1]},
             'withoutOrderTime': {'value':20, disable:false,warningLevel:'警戒', 'warningReason':'预警原因',
                                      'history':[
                                                {date:'2012-03-05',value:30},
                                                {date:'2012-04-05',value:40},
                                                {date:'2012-04-25',value:55},
                                                {date:'2012-05-05',value:66},
                                                {date:'2012-05-15',value:28},
                                                {date:'2012-06-13',value:79},
                                                {date:'2012-06-25',value:54}
                                                ],
                                      params:[20,60,70,100]},
             'oweMoney': {value:1000000, disable:false,warningLevel:'警戒', warningReason:'预警原因', 
                                      history:[
                                                {date:'2012-03-05',value:380000},
                                                {date:'2012-04-05',value:480000},
                                                {date:'2012-04-25',value:580000},
                                                {date:'2012-05-05',value:680000},
                                                {date:'2012-05-15',value:280000},
                                                {date:'2012-06-13',value:780000},
                                                {date:'2012-06-25',value:580000}
                                                ], 
                                      params:[200000,600000,700000,1000000]},
             'oweMoneyTime': {value:50,disable:true,warningLevel:'警戒',warningReason:'预警原因', 
                                      history:[
                                                {date:'2012-03-05',value:30},
                                                {date:'2012-04-05',value:40},
                                                {date:'2012-04-25',value:55},
                                                {date:'2012-05-05',value:66},
                                                {date:'2012-05-15',value:28},
                                                {date:'2012-06-13',value:79},
                                                {date:'2012-06-25',value:54}
                                                ],
                                      params:[20,60,80,100]},
             'contractBreakRate': {value:0.4, disable:false,warningLevel:'警戒', warningReason:'预警原因', 
                                      history:[
                                                {date:'2012-03-05',value:0.1},
                                                {date:'2012-04-05',value:0.4},
                                                {date:'2012-04-25',value:0.3},
                                                {date:'2012-05-05',value:0.1},
                                                {date:'2012-05-15',value:0.9},
                                                {date:'2012-06-13',value:0.7},
                                                {date:'2012-06-25',value:0.3}
                                                ], 
                                      params:[0.2,0.4,0.5,1]}
           }
         },
         {
           'warningSummaryId': 3,
           'warningSummary': {
             'orderMoneyChangeRate': {'value':0.3,disable:false,warningLevel:'危险','warningReason':'预警原因',
                                      'history':[
                                                {date:'2012-03-05',value:0.1},
                                                {date:'2012-04-05',value:0.4},
                                                {date:'2012-04-25',value:0.3},
                                                {date:'2012-05-05',value:0.1},
                                                {date:'2012-05-15',value:0.9},
                                                {date:'2012-06-13',value:0.7},
                                                {date:'2012-06-25',value:0.3}
                                                ], 
                                      'params':[0.1,0.7,0.9,1]},
             'withoutOrderTime': {'value':20, disable:false,warningLevel:'危险', 'warningReason':'预警原因',
                                      'history':[
                                                {date:'2012-03-05',value:30},
                                                {date:'2012-04-05',value:40},
                                                {date:'2012-04-25',value:55},
                                                {date:'2012-05-05',value:66},
                                                {date:'2012-05-15',value:28},
                                                {date:'2012-06-13',value:79},
                                                {date:'2012-06-25',value:54}
                                                ],
                                      params:[20,60,70,100]},
             'oweMoney': {value:700000, disable:true,warningLevel:'危险', warningReason:'预警原因', 
                                      history:[
                                                {date:'2012-03-05',value:380000},
                                                {date:'2012-04-05',value:480000},
                                                {date:'2012-04-25',value:580000},
                                                {date:'2012-05-05',value:680000},
                                                {date:'2012-05-15',value:280000},
                                                {date:'2012-06-13',value:780000},
                                                {date:'2012-06-25',value:580000}
                                                ], 
                                      params:[200000,600000,700000,1000000]},
             'oweMoneyTime': {value:50,disable:false,warningLevel:'危险',warningReason:'预警原因', 
                                      history:[
                                                {date:'2012-03-05',value:30},
                                                {date:'2012-04-05',value:40},
                                                {date:'2012-04-25',value:55},
                                                {date:'2012-05-05',value:66},
                                                {date:'2012-05-15',value:28},
                                                {date:'2012-06-13',value:79},
                                                {date:'2012-06-25',value:54}
                                                ],
                                      params:[20,60,80,100]},
             'contractBreakRate': {value:0.8,disable:false, warningLevel:'危险', warningReason:'预警原因', 
                                      history:[
                                                {date:'2012-03-05',value:0.1},
                                                {date:'2012-04-05',value:0.4},
                                                {date:'2012-04-25',value:0.3},
                                                {date:'2012-05-05',value:0.1},
                                                {date:'2012-05-15',value:0.9},
                                                {date:'2012-06-13',value:0.7},
                                                {date:'2012-06-25',value:0.3}
                                                ], 
                                      params:[0.2,0.3,0.5,1]}
           }
         },
         {
           'warningSummaryId': 4,
           'warningSummary': {
             'orderMoneyChangeRate': {'value':0.4,disable:false,warningLevel:'注意','warningReason':'预警原因',
                                      'history':[
                                                {date:'2012-03-05',value:0.1},
                                                {date:'2012-04-05',value:0.4},
                                                {date:'2012-04-25',value:0.3},
                                                {date:'2012-05-05',value:0.1},
                                                {date:'2012-05-15',value:0.9},
                                                {date:'2012-06-13',value:0.7},
                                                {date:'2012-06-25',value:0.3}
                                                ], 
                                      'params':[0.2,0.4,0.5,1]},
             'withoutOrderTime': {'value':20, disable:true,warningLevel:'注意', 'warningReason':'预警原因',
                                      'history':[
                                                {date:'2012-03-05',value:30},
                                                {date:'2012-04-05',value:40},
                                                {date:'2012-04-25',value:55},
                                                {date:'2012-05-05',value:66},
                                                {date:'2012-05-15',value:28},
                                                {date:'2012-06-13',value:79},
                                                {date:'2012-06-25',value:54}
                                                ],
                                      params:[20,60,70,100]},
             'oweMoney': {value:300000, disable:false,warningLevel:'注意', warningReason:'预警原因', 
                                      history:[
                                                {date:'2012-03-05',value:380000},
                                                {date:'2012-04-05',value:800000},
                                                {date:'2012-04-25',value:870005},
                                                {date:'2012-05-05',value:680000},
                                                {date:'2012-05-15',value:280000},
                                                {date:'2012-06-13',value:810000},
                                                {date:'2012-06-25',value:580000}
                                                ], 
                                      params:[300000,600000,700000,1000000]},
             'oweMoneyTime': {value:50,disable:false,warningLevel:'注意',warningReason:'预警原因', 
                                      history:[
                                                {date:'2012-03-05',value:30},
                                                {date:'2012-04-05',value:40},
                                                {date:'2012-04-25',value:55},
                                                {date:'2012-05-05',value:66},
                                                {date:'2012-05-15',value:28},
                                                {date:'2012-06-13',value:79},
                                                {date:'2012-06-25',value:54}
                                                ],
                                      params:[20,60,80,100]},
             'contractBreakRate': {value:0.2, disable:false,warningLevel:'注意', warningReason:'预警原因', 
                                      history:[
                                                {date:'2012-03-05',value:0.1},
                                                {date:'2012-04-05',value:0.4},
                                                {date:'2012-04-25',value:0.3},
                                                {date:'2012-05-05',value:0.1},
                                                {date:'2012-05-15',value:0.9},
                                                {date:'2012-06-13',value:0.7},
                                                {date:'2012-06-25',value:0.3}
                                                ],
                                      params:[0.1,0.6,0.8,1]}
           }
         },
         {
           'warningSummaryId': 5,
           'warningSummary': {
             'orderMoneyChangeRate': {'value':0.4,disable:false,warningLevel:'警戒','warningReason':'预警原因',
                                      'history':[
                                                {date:'2012-03-05',value:0.1},
                                                {date:'2012-04-05',value:0.4},
                                                {date:'2012-04-25',value:0.3},
                                                {date:'2012-05-05',value:0.1},
                                                {date:'2012-05-15',value:0.9},
                                                {date:'2012-06-13',value:0.7},
                                                {date:'2012-06-25',value:0.3}
                                                ], 
                                      'params':[0.1,0.6,0.8,1]},
             'withoutOrderTime': {'value':20, disable:false,warningLevel:'警戒', 'warningReason':'预警原因',
                                      'history':[
                                                {date:'2012-03-05',value:30},
                                                {date:'2012-04-05',value:40},
                                                {date:'2012-04-25',value:55},
                                                {date:'2012-05-05',value:66},
                                                {date:'2012-05-15',value:28},
                                                {date:'2012-06-13',value:79},
                                                {date:'2012-06-25',value:54}
                                                ],
                                      params:[20,60,70,100]},
             'oweMoney': {value:600000, disable:false,warningLevel:'警戒', warningReason:'预警原因', 
                                      history:[
                                                {date:'2012-03-05',value:350000},
                                                {date:'2012-04-05',value:450000},
                                                {date:'2012-04-25',value:550000},
                                                {date:'2012-05-05',value:650000},
                                                {date:'2012-05-15',value:250000},
                                                {date:'2012-06-13',value:750000},
                                                {date:'2012-06-25',value:550000}
                                                ], 
                                      params:[150000,600000,700000,1000000]},
             'oweMoneyTime': {value:50,disable:true,warningLevel:'警戒',warningReason:'预警原因', 
                                      history:[
                                                {date:'2012-03-05',value:30},
                                                {date:'2012-04-05',value:40},
                                                {date:'2012-04-25',value:55},
                                                {date:'2012-05-05',value:66},
                                                {date:'2012-05-15',value:28},
                                                {date:'2012-06-13',value:79},
                                                {date:'2012-06-25',value:54}
                                                ],
                                      params:[20,60,80,100]},
             'contractBreakRate': {value:0.4, disable:false,warningLevel:'警戒', warningReason:'预警原因', 
                                      history:[
                                                {date:'2012-03-05',value:0.1},
                                                {date:'2012-04-05',value:0.4},
                                                {date:'2012-04-25',value:0.3},
                                                {date:'2012-05-05',value:0.1},
                                                {date:'2012-05-15',value:0.9},
                                                {date:'2012-06-13',value:0.7},
                                                {date:'2012-06-25',value:0.3}
                                                ], 
                                      params:[0.2,0.4,0.5,1]}
           }
         },
         {
           'warningSummaryId': 6,
           'warningSummary': {
             'orderMoneyChangeRate': {'value':0.3,disable:false,warningLevel:'危险','warningReason':'预警原因',
                                      'history':[
                                                {date:'2012-03-05',value:0.1},
                                                {date:'2012-04-05',value:0.4},
                                                {date:'2012-04-25',value:0.3},
                                                {date:'2012-05-05',value:0.1},
                                                {date:'2012-05-15',value:0.9},
                                                {date:'2012-06-13',value:0.7},
                                                {date:'2012-06-25',value:0.3}
                                                ], 
                                      'params':[0.1,0.7,0.9,1]},
             'withoutOrderTime': {'value':20, disable:false,warningLevel:'危险', 'warningReason':'预警原因',
                                      'history':[
                                                {date:'2012-03-05',value:30},
                                                {date:'2012-04-05',value:40},
                                                {date:'2012-04-25',value:77},
                                                {date:'2012-05-05',value:33},
                                                {date:'2012-05-15',value:75},
                                                {date:'2012-06-13',value:97},
                                                {date:'2012-06-25',value:45}
                                                ],
                                      params:[20,60,70,100]},
             'oweMoney': {value:700000, disable:true,warningLevel:'危险', warningReason:'预警原因', 
                                      history:[
                                                {date:'2012-03-05',value:340000},
                                                {date:'2012-04-05',value:440000},
                                                {date:'2012-04-25',value:540000},
                                                {date:'2012-05-05',value:640000},
                                                {date:'2012-05-15',value:240000},
                                                {date:'2012-06-13',value:740000},
                                                {date:'2012-06-25',value:540000}
                                                ], 
                                      params:[350000,600000,700000,1000000]},
             'oweMoneyTime': {value:50,disable:false,warningLevel:'危险',warningReason:'预警原因', 
                                      history:[
                                                {date:'2012-03-05',value:30},
                                                {date:'2012-04-05',value:40},
                                                {date:'2012-04-25',value:77},
                                                {date:'2012-05-05',value:33},
                                                {date:'2012-05-15',value:75},
                                                {date:'2012-06-13',value:97},
                                                {date:'2012-06-25',value:45}
                                                ],
                                      params:[20,60,80,100]},
             'contractBreakRate': {value:0.8,disable:false, warningLevel:'危险', warningReason:'预警原因', 
                                      history:[
                                                {date:'2012-03-05',value:0.1},
                                                {date:'2012-04-05',value:0.4},
                                                {date:'2012-04-25',value:0.3},
                                                {date:'2012-05-05',value:0.1},
                                                {date:'2012-05-15',value:0.9},
                                                {date:'2012-06-13',value:0.7},
                                                {date:'2012-06-25',value:0.3}
                                                ], 
                                      params:[0.2,0.3,0.5,1]}
           }
         }
       ]
      };
      sap.creditManagement.db.setAllCustomerWarningSummary(customerWarningSummary);
      
      var warningRecords = {
        list:[
                {
                  warningId: 1,
                  action: 'frozen',
                  date: '2012-04-05',
                  level:'alert',
                  customerId: 4  
                },
                {
                  warningId: 2,
                  action: 'frozen',
                  date: '2012-04-06',
                  level:'alert',
                  customerId: 5  
                },
                {
                  warningId: 3,
                  action: 'minus',
                  date: '2012-04-06',
                  level:'risk',
                  customerId: 6,  
                }
              ]
      };
      sap.creditManagement.db.setWarningRecords(warningRecords);
      
      // TODO ADD Others data ...
      console.log('Finish preparing data');
    } else {
      console.log('data already exists');
    }
  }
})();

