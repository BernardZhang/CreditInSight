/**
 * (c) Copyright 2012 SAP AG. All rights reserved
 *
 * Summary: Provides initual data for Credit Management System.
 *
 * Dependency files: Jquery.js;common.js;db.extend.js
 *
 */
function onDeviceReady() {
  //check network connection
  creditManagement.checkConnection();
  //Get service domain from user preference

  sap.creditManagement.PGPlugin.getNcmPreference(creditManagement.PGPlugin.serviceDomainSuccess,
                                             creditManagement.PGPlugin.serviceDomainFail,
                                             creditManagement.PGPlugin.CONST.SERVERDOMAIN
                                             );
}

document.addEventListener("deviceready", onDeviceReady, false);

(function(){
  var lang,
      langUrl = sap.creditManagement.CONST_DATA.langUrl;
  creditManagement = sap.creditManagement;
  //set default language
  lang = navigator.language;
  if (!lang) {
    //use default language if can't get navigator language
    lang = creditManagement.CONST_DATA.defaultLanguage;
  }
  sap.creditManagement.db.setLang(lang);
  console.log('Default language set:' + lang);

  //TODO:: comes from server,loading langs file
  langUrl = langUrl.sapformate(lang.toLowerCase());
  if(location.href.indexOf("modules/") === -1){
    langUrl = "<script src='js/langs/"+langUrl+"'></script>";
  }
  else {
    langUrl = "<script src='../../js/langs/"+langUrl+"'></script>";
  }
  $("head").append(langUrl);
  
  
  //debug model related
  if(creditManagement.CONST_DATA.debug){
      if(location.href.indexOf("modules/") === -1){
        $("head").append("<script src='js/fakeService/fake.data.js'></script>")
        .append("<script src='js/fakeService/fake.member.js'></script>")
        .append("<script src='js/fakeService/init.js'></script>");
      }
      else{
        $("head").append("<script src='../../js/fakeService/fake.data.js'></script>")
        .append("<script src='../../js/fakeService/fake.member.js'></script>")
        .append("<script src='../../js/fakeService/init.js'></script>");
      }
  }
  
  //binding the click event on link in order to pass params.
  $(document).delegate('a', 'vclick', function() {
    creditManagement.saveLocationParams($(this));
  });
  
  //Binding the click event on logout button
  $(document).delegate('.logout', 'vclick', function() {
    sap.creditManagement.logout();
  });

  if(!creditManagement.CONST_DATA.debug && (undefined === navigator.network)) {
    console.log('Normal browser, debug off');
    creditManagement.db.setServerUrl(sap.creditManagement.CONST_DATA.serviceDomain);
  }
})();
