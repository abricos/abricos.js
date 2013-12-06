var A = Abricos, 
	MODNAME = 'example',
	COMPNAME = 'helloworld';


A.template.add(MODNAME, COMPNAME, {
	"widget": "<div id='{i#id}'>" +
		"<span id='{v#title}'>{##title}</span>" +
		"<input id='{i#btnSet}' type='button' value='{##button.set}'/>" +
		"<input id='{i#btnClear}' type='button' value='{##button.clear}'/>" +
		"</div>"
});

A.language.add('en', {MODNAME: {COMPNAME: {
	'widget': {
		'title': 'Hello World!',
		'button': {
			'set': 'Set Bold Style',
			'clear': 'Clear Style'
		}
	}
}}});

A.css.add(MODNAME, COMPNAME, ".helloWorldBold {font-weight: bold;}");

A.add(MODNAME, COMPNAME, new A.Component({
	'entryPoint': function(NS){
		
		var buildTemplate = this.buildTemplate;
		
		var HelloWorldWidget = function(elContainer){
			this.init(elContainer);
		};
		HelloWorldWidget.prototype = {
			init: function(elContainer){
				
				var TM = buildTemplate('widget');
				
				elContainer.innerHTML = TM.replace('widget');
				
				var elBtnSet = TM.gel('widget.btnSet');
				elBtnSet.onClick = function(){
					elBtnSet.className = 'helloWorldBold';
				};

				var elBtnClear = TM.gel('widget.btnClear');
				elBtnClear.onClick = function(){
					elBtnClear.className = '';
				};
				
			}
		};
		NS.HelloWorldWidget = HelloWorldWidget;
	}
}));