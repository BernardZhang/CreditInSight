// Store Server URL
if (sap.creditManagement.CONST_DATA.debug) {
  var reg = new RegExp();
  reg = /www.*/g;
  sap.creditManagement.db.setServerUrl(location.href.replace(reg, 'www/'));
  sap.creditManagement.db.setServerUrl(location.href.indexOf("modules") > -1 ? "../../" : "");
}
fakeData();