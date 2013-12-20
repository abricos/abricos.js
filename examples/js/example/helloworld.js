Abricos.add('example', 'helloworld', {
	
'template': {
	"widget": "<div id='{i#id}'>" +
		"<span id='{i#title}'>{##title}</span> <br />" +
		"<input id='{i#btnSet}' type='button' value='{##button.set}'/>" +
		"<input id='{i#btnClear}' type='button' value='{##button.clear}'/>" +
		"</div>"
},

'language': {
	'en': {
		'widget': {
			'title': 'Hello World!',
			'button': {
				'set': 'Set Style',
				'clear': 'Clear Style'
			}
		}
	},
	'ru': {
		'widget': {
			'title': 'Привет мир!',
			'button': {
				'set': 'Установить стиль',
				'clear': 'Очистить стиль'
			}
		}
	}
},

'css': ".helloWorldBold {font-weight: bold; color: red;}",

'entryPoint': function(NS, CMP){

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
}

});