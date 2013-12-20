/*
 * Template management framework (JavaScript)
 * 
 * The algorithm used based Abricos Platform (http://abricos.org)
 * 
 * @author Alexander Kuzmin <roosit@abricos.org>
 * @link http://github.com/abricos/abricos.js
 * 
 * The MIT License
 */

/**
 * @module abricos-core
 */

if (typeof Abricos == 'undefined' || !Abricos){
	var Abricos = {};
}

if (typeof Abricos_Config == 'undefined'){
	var Abricos_Config = {};
}

var _initAbricos = function(){

	var A = Abricos,
		Y = YUI,
		L = Y.Lang,
		SLICE = Array.prototype.slice;

	A._loading = true;
	
	/**
	 * Global config object
	 * 
	 * @class Abricos.config
	 * @static
	 */
	var CONF = A.config = Y.merge({
		
		/**
		 * @property {String} lang
		 * @default 'en'
		 */
		lang: 'en',
		
		/**
		 * Default module name
		 * @property {String} defModName
		 * @default '_module_'
		 */
		defModName: '_module_',

		/**
		 * Default component name
		 * @property {String} defCompName
		 * @default '_component_'
		 */
		defCompName: '_component_'
			
	}, Abricos_Config || {});
	
	A.Env = {
		'DOMReady': false,
		'mods': {},
		'temps': {},
		'langs': {},
		'css': {}
	};
	
	A.mod = A.mod || {};
	
	/**
	 * The Key class specifies the path(namespace) to templates,
	 * phrases of localization, components of module and etc.
	 * 
	 * @class Abricos.Key
	 * @constructor
	 * @param key {String|Array|Abricos.Key}
	 * @example
	 * 
	 * 	var key = new A.Key("mod.mymod.mycomp.widget");
	 * 	console.log(key.toArray()); // ["mod", "mymod", "mycomp", "widget"]
	 */
	var Key = function(key){
		this.init(key);
	};
	Key.prototype = {
		/**
		 * Initialization.
		 * @param key {String|Array|Abricos.Key}
		 * @method init
		 * @protected
		 * @return {String}
		 */
		init: function(key){
			
			/**
			 * Key elements of an array
			 * @property path
			 * @type array
			 */
			this.path = [];

			
			if (key instanceof Key){
				key = key.toArray();
			}else if (L.isString(key)){
				key = key.split('.');
			}
			var i, p = this.path;
			for (i=0;i<key.length;i++){
				p[p.length] = L.trim(key[i]);
			}
		},
		
		/**
		 * Return a string.
		 * @method toString
		 * @return {String}
		 */
		toString: function(){
			return this.path.join(".");
		},
		
		/**
		 * Return a array.
		 * @method toArray
		 * @return {String}
		 */
		toArray: function(){
			return this.path.slice(0);
		},
		
		/**
		 * @return {Abricos.Key}
		 * @method clone
		 */
		clone: function(){
			return new A.Key(this);
		},
		
		/**
		 * Executes the supplied function on each item in the key
		 * @param fn {Function} Function to execute on each item in 
		 * the key. The function will receive the following arguments:
		 * 	@param {String} fn.item Current key item.
		 * 	@param {Number} fn.index Current key index.
		 * @method each
		 */
		each: function(fn){
			if (!L.isFunction(fn)){ return; }
			var p = this.path, i;
			for (i=0;i<p.length;i++){
				fn(p[i], i);
			}
		},
		
		/**
		 * Add a new item(s) to the end an key.
		 * @param ki {String|Array|Abricos.Key} Key item.
		 * @param [clone=false] {Boolean} If TRUE - creates a new 
		 * instance of the class.
		 * @return {Abricos.Key}
		 */
		push: function(ki, clone){
			var key = clone ? this.clone(): this,
				pkey = new A.Key(ki);
			pkey.each(function(item){
				key.path.push(item);
			});
			return key;
		}
	};
	A.Key = Key;
	
	/**
	 * The Language class manages phrases localization.
	 * @class Abricos.Language
	 * @static
	 */
	var LNG = A.Language = {};

	/**
	 * Clone object
	 * 
	 * @param from {Object} From data
	 * @param to {Object} To data
	 * @method clone
	 * @static
	 */
	LNG.clone = function(from, to){
		for (var n in from){
			if (L.isObject(from[n]) || L.isArray(from[n])){
				if (typeof to[n] == 'undefined'){
					to[n] = {};
				}
				LNG.clone(from[n], to[n]);
			}else{
				to[n] = from[n];
			}
		}
	};
	
	/**
	 * Add a language phrases in global storage.
	 * @param [lang] {String} Language ID
	 * @param seed {Object} Language phrases
	 * @method add
	 * @static
	 * 
	 * @example
	 * 
	 * 	LNG.add('en', {
	 * 		'widget': {
	 * 			'title': 'Hello World!',
	 * 			'button': 'Close'
	 * 		}
	 * 	});
	 * 
	 * or adding several languages
	 * 
	 * 	LNG.add({
	 * 		'en': {
	 * 			'widget': {
	 * 				'title': 'Hello World!',
	 * 				'button': 'Close'
	 * 			}
	 * 		},
	 * 		'ru': {
	 * 			'widget': {
	 * 				'title': 'Привет мир!',
	 * 				'button': 'Закрыть'
	 * 			}
	 * 		}
	 * 	});
	 */
	LNG.add = function(lang, seed){
		var args = SLICE.call(arguments, 0),
			aln = args.length;
		
		if (L.isObject(args[0]) && aln == 1){
			seed = args[0];
			for (var n in seed){
				LNG.add(n, seed[n]);
			}
		}else if (L.isString(lang) && L.isObject(seed)){
			var d = A.Env.langs,
				dLang = d[lang] || (d[lang] = {});
			
			LNG.clone(seed, dLang);
		}
	};
	
	/**
	 * Get a phrase/phrases collection by ID.
	 * 
	 * @param key {String|Array|Abricos.Key} Phrase ID
	 * @param [lang=Abricos.config.lang] {String} Language ID
	 * @return {String} Phrase
	 * @method get
	 * @static
	 * @example
	 * 
	 * 	var ph = LNG.get('widget.title');
	 * 	console.log(ph); // > Hello World!
	 * 
	 * or
	 * 
	 * 	var ph = LNG.get(['widget', 'button'], 'ru');
	 * 	console.log(ph); // > Закрыть
	 * 
	 */
	LNG.get = function(key, lang){
		lang = lang || A.config.lang;
		
		var ph = A.objectByKey(A.Env.langs[lang], key);
		
		return L.isString(ph) ? ph : '';
	};
	

	/**
	 * The Template class manages elements of template
	 * 
	 * @class Abricos.Template
	 * @static
	 */

	var T = A.Template = {};
	
	/**
	 * Add elements of template in global storage.
	 * @param [key] {String|Array} Template ID
	 * @param seed {String|Object} Templates data
	 * @return {Object} Templates
	 * @method add
	 * @static
	 * @example
	 * 
	 * 	T.add({
	 * 		"widget": "<div id='{i#id}'>{#widget.title}</div>"
	 * 	});
	 * 
	 * 	T.add("mymod.mycomp", "<!--{widget}--><div id='{i#id}'>{#widget.title}</div>");
	 */
	T.add = function(key, seed){
		var args = SLICE.call(arguments, 0),
			alen = args.length;

		if (alen == 1){
			key = "";
			seed = args[0];
		}
		
		if (L.isString(seed)){
			seed = T.parse(seed);
		}

		var t = A.objectByKey(key, A.Env.temps, true);
		
		for (var tName in seed){
			
			if (!L.isString(seed[tName])){ continue; }
			
			t[tName] = seed[tName];
		}
		return t;
	};
	
	/**
	 * Add element of template in global storage.
	 * @param [key] {String|Array} Template ID.
	 * @param name {String} Name a the element of template
	 * @param source {String} Text a the element of template.
	 * @return {Object} Templates
	 * @method addElement
	 * @static
	 * @example
	 * 
	 * 	T.add("widget", "<div id='{i#id}'>{#widget.title}</div>");
	 * 
	 * 	T.add("mymod.mycomp", "widget", "<div id='{i#id}'>{#widget.title}</div>");
	 */
	T.addElement = function(key, name, source){
		var args = SLICE.call(arguments, 0),
			alen = args.length;
		
		if (alen == 2){
			key = "";
			name = args[0];
			source = args[1];
		}

		var seed = {};
		seed[name] = source;
		return T.add(key, seed);
	};

	/**
	 * Parse text on the elements of template
	 * @param source {String} Source code of the template.
	 * @return {Object}
	 * @method parse
	 * @static
	 * 
	 * @example
	 * 
	 * on html page
	 * 
	 * 	<script id="abricosjs-template" type="text/x-abricosjs-template">
	 * 		<!--{widget}-->
	 * 		<div class='widget'>{#widget.title}</div>
	 * 		
	 * 		<!--{panel}-->
	 * 		<div class='panel'>
	 * 			<div class='hd'>{#panel.title}</div>
	 * 		</div>
	 * 	</script>
	 * 
	 * in JavaScript
	 * 
	 * 	var el = document.getElementById('abricosjs-template'),
	 * 		t = T.parse(el.innerHTML);
	 * 	console.log(t); // > {widget: "<div class='widget'>...</div>", panel: "<div class='panel'>...</div>"}
	 */
	T.parse = function(source){
		if (!L.isString(source)){ return {}; }
		
		var t = {},
			sre = '<!--{([a-zA-Z0-9_-]+)}-->',
			re = new RegExp(sre, 'g'),
			lre = new RegExp(sre),
			ma = source.match(re),
			i, lma, pos, tnm;
			
		for (i=ma.length-1;i>=0;i--){
			lma = ma[i].match(lre);
			tnm = lma[1];
			pos = source.indexOf(lma[0]);
			
			t[tnm] = source.substring(pos+lma[0].length);
			source = source.substring(0, pos-1);
		}
		return t;
	};

	/**
	 * Get a template collection by ID (namespace).
	 * 
	 * @param key {String|Array} Template ID.
	 * @return {Object} Templates
	 * @method get
	 * @static
	 */
	T.get = function(key){
		return A.objectByKey(A.Env.temps, key);
	};
	

	/**
	 * The TemplateManager class.
	 * @class Abricos.TemplateManager
	 * @constructor
	 * @param key {String|Array|Abricos.Key} Template ID.
	 * @param cfg {Object} Config.
	 */
	var TemplateManager = function(key, cfg){
		
		cfg = Y.merge({
			'idPrefix': 'abricos_',
			'lang': CONF.lang,
			'defTName': null
		}, cfg || {});
		
		this.init(key, cfg);
	};
	
	TemplateManager._counter = 1;
	
	TemplateManager.prototype = {
		init: function(key, cfg){
			/**
			 * Key.
			 * @property key
			 * @type Abricos.Key
			 */
			this.key = key = new A.Key(key);
			
			/**
			 * Config.
			 * @property cfg
			 * @type Object
			 */
			this.cfg = cfg;
			
			/**
			 * Map unique identifiers in the template
			 * @proprty idMap
			 * @type Object
			 */
			this.idMap = {};

			/**
			 * Elements of template data
			 * @property data
			 * @type Object
			 */
			this.data = {};

			// replace language IDs in text.
			// before filling phrases need to add them in storage
			var tOrig = T.get(key), 
				t = {},
				expLong = new RegExp("(\{\#[a-zA-Z0-9_\.\-]+\})", "g"),
				expShort = new RegExp("(\{\##[a-zA-Z0-9_\.\-]+\})", "g"),
				expId = new RegExp("(\{i\#[a-z0-9_\-]+\})", "gi"),
				s, arr, i, rkey, ph, skey;
			
			for (var name in tOrig){
				if (!L.isValue(cfg.defTName)){
					cfg.defTName = name;
				}
				s = tOrig[name];
				
				// replacement of long IDs {#...}
				arr = s.match(expLong);
				if (L.isArray(arr)){ 
					for (i=0;i<arr.length;i++){
						skey = arr[i].replace(/[\{#\}]/g, '');
						
						ph = LNG.get(skey, cfg.lang);
						s = s.replace(arr[i], ph);
					}
				}
				
				// replacement of short IDs {##...}
				arr = s.match(expShort);
				if (L.isArray(arr)){
					
					for (i=0;i<arr.length;i++){
						skey = arr[i].replace(/[\{##\}]/g, '');
						rkey = key.push(name+"."+skey, true);
						
						ph = LNG.get(rkey, cfg.lang);
						s = s.replace(arr[i], ph);
					}
				}

				// create a map of unique identifiers in the template
				// Eexample: "<div id='{i#mydiv}'>...</div>" => (idMap[mydiv] = 'abricos_8462') 
				arr = s.match(expId);
				if (L.isArray(arr)) { 
					var genid,
						tIdMap = this.idMap[name] = {};
					for (i=0;i<arr.length;i++){
						skey = arr[i].replace(/\{i#([a-zA-Z0-9_\-]+)\}/, '$1');
						
						if (tIdMap[skey]){ continue; }
						
						tIdMap[skey] = genid = this.genid(name);
						
						s = s.replace(new RegExp(arr[i], "gi"), genid);
					}
				}
				t[name] = s;
			}
			
			this.data = t;
		},
		/**
		 * Generate unique ID prefix.
		 * @param name {String} Name of element of template.
		 * @method genid
		 * @return {String} ID prefix.
		 */
		genid: function(name){
			var cfg = this.cfg,
				id = cfg.idPrefix;
			
			id += this.key.toString.replace(".", "_")+name;
			id += '_'+(TemplateManager._counter++);
			
			return id;
		},
		
		/**
		 * Get element of template
		 * @param name {String}
		 * @return {String}
		 * @method get
		 */
		get: function(name){
			return (this.data[name] || "");
		},
		
		/**
		 * Replace values ​​for the variables in the template.
		 * @param tnm {String} Name of element of template.
		 * @param obj {Object|String} Variables and their values.
		 * @param [val] {String} If type `obj` is String, then this parameter 
		 * must contain a value.
		 * @return {String}
		 */
		replace: function(tnm, obj){
			var t = this.get(tnm),
				args = SLICE.call(arguments, 0);
			
			if (args.length > 2 && L.isString(args[1])){
				// Example: TM.replace('widget', 'myvar', 'Hello World!');
				var no = {};
				no[args[1]] = args[2];
				o = no;
			}
			
			if (!L.isObject(obj)){ return t; }
			
			var exp;
			for (var nm in obj){
				exp = new RegExp("\{v\#"+nm+"\}", "g");
				t = t.replace(exp, obj[nm]);
			}
			
			return t;
		},
		
		/**
		 * Get HTML element Id
		 * @param idKey {String}
		 * @method gelid
		 * @return {String}
		 */
		gelid: function(idKey){
			if (!L.isString(idKey)){ return null; }
			
			var tName = this.cfg['defTName'],
				a = idKey.split('.');
			
			if (!L.isString(tName)){ return null; }
			
			if (a.length > 1){
				var tnm = L.trim(a[0]);
				if (tnm.length > 0){
					tName = tnm;
				}
				idKey = a[1];
			}
			var ta = this.idMap[tName];
			if (!ta){ return null; }
			
			return ta[idKey] || null;
		},
		
		/**
		 * Get HTML element
		 * @param idKey {String}
		 * @return {String}
		 * @method gel
		 */
		gel: function(idKey){
			var id = this.gelid(idKey);
			if (!L.isValue(id)){ return null; }
			
			var el = document.getElementById(id);
			
			return el || null;
		}
	};
	A.TemplateManager = TemplateManager;

	/**
	 * Component of module
	 * 
	 * @class Abricos.Component
	 * @constructor
	 * @param cfg {Object}
	 */
	var Component = function(cfg){
		cfg = Y.merge({
			'entryPoint': null
		}, cfg || {});
		
		this.init(cfg);
	};
	Component.prototype = {
		init: function(cfg){
		
			this.moduleName = cfg['modName'];
			
			this.name = cfg['compName'];
			
			this.entryPoint = cfg['entryPoint'];
			
			this.namespace = A.mod[this.moduleName] || (A.mod[this.moduleName] = {});
			
			this.template = new A.ComponentTemplate(this);
			
			this.language = new A.ComponentLanguage(this);

			// TODO: necessary to implement
			this.requires = {};
		}
	};
	A.Component = Component;
	
	var ComponentTemplate = function(component){
		this.init(component);
	};
	ComponentTemplate.prototype = {
		init: function(component){
			this.component = component;
		},
		getItems: function(){
			var comp = this.component,
				ts = T.get(comp.moduleName, comp.name);
			
			return L.isValue ? ts : {};
		},
		get: function(name){
			var ts = this.getItems();
			return ts[name] || null; 
		},
		build: function(){
			var args = SLICE.call(arguments, 0),
				alen = args.length,
				comp = this.component,
				mnm = comp.moduleName,
				cnm = comp.name,
				tNames = "",
				oBind = null,
				cfg = {
					'lang': CONF.lang
				};


			// CMP.template.build(oBind, sTNames [,(oCfg|null)]);
			if (L.isObject(args[0]) && L.isString(args[0])){
				oBind = args[0];
				tNames = args[1];
			}
			
			// CMP.template.build(sTNames [,(oCfg|null)]);
			if (L.isString(args[0])){
				tNames = args[0];
			}

			if (L.isObject(args[alen-1])){
				cfg = args[alen-1];
			}

			// TODO: oBind - bind function

			cfg = Y.merge(cfg, {
				'modName': mnm, 
				'compName': cnm 
			});
			
			return T.build(tNames, cfg);
		}
	};
	A.ComponentTemplate = ComponentTemplate;
	
	var ComponentLanguage = function(component){
		this.init(component);
	};
	ComponentLanguage.prototype = {
		init: function(component){
			this.component = component;
		},
		get: function(key, cfg){
			var comp = this.component;
			
			return LNG.get('mod.'+comp.moduleName+'.'+comp.name+'.'+key);
		}
	};
	A.ComponentLanguage = ComponentLanguage;
	

	/**
	 * The CSS class
	 * 
	 * @class Abricos.CSS
	 * @static
	 */

	var CSS = A.CSS = {};
	
	CSS.add = function(seed, mnm, cnm, cfg){
		
		if (!L.isString(seed)){ return; }
		
		var cfg = {
				'modName': CONF.defModName,
				'compName': CONF.defCompName
			},
			args = SLICE.call(arguments, 0),
			aln = args.length,
			css = A.Env.css;
		
		var source = L.trim(args[0]);
		
		if (source.indexOf('#') === 0){
			var el = document.getElementById(source.substring(1));
			if (!el){
				source = "";
			}else{
				source = el.innerHTML;
			}
			seed = source;
		}
		
		if (aln >= 3){
			cfg = Y.merge(cfg, {
				'modName': args[1],
				'compName': args[2]
			});
		}
		
		mnm = cfg.modName;
		cnm = cfg.compName;			

		var cssm = css[mnm] || (css[mnm] = {});
		cssm[cnm] = seed;
		
		return seed;
	};
	
	
	/**
	 * Get the css source of a specific component.
	 * @param {String} mnm The name of the module.
	 * @param {String} cnm The name of the component.
	 * @method get
	 * @return {Object}
	 * @static
	 */
	CSS.get = function(mnm, cnm){
		var t = A.Env.css;
		
		if (t[mnm] && t[mnm][cnm]){
			return t[mnm][cnm];
		}
		return null;
	};
	
	CSS.apply = function(mnm, cnm){
		var css = CSS.get(mnm, cnm);
		if (!L.isValue(css)){ return null; }
		
		if (CSS.disable){ return; }

		var style = document.createElement('style');
		style['type'] = 'text/css';
		
		if (style.styleSheet){ // IE
			style.styleSheet.cssText = css;
		}else{
			var tt1 = document.createTextNode(css);
			style.appendChild(tt1);
		}
		
		var hh1 = document.getElementsByTagName('head')[0];
		hh1.appendChild(style);
	};
		
		
	
    /**
     * The Abricos global namespace object.
     * 
     * @class Abricos
     * @static
     */

	/**
	 * Get object by key (namespace).
	 * If the element of object does not exist, it is created.
	 * @param obj {Object} Object.
	 * @param key {String|Array} Key.
	 * @param [create=false] {Boolean} If TRUE -method will create 
	 * 		an object if it is not found on a key.
	 * @method objectByKey
	 * @static
	 * @return {Object}
	 * 
	 * @example
	 * 
	 * 	var d = {mod: {}};
	 * 	A.objectByKey(d, 'mod.mymod.mycomp', true);
	 * 	console.log(d); // > {mod:{mymod:{mycomp:{}}}}
	 * 	
	 * 	var d1 = A.objectByKey(d, 'mod.mymod');
	 * 	console.log(d1); // > {mycomp:{}}
	 * 	
	 * 	var d2 = A.objectByKey(d, 'mod.test');
	 * 	console.log(d2); // > null
	 */
	A.objectByKey = function(obj, key, create){
		if (L.isObject(obj)){ return null; }
		
		key = new A.Key(key);
		
		var l = obj;
		key.each(function(ki){
			l = l[ki];
			if (!l && !create){
				return null;
			}
			l = l || (l[ki]={});
		});
		return l;
	};
	
	/**
	 * Determines if the component with the given name exists.
	 * 
	 * @param {String} mnm The name of the module.
	 * @param {String} cnm The name of the component.
	 * @return {Boolean} True if the component exists, false if not.
	 * @method exists
	 * @static
	 */
	/*
	A.exists = function(mnm, cnm){
		var mods = A.Env.mods;

		if (!mods[mnm]){ return false; }

		return !!(mods[mnm][cnm]);
	};
	/**/

	var stackUse = [];
	
	A.use = function(){
        var args = SLICE.call(arguments, 0),
        	callback = args[args.length - 1];
        
        if (L.isFunction(callback)){
        	args.pop();
        }else{
        	callback = null;
        }

    	stackUse[stackUse.length] = [args, callback];

        if (!A._loading){
        	A._use();
        }
	};
	
	A._use = function(){
		if (stackUse.length == 0){ return; }

		var su = stackUse.pop(),	
			args = su[0],
			callback = su[1];

		if (L.isFunction(callback)){
			callback(A);
		}
		A._use();
	};

	
	var stackModsToInit = [];
	
	A.add = function(mnm, cnm, o){
		var mods = A.Env.mods;

		if (A.exists(mnm, cnm)){
			throw new Error("Component is already registered: module="+mnm+", component="+cnm);
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
		
		comp.moduleName = mnm;
		comp.name = cnm;
		
		var m = mods[mnm] || (mods[mnm] = {});
		m[cnm] = comp;

		stackModsToInit[stackModsToInit.length] = comp;

		if (!A._loading){
			A._add();
		}
	};
	
	A._add = function(){
		if (stackModsToInit.length == 0){ return; }
		
		var comp = stackModsToInit.pop();

		if (L.isFunction(comp.entryPoint)){
			
			var mnm = comp.moduleName, 
				NS = A.mod[mnm] || (A.mod[mnm] = {});
			
			comp.entryPoint(NS, comp);
		}
		A._add();
	};
	
	var onDOMReady = function(){
		A._loading = false;
		
		A._add();
		A._use();
	};
	
	(function() {
	    if (document.addEventListener) {
	        return document.addEventListener('DOMContentLoaded', onDOMReady, false);
	    }
	    window.attachEvent('onload', onDOMReady);
	}) ();
	
};


/**
 *  
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
 * 
 * @class YUI
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
	@static
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
	 * @class YUI.Lang
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

