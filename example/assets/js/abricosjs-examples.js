var A = Abricos, 
	MODNAME = 'abricos.js',
	COMPNAME = 'exmaples';

A.Template.add(MODNAME, COMPNAME, {
	"menuitem": 
		"<li class='{v#sel}'>" +
		"<a href='{v#link}'>{v#title}</a>" +
		"</li>"
});

A.Language.add('en', MODNAME, COMPNAME, {
	'pages': {
		'0': {
			'nm': 'index.html',
			'tl': 'Template in JS'
		}
	}
});

A.add(MODNAME, COMPNAME, function(NS){
	
	var buildTemplate = this.buildTemplate;
	
	var MainMenuWidget = function(container){
		this.init(container);
	};
	MainMenuWidget.prototype = {
		init: function(container){
			
			var TM = buildTemplate('menuitem');
			
			elContainer.innerHTML = TM.replace('widget');
			
			var elBtnSet = TM.gel('widget.btnSet');
			elBtnSet.onclick = function(){
				TM.gel('widget.title').className = 'helloWorldBold';
			};

			var elBtnClear = TM.gel('widget.btnClear');
			elBtnClear.onclick = function(){
				TM.gel('widget.title').className = '';
			};
			
		}
	};
	NS.MainMenuWidget = MainMenuWidget;
	
});