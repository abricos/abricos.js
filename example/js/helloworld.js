var A = Abricos, 
	MODNAME = 'example',
	COMPNAME = 'helloworld';

A.Template.add(MODNAME, COMPNAME, {
	"widget": "<div id='{i#id}'>" +
		"<span id='{i#title}'>{##title}</span> <br />" +
		"<input id='{i#btnSet}' type='button' value='{##button.set}'/>" +
		"<input id='{i#btnClear}' type='button' value='{##button.clear}'/>" +
		"</div>"
});

A.Language.add('en', MODNAME, COMPNAME, {
	'widget': {
		'title': 'Hello World!',
		'button': {
			'set': 'Set Style',
			'clear': 'Clear Style'
		}
	}
});

A.Language.add('ru', MODNAME, COMPNAME, {
	'widget': {
		'title': 'Привет мир!',
		'button': {
			'set': 'Установить стиль',
			'clear': 'Очистить стиль'
		}
	}
});

A.CSS.add(MODNAME, COMPNAME, ".helloWorldBold {font-weight: bold; color: red;}");

A.add(MODNAME, COMPNAME, function(NS, CMP){
	
	var HelloWorldWidget = function(elContainer){
		this.init(elContainer);
	};
	HelloWorldWidget.prototype = {
		init: function(elContainer){
			
			var TM = CMP.template.build('widget');
			
			elContainer.innerHTML = TM.replace('widget');
			
			var elTitle = TM.gel('widget.title'),
				elBtnSet = TM.gel('widget.btnSet'),
				elBtnClear = TM.gel('widget.btnClear');
			
			elBtnSet.onclick = function(){
				elTitle.className = 'helloWorldBold';
			};

			elBtnClear.onclick = function(){
				elTitle.className = '';
			};
			
		}
	};
	NS.HelloWorldWidget = HelloWorldWidget;
	
});