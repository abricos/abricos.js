var A = Abricos, 
	MODNAME = 'example',
	COMPNAME = 'helloworld';

// Add template
A.Template.add({
	"widget": "<div id='{i#id}'>" +
		"<span id='{i#title}'>{##title}</span> <br />" +
		"<input id='{i#btnSet}' type='button' value='{##button.set}'/>" +
		"<input id='{i#btnClear}' type='button' value='{##button.clear}'/>" +
		"</div>"
}, MODNAME, COMPNAME);

// Add phrases of English
A.Language.add('en', {
	'widget': {
		'title': 'Hello World!',
		'button': {
			'set': 'Set Style',
			'clear': 'Clear Style'
		}
	}
}, MODNAME, COMPNAME);

//Add phrases of Russian
A.Language.add('ru', {
	'widget': {
		'title': 'Привет мир!',
		'button': {
			'set': 'Установить стиль',
			'clear': 'Очистить стиль'
		}
	}
}, MODNAME, COMPNAME);

// Add CSS Style
A.CSS.add(".helloWorldBold {font-weight: bold; color: red;}", MODNAME, COMPNAME);

// Register the component of module in core
// MODNAME - module name ('example')
// COMPNAME = component name ('helloworld')
// NS - module namespace ('Abricos.mod.example')
// CMP - component instance
A.add(MODNAME, COMPNAME, function(NS, CMP){

	var HelloWorldWidget = function(elContainer, cfg){
		cfg = cfg || {};
		this.init(elContainer, cfg);
	};
	HelloWorldWidget.prototype = {
		init: function(elContainer, cfg){
			
			var TM = CMP.template.build('widget', {
				'lang': (cfg.lang || null) 
			});
			
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