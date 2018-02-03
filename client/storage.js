module.exports = {
  addJsonObject: function(json, key, value, maxNum) {
    if (!maxNum) maxNum = 999999999;
    json = common.delJsonObject(json, key);
    while (Object.getOwnPropertyNames(json).length >= maxNum) {
      for (var i in json) {
        delete json[i];
        break;
      }
    }
    json[key] = value;
    return json;
  },
  delJsonObject: function(json, key) {
    if (json[key]) {
      delete json[key];
    }
    return json;
  },
  addJsonArray: function(json, obj, maxNum) {
    if (!maxNum) maxNum = 999999999;
    json = common.delJsonArray(json, obj);
    while (json.length >= maxNum) {
      json.shift();
    }
    json.push(obj);
    return json;
  },
  delJsonArray: function(json, obj) {
    for (var i in json) {
      if (JSON.stringify(json[i]) == JSON.stringify(obj)) {
        json.splice(i, 1);
        break;
      }
    }
    return json;
  },
  addLocalStorage: function(key, obj, maxNum) {
    var json = common.getLocalStorage(key);
    json = common.addJsonArray(json, obj, maxNum);
    common.setLocalStorage(key, json);
  },
  addLocalStorageObj: function(key, name, value, maxNum) {
    var json = common.getLocalStorageObj(key);
    json = common.addJsonObject(json, name, value, maxNum);
    common.setLocalStorage(key, json);
  },
  setLocalStorage: function(key, json) {
    if (typeof json != "string") {
      json = JSON.stringify(json);
    }
    localStorage.setItem(key, json);
  },
  getLocalStorage: function(key) {
    var json;
    var value = localStorage.getItem(key);
    if (value) {
      try {
        json = JSON.parse(value);
        if (!(json instanceof Array)) {
          json = new Array();
        }
      } catch (e) {
        json = new Array();
      }
    } else {
      json = new Array();
    }
    return json;
  },
  getLocalStorageObj: function(key) {
    var json;
    var value = localStorage.getItem(key);
    if (value) {
      try {
        json = JSON.parse(value);
        if (json instanceof Array) {
          json = json[0] ? json[0] : new Object();
        }
      } catch (e) {
        json = new Object();
      }
    } else {
      json = new Object();
    }
    return json;
  },
  delLocalStorage: function(key, obj) {
    if (obj) {
      var json = common.getLocalStorage(key);
      json = common.delJsonArray(json, obj);
      common.setLocalStorage(key, json);
    } else {
      localStorage.removeItem(key);
    }
  },
  addSessionStorage: function(key, name, value, maxNum) {
    var json = common.getSessionStorage(key);
    json = common.addJsonObject(json, name, value, maxNum);
    common.setSessionStorage(key, json);
  },
  setSessionStorage: function(key, json) {
    if (typeof json != "string") {
      json = JSON.stringify(json);
    }
    sessionStorage.setItem(key, json);
  },
  getSessionStorage: function(key) {
    var json;
    var value = sessionStorage.getItem(key);
    if (value) {
      try {
        json = JSON.parse(value);
        if (json instanceof Array) {
          json = json[0] ? json[0] : new Object();
        }
      } catch (e) {
        json = new Object();
      }
    } else {
      json = new Object();
    }
    return json;
  },
  delSessionStorage: function(key, name) {
    if (name) {
      var json = common.getSessionStorage(key);
      json = common.delJsonObject(json, name);
      common.setSessionStorage(key, json);
    } else {
      sessionStorage.removeItem(key);
    }
  },
}