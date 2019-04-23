module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "01f9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("2d00");
var $export = __webpack_require__("5ca1");
var redefine = __webpack_require__("2aba");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var $iterCreate = __webpack_require__("41a0");
var setToStringTag = __webpack_require__("7f20");
var getPrototypeOf = __webpack_require__("38fd");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "07e3":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "0a90":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("63b6");
var $parseFloat = __webpack_require__("10ff");
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), { parseFloat: $parseFloat });


/***/ }),

/***/ "0bfb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__("cb7c");
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ "0d58":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("ce10");
var enumBugKeys = __webpack_require__("e11e");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "0fc9":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("3a38");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "10ff":
/***/ (function(module, exports, __webpack_require__) {

var $parseFloat = __webpack_require__("e53d").parseFloat;
var $trim = __webpack_require__("a1ce").trim;

module.exports = 1 / $parseFloat(__webpack_require__("e692") + '-0') !== -Infinity ? function parseFloat(str) {
  var string = $trim(String(str), 3);
  var result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;


/***/ }),

/***/ "1495":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var anObject = __webpack_require__("cb7c");
var getKeys = __webpack_require__("0d58");

module.exports = __webpack_require__("9e1e") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "1654":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__("71c1")(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__("30f1")(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),

/***/ "1691":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "1af6":
/***/ (function(module, exports, __webpack_require__) {

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = __webpack_require__("63b6");

$export($export.S, 'Array', { isArray: __webpack_require__("9003") });


/***/ }),

/***/ "1bc3":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("f772");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "1ec9":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("f772");
var document = __webpack_require__("e53d").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "20fd":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__("d9f6");
var createDesc = __webpack_require__("aebd");

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),

/***/ "230e":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var document = __webpack_require__("7726").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "241e":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__("25eb");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "25eb":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "294c":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "2aba":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var has = __webpack_require__("69a8");
var SRC = __webpack_require__("ca5a")('src');
var $toString = __webpack_require__("fa5b");
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__("8378").inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "2aeb":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__("cb7c");
var dPs = __webpack_require__("1495");
var enumBugKeys = __webpack_require__("e11e");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__("230e")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__("fab2").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "2b4c":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("5537")('wks');
var uid = __webpack_require__("ca5a");
var Symbol = __webpack_require__("7726").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "2d00":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "2d95":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "30f1":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("b8e3");
var $export = __webpack_require__("63b6");
var redefine = __webpack_require__("9138");
var hide = __webpack_require__("35e8");
var Iterators = __webpack_require__("481b");
var $iterCreate = __webpack_require__("8f60");
var setToStringTag = __webpack_require__("45f2");
var getPrototypeOf = __webpack_require__("53e2");
var ITERATOR = __webpack_require__("5168")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "32a6":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__("241e");
var $keys = __webpack_require__("c3a1");

__webpack_require__("ce7e")('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),

/***/ "32e9":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var createDesc = __webpack_require__("4630");
module.exports = __webpack_require__("9e1e") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "32fc":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("e53d").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "335c":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("6b4c");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "35e8":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("d9f6");
var createDesc = __webpack_require__("aebd");
module.exports = __webpack_require__("8e60") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "36c3":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("335c");
var defined = __webpack_require__("25eb");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "3702":
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__("481b");
var ITERATOR = __webpack_require__("5168")('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),

/***/ "3846":
/***/ (function(module, exports, __webpack_require__) {

// 21.2.5.3 get RegExp.prototype.flags()
if (__webpack_require__("9e1e") && /./g.flags != 'g') __webpack_require__("86cc").f(RegExp.prototype, 'flags', {
  configurable: true,
  get: __webpack_require__("0bfb")
});


/***/ }),

/***/ "38fd":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__("69a8");
var toObject = __webpack_require__("4bf8");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "3a38":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "40c3":
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__("6b4c");
var TAG = __webpack_require__("5168")('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ "41a0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__("2aeb");
var descriptor = __webpack_require__("4630");
var setToStringTag = __webpack_require__("7f20");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__("32e9")(IteratorPrototype, __webpack_require__("2b4c")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "4588":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "45f2":
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__("d9f6").f;
var has = __webpack_require__("07e3");
var TAG = __webpack_require__("5168")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "4630":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "481b":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "4bf8":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "4ee1":
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__("5168")('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),

/***/ "5168":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("dbdb")('wks');
var uid = __webpack_require__("62a0");
var Symbol = __webpack_require__("e53d").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "53e2":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__("07e3");
var toObject = __webpack_require__("241e");
var IE_PROTO = __webpack_require__("5559")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "549b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__("d864");
var $export = __webpack_require__("63b6");
var toObject = __webpack_require__("241e");
var call = __webpack_require__("b0dc");
var isArrayIter = __webpack_require__("3702");
var toLength = __webpack_require__("b447");
var createProperty = __webpack_require__("20fd");
var getIterFn = __webpack_require__("7cd6");

$export($export.S + $export.F * !__webpack_require__("4ee1")(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),

/***/ "5537":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("8378");
var global = __webpack_require__("7726");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("2d00") ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "5559":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("dbdb")('keys');
var uid = __webpack_require__("62a0");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "584a":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.5' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "59ad":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("7be7");

/***/ }),

/***/ "5b4e":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("36c3");
var toLength = __webpack_require__("b447");
var toAbsoluteIndex = __webpack_require__("0fc9");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "5ca1":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var core = __webpack_require__("8378");
var hide = __webpack_require__("32e9");
var redefine = __webpack_require__("2aba");
var ctx = __webpack_require__("9b43");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "5d6b":
/***/ (function(module, exports, __webpack_require__) {

var $parseInt = __webpack_require__("e53d").parseInt;
var $trim = __webpack_require__("a1ce").trim;
var ws = __webpack_require__("e692");
var hex = /^[-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;


/***/ }),

/***/ "613b":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("5537")('keys');
var uid = __webpack_require__("ca5a");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "626a":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("2d95");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "62a0":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "63b6":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("e53d");
var core = __webpack_require__("584a");
var ctx = __webpack_require__("d864");
var hide = __webpack_require__("35e8");
var has = __webpack_require__("07e3");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "6821":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("626a");
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "69a8":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "6a99":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("d3f4");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "6b4c":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "6b54":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("3846");
var anObject = __webpack_require__("cb7c");
var $flags = __webpack_require__("0bfb");
var DESCRIPTORS = __webpack_require__("9e1e");
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  __webpack_require__("2aba")(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (__webpack_require__("79e5")(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}


/***/ }),

/***/ "71c1":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("3a38");
var defined = __webpack_require__("25eb");
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),

/***/ "7445":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("63b6");
var $parseInt = __webpack_require__("5d6b");
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), { parseInt: $parseInt });


/***/ }),

/***/ "7726":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "774e":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("d2d5");

/***/ }),

/***/ "77f1":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("4588");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "794b":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("8e60") && !__webpack_require__("294c")(function () {
  return Object.defineProperty(__webpack_require__("1ec9")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "79aa":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "79e5":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "7be7":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("0a90");
module.exports = __webpack_require__("584a").parseFloat;


/***/ }),

/***/ "7cd6":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("40c3");
var ITERATOR = __webpack_require__("5168")('iterator');
var Iterators = __webpack_require__("481b");
module.exports = __webpack_require__("584a").getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ "7e90":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("d9f6");
var anObject = __webpack_require__("e4ae");
var getKeys = __webpack_require__("c3a1");

module.exports = __webpack_require__("8e60") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "7f20":
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__("86cc").f;
var has = __webpack_require__("69a8");
var TAG = __webpack_require__("2b4c")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "7f7f":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc").f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || __webpack_require__("9e1e") && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});


/***/ }),

/***/ "8378":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.5' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "84f2":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "86cc":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("cb7c");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var toPrimitive = __webpack_require__("6a99");
var dP = Object.defineProperty;

exports.f = __webpack_require__("9e1e") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "8aae":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("32a6");
module.exports = __webpack_require__("584a").Object.keys;


/***/ }),

/***/ "8bbf":
/***/ (function(module, exports) {

module.exports = require("vue");

/***/ }),

/***/ "8e60":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("294c")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "8f60":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__("a159");
var descriptor = __webpack_require__("aebd");
var setToStringTag = __webpack_require__("45f2");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__("35e8")(IteratorPrototype, __webpack_require__("5168")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "9003":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__("6b4c");
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),

/***/ "9138":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("35e8");


/***/ }),

/***/ "9b43":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("d8e8");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "9c6c":
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__("2b4c")('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__("32e9")(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "9def":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("4588");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "9e1e":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("79e5")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "a159":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__("e4ae");
var dPs = __webpack_require__("7e90");
var enumBugKeys = __webpack_require__("1691");
var IE_PROTO = __webpack_require__("5559")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__("1ec9")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__("32fc").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "a1ce":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("63b6");
var defined = __webpack_require__("25eb");
var fails = __webpack_require__("294c");
var spaces = __webpack_require__("e692");
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),

/***/ "a21f":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("584a");
var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
module.exports = function stringify(it) { // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};


/***/ }),

/***/ "a2a9":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "a4bb":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("8aae");

/***/ }),

/***/ "a745":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("f410");

/***/ }),

/***/ "ac6a":
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__("cadf");
var getKeys = __webpack_require__("0d58");
var redefine = __webpack_require__("2aba");
var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var wks = __webpack_require__("2b4c");
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),

/***/ "aebd":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "b0dc":
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__("e4ae");
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),

/***/ "b447":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("3a38");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "b8e3":
/***/ (function(module, exports) {

module.exports = true;


/***/ }),

/***/ "b9e9":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("7445");
module.exports = __webpack_require__("584a").parseInt;


/***/ }),

/***/ "be13":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "c2a3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_editSlide_vue_vue_type_style_index_0_id_3fa5860a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d4e5");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_editSlide_vue_vue_type_style_index_0_id_3fa5860a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_editSlide_vue_vue_type_style_index_0_id_3fa5860a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_editSlide_vue_vue_type_style_index_0_id_3fa5860a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "c366":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("6821");
var toLength = __webpack_require__("9def");
var toAbsoluteIndex = __webpack_require__("77f1");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "c3a1":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("e6f3");
var enumBugKeys = __webpack_require__("1691");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "c69a":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("9e1e") && !__webpack_require__("79e5")(function () {
  return Object.defineProperty(__webpack_require__("230e")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "ca5a":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "cadf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__("9c6c");
var step = __webpack_require__("d53b");
var Iterators = __webpack_require__("84f2");
var toIObject = __webpack_require__("6821");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__("01f9")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "cb7c":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "ce10":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("69a8");
var toIObject = __webpack_require__("6821");
var arrayIndexOf = __webpack_require__("c366")(false);
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "ce7e":
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__("63b6");
var core = __webpack_require__("584a");
var fails = __webpack_require__("294c");
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),

/***/ "d2d5":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("1654");
__webpack_require__("549b");
module.exports = __webpack_require__("584a").Array.from;


/***/ }),

/***/ "d3f4":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "d4e5":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "d53b":
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "d593":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_readSlide_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a2a9");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_readSlide_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_readSlide_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_css_loader_index_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_readSlide_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "d864":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("79aa");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "d8e8":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "d9f6":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("e4ae");
var IE8_DOM_DEFINE = __webpack_require__("794b");
var toPrimitive = __webpack_require__("1bc3");
var dP = Object.defineProperty;

exports.f = __webpack_require__("8e60") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "dbdb":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("584a");
var global = __webpack_require__("e53d");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("b8e3") ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "e11e":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "e4ae":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("f772");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "e53d":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "e692":
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),

/***/ "e6f3":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("07e3");
var toIObject = __webpack_require__("36c3");
var arrayIndexOf = __webpack_require__("5b4e")(false);
var IE_PROTO = __webpack_require__("5559")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "e814":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("b9e9");

/***/ }),

/***/ "f410":
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("1af6");
module.exports = __webpack_require__("584a").Array.isArray;


/***/ }),

/***/ "f499":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("a21f");

/***/ }),

/***/ "f6fd":
/***/ (function(module, exports) {

// document.currentScript polyfill by Adam Miller

// MIT license

(function(document){
  var currentScript = "currentScript",
      scripts = document.getElementsByTagName('script'); // Live NodeList collection

  // If browser needs currentScript polyfill, add get currentScript() to the document object
  if (!(currentScript in document)) {
    Object.defineProperty(document, currentScript, {
      get: function(){

        // IE 6-10 supports script readyState
        // IE 10+ support stack trace
        try { throw new Error(); }
        catch (err) {

          // Find the second match for the "at" string to get file src url from stack.
          // Specifically works with the format of stack traces in IE.
          var i, res = ((/.*at [^\(]*\((.*):.+:.+\)$/ig).exec(err.stack) || [false])[1];

          // For all scripts on the page, if src matches or if ready state is interactive, return the script tag
          for(i in scripts){
            if(scripts[i].src == res || scripts[i].readyState == "interactive"){
              return scripts[i];
            }
          }

          // If no match, return null
          return null;
        }
      }
    });
  }
})(document);


/***/ }),

/***/ "f772":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "fa5b":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("5537")('native-function-to-string', Function.toString);


/***/ }),

/***/ "fab2":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("7726").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  if (true) {
    __webpack_require__("f6fd")
  }

  var setPublicPath_i
  if ((setPublicPath_i = window.document.currentScript) && (setPublicPath_i = setPublicPath_i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
    __webpack_require__.p = setPublicPath_i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.function.name.js
var es6_function_name = __webpack_require__("7f7f");

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/object/keys.js
var keys = __webpack_require__("a4bb");
var keys_default = /*#__PURE__*/__webpack_require__.n(keys);

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__("ac6a");

// EXTERNAL MODULE: external {"commonjs":"vue","commonjs2":"vue","root":"Vue"}
var external_commonjs_vue_commonjs2_vue_root_Vue_ = __webpack_require__("8bbf");
var external_commonjs_vue_commonjs2_vue_root_Vue_default = /*#__PURE__*/__webpack_require__.n(external_commonjs_vue_commonjs2_vue_root_Vue_);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"6a83156a-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/view/editSlide.vue?vue&type=template&id=3fa5860a&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"main",staticClass:"edit__main",on:{"click":function($event){return _vm.cancaleSelect($event)}}},[_c('div',{ref:"wrap",staticClass:"edit"},[(_vm.showRead)?_c('read-slide',{on:{"close":_vm.close}}):_vm._e(),_c('div',{ref:"ppt",staticClass:"edit__wrap"}),_c('div',{staticClass:"ppt_page"},[_vm._v("第 "+_vm._s(_vm.currentPage + 1)+" 页")]),_c('div',{staticClass:"edit__operation"},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(!_vm.showTitle),expression:"!showTitle"}],staticClass:"edit__select"},[_c('div',{staticClass:"edit__box edit__title",on:{"click":_vm.toBack}},[_c('div',{staticClass:"edit__icon back_icon"}),_c('div',{staticClass:"title_tip"},[_vm._v("上一页")])]),_c('div',{staticClass:"edit__box"},[_c('label',{staticClass:"edit__icon bac_icon"},[_c('input',{ref:"bacSource",staticStyle:{"display":"none"},attrs:{"type":"file"},on:{"change":function($event){return _vm.addImg($event, 'bacImg')}}})]),_c('div',{staticClass:"title_tip"},[_vm._v("背景")])]),_c('div',{staticClass:"edit__box edit__title",on:{"click":_vm.addTitle}},[_c('div',{staticClass:"edit__icon title_icon"}),_c('div',{staticClass:"title_tip"},[_vm._v("文本框")])]),_c('div',{staticClass:"edit__box edit__title",on:{"click":_vm.save}},[_c('div',{staticClass:"edit__icon sava_icon"}),_c('div',{staticClass:"sava_tip"},[_vm._v("保存")])]),_c('div',{staticClass:"edit__box edit__title",on:{"click":function($event){_vm.showRead=true}}},[_c('div',{staticClass:"edit__icon read_icon"}),_c('div',{staticClass:"title_tip"},[_vm._v("预览")])]),_c('div',{staticClass:"edit__box edit__title",on:{"click":_vm.addVideo}},[_c('div',{staticClass:"edit__icon video_icon"}),_c('div',{staticClass:"title_tip"},[_vm._v("视频")])]),_c('div',{staticClass:"edit__box edit__title"},[_c('label',{staticClass:"edit__icon img_icon"},[_c('input',{ref:"source",staticStyle:{"display":"none"},attrs:{"type":"file"},on:{"change":function($event){return _vm.addImg($event, 'img')}}})]),_c('div',{staticClass:"title_tip"},[_vm._v("图片")])]),_c('div',{staticClass:"edit__box edit__title",on:{"click":_vm.toNext}},[_c('div',{staticClass:"edit__icon next_icon"}),_c('div',{staticClass:"title_tip"},[_vm._v("下一页")])])]),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.showTitle),expression:"showTitle"}],staticClass:"title__operation"},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.domType==='title'),expression:"domType==='title'"}],staticClass:"edit__box",on:{"click":_vm.addBold}},[_c('div',{staticClass:"edit__icon B_icon",class:{BB_icon: _vm.currentBold==='bold'}}),_c('div',{staticClass:"title_tip"},[_vm._v("加粗")])]),(_vm.domType=='video')?[_c('div',{staticClass:"edit__box"},[_c('div',{staticClass:"title__size"},[_c('span',{staticClass:"title__name"},[_vm._v("地址:")]),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.videoSrc),expression:"videoSrc"}],staticClass:"font__input",attrs:{"type":"text"},domProps:{"value":(_vm.videoSrc)},on:{"input":function($event){if($event.target.composing){ return; }_vm.videoSrc=$event.target.value}}})])]),_c('div',{staticClass:"edit__box"},[_c('div',{staticClass:"title__size"},[_c('span',{staticClass:"title__name"},[_vm._v("模糊度")]),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.blur),expression:"blur"}],staticClass:"font__input",attrs:{"type":"text"},domProps:{"value":(_vm.blur)},on:{"input":function($event){if($event.target.composing){ return; }_vm.blur=$event.target.value}}})])])]:_vm._e(),_c('div',{staticClass:"edit__box",on:{"click":function($event){_vm.showMove= !_vm.showMove}}},[_c('div',{staticClass:"edit__icon move_icon"}),_c('div',{staticClass:"title_tip"},[_vm._v("动画")]),_c('transition',{attrs:{"name":"bounce"}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.showMove),expression:"showMove"}],staticClass:"move__select"},_vm._l((_vm.moveList),function(item,index){return _c('div',{staticClass:"move__btn",class:{slect__move: index==_vm.currentMove },on:{"click":function($event){$event.stopPropagation();return _vm.addMove(item, index)}}},[_c('span',{staticClass:"animated infinite",class:item,staticStyle:{"animation-duration":"2s"}},[_vm._v("Animate")])])}),0)])],1),_c('div',{staticClass:"edit__box"},[(_vm.domType==='title')?_c('div',{staticClass:"title__size"},[_c('span',{staticClass:"title__name"},[_vm._v("size:")]),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.fontSize),expression:"fontSize"}],staticClass:"font__input",attrs:{"type":"text"},domProps:{"value":(_vm.fontSize)},on:{"input":function($event){if($event.target.composing){ return; }_vm.fontSize=$event.target.value}}})]):_vm._e(),(_vm.domType==='img')?_c('div',{staticClass:"title__size"},[_c('span',{staticClass:"title__name"},[_vm._v("opacity:")]),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.currentOpacity),expression:"currentOpacity"}],staticClass:"font__input",attrs:{"type":"text"},domProps:{"value":(_vm.currentOpacity)},on:{"input":function($event){if($event.target.composing){ return; }_vm.currentOpacity=$event.target.value}}})]):_vm._e(),_c('div',{staticClass:"title__size"},[_c('span',{staticClass:"title__name"},[_vm._v("level:")]),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.currentLevel),expression:"currentLevel"}],staticClass:"font__input",attrs:{"type":"text"},domProps:{"value":(_vm.currentLevel)},on:{"input":function($event){if($event.target.composing){ return; }_vm.currentLevel=$event.target.value}}})])]),_c('div',{staticClass:"edit__box"},[_c('div',{staticClass:"title__size"},[_c('span',{staticClass:"title__name"},[_vm._v("宽度:")]),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.currentWidth),expression:"currentWidth"}],staticClass:"font__input",attrs:{"type":"text"},domProps:{"value":(_vm.currentWidth)},on:{"input":function($event){if($event.target.composing){ return; }_vm.currentWidth=$event.target.value}}})]),_c('div',{staticClass:"title__size"},[_c('span',{staticClass:"title__name"},[_vm._v("高度:")]),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.currentHeight),expression:"currentHeight"}],staticClass:"font__input",attrs:{"type":"text"},domProps:{"value":(_vm.currentHeight)},on:{"input":function($event){if($event.target.composing){ return; }_vm.currentHeight=$event.target.value}}})])]),_c('div',{staticClass:"edit__box"},[_c('div',{staticClass:"title__size"},[_c('span',{staticClass:"title__name",staticStyle:{"width":"100px"}},[_vm._v("出场顺序:")]),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.currentOrder),expression:"currentOrder"}],staticClass:"font__input",attrs:{"type":"text"},domProps:{"value":(_vm.currentOrder)},on:{"input":function($event){if($event.target.composing){ return; }_vm.currentOrder=$event.target.value}}})]),_c('div',{staticClass:"title__size"},[_c('span',{staticClass:"title__name",staticStyle:{"width":"100px"}},[_vm._v("离场顺序:")]),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.currentLeaveOrder),expression:"currentLeaveOrder"}],staticClass:"font__input",attrs:{"type":"text"},domProps:{"value":(_vm.currentLeaveOrder)},on:{"input":function($event){if($event.target.composing){ return; }_vm.currentLeaveOrder=$event.target.value}}})])]),_c('div',{staticClass:"edit__box"},[_c('div',{staticClass:"title__size"},[_c('span',{staticClass:"title__name"},[_vm._v("X坐标:")]),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.currentX),expression:"currentX"}],staticClass:"font__input",attrs:{"type":"text"},domProps:{"value":(_vm.currentX)},on:{"input":function($event){if($event.target.composing){ return; }_vm.currentX=$event.target.value}}})]),_c('div',{staticClass:"title__size"},[_c('span',{staticClass:"title__name"},[_vm._v("Y坐标:")]),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.currentY),expression:"currentY"}],staticClass:"font__input",attrs:{"type":"text"},domProps:{"value":(_vm.currentY)},on:{"input":function($event){if($event.target.composing){ return; }_vm.currentY=$event.target.value}}})])]),_c('div',{staticClass:"edit__box"},[_c('div',{staticClass:"title__size"},[_c('span',{staticClass:"title__name"},[_vm._v("颜色:")]),_c('span',{ref:"color1",staticClass:"color__box",on:{"click":function($event){return _vm.openColor(0, $event)}}})]),_c('div',{staticClass:"title__size"},[_c('span',{staticClass:"title__name"},[_vm._v("背景:")]),_c('span',{ref:"color2",staticClass:"color__box",on:{"click":function($event){return _vm.openColor(1, $event)}}})]),_c('transition',{attrs:{"name":"fade"}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.showColor),expression:"showColor"}],staticClass:"color__picker"},[_c('div',{ref:"color",staticClass:"cp-default cx-default"})])])],1)],2)])],1)])}
var staticRenderFns = []


// CONCATENATED MODULE: ./components/view/editSlide.vue?vue&type=template&id=3fa5860a&scoped=true&

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/parse-float.js
var parse_float = __webpack_require__("59ad");
var parse_float_default = /*#__PURE__*/__webpack_require__.n(parse_float);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/array/is-array.js
var is_array = __webpack_require__("a745");
var is_array_default = /*#__PURE__*/__webpack_require__.n(is_array);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/json/stringify.js
var stringify = __webpack_require__("f499");
var stringify_default = /*#__PURE__*/__webpack_require__.n(stringify);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/array/from.js
var from = __webpack_require__("774e");
var from_default = /*#__PURE__*/__webpack_require__.n(from);

// EXTERNAL MODULE: ./node_modules/@babel/runtime-corejs2/core-js/parse-int.js
var parse_int = __webpack_require__("e814");
var parse_int_default = /*#__PURE__*/__webpack_require__.n(parse_int);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.to-string.js
var es6_regexp_to_string = __webpack_require__("6b54");

// CONCATENATED MODULE: ./components/view/colorpicker.js



/**
 * ColorPicker - pure JavaScript color picker without using images, external CSS or 1px divs.
 * Copyright © 2011 David Durman, All rights reserved.
 */
var VueColorPicker;

(function (window, document, undefined) {
  var type = window.SVGAngle || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML",
      picker,
      slide,
      hueOffset = 15,
      svgNS = 'http://www.w3.org/2000/svg'; // This HTML snippet is inserted into the innerHTML property of the passed color picker element
  // when the no-hassle call to ColorPicker() is used, i.e. ColorPicker(function(hex, hsv, rgb) { ... });

  var colorpickerHTMLSnippet = ['<div class="picker-wrapper">', '<div class="picker"></div>', '<div class="picker-indicator"></div>', '</div>', '<div class="slide-wrapper">', '<div class="slide"></div>', '<div class="slide-indicator"></div>', '</div>'].join('');
  /**
   * Return mouse position relative to the element el.
   */

  function mousePosition(evt) {
    // IE:
    if (window.event && window.event.contentOverflow !== undefined) {
      return {
        x: window.event.offsetX,
        y: window.event.offsetY
      };
    } // Webkit:


    if (evt.offsetX !== undefined && evt.offsetY !== undefined) {
      return {
        x: evt.offsetX,
        y: evt.offsetY
      };
    } // Firefox:


    var wrapper = evt.target.parentNode.parentNode;
    return {
      x: evt.layerX - wrapper.offsetLeft,
      y: evt.layerY - wrapper.offsetTop
    };
  }
  /**
   * Create SVG element.
   */


  function $(el, attrs, children) {
    el = document.createElementNS(svgNS, el);

    for (var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }

    if (Object.prototype.toString.call(children) != '[object Array]') children = [children];
    var i = 0,
        len = children[0] && children.length || 0;

    for (; i < len; i++) {
      el.appendChild(children[i]);
    }

    return el;
  }
  /**
   * Create slide and picker markup depending on the supported technology.
   */


  if (type == 'SVG') {
    slide = $('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      version: '1.1',
      width: '100%',
      height: '100%'
    }, [$('defs', {}, $('linearGradient', {
      id: 'gradient-hsv',
      x1: '0%',
      y1: '100%',
      x2: '0%',
      y2: '0%'
    }, [$('stop', {
      offset: '0%',
      'stop-color': '#FF0000',
      'stop-opacity': '1'
    }), $('stop', {
      offset: '13%',
      'stop-color': '#FF00FF',
      'stop-opacity': '1'
    }), $('stop', {
      offset: '25%',
      'stop-color': '#8000FF',
      'stop-opacity': '1'
    }), $('stop', {
      offset: '38%',
      'stop-color': '#0040FF',
      'stop-opacity': '1'
    }), $('stop', {
      offset: '50%',
      'stop-color': '#00FFFF',
      'stop-opacity': '1'
    }), $('stop', {
      offset: '63%',
      'stop-color': '#00FF40',
      'stop-opacity': '1'
    }), $('stop', {
      offset: '75%',
      'stop-color': '#0BED00',
      'stop-opacity': '1'
    }), $('stop', {
      offset: '88%',
      'stop-color': '#FFFF00',
      'stop-opacity': '1'
    }), $('stop', {
      offset: '100%',
      'stop-color': '#FF0000',
      'stop-opacity': '1'
    })])), $('rect', {
      x: '0',
      y: '0',
      width: '100%',
      height: '100%',
      fill: 'url(#gradient-hsv)'
    })]);
    picker = $('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      version: '1.1',
      width: '100%',
      height: '100%'
    }, [$('defs', {}, [$('linearGradient', {
      id: 'gradient-black',
      x1: '0%',
      y1: '100%',
      x2: '0%',
      y2: '0%'
    }, [$('stop', {
      offset: '0%',
      'stop-color': '#000000',
      'stop-opacity': '1'
    }), $('stop', {
      offset: '100%',
      'stop-color': '#CC9A81',
      'stop-opacity': '0'
    })]), $('linearGradient', {
      id: 'gradient-white',
      x1: '0%',
      y1: '100%',
      x2: '100%',
      y2: '100%'
    }, [$('stop', {
      offset: '0%',
      'stop-color': '#FFFFFF',
      'stop-opacity': '1'
    }), $('stop', {
      offset: '100%',
      'stop-color': '#CC9A81',
      'stop-opacity': '0'
    })])]), $('rect', {
      x: '0',
      y: '0',
      width: '100%',
      height: '100%',
      fill: 'url(#gradient-white)'
    }), $('rect', {
      x: '0',
      y: '0',
      width: '100%',
      height: '100%',
      fill: 'url(#gradient-black)'
    })]);
  } else if (type == 'VML') {
    slide = ['<DIV style="position: relative; width: 100%; height: 100%">', '<v:rect style="position: absolute; top: 0; left: 0; width: 100%; height: 100%" stroked="f" filled="t">', '<v:fill type="gradient" method="none" angle="0" color="red" color2="red" colors="8519f fuchsia;.25 #8000ff;24903f #0040ff;.5 aqua;41287f #00ff40;.75 #0bed00;57671f yellow"></v:fill>', '</v:rect>', '</DIV>'].join('');
    picker = ['<DIV style="position: relative; width: 100%; height: 100%">', '<v:rect style="position: absolute; left: -1px; top: -1px; width: 101%; height: 101%" stroked="f" filled="t">', '<v:fill type="gradient" method="none" angle="270" color="#FFFFFF" opacity="100%" color2="#CC9A81" o:opacity2="0%"></v:fill>', '</v:rect>', '<v:rect style="position: absolute; left: 0px; top: 0px; width: 100%; height: 101%" stroked="f" filled="t">', '<v:fill type="gradient" method="none" angle="0" color="#000000" opacity="100%" color2="#CC9A81" o:opacity2="0%"></v:fill>', '</v:rect>', '</DIV>'].join('');
    if (!document.namespaces['v']) document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', '#default#VML');
  }
  /**
   * Convert HSV representation to RGB HEX string.
   * Credits to http://www.raphaeljs.com
   */


  function hsv2rgb(hsv) {
    var R, G, B, X, C;
    var h = hsv.h % 360 / 60;
    C = hsv.v * hsv.s;
    X = C * (1 - Math.abs(h % 2 - 1));
    R = G = B = hsv.v - C;
    h = ~~h;
    R += [C, X, 0, 0, X, C][h];
    G += [X, C, C, X, 0, 0][h];
    B += [0, 0, X, C, C, X][h];
    var r = Math.floor(R * 255);
    var g = Math.floor(G * 255);
    var b = Math.floor(B * 255);
    return {
      r: r,
      g: g,
      b: b,
      hex: "#" + (16777216 | b | g << 8 | r << 16).toString(16).slice(1)
    };
  }
  /**
   * Convert RGB representation to HSV.
   * r, g, b can be either in <0,1> range or <0,255> range.
   * Credits to http://www.raphaeljs.com
   */


  function rgb2hsv(rgb) {
    var r = rgb.r;
    var g = rgb.g;
    var b = rgb.b;

    if (rgb.r > 1 || rgb.g > 1 || rgb.b > 1) {
      r /= 255;
      g /= 255;
      b /= 255;
    }

    var H, S, V, C;
    V = Math.max(r, g, b);
    C = V - Math.min(r, g, b);
    H = C == 0 ? null : V == r ? (g - b) / C + (g < b ? 6 : 0) : V == g ? (b - r) / C + 2 : (r - g) / C + 4;
    H = H % 6 * 60;
    S = C == 0 ? 0 : C / V;
    return {
      h: H,
      s: S,
      v: V
    };
  }
  /**
   * Return click event handler for the slider.
   * Sets picker background color and calls ctx.callback if provided.
   */


  function slideListener(ctx, slideElement, pickerElement) {
    return function (evt) {
      evt = evt || window.event;
      var mouse = mousePosition(evt);
      ctx.h = mouse.y / slideElement.offsetHeight * 360 + hueOffset;
      var pickerColor = hsv2rgb({
        h: ctx.h,
        s: 1,
        v: 1
      });
      var c = hsv2rgb({
        h: ctx.h,
        s: ctx.s,
        v: ctx.v
      });
      pickerElement.style.backgroundColor = pickerColor.hex;
      ctx.callback && ctx.callback(c.hex, {
        h: ctx.h - hueOffset,
        s: ctx.s,
        v: ctx.v
      }, {
        r: c.r,
        g: c.g,
        b: c.b
      }, undefined, mouse);
    };
  }

  ;
  /**
   * Return click event handler for the picker.
   * Calls ctx.callback if provided.
   */

  function pickerListener(ctx, pickerElement) {
    return function (evt) {
      evt = evt || window.event;
      var mouse = mousePosition(evt),
          width = pickerElement.offsetWidth,
          height = pickerElement.offsetHeight;
      ctx.s = mouse.x / width;
      ctx.v = (height - mouse.y) / height;
      var c = hsv2rgb(ctx);
      ctx.callback && ctx.callback(c.hex, {
        h: ctx.h - hueOffset,
        s: ctx.s,
        v: ctx.v
      }, {
        r: c.r,
        g: c.g,
        b: c.b
      }, mouse);
    };
  }

  ;
  var uniqID = 0;
  /**
   * ColorPicker.
   * @param {DOMElement} slideElement HSV slide element.
   * @param {DOMElement} pickerElement HSV picker element.
   * @param {Function} callback Called whenever the color is changed provided chosen color in RGB HEX format as the only argument.
   */

  function ColorPicker(slideElement, pickerElement, callback) {
    if (!(this instanceof ColorPicker)) return new ColorPicker(slideElement, pickerElement, callback);
    this.h = 0;
    this.s = 1;
    this.v = 1;

    if (!callback) {
      // call of the form ColorPicker(element, funtion(hex, hsv, rgb) { ... }), i.e. the no-hassle call.
      var element = slideElement;
      element.innerHTML = colorpickerHTMLSnippet;
      this.slideElement = element.getElementsByClassName('slide')[0];
      this.pickerElement = element.getElementsByClassName('picker')[0];
      var slideIndicator = element.getElementsByClassName('slide-indicator')[0];
      var pickerIndicator = element.getElementsByClassName('picker-indicator')[0];
      ColorPicker.fixIndicators(slideIndicator, pickerIndicator);

      this.callback = function (hex, hsv, rgb, pickerCoordinate, slideCoordinate) {
        ColorPicker.positionIndicators(slideIndicator, pickerIndicator, slideCoordinate, pickerCoordinate);
        pickerElement(hex, hsv, rgb);
      };
    } else {
      this.callback = callback;
      this.pickerElement = pickerElement;
      this.slideElement = slideElement;
    }

    if (type == 'SVG') {
      // Generate uniq IDs for linearGradients so that we don't have the same IDs within one document.
      // Then reference those gradients in the associated rectangles.
      var slideClone = slide.cloneNode(true);
      var pickerClone = picker.cloneNode(true);
      var hsvGradient = slideClone.getElementsByTagName('linearGradient')[0];
      var hsvRect = slideClone.getElementsByTagName('rect')[0];
      hsvGradient.id = 'gradient-hsv-' + uniqID;
      hsvRect.setAttribute('fill', 'url(#' + hsvGradient.id + ')');
      var blackAndWhiteGradients = [pickerClone.getElementsByTagName('linearGradient')[0], pickerClone.getElementsByTagName('linearGradient')[1]];
      var whiteAndBlackRects = pickerClone.getElementsByTagName('rect');
      blackAndWhiteGradients[0].id = 'gradient-black-' + uniqID;
      blackAndWhiteGradients[1].id = 'gradient-white-' + uniqID;
      whiteAndBlackRects[0].setAttribute('fill', 'url(#' + blackAndWhiteGradients[1].id + ')');
      whiteAndBlackRects[1].setAttribute('fill', 'url(#' + blackAndWhiteGradients[0].id + ')');
      this.slideElement.appendChild(slideClone);
      this.pickerElement.appendChild(pickerClone);
      uniqID++;
    } else {
      this.slideElement.innerHTML = slide;
      this.pickerElement.innerHTML = picker;
    }

    addEventListener(this.slideElement, 'click', slideListener(this, this.slideElement, this.pickerElement));
    addEventListener(this.pickerElement, 'click', pickerListener(this, this.pickerElement));
    enableDragging(this, this.slideElement, slideListener(this, this.slideElement, this.pickerElement));
    enableDragging(this, this.pickerElement, pickerListener(this, this.pickerElement));
  }

  ;

  function addEventListener(element, event, listener) {
    if (element.attachEvent) {
      element.attachEvent('on' + event, listener);
    } else if (element.addEventListener) {
      element.addEventListener(event, listener, false);
    }
  }
  /**
   * Enable drag&drop color selection.
   * @param {object} ctx ColorPicker instance.
   * @param {DOMElement} element HSV slide element or HSV picker element.
   * @param {Function} listener Function that will be called whenever mouse is dragged over the element with event object as argument.
   */


  function enableDragging(ctx, element, listener) {
    var mousedown = false;
    addEventListener(element, 'mousedown', function (evt) {
      mousedown = true;
    });
    addEventListener(element, 'mouseup', function (evt) {
      mousedown = false;
    });
    addEventListener(element, 'mouseout', function (evt) {
      mousedown = false;
    });
    addEventListener(element, 'mousemove', function (evt) {
      if (mousedown) {
        listener(evt);
      }
    });
  }

  ColorPicker.hsv2rgb = function (hsv) {
    var rgbHex = hsv2rgb(hsv);
    delete rgbHex.hex;
    return rgbHex;
  };

  ColorPicker.hsv2hex = function (hsv) {
    return hsv2rgb(hsv).hex;
  };

  ColorPicker.rgb2hsv = rgb2hsv;

  ColorPicker.rgb2hex = function (rgb) {
    return hsv2rgb(rgb2hsv(rgb)).hex;
  };

  ColorPicker.hex2hsv = function (hex) {
    return rgb2hsv(ColorPicker.hex2rgb(hex));
  };

  ColorPicker.hex2rgb = function (hex) {
    return {
      r: parse_int_default()(hex.substr(1, 2), 16),
      g: parse_int_default()(hex.substr(3, 2), 16),
      b: parse_int_default()(hex.substr(5, 2), 16)
    };
  };
  /**
   * Sets color of the picker in hsv/rgb/hex format.
   * @param {object} ctx ColorPicker instance.
   * @param {object} hsv Object of the form: { h: <hue>, s: <saturation>, v: <value> }.
   * @param {object} rgb Object of the form: { r: <red>, g: <green>, b: <blue> }.
   * @param {string} hex String of the form: #RRGGBB.
   */


  function setColor(ctx, hsv, rgb, hex) {
    ctx.h = hsv.h % 360;
    ctx.s = hsv.s;
    ctx.v = hsv.v;
    var c = hsv2rgb(ctx);
    var mouseSlide = {
      y: ctx.h * ctx.slideElement.offsetHeight / 360,
      x: 0 // not important

    };
    var pickerHeight = ctx.pickerElement.offsetHeight;
    var mousePicker = {
      x: ctx.s * ctx.pickerElement.offsetWidth,
      y: pickerHeight - ctx.v * pickerHeight
    };
    ctx.pickerElement.style.backgroundColor = hsv2rgb({
      h: ctx.h,
      s: 1,
      v: 1
    }).hex;
    ctx.callback && ctx.callback(hex || c.hex, {
      h: ctx.h,
      s: ctx.s,
      v: ctx.v
    }, rgb || {
      r: c.r,
      g: c.g,
      b: c.b
    }, mousePicker, mouseSlide);
    return ctx;
  }

  ;
  /**
   * Sets color of the picker in hsv format.
   * @param {object} hsv Object of the form: { h: <hue>, s: <saturation>, v: <value> }.
   */

  ColorPicker.prototype.setHsv = function (hsv) {
    return setColor(this, hsv);
  };
  /**
   * Sets color of the picker in rgb format.
   * @param {object} rgb Object of the form: { r: <red>, g: <green>, b: <blue> }.
   */


  ColorPicker.prototype.setRgb = function (rgb) {
    return setColor(this, rgb2hsv(rgb), rgb);
  };
  /**
   * Sets color of the picker in hex format.
   * @param {string} hex Hex color format #RRGGBB.
   */


  ColorPicker.prototype.setHex = function (hex) {
    return setColor(this, ColorPicker.hex2hsv(hex), undefined, hex);
  };
  /**
   * Helper to position indicators.
   * @param {HTMLElement} slideIndicator DOM element representing the indicator of the slide area.
   * @param {HTMLElement} pickerIndicator DOM element representing the indicator of the picker area.
   * @param {object} mouseSlide Coordinates of the mouse cursor in the slide area.
   * @param {object} mousePicker Coordinates of the mouse cursor in the picker area.
   */


  ColorPicker.positionIndicators = function (slideIndicator, pickerIndicator, mouseSlide, mousePicker) {
    if (mouseSlide) {
      slideIndicator.style.top = mouseSlide.y - slideIndicator.offsetHeight / 2 + 'px';
    }

    if (mousePicker) {
      pickerIndicator.style.top = mousePicker.y - pickerIndicator.offsetHeight / 2 + 'px';
      pickerIndicator.style.left = mousePicker.x - pickerIndicator.offsetWidth / 2 + 'px';
    }
  };
  /**
   * Helper to fix indicators - this is recommended (and needed) for dragable color selection (see enabledDragging()).
   */


  ColorPicker.fixIndicators = function (slideIndicator, pickerIndicator) {
    pickerIndicator.style.pointerEvents = 'none';
    slideIndicator.style.pointerEvents = 'none';
  }; // window.ColorPicker = ColorPicker;


  VueColorPicker = ColorPicker;
})(window, window.document);

/* harmony default export */ var colorpicker = (VueColorPicker);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/view/editSlide.vue?vue&type=script&lang=js&







//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var SAVE_DATA = null;
var SAVE_TEMP = [];
var READ_DATA = null;
var colorPick = null;

/* harmony default export */ var editSlidevue_type_script_lang_js_ = ({
  name: 'edit-slide',
  data: function data() {
    return {
      currentMove: 100,
      colorType: 0,
      showColor: false,
      showRead: false,
      showMove: false,
      sW: 0,
      sH: 0,
      wrapH: 0,
      wrapW: 0,
      zIndex: 0,
      x: 0,
      y: 0,
      offsetY: 0,
      offsetX: 0,
      fontSize: 3.2,
      showTitle: false,
      currentDom: null,
      currentOpacity: 1,
      currentWidth: 0,
      currentHeight: 0,
      currentX: 0,
      currentY: 0,
      currentLevel: 0,
      currentOrder: 0,
      currentBold: 'none',
      currentLeaveOrder: 0,
      videoSrc: '',
      domType: null,
      recordData: [],
      recordTemp: [],
      currentPage: 0,
      target: 0,
      blur: 0,
      currentStep: 0,
      id: 0,
      moveList: ['bounce', 'flash', 'pulse', 'rubberBand', 'shake', 'headShake', 'swing', 'tada', 'wobble', 'jello', 'bounceIn', 'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceInUp', 'bounceOut', 'fadeIn', 'fadeInDown', 'fadeInDownBig', 'fadeInLeft', 'fadeInLeftBig', 'heartBeat', 'jackInTheBox', 'flipInX', 'jackInTheBox'],
      canAddMove: true,
      recordImg: []
    };
  },
  created: function created() {// this.initData()
  },
  mounted: function mounted() {
    this.getScreenInfo();
    colorPick = colorpicker(this.$refs.color, this.colorPick);
  },
  watch: {
    blur: function blur(newValue) {
      // filter: blur(3px);
      console.log("blur:(".concat(newValue, "px)"));
      this.currentDom.style.filter = "blur(".concat(newValue, "px)");
    },
    fontSize: function fontSize(newValue, oldValue) {
      if (!this.currentDom) {
        this.fontSize = 3.2;
        return;
      }

      this.currentDom.style.fontSize = newValue + 'px';
      this.currentDom.dataset.fontSize = newValue / this.wrapH;
    },
    videoSrc: function videoSrc(newValue) {
      this.currentDom.src = newValue;
      this.currentDom.play();
    },
    currentWidth: function currentWidth(newValue) {
      this.currentDom.style.width = newValue + '%';
    },
    currentHeight: function currentHeight(newValue) {
      this.currentDom.style.lineHeight = newValue + '%';
      this.currentDom.style.height = newValue + '%';
      console.log(123);
    },
    currentX: function currentX(newValue) {
      this.currentDom.style.left = newValue + '%';
    },
    currentY: function currentY(newValue) {
      this.currentDom.style.top = newValue + '%';
    },
    currentLevel: function currentLevel(newValue) {
      this.currentDom.style.zIndex = newValue;
    },
    currentOpacity: function currentOpacity(newValue) {
      this.currentDom.style.opacity = newValue;
    },
    currentOrder: function currentOrder(newValue) {
      this.currentDom.dataset.order = parse_int_default()(newValue);
    },
    currentLeaveOrder: function currentLeaveOrder(newValue) {
      this.currentDom.dataset.leaveOrder = newValue;
    }
  },
  methods: {
    openColor: function openColor(type, e) {
      this.showColor = true;
      this.colorType = type;
    },
    colorPick: function colorPick(hex) {
      if (this.colorType === 0) {
        this.currentDom.style.color = hex;
        this.currentDom.dataset.color1 = hex;
        this.$refs.color1.style.backgroundColor = hex;
      } else {
        this.currentDom.style.backgroundColor = hex;
        this.currentDom.dataset.color2 = hex;
        this.$refs.color2.style.backgroundColor = hex;
      }
    },
    close: function close() {
      this.showRead = false;
    },
    initData: function initData() {
      var url = remote.app.getPath('userData') + '/ReadyBoy.js';
      fs.readFile(url, 'utf-8', function (err, data) {
        READ_DATA = JSON.parse(data);
        console.log(READ_DATA);
      });
    },
    // 获取屏幕大小
    getScreenInfo: function getScreenInfo() {
      console.log(this.$refs.wrap);
      this.sW = document.body.clientWidth;
      this.sH = document.body.clientHeight;
      this.$refs.wrap.style.height = this.sH / this.sW * this.$refs.wrap.clientWidth + 60 + 'px';
      this.wrapH = this.$refs.ppt.clientHeight;
      this.wrapW = this.$refs.ppt.clientWidth;
      this.offsetX = this.$refs.wrap.offsetLeft;
      this.offsetY = this.$refs.wrap.offsetTop;
      console.log(this.offsetX, this.offsetY);
    },
    // 下一页
    toNext: function toNext() {
      this.save();
      this.currentPage++;
      this.$refs.ppt.innerHTML = '';
      this.$refs.ppt.style = this.recordImg[this.currentPage] || '';
      this.readDom();
    },
    // 上一页
    toBack: function toBack() {
      if (this.currentPage === 0) return;
      this.save();
      this.currentPage--;
      this.$refs.ppt.innerHTML = '';
      this.$refs.ppt.style = this.recordImg[this.currentPage] || '';
      this.readDom();
    },
    readDom: function readDom() {
      var _this = this;

      var data = this.recordTemp[this.currentPage];
      if (!data || data.length === 0) return;
      data.forEach(function (currentList) {
        currentList.forEach(function (item) {
          if (item.domType === 'title') {
            var oDom = document.createElement('input');
            item.css.forEach(function (className) {
              oDom.classList.add(className);
            });
            oDom.style = item.style;
            oDom.value = item.content;
            oDom.id = item.id;
            item.css.forEach(function (className) {
              oDom.classList.add(className);
            });
            oDom.dataset.domType = item.domType;
            oDom.dataset.moveIn = item.moveIn;
            oDom.dataset.order = item.order;
            oDom.dataset.left = item.left;
            oDom.dataset.top = item.top;
            oDom.dataset.leaveOrder = item.leaveOrder; // oDom.dataset = item.dataset

            console.log('mydom', oDom);

            _this.addMoveListen(oDom);

            _this.$refs.ppt.append(oDom);
          } else if (item.domType === 'img') {
            var _oDom = document.createElement('div');

            item.css.forEach(function (className) {
              _oDom.classList.add(className);
            });
            _oDom.style = item.style;
            _oDom.id = item.id;
            item.css.forEach(function (className) {
              _oDom.classList.add(className);
            });
            _oDom.dataset.domType = item.domType;
            _oDom.dataset.moveIn = item.moveIn;
            _oDom.dataset.order = item.order;
            _oDom.dataset.left = item.left;
            _oDom.dataset.top = item.top;
            _oDom.dataset.leaveOrder = item.leaveOrder; // oDom.dataset = item.dataset

            console.log('mydom', _oDom);

            _this.addMoveListen(_oDom);

            _this.$refs.ppt.append(_oDom);
          }
        });
      });
    },
    // 添加文本框
    addTitle: function addTitle() {
      var oInput = document.createElement('input');
      oInput.style = 'transition: transfrom linear 1s;transition: opacity linear 1s;position:absolute;font-size:20px;width:20%;height:6%;z-index:0;text-align: left;';
      oInput.dataset.fontSize = 20 / this.wrapH;
      oInput.classList.add('__input');
      oInput.dataset.cTarget = this.target++;
      oInput.dataset.domType = 'title';
      oInput.dataset.order = 0;
      oInput.dataset.leaveOrder = 0;
      oInput.autocomplete = 'off';
      oInput.id = 'cxz' + this.id++;
      this.addMoveListen(oInput);
      this.$refs.ppt.append(oInput);
      oInput.value = '请输入文本内容';
      oInput.focus();
    },
    // 添加图片
    addImg: function addImg(e, type) {
      var source = e.target.files[0];
      var reader = new FileReader();
      var file = new FormData();
      file.append('file', source);
      this.$emit('upload', file, type);
    },
    // 添加视频
    addVideo: function addVideo() {
      var oVideo = document.createElement('video');
      oVideo.style = 'transition: transfrom linear 1s;transition: opacity linear 1s;position:absolute;width:20%;height:20%;z-index:0;object-fit: fill;background-color:#a93f17;outline:none;';
      oVideo.classList.add('__video');
      oVideo.dataset.cTarget = this.target++;
      oVideo.dataset.domType = 'video';
      oVideo.dataset.order = 0;
      oVideo.dataset.leaveOrder = 0;
      oVideo.id = 'cxz' + this.id++;
      oVideo.controls = 'controls';
      oVideo.loop = 'loop';
      oVideo.src = 'http://vfx.mtime.cn/Video/2019/02/04/mp4/190204084208765161.mp4';
      this.addMoveListen(oVideo);
      this.$refs.ppt.append(oVideo);
      oVideo.play();
    },
    createBacImgDom: function createBacImgDom(imgURL) {
      var value = "background-image:url(".concat(imgURL, ");");
      this.$refs.ppt.style = value;
      this.recordImg[this.currentPage] = value;
    },
    createImgDom: function createImgDom(imgURL) {
      var oDiv = document.createElement('div');
      oDiv.classList.add('__img-wrap');
      oDiv.dataset.order = 0;
      oDiv.id = 'cxz' + this.id++;
      oDiv.dataset.cTarget = this.target++;
      oDiv.dataset.domType = 'img';
      oDiv.dataset.leaveOrder = 0;
      oDiv.style = "background-image:url(".concat(imgURL, "); transition: transfrom linear 1s;transition: opacity linear 1s;position:absolute;width:20%;height:20%;z-index:0;opacity:1");
      this.addMoveListen(oDiv);
      this.$refs.ppt.append(oDiv);
    },
    // 保存数据
    save: function save() {
      var list = from_default()(this.$refs.ppt.children);

      console.log('当前页面的节点', list);
      var temp = [];
      list.forEach(function (item) {
        var dataset = JSON.parse(stringify_default()(item.dataset));
        var data = {
          style: item.style.cssText,
          id: item.id,
          css: from_default()(item.classList),
          content: item.value || undefined
        };

        for (var i = 0; i < keys_default()(dataset).length; ++i) {}

        keys_default()(dataset).forEach(function (item) {
          data[item] = dataset[item];
        });

        if (data.domType === 'video') {
          data.src = item.src;
        } // 					if(data.domType === 'title') {
        // 						data.fontSize = item.dataset.fontSize
        // 					}


        if (is_array_default()(temp[item.dataset.order])) {
          temp[item.dataset.order].push(data);
        } else {
          temp[item.dataset.order] = [data];
        }
      });
      console.log('存储的数据1', temp);
      this.recordTemp[this.currentPage] = temp;
      SAVE_TEMP[0] = this.recordTemp;
      var imgTemp = [];

      for (var i = 0; i < SAVE_TEMP[0].length; ++i) {
        imgTemp[i] = this.recordImg[i] || '';
      }

      SAVE_TEMP[1] = imgTemp;
      SAVE_DATA = stringify_default()(SAVE_TEMP);
      console.log('所有的数据', SAVE_DATA);
      this.$emit('saveData', SAVE_DATA);
    },
    stringifyClass: function stringifyClass(classList) {
      console.log(classList);

      var list = from_default()(classList);

      var value = list.join(' ');
      console.log(1);
      return value;
    },
    // 为元素添加事件
    addMoveListen: function addMoveListen(dom) {
      var _this2 = this;

      dom.onmousedown = function (e) {
        _this2.showColor = false;
        _this2.showMove = false;
        _this2.domType = dom.dataset.domType;
        console.log('dom类型', _this2.domType);
        dom.classList.add('select__dom');
        _this2.x = e.offsetX;
        _this2.y = e.offsetY;

        if (_this2.currentDom && _this2.currentDom.dataset.cTarget != dom.dataset.cTarget) {
          _this2.currentDom.classList.remove('select__dom');
        }

        _this2.$refs.color1.style.backgroundColor = dom.dataset.color1 || '#000000';
        _this2.$refs.color2.style.backgroundColor = dom.dataset.color2 || '#ffffff';
        _this2.currentDom = dom;
        _this2.showTitle = true;
        _this2.currentBold = dom.style.fontWeight || 'none';
        _this2.fontSize = parse_float_default()(dom.style.fontSize);
        _this2.currentWidth = parse_float_default()(dom.style.width);
        _this2.currentHeight = parse_float_default()(dom.style.height);
        _this2.currentLevel = parse_float_default()(dom.style.zIndex);
        _this2.currentX = parse_float_default()(dom.style.left);
        _this2.currentY = parse_float_default()(dom.style.top);
        _this2.currentOpacity = parse_float_default()(dom.style.opacity);
        _this2.currentOrder = dom.dataset.order;
        _this2.currentLeaveOrder = dom.dataset.leaveOrder;
        _this2.currentMove = dom.dataset.currentMove || 100;

        document.onmousemove = function (e) {
          // 						const top = Math.ceil((e.clientY - this.y - this.offsetY)/this.sH * 100 * 10000) / 10000 + 'vh'
          // 						const left = Math.ceil((e.clientX - this.x - this.offsetX)/this.sW * 100 * 10000) / 10000 + 'vw'
          var top = Math.ceil((e.clientY - _this2.y - _this2.offsetY) / _this2.wrapH * 100000) / 1000 + '%';
          var left = Math.ceil((e.clientX - _this2.x - _this2.offsetX) / _this2.wrapW * 100000) / 1000 + '%';
          dom.dataset.top = top;
          dom.dataset.left = left;
          dom.style.top = top;
          dom.style.left = left;
        };

        document.onmouseup = function (e) {
          document.onmousemove = null;
          _this2.currentX = parse_float_default()(dom.style.left);
          _this2.currentY = parse_float_default()(dom.style.top);
        };
      }; // 				dom.onfocus = () => {
      // 					
      // 					
      // 				}
      // 				dom.onblur = () => {
      // 					this.showTitle = false
      // 				}

    },
    cancaleSelect: function cancaleSelect(e) {
      if (!(e.target.className === 'edit__main' || e.target.className === 'edit__wrap')) {
        return;
      }

      if (this.currentDom) {
        this.currentDom.classList.remove('select__dom');
      }

      this.showColor = false;
      this.showMove = false;
      this.currentDom = null;
      this.showTitle = false;
    },
    addBold: function addBold() {
      var temp = this.currentDom.style.fontWeight || '';

      if (temp === 'bold') {
        this.currentDom.style.fontWeight = '';
        this.currentBold = '';
      } else {
        this.currentDom.style.fontWeight = 'bold';
        this.currentBold = 'bold';
      }
    },
    addMove: function addMove(item, index) {
      var dom = this.currentDom;
      var self = this;
      if (!this.canAddMove) return;
      this.canAddMove = false;
      dom.addEventListener('animationend', remove);

      function remove() {
        console.log('结束了');
        dom.classList.remove(item);
        dom.classList.remove('animated');
        dom.onanimationend = null;
        self.canAddMove = true;
        dom.removeEventListener('animationend', remove);
      }

      dom.classList.add('animated');
      dom.classList.add(item);
      dom.dataset.moveIn = item;
      dom.dataset.currentMove = index;
      this.currentMove = index;
    },
    upload: function upload() {
      var source = this.$refs.source;
      console.log(source);
      var reader = new FileReader();

      reader.onload = function (e) {
        fs.writeFile(remote.app.getPath('userData') + '/test.png', reader.result, "binary", function () {
          console.log(123);
        });
      };

      reader.readAsBinaryString(source.files[0]);
    }
  }
});
// CONCATENATED MODULE: ./components/view/editSlide.vue?vue&type=script&lang=js&
 /* harmony default export */ var view_editSlidevue_type_script_lang_js_ = (editSlidevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./components/view/editSlide.vue?vue&type=style&index=0&id=3fa5860a&scoped=true&lang=css&
var editSlidevue_type_style_index_0_id_3fa5860a_scoped_true_lang_css_ = __webpack_require__("c2a3");

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./components/view/editSlide.vue






/* normalize component */

var component = normalizeComponent(
  view_editSlidevue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "3fa5860a",
  null
  
)

/* harmony default export */ var editSlide = (component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"6a83156a-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/view/readSlide.vue?vue&type=template&id=220d2aef&
var readSlidevue_type_template_id_220d2aef_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"read__wrap",on:{"dblclick":_vm.close}},[_c('div',{ref:"shade",staticClass:"read__shade"},[_c('div',{ref:"ball",staticClass:"shade__ball"})]),_c('div',{staticClass:"read__btn"},[_c('div',{staticClass:"read__icon read__left",on:{"click":_vm.back}}),_c('div',{staticClass:"read__page"},[_vm._v(_vm._s(_vm.currentPage + 1))]),_c('div',{staticClass:"read__icon read__right",on:{"click":_vm.next}})]),_c('div',{ref:"ppt",staticClass:"read read__opacity"})])}
var readSlidevue_type_template_id_220d2aef_staticRenderFns = []


// CONCATENATED MODULE: ./components/view/readSlide.vue?vue&type=template&id=220d2aef&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/view/readSlide.vue?vue&type=script&lang=js&


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var readSlidevue_type_script_lang_js_READ_DATA = null;
var BAC_DATA = null;
var DOM_LIST = [];
/* harmony default export */ var readSlidevue_type_script_lang_js_ = ({
  name: 'read-slide',
  data: function data() {
    return {
      height: 0,
      currentPage: 0,
      currentStep: 0,
      canNext: true,
      currentDomList: [],
      index: 0,
      last: false,
      wk: 1,
      //长比例系数
      hk: 1 // 高比例系数

    };
  },
  watch: {
    currentPage: function currentPage(newValue, oldValue) {
      var dom = this.$refs.ppt;
      dom.classList.remove('read__opacity');
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.initData();
    this.$refs.shade.addEventListener('animationend', function () {
      _this.$refs.shade.style = "display:none";
      _this.canNext = true; // this.next()

      var dom = _this.$refs.ppt;
      dom.classList.add('read__opacity');
      dom.style = BAC_DATA[_this.currentPage];

      if (_this.last) {
        _this.createDom();
      }
    });
  },
  methods: {
    initData: function initData() {
      this.height = document.body.clientHeight;
      var data = JSON.parse(localStorage.getItem('cxzppt'));
      readSlidevue_type_script_lang_js_READ_DATA = data[0];
      BAC_DATA = data[1];
      this.$refs.ppt.style = BAC_DATA[this.currentPage];
    },
    close: function close() {
      this.$emit('close');
    },
    back: function back() {
      this.currentStep--;
      console.log('目前索引', this.currentStep);

      if (this.currentStep < 0) {
        if (this.currentPage === 0) {
          this.currentStep = 0;
          console.log('当前页数据', readSlidevue_type_script_lang_js_READ_DATA[this.currentPage]);
          return console.log('回到最初了');
        } else {
          this.currentPage = --this.currentPage < 0 ? 0 : this.currentPage;
          this.currentStep = readSlidevue_type_script_lang_js_READ_DATA[this.currentPage].length;
          console.log('上一页', this.currentPage);
          this.last = true;
          this.$refs.shade.style = "display: flex;";
          console.log(DOM_LIST[this.index - 1], this.currentStep);
          console.log('当前页数据', readSlidevue_type_script_lang_js_READ_DATA[this.currentPage]);
          return;
        }
      } else {
        console.log(DOM_LIST[this.index - 1], '要删除的节点');
        DOM_LIST[this.index - 1].forEach(function (item) {
          var child = document.getElementById(item);
          child.parentNode.removeChild(child);
        });
        console.log(this.currentStep);
        this.index--;
        console.log('当前页数据', readSlidevue_type_script_lang_js_READ_DATA[this.currentPage]);
      }
    },
    createDom: function createDom() {
      var _this2 = this;

      this.last = false;
      readSlidevue_type_script_lang_js_READ_DATA[this.currentPage].forEach(function (domList) {
        domList.forEach(function (item) {
          var oDom = document.createElement('div');
          item.css.forEach(function (className) {
            oDom.classList.add(className);
          });
          oDom.style = item.style;

          if (item.content) {
            oDom.innerHTML = item.content;
          }

          oDom.id = item.id;
          oDom.class = item.css;
          oDom.classList.add('animated');

          if (item.moveIn) {
            oDom.classList.add(item.moveIn);
          }

          if (item.fontSize) {
            oDom.style.fontSize = parse_float_default()(item.fontSize) * _this2.height + 'px';
          }

          _this2.$refs.ppt.append(oDom);
        });
      });
    },
    next: function next() {
      var _this3 = this;

      if (!this.canNext) return;
      var data = readSlidevue_type_script_lang_js_READ_DATA[this.currentPage] || false;

      if (!data) {
        return console.log('over');
      }

      if (this.currentStep >= data.length) {
        if (this.currentPage + 1 >= readSlidevue_type_script_lang_js_READ_DATA.length) {
          console.log('播放完毕');
          return;
        } else {
          this.currentPage = this.currentPage + 1;
          setTimeout(function () {
            _this3.$refs.ppt.innerHTML = '';
          }, 400);
          this.canNext = false;
          this.$refs.shade.style = "display: flex;";
          this.currentStep = 0;
          return;
        }
      }

      console.log('当前页数据', readSlidevue_type_script_lang_js_READ_DATA[this.currentPage]);
      var domList = [];
      var domId = [];
      readSlidevue_type_script_lang_js_READ_DATA[this.currentPage][this.currentStep].forEach(function (item) {
        var oDom = undefined;
        console.log('读取的类型', item.domType, item);

        if (item.domType === 'video') {
          oDom = document.createElement('video');
          oDom.src = item.src;
          oDom.autoplay = "true";
        } else {
          oDom = document.createElement('div');
        }

        item.css.forEach(function (className) {
          oDom.classList.add(className);
        });
        oDom.style = item.style;

        if (item.content) {
          oDom.innerHTML = item.content;
        }

        oDom.id = item.id;
        oDom.classList.add('animated');

        if (item.moveIn) {
          oDom.classList.add(item.moveIn);
        }

        if (item.fontSize) {
          oDom.style.fontSize = parse_float_default()(item.fontSize) * _this3.height + 'px';
        }

        domList.push(oDom);
        domId.push(oDom.id);

        _this3.$refs.ppt.append(oDom);
      });
      DOM_LIST[this.index] = domId;
      this.index++;
      console.log('目前的栈', DOM_LIST);
      this.currentStep++;
    }
  }
});
// CONCATENATED MODULE: ./components/view/readSlide.vue?vue&type=script&lang=js&
 /* harmony default export */ var view_readSlidevue_type_script_lang_js_ = (readSlidevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./components/view/readSlide.vue?vue&type=style&index=0&lang=css&
var readSlidevue_type_style_index_0_lang_css_ = __webpack_require__("d593");

// CONCATENATED MODULE: ./components/view/readSlide.vue






/* normalize component */

var readSlide_component = normalizeComponent(
  view_readSlidevue_type_script_lang_js_,
  readSlidevue_type_template_id_220d2aef_render,
  readSlidevue_type_template_id_220d2aef_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var readSlide = (readSlide_component.exports);
// CONCATENATED MODULE: ./components/index.js






var Components = {
  EditSlide: editSlide,
  ReadSlide: readSlide
};

keys_default()(Components).forEach(function (name) {
  external_commonjs_vue_commonjs2_vue_root_Vue_default.a.component(name, Components[name]);
});

/* harmony default export */ var components = (Components); // import EditSlide from "./view/editSlide.vue";
// 
// const components = [
// 	EditSlide
// ]
// 
// 
// const install = function(Vue, opts = {}) {
//   components.forEach(component => {
//     Vue.component(component.name, component);
//   })
// 
// 
// };
// 
// 
// if (typeof window !== 'undefined' && window.Vue) {
//   install(window.Vue);
// }
// 
// export default {
//   install,
//   EditSlide
// };
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (components);



/***/ })

/******/ });