/**
 * (c) Copyright 2012 SAP AG. All rights reserved
 *
 * Summary: Provides PhoneGAP custom plugin JavaScript functions in Credit Management System.
 *
 * Dependency files: Jquery.js;common.js;db.extend.js
 *
 * Author: Patrick Qian
 */
(function() {
 sap.creditManagement.PGPlugin = {};
  var PGPlugin = sap.creditManagement.PGPlugin;
  var CONST = {
    SERVERDOMAIN : 'serverDomain'
  };
  PGPlugin.CONST = CONST;

  /**
   * Summary: Get user preference by key
   *
   * params:
   *  @success: function, required.
   *  @fail: function, required.
   *  @key: string, required. User preference key
   *
   * return: 
   *  N/A
   */
  PGPlugin.getNcmPreference = function (success, fail, key) {
    if(sap.creditManagement.CONST_DATA.debug){
      console.log("PGPlugin.getNcmPreference called.");
    }
    Cordova.exec(success, fail, "AppPreference", "getNcmPreference", [key]);
  };

  /**
   * Summary: Success callback for getting service domain.
   *
   * params:
   *  @data: string, required.
   *
   * return: 
   *  N/A
   */
  PGPlugin.serviceDomainSuccess = function(data) {
    if(sap.creditManagement.CONST_DATA.debug){
      console.log("PGPlugin.serviceDomainSuccess with data: "+data);
    }
    else if (data) {
      sap.creditManagement.db.setServerUrl(data);
    }
    else {
      console.log("PGPlugin.serviceDomainSuccess with wrong data: "+data);
    }
  }

  /**
   * Summary: Fail callback for getting service domain.
   *
   * params:
   *  @data: string, required.
   *
   * return: 
   *  N/A
   */
 PGPlugin.serviceDomainFail = function(data) {
 sap.creditManagement.sapAlert('fail called');
    if(sap.creditManagement.CONST_DATA.debug){
      console.log("PGPlugin.serviceDomainFail with data: "+data);
    }
  }
})();
