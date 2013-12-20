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
LNG.add_OLD = function(lang, o, modName, compName, cfg){ // TODO: refactor

	var cfg = {
			'modName': CONF.defModName,
			'compName': CONF.defCompName,
			'inRoot': false // True - ignore component namespace (mod.modname.compname)
		},
		d = A.Env.langs,
		dLang = d[lang] || (d[lang] = {}),
		args = SLICE.call(arguments, 0),
		aln = args.length;
	
	
	
	if (aln > 2 && L.isObject(args[aln-1])){
		cfg = L.merge(cfg, args[aln-1]);
	}
	
	if (cfg.inRoot){
		cloneLang(o, dLang);
	}else{
		if (aln >= 4){
			cfg = Y.merge(cfg, {
				'modName': args[2],
				'compName': args[3]
			});
		}
		var mnm = cfg.modName, cnm = cfg.compName,
			no = {'mod': {}};
		
		no['mod'][mnm] = {};
		no['mod'][mnm][cnm] = o;

		cloneLang(no, dLang);
	}
};


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
 * Get templates of a specific component.
 * @param {String} mnm The name of the module.
 * @param {String} cnm The name of the component.
 * @method get
 * @return {Object}
 * @static
 */
T.get = function(mnm, cnm){
	
	var args = SLICE.call(arguments, 0);
	if (L.isObject(args[0])){
		var cfg = args[0];
		mnm = cfg.modName;
		cnm = cfg.compName;
	}
	mnm = mnm || CONF['defModName'];
	cnm = cnm || CONF['defCompName'];

	var t = A.Env.temps;
	
	if (t[mnm] && t[mnm][cnm]){
		return t[mnm][cnm];
	}
	return null;
};


T.build = function(names, cfg){
	cfg = Y.merge({
		'lang': CONF.lang,
		'modName': CONF.defModName,
		'compName': CONF.defCompName,
		'defTName': null
	}, cfg || {});
	
	var t = T.get(cfg);
	if (!L.isObject(t)){
		t = {};
	}
	
	names = L.isString(names) ? names : '';
	
	// cloning template elements
	var ct = {};
	if (names != ''){
		var arr = names.split(','), i, name, defTName = null;
		for (i=0;i<arr.length;i++){
			name = L.trim(arr[i]);
			
			if (!t[name]){ continue; }
			ct[name] = t[name];
			if (!defTName){
				defTName = name;
			}
		}
		if (!L.isValue(cfg['defTName'])){
			cfg['defTName'] = defTName;
		}
	}else{
		for (var name in t){
			ct[name] = t[name]; 
		}
	}
	
	var css = CSS.get(cfg.modName, cfg.compName);
	if (L.isValue(css) && !css._cssApplied){
		css._cssApplied = true;
		
		// applying CSS on the first call buildTemplate
		CSS.apply(cfg.modName, cfg.compName);
	}

	return new A.TemplateManager(ct, cfg);
};


/**
 * Для того, чтобы избежать конфликтов при использовании
 * множества различных виджетов (их фраз и т.п.) используется 
 * разделение по модулям и содержащихся в них компонентах. 
 */
Abricos.Component = function(){
	// ...
};

