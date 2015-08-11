==TODO List==
 - Defined service API
 - localStorage API and data defined.
 - template file
 - service API URL 尽量设计得易于修改
 
 

== Database ==
prefix: sapdnancm_
$.db
$.db.set(key, value)
$.db.get(key)
= localStorage =
prefix: sapdnancm_

data:
request_data
  e.g., {"name":"c","password":"c","isRemember":true}
ROOT_DIR
  e.g., "file:///C:/workspace/SVN/credit/iPhone/branch/0.2/www-0.2/"
all_users
  e.g., {"c":{"username":"c","password":"c","role":"customer"},"s":{"username":"s","password":"s","role":"sale"},"m":{"username":"m","password":"m","role":"manager"},"collector":{"username":"collector","password":"collector","role":"collector"},"admin":{"username":"admin","password":"admin","role":"admin"}}
current_user
  e.g., {"username":"c","password":"c","role":"customer"}
  
  

== refactor 2.0 style changes ==
Adding: svn\ncm\Branch\iphone-refactor-0.2\ncm\www\css\library.css  
Adding: svn\ncm\Branch\iphone-refactor-0.2\ncm\www\css\reset.css  
Adding: svn\ncm\Branch\iphone-refactor-0.2\ncm\www\images\back_btn_2.png  application/octet-stream
Adding: svn\ncm\Branch\iphone-refactor-0.2\ncm\www\images\back_btn_2_hover.png  application/octet-stream
Adding: svn\ncm\Branch\iphone-refactor-0.2\ncm\www\images\go_btn_2.png  application/octet-stream
Adding: svn\ncm\Branch\iphone-refactor-0.2\ncm\www\images\go_btn_2_hover.png  application/octet-stream
Modified: svn\ncm\Branch\iphone-refactor-0.2\ncm\www\index.html  
Modified: svn\ncm\Branch\iphone-refactor-0.2\ncm\www\js\custom\template.js  
Modified: svn\ncm\Branch\iphone-refactor-0.2\ncm\www\modules\customer\css\customer.css  
Modified: svn\ncm\Branch\iphone-refactor-0.2\ncm\www\modules\customer\customer-credit-apply-create.html  
Modified: svn\ncm\Branch\iphone-refactor-0.2\ncm\www\modules\customer\customer-credit-apply-detail.html  
Modified: svn\ncm\Branch\iphone-refactor-0.2\ncm\www\modules\customer\customer-credit-apply-list.html  
Modified: svn\ncm\Branch\iphone-refactor-0.2\ncm\www\modules\customer\customer-credit-check.html  
Modified: svn\ncm\Branch\iphone-refactor-0.2\ncm\www\modules\customer\customer-unpaid-order-detail.html  
Modified: svn\ncm\Branch\iphone-refactor-0.2\ncm\www\modules\customer\index.html  
Modified: svn\ncm\Branch\iphone-refactor-0.2\ncm\www\modules\customer\js\customer.js  
Modified: svn\ncm\Branch\iphone-refactor-0.2\ncm\www\templates\collect-record-template.html  
Modified: svn\ncm\Branch\iphone-refactor-0.2\ncm\www\templates\customer-credit-apply-result-template.html  
Modified: svn\ncm\Branch\iphone-refactor-0.2\ncm\www\templates\homepage-template.html  
Modified: svn\ncm\Branch\iphone-refactor-0.2\ncm\www\templates\list-customer-credit-apply-list-template.html  
Modified: svn\ncm\Branch\iphone-refactor-0.2\ncm\www\templates\list-order-records-template.html  
Modified: svn\ncm\Branch\iphone-refactor-0.2\ncm\www\templates\new-credit-apply-template.html  
Modified: svn\ncm\Branch\iphone-refactor-0.2\ncm\www\templates\order-detail-template.html  
Modified: svn\ncm\Branch\iphone-refactor-0.2\ncm\www\templates\order-info-template.html    