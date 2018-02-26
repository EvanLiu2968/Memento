function isString(string) {
  return typeof string === 'string'
}

function isArray(obj) {
  return Array.isArray(obj)
}

function isFunction(obj) {
  return typeof obj === 'function'
}

function isPlainObject(obj) {
  var key;
  var hasOwn = ({}).hasOwnProperty;
  if (typeof obj !== "object" || obj.nodeType || (obj != null && obj === obj.window)) {
    return false;
  }
  if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype || {}, "isPrototypeOf")) {
    return false;
  }
  for (key in obj) {}

  return key === undefined || hasOwn.call(obj, key);
}

function extend() {
  var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;
  if (typeof target === "boolean") {
    deep = target;
    target = arguments[i] || {};
    i++;
  }
  if (typeof target !== "object" && !isFunction(target)) {
    target = {};
  }
  if (i === length) {
    target = this;
    i--;
  }
  for (; i < length; i++) {
    if ((options = arguments[i]) != null) {
      for (name in options) {
        src = target[name];
        copy = options[name];
        if (target === copy) {
          continue;
        }
        if (deep && copy && (isPlainObject(copy) ||
            (copyIsArray = isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && isArray(src) ? src : [];
          } else {
            clone = src && isPlainObject(src) ? src : {};
          }
          target[name] = extend(deep, clone, copy);
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }
  return target;
}

module.exports = {
  extend
}