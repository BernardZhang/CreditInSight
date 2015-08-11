$(document).delegate("#common_homepage", "pageinit", function() {
  $('#clear_cache').live('click', function(){
    sap.creditManagement.db.destory();
    console.log('clear cache');
  });
});
