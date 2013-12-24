/**
 * @module draft
 * @class DRAFT
 */

/**
 * Идентификаторы фраз в тексте определяются следующим форматом:
 * {#key}
 * где key - идентификатор фразы
 * например:
 * 
 */



/**
Add a language phrases in global storage.

<p>
The config argument object supports the following properties:
</p>
<dl>
<dt>modName &#60;String&#62;</dt>
<dd>Module name</dd>

<dt>compName &#60;String&#62;</dt>
<dd>Component name</dd>
<dt>inRoot &#60;boolean&#62;</dt>
<dd>If True - ignore component namespace (mod.modname.compname)</dd>
</dl>

@param lang {String} Language ID
@param o {Object} Language phrases
@param [modName=config.defModName] {String} Module name
@param [compName=config.defCompName] {String} Component name
@param [cfg] {Object} Config
@method add
@static

@example

Adding phrases in a specific component dictionary:

	LNG.add('en', {
		'widget': {
			'title': 'Hello World!'
		}
	}, 'mymod', 'mycomp');
	var ph = LNG.get('mod.mymod.mycomp.widget.title');
	console.log(ph); // > Hello World!

@example

Adding phrases in a global dictionary:

	LNG.add('en', {
		'widget': {
			'title': 'Hello World!'
		}
	});
	var ph = Abricos.Language.get('widget.title');
	console.log(ph); // > Hello World!
**/


// T.add(oSeed, sModName, sCompName)
// T.add(sTElName, sTElBody, sModName, sCompName);
// T.add(sSeed, sModName, sCompName)
// T.add('#htmlElId', sModName, sCompName);
T.add = function(){

	var args = SLICE.call(arguments, 0),
		alen = args.length, 
		mnm = CONF['defModName'], // module name 
		cnm = CONF['defCompName'], // component name
		seed,
		isSetMC = false;
	
	if (L.isObject(args[0])){ // T.add(oSeed, sModName, sCompName)
		isSetMC = alen == 3;
		seed = args[0];
	}else if (L.isString(args[0])){
		var source = L.trim(args[0]);
		
		if (source.indexOf('#') === 0){
			var el = document.getElementById(source.substring(1));
			if (!el){
				source = "";
			}else{
				source = el.innerHTML;
			}
		}
		
		if (alen==2 || alen==4){// T.add(sTElName, sTElBody, sModName, sCompName);
			isSetMC = alen == 4;

			
		}else if (alen==1 || alen==3){// T.add(sSeed, sModName, sCompName)
			isSetMC = alen == 3;
			
			seed = T.parse(source);
		}
	}
	
	if (isSetMC){
		mnm = args[alen-2];
		cnm = args[alen-1];
	}
	
	var t = A.Env.temps,
		tm = t[mnm] || (t[mnm] = {}),
		tmc = tm[cnm] || (tm[cnm] = {});

	if (L.isObject(seed)){
		// Template.add({...}, modName, compName)
		for (var tName in seed){
			
			if (!L.isString(seed[tName])){ continue; }
			
			tmc[tName] = seed[tName];
		}
	}else if (L.isString(seed)){
		
	}
	
	return T.get(mnm, cnm);
};

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
 * Для того, чтобы избежать конфликтов при использовании
 * множества различных виджетов (их фраз и т.п.) используется 
 * разделение по модулям и содержащихся в них компонентах. 
 */
Abricos.Component = function(){
	// ...
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
