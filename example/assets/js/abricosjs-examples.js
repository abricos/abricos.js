var A = Abricos, 
	MODNAME = 'abricos.js',
	COMPNAME = 'exmaples';

A.Template.add(MODNAME, COMPNAME, {
	"menuitem": 
		"<li class='{v#sel} {v#divided}'>" +
		"<a href='{v#link}'>{v#title}</a>" +
		"</li>"
});

var PAGES = [{
	'nm': 'index',
	'tl': 'Template in JS'
}, {
	'nm': 'abricos.org',
	'tl': 'Abricos Platform',
	'url': 'http://abricos.org',
	'divided': true
}];

A.add(MODNAME, COMPNAME, function(NS, CMP){
	
	var MainMenuWidget = function(container, cfg){
		this.init(container, cfg || {});
	};
	MainMenuWidget.prototype = {
		init: function(container, cfg){

			var TM = this.tm = CMP.template.build('menuitem'),
				lst = "";
			
			for (var i=0;i<PAGES.length;i++){
				var p = PAGES[i];
				lst += TM.replace('menuitem', {
					'link': ''+p.nm+'.html',
					'title': p.tl,
					'sel': '',
					'divided': (p.divided ? 'menu-item-divided' : '')
				});
			}
			
			container.innerHTML = lst;
		}
	};
	
	var elMenu = document.getElementById("menucontainer");
	
	if (elMenu){
		new MainMenuWidget(elMenu);
	}
	
});