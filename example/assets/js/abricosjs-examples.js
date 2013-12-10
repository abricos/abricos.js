var A = Abricos, 
	MODNAME = 'abricos.js',
	COMPNAME = 'exmaples';

A.Template.add(MODNAME, COMPNAME, {
	"menu": "<div class='pure-menu pure-menu-open'>"+
    	"<a class='pure-menu-heading' href='index.html'>"+
    	"<span class='lang-en'>Examples</span>"+
    	"<span class='lang-ru'>Примеры</span>"+
    	"</a>"+
    	"<ul id='menucontainer'>{v#rows}</ul>"+
    	"</div>",

	"menuitem": 
		"<li class='{v#sel} {v#divided}'>" +
		"<a href='{v#link}'>{v#title}</a>" +
		"</li>",
	
	"langchange": "<div id='{i#id}'>" +
		"<a href='#' id='{i#ben}' class='lang-ru'>English</a>" +
		"<a href='#' id='{i#bru}' class='lang-en'>Русский</a>" +
		"</div>",
		
	"footer": 
		"<div class='pure-u-2-5'>"+
		"	<div class='l-box'>"+
		"	    <p class='legal-license'>"+
		"	        This site is built with using Abricos.js v0.1<br>"+
		"	        All code on this site is licensed under the <a href='https://github.com/abricos/abricos.js/blob/master/LICENSE'>MIT License (MIT)</a> unless stated otherwise."+
		"	    </p>"+
		"	</div>"+
		"</div>"+
		"<div class='pure-u-1-5'>"+
		"	<div class='l-box legal-logo'>"+
		"	    <a href='http://abricos.org/'>"+
		"	        <img src='assets/img/logo-footer.png' height='50' width='50'"+
		"	             alt='Abricos logo'>"+
		"	    </a>"+
		"	</div>"+
		"</div>"+
		"<div class='pure-u-2-5'>"+
		"	<div class='l-box'>"+
		"	    <ul class='legal-links'>"+
		"	        <li><a href='https://github.com/abricos/abricos.js'>GitHub Project</a></li>"+
		"	    </ul>"+
		"	    <p class='legal-copyright'>"+
		"	        &copy; 2013 Abricos.js. All rights reserved."+
		"	    </p>"+
		"	</div>"+
		"</div>"
		
});

var PAGES = [{
	'nm': 'index',
	'tl': 'Simple Widget'
}, {
	'nm': 'abricos.org',
	'tl': 'Abricos Platform',
	'url': 'http://abricos.org',
	'divided': true
}];

A.add(MODNAME, COMPNAME, function(NS, CMP){
	
	var LanguageChangeWidget = function(container){
		this.init(container);
	};
	LanguageChangeWidget.prototype = {
		init: function(container){
			var TM = CMP.template.build('langchange');
			container.innerHTML = TM.replace('langchange');

			var __self = this;

			TM.gel('ben').onclick = function(){
				__self.setLanguage('en');
				return false;
			};
			TM.gel('bru').onclick = function(){
				__self.setLanguage('ru');
				return false;
			};
		},
		setLanguage: function(lang){
			document.body.className = 'lang-'+lang;
		}
	};
	
	var MainMenuWidget = function(container, cfg){
		this.init(container, cfg || {});
	};
	MainMenuWidget.prototype = {
		init: function(container, cfg){

			var TM = CMP.template.build('menu,menuitem'),
				lst = "";
			
			for (var i=0;i<PAGES.length;i++){
				var p = PAGES[i];
				lst += TM.replace('menuitem', {
					'link': p.url || (''+p.nm+'.html'),
					'title': p.tl,
					'sel': '',
					'divided': (p.divided ? 'menu-item-divided' : '')
				});
			}
			
			container.innerHTML = TM.replace('menu', {
				'rows': lst
			});
		}
	};
	
	var elLang = document.getElementById("lang-change-container");
	if (elLang){
		new LanguageChangeWidget(elLang);
	}

	
	var elMenu = document.getElementById("menu");
	if (elMenu){
		new MainMenuWidget(elMenu);
	}
	
	var elFooter = document.getElementById("footer-container");
	if (elFooter){
		elFooter.innerHTML = CMP.template.build('footer').replace('footer');
	}
	
});