/* *
 * abricos.js - Template management framework (JavaScript)
 * http://github.com/abricos/abricos.js
 * 
 * The algorithm used based Abricos Platform (http://abricos.org)
 * 
 * The MIT License
 */

if (typeof Abricos == 'undefined' || !Abricos){
	var Abricos = {};
}

var _initAbricos = function(){

	var A = Abricos,
		Y = YUI,
		L = Y.Lang;
	
	A.Env = {
		'mods': {},
		'temps': {},
		'langs': {}
	};
	
	A.mod = A.mod || {};
	
	/**
	 * The Language class manages phrases localization
	 * 
	 * @class Language
	 * @static
	 */

	var AL = A.Language = {};

	// Clone languge data (private function)
	var cloneLang = function(from, to){
		for (var el in from){
			if (L.isObject(from[el]) || L.isArray(from[el])){
				if (typeof to[el] == 'undefined')
					to[el] = {};
				cloneLang(from[el], to[el]);
			}else{
				to[el] = from[el];
			}
		}
	};
	
	
	AL.add = function(lang, o){
		var d = A.Env.langs,
			dLang = d[lang] || (d[lang] = {});
		
		cloneLang(o, dLang);
	};
	
	var CSSManager = function(){
		this.init();
	};
	CSSManager.prototype = {
		init: function(){},
		add: function(mName, cName){
			
		}
	};
	A.css = new CSSManager();
	
	
	/**
	 * The Template class manages template elements
	 * 
	 * @class Template
	 * @static
	 */

	var T = A.Template = {};
	
	/**
	 * Get templates of a specific component.
	 * @param {String} mName The name of the module.
	 * @param {String} cName The name of the component.
	 * @method get
	 * @return {Object}
	 * @static
	 */
	T.get = function(mName, cName){
		var t = A.Env.temps;
			tm = t[mName] || (t[mName] = {});
			
		return tm[cName] || (tm[cName] = {})
	};
	
	T.add = function(mName, cName, o){
		var tmc = T.get(mName, cName);
		
		if (L.isObject(o)){
			for (var tName in o){
				
				if (!L.isString(o[tName])){ continue; }
				
				tmc[tName] = o[tName];
			}
		}else if (L.isString(o)){
			// TODO: Abricos.template.add(modName, compName, tplName, tplValue)
		}
	};
	
	
	
	var Component = function(cfg){
		cfg = Y.merge({
			'entryPoint': null
		}, cfg || {});
		
		this.init(cfg);
	};
	Component.prototype = {
		init: function(cfg){
		
			this.moduleName = cfg['moduleName'];
			
			this.name = cfg['name'];
			
			this.entryPoint = cfg['entryPoint'];

			// TODO: necessary to implement
			this.requires = {};
		}
	};
	A.Component = Component;
	
	
    /**
     * The Abricos global namespace object
     * 
     * @class Abricos
     * @static
     */

	
	/**
	 * Determines if the component with the given name exists.
	 * 
	 * @param {String} mName The name of the module.
	 * @param {String} cName The name of the component.
	 * @return {Boolean} True if the component exists, false if not.
	 * @method exists
	 * @static
	 */
	A.exists = function(mName, cName){
		var mods = A.Env.mods;

		if (!mods[mName]){ return false; }

		return !!(mods[mName][cName]);
	};
	
	A.add = function(mName, cName, o){
		var mods = A.Env.mods;

		if (A.exists(mName, cName)){
			throw new Error("Component is already registered: module="+mName+", component="+cName);
		}

		var comp;

		if (o instanceof Component){
			comp = o;
		}else if (L.isFunction(o)){
			comp = new Component({
				'entryPoint': o
			});
		}else if (L.isObject(o)){
			comp = new Component(o);
		} else {
			return;
		}
		
		comp.moduleName = mName;
		comp.name = cName;
		
		var m = mods[mName] || (mods[mName] = {});

		m[cName] = comp;
		
		var fn = comp.entryPoint;
		if (L.isFunction(fn)){
			var NS = A.mod[mName] || (A.mod[mName] = {});
			
			fn(NS);
		}
	};
};


/* 
 * The minimum set of basic functions taken from the YUI library (http://yuilibrary.com/).
 * 
 * All of the features of this wonderful library, you can get a call using the line:
 * <script src="http://yui.yahooapis.com/3.14.0/build/yui/yui-min.js"></script>
 * 
 * YUI Library License:
 * 
 * Software License Agreement (BSD License)
 * ========================================
 * 
 * Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 * ----------------------------------------------------
 * 
 * Redistribution and use of this software in source and binary forms, with or
 * without modification, are permitted provided that the following conditions are
 * met:
 *   * Redistributions of source code must retain the above copyright notice, this
 *     list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 *   * Neither the name of Yahoo! Inc. nor the names of YUI's contributors may be
 *     used to endorse or promote products derived from this software without
 *     specific prior written permission of Yahoo! Inc.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

if (typeof YUI == 'undefined' || !YUI.Lang){
	
	var YUI = YUI || {};
	
(function(){	
	
	var Y = YUI;
	
	var hasOwn = Object.prototype.hasOwnProperty;
	
	
	/**
	Returns a new object containing all of the properties of all the supplied
	objects. The properties from later objects will overwrite those in earlier
	objects.
	
	Passing in a single object will create a shallow copy of it. For a deep copy,
	use `clone()`.
	
	@method merge
	@param {Object} objects* One or more objects to merge.
	@return {Object} A new merged object.
	**/
	Y.merge = function () {
	    var i      = 0,
	        len    = arguments.length,
	        result = {},
	        key,
	        obj;
	
	    for (; i < len; ++i) {
	        obj = arguments[i];
	
	        for (key in obj) {
	            if (hasOwn.call(obj, key)) {
	                result[key] = obj[key];
	            }
	        }
	    }
	
	    return result;
	};
	
	/**
	 * Provides core language utilites and extensions used throughout YUI.
	 *
	 * @class Lang
	 * @static
	 */

	var L = Y.Lang || (Y.Lang = {}),

		STRING_PROTO = String.prototype,
		TOSTRING     = Object.prototype.toString,
	
		TYPES = {
		    'undefined'        : 'undefined',
		    'number'           : 'number',
		    'boolean'          : 'boolean',
		    'string'           : 'string',
		    '[object Function]': 'function',
		    '[object RegExp]'  : 'regexp',
		    '[object Array]'   : 'array',
		    '[object Date]'    : 'date',
		    '[object Error]'   : 'error'
		},
	
		SUBREGEX         = /\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g,
	
		WHITESPACE       = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF",
		WHITESPACE_CLASS = "[\x09-\x0D\x20\xA0\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+",
		TRIM_LEFT_REGEX  = new RegExp("^" + WHITESPACE_CLASS),
		TRIM_RIGHT_REGEX = new RegExp(WHITESPACE_CLASS + "$"),
		TRIMREGEX        = new RegExp(TRIM_LEFT_REGEX.source + "|" + TRIM_RIGHT_REGEX.source, "g"),
	
		NATIVE_FN_REGEX  = /\{\s*\[(?:native code|function)\]\s*\}/i;

	// -- Protected Methods --------------------------------------------------------

	/**
	Returns `true` if the given function appears to be implemented in native code,
	`false` otherwise. Will always return `false` -- even in ES5-capable browsers --
	if the `useNativeES5` YUI config option is set to `false`.

	This isn't guaranteed to be 100% accurate and won't work for anything other than
	functions, but it can be useful for determining whether a function like
	`Array.prototype.forEach` is native or a JS shim provided by another library.

	There's a great article by @kangax discussing certain flaws with this technique:
	<http://perfectionkills.com/detecting-built-in-host-methods/>

	While his points are valid, it's still possible to benefit from this function
	as long as it's used carefully and sparingly, and in such a way that false
	negatives have minimal consequences. It's used internally to avoid using
	potentially broken non-native ES5 shims that have been added to the page by
	other libraries.

	@method _isNative
	@param {Function} fn Function to test.
	@return {Boolean} `true` if _fn_ appears to be native, `false` otherwise.
	@static
	@protected
	@since 3.5.0
	**/
	L._isNative = function (fn) {
	    // return !!(Y.config.useNativeES5 && fn && NATIVE_FN_REGEX.test(fn));
		// Abricos changes
		return true;
	};

	// -- Public Methods -----------------------------------------------------------

	/**
	 * Determines whether or not the provided item is an array.
	 *
	 * Returns `false` for array-like collections such as the function `arguments`
	 * collection or `HTMLElement` collections. Use `Y.Array.test()` if you want to
	 * test for an array-like collection.
	 *
	 * @method isArray
	 * @param o The object to test.
	 * @return {boolean} true if o is an array.
	 * @static
	 */
	L.isArray = L._isNative(Array.isArray) ? Array.isArray : function (o) {
	    return L.type(o) === 'array';
	};

	/**
	 * Determines whether or not the provided item is a boolean.
	 * @method isBoolean
	 * @static
	 * @param o The object to test.
	 * @return {boolean} true if o is a boolean.
	 */
	L.isBoolean = function(o) {
	    return typeof o === 'boolean';
	};

	/**
	 * Determines whether or not the supplied item is a date instance.
	 * @method isDate
	 * @static
	 * @param o The object to test.
	 * @return {boolean} true if o is a date.
	 */
	L.isDate = function(o) {
	    return L.type(o) === 'date' && o.toString() !== 'Invalid Date' && !isNaN(o);
	};

	/**
	 * <p>
	 * Determines whether or not the provided item is a function.
	 * Note: Internet Explorer thinks certain functions are objects:
	 * </p>
	 *
	 * <pre>
	 * var obj = document.createElement("object");
	 * Y.Lang.isFunction(obj.getAttribute) // reports false in IE
	 * &nbsp;
	 * var input = document.createElement("input"); // append to body
	 * Y.Lang.isFunction(input.focus) // reports false in IE
	 * </pre>
	 *
	 * <p>
	 * You will have to implement additional tests if these functions
	 * matter to you.
	 * </p>
	 *
	 * @method isFunction
	 * @static
	 * @param o The object to test.
	 * @return {boolean} true if o is a function.
	 */
	L.isFunction = function(o) {
	    return L.type(o) === 'function';
	};

	/**
	 * Determines whether or not the provided item is null.
	 * @method isNull
	 * @static
	 * @param o The object to test.
	 * @return {boolean} true if o is null.
	 */
	L.isNull = function(o) {
	    return o === null;
	};

	/**
	 * Determines whether or not the provided item is a legal number.
	 * @method isNumber
	 * @static
	 * @param o The object to test.
	 * @return {boolean} true if o is a number.
	 */
	L.isNumber = function(o) {
	    return typeof o === 'number' && isFinite(o);
	};

	/**
	 * Determines whether or not the provided item is of type object
	 * or function. Note that arrays are also objects, so
	 * <code>Y.Lang.isObject([]) === true</code>.
	 * @method isObject
	 * @static
	 * @param o The object to test.
	 * @param failfn {boolean} fail if the input is a function.
	 * @return {boolean} true if o is an object.
	 * @see isPlainObject
	 */
	L.isObject = function(o, failfn) {
	    var t = typeof o;
	    return (o && (t === 'object' ||
	        (!failfn && (t === 'function' || L.isFunction(o))))) || false;
	};

	/**
	 * Determines whether or not the provided value is a regexp.
	 * @method isRegExp
	 * @static
	 * @param value The value or object to test.
	 * @return {boolean} true if value is a regexp.
	 */
	L.isRegExp = function(value) {
	    return L.type(value) === 'regexp';
	};

	/**
	 * Determines whether or not the provided item is a string.
	 * @method isString
	 * @static
	 * @param o The object to test.
	 * @return {boolean} true if o is a string.
	 */
	L.isString = function(o) {
	    return typeof o === 'string';
	};

	/**
	 * Determines whether or not the provided item is undefined.
	 * @method isUndefined
	 * @static
	 * @param o The object to test.
	 * @return {boolean} true if o is undefined.
	 */
	L.isUndefined = function(o) {
	    return typeof o === 'undefined';
	};

	/**
	 * A convenience method for detecting a legitimate non-null value.
	 * Returns false for null/undefined/NaN, true for other values,
	 * including 0/false/''
	 * @method isValue
	 * @static
	 * @param o The item to test.
	 * @return {boolean} true if it is not null/undefined/NaN || false.
	 */
	L.isValue = function(o) {
	    var t = L.type(o);

	    switch (t) {
	        case 'number':
	            return isFinite(o);

	        case 'null': // fallthru
	        case 'undefined':
	            return false;

	        default:
	            return !!t;
	    }
	};

	/**
	 * Returns the current time in milliseconds.
	 *
	 * @method now
	 * @return {Number} Current time in milliseconds.
	 * @static
	 * @since 3.3.0
	 */
	L.now = Date.now || function () {
	    return new Date().getTime();
	};

	/**
	 * Performs `{placeholder}` substitution on a string. The object passed as the 
	 * second parameter provides values to replace the `{placeholder}`s.
	 * `{placeholder}` token names must match property names of the object. For example,
	 * 
	 *`var greeting = Y.Lang.sub("Hello, {who}!", { who: "World" });`
	 *
	 * `{placeholder}` tokens that are undefined on the object map will be left 
	 * in tact (leaving unsightly `{placeholder}`'s in the output string). 
	 *
	 * @method sub
	 * @param {string} s String to be modified.
	 * @param {object} o Object containing replacement values.
	 * @return {string} the substitute result.
	 * @static
	 * @since 3.2.0
	 */
	L.sub = function(s, o) {
	    return s.replace ? s.replace(SUBREGEX, function (match, key) {
	        return L.isUndefined(o[key]) ? match : o[key];
	    }) : s;
	};

	/**
	 * Returns a string without any leading or trailing whitespace.  If
	 * the input is not a string, the input will be returned untouched.
	 * @method trim
	 * @static
	 * @param s {string} the string to trim.
	 * @return {string} the trimmed string.
	 */
	L.trim = L._isNative(STRING_PROTO.trim) && !WHITESPACE.trim() ? function(s) {
	    return s && s.trim ? s.trim() : s;
	} : function (s) {
	    try {
	        return s.replace(TRIMREGEX, '');
	    } catch (e) {
	        return s;
	    }
	};

	/**
	 * Returns a string without any leading whitespace.
	 * @method trimLeft
	 * @static
	 * @param s {string} the string to trim.
	 * @return {string} the trimmed string.
	 */
	L.trimLeft = L._isNative(STRING_PROTO.trimLeft) && !WHITESPACE.trimLeft() ? function (s) {
	    return s.trimLeft();
	} : function (s) {
	    return s.replace(TRIM_LEFT_REGEX, '');
	};

	/**
	 * Returns a string without any trailing whitespace.
	 * @method trimRight
	 * @static
	 * @param s {string} the string to trim.
	 * @return {string} the trimmed string.
	 */
	L.trimRight = L._isNative(STRING_PROTO.trimRight) && !WHITESPACE.trimRight() ? function (s) {
	    return s.trimRight();
	} : function (s) {
	    return s.replace(TRIM_RIGHT_REGEX, '');
	};

	/**
	Returns one of the following strings, representing the type of the item passed
	in:

	 * "array"
	 * "boolean"
	 * "date"
	 * "error"
	 * "function"
	 * "null"
	 * "number"
	 * "object"
	 * "regexp"
	 * "string"
	 * "undefined"

	Known issues:

	 * `typeof HTMLElementCollection` returns function in Safari, but
	    `Y.Lang.type()` reports "object", which could be a good thing --
	    but it actually caused the logic in <code>Y.Lang.isObject</code> to fail.

	@method type
	@param o the item to test.
	@return {string} the detected type.
	@static
	**/
	L.type = function(o) {
	    return TYPES[typeof o] || TYPES[TOSTRING.call(o)] || (o ? 'object' : 'null');
	};
	
})();

}

_initAbricos();

