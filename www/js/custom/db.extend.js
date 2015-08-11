/**
 * (c) Copyright 2012 SAP AG. All rights reserved
 *
 * Summary: Provides interfaces to access localstorage data
 *
 * Dependency files: Jquery.js;common.js
 *
 */

/**
 * Key to access localstorage data
 */
(function() {
  var DB_CONST = {
    INIT : 'Ready',
    LANG : 'language_code',
    SECURID : 'secur_id',
    LOCATIONPARAMS : 'location_params',
    CURRENTUSER : 'current_user',
    ROOTDIR : 'root_dir',
    REQUESTDATA : 'ajax_data',
    SERVERURL : 'server_url',
    REMEMBEREDUSER : 'remembered_user',
    CURRENTLISTTAB : 'current_list_tab'
  };
  sap.creditManagement.db.DB_CONST = DB_CONST;
  var db = sap.creditManagement.db;

  /**
   * Set security ID
   * 
   * params:
   *  @id: string, required. security ID
   *
   * return: 
   *  N/A
   */
  db.setSecurId = function(id) {
    db.set(DB_CONST.SECURID, id);
  }
  /**
   * Get security ID
   * 
   * params:
   *  N/A
   *
   * return: 
   *  security ID
   */
  db.getSecurId = function() {
    return db.get(DB_CONST.SECURID);
  }
  /**
   * Set language code
   * 
   * params:
   *  @lang: string, required.
   *
   * return: 
   *  N/A
   */
  db.setLang = function(lang) {
    db.set(DB_CONST.LANG, lang);
  }
  /**
   * Get language code
   * 
   * params:
   *  N/A
   *
   * return: 
   *  language code
   */
  db.getLang = function() {
    return db.get(DB_CONST.LANG);
  }

  /**
   * Set parameters in URI
   * 
   * params:
   *  @params: object, required.
   *
   * return: 
   *  N/A
   */
  db.setLocationParams = function(key, params) {
    db.set(DB_CONST.LOCATIONPARAMS + '_' + key, params);
  };
  /**
   * Get parameters in URI
   * 
   * params:
   *  N/A
   *
   * return: 
   *  parameters object in URI
   */
  db.getLocationParams = function(key) {
    return db.get(DB_CONST.LOCATIONPARAMS + '_' + key);
  };

  /**
   * Set root directory
   * 
   * params:
   *  @rootDir: string, required.
   *
   * return: 
   *  N/A
   */
  db.setRootDir = function(rootDir) {
    db.set(DB_CONST.ROOTDIR, rootDir);
  }
  /**
   * Get root directory
   * 
   * params:
   *  N/A
   *
   * return: 
   *  root directory
   */
  db.getRootDir = function() {
    return db.get(DB_CONST.ROOTDIR);
  }

  /**
   * Set current selected tab
   * 
   * params:
   *  @listTab: string, required.
   *
   * return: 
   *  N/A
   */
  db.setListTab = function(listTab) {
    db.set(DB_CONST.CURRENTLISTTAB, listTab);
  }

  /**
   * Get current selected tab
   * 
   * params:
   *  N/A
   *
   * return: 
   *  selected tab token
   */
  db.getListTab = function() {
    return db.get(DB_CONST.CURRENTLISTTAB);
  }

  /**
   * Set server URL
   * 
   * params:
   *  @url: string, required.
   *
   * return: 
   *  N/A
   */
  db.setServerUrl = function(url) {
    db.set(DB_CONST.SERVERURL, url);
  }
  /**
   * Get server URL
   * 
   * params:
   *  N/A
   *
   * return: 
   *  server URL
   */
  db.getServerUrl = function() {
    return db.get(DB_CONST.SERVERURL);
  };

  /**
   * Set current user
   * 
   * params:
   *  @user: object, required.
   *
   * return: 
   *  N/A
   */
  db.setCurrentUser = function(user) {
    return db.set(DB_CONST.CURRENTUSER, user);
  };
  /**
   * Get current user
   * 
   * params:
   *  N/A
   *
   * return: 
   *  current user
   */
  db.getCurrentUser = function() {
    return db.get(DB_CONST.CURRENTUSER);
  }
  /**
   * Get current user role
   * 
   * params:
   *  N/A
   *
   * return: 
   *  current user role
   */
  db.getCurrentUserRole = function() {
    var user = db.getCurrentUser();
    return user.role;
  }

  /**
   * Set user by remember me option
   * 
   * params:
   *  @user: object, required.
   *
   * return: 
   *  N/A
   */
  db.setRememberedUser = function(user) {
    db.set(DB_CONST.REMEMBEREDUSER, user);
  }
  /**
   * Get username & password by remember me option
   * 
   * params:
   *  N/A
   *
   * return: 
   *  object with username, password
   */
  db.getRememberedUser = function() {
    return db.get(DB_CONST.REMEMBEREDUSER);
  }
  /**
   * Save AJAX data into local storage
   *
   * params:
   *  @request: object, required.  The AJAX data
   *  @key: object, required.  URI key
   *
   * return: 
   *  N/A
   */
  db.setRequest = function(request, key) {
    db.set(DB_CONST.REQUESTDATA, request);
    db.set(DB_CONST.REQUESTDATA + '_' + key, request);
  };
  /**
   * Get AJAX data from local storage
   * 
   * params:
   *  @key: object, required.  URI key
   *
   * return: 
   *  object with AJAX data
   */
  db.getRequest = function(key) {
    if(key) {
      return db.get(DB_CONST.REQUESTDATA + '_' + key);
    }
    return db.get(DB_CONST.REQUESTDATA);
  };
  //NOTES:: functions support fake services shoule be written in fakeService/init.js
})()