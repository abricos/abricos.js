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
	
});