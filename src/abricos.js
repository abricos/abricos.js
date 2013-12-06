/*
 * abricos.js - TemplateManager management framework (JavaScript)
 * http://github.com/abricos/abricos.js
 * 
 * The algorithm used based Abricos Platform (http://abricos.org)
 * 
 * The MIT License
 */

if (typeof Abricos == 'undefined' || !Abricos){
	Abricos = {};
}

Abricos['mod'] = Abricos['mod'] || {};

(function(){

	var gel = function(nm){ return document.getElementById(nm); };

	var TemplateManager = function(){
		this.init();
	};
	TemplateManager.prototype = {
		init: function(){},
		add: function(mName, cName){
			
		}
	};
	Abricos.template = new TemplateManager();

	var LanguageManager = function(){
		this.init();
	};
	LanguageManager.prototype = {
		init: function(){},
		add: function(mName, cName){
			
		}
	};
	Abricos.language = new LanguageManager();
	

	var CSSManager = function(){
		this.init();
	};
	CSSManager.prototype = {
		init: function(){},
		add: function(mName, cName){
			
		}
	};
	Abricos.css = new CSSManager();

	
	var Component = function(){
		this.init();
	};
	Component.prototype = {
		init: function(cfg){
		
			this.moduleName = '';
			
			this.name = '';
			
			// this.requires = {};

			this.entryPoint = function(){};
			
			// this.onLoad = function(){};
			
		}
	};
	Abricos.Component = Component;
	
	Abricos.add = function(modName, compName, fn){
		var comp = new Abricos.Component();
		comp.entryPoint = fn;
	};

})();