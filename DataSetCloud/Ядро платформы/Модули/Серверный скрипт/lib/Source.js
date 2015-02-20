/**
 * @fileoverview
 * @author elifantievon
 */

var EVENTS = ['onNewRecord', 'onSettingsParsed', 'onComplete', 'onWayExists', 'onResults'];

/**
 * Асинхронная загрузка XML-документа с шаблоном.
 * Для каждого файла непосредственно загрузка будет выполняться только один раз
 *
 * @param {String} templateName имя шаблона или путь (если начинается с . или /)
 * @param {Boolean} [fast]
 * @returns {$ws.proto.Deferred}
 */
$ws.core.loadTemplateFile = function(templateName, fast){

   /**
    * Функция, запрашивающая шаблон.
    * @param {String} file конкретное абсолютное имя файла шаблона
    * @return {$ws.proto.Deferred}
    */
   function requestTemplateFile(file){
      //проверяем загружался ли хоть 1 из пакетов содержащий нужный шаблон, если нет - берем последний
      if (!fast && file instanceof Array){
         for (var i = 0, l = file.length; i < l; i++){
            if ($ws.single.Storage.isStored('resfile://' + file[i]) || i == l - 1){
               file = file[i];
               break;
            }
         }
      }

      var sid = ($ && $.cookie && $.cookie('sid')) || '',
          rid = ($ && $.cookie && $.cookie('rid')) || 0,
          addVer = '' + (parseInt(sid.split('-')[3], 16) || 0) + rid;

      return $ws.single.Storage.store('resfile://' + file, function(dResult){
         dResult.dependOn($ws.single.ioc.resolve('ITransport', {
            dataType: fast ? 'text' : 'xml',
            url: (function(){
               // При запросе XML допишем к версии случайный компонент sid и идентификатор прав (передаваемый в cookie)
               var old = $ws._const.buildnumber, res;
               if(old) {
                  $ws._const.buildnumber = old + addVer;
               }
               res = $ws.core.urlWithHost(file + (fast ? '.fast.xml' : '.xml'));
               if(old) {
                  $ws._const.buildnumber = old;
               }
               return res;
            })()
         }).execute(null));
      });
   }

   // Если ресурс пакетирован - грузим пакет и ищем там
   if($ws._const.xmlPackages[templateName] && !fast){
      return new $ws.proto.Deferred().dependOn(requestTemplateFile($ws._const.xmlPackages[templateName]))
            .addCallback(function(res){
               var root = res.documentElement;
               for(var j = root.childNodes.length - 1; j >= 0; --j){
                  if(root.childNodes[j].nodeType != $ws._const.nodeType.ELEMENT_NODE) {
                     continue;
                  }
                  if(root.childNodes[j].getAttribute('id') == templateName) {
                     return root.childNodes[j];
                  }
               }
               return new Error(templateName + ' is not found in the package ' + $ws._const.xmlPackages[templateName]);
            });
   }

   // Иначе работаем по старой схеме
   var
      firstChar = templateName.charAt(0),
      base = '';
   // Если первый символ . или / - значит это путь. Грузим его непосредственно. В противном случае
   // это или ресурс движка или ресурс по оглавлению
   if(firstChar !== '/' && firstChar !== '.') {
      // Проверим есть ли в оглавлении
      if(templateName in $ws._const.xmlContents) {
         templateName = $ws._const.xmlContents[templateName];
         firstChar = templateName.charAt(0);
         if (firstChar !== '/'){
            // Если у нас не абсолютный путь
            base = $ws._const.resourceRoot;
         }
      } else {
         // если нет - грузим из ресурсов движка
         base = $ws._const.wsRoot + 'res/xml/';
      }
   }
   return requestTemplateFile(base + templateName);
};

/**
 * Асинхронная загрузка инстанса класса $ws.proto.Template
 * Для каждого не первого вызова будет отдаваться ранее созданный инстанс
 *
 * @param {String} templateName имя шаблона
 * @param {Object} [options]
 * @param {Boolean} [options.fast=false]
 * @param {String} [options.html='']
 * @returns {$ws.proto.Deferred}
 */
$ws.core.attachTemplate = function(templateName, options){

   var
      res,
      block = BOOMR.plugins.WS.startBlock('$ws.core.attachTemplate:' + templateName),
      fast = false,
      html = '';

   if (options && typeof options == 'object') {
      fast = options.fast || false;
      html = options.html || '';
   } else {
      fast = arguments[1];
      html = arguments[2];
   }

   block.openSyncBlock();
   res = $ws.single.Storage.store('res://' + templateName, function(dResult){
      function createTpl (type, cont, tplName){
         if (typeof $ws.proto[type] == 'function') {
            var templateInstance = new $ws.proto[type]({
               templateXML : cont,
               template: cont,
               templateName: tplName
            });

            templateInstance.getRenderResult().addCallback(function() {
               dResult.callback(templateInstance);
            }).addErrback(function(e) {
               dResult.errback(new Error('$ws.core.attachTemplate : ' + e.message));
            });
         }
         else {
            dResult.errback(new Error('$ws.core.attachTemplate : $ws.proto.' + type + ' is not implemented'));
         }
      }
      if (/js!/.test(templateName)){
         require([templateName], function(constructor){
            createTpl('CompoundControlTemplate', constructor, templateName);
         }, function(e){
            dResult.errback(e);
         });
      }
      else if (fast && html) {
         createTpl('FastTemplate', html, templateName);
      } else if (templateName) {
         $ws.core.loadTemplateFile(templateName, fast).addCallbacks(function(content){

            createTpl(fast ? 'FastTemplate' : 'XMLTemplate', content, templateName);

            $ws.helpers.addXmlLog(templateName);
            return content;
         }, function(error){
            dResult.errback(error);
            return error;
         });
      } else {
         createTpl('EmptyTemplate', '', '');
      }
   }).addBoth(function(res){
      block.close();
      return res;
   });
   block.closeSyncBlock();

   return res;
};

$ws._const.templateParseConfig = {
   '#text': true,
   'control': 'div',
   'option' : false,
   'style' : false,
   'configuration' : false
};

$ws._const.allowAttribute = {
   'config': false
};

$ws._const.nodeType = {
   'ELEMENT_NODE': 1,
   'ATTRIBUTE_NODE': 2,
   'TEXT_NODE': 3,
   'CDATA_SECTION_NODE': 4,
   'ENTITY_REFERENCE_NODE': 5,
   'ENTITY_NODE': 6,
   'PROCESSING_INSTRUCTION_NODE': 7,
   'COMMENT_NODE': 8,
   'DOCUMENT_NODE': 9,
   'DOCUMENT_TYPE_NODE': 10,
   'DOCUMENT_FRAGMENT_NODE': 11,
   'NOTATION_NODE': 12
};

/**
 * @class $ws.proto.Template
 * @cfgOld {String} templateName название шаблона оно же путь к нему
 */
$ws.proto.Template = $ws.core.extend({}, /** @lends $ws.proto.Template.prototype */{
   $protected: {
      _templateName: '',
      _dReady: null,
      _loadedHandlers: {},
      _configuration:{
         autoWidth:false,
         autoHeight:false,
         isRelativeTemplate:false,
         minWidth:0
      }
   },
   $constructor: function(cfg){
      this._templateName = cfg.templateName;
      this._dReady = new $ws.proto.ParallelDeferred();
      this._dReady.getResult().
                   addCallback(this._attachResources.bind(this)).
                   addCallback(this._loadDependencies.bind(this));
   },
   isPage: function() {
      throw new Error("Template::isPage - method is not implemented!");
   },
   _collectAllControlsToPreload: function(source) {
      throw new Error("Template::_collectAllControlsToPreload - method is not implemented!");
   },
   _loadDependencies: function() {
      var
         controlConfigs = this._collectAllControlsToPreload(this.getControls(undefined)),
         configsPaths = $ws.helpers.map(controlConfigs, function(cfg) {
            return [cfg.type, cfg];
         }, []);

      return $ws.core.loadControlsDependencies(configsPaths, true);
   },
   /**
    * Возвращает результат загрузки всех функций используемых в шаблоне
    * @return {$ws.proto.Deferred} результат загрузки
    */
   getRenderResult : function(){
      return this._dReady.getResult();
   },
   /**
    * Возвращает стиль окна, заданный при проектировании
    */
   getStyle: function() {
      throw new Error("Template::getStyle - method is not implemented!");
   },
   /**
    * @returns {Object} Объект с параметрами width и height
    */
   getDimensions: function(){
      throw new Error("Template::getDimensions - method is not implemented!");
   },
   /**
    * @returns {Object} объект { h: String, w: String } с параметрами выравнивания ws-area
    */
   getAlignment: function(){
      throw new Error("Template::getAlignment - method is not implemented!");
   },
   /**
    * @returns {String} заголовок окна
    */
   getTitle : function(){
      throw new Error("Template::getTitle - method is not implemented!");
   },
   /**
    * @return {object} конфиг окна прописанный в шаблоне
    */
   getConfig : function(node){
      throw new Error("Template::getConfig - method is not implemented!");
   },
   /**
    * @returns {Object} Хэш-мэп событий, и подписантов на них. Подписанты передаются в виде массива
    */
   getDeclaredHandlers: function() {
      return this._loadedHandlers;
   },
   createMarkup: function(container) {
      throw new Error("Template::createMarkup - method is not implemented!");
   },
   /**
    * @param {String} parentId
    * @param {jQuery} templateRoot корневой элемент, в который встроен текущий шаблон
    * @returns {Object} параметры и типы контролов, присутствующих в шаблоне
    */
   getControls: function(parentId, templateRoot){
      throw new Error("Template::getControls - method is not implemented!");
   },
   getName : function(){
      return this._templateName;
   },

   _getIncludeDescriptorNodes: function() {
      throw new Error("Template::_getIncludeDescriptorNodes - method is not implemented!");
   },

   _attachResources: function() {
      var include = this._getIncludeDescriptorNodes(),
          pdResult = new $ws.proto.ParallelDeferred();

      if (include.length > 0) {
         // Не может быть несколько инклюдов... Всегда берем первый
         var spec = include[0].getAttribute('spec');
         if(spec) {
            try {
               spec = JSON.parse(spec);
            } catch(e) {
               spec = false;
            }
            if(spec) {
               if (spec.js) {
                  pdResult.push($ws.core.attachSequentally(spec.js));
               }
               if (spec.css) {
                  pdResult.push($ws.core.attachSequentally(spec.css));
               }
            }
         }
      }

      return pdResult.done().getResult();
   },

   _mergeAttrToConfig: function(config, attrName, attrValue) {
      if (attrName !== 'title'  && attrName !== 'width' && attrName !== 'height'){
         config[attrName] = attrValue === 'false' ? false : (attrValue === 'true' ? true : attrValue);
      }
   },

   needSetZindexByOrder: function() {
      return false;
   }
});

/**
 * @class $ws.proto.EmptyTemplate Класс - заглушка, представляющий собой пустой шаблон.
 * Его может быть удобно подставить вместо настоящего шаблона.
 * @extends $ws.proto.Template
 */
$ws.proto.EmptyTemplate = $ws.proto.Template.extend({
   $constructor: function() { this._dReady.done(); },
   _collectAllControlsToPreload: function() { return []; },
   isPage: function() { return true; },
   getConfig: function() { return {}; },
   getStyle: function() { return ''; },
   getAlignment: function() { return { horizontalAlignment: 'Stretch', verticalAlignment: 'Stretch' }; },
   getTitle: function() { return ''; },
   createMarkup: function(container) { container.get(0).innerHTML = ''; },
   getDimensions: function() { return { width: '', height: ''}; },
   getControls: function() { return []; },
   _getIncludeDescriptorNodes: function() { return []; }
});


/**
 * @class $ws.proto.XMLTemplate
 * @extends $ws.proto.Template
 * @cfgOld {Document} templateXML XML-документ шаблона
 * @cfgOld {String} templateName название шаблона оно же путь к нему
 */
$ws.proto.XMLTemplate = $ws.proto.Template.extend(/** @lends $ws.proto.Template.prototype */{
   $protected: {
      _xml : null,
      _toText : [],
      _html: '',
      _dReady: null,
      _innerTemplates: [],
      _templateName: '',
      _document : undefined,
      _controlTagCache: ''
   },
   $constructor: function(cfg){
      var self = this;
      this._xml = cfg.templateXML;
      this._document = this._xml.documentElement ? this._xml.documentElement : this._xml;
      this._innerTemplates[this._templateName = cfg.templateName] = true;
      this._includeInnerTemplate(new $ws.proto.Deferred()).addCallbacks(function(){
         self._assignId();
         self._loadEventHandlers();
      }, function(e){
         $ws.single.ioc.resolve('ILogger').log("Template", "Building failed. Reason: " + e.message);
         return e;
      });

      var tag = this._xml.getElementsByTagName('style')[0];
      if(tag){
         var style = this._findCDATA(tag, true);
         if(style){
            var cssReady = $ws.helpers.insertCss(style, true, this.getName());
            if (cssReady) {
               this._dReady.push(cssReady);
            }
         }
      }
   },

   _getIncludeDescriptorNodes: function() {
      var collection;

      if (this._xml.nodeType == $ws._const.nodeType.DOCUMENT_NODE) {
         collection = this._xml.firstChild.childNodes;
      } else {
         collection = this._xml.childNodes;
      }

      return $ws.helpers.filter(collection, function(child){
         return child.nodeName.toUpperCase() == 'I';
      });
   },

   isPage: function() {
      return this._document.getAttribute('isApplication') === 'false';
   },
   _collectAllControlsToPreload: function(source) {
      return this._getControlsByFilter(function() { return true; });
   },
   _extractControlConfiguration: function(controlNode) {
      var configObject, cfg = controlNode.getAttribute('config');
      if(cfg) {
         try {
            configObject = eval("("+cfg+")");
         } catch(e) {
            configObject = {};
         }
      } else
         configObject = this._parseConfiguration(controlNode.getElementsByTagName('configuration')[0]);
      return configObject;
   },
   /**
    * @param node где нужно искать
    * @param needValue что нужно вернуть - значение или узел
    * @return {String} styleData значение тега style
    */
   _findCDATA: function(node, needValue){
      var childNode,
          styleData;
      for(var i = 0, l = node.childNodes.length; i < l; i++){
         childNode = node.childNodes[i];
         if(childNode.nodeType === $ws._const.nodeType['CDATA_SECTION_NODE']){
            styleData = needValue ? childNode.nodeValue : childNode;
            break;
         }
      }
      return styleData;
   },
   /**
    * Ищет все теги include и инстанцирует их в нужные места
    * @param {$ws.proto.Deferred} dResult
    * @returns {$ws.proto.Deferred}
    */
   _includeInnerTemplate : function(dResult){
      var self = this,
          includeNodes = this._xml.getElementsByTagName('include'),
          dP = new $ws.proto.ParallelDeferred(),
          includeNode,
          parent, includeName,
          innerTemplates = [],
          styles = [];
      if(includeNodes.length === 0)
         dResult.callback();
      else {
         for (var i = 0, l = includeNodes.length; i < l; i++){
            includeNode = includeNodes[i];
            parent = includeNode.parentNode;
            if((includeName = includeNodes[i].getAttribute('name')) !== null){
               if(this._innerTemplates[includeName])
                  return dResult.errback("Cyclic dependency detected");
               else{
                  innerTemplates.push(includeName);
                  styles[i] = "";
                  (function(parent, includeNode, i) {
                     dP.push($ws.core.loadTemplateFile(includeName).addCallback(function(xmlDoc){
                        var templateChildren = (xmlDoc.documentElement ? xmlDoc.documentElement.childNodes : xmlDoc.childNodes),
                            tag = xmlDoc.getElementsByTagName('style')[0],
                            newNode;
                        if(tag){
                           styles[i] = self._findCDATA(tag, true);
                           (xmlDoc.documentElement ? xmlDoc.documentElement : xmlDoc).removeChild(tag);
                        }
                        for(var j = 0, cnt = templateChildren.length; j < cnt; j++){
                           newNode = templateChildren[0];
                           if(self._xml.adoptNode)
                              newNode = self._xml.adoptNode(newNode);
                           parent.insertBefore(newNode, includeNode);
                        }
                        parent.removeChild(includeNode);
                        return xmlDoc;
                     }));
                  })(parent, includeNode, i);
               }
            }
            else{
               $ws.helpers.forEach(includeNode.childNodes, function(val){
                  if(val.getAttribute){
                     var source = val.getAttribute('source');
                     if(source)
                        dP.push($ws.core.attach(source));
                  }
               });
            }
         }
         dP.done().getResult().addCallback(function(){
            var styleNode = self._xml.getElementsByTagName('style')[0];
            for(var i = 0, l = innerTemplates.length; i< l; i++)
               self._innerTemplates[innerTemplates[i]] = true;
            if(styleNode)
               self._findCDATA(styleNode, false).nodeValue += styles.join('');
            else{
               styleNode = self._xml.createElement('style');
               styleNode.appendChild(self._xml.createCDATASection(styles.join('')));
               self._document.appendChild(styleNode);
            }
            self._includeInnerTemplate(dResult);
         });
      }
      return dResult;
   },
   /**
    * Проставляет id контролам у которых его нету.
    */
   _assignId : function(){
      var controls = this._getControlTags(this._xml);
      for (var i = 0, l = controls.length; i < l; i++){
         var control = controls[i];
         if (!control.getAttribute('id')){
            control.setAttribute('id', $ws.helpers.randomId());
         }
      }
   },
   _getControlTags: function(where) {
      var result;
      if(this._controlTagCache)
         return this._controlTagCache;

      if(where.querySelectorAll) {
         var qsa = where.querySelectorAll('div[wsControl="true"]');
         if(qsa)
            result = qsa;
      }

      if(!result) {
         result = [];
         var collection = where.getElementsByTagName('div');
         for(var i = 0, l = collection.length; i < l; i++) {
            var item = collection[i];
            if(item.getAttribute('wsControl'))
               result.push(item);
         }

      }

      return (this._controlTagCache = result);
   },
   /**
    * Это оптимизация.
    * Используем более быстрый querySelectorAll если возможно
    * @returns {Array}
    */
   _getFunctionOptions: function(){
      var res;
      if(this._xml.querySelectorAll) {
         res = this._xml.querySelectorAll('option[type="function"]');
         if(res)
            return res;
      }

      var functions = this._xml.getElementsByTagName('option');
      res = [];
      for (var i = 0; i < functions.length; i++){
         if (functions[i].getAttribute('type') === 'function')
            res.push(functions[i]);
      }
      return res;
   },
   /**
    * Инициирует загрузку всех функций используемых в шаблоне
    */
   _loadEventHandlers : function(){
      var functions = this._getFunctionOptions();
      for (var i = 0; i < functions.length; i++){
         var name = functions[i].getAttribute('name'),
             value = functions[i].getAttribute('value');

         if (value !== null && value.length > 0)
            this._dReady.push($ws.core.getHandler(value));
      }
      this._dReady.push(this._processTemplateHandlers()).done(this);
   },
   /**
    * Ставит в очередь на загрузку все хэндлеры диалогов, найденные в содержании
    * @returns {$ws.proto.Deferred}
    */
   _processTemplateHandlers: function() {
      var
            dMainHandlers = new $ws.proto.ParallelDeferred(),
            self = this;

      var attrs = this._document.attributes, events = {};
      for(var i = 0, l = attrs.length; i < l; i++) {
         var
               anAttr = attrs[i],
               attrName = anAttr.nodeName;
         if(attrName.substring(0, 2) == 'on' && anAttr.nodeValue !== '') { // it is event handler
            events[attrName] = anAttr.nodeValue.split('|');
         }
      }

      if(!Object.isEmpty(events)) {
         /**
          * Здесь мы начинаем загрузку всех хандлеров, определенных на самом окне.
          * Здесь, а не ранее, потому что они будут иметь более высокий приоритет,
          * но не должны нарушить ранее заданный порядок.
          *
          * В колбэке основной цепочки стартуем ParallelDeferred,
          * зависящий от загрузки всех хандлеров на окне
          */

         for(var eventName in events) {
            if(events.hasOwnProperty(eventName)) {
               (function(eN, hSpec) {
                  self._loadedHandlers[eN] = [];
                  for(var i = 0; i < hSpec.length; ++i) {
                     (function(i) {
                        dMainHandlers.push($ws.core.getHandler(hSpec[i]).addCallbacks(function(f){
                           self._loadedHandlers[eN][i] = f;
                           return f;
                        }, function(e){
                           $ws.single.ioc.resolve('ILogger').error(
                                 "Template",
                                 "Error while loading handler " + eN + ": " + e.message,
                                 e);
                           return e;
                        }));
                     }(i));
                  }
               })(eventName, events[eventName]);
            }
         }
      }

      return dMainHandlers.done().getResult();
   },
   /**
    * Возвращает стиль окна, заданный при проектировании
    */
   getStyle: function() {
      return this._document.getAttribute('windowStyle') || "";
   },
   /**
    * @returns {Object} Объект с параметрами width и height
    */
   getDimensions: function(){
      var
         width = this._document.getAttribute('width'),
         height = this._document.getAttribute('height');
      return {
         width: !width? '': width.toLowerCase() === 'auto' ? 'auto' : width.indexOf('%') >= 0 ? width : parseInt(width, 10) + 'px',
         height: !height? '': height.toLowerCase() === 'auto' ? 'auto' : height.indexOf('%') >= 0 ? height : parseInt(height, 10) + 'px'
      };
   },
   /**
    * @returns {Object} объект { h: String, w: String } с параметрами выравнивания ws-area
    */
   getAlignment: function(){
      var
         h = this._document.getAttribute('HorizontalAlignment'),
         v = this._document.getAttribute('VerticalAlignment');
      return {
         horizontalAlignment: !h ? 'Stretch' : h,
         verticalAlignment: !v ? 'Stretch' : v
      };
   },
   /**
    * @returns {String} заголовок окна
    */
   getTitle : function(){
      return this._document.getAttribute('title');
   },

   /**
    * @return {object} конфиг окна прописанный в шаблоне
    */
   getConfig : function(node){
      var cfg = this._configuration,
          tag = node || this._document;
      if (tag.attributes !== null){
         for (var i = 0, l = tag.attributes.length; i < l; i++){
            var att = tag.attributes[i];
            this._mergeAttrToConfig(cfg, att.nodeName, att.nodeValue);
         }
      }
      return cfg;
   },
   /**
    * @returns {Object} Хэш-мэп событий, и подписантов на них. Подписанты передаются в виде массива
    */
   getDeclaredHandlers: function() {
      return this._loadedHandlers;
   },
   createMarkup: function(container) {
      var block = BOOMR.plugins.WS.startBlock("mkup:" + this.getName());
      var markup;
      if(this._html === '') {
         // TODO зачем здесь так?
         var markupNode = (this._xml.nodeName == 'ws-template' ? this._xml : this._xml.getElementsByTagName('ws-template')[0]);
         var ownerDoc = container.get(0).ownerDocument;
         var fragment = ownerDoc.createElement('div');
         var col = markupNode ? markupNode.childNodes : [];
         var item, i = 0, l;
         while(col.length && i < col.length) {
            item = col.item(i);
            if(item.nodeType == $ws._const.nodeType.ELEMENT_NODE && item.nodeName != 'style') {
               item = $ws.proto.Template._importNode(ownerDoc, item, true);
               i++;
               fragment.appendChild(item);
            } else
               i++;
         }
         var configs = fragment.getElementsByTagName('configuration');
         for(i = 0, l = configs.length; i < l; i++) {
            configs[0].parentNode.removeChild(configs[0]);
         }
         this._html = markup = fragment.innerHTML.replace(/<\/ ?br>/ig,"").replace(/&amp;/ig, "&");
      } else
         markup = this._html;
      container.html(markup);
      block.close();
   },

   _getControlsByFilter: function(filter) {
      var controls = this._getControlTags(this._xml);
      var result = [];
      for(var i = 0, l = controls.length; i < l; i++) {
         var control = controls[i];

         if(filter(control)) {
            var cfg = this._extractControlConfiguration(control);
            cfg.type = control.getAttribute('type');
            cfg.id = control.getAttribute('id');
            result.push(cfg);
         }
      }
      return result;
   },

   /**
    * @param {String} parentId
    * @returns {Array} параметры и типы контролов, присутствующих в шаблоне
    */
   getControls: function(parentId){
      var block = BOOMR.plugins.WS.startBlock('ctrls:' + this.getName()),
          result = this._getControlsByFilter(function(control) {
             return parentId == control.getAttribute('parentId');
          });

      block.close();
      return result;
   },
   /**
    * Обрабатывает конфигурацию элементов управления
    *
    * @param {Node} configRoot Текщий узел разобра
    * @param {Boolean} [makeArray] обрабатывается ли в настоящий момент массив?
    * @returns {Object} Конфигурация контрола
    */
   _parseConfiguration: function(configRoot, makeArray){
      var
         name, value, type,
         // Это место переписано так не случайно. От старого вариант почему-то ВНЕЗАПНО ломался каверидж
         retvalFnc = function(){
            var self = this;
            self.mass = makeArray ? [] : {};
            self.push = function(name, value){
               if (makeArray)
                  self.mass.push(value);
               else if (name !== null)
                  self.mass[name] = value;
            }
         },
         retval = new retvalFnc();

      if (configRoot && configRoot.childNodes){
         var children = configRoot.childNodes;
         for (var i = 0, l = children.length; i < l; i++){
            var child = children[i];
            if (child.nodeName && child.nodeName == 'option'){
               name = child.getAttribute('name');
               type = child.getAttribute('type');
               value = child.getAttribute('value');

               //if (type === 'array' || name === null || value === null){
               if (type === 'array' || (value === null && type != 'cdata')){
                  //Если не в листе дерева, то разбираем дальше рекурсивно
                  if (value === null)
                     value = this._parseConfiguration(child, type === 'array');
                  retval.push(name, value);
               }
               //добрались до листа дерева
               else //if (!makeArray){
                  switch (type){
                     case 'cdata':
                        retval.push(name, this._findCDATA(child, true));
                        break;
                     case 'boolean':
                        retval.push(name, value === "true");
                        break;
                     case 'function':
                        if (typeof(value) === 'string' && value.length > 0){
                           var hdl = $ws.core.getHandler(value);
                           if(hdl.isSuccessful()) {
                              (function(name){
                                 hdl.addCallback(function(handler){
                                    if(typeof(handler) == 'function') {
                                       retval.push(name, handler);
                                       return handler;
                                    }
                                    else
                                       throw new Error("Integrity error! Some serious problems in $ws.core.getHandler()!");
                                    // XXX: Potentially uncaught error condition
                                 });
                              })(name);
                           }
                           else
                              throw new Error(value + " function is not ready or don't exist");
                        }
                        break;
                     case 'dialog':
                        if (typeof(value) === 'string' && value.length > 0) {
                           (function(value){
                              retval.push(name, function() {
                                 $ws.core.attachInstance("Control/Area:Dialog", {
                                    template: value,
                                    opener: this,
                                    context: (new $ws.proto.Context().setPrevious(this.getLinkedContext()))
                                 })
                              })
                           })(value);
                        }
                        break;
                     case 'floatArea':
                        if (typeof(value) === 'string' && value.length > 0) {
                           (function(value){
                              retval.push(name, function() {
                                 var topParentContainer = this.getTopParent().getContainer();
                                 this.setEnabled(false);//Отключаем кнопку, чтобы юзер 100500 раз панельку не вызывал
                                 $ws.core.attachInstance("Control/Area:FloatArea", {
                                    id:this.getId(),
                                    opener: this,
                                    name: this.getName()+'-floatArea',
                                    template: value,
                                    target: topParentContainer,//$('body'),
                                    side : 'right',
                                    autHide : true,
                                    showDelay : 300,
                                    animationLength : 300,
                                    offset: {
                                       x: 0,
                                       y: (window.scrollY > topParentContainer.offset().top) ? window.scrollY : 0
                                    },
                                    handlers: {
                                       'onAfterClose' : function(){
                                          this.getOpener().setEnabled(true);//включаем обратно
                                       }
                                    }
                                 });
                              });
                           })(value);
                        }
                        break;
                     case 'command':
                        if (typeof(value) === 'string' && value.length > 0) {
                           (function(value){
                              retval.push(name, function(event) {
                                 event.setResult($ws.single.CommandDispatcher.sendCommand.apply($ws.single.CommandDispatcher, [this, value].concat(Array.prototype.slice.call(arguments, 1))));
                              });
                           })(value);
                        }
                        break;
                     case 'page':
                     case 'newpage':
                        if(typeof(value) === 'string' && value.length > 0) {
                           (function(value, type){
                              retval.push(name, function() {
                                 var link = typeof this.getOpenLink === 'function' ? this.getOpenLink() || value : value;
                                 if(type == 'page')
                                    window.location = link;
                                 else
                                    window.open(link);
                              });
                           })(value, type);
                        }
                        break;
                     case 'menu':
                        if(typeof(value) === 'string' && value.length > 0) {
                           (function(value){
                              retval.push(name, function() {
                                 if($ws.helpers.instanceOfModule(this, 'SBIS3.CORE.Button')){
                                    this._options.menu = value;
                                    this.unsubscribe('onActivated', arguments.callee);
                                    this._initMenu();
                                    this._notify('onActivated');
                                 }
                              });
                           })(value);
                        }
                        break;
                     case null:
                     default :
                        if(value === "null"){
                           value = null;
                        }
                        if(value === "Infinity"){
                           value = Infinity;
                        }
                        retval.push(name, value);
                        break;
                  }
               //}
            }
         }
      }
      return retval.mass;
   },

   needSetZindexByOrder: function() {
      return true;
   }
});

$ws.proto.FastTemplate = $ws.proto.Template.extend({
   $protected: {
      _options: {
         template: ''
      },
      _dom: null,
      _rootConfig: {},
      _controlsConfig: []
   },
   $constructor: function() {
      var self = this, preloadIndex = {};
      var block = BOOMR.plugins.WS.startBlock("FastTemplate:ctor");
      var block2 = BOOMR.plugins.WS.startBlock("FastTemplate:ctor:configuration:"+this.getName());
      this._dom = document.createElement('div');
      this._dom.innerHTML = this._options.template;
      if(!this._dom.firstChild)
         throw new Error("Wrong template came from server");
      this._rootConfig = JSON.parse(this._dom.firstChild.getAttribute('templateConfig'));
      this._controlsConfig = JSON.parse(this._dom.firstChild.getAttribute('config'));
      
      this._dom.firstChild.removeAttribute('templateConfig');
      this._dom.firstChild.removeAttribute('config');
      
      block2.close();

      var block3 = BOOMR.plugins.WS.startBlock("FastTemplate:ctor:func_preload:"+this.getName());
      $ws.helpers.forEach(this._controlsConfig.functions, function(val){
         var path = '["' + val.split('/').join('"]["') + '"]';
         var acessor = new Function("s", "val", "return arguments.length == 1 ? s" + path + " : (s" + path + " = val);");
         var configRoot = self._controlsConfig;
         var fSpec = acessor(configRoot).split('#');
         switch(fSpec[0]) {
            case 'function':
               self._dReady.push($ws.core.getHandler(fSpec[1]).addCallback(function(f){
                  acessor(configRoot, f);
               }));
               break;
            case 'moduleFunc':
               var
                  m = fSpec[1].split("/"),
                  fName = m.length > 1 ? m.pop() : '',
                  mName = m.join('/');
               self._dReady.push($ws.require("js!" + mName).addCallback(function(mod){
                  var fn = mod[0][fName];
                  fn.wsHandlerPath = 'js!' + mName + (fName ? ':' + fName : '');
                  acessor(configRoot, fn);
               }));
               break;
            case 'floatArea': 
               acessor(configRoot, function(event) {
                  var topParentContainer = this.getTopParent().getContainer();
                  this.setEnabled(false);//Отключаем кнопку, чтобы юзер 100500 раз панельку не вызывал
                  $ws.core.attachInstance("Control/Area:FloatArea", {
                     opener: this,
                     template: fSpec[1],
                     target: topParentContainer,//$('body'),
                     side : 'right',
                     autHide : true,
                     animationLength : 300,
                     offset: {
                        x: 0,
                        y: (window.scrollY > topParentContainer.offset().top) ? window.scrollY : 0
                     },
                     handlers: {
                        'onAfterClose' : function(){
                           this.getOpener().setEnabled(true);//включаем обратно
                        }
                     }
                  });
               });
               break;
            case 'dialog':
               acessor(configRoot, function(){
                  $ws.core.attachInstance("Control/Area:Dialog", {
                     template: fSpec[1],
                     opener: this,
                     context: (new $ws.proto.Context().setPrevious(this.getLinkedContext()))
                  })
               });
               break;
            case 'command':
               var fn = function(event) {
                  event.setResult($ws.single.CommandDispatcher.sendCommand.apply($ws.single.CommandDispatcher, [this, fSpec[1]].concat(Array.prototype.slice.call(arguments, 1))));
               };
               fn.isCommand = true;
               acessor(configRoot, fn);
               break;
            case 'newpage':
            case 'page':
               acessor(configRoot, function() {
                  var link = typeof this.getOpenLink === 'function' ? this.getOpenLink() || fSpec[1] : fSpec[1];
                  if(fSpec[0] == 'page')
                     window.location = link;
                  else
                     window.open(link);
               });
               break;
            case 'menu':
               acessor(configRoot, function(){
                  if($ws.helpers.instanceOfModule(this, 'SBIS3.CORE.Button')){
                     this._options.menuName = fSpec[1];
                     this.unsubscribe('onActivated', arguments.callee);
                     this._initMenu();
                     this._notify('onActivated');
                  }
               });
               break;
         }
      });
      block3.close();

      var block4 = BOOMR.plugins.WS.startBlock("FastTemplate:ctor:handlers_preload:"+this.getName());
      $ws.helpers.forEach(this._rootConfig, function(val, key){
         if(key.substr(0, 2) == 'on') {
            var handlers = val.split('|');
            $ws.helpers.forEach(handlers, function(val, idx){
               self._dReady.push($ws.core.getHandler(val).addCallback(function(f){
                  self._loadedHandlers[key] = self._loadedHandlers[key] || [];
                  self._loadedHandlers[key][idx] = f;
                  return f;
               }));
            });
         }
      });
      block4.close();

      if(this._rootConfig.style) {
         var cssReady = $ws.helpers.insertCss(this._rootConfig.style, true, this.getName());
         if (cssReady) {
            this._dReady.push(cssReady);
         }
      }

      var include = $ws.helpers.filter(this._dom.firstChild.childNodes, function(child){
         return child.nodeName == 'I';
      });
      if (include.length > 0) {
         // Не может быть несколько инклюдов... Всегда берем первый
         var spec = include[0].getAttribute('spec');
         if(spec) {
            try {
               spec = JSON.parse(spec);
            } catch(e) {
               spec = false;
            }
            if(spec) {
               spec.js && self._dReady.push($ws.core.attachSequentally(spec.js));
               spec.css && self._dReady.push($ws.core.attachSequentally(spec.css));
            }
         }
      }

      this._dReady.done();
      block.close();
   },

   _getIncludeDescriptorNodes: function() {
      return $ws.helpers.filter(this._dom.firstChild.childNodes, function(child){
         return child.nodeName == 'I';
      });
   },

   _collectAllControlsToPreload: function(source) {
      return $ws.helpers.reduce(source, function(res, item){
         if (item.children && item.children.length) {
            res = res.concat(this._collectAllControlsToPreload(item.children));
         }
         res.push(item);
         return res;
      }, [], this);
   },

   isPage: function() {
      return !this._rootConfig.isApplication;
   },

   getConfig: function() {
      $ws.helpers.forEach(this._rootConfig, function(attrValue, attr) {
         this._mergeAttrToConfig(this._configuration, attr, attrValue);
      }, this);

      return this._configuration;
   },
   getStyle: function() {
      return this._rootConfig.windowStyle || "";
   },
   getAlignment: function() {
      var
         h = this._rootConfig.HorizontalAlignment,
         v = this._rootConfig.VerticalAlignment;
      return {
         horizontalAlignment: !h ? 'Stretch' : h,
         verticalAlignment: !v ? 'Stretch' : v
      };
   },
   getTitle: function() {
      return this._rootConfig.title;
   },
   createMarkup: function(container) {
      var block = BOOMR.plugins.WS.startBlock("mkup:" + this.getName());
      // Шилов Д.А. вернул, так выполняются скрипты
      container.html(this._dom.firstChild.innerHTML);
      block.close();
   },
   getDimensions: function() {
      var
         width = this._rootConfig.width + "",
         height = this._rootConfig.height + "";
      return {
         width: !width? '': width.toLowerCase() === 'auto' ? 'auto' : width.indexOf('%') >= 0 ? width : parseInt(width, 10) + 'px',
         height: !height? '': height.toLowerCase() === 'auto' ? 'auto' : height.indexOf('%') >= 0 ? height : parseInt(height, 10) + 'px'
      };
   },
   getControls: function(parent) {
      if(parent)
         return [];
      return this._controlsConfig.children;
   },
   needSetZindexByOrder: function() {
      return true;
   }
});

$ws.proto.CompoundControlTemplate = $ws.proto.Template.extend({
   $protected: {
      _options: {
         template: null
      },
      _elementId: null,
      _docFragment: null,
      _instance: null
   },
   $constructor: function(){
      this._elementId = $ws.helpers.randomId();
      this._loadedHandlers = this._options.template && this._options.template.handlers || {};
      this._dReady.done();
   },
   _collectAllControlsToPreload: function(source) {
      return source[0] && [ source[0] ] || [];
   },
   getConfig: function(){
      var
         templateClass = this._options.template,
         proto = templateClass.prototype,
         result = {},
         dimensions = templateClass.dimensions || {};

      if (proto && proto._initializer) {
         proto._initializer.call(result);
         result = result._options || {};

         //По умолчанию у xhtml-шаблонов нужно устанавливать isRelativeTemplate, чтоб ресайзера не было у
         //области по шаблону, которая загружает его
         if (result.isRelativeTemplate === undefined) {
            result.isRelativeTemplate = true;
         }
      }

      $ws.core.merge(result, dimensions);
      return result;
   },
   getStyle: function() {
      return '';
   },
   getDimensions: function(){
      var config = this.getConfig();
      return $ws.helpers.reduce('width height'.split(' '), function(result, opt) {
         if (opt in config) {
            result[opt] = config[opt];
         }
         return result;
      }, {});
   },
   isPage: function(){
      return true;
   },
   getTitle: function(){
      var config = this.getConfig();
      return (config && config.title) || this._options.template.title || '';
   },
   createMarkup: function(container, config){
      var element = document.createElement('div');
      element.setAttribute('id', this._elementId);
      if (config) {
         element._componentConfig = config;
      }
      container.append(element);
   },
   getControls: function(parentId, templateRoot){
      if (parentId && this._elementId != parentId) {
         return [];
      }
      var elem = templateRoot && templateRoot.find('#' + this._elementId).get(0);
      return [$ws.core.merge({
         id: this._elementId,
         type: this._templateName
      }, (elem && elem._componentConfig) || {})];
   },
   _getIncludeDescriptorNodes: function() {
      // У CompoundControl все зависимости и подключения - в requirejs
      return [];
   }
});

/**
 * Загрузчик внешних данных из хранимой процедуры
 *
 * @class $ws.proto.JSONLoader
 * @cfgOld {Object} url параметры получения данных
 */
$ws.proto.JSONLoader = $ws.core.extend({}, /** @lends $ws.proto.JSONLoader.prototype */{
   $protected: {
      _options: {
         url: '/data.php',
         updateURL : '',
         destroyURL : '',
         tableName : ''
      }
   },
   /**
    * Инициирует загрузку данных
    * @param {Object} arguments
    * @param {String} action выполняемая операция: чтение, редактирование, удаление
    * @returns {$ws.proto.Deferred}
    */
   load: function(args, action){
      var url = this._options.url;
      if(action === "update" && this._options.updateURL)
         url =  this._options.updateURL;
      else if(action === "destroy" && this._options.destroyURL)
         url =  this._options.destroyURL;
      if(this._options.tableName !== '')
         args["tableName"] = this._options.tableName;
      return $ws.single.ioc.resolve('ITransport', {
         method: 'POST',
         dataType: 'json',
         url: url + (/\?/.test(url) ? "&" : "?") + "$=1" + ($ws.core.debug ? "&" + Math.random() : "")
      }).execute(args);
   }
});

/**
 * Класс "Набор данных"
 *
 * @cfg {$ws.proto.Context} context Связанный контекст
 * @cfg {Object} paramsMapping Маппинг параметров на альтернативные поля контекста
 * @cfg {Array} filterParams массив имен параметров выборки
 * @cfg {String} readerType тип ридера
 * @cfg {Object} readerParams описание ридера = { adapterType, adapterParams }
 * @cfg {Boolean} firstRequest запрашивать данные при создании или нет
 * @cfg {String}  hierarchyField Название колонки с индексом отца
 * @cfg {String}  usePages    тип постраничной навигации
 *    - ''        нету её (по-умолчанию)
 *    - 'parts'   по результатам загрузки узнаёт, есть ли следующая страница, в hasNextPage boolean
 *    - 'full'    грузит информацию об общем количестве страниц, в hasNextPage number (общее число записей, вне одной конкретной страницы)
 *    - 'auto'    теоретический параметр
 * @cfg {Array}   sorting     массив с информацией о сортировке, содержит в себе строки в виде:
 *    [String, boolean]       имя колонки и тип сортировки (убывающая-возрастающая)
 * Например:
 * <pre>
 *    sorting: [
 *       ['Название', true],
 *       ['Дата', false]
 *    ]
 * </pre>
 *
 * @class $ws.proto.RecordSet
 * @extends $ws.proto.Abstract
 */
$ws.proto.RecordSet = $ws.proto.Abstract.extend(/** @lends $ws.proto.RecordSet.prototype */{
   /**
    * @event onBeforeLoad Возникает в момент начала загрузки данных через Reader
    * @param {Object} eventObject описание в классе $ws.proto.Abstract
    * @param {Object}filter Значение фильтров, с которыми началась загрузка
    * @param {Object} options Опции, которые могли быть переданы при запросе
    */
   /**
    * @event onAfterLoad Возникает после окончания загрузки данных (RecordSet готов к использованию)
    * @param {Object} eventObject описание в классе $ws.proto.Abstract
    * @param {$ws.proto.RecordSet} recordSet Экземпляр рекорд-сета
    * @param {Boolean} isSuccess успешна ли загрузка
    * @param {Error} error произошедшая ощибка (если загрузка неуспешная)
    * @param {Object} options Опции, которые могли быть переданы при запросе
    */
   /**
    * @event onRecordUpdated Возникает после обновлении записи в текущем рекордсете
    * @param {Object} eventObject описание в классе $ws.proto.Abstract
    * @param {$ws.proto.Record} record измененная запись
    */
   /**
    * @event onRecordDeleted Возникает при удалении обновлении записи в текущем рекордсете
    * @param {Object} eventObject описание в классе $ws.proto.Abstract
    * @param {String} primaryKey Первичный ключ удаленной записи
    * @param {$ws.proto.Record} record Сама удалённая запись
    */
   /**
    * @event onAbort возникает при прерывании загрузки
    * @param {Object} eventObject описание в классе $ws.proto.Abstract
    */
   /**
    * @event onPageChange при смене страницы рекордсета
    * @param {Object} eventObject описание в классе $ws.proto.Abstract
    */
   /**
    * @event onShadowLoad При загрузке, если указать в методе loadNode параметр shadowed
    * @param {Object} eventObject описание в классе $ws.proto.Abstract
    * @param {$ws.proto.RecordSet} У чего закончилась загрузка
    * @param {Boolean} isSuccess Закончилась ли загрузка успешно
    * @param {Array} shadowRecords Массив с загруженными записями
    */
   $protected: {
      _data: [],
      _columns: [],
      _way: null,
      _results: null,
      _requestBegin: 0,
      _timeElapsed: 0,
      _dataIterator: -1,
      _pkIndex: {},
      // МакаровАВ: если Список не вызывается, то оставался -1 и метод Создать работал не правильно
      _pkColumnIndex: 0,
      _columnsParsed: false,
      _lastError: false,
      _options: {
         context: '',
         filterParams: {},
         requiredParams: [],
         readerType: 'ReaderUnifiedSBIS',
         readerParams: {},
         firstRequest: true,
         usePages: '',
         pageNum: 0,
         rowsPerPage: 2,
         sorting: null,
         waitForPrevQuery: false,
         hierarchyField: ''
      },
      _parsedColumns: undefined, //разобранные колонки
      _columnIndex: {},
      _childRecordsMap: [],
      _reader: null,
      _hasNextPage: 0,        //Есть ли следующая страница либо общее число записей
      _pageNum: 0,            //Текущая страница
      _usePages: '',          //Использование постраничной навигации или нет
      _sorting: null,         //Текущая сортировка
      _loaded: true,          //Загружается ли сейчас рекордсет
      _queryStack: [],        //Если поступают новые запросы до загрузки старых, то они могут класться опционально сюда и вызываться потом
      _initialFilter: {},     //Исходный фильтр, по которому инициализировался рекордсет
      _currentFilter: {},     //Текущий фильтр браузера
      _loadingId: undefined,  //Идентификатор загруженного узла
      _level: {},             //Глубина какой-либо записи
      _newData: undefined,    //Новые данные
      _loadExpanded: false,   //Являются ли загружаемые данные раскрытыми
      _tree: null,            //Дерево с данными
      _shadowed: false,       //Является ли текущий запрос скрытым
      _treeMap: null,         //Мап, содержит в себе ссылки на элементы дерева по ключам
      _loadingInfo: null,     //Объект с информацией о текущем запросе: деферред и опции пользователя
      _isEmptyTable: false,   //Флаг, пустая ли таблица
      _isChanged: false,      //Флаг, изменялась ли таблица
      _maxKey: 0              //Максимальный ключ в рекордсете
   },
   $constructor: function(){
      this._pageNum = this._options.pageNum;
      this._usePages = this._options.usePages;
      this._options.rowsPerPage = parseInt(this._options.rowsPerPage, 10);
      this._sorting = this._options.sorting;
      this._initialFilter = this._prepareFilter(this._options.filterParams);
      this._publish('onBeforeLoad', 'onAfterLoad', 'onRecordUpdated', 'onRecordDeleted', 'onAbort', 'onPageChange', 'onShadowLoad');
      this._options.filterParams = this._options.filterParams || {};
      this._clearTreeMap();
      if (this._options.readerType !== '' && this._options.firstRequest)
         this._beginLoad();
      if(!(this._options.context instanceof $ws.proto.Context))
         this._options.context = $ws.single.GlobalContext;
   },
   /**
    * Возвращает клон рекордсета.
    * @return {$ws.proto.RecordSet} клон рекордсета
    */
   clone: function(){
      var serializedRecordset = JSON.parse(JSON.stringify(this.toJSON()));

      return new $ws.proto.RecordSet({
         readerType: 'ReaderSBIS',
         readerParams: {
            adapterType: 'TransportAdapterStatic',
            adapterParams: {
               data: serializedRecordset
            }
         }
      });
   },
   getPkColumnType: function(){
      if(this._columns[this._pkColumnIndex]){
         return this._columns[this._pkColumnIndex].t;
      }
      return '';
   },
   /**
    * Возвращает имя ключевой колонки.
    * @return {String} имя ключевой колонки, или пустую строку при отсутствии ключевой колонки
    */
   getPkColumnName: function(){
      var pkColumn = this._columns[this._pkColumnIndex];
      if(pkColumn){
         return pkColumn.n;
      }
      return '';
   },
   getLinkedObjectName: function(){
      return this._options.readerParams.linkedObject;
   },
   toJSON: function(){
      return {
         s : this.getColumnsForSerialize(),
         d : this.getDataForSerialize(),
         _type: 'recordset'
      };
   },
   _onNewData: function(event, data){
      this._childRecordsMap = [];
      this._newData = data;
   },
   /**
    * Позволяет фильтровать набор данных.
    * Фильтруется пользователем с помощью переданной функции. По завершению поднимает событие onAfterLoad.
    * Является альтертантивным спобом фильтрации и предоставляет возможность фильтровать данные на клиенте.
    * @param {Function} func функция, принимающая на вход запись {$ws.proto.Record}. Если вернет true, то запись останется в наборе
    */
   filter: function(func){
      this._newData = [];
      this.each(function(record){
         if(func(record)){
            this._newData.push(record.getDataRow());
         }
      });
      //почистим информацию о ранее загруженной иерархии
      this._clearTreeMap();
      this._onComplete({}, true, false, false, false);
   },
   /**
    * Очищает _treeMap
    * @protected
    */
   _clearTreeMap: function(){
      this._treeMap = new $ws.proto.OrderedHashMap();
      this._tree = new $ws.proto.OrderedHashMap();
   },
   /**
    * возвращает контекст рекордсета
    * @return {Object} контекст рекордсета
    */
   getContext : function(){
      return this._options.context;
   },
   /**
    * Устанавливает контекст рекордсета
    * @param {Object} context
    */
   setContext : function(context){
      this._options.context = context;
   },
   /**
    * Вызывает немедленную перезагрузку RecordSet без изменения каких-либо настроек
    */
   reload: function() {
      var info = this._createLoadingInfo();
      this._beginLoad(undefined, undefined, info);
      return info.deferred;
   },
   /**
    * Меняет источник данных
    * @param {String} readerType тип ридера
    * @param {Object} readerParams Параметры ридера
    * @param {Object} filter Параметры фильтрации
    */
   setSource: function(readerType, readerParams, filter, noLoad){
      this._options.readerType = readerType;
      this._options.readerParams = readerParams;
      this._options.filterParams = filter;
      this._reader = null;
      var result;
      if(noLoad !== false) {
         var info = this._createLoadingInfo();
         this._beginLoad(undefined, true, info);
         result = info.deferred;
      } else {
         result = (new $ws.proto.Deferred()).callback();
      }

      return result;
   },
   /**
    * Возвращает описание набора данных, по которому построено. Содержит readerType, readerParams, filterParams
    * @returns {Object}
    */
   getSource: function(){
      return {
         readerType: this._options.readerType,
         readerParams: this._options.readerParams,
         filterParams: this._options.filterParams
      };
   },
   /**
    * Создаёт объект с информацией о текущем запросе
    * @param {Object} options Объект с пользовательскими опциями
    * @return {Object}
    * @protected
    */
   _createLoadingInfo: function(options){
      return {
         options: options,
         deferred: new $ws.proto.Deferred()
      };
   },
   /**
    * Меняет параметры выборки.
    * !Внимание. Параметры фильтрации не заменяются безусловно.
    * Вновь переданные домердживаются на все ранее сделанные.
    * @param {Object} filter Параметры фильтрации
    * @param {Boolean|undefined} clear очищать ли все записи при загрузке
    * @param {Object} [options] Объект с пользовательскими параметрами
    * @param {Boolean} [noLoad] Не загружать данные, а просто запомнить фильтр
    * @returns {$ws.proto.Deferred} Асинхронное событие. Результатом работы является количество записей в новой выборке.
    * @example
    * <pre>
    *    myRecordSet.setQuery({'ГодРождения' : 1965})
    *       .addCallback(function(records_count){
    *              alert('Пришло ' + records_count + ' записей');
    *              return records_count;
    *           });
    * </pre>
    */
   setQuery: function(filter, clear, options, noLoad){
      var curFilter = this._prepareFilter(filter),
          filterParams = $ws.core.merge({}, this._options.filterParams),
          info = this._createLoadingInfo(options);
      //Все-таки переписываем filterParams, но сохраняем для них настройку получения данных из контекста
      this._options.filterParams = $ws.core.merge({}, curFilter);
      if (filterParams){
         for (var i in curFilter) {
            if (curFilter.hasOwnProperty(i)) {
               //Сохраянем настройку получения данных из контекста
               if (filterParams[i] !== null && typeof( filterParams[i]) === 'object' && 'fieldName' in  filterParams[i]){
                  this._options.filterParams[i] = filterParams[i];
               }
            }
         }
      }
      if(noLoad){
         return new $ws.proto.Deferred().callback();
      } else {
         this._beginLoad(curFilter, clear, info);
         return info.deferred;
      }
   },
   /**
    * Метод сброса фильтров
    * @param {Object} filter Параметры фильтрации
    * @param {Boolean} noLoad Не инициировать загрузку данных
    */
   resetFilter : function(filter, noLoad){
      this._options.filterParams = filter || {};
      if (this._options.requiredParams.length > 0) {
         for (var i = 0; i < this._options.requiredParams.length; i++) { // сбрасываем параметры рекордсета, параметры рекордсета == обязательные параметры, все остальные у браузера
            if (this._options.requiredParams.hasOwnProperty(i))
               this._options.filterParams[this._options.requiredParams[i]] = this._initialFilter[this._options.requiredParams[i]];
         }
      }
      this._currentFilter = $ws.core.merge({}, this._options.filterParams);
      //this._options.filterParams = $ws.core.merge({},filter,{clone:true});
      var result;
      if(!noLoad) {
         var info = this._createLoadingInfo();
         this._beginLoad(undefined, true, info);
         result = info.deferred;
      } else {
         result = (new $ws.proto.Deferred()).callback();
      }
      return result;
   },
   /**
    * Метод получения текущих параметров фильтра
    */
   getQuery : function(){
      // вернем фильтр, по которому строилась последний раз выборка с подставленными значениями (если был маппинг)
      return this._currentFilter;
   },
   /**
    * Возвращает фильтр только с перечитанными полями из контекста (параметры, которых нет в контексте удаляются)
    * @param {Object} filterParams Объект с фильтром, который содержит данные о контексте
    */
   getUpdatedQuery : function(filterParams){
      var filter = $ws.core.merge({}, this._options.filterParams);
      for(var i in filterParams){
         if(!filterParams.hasOwnProperty(i)){
            continue;
         }
         if(typeof(filterParams[i]) === 'function' || (filterParams[i] instanceof Object && filterParams[i]['fieldName'] !== undefined)){
            filter[i] = filterParams[i];
         } else {
            //Нам передают старые параметры, и так как они в контексте не лежат, их отсюда нужно убрать
            //Чтобы их уже не актуальные значения не попали в фильтр
            delete filter[i];
         }
      }
      return this._prepareFilter(filter);
   },
   /**
    * Подготавливает фильтр.
    * @param {Object} filter
    * @param {Boolean} [notReadyValuesOnly] Нужно ли только обновлять значения
    * @param {Boolean} [notUpdate] Нужно ли обновлять значения
    * @returns {Object} новый фильтр (исходное значение не меняется!)
    */
   _prepareFilter: function(filter, notReadyValuesOnly, notUpdate){
      var requiredParams = {},
          curFilter = filter || {}, //? $ws.core.merge({}, filter) : {},
          retval = {},
          l = this._options.requiredParams.length,
          val, x, param;
      for(x = 0; x < l; x++){ // возьмем значения если не задали, здесь если их нет то будет либо значение, либо ссылка на контекст, либо функция
         param = this._options.requiredParams[x];
         requiredParams[param] = true;
         if (!(param in curFilter) && !notReadyValuesOnly)
            curFilter[param] = this._initialFilter[param];
      }
      for(var i in curFilter){
         val = undefined;
         if(curFilter.hasOwnProperty(i)) {
            if(curFilter[i] !== null && typeof(curFilter[i]) === 'object' && 'fieldName' in curFilter[i]){
               if(this._options.context.getValue !== undefined && !notUpdate)
                  val = this._options.context.getValue(curFilter[i].fieldName);
            }
            else if(typeof(curFilter[i]) === 'function'){
               if(!notUpdate)
                  val = curFilter[i].apply( this, [this._options.context, i] );
            } else
               val = curFilter[i];
            if(val !== undefined)
               retval[i] = val;
            else if(requiredParams[i] === true && !notReadyValuesOnly)
               retval[i] = this._initialFilter[i];
         }
      }
      if(!notReadyValuesOnly){
         if(this._usePages){
            retval['pageNum'] = this._pageNum;
            retval['pageCount'] = this._options.rowsPerPage;
            if(this._pageNum === -1){
               retval['usePages'] = 'full';
            }
            else{
               retval['usePages'] = this._usePages;
            }
         } else {
            delete retval['pageNum'];
            delete retval['pageCount'];
            delete retval['usePages'];
         }
         if(this._sorting){
            retval['sorting'] = this._sorting;
         }
      }
      return retval;
   },
   /**
    * Подготавливает фильтр
    * @param {Object} filter Фильтр
    * @param {Boolean} [notReadyValuesOnly] Нужно ли только обновлять значение, которые берутся из контекста или по результату функции
    * @returns {Object}
    */
   prepareFilter: function(filter, notReadyValuesOnly){
      return this._prepareFilter(filter, notReadyValuesOnly);
   },
   /**
    * Инициирует загрузку данных
    * @param {Object} [filter] фильтр, который использовать при загрузке, либо ничего и тогда автоматический просчёт
    * @param {Boolean|undefined} [clear] очищать ли всё при загрузке
    * @param {Object} [info] Информация о текущем запросе
    * @param {boolean} [addToStack] Добавить ли запрос в очередь
    */
   _beginLoad: function(filter, clear, info, addToStack){
      var self = this;
      if(!this._loaded){
         if(this._options.waitForPrevQuery || addToStack === true){
            this._queryStack.push([this._prepareFilter(this._options.filterParams), info]);
            return;
         }
         else{
            this.getReader().abort();
         }
      }
      var curFilter = this._prepareFilter(filter ? filter : this._options.filterParams);
      this._shadowed = curFilter['shadowed'];
      if(!this._shadowed){
         this._notify('onBeforeLoad', curFilter, info && info.options);
      }
      this._loaded = false;
      this._newData = [];
      if(this._options.hierarchyField){
         this._loadingId = curFilter[this._options.hierarchyField];
         if(!(this._loadingId instanceof Array)){
            this._loadingId = [this._loadingId];
         }
      }
      else{
         this._loadingId = [null];
      }
      this._loadExpanded = (curFilter['Разворот'] === 'С разворотом');
      if(clear){
         this._pkIndex = {};
         this._level = {};
         this._data = [];
         this._tree.clear();
         this._treeMap.clear();
      }
      this._loadingInfo = info;
      this._currentFilter = curFilter;
      var result = this.getReader().readRecords(curFilter, this._columnsParsed);
      if(result instanceof $ws.proto.Deferred){
         result.addCallback(function(){
            self._loaded = true;
            var first = self._queryStack.shift();
            if(first){
               self._beginLoad(first[0], undefined, first[1]);
            }
         });
      }
      else{
         this._loaded = true;
      }
   },
   /**
    * Обновляет информацию о следующей страницу
    * @param {Object} event Объект события
    * @param {Number|Boolean} nextPage Следующая страница
    * @private
    */
   _updateNextPage: function(event, nextPage){
      if(this._pageNum === -1){
         this._pageNum = Math.ceil(nextPage / this._options.rowsPerPage) - 1;
         this._hasNextPage = false;
      }
      else{
         this._hasNextPage = nextPage;
      }
   },
   /**
    * Устанавливает текущую страницу в рекордсете и начинает загрузку
    * @param {Number} pageNum Номер страницы
    * @param {Boolean} [noLoad] установка страницы без загрузки данных
    * @param {Boolean} [noClear] не чистить ли всё остальное
    */
   setPage: function(pageNum, noLoad, noClear){
      this._pageNum = pageNum;
      this._notify('onPageChange', pageNum);
      var result;
      if(!noLoad){
         var info = this._createLoadingInfo();
         this._beginLoad(undefined, !noClear, info);
         result = info.deferred;
      } else {
         result = (new $ws.proto.Deferred()).callback();
      }
      return result;
   },
   /**
    * Устанавливает количество записей на странице
    * @param {Number} pageCount Количество записей
    * @param {Boolean} [noLoad] Не загружать данные
    */
   setPageSize: function(pageCount, noLoad){
      this._options.rowsPerPage = pageCount;
      this._pageNum = 0;
      this._notify('onPageChange', 0);
      var result;
      if(!noLoad){
         var info = this._createLoadingInfo();
         this._beginLoad(undefined, false, info);
         result = info.deferred;
      } else {
         result = (new $ws.proto.Deferred()).callback();
      }
      return result;
   },
   /**
    * Возвращает текущий размер страницы в рекордсете
    * @return {Number}
    */
   getPageSize: function(){
      return this._options.rowsPerPage;
   },
   /**
    * Устанавливает тип постраничной навигации
    *
    * Доступны следующие типы:
    * 1. '' - нет постраничного вывода,
    * 2. 'parts' - по результатам загрузки узнаёт, есть ли следующая страница, в hasNextPage boolean
    * 3. 'full' - грузит информацию об общем количестве страниц, в hasNextPage number (общее число записей, вне одной конкретной страницы)
    * @param {String} type Тип постраничной навигации
    */
   setUsePages: function(type){
      this._pageNum = 0;
      this._usePages = type;
   },
   /**
    * Возвращает boolean, если usePages == 'parts'
    * Возвращает общее число страниц, если usePages == 'full'
    * @param {Boolean|undefined} [booleanResult] возвращать либо true либо false в зависимости от наличия следующей страницы
    * @returns {Number|boolean} общее число страниц
    */
   hasNextPage: function(booleanResult){
      if (!booleanResult){
         return this._hasNextPage;
      }

      if(this._usePages === 'full'){
         return this._hasNextPage > (this._pageNum + 1) * this._options.rowsPerPage;
      } else{
         return !!this._hasNextPage;
      }
   },
   /**
    * Используется ли постраничная навигация
    * @return {Boolean}
    */
   usePaging: function(){
      return !!this._usePages;
   },
   /**
    * Получение номера текущей страницы
    * @return {Number} номер страницы
    */
   getPageNumber : function(){
      return this._pageNum;
   },
   getRecords : function(){
      var records = [],
          l = this._data.length,
          i = 0;
      while(i < l){
         records.push(this.at(i));
         i++;
      }
      return records;
   },
   /**
    * Устанавливает сортировку и перезагружает рекордсет
    * @param {Array} [sorting] Массив массивов с информацией о сортировке: [ [поле, сортировать ли по убыванию], ... ]. Чем раньше поле, тем оно важнее для сортировки
    * @param {Object} [filter] Фильтр, который должен использоваться
    * @param {Boolean|undefined} [noClear] не чистить ли всё остальное
    * @param {Boolean} [noLoad] Если указано, то загрузки не будет
    */
   setSorting: function(sorting, filter, noClear, noLoad){
      this._sorting = sorting || null;
      var result;
      if(!noLoad){
         var info = this._createLoadingInfo();
         this._beginLoad(filter, !noClear, info);
         result = info.deferred;
      } else {
         result = (new $ws.proto.Deferred()).callback();
      }
      return result;
   },
   /**
    * Метод получения ридера
    * @returns {$ws.proto.ReaderAbstract} Инстанс ридера
    */
   getReader: function(){
      if(!this._reader) {
         /*var params = $ws.core.merge({
            handlers: this._getReaderHandlers()
         }, this._options.readerParams);*/
         this._options.readerParams.handlers = this._getReaderHandlers();
         this._reader = new $ws.proto[this._options.readerType](this._options.readerParams);
      }
      return this._reader;
   },
   _getReaderHandlers: function(){
      return {
         'onNewRecord': this._onNewRecord.bind(this),
         'onWayExists': this._onWayExists.bind(this),
         'onResults': this._onResults.bind(this),
         'onSettingsParsed': this._onSettingsParsed.bind(this),
         'onComplete': this._onComplete.bind(this),
         'onNewData': this._onNewData.bind(this),
         'onNextPageChange': this._updateNextPage.bind(this)
      };
   },
   /**
    * Метод получения пути
    * @returns {$ws.proto.RecordSet} путь к узлу
    */
   getWay: function(){
      return this._way;
   },
   /**
    * Метод получения итогов
    * @returns {$ws.proto.Record} строка итогов
    */
   getResults: function(){
      return this._results;
   },
   /**
    * Внутренний обработчик события создания новой записи
    * @param {Object} eventState
    * @param {Array} data массив с данными "как есть" из запроса
    */
   _onNewRecord: function(eventState, data){
      this._newData.push(data);
   },
   /**
    * Обработчик пути
    * @param {Event} eventState
    * @param way //TODO коммент
    */
   _onWayExists: function(eventState, way){
      if(way.d){
         var dataSource = {
            readerType: 'ReaderSBIS',
            readerParams: {
               pkColumnName: way.s[way.k || 0].n,
               adapterType : 'TransportAdapterStatic',
               adapterParams: {
                  data : {
                     s:way.s,
                     d:way.d
                  }
               }
            }
         },
         self = this;
         self._way = new $ws.proto.RecordSet(dataSource);
      }
   },
   /**
    * Пустая ли таблица
    * @param {Event} eventState
    * @param isEmptyTable - пустая ли таблица
    */
   isEmptyTable: function(){
      return this._isEmptyTable;
   },
   /**
    * Обработчик итогов
    * @param {Event} eventState
    * @param results пришедшие итоги
    */
   _onResults: function(eventState, results){
      this._results = new $ws.proto.Record({
         colDef : results.columns,
         row : results.row,
         pkValue : null,
         parentRecordSet : null
      });
   },
   /**
    * Внутренний обработчик события готовности конфигурации колонок
    * @param {Object} eventState
    * @param {Object} columnConfig Конфигурация колонок
    * @param {Number} pkColumnIndex индекс колонки с праймари ключем
    *
    */
   _onSettingsParsed: function(eventState, columnConfig, pkColumnIndex){
      var
          l = columnConfig.length,
          i = 0;
      while(i < l){
         this._columnIndex[columnConfig[i].n] = i;
         i++;
      }
      this._columnsParsed = l > 0;
      this._pkColumnIndex = pkColumnIndex;
      this._columns = columnConfig;
   },
   /**
    * Возвращает, распарсили ли мы уже колонки, или нет
    */
   isInit: function(){
      return this._columnsParsed;
   },
   /**
    * Добавляет в себя иерархические данные
    * @param {Array} data Массив с записями
    * @private
    */
   _buildHierarchyData: function(data){
      var childs = {},
         shadowRecords = [],
         i, len,
         found = {}, //Практически найденные записи, которые не должны лежать в корне
         parent,
         self = this,
         loadedMap = {},
         recordsMap = {},
         record,
         recursive = false,
         treeKeys = {},
         key,
         recordParent = function(data){
            var parent = data[self.getColumnIdx(self._options.hierarchyField)];
            parent = $ws.helpers.parseIdentity(parent);
            return parent;
         },
         isParentEqual = function(parent0, parent1){
            if(parent0 == 'null'){
               parent0 = null;
            }
            if(parent1 == 'null'){
               parent1 = null;
            }
            return parent0 == parent1;
         },
         //Запоминает записи из незагруженных веток и не учитывает старые из загруженных
         viewTree = function(node){
            node.each(function(k, v){
               if(!loadedMap[k]){
                  if(v.childs){
                     if(!childs[k]){
                        childs[k] = [];
                     }
                     v.childs.each(function(k2, v){
                        if(isParentEqual(recordParent(v.record), k)){//Возможно, данные записи обновили
                           childs[k].push(v.record);
                           found[k2] = true;
                        }
                     });
                  }
               }
               if(!loadedMap[k] || !self._loadExpanded){
                  viewTree(v.childs);
               }
            });
         },
         childsFilling = function(arrData){
            for(i = 0, len = arrData.length; i < len; ++i){
               parent = recordParent(arrData[i]);
               if(!childs[parent]){
                  childs[parent] = [];
               }
               childs[parent].push(arrData[i]);
               found[arrData[i][self._pkColumnIndex]] = true;
            }
         },
         appendToData = function(node, level){
            node.each(function(k, v){
               if(!found[k])
                  return;
               if(v.record){
                  if(self._shadowed){
                     shadowRecords.push(v.record);
                  }
                  else{
                     self._pkIndex[k] = self._data.length;
                     self._data.push(v.record);
                  }
               }
               self._level[k] = level;
               if(!v.childs){
                  v.childs = new $ws.proto.OrderedHashMap();
               }
               if(!self._shadowed){
                  self._treeMap.put(k, v.childs);
               }
               if(childs[k]){
                  if(!self._shadowed){
                     if(treeKeys[k]){
                        recursive = true;
                     }
                     treeKeys[k] = true;
                     for(var j = 0, len = childs[k].length; j < len; ++j){
                        var rec2 = childs[k][j],
                           key = $ws.helpers.parseIdentity(rec2[self._pkColumnIndex]),
                           nHM;
                        if(v.childs.put(
                           key,
                           {
                              record: rec2,
                              childs: nHM = new $ws.proto.OrderedHashMap()
                           }
                        )){
                           self._treeMap.put(key, nHM);
                        }
                        else{
                           self._treeMap.put(key, v.childs.get(key).childs);
                        }
                     }
                     treeKeys[k] = false;
                  }
                  if(!recursive){
                     appendToData(v.childs, level + 1);
                  }
               }
               return true;
            });
         };

      for(i = 0, len = this._loadingId && this._loadingId.length; i < len; ++i){
         loadedMap[this._loadingId[i]] = true;
      }

      /*
       *  Читаем ветку this._tree в childs
       */
      viewTree(this._tree);

      /*
       *  Заполняем новыми значениями childs
       */
      childsFilling(data);

      for(i = 0, len = this._childRecordsMap.length; i < len; ++i){
         record = this._childRecordsMap[i];
         if(record){
            recordsMap[record.getKey()] = record;
         }
      }

      this._level = {};
      this._data = [];
      this._pkIndex = {};
      this._clearTreeMap();
      for(i in childs){
         if(childs.hasOwnProperty(i) && !found[i]){
            found[i] = true;
            var nHM = new $ws.proto.OrderedHashMap();
            this._tree.put(
               i,
               {
                  record: undefined,
                  childs: nHM
               }
            );
         }
      }
      appendToData(this._tree, -1); //На нулевом уровне теперь несуществующие папки, так что передаём -1
      this._childRecordsMap = [];
      for(i = 0, len = this._data.length; i < len; ++i){
         key = this._data[i][this._pkColumnIndex];
         if(recordsMap[key]){
            this._childRecordsMap[i] = recordsMap[key];
         }
         if (this._maxKey < key) {
            this._maxKey = key;
         }
      }
      if(recursive){
         $ws.single.ioc.resolve('ILogger').error("RecordSet", "Recursive hierarchy data");
      }
      return shadowRecords;
   },
   /**
    * Внутренний обработчик события завершения обработки данных Reader'ом
    * @param {Object} eventState
    * @param {Boolean} isSuccess Успешность обработки
    * @param {Object} error Ошибка
    * @param {boolean} isEmptyTable Флаг наличия данных в таблице
    * @param {boolean} noConfirm  Если true, то не будет стрелять onAfterLoad (нужно для добавления сразу нескольких записей)
    */
   _onComplete : function(eventState, isSuccess, error, isEmptyTable, noConfirm){
      //сбросим описание колонок, так как каждый раз колонки переначитываем
      if(isSuccess)
         this._parsedColumns = undefined;
      var shadowRecords,
         newRecords = [].concat(this._newData);
      if(this._options.hierarchyField !== ''){
         shadowRecords = this._buildHierarchyData(this._newData);
      }
      else{
         if(this._shadowed){
            shadowRecords = this._newData;
         }
         else{
            this._childRecordsMap = [];
            this._pkIndex = {};
            this._level = {};
            this._data = [];

            for(var j = 0, len2 = this._newData.length; j < len2; ++j){
               var tempId = $ws.helpers.parseIdentity(this._newData[j][this._pkColumnIndex]);
               this._level[tempId] = 0;
               this._pkIndex[tempId] = this._data.length;
               this._data.push(this._newData[j]);
               if (tempId > this._maxKey) {
                  this._maxKey = tempId;
               }
            }
         }
      }
      this._newData = [];

      //this._timeElapsed = new Date() - this._requestBegin;
      if(!isSuccess)
         this._lastError = error;
      else
         this._isEmptyTable = !!(isEmptyTable === false); // Пока будем выставлять, когда запрос был удачен

      this.rewind();
      if(this._shadowed){
         this._notify('onShadowLoad', this, isSuccess, error, shadowRecords);
         this._shadowed = false;
      }
      else{
         if (!noConfirm){
            this._notify('onAfterLoad', this, isSuccess, error, this._loadingInfo && this._loadingInfo.options);
         }
         if(this._loadingInfo && !this._loadingInfo.deferred.isReady()){
            this._loadingInfo.deferred.callback(newRecords.length);
         }
      }
   },
   _produceRecord: function(data) {
      if(data === null || data === undefined)
         return null;
      return new $ws.proto.Record({
         row : data.row,
         colDef : data.columns,
         parentRecordSet: this,
         pkValue: $ws.helpers.parseIdentity(data.row[data.pk]),
         objectName: data.objectName
      });
   },
   /**
    * Возвращает в колбэке новую "пустую" строку из базы, предзаполненную переданным фильтром
    * @param {Object} filter фильтр для создания новой записи
    * @param {String} [methodName] имя методя для выяснения формата
    * @returns {$ws.proto.Deferred}
    */
   createRecord : function(filter, methodName){
      return this
            .getReader()
            .createRecord(this._prepareFilter(filter), methodName)
            .addCallback(this._produceRecord.bind(this));
   },
   /**
    * если id не задан - возвращает в колбэке новую "пустую" строку из базы (в рекордсет запись не вставляется)
    * иначе возвращет строку из базы по id
    * @param {String} id идентификатор запрашиваемой записи
    * @param {Object} [filter] фильтр для создания новой записи (если будет создание)
    * @param {String} [linkName] Имя связи (вычитывается только связь)
    * @returns {$ws.proto.Deferred} асинхронное событие стреляет готовым рекордом
    */
   readRecord : function(id, filter, linkName){
      if(id === undefined) {
         $ws.single.ioc.resolve('ILogger').log("RecordSet", "Не рекомендуется использовать readRecord с id === undefined, используйте createRecord.");
         return this.createRecord(filter);
      } else {
         return this.getReader().readRecord(id, filter, linkName).addCallback(this._produceRecord.bind(this));
      }
   },
   /**
    * если id не задан - возвращает в колбэке новую "пустую" строку из базы (в рекордсет запись не вставляется)
    * иначе возвращет строку из базы по id
    * @param {String} id идентификатор запрашиваемой записи
    * @returns {$ws.proto.Deferred} асинхронное событие стреляет готовым рекордом
    */
   copyRecord : function(id, format){
      try{
         return this.getReader().copyRecord(id, format).addCallback(this._produceRecord.bind(this));
      } catch(e){
         return new $ws.proto.Deferred().errback(e);
      }
   },
   /**
    * Объединить записи с указанными идентификаторами.
    * @param {String} mergeKey Идентификатор записи, с которой объединяем.
    * @param {String} recordKey Идентификатор записи, которую объединяем.
    * @returns {$ws.proto.Deferred} Асинхронное событие, стреляет готовым рекордом.
    */
   mergeRecords : function(mergeKey, recordKey){
      var self = this;
      try{
         return this.getReader().mergeRecords(mergeKey, recordKey).addCallback(function(){
            self.clearRecord(recordKey);
         });
      } catch(e){
         return new $ws.proto.Deferred().errback(e);
      }
   },
   /**
    * Чистит данные и _pkIndex у RecordSet'а
    */
   clear : function(){
      this._data = [];
      this._newData = [];
      this._pkIndex = [];
      this._level = {};
      this._tree.clear();
      this._treeMap.clear();
      this._pageNum = 0;
      this._notify('onPageChange', 0);
   },
   /**
    * Чистит данные и _pkIndex у RecordSet'а для Record'а с заданным pk
    * @param {String} pk первичный ключ записи
    */
   clearRecord : function(pk){
      if (this._pkIndex[pk]!==undefined){//only if record was not empty
         if(this._options.hierarchyField){
            var record = this.at(this._pkIndex[pk]),
                parent, hashMap;
            if(record instanceof $ws.proto.Record){
               parent = record.get(this._options.hierarchyField);
               hashMap = this._treeMap.get(parent);
               if(hashMap)
                  hashMap.remove(pk);
            }
         }
         this._data.splice(this._pkIndex[pk], 1); // Remove Record from data array
         this._childRecordsMap.splice(this._pkIndex[pk], 1);
         this._removeKeyFromIndex(pk); // Rebuild key index
         delete this._level[pk]; // Remove item from level index
      }
   },
   /**
    * Очистка всех записей, parent которых - указанный, а также всех зависимых от них и т д
    * Возвращает массив с ключами удалённых записей
    * @param {String} pId Парент очищаемых записей
    */
   clearNode: function(pId){
      if(this._pkIndex[pId] === undefined){
         return [];
      }
      for(var i = this._pkIndex[pId] + 1,
             len = this._data.length,
             level = this._level[pId]; i < len; ++i){
         if(!this._data[i]){
            continue;
         }
         var record = this.at(i);
         if(this._level[record.getKey()] > level){
            var key = record.getKey();
            this._data[i] = null;
            delete this._pkIndex[key];
            delete this._level[key];
            delete this._data[i];
         }
         else{
            break;
         }
      }
      var tempData = this._data;
      this._data = [];
      for(var j = 0, len2 = tempData.length; j < len2; ++j){
         if(tempData[j]){
            this._data.push(tempData[j]);
         }
      }
      this._refreshPkIndex();
   },
   _refreshPkIndex: function(){
      var record;
      this._pkIndex = {};
      for(var i = 0, l = this._data.length; i < l; i++){
         record = this.at(i);
         if(record){
            this._pkIndex[record.getKey()] = i;
         }
      }
   },
   /**
    * Получить индекс записи в рекордсете по ее первичному ключу
    * @param {String} key значение ключа записи
    */
   getRecordIndexByPrimaryKey: function(key){
      return this._pkIndex[key];
   },
   /**
    * Сбрасывает итератор датасета в начало.
    */
   rewind: function(){
      this._dataIterator = -1;
   },
   /**
    * Возвращает менялся ли набор данных
    * @return {Boolean}
    */
   isChanged: function(){
      if(this._isChanged === true)
         return true;
      else{
         var result = false;
         this.each(function(record){
            if(record.isChanged()){
               result = true;
               return false;
            }
         });
         return result;
      }
   },
   commit: function(){
      this._isChanged = false;
      for(var i = 0, l = this._childRecordsMap.length; i < l; i++){
         if(this._childRecordsMap[i] !== undefined && this._childRecordsMap[i].isChanged())
            this._childRecordsMap[i].commit();
      }
   },
   /**
    * Получает следующую записть датасета
    *
    * @return {$ws.proto.Record} строка данных
    */
   next: function(){
      var l = this._data.length;
      while(++this._dataIterator < l){
         var record = this.at(this._dataIterator);
         if(record){
            return record;
         }
      }
      return false;
   },
   /**
    * Возвращает рекорд на нужной позиции
    * @param {Number} id
    * @returns {$ws.proto.Record|undefined}
    */
   at: function(id){
      if(this._childRecordsMap[id] === undefined){
         var data = this._data[id];
         if(data) {
            this._childRecordsMap[id] = new $ws.proto.Record({
               row: data,
               colDef: this._columns,
               parentRecordSet: this,
               pkValue: this._pkColumnIndex >= 0 ? $ws.helpers.parseIdentity(data[this._pkColumnIndex]) : null
            });
         } else if(id < 0 || id >= this._data.length){
            return undefined;
         } else
            throw new Error("No record at index " + id);
      }
      return this._childRecordsMap[id];
   },
   /**
    * Выполняет функцию f для каждой строки, при этом выполняется вызов в цикле f.apply(this, [rec, idx++])
    * где:
    *   this - это RecordSet
    *   rec - запись набора данных
    *   idx - номер строки (0 - первая строка, 1-вторая и т.д.)
    * Если функция возвращает false, то ее вызов в цикле для оставшихся строк не выполняется, т.е. обработка прекращается.
    * @param {Function} f функция которая будет выполнена для каждой строки набора данных
    */
   each: function(f){
      this.rewind();
      var rec, idx = 0;
      while( (rec = this.next()) !== false){
         if( (f.apply(this, [rec, idx++])) === false ){
            return;
         }
      }
   },
   /**
    * Возвращает время, затраченное на получение данных
    * @return Number
    */
   getElapsedTime: function(){
      return 0;
   },
   /**
    * Получает время начала запроса
    * @return Date
    */
   getBeginTime: function(){
      return new Date();
   },
   /**
    * Возвращает модель представления колонок набора данных
    * @return Object
    */
   getColumns: function(){
      if(Object.isEmpty(this._parsedColumns || {})){
         var parser = this.getReader().getParser();
         this._parsedColumns = parser.getParsedColumns(this._columns);
      }
      return this._parsedColumns;
   },
   /*
    * Проверяет наличие колонки в рекордсете.
    */
   hasColumn: function(columnName){
      return columnName in this.getColumns();
   },
   /**
    * Устанавливает модель представления колонок набора данных
    * @param {Object} columns колонки
    */
   setColumns: function(columns){
      if(Object.prototype.toString.call(columns) == "[object Object]")
         this._columns = $ws.single.SerializatorSBIS.serializeCols(columns);
      else
         this._columns = columns;
      var l =  this._columns.length,
          i = 0;

      while(i < l){
         this._columnIndex[ this._columns[i].n] = i;
         i++;
      }
   },
   /**
    * @param {$ws.proto.Record} record
    * @param {Object} [options]
    * @returns {$ws.proto.Deferred|Boolean}
    */
   updateRecord: function(record, options){
      var recKey = record.getKey(),
          self = this;

      return this.getReader().updateRecord(record, options).addCallback(function(v){
         if(v !== null && recKey === null)
            record.setKey(v, self._pkColumnIndex);
         self._isChanged = true;
         self._notify('onRecordUpdated', record);
         return v;
      });
   },
   /**
    * Удалить запись (как из набора так и из внешнего источника)
    * @param {String} pk первичный ключ записи которую необходимо удалить
    * @return {$ws.proto.Deferred}
    */
   deleteRecord: function(pk){
      var self = this;
      try{
         var record = self.contains(pk) ? self.getRecordByPrimaryKey(pk) : false,
             clearRecord = function(key){
               self.clearRecord(key);
               self._isChanged = true;
             },
             postDelete = function(){
                if ($ws.helpers.type(pk) === 'array'){
                   $ws.helpers.forEach(pk, function(key){
                      clearRecord(key);
                   });
                } else {
                   clearRecord(pk);
                }
                self._notify('onRecordDeleted', pk, record);
             };
         if($ws.helpers.type(pk) === 'array' && Array.indexOf(pk, null) > -1){
            //значит есть записи, которые на БЛ фактически не созданы и нам надо их вычистить
            pk = pk.filter(function(val){
               return val !== null;
            });
            //если были одни null в массиве ключей, то притворимся, что пытаемся вычистить одну запись с таким ключом.
            if(!pk.length){
               pk = null;
            }
         }
         if(pk !== null){ //Ключ null означает, что в бизнес-логики этой записи нет, а значит, и удалять её не надо
            return this.getReader().deleteRecord(pk).addCallback(postDelete);
         }
         else{
            postDelete();
            return new $ws.proto.Deferred().callback();
         }
      } catch(e){
         return new $ws.proto.Deferred().errback(e);
      }
   },
   /**
    * Удалить записи (как из набора так и из внешнего источника)
    * @param {array} pkArr массив первичных ключей записей, которые необходимо удалить
    * @return {$ws.proto.Deferred}
    */
   deleteRecords: function(pkArr){
      var deleteReady = new $ws.proto.ParallelDeferred();
      for(var i = 0, len = pkArr.length; i < len; ++i){
         deleteReady.push(this.deleteRecord(pkArr[i]));
      }
      return deleteReady.done().getResult();
   },

   deleteRecordsByFilter: function(filter, methodName){
      var self = this;
      return this.getReader().deleteRecordsByFilter(filter, methodName).addCallback(function(){
         self.clear();
         self._isChanged = true;
         self._notify('onRecordDeleted', null, []);
      });
   },
   /**
    * Удаляет ключ из индекса, частично его перестраивая
    * @param {*} pk ключ записи, которую удаляем из индекса
    * @private
    */
   _removeKeyFromIndex: function(pk) {
      var dataPos = this._pkIndex[pk];
      delete this._pkIndex[pk];
      for(var i in this._pkIndex) {
         if(this._pkIndex.hasOwnProperty(i) && this._pkIndex[i] > dataPos)
            this._pkIndex[i]--;
      }
   },
   /**
    * Возвращает общее количество записей
    *
    * @return {number} количество записей
    */
   getRecordCount: function(){
      var result = 0;
      for(var i = this._data.length - 1; i >= 0; --i){
         if(this._data[i]){
            ++result;
         }
      }
      return result;
   },

   /**
    * Получить последнюю ошибку
    * @return {Object} ошибка
    */
   getLastError : function(){
      return this._lastError;
   },
   /**
    * Получает запись по ее первичному ключу
    * @param {Number} primaryKey Первичный ключ записи
    * @returns {$ws.proto.Record}
    */
   getRecordByPrimaryKey: function(primaryKey){
      if (primaryKey in this._pkIndex){
         return this.at(this._pkIndex[primaryKey]);
      }
      throw new Error("Record with primary key " + primaryKey + " is not found");
   },
   /**
    * Добавляет новое значение первичного ключа в массив _pkIndex
    * @param {Number} pkValue значение первичного ключа
    */
   addPkIndex: function(pkValue){
      this._pkIndex[pkValue] = this._data.length - 1;
   },
   /**
    * Возвращает номер колонки с первичным ключом
    * @returns {Number}
    */
   getPkColumnIndex: function(){
      return this._pkColumnIndex;
   },
   getColumnIdx: function(columnName){
      if(columnName in this._columnIndex)
         return this._columnIndex[columnName];
      else
         throw new TypeError("Column " + columnName + " is not defined");
   },
   getDataForSerialize: function(){
      for(var i = 0, l = this._childRecordsMap.length; i < l; i++){
         if(this._childRecordsMap[i] !== undefined){
            this._childRecordsMap[i].prepareToSerialize();
         }
      }
      return this._data;
   },
   getColumnsForSerialize: function(){
      return this._columns;
   },
   /**
    * Прерывает загрузку рекордсета
    * @param {boolean} clearStack - очистить очередь загрузки
    */
   abort: function(clearStack){
      this.getReader().abort();
      //Этот код был написан Владом Яковлевым
      if (clearStack){
         this._queryStack.length = 0;
         this._loaded = true;
         this._loadingInfo = undefined;
      }
      this._notify('onAbort');
   },
   /**
    * Есть ли запись с указанным ключом
    * @param {Number} pkValue ключ
    * @returns {Boolean} наличие записи
    */
   contains: function(pkValue){
      return this._pkIndex[pkValue] !== undefined;
   },
   /**
    * Загружает нужный узел (для иерархии)
    * @param {Number|Array}   id             идентификатор нужного узла или массив с ними ('Выборка')
    * @param {Boolean}        [clear]        очищать ли рекордсет
    * @param {Boolean}        [pageNum]      грузить ли следующую страницу или 0
    * @param {Boolean}        [expand]       загружать ли с разворотом
    * @param {Boolean}        [shadowed]     скрытый ли запрос
    * @param {Object}         [options]      опции запроса. придут в событии onAfterLoad
    * @param {Boolean}        [saveFilter]   сохранять параметры фильтра
    * @param {Boolean}        [queuedLoad]   Принудительное использование очереди запросов
    * @returns {$ws.proto.Deferred} Сработает с массивом записей и опциями (параметр options этого метода)
    */
   loadNode: function(id, clear, pageNum, expand, shadowed, options, saveFilter, queuedLoad){
      if(this._options.hierarchyField){
         if( !saveFilter )
            this._options.filterParams[this._options.hierarchyField] = id;
      }
      var filter = this._prepareFilter(this._options.filterParams);
//      clear = clear === undefined ? true: clear;
      this._pageNum = (pageNum ? pageNum : 0);
      this._notify('onPageChange', this._pageNum);
      if(this._options.hierarchyField){
         filter['Разворот'] = expand ? 'С разворотом' : 'Без разворота';
      }
      filter['shadowed'] = shadowed;
      var info = this._createLoadingInfo(options);
      this._beginLoad(filter, clear, info, queuedLoad);
      return info.deferred;
   },
   /**
    * Установит нужный раздел иерархии, чтобы рекордсет считал загруженным его
    * Не приводит к загрузке данных
    * @param {Number|Array}   id             идентификатор нужного узла
    */
   setCurrentNode:function(id){
      var hierField = this._options.hierarchyField;
      if(hierField){
         this._options.filterParams[hierField] = id;
      }
   },
   /**
    * Возвращает последний загруженный id
    * @returns {Number} идентификатор
    */
   getLoadingId: function(){
      if(this._loadingId instanceof Array && this._loadingId.length === 1){
         return this._loadingId[0];
      }
      return this._loadingId;
   },
   /**
    * Возвращает "глубину" какой-либо записи по её идентификатору
    * @param {Number} id идентификатор записи
    * @returns {Number|undefined} если запись есть, то возвращается её глубина, иначе - undefined
    */
   getRecordLevel: function(id){
      return this._level[id];
   },
   /**
    * Возвращает поле иерархии
    * @returns {String} field
    */
   getHierarchyField: function(){
      return this._options.hierarchyField;
   },
   /**
    * Устанавливает поле иерархии и перестраивает данные
    * @param {String} field Поле, в котором находится иерархия
    */
   setHierarchyField: function(field){
      if(this._options.hierarchyField !== field){
         this._options.hierarchyField = field;
         if(field){
            this._buildHierarchyData(this._data);
         }
      }
   },
   _importRecord: function(record){
      var badColumns = false,
          recordColumns = record.getColumns(),
          rsColumns = this.getColumns(),
          rsColumnsList = [],
          systemColumn = Array.indexOf(recordColumns, "ctid"),
          columnDefinition, columnName, rsColumn, cnt;
      for(var col in rsColumns){
         if(rsColumns.hasOwnProperty(col)){
            rsColumnsList[rsColumns[col].index] = col;
         }
      }
      if(systemColumn !== -1)
         recordColumns.splice(systemColumn, 1);
      cnt = recordColumns.length;
      if(rsColumnsList.length === cnt){
         for(var k = 0; k < cnt; k++ ){
            columnName = recordColumns[k];
            rsColumn = rsColumns[ columnName ];
            columnDefinition = record.getColumnDefinition(columnName);
            if(!rsColumn || rsColumn.type !== columnDefinition.type || rsColumn.index !== columnDefinition.index){
               badColumns = true;
               break;
            }
         }
      } else
         badColumns = true;
      record.setRecordSet(this, true);
      var key = record.getKey();
      if(!key && key !== 0){
         record.setKey(++this._maxKey, this._pkColumnIndex);
      }
      if(badColumns === true)
         throw new TypeError("RecordSet:appendRecord - передана запись формата, отличного от формата набора данных. Возможны проблемы в работе с этим набором записей.");
   },
   /**
    * Добавляет в рекордсет новый рекорд, собранный из переданных данных
    * @param {Object|$ws.proto.Record} data хэш-мэп поле-значение для нового рекорда или настоящий Record, окоторый будет добавлен по ссылке
    * @param {boolean} [noConfirm]  Если true, то не будет стрелять onAfterLoad (нужно для добавления сразу нескольких записей)
    * @returns {$ws.proto.Record} добавленный рекорд
    */
   appendRecord : function(data, noConfirm){
      var columns = this._columns,
          colDef = {},
          colType,
          row = [],
          len = columns.length,
          record,
          newRecordIdx = this._data.length;

      if(data instanceof $ws.proto.Record) {
         record = data;
         this._importRecord(record);
         row = record.getDataRow();
         // чтобы не создавать запись лишний раз запомним ее как дочернюю для этого рекордсета
         this._childRecordsMap[newRecordIdx] = record;
      } else {
         $ws.single.ioc.resolve('ILogger').log("RecordSet:appendRecord", "Вызов данного метода с типом аргумента Object является устаревшим. Передавайте $ws.proto.Record");
         row = [];
         for(var i = 0; i < len; i++){
            colDef = columns[i];
            colType = typeof(colDef.t) == 'string' ? colDef.t : colDef.t.n;
            if(colDef.n in data){
               row.push(this._importValueForSet(data[colDef.n], colType ));
            } else
               row.push(null);
         }
         record = new $ws.proto.Record({
            colDef: columns,
            row : row,
            pkValue : $ws.helpers.parseIdentity(row[this._pkColumnIndex]),
            parentRecordSet : this
         });
      }

      this._pkIndex[record.getKey()] = newRecordIdx;

      if (record.getKey() !== null && this._options.hierarchyField !== ''){
         // TODO проверить этот код при построении иерархического RecordSet
         var parentId = record.get(this._options.hierarchyField),
            parentLevel = this._level[parentId];
         this._level[record.getKey()] = parentLevel ? parentLevel + 1 : 1;

         /*
          * Заполняем массив _newData текущими значениями this._data
          * для того, чтобы привести результат добавления аналогично
          * результату ридера
          */
         this._newData = Array.clone(this._data);
         this._newData.push(row);
         this._onComplete({}, true, undefined, undefined, noConfirm);
      }
      else{
         this._data.push(row);
         if (!noConfirm) {
            this._notify('onAfterLoad', this, true);
         }
      }
      // возвращаем именно ту запись, которую вставили
      return record;
   },
   /**
    * Добавить массив записей в RecordSet
    * @param {Array} records - массив записей, которые нужно добавить в рекордсет
    * @param {Boolean} noNotify - принудительно не стрелять onAfterLoad по завершению метода
    */
   appendRecords: function( records, noNotify ) {
      for (var i = 0, len = records.length; i < len; i++) {
         //Разрешаем стрелять onAfterLoad только при добавлении последней записи или noNotify вообще
         this.appendRecord(records[i], noNotify || (i < len -1));
      }
   },
   /**
    * TODO : ИСПОЛЬЗОВАТЬ ТОЛЬКО ПРИ СТРОГОЙ НЕОБХОДИМОСТИ!!!
    *
    * Добавляет в рекордсет новый рекорд в позицию после указанной
    * @param {Number} pk значение первичного ключа записи, после которой будет вставлена новая
    * @param record {$ws.proto.Record} вставляемый рекорд
    * @param {boolean} [noNotify] флаг для запрета нотификации события onAfterLoad
    * @return {$ws.proto.Record}
    */
   insertAfter : function(pk, record, noNotify){
      var pos = this.contains(pk) ? (this._pkIndex[pk] + 1) : 0,
          key = record.getKey(),
          row = [];
      if(record instanceof $ws.proto.Record)
         row = record.getDataRow();
      else
         throw new Error("Не передана запись для вставки в набор данных!");
      this._data.splice(pos, 0, row);
      for(var j = this._childRecordsMap.length; j >= pos; j--){
         if(this._childRecordsMap[j] !== undefined)
            this._childRecordsMap[j+1] = this._childRecordsMap[j];
      }
      this._childRecordsMap[pos] = record;
      for (var i in this._pkIndex){
         if (this._pkIndex.hasOwnProperty(i) && this._pkIndex[i] >= pos)
            ++this._pkIndex[i];
      }
      this._pkIndex[key] = pos;
      record.setRecordSet(this, true);
      if(this._options.hierarchyField){
         var parentField = this._options.hierarchyField,
            parent = record.get(parentField),
            hashMap;
         if(this._treeMap.contains(parent)){
            hashMap = this._treeMap.get(parent);
         }
         else{
            hashMap = new $ws.proto.OrderedHashMap();
            this._treeMap.put(parent, hashMap);
         }
         var after = pk,
            afterRecord;
         while( this.contains(after) && (afterRecord = this.getRecordByPrimaryKey(after)) && afterRecord.get(parentField) != parent ){
            after = afterRecord.get(parentField);
         }
         if( !this.contains(after) ){
            after = undefined;
         }
         hashMap.insert(key, {
            record: row,
            childs: new $ws.proto.OrderedHashMap()
         }, after);
      }
      if (!noNotify) {
         this._notify('onAfterLoad', this, true);
      }
      return record;
   },
   _importValueForSet: function(value, type){
      switch(type) {
         case $ws.proto.Record.FIELD_TYPE_DATE:
         case $ws.proto.Record.FIELD_TYPE_DATETIME:
         case $ws.proto.Record.FIELD_TYPE_TIME:
            var serializeMode;
            switch(type) {
               case "Дата и время":
                  serializeMode = true;
                  break;
               case "Время":
                  serializeMode = false;
                  break;
            }
            return value instanceof Date ? value.toSQL(serializeMode) : null;
         case $ws.proto.Record.FIELD_TYPE_INTEGER:
            return (typeof(value) == 'number') ? value : (isNaN(parseInt(value, 10)) ? null : parseInt(value, 10));
         case $ws.proto.Record.FIELD_TYPE_IDENTITY:
            return $ws.single.SerializatorSBIS.serializeHierarchyIdentity(value);
         case $ws.proto.Record.FIELD_TYPE_ENUM:
            var eV = value.getCurrentValue();
            return eV === null ? null : parseInt(eV, 10);
         case $ws.proto.Record.FIELD_TYPE_FLAGS:
            if(value instanceof $ws.proto.Record){
               var s = {},
                   t = value.getColumns(),
                   dt = [];
               for (var x = 0, l = t.length; x < l; x++){
                  s[value.getColumnIdx(t[x])] = t[x];
               }
               var sorted = Object.sortedPairs(s),
                   rO = value.toObject();
               for(var y = 0, ly = sorted.keys.length; y < ly; y++) {
                  dt.push(rO[sorted.values[y]]);
               }
               return dt;
            } else if(value instanceof Array) {
               return value;
            } else {
               return null;
            }
         case $ws.proto.Record.FIELD_TYPE_RECORD:
         case $ws.proto.Record.FIELD_TYPE_QUERY:
            if(value === null)
               return null;
            else if(value instanceof $ws.proto.Record || value instanceof $ws.proto.RecordSet)
               return value.toJSON();
            else
               return $ws.single.SerializatorSBIS.serialize(value);
         case $ws.proto.Record.FIELD_TYPE_STRING:
            return value === null ? null : value + "";
         case $ws.proto.Record.FIELD_TYPE_LINK:
            return value === null ? null : parseInt(value, 10);
         default:
            return value;
      }
   },
   /**
    * Проверяет наличие записей на текущей странице, если их нет, переходит назад
    */
   updatePages: function(){
      var recordsCount = 0;
      for(var i = 0, len = this._data.length; i < len; ++i){
         if(this._data[i]){
            ++recordsCount;
         }
      }

      var result;
      if(recordsCount === 0 && this._pageNum > 0){
         result = this.setPage(this._pageNum - 1, true, true);
      } else {
         result = (new $ws.proto.Deferred()).callback();
      }
      return result;
   },
   moveRecord: function(parent, key, isUp){
      var childs = this._treeMap.get(parent),
            swapedChilds = [],
            newChilds = [[], []],
            state = 0, m;
      if(childs){
         var prev,
               swap = function(key0, key1){
                  swapedChilds.push([key0, childs.get(key0)]);
                  swapedChilds.push([key1, childs.get(key1)]);
               };
         childs.each(function(i, v){
            if(isUp){
               if(state === 0 && i == key && prev !== undefined){
                  newChilds[0].pop();
                  swap(i, prev);
                  ++state;
               }
               else{
                  newChilds[state].push([i, v]);
               }
               prev = i;
            }
            else{
               if(i == key){
                  prev = i;
               }
               else if(state === 0 && prev !== undefined){
                  swap(i, prev);
                  ++state;
               }
               else{
                  newChilds[state].push([i, v]);
               }
            }
         });
         this._treeMap.put(parent, new $ws.proto.OrderedHashMap());
         for(var c = 0; c < 2; ++c){
            for(var j = 0, len = newChilds[c].length; j < len; ++j){
               m = this._treeMap.get(parent);
               m.put.apply(m, newChilds[c][j]);
            }
            if(c === 0){
               for(var h = 0; h < 2; ++h){
                  m = this._treeMap.get(parent);
                  m.put.apply(m, swapedChilds[h]);
               }
            }
         }
      }
   },
   /**
    * Проверяет, является ли эта колонка иерархической
    * @param {String} hierColumn
    * @returns {Boolean}
    */
   checkHierColumn: function(hierColumn){
      if(this._loadingId !== undefined){ //Ещё ничего не загружали, знать не можем
         var idx = this._columnIndex[hierColumn];
         if(idx === undefined){
            return false;
         }
         return this._columns[idx].s && this._columns[idx].s === "Иерархия";
      }
      return true;
   },
   /**
    * Обновляет параметр в исходном фильтре. Использовать при строгой необходимости
    * @param {String} key Ключ
    * @param {String} value Значение
    */
   updateInitialParameter: function(key, value){
      this._options.filterParams[key] = this._initialFilter[key] = value;
   },
   /**
    * Загружен ли сейчас рекордсет или производится загрузка данных
    * @return {Boolean}
    */
   isLoaded: function(){
      return this._loaded;
   },
   /**
    * Возвращает дочерние узлы записи с указанным идентификатором
    * @param {String} key Ключ записи
    * @return {Array}
    */
   recordChilds: function(key){
      var result = [],
         childs = this._treeMap.get(key);
      if(childs){
         childs.each(function(key){
            result.push(key);
         });
      }
      return result;
   },
   /**
    * Добавляет колонку в набор записей
    * @param {String} name Имя добавляемой колонки
    * @param {String} type Тип добавляемой колонки
    * @param {String|Object} details Детализация структуры для типов: флаги, перечисляемое, массив и связь
    * Для флагов и перечисляемого описывается их структура, для связи - имя связанной таблицы, а для массива тип его элементов
    * @return {Boolean} добавлена ли колонка
    */
   addColumn: function(name, type, details){
      if(!(name in this._columnIndex)){
         var j, cnt;
         var config = $ws.single.SerializatorSBIS.getColumnConfigByType(name, type, details);
         if(config !== false){
            var additionalName = ["", "@", "$"],
                i, l;
            for(i = 0, l = config.cols.length; i < l; i++){
               this._columnIndex[name + additionalName[i]] = this._columns.length;
               this._columns.push(config.cols[i]);
            }
            for(j = 0, cnt = this._childRecordsMap.length; j < cnt; j++ ){
               if(this._childRecordsMap[j] !== undefined){
                  this._childRecordsMap[j].addColumn(name, type, details, true, config.cols);
               }
            }
            for(i = 0, l = config.cols.length; i < l; i++){
               for(j = 0, cnt = this._data.length; j < cnt; j++){
                  if(this._data[j] !== undefined)
                     this._data[j].push(config.data[i]);
               }
            }
            this._parsedColumns = {};
            return true;
         }
      }
      return false;
   },
   /**
    * Удаляет колонку из набора записей
    * @param {String} name Имя удаляемой колонки
    * @return {Boolean} удалена ли колонка
    */
   removeColumn: function(name){
      if(name in this._columnIndex) {
         var idx = this.getColumnIdx(name),
             j, cnt;
         for(var colName in this._columnIndex) {
            if(this._columnIndex.hasOwnProperty(colName) && this._columnIndex[colName] > idx){
               this._columnIndex[colName]--;
            }
         }
         delete this._columnIndex[name];
         for(j = 0, cnt = this._data.length; j < cnt; j++){
            if(this._data[j] !== undefined)
               this._data[j].splice(idx, 1);
         }
         this._columns.splice(idx, 1);
         for(j = 0, cnt = this._childRecordsMap.length; j < cnt; j++ ){
            if(this._childRecordsMap[j] !== undefined){
               this._childRecordsMap[j].removeColumn(name, true);
            }
         }
         this._parsedColumns = {};
         return true;
      } else
         return false;
   },
   /**
    * Возвращает массив идентификаторов записей, у которых нет родительских записей в данный момент
    * @returns {Array}
    */
   getLoadedRoots: function() {
      var res = [];
      this._tree.each(function(key) {
         res.push(key);
      });
      return res;
   }
});

/**
 * Класс для локальной работы с записями: ведёт себя, как RecordSet, но не требует бизнес-логики для работы.
 * Можно использовать вместе с браузером:
 * <pre>
 *    browser.setData(recordSetStatic);
 * </pre>
 * Создание статического рекордсета (если Source уже загружен):
 * <pre>
 *    var recordset = new $ws.proto.RecordSetStatic({
 *       defaultColumns: columns,
 *       hierarchyField: 'Раздел',
 *       records: records
 *    });
 * </pre>
 * Здесь:
 * - columns: колонки. Формат такой же, как результат выполнения метода {@link getColumns} у обычного рекордсета.
 * - "Раздел": название колонки с иерархией. Если иерархии нет/не нужна, то можно не указывать или передать пустую.
 * - recods: массив с записями. Можно не передавать или передать пустой массив, а записи добавлять позже.
 * Основные способы добавления записей:
 * <pre>
 *    recordset.addRecords(records);
 *    recordset.setRecords(records);// в отличии от предыдущего, удалит существующие записи
 *    recordset.appendData([object]);
 * </pre>
 * Пример колонок:
 * <pre>
 *    var columns = {
 *       "@key": {
 *          "type": "Идентификатор",
 *          "title": "@key",
 *          "index": 0
 *       },
 *       "Название": {
 *          "type": "Строка",
 *          "title": "Название",
 *          "index": 1
 *       }
 *    };
 * </pre>
 * Можно легко создать статический рекордсет из обычного:
 * <pre>
 *    var staticRecordSet = new $ws.proto.RecordSetStatic({
 *       defaultColumns: recordset.getColumns(),
 *       records: recordset.getRecords()
 *    });
 * </pre>
 * Статический рекордсет позволяет удалять, добавлять, редактировать и создавать записи.
 * Возможна работа с постраничной навигацией, иерархическими данными, фильтрацией.
 * Больше информации можно найти на <a href="http://inside.sbis.ru/doc/_layouts/DocIdRedir.aspx?ID=SBIS-5-1858">inside.sbis.ru</a>
 *
 * @cfg {Object} defaultColumns Разметка колонок всех записей
 * @cfg {Array} records Массив с $ws.proto.Record - начальные данные
 * @cfg {Function} filter Функция для фильтрации значений. Получит запись и текущий фильтр
 *
 * @class $ws.proto.RecordSetStatic
 * @extends $ws.proto.RecordSet
 */
$ws.proto.RecordSetStatic = $ws.proto.RecordSet.extend(/** @lends $ws.proto.RecordSetStatic.prototype */{
   $protected: {
      _options: {
         defaultColumns: {},        //Дефолтное значение для colDef записи
         records: [],               //Массив с записями - начальные данные
         filter: undefined          //Функция фильтрации данных
      },
      _hiddenData: [],              //Скрытые данные
      _expand: false,               //Будут ли загружаемые данные раскрытыми
      _parentNode: null,             //Идентификатор отца получаемых записей
      _pocketAppending: false,      //Флаг пакетной обработки
      _typeDetailesName: {
         "Флаги": "s",
         "Перечисляемое": "s",
         "Связь":"table",
         "Массив": "arrayType"
      }
   },
   $constructor: function(){
      this._initOptions();
      this._initRecords();
      this._startLoad();
   },
   addColumn: function(name, type, details){
      this._columns[name] = {
         'title': name,
         'type': type,
         'index': Object.keys(this._columns).length
      };
      if (!!details && this._typeDetailesName[type]) {
         this._columns[name][this._typeDetailesName[type]] = details;
      }
      for (var i = 0, l = this._hiddenData.length; i < l; i++) {
         this._hiddenData[i].addColumn.apply(this._hiddenData[i], arguments);
      }
   },
   removeColumn: function(name){
      delete this._columns[name];
      for (var i = 0, l = this._hiddenData.length; i < l; i++) {
         this._hiddenData[i].removeColumn(name);
      }
   },
   /*
    * Метод фильтрации текущих записей статического набора данных.
    * Является аналогом фильтрации через параметр filter
    * @param {Function} func функция фильтрации записей статического набора данных, на вход принимает запись {$ws.proto.Record}.
    * На выходе должна вернуть true для того, чтобы запись осталась в отфильтрованном наборе.
    */
   filter: function(func){
      var newData = [];
      this.each(function(record){
         if(func(record)){
            newData.push(record.getDataRow());
         }
      });
      this.setRecords(newData);
   },
   /**
    * Инициализирует опции
    * @private
    */
   _initOptions: function(){
      this._columns = this._options.defaultColumns;
      this._hiddenData = this._options.records;
   },
   /**
    * Инициализирует данные, связанные с записями
    * @private
    */
   _initRecords: function(){
      for(var i = 0; i < this._hiddenData.length; ++i){
         if(this._hiddenData[i]){
            this._hiddenData[i].setRecordSet(this);
            var key = this._hiddenData[i].getKey();
            this._pkIndex[key] = i;
            this._level[key] = 0;
         }
      }
   },
   /**
    * Начинает первую загрузку, если это нужно
    * @private
    */
   _startLoad: function(){
      if(this._options.firstRequest){
         this._beginLoad();
      }
   },
   /**
    * Рекордсет всегда инициализирован
    * @return {Boolean}
    */
   isInit: function(){
      return true;
   },
   /**
    * Переопределяем загрузку, чтобы ничего не делал
    * @param {Object} [queryFilter] фильтр, который использовать при загрузке, либо ничего и тогда автоматический просчёт
    * @param {Boolean|undefined} [clear] очищать ли всё при загрузке
    * @param {Object} [info] Информация о текущем запросе
    */
   _beginLoad: function(queryFilter, clear, info){
      var self = this,
         subresult = [],
         childResult = [],
         filter = this._options.filter,
         recursion = function(parentId){
            if(parentId === null){
               parentId = 'null';
            }
            for(var i = 0, len = self._hiddenData.length; i < len; ++i){
               if(self._hiddenData[i]){
                  var recordParent = self._hiddenData[i].get(self._options.hierarchyField);
                  if(recordParent === null){
                     recordParent = 'null';
                  }
                  if(recordParent == parentId &&
                     (!filter || filter(self._hiddenData[i], self._options.filterParams))){
                     var key = self._hiddenData[i].getKey();
                     self._level[key] = self._level[parentId] + 1;
                     subresult.push(self._hiddenData[i]);
                     if(self._expand){
                        recursion(self._hiddenData[i].getKey());
                     }
                  }
               }
            }
         };
      if( clear ){
         this._data = [];
      }
      if(this._options.hierarchyField){
         if(this._parentNode instanceof Array){
            this._expanded = false;
         }
         else{
            this._parentNode = [this._parentNode];
         }
         for(i = 0; i < this._parentNode.length; ++i){
            subresult = [];
            this._level[this._parentNode[i]] = 0;
            recursion(this._parentNode[i]);
            childResult = childResult.concat(subresult);
            var found = false;
            for(j = 0; j < this._data.length; ++j){
               if(this._data[j] && this._data[j].getKey() == this._parentNode[i]){
                  for(var c = j + 1; c < this._data.length; ++c){
                     if(this._data[c] && this._data[c].get(this._options.hierarchyField) == this._parentNode[i]){
                        this._data.splice(c--, 1);
                     }
                  }
                  this._data.splice.apply(this._data, [j + 1, 0].concat(subresult));
                  found = true;
                  break;
               }
            }
            if(!found){
               this._data = this._data.concat(subresult);
            }
         }
         subresult = this._data;
      }
      else{
         for(var j = 0, len2 = this._hiddenData.length; j < len2; ++j){
            if(this._hiddenData[j] && (!filter || filter(this._hiddenData[j], this._options.filterParams))){
               subresult.push(this._hiddenData[j]);
            }
         }
      }

      if(this._usePages){
         if(this._usePages === 'parts' && this._pageNum === -1){
            this._pageNum = Math.ceil(subresult.length / this._options.rowsPerPage) - 1;
         }
         this._data = [];
         this._hasNextPage = (this._usePages === 'full' ? subresult.length :
               (subresult.length > (this._pageNum + 1) * this._options.rowsPerPage));
         for(var i = this._pageNum * this._options.rowsPerPage,
                   len = Math.min(subresult.length, i + this._options.rowsPerPage); i < len; ++i){
            this._data.push(subresult[i]);
         }
      }
      else{
         this._data = subresult;
      }

      this._notify('onAfterLoad', this, true, undefined, info && info.options);
      if(info && info.deferred && !info.deferred.isReady()){
         info.deferred.callback(childResult || this._data);
      }
   },
   /**
    * Устанавливает функцию фильтрации
    * @param {Function} filter Функция, принимает запись и объект с фильтром
    */
   setFilter: function(filter){
      this._options.filter = filter;
   },
   /**
    * "Выполняет запрос" с указанным фильтром
    * @param {Object} filter  фильтр
    */
   setQuery: function(filter){
      this._expand = filter['Разворот'] === 'С разворотом';
      return $ws.proto.RecordSetStatic.superclass.setQuery.apply(this, arguments);
   },
   /**
    * Возвращает модель представления колонок набора данных
    * @return Object
   */
   getColumns: function(){
      return $ws.core.merge( {}, this._options.defaultColumns);
   },
   /**
    * Перестраивает индексы в рекордсете
    * @private
    */
   _rebuild: function(){
      this._pkIndex = {};
      this._level = {};
      for(var i = 0, len = this._hiddenData.length; i < len; ++i){
         if(i in this._hiddenData) {
            var tempId = this._hiddenData[i].getKey();
            this._level[tempId] = 0;
            this._pkIndex[tempId] = i;
         }
      }
   },
   /**
    * Устанавливает записи, после установки стреляет onAfterLoad'ом
    * @param {Array} records Массив с $ws.proto.Record'ами
    */
   setRecords: function(records){
      this._hiddenData = records;
      this._rebuild();
      this._beginLoad();
   },
   /**
    * Добавляет указанные записи у уже существующим
    * @param {Array} records Массив с новыми записями, instanceof $ws.proto.Record
    */
   addRecords: function(records){
      this._hiddenData = this._hiddenData.concat(records);
      if (this._pocketAppending === false){
         this._rebuild();
         this._beginLoad();
      }
   },
   /**
    * Получает запись по ее первичному ключу
    * @param {Number} primaryKey Первичный ключ записи
    * @returns {$ws.proto.Record}
    */
   getRecordByPrimaryKey: function(primaryKey){
      if (primaryKey in this._pkIndex){
         return this._hiddenData[this._pkIndex[primaryKey]];
      }
      throw new Error("Record with primary key " + primaryKey + " is not found");
   },
   /**
    * Возвращает в колбэке новую "пустую" строку "из базы", предзаполненную переданным фильтром
    * @param {Object} [filter] Фильтр
    * @returns {$ws.proto.Deferred}
    */
   createRecord : function(filter){
      filter = filter || {};
      var result = new $ws.proto.Deferred(),
         columns = this._columns,
         maxIndex = 0;
      for(var i = 0, len = this._hiddenData.length; i < len; ++i){
         if(!this._hiddenData[i]){
            continue;
         }
         var tempKey = this._hiddenData[i].getKey();
         if(maxIndex < tempKey){
            maxIndex = tempKey;
         }
      }
      var row = [],
         hierarchy = this._options.hierarchyField;
      for(var j in columns){
         if(columns.hasOwnProperty(j)){
            row[columns[j].index] = null;
         }
      }
      row[this._pkColumnIndex] = 'null';
      if(hierarchy){
         var hierarchyData = filter[hierarchy].hierarchy;
         if(hierarchyData){
            if(hierarchyData[0] === 'null'){
               hierarchyData[0] = null;
            }
            row[columns[hierarchy].index] = hierarchyData[0];
            row[columns[hierarchy + "@"].index] = hierarchyData[1];
            row[columns[hierarchy + "$"].index] = false;
         }
      }
      result.callback(new $ws.proto.Record({
         row : row,
         colDef : this._options.defaultColumns,
         parentRecordSet: this,
         pkValue: 'null'
      }));
      return result;
   },
   /**
    * Если id не задан - возвращает в колбэке новую "пустую" строку "из базы" (в рекордсет запись не вставляется)
    * иначе возвращет строку из базы по id
    * @param {String} id идентификатор запрашиваемой записи
    * @returns {$ws.proto.Deferred} асинхронное событие стреляет готовым рекордом
    */
   readRecord : function(id){
      if(id === undefined || this._pkIndex[id] === undefined || !this._hiddenData[this._pkIndex[id]]) {
         return this.createRecord();
      }
      var result = new $ws.proto.Deferred();
      result.callback(this._hiddenData[this._pkIndex[id]]);
      return result;
   },
   /**
    * @param {$ws.proto.Record} record
    * @returns {$ws.proto.Deferred|Boolean}
    */
   updateRecord: function(record){
      var tempKey = record.getKey(),
          result = new $ws.proto.Deferred();

      if(tempKey === 'null'){
         var key = 0;
         $ws.helpers.forEach(Object.keys(this._pkIndex), function(curKey) {
            var intCurKey = parseInt(curKey, 10) || 0;
            if (key < intCurKey) {
               key = intCurKey;
            }
         });
         record.setKey(tempKey = key+1, this._pkColumnIndex);
      }

      if(this._pkIndex[tempKey] !== undefined){
         this._hiddenData[this._pkIndex[tempKey]] = record;
      }
      else{
         this._hiddenData.push(record);
         this._pkIndex[tempKey] = this._hiddenData.length - 1;
      }
      if(this._options.hierarchyField){
         var parentId = record.get(this._options.hierarchyField);
         this._level[tempKey] = ((parentId !== undefined && this._level[parentId]) ? (this._level[parentId] + 1) : 0);
      }
      else{
         this._level[tempKey] = 0;
      }
      this._notify('onRecordUpdated', record);

      result.callback(tempKey);

      return result;
   },
   /**
    * Ничего не делаем
    */
   addPkIndex: function(){
   },
   /**
    * Удаляет запись с указанным ключом, извещает об удалении
    * @param {String|Number} key Первичный ключ указанной записи
    * @returns {Boolean} Нашлась ли запись
    * @private
    */
   _deleteRecord: function(key){
      var pkIndex = this._pkIndex[key],
          record, i, l, deletedRecord, keys, k;
      if(pkIndex !== undefined && pkIndex !== null){
         deletedRecord = this._hiddenData[pkIndex];
         keys = Object.keys(this._pkIndex);
         for(i = 0, l = keys.length; i < l; i++) {
            k = keys[i];
            if (this._pkIndex[k] > pkIndex) {
               this._pkIndex[k]--;
            }
         }
         this._hiddenData.splice(pkIndex, 1);
         delete this._level[key];
         delete this._pkIndex[key];
         for(i = 0; i < this._data.length; ++i){
            record = this.at(i);
            if(record && record.getKey() == key){
               this._data.splice(i, 1);
               break;
            }
         }
         this._isChanged = true;
         this._notify('onRecordDeleted', key + '', deletedRecord);
         return true;
      }
      return false;
   },

   /**
    * Очистка всех записей, parent которых - указанный, а также всех зависимых от них и т д
    * Возвращает массив с ключами удалённых записей
    * @param {String} pId Парент очищаемых записей
    */
   clearNode: function(pId){
      if(this._pkIndex[pId] === undefined){
         return [];
      }
      var arrToClear=this.recordChilds(pId);
      for (var i = 0; i<arrToClear.length; i++){
         this._deleteRecord(arrToClear[i]);
      }
      var tempData = this._hiddenData;
      this._hiddenData = [];
      for(var j = 0, len2 = tempData.length; j < len2; ++j){
         if(tempData[j]){
            this._hiddenData.push(tempData[j]);
         }
      }
      this._refreshPkIndex();
      return arrToClear;
   },
   /**
    * Удалить запись (как из набора так и из внешнего источника)
    * @param {String|Number} key первичный ключ записи, которую необходимо удалить
    * @return {$ws.proto.Deferred}
    */
   deleteRecord: function(key){
      var result = new $ws.proto.Deferred();
      try{
         this._deleteRecord(key);
         result.callback(key);
      } catch(e){
         result.errback(e);
      }
      return result;
   },
   /**
    * Удаляет массив записей с указанными ключами
    * @param {Array} keys Массив с ключами записей
    */
   deleteRecords: function(keys){
      for(var i = 0, len = keys.length; i < len; ++i){
         this._deleteRecord(keys[i]);
      }
   },
   /**
    * Загружает нужный узел (для иерархии)
    * @param {Number|Array}   id             идентификатор нужного узла или массив с ними ('Выборка')
    * @param {Boolean}        clear          очищать ли рекордсет
    * @param {Boolean}        pageNum        грузить ли следующую страницу или 0
    * @param {Boolean}        expand         загружать ли с разворотом
    */
   loadNode: function(id, clear, pageNum, expand, shadow, options){
      this._parentNode = id;
      this._pageNum = (pageNum ? pageNum : 0);
      this._notify('onPageChange', this._pageNum);
      this._expand = expand;
      var info = this._createLoadingInfo(options);
      this._beginLoad(undefined, clear, info);
      return info.deferred;
   },
   /**
    * Возвращает общее число записей
    * @returns {Number}
    */
   hasNextPage: function(){
      var self = this,
         getFullCount = function(){
         var result = 0,
            filter = self._options.filter;
         for(var i = 0, len = self._hiddenData.length; i < len; ++i){
            if(self._hiddenData[i] && (!filter || filter(self._hiddenData[i], self._options.filterParams))){
               ++result;
            }
         }
         return result;
      };
      if(this._usePages === 'parts'){
         return getFullCount() > (this._pageNum + 1) * this._options.rowsPerPage;
      }
      return getFullCount();
   },
   /**
    * Возвращает количество записей с учётом фильтрации
    * @returns {Number}
    */
   getRecordCount: function(){
      /*var result = 0;
      for(var i = 0, len = this._data.length; i < len; ++i){
         if(this._data[i]){
            ++result;
         }
      }*/
      return this._data.length;
   },
   /**
    * Создаёт запись из данных
    * @param {Object} rowData Набор данных вида ключ-значение
    * @param {Number} index Номер добавляемой записи
    * @return {$ws.proto.Record}
    * @private
    */
   _recordFromData: function(rowData, index){
      var columns = this._columns,
         row = [];
      for(var i in columns){
         if(columns.hasOwnProperty(i)){
            var value;
            if(i in rowData){
               value = rowData[i];
            }
            else if(columns[i].index === this._pkColumnIndex){
               value = this._hiddenData.length + index;
            }
            else{
               value = null;
            }
            row[columns[i].index] = value;
         }
      }

      this._pkIndex[row[this._pkColumnIndex]] = this._hiddenData.length + index;
      return new $ws.proto.Record({
         colDef: columns,
         row : row,
         pkValue : row[this._pkColumnIndex],
         parentRecordSet : this
      });
   },
   /**
    * Производит действия, необходимые для импорта записи в рекордсет. Дополнительно проставляет ключ, если его нет
    * @param {$ws.proto.Record} record Запись, которую импортируют
    * @private
    */
   _importRecord: function(record){
      $ws.proto.RecordSetStatic.superclass._importRecord.apply(this, arguments);
      if(record.getKey() === undefined){
         record.setKey(this._hiddenData.length, this._pkColumnIndex)
      }
   },
   /**
    * Начинает пакетную обработку добавления записей в рекордсет
    */
   beginBatchAppend: function(){
      this._pocketAppending = true;
   },
   /**
    * Заканчивает пакетную обработку добавления записей в рекордсет
    */
   endBatchAppend: function(){
      if (this._pocketAppending === true){
         this._pocketAppending = false;
         this._rebuild();
         this._beginLoad();
      } else {
         $ws.single.ioc.resolve('ILogger').log("RecordSet:endBatchAppend", "Попытка завершить пакетную обработку, которая не начиналась. Используйте beginBatchAppend до appendRecord.");
      }
   },
   /**
    * Добавляет запись или массив записей из данных вида ключ-значение
    * @param {Array|Object|$ws.proto.Record} data Данные
    * @return {$ws.proto.Record}
    */
   appendRecord: function(data){
      var isArray = (data instanceof Array);
      if (isArray === true){
         this.beginBatchAppend();
      } else {
         data = [data];
      }
      data = $ws.helpers.map(data, function(record) {
         if (!(record instanceof $ws.proto.Record)) {
            record = this._recordFromData(record, 0);
         } else {
            this._importRecord(record);
         }
         return record;
      }, this);
      this.addRecords(data);
      if (isArray === true){
         this.endBatchAppend();
         return data;
      } else{
         return data[0];
      }
   },
   at: function(idx){
      return this._data[idx];
   },
   /**
    * Добавляет в рекордсет новые записи
    * @param {Array} data Массив хэш-мэпов ключ-значение для новых записей
    * @returns {Array} Массив получившихся записей
    */
   appendData: function(data){
      var records = [];
      for(var j = 0, len = data.length; j < len; ++j){
         records.push(this._recordFromData(data[j], j));
      }
      this.addRecords(records);
      return records;
   },
   /**
    * Вставляет запись после записи с указанным ключом. Если записи с указанным ключом не будет существовать, вставит в начало рекордсета
    * @param {String} key Ключ
    * @param {$ws.proto.Record} record Запись, которую нужно вставить в рекордсет
    * @return {$ws.proto.Record}
    */
   insertAfter: function(key, record){
      var pkIndex = this._pkIndex[key];
      if(pkIndex !== undefined && pkIndex !== null){
         this._hiddenData.splice(pkIndex + 1, 0, record);
      }
      else{
         this._hiddenData.unshift(record);
      }
      this._rebuild();
      this._beginLoad();
      return record;
   },
   /**
    * Уничтожает все записи
    */
   clear: function(){
      this._hiddenData = [];
      this._rebuild();
   },
   /**
    * Возврвщает все записи из рекордсета
    * @return {Array}
    */
   getRecords: function(){
      return this._data;
   },
   /**
    * Возвращает дочерние узлы записи с указанным идентификатором
    * @param {String} key Ключ записи
    * @return {Array}
    */
   recordChilds: function(key){
      var result = [];
      for(var i = 0, len = this._hiddenData.length; i < len; ++i){
         if(this._hiddenData[i] && this._hiddenData[i].get(this._options.hierarchyField) == key){
            result.push(this._hiddenData[i].getKey());
         }
      }
      return result;
   },
   /**
    * Прерывает загрузку рекордсета
    */
   abort: function(){
      this._notify('onAbort');
   },
   /**
    * Перестраивает внутри себя иерархические данные
    * @private
    */
   _buildHierarchyData: function(){
   },
   /**
    * Удаляет запись, альтернативный способ (оставлен для совместимости)
    * @param {String|Number} key Первичный ключ записи
    */
   clearRecord: function(key){
      this._deleteRecord(key);
   },
   /**
    * Сериализует рекордсет
    * @returns {{s: Array, d: Array}}
    */
   toJSON: function(){
      var retval = {"s": [], "d": []};
      this.each(function(record, idx){
         if(idx === 0){
            var dataRow = record.toJSON();
            retval.s = dataRow.s;
            retval.d.push(dataRow.d);
         } else
            retval.d.push(record.getDataRow());
      });
      return retval;
   },
   /**
    * Считает итоги по колонке
    * @param {String} field Название колонки
    * @return {Number}
    * @private
    */
   _calcResults: function(field){
      var sum = 0;
      this.each(function(record){
         if(record.hasColumn(field)){
            sum += record.get(field);
         }
      });
      return sum;
   },
   /**
    * Возвращает запись с "итогами"
    * @return {$ws.proto.Record}
    */
   getResults: function(){
      var columns = this.getColumns(),
         row = [];
      for(var i in columns){
         if(columns.hasOwnProperty(i)){
            var column = columns[i],
               type = column.type;
            if(type === $ws.proto.Record.FIELD_TYPE_MONEY || type === $ws.proto.Record.FIELD_TYPE_INTEGER ||
               type === $ws.proto.Record.FIELD_TYPE_DOUBLE){
               row[column.index] = this._calcResults(column.title);
            }
         }
      }
      return new $ws.proto.Record({
         row: row,
         colDef: columns
      });
   }
});

/**
 * @class $ws.proto.Record
 */
$ws.proto.Record = (/** @lends $ws.proto.Record.prototype */function(){

   var COMPLEX_TYPES = {
      "Флаги": true,
      "Перечисляемое": true,
      "Связь": true,
      "Массив": true,
      "Иерархия": true
   };

   /**
    * @event onFieldChange При изменени полей записи
    * Событие, возникающее при изменени полей в записи. Возникает при успешном методе {@link set} или при {@link rollback}.
    * Не вызывается если массив изменившихся полей пуст.
    * @param {$ws.proto.EventObject} eventObject Дескриптор события
    * @param {Array} fields Список изменившихся полей
    * @example
    * <pre>
    * var
    *    record = new $ws.proto.Record({});
    *    record.addColumn('v', $ws.proto.Record.FIELD_TYPE_TEXT);
    *    record.addColumn('s', $ws.proto.Record.FIELD_TYPE_TEXT);
    *    record.subscribe('onFieldChange', function(eventObject, fields){
    *    var text = '';
    *    text += 'Количество изменившихся полей: ' + fields.length + '.\n';
    *    for(var i=0; i< fields.length; ++i) {
    *       text +=  '   ' + fields[i] + ': "' + this.get(fields[i]) + '".\n';
    *    }
    *    $ws.helpers.alert(text);
    * });
    * record.set('v', 'Some text.');
    * record.set('s', 'Some other text.');
    * record.rollback();
    * </pre>
    * @see set
    * @see rollback
    */
   /**
    * @cfg {Array} Массив данных, соответствующий этой записи
    * @name $ws.proto.Record#row
    */
   /**
    * @cfg {Object} Массив описания колонок
    * @name $ws.proto.Record#colDef
    */
   /**
    * @cfg {$ws.proto.RecordSet} Набор записей, от которого получена эта строка
    * @name $ws.proto.Record#parentRecordSet
    */
   /**
    * @cfg {Number} Значение первичного ключа, соответствующего этой строке
    * @name $ws.proto.Record#pkValue
    */
   /**
    * @alias $ws.proto.Record
    */
   function Record(cfg) {
      this._objectName = '';
      this._primaryColumnName = '';
      this._row = [];
      this._colDef = [];
      this._parentRecordSet = null;
      this._pkValue = undefined;
      this._columnIndex = {};
      this._changedFields = [];
      this._forGetValues = [];
      this._settedValues = [];
      this._columnNames = null;
      this._hasSetted = false;
      this._eventBusChannel = false;
      this._originalRow = false;


      if(cfg){
         if (Object.keys(cfg).length == 1 && cfg.primaryColumnName){
            this._primaryColumnName = cfg.primaryColumnName;
            return;
         }
         this._prepareData(cfg.row);
         this._colDef = cfg.colDef;
         this._parentRecordSet = cfg.parentRecordSet;
         this._pkValue = cfg.pkValue;
         this._parentId = cfg.parentId;
         this._objectName = cfg.objectName;
         //this.commit();
         // Если вдруг передали описание по старому формату, приведем его к новому
         if(!cfg.colDef || Object.prototype.toString.call(cfg.colDef) == "[object Object]"){
            var res = $ws.single.SerializatorSBIS.serializeData(this._row, this._colDef);
            this._colDef = res.s;
            this._row = [];
            var colName = "",
                  l = this._colDef.length,
                  i = 0;
            while(i < l){
               colName = this._colDef[i].n;
               this._addColumnIdx(colName, i);
               this._row.push(res.d[i]);
               i++;
            }
         } else {
            var cnt = this._colDef.length,
                  j = 0;
            while(j < cnt){
               this._addColumnIdx(this._colDef[j].n, j);
               j++;
            }
         }
      }
   }

   Record.prototype._addColumnIdx = function(colName, index){
      this._columnIndex[colName] = index;
   };
   /**
    * Редьюсер для получения сериализованной записи только с измененными колоноками
    * TODO Не надо ли его сделать именованной функцией НЕ в прототипе
    * @private
    */
   Record.prototype._onlyChangedFields = function(memo, colDef, colIdx) {
      if(colDef.n in memo.changed) {
         memo.s.push(colDef);
         memo.d.push(this._row[colIdx]);
      }
      return memo;
   };

   /**
    * При сохранении только измененных колонок, добавляет все колонки, отвечающие за иерархию в набор измененных
    * @private
    */
   Record.prototype._addHierarchyColumnsToChanged = function(changes) {
      $ws.helpers.reduce(this._colDef, function(memo, field){
         if (field.s == $ws.proto.Record.FIELD_TYPE_HIERARCHY) {
            memo[field.n] = 1;
         }
         return memo;
      }, changes);
   };
   Record.prototype._addKeyColumnToChanged = function(changes) {
      var keyColumnIndex;

      keyColumnIndex = this._parentRecordSet && this._parentRecordSet._pkColumnIndex || 0;

      if (keyColumnIndex < 0) {
         keyColumnIndex = 0;
      }

      changes[this._colDef[keyColumnIndex].n] = 1;
   },
   /**
    * Сериализует запись в формат, пригодны для конвертации в JSON
    * FIXME: сейчас toJSON() приводит де-факто к commit(), что не верно
    * @param {Object} [options]
    * @param {Boolean} [options.diffOnly=false] Только измененные колонки
    * @returns {*}
    */
   Record.prototype.toJSON = function(options){
      var result, changes;
      this._originalRow = Array.clone(this._row);
      // Обновление только измененных полей доступно только тогда, когда у записи есть ключ
      if (options && options.diffOnly && this.getKey()) {
         changes = this.getChangedColumns();
         this._addKeyColumnToChanged(changes);
         // Всегда должны присутствовать в отправляемом наборе все колонки иерархии
         this._addHierarchyColumnsToChanged(changes);
         this.prepareToSerialize();
         result = $ws.helpers.reduce(this._colDef, this._onlyChangedFields, {
            changed: changes,
            s: [],
            d: [],
            _type: 'record',
            _key: this.getKey()
         }, this);
         delete result.changed;
         return result;
      } else {
         this.prepareToSerialize();
         return {
            s : this._colDef,
            d : this._row,
            _key: this.getKey(),
            _type: 'record'
         };
      }
   };
   Record.prototype.isBranch = function(){
      var hierField = this._parentRecordSet.getHierarchyField();
      if(hierField){
         return this.get(hierField + "@");
      }
   };
   Record.prototype.hasChildren = function(){
      var hierField = this._parentRecordSet.getHierarchyField();
      if(hierField){
         return this.get(hierField + "$");
      }
   };
   Record.prototype.getParentKey = function(){
      var hierField = this._parentRecordSet.getHierarchyField();
      if(hierField){
         return this.get(hierField);
      }
   };
   Record.prototype._prepareData = function(row){
      this._row = row;
   },
   /**
    * Создание строки начальных значений
    * @param {Array} row
    * @returns {Array}
    */
   Record.prototype._createOriginalRow = function(row){
      var originalRow = [];
      for (var i = 0, l = row.length; i < l; i++){
         var element = row[i];
         if ($ws.helpers.hasFunctionProperty(element, 'valueOf')) {
            element = element.valueOf();
         }
         originalRow[i] = element instanceof Array ? $ws.core.clone(element): element;
      }
      return originalRow;
   },
   /**
    * Копирует запись
    * @param {Boolean} [attached] Определяет, будет ли привязана к рекордсету
    * @returns {$ws.proto.Record} Клон текущей записи.
    */
   Record.prototype.cloneRecord = function(attached) {
      this.prepareToSerialize();
      var config = {
         row: Array.clone(this._row), // Отдаем копию данных, чтобы при изменении клонированной записи наша не изменилась
         colDef: this._colDef,
         pkValue: this._getKeyValue(),
         objectName: this._objectName,
         parentRecordSet: null
      };
      if(attached || attached === undefined){
         config.parentRecordSet = this._parentRecordSet;
      } else
         config.colDef = config.colDef.slice();
      return new $ws.proto.Record(config);
   },
   /**
    * Добавляем колонку в запись
    *
    * @param {String} name Название колонки
    * @param {String} type Тип колонки
    * Допустимые типы колонк описаны в следующих константах:
    * $ws.proto.Record.FIELD_TYPE_QUERY - Выборка
    * $ws.proto.Record.FIELD_TYPE_RECORD - Запись
    * $ws.proto.Record.FIELD_TYPE_INTEGER - Число целое
    * $ws.proto.Record.FIELD_TYPE_STRING - Строка
    * $ws.proto.Record.FIELD_TYPE_TEXT - Текст
    * $ws.proto.Record.FIELD_TYPE_DOUBLE - Число вещественное
    * $ws.proto.Record.FIELD_TYPE_MONEY - Деньги
    * $ws.proto.Record.FIELD_TYPE_DATE - Дата
    * $ws.proto.Record.FIELD_TYPE_DATETIME - Дата и время
    * $ws.proto.Record.FIELD_TYPE_TIME - Время
    * $ws.proto.Record.FIELD_TYPE_ARRAY - Массив - третьим аргументом вызова указать тип массива
    * $ws.proto.Record.FIELD_TYPE_BOOLEAN
    * $ws.proto.Record.FIELD_TYPE_ENUM - Перечисляемое - третьим аргументом вызова указать структуру перечисляемого
    * $ws.proto.Record.FIELD_TYPE_FLAGS - Флаги
    * $ws.proro.Record.FIELD_TYPE_LINK - Связь, третьим аргументом передается имя таблицы
    * $ws.proto.Record.FIELD_TYPE_BINARY - Двоичные данные
    * $ws.proto.Record.FIELD_TYPE_UUID - UUID
    * $ws.proto.Record.FIELD_TYPE_RPCFILE - Файл-rpc
    * @param {String} [details] дополнительные сведения о типе колонки
    * @param {Boolean} [fromRecordSet] Вызов из рекордсета, только добавить индекс новой колонки
    * @param {Boolean} [colsCfg] Описание колонки для добавления в запись, на случай если колонки записи не смотрят на колонки рекордсета
    * @returns {Boolean} Добавлена ли колонка
    */
   Record.prototype.addColumn = function(name, type, details, fromRecordSet, colsCfg) {
      var additionalName = ["", "@", "$"],
            i, l;
      if(this._parentRecordSet instanceof $ws.proto.RecordSet && this._parentRecordSet.contains(this.getKey())){
         if(fromRecordSet === true){
            if(colsCfg){
               for(i = 0, l = colsCfg.length; i < l; i++){
                  this._addColumnIdx(name + additionalName[i], this._row.length);
                  if(this._colDef[this._columnIndex[name] + additionalName[i]] === undefined)
                     this._colDef.push(colsCfg[i]);
               }
               this._columnNames = null;
            } else
               this._addColumnIdx(name, this._row.length);
         } else
            throw new Error("Record:addColumn - Нельзя изменять набор колонок в записи выборки.");
      } else if(!this.hasColumn(name)){
         var config = $ws.single.SerializatorSBIS.getColumnConfigByType(name, type, details);
         if(config !== false){
            for(i = 0, l = config.cols.length; i < l; i++){
               this._colDef.push(config.cols[i]);
               this._addColumnIdx(name + additionalName[i], this._row.length);
               this._row.push(config.data[i]);
            }
            this._columnNames = null;
            return true;
         }
      }
      return false;
   },
   /**
    * Удаляет колонку
    * @param {String} name Имя колонки, которую надо удалить
    * @param {Boolean} fromRecordSet Вызов из рекордсета
    * @returns {Boolean} удалена колонка, или нет
    */
   Record.prototype.removeColumn = function(name, fromRecordSet) {
      if(this._parentRecordSet instanceof $ws.proto.RecordSet && fromRecordSet !== true && this._parentRecordSet.contains(this.getKey()))
         throw new Error("Record:removeColumn - Нельзя изменять набор колонок в записи выборки.");
      else {
         if(this.hasColumn(name)) {
            var idx = this.getColumnIdx(name);
            for(var colName in this._columnIndex) {
               if(this._columnIndex.hasOwnProperty(colName) && this._columnIndex[colName] > idx){
                  this._columnIndex[colName]--;
               }
            }
            delete this._columnIndex[name];
            this._changedFields.splice(idx, 1);
            this._forGetValues.splice(idx, 1);
            this._settedValues.splice(idx, 1);
            if(fromRecordSet !== true){
               this._row.splice(idx, 1);
               this._colDef.splice(idx, 1);
               this._columnNames = null;
            }
            return true;
         } else
            return false;
      }
   };

   Record.prototype.getDataRow = function(){
      this.prepareToSerialize();
      return this._row;
   };

   /**
    * Возвращает строку в виде объекта
    * @returns {Object}
    */
   Record.prototype.toObject = function(recursive){
      var colDef,
            retval = {},
            l = this._colDef.length,
            i = 0;
      while(i < l){
         colDef = this._colDef[i];
         retval[colDef.n] = this.get(colDef.n);
         if (recursive === true && retval[colDef.n] && retval[colDef.n].toObject) {
            retval[colDef.n] = retval[colDef.n].toObject();
         }
         i++;
      }
      return retval;
   };

   /**
    * @returns {Array} Массив имен имеющихся в записи колонок
    */
   Record.prototype.getColumns = function(){
      var i = 0, l;

      if (!this._columnNames) {
         this._columnNames = [];
         l = this._colDef.length;
         while(i < l){
            this._columnNames.push(this._colDef[i].n);
            i++;
         }
      }

      return this._columnNames;
   };

   /**
    * Возвращает запись в виде массива
    * @returns {Array}
    */
   Record.prototype.toArray = function(){
      var colDef,
            retval = [],
            l = this._colDef.length,
            i = 0;
      while(i < l){
         colDef = this._colDef[i];
         retval.push(this.get(colDef.n));
         i++;
      }
      return retval;
   };

   /**
    * Возвращает индекс колонки по ее имени
    * @param {String} columnName имя колонки
    * @returns {Number}
    */
   Record.prototype.getColumnIdx = function(columnName){
      if(columnName in this._columnIndex)
         return this._columnIndex[columnName];
      else
         throw new TypeError("Column " + columnName + " is not defined");
   };

   /**
    * Возвращает тип колонки по ее имени
    * @param {String} columnName имя колонки
    * @returns {String}
    */
   Record.prototype.getColumnType = function(columnName){
      return this._getColumnTypeByIndex(this.getColumnIdx(columnName));
   };

   /**
    * Возвращает данные о колонке по ее имени
    * @param {String} columnName имя колонки
    * @returns {Object}
    */
   Record.prototype.getColumnDefinition = function(columnName){
      var idx = this.getColumnIdx(columnName),
            colDef = {},
            type;
      colDef["title"] = this._colDef[idx].n;
      colDef["index"] = idx;
      type = this._colDef[idx].t;
      if(typeof(type) == 'object'){
         colDef["type"] = type.n;
         switch(type.n) {
            case "Флаги":
            case "Перечисляемое":
               colDef["s"] = type.s;
               break;
            case "Связь":
               colDef["table"] = type.t;
               break;
            case "Массив":
               colDef["arrayType"] = type.t;
               break;
            default:
               break;
         }
      }  else {
         colDef["type"] = type;
         if(this._colDef[idx].s == "Иерархия")
            colDef["s"] = "Иерархия";
      }
      return colDef;
   };

   /**
    * Позволяет выяснить, присутствует ли указанная колонка в данной записи
    *
    * @param {String} columnName колонка
    * @returns {Boolean} присутствует или нет указанная колонка в данной записи
    */
   Record.prototype.hasColumn = function(columnName){
      return columnName in this._columnIndex;
   };

   /**
    * @returns {$ws.proto.RecordSet}
    */
   Record.prototype.getRecordSet = function(){
      return this._parentRecordSet;
   };

   /**
    * Устанавливает recordSet для записи
    * @param {$ws.proto.RecordSet} recordSet Рекордсет, к которому должна обращаться запись
    * @param {boolean} useForce если true переопределит родительский рекордсет в любом случае
    */
   Record.prototype.setRecordSet = function(recordSet, useForce){
      if(recordSet != this._parentRecordSet && useForce) // если меняют родительский рекордсет, то сохраним в записи лишь копию колонок, а не ссылку на них
         this._colDef = this._colDef.slice();
      if(!this._parentRecordSet || useForce){
         this._parentRecordSet = recordSet;
      }
   };

   /*
    * Получаем значение столбца, отвечающего за первичный ключ.
    */
   Record.prototype._getKeyValue = function(){
      if (!this._primaryColumnName) {
         return this._pkValue;
      }
      return this._row[this.getColumnIdx(this._primaryColumnName)];
   };

   /**
    * Получает первичный ключ записи
    * @returns {String|Number} первичный ключ записи
    */
   Record.prototype.getKey = function(){
      var curKey = this._getKeyValue();
      if(typeof curKey == 'number' || (typeof curKey == 'string' && curKey.indexOf($ws._const.IDENTITY_SPLITTER) == -1)) {
         if(this._objectName)
            return (curKey + $ws._const.IDENTITY_SPLITTER + this._objectName);
      }
      return curKey;
   };

   /**
    * Получает первичный ключ записи со сложным идентификатором
    * @returns {Object} объект состоящий из имени объекта БЛ и его Ид
    */
   Record.prototype.getComplexKey = function() {
      return $ws.helpers.parseComplexKey(this.getKey());
   };

   Record.prototype._importValueForGet = function(value, type, typeConf){
      switch(type) {
         case $ws.proto.Record.FIELD_TYPE_DATE:
         case $ws.proto.Record.FIELD_TYPE_DATETIME:
         case $ws.proto.Record.FIELD_TYPE_TIME:
            var date = Date.fromSQL(value),
                  serializeMode;
            switch(type) {
               case "Дата и время":
                  serializeMode = true;
                  break;
               case "Время":
                  serializeMode = false;
                  break;
            }
            date.setSQLSerializationMode(serializeMode);
            return date;
         case $ws.proto.Record.FIELD_TYPE_IDENTITY:
            return $ws.helpers.parseIdentity(value);
         case $ws.proto.Record.FIELD_TYPE_ENUM:
            return new $ws.proto.Enum({
               availableValues: typeConf.s,
               currentValue: value
            });
         case $ws.proto.Record.FIELD_TYPE_FLAGS:
            var st = {},
                  pairs = Object.sortedPairs(typeConf.s),
                  fData = [];
            for(var pI = 0, pL = pairs.keys.length; pI < pL; pI++) {
               st[pI] = {
                  type  : "Логическое",
                  title : pairs.values[pI],
                  index : pairs.keys[pI]
               };
               fData[pI] = value[pI];
            }
            return new $ws.proto.Record({
               row: fData,
               colDef: st,
               parentRecordSet: null,
               pkValue: null
            });
         case $ws.proto.Record.FIELD_TYPE_RECORD:
            if(value === null)
               return null;
            else
               return new $ws.proto.Record({
                  row: value.d,
                  colDef: value.s,
                  parentRecordSet: null,
                  pkValue: null
               });
         case $ws.proto.Record.FIELD_TYPE_QUERY:
            if(value === null)
               return null;
            else {
               return new $ws.proto.RecordSet({
                  readerParams: {
                     adapterType: 'TransportAdapterStatic',
                     adapterParams: {
                        data: {
                           d: value.d || [],
                           s: value.s || [],
                           r: value.r,
                           n: value.n,
                           p: value.p
                        }
                     }
                  }
               });
            }
         default:
            return value === undefined ? null : value;
      }
   };

   Record.prototype._importValueForSet = function(value, type){
      switch(type) {
         case $ws.proto.Record.FIELD_TYPE_DATE:
         case $ws.proto.Record.FIELD_TYPE_DATETIME:
         case $ws.proto.Record.FIELD_TYPE_TIME:
            var serializeMode;
            switch(type) {
               case "Дата и время":
                  serializeMode = true;
                  break;
               case "Время":
                  serializeMode = false;
                  break;
            }
            return value instanceof Date ? value.toSQL(serializeMode) : null;
         case $ws.proto.Record.FIELD_TYPE_INTEGER:
            return (typeof(value) == 'number') ? value : (isNaN(parseInt(value, 10)) ? null : parseInt(value, 10));
         case $ws.proto.Record.FIELD_TYPE_IDENTITY:
            return $ws.single.SerializatorSBIS.serializeHierarchyIdentity(value);
         case $ws.proto.Record.FIELD_TYPE_ENUM:
            if(value instanceof $ws.proto.Enum){
               var eV = value.getCurrentValue();
               return eV === null ? null : parseInt(eV, 10);
            } else
               return value;
         case $ws.proto.Record.FIELD_TYPE_FLAGS:
            if(value instanceof $ws.proto.Record){
               var s = {},
                     t = value.getColumns(),
                     dt = [];
               for (var x = 0, l = t.length; x < l; x++){
                  s[value.getColumnIdx(t[x])] = t[x];
               }
               var sorted = Object.sortedPairs(s),
                     rO = value.toObject();
               for(var y = 0, ly = sorted.keys.length; y < ly; y++) {
                  dt.push(rO[sorted.values[y]]);
               }
               return dt;
            } else if(value instanceof Array) {
               return value;
            } else {
               return null;
            }
         case $ws.proto.Record.FIELD_TYPE_RECORD:
         case $ws.proto.Record.FIELD_TYPE_QUERY:
            if(value === null)
               return null;
            else if(value instanceof $ws.proto.Record || value instanceof $ws.proto.RecordSet)
               return value.toJSON();
            else
               return $ws.single.SerializatorSBIS.serialize(value);
         case $ws.proto.Record.FIELD_TYPE_STRING:
            return value === null ? null : value + "";
         case $ws.proto.Record.FIELD_TYPE_LINK:
            return value === null ? null : parseInt(value, 10);
         default:
            return value;
      }
   };

   /**
    * Получить значение до первого изменения
    * Возвращает значение столбца записи в состоянии до первого изменения
    * (т.е. то, которое получится при использовании rollback).
    *
    * Если изменений не было, то вернёт текущее значение колонки (результат работы get(columnName)).
    *
    * @param {String} columnName Имя колонки.
    * @return {*} Значение столбца записи в состоянии до первого изменения.
    * @throws TypeError Если колонка с заданным именем отсутствует в записи.
    * @see rollback
    * @see get
    */
   Record.prototype.getOriginal = function(columnName) {
      var
            idx = this._columnIndex[columnName],
            type,
            typeName,
            value;

      if (idx === undefined) {
         throw new TypeError("Column " + columnName + " is not defined");
      } else {
         type = this._colDef[idx].t;
         typeName = typeof(type) == 'object' ? type.n : type;
         value = this._row[idx];
         if(value !== null || typeName in {"Перечисляемое":0, "Запись":0, "Выборка":0}) {
            value = this._importValueForGet(value, typeName, type);
         }
         return value;
      }
   };

   /**
    * Возвращает значение столбца записи по имени столбца
    * @param {String} columnName имя колонки
    * @returns {Object}
    */
   Record.prototype.get = function(columnName){
      var idx = this._columnIndex[columnName],
            type, typeName,
            value;
      if(idx === undefined){
         throw new TypeError("Column " + columnName + " is not defined");
      } else {
         if(this._hasSetted && this._settedValues[idx] !== undefined){
            value = this._settedValues[idx];
         } else if(this._forGetValues[idx] !== undefined){
            type = this._colDef[idx].t;
            typeName = typeof(type) == 'object' ? type.n : type;
            value = this._forGetValues[idx];
         }
         if(value === undefined){
            type = this._colDef[idx].t;
            typeName = typeof(type) == 'object' ? type.n : type;
            value = this._row[idx];
            if(value !== null || typeName in {"Перечисляемое":0, "Запись":0, "Выборка":0})
               value = this._importValueForGet(value, typeName, type);
            this._forGetValues[idx] = value;
         }
         return value;
      }
   };

   /**
    * Сравнивает два значения
    * @param {*} value0 Первое значение
    * @param {*} value1 Второе значение
    * @return {Boolean}
    * @private
    */
   Record.prototype._isValueEqual = function(value0, value1){
      if(value0 === value1){
         return true;
      }
      if(value0 instanceof Array && value1 instanceof Array){
         if(value0.length === value1.length){
            for(var i = 0; i < value0.length; ++i){
               if(value0[i] !== value1[i]){
                  return false;
               }
            }
            return true;
         }
      }
      if(value0 && value0.equals && typeof(value0.equals) =='function') {
         return value0.equals(value1);
      }
      return false;
   };

   Record.prototype._setField = function(columnName, value) {
      var idx = this._columnIndex[columnName],
          isValueChanged = false;
      if(idx === undefined){
         throw new TypeError("Column " + columnName + " is not defined");
      } else if(value === undefined){
         throw new TypeError("Value for column " + columnName + " is not valid");
      } else {
         var type = this._colDef[idx].t,
             typeName = typeof(type) == 'object' ? type.n : type,
             v0, v1;

         if(this._settedValues[idx] === undefined) {
            v0 = this._importValueForSet(value, typeName);
            v1 = this._row[idx];
         } else{
            v0 = value;
            v1 = this._settedValues[idx];
         }
         // ToDo: выпилить этот кусок кода и поддержать сохранение формата в toSQL/fromSQL
         // http://youtrack.sbis.ru/issue/wi_sbis-322
         if(type == 'Дата и время' || type == 'Дата' || type == 'Время') {
            if(typeof v0 == 'string') {
               v0 = Date.fromSQL(v0);
            }
            if(typeof v1 == 'string') {
               v1 = Date.fromSQL(v1);
            }
         }
         if(!this._isValueEqual(v0, v1)) {
            isValueChanged = true;
         }
         if(isValueChanged){
            this._hasSetted = true;
            this._settedValues[idx] = value;
            //в взятых значениях значение уже не актуально, забудем про него
            this._forGetValues[idx] = undefined;
            // Если у нашей колонки тип идентификатор, то в конечном итоге он запишется он как массив,
            // По этому для проверки на изменение нам надо, при необходимости, привести к массиву.
            if (this.getColumnType(this._colDef[idx].n) == $ws.proto.Record.FIELD_TYPE_IDENTITY && !(value instanceof Array)) {
               value = $ws.single.SerializatorSBIS.serializeHierarchyIdentity(value);
            }
            // тут мы проверяем на ситуацию когда в _row было 1, потом положили 2, а потом снова 1
            // тогда не должно считаться, что запись поменялась
            this._changedFields[idx] = !this._isValueEqual(value, this._row[idx])
         }
      }
      return isValueChanged;
   };

   /*
    * устанавливает внутрь записи значение, непосредственно в _row
    * @returns {Boolean} успешно ли прошла установка значения
    */
   Record.prototype._setInnerField = function(columnName, value){
      try{
         var idx = this.getColumnIdx(columnName),
               type = this._colDef[idx].t,
               typeName = typeof(type) == 'object' ? type.n : type;
         value = this._importValueForSet(value, typeName);
         this._row[idx] = value;
         return true;
      }catch(e){}
      return false;
   };

   Record.prototype._getColumnTypeByIndex = function(idx){
      var type = this._colDef[idx].t;
      if(typeof(type) == "string")
         return type;
      else
         return type.n;
   };

   Record.prototype.prepareToSerialize = function(){
      var l = this._forGetValues.length,
            i = 0,
            self = this,
            natSort = function(a, b){
               a = parseInt(a, 10);
               b = parseInt(b, 10);
               return a < b ? -1 : 1;
            },
            field,
            type;
      while (i < l){
         if(this._forGetValues.hasOwnProperty(i)) {
            field = this._forGetValues[i];
            type = this._getColumnTypeByIndex(i);
            if(type == $ws.proto.Record.FIELD_TYPE_FLAGS && field instanceof $ws.proto.Record) {
               // Флаги нужно сложить строго по порядку индексов, поэтому и сортировка и т.п.
               this._row[i] = [];
               var sortedFlags = Object.keys(this._colDef[i].t.s).sort(natSort);
               $ws.helpers.forEach(sortedFlags, function(n, idx){
                  self._row[i][idx] = field.get(self._colDef[i].t.s[n]);
               });
            }
            else if(field instanceof $ws.proto.Record || field instanceof $ws.proto.RecordSet){
               this._row[i] = field.toJSON();
            }
            else if(field instanceof $ws.proto.Enum){
               var eV = field.getCurrentValue();
               this._row[i] = (eV === null ? null : parseInt(eV, 10));
            }
         }
         i++;
      }
      for(i = 0, l = this._colDef.length; i < l; ++i){
         type = this._colDef[i].t;
         if(type === $ws.proto.Record.FIELD_TYPE_IDENTITY && !(this._row[i] instanceof Array)){
            this._row[i] = [this._row[i]];
         }
      }
      l = this._settedValues.length;
      i = 0;
      while (i < l){
         if(this._settedValues[i] !== undefined)
            this._setInnerField(this._colDef[i].n, this._settedValues[i]);
         i++;
      }
   };

   /**
    * @returns {Array|null}
    * @private
    */
   Record.prototype._prepareChangedFields = function() {
      if(!this._eventBusChannel) {
         return null;
      }
      return Object.keys(this.getChangedColumns());
   };

   /**
    * Сообщить об изменившихся полях
    * Вызывает событие onFieldChange для записи если на него кто-то подписался.
    * @param {Array} fields Массив изменившихся полей
    * @protected
    */
   Record.prototype._notifyFieldsChanged = function(fields) {
      if(!this._eventBusChannel) {
         return;
      }
      if(!fields || !fields.length) {
         return;
      }
      this._eventBusChannel.notify('onFieldChange', fields);
   };

   /**
    * Добавить обработчик на событие.
    * Подписиывает делегата на указанное событие текущего объекта.
    * <wiTag group="Управление">
    * @param {String}   event    Имя события, на которое следует подписать обработчик.
    * @param {Function} handler  Функция-делегат, обработчик события.
    * @param {*}        [ctx]    Контекст выполнения
    * @returns {$ws.proto.Record} Возвращает себя
    */
   Record.prototype.subscribe = function(event, handler, ctx) {
      if(!this._eventBusChannel) {
         this._eventBusChannel = new $ws.proto.EventBusChannel();
         this._eventBusChannel.publish('onFieldChange');
      }
      if(ctx === undefined) {
         ctx = this;
      }
      this._eventBusChannel.subscribe(event, handler, ctx);
      return this;
   };

   /**
    * Снять подписку заданного обработчика с заданного события.
    * @param {String}   event    Имя события, на которое следует подписать обработчик.
    * @param {Function} handler  Функция-делегат, обработчик события.
    * @param {*}        [ctx]    Контекст выполнения
    * @returns {$ws.proto.Record} Возвращает себя
    */
   Record.prototype.unsubscribe = function(event, handler, ctx) {
      if(this._eventBusChannel) {
         this._eventBusChannel.unsubscribe(event, handler, ctx);
      }
      return this;
   };

   /**
    * Присваивает значение столбцу записи по имени столбца без изменений в базе
    * @param {String} columnName имя колонки
    * @param {Object} value значение
    * @see onFieldChange
    */
   Record.prototype.set = function(columnName, value){
      var
            self = this,
            changedFields = [],
            setFieldInner = function(key, value) {
               // меняем поле в записи
               if(self._setField(key, value)) {
                  // поле действительно изменилось изменилось
                  changedFields.push(key);
               }
            };
      // А вдруг кто-то передал объект
      if( typeof( columnName ) != 'object' ) {
         setFieldInner(columnName, value);
      } else {
         for(var key in columnName) {
            if(columnName.hasOwnProperty(key)) {
               setFieldInner(key, columnName[key]);
            }
         }
      }
      this._notifyFieldsChanged(changedFields);
   };

   /**
    * Возвращает название колонки, в которой лежит первичный ключ
    * @returns {String}
    */
   Record.prototype.getKeyField = function(){
      var index;
      if(this._parentRecordSet){
         index = this._parentRecordSet.getPkColumnIndex();
      }
      else{
         index = 0;
      }
      return this._colDef[index].n;
   };

   /**
    * Присваивает значение столбцу записи по имени столбца без изменений в базе
    * @param {Number} pkValue новое значение первичного ключа этой записи
    * @param {Number} [pkColumnIndex] номер колонки с первичным ключом у записи, хранится в рекордсете
    *
    */
   Record.prototype.setKey = function(pkValue, pkColumnIndex){
      var field = (pkColumnIndex === undefined ? this.getKeyField() : this._colDef[pkColumnIndex].n);
      if(field){
         this._setField(field, pkValue);
      }
      this._pkValue = pkValue;
      if(this._parentRecordSet){
         this._parentRecordSet.addPkIndex(pkValue);
      }
      if(!this._objectName)
         this._objectName = $ws.helpers.parseComplexKey(pkValue).objName;
   };

   /**
    * Удаляет запись из источника
    * @returns {$ws.proto.Deferred|Boolean}
    */
   Record.prototype.destroy = function(){
      var self = this;
      return this._parentRecordSet.deleteRecord([this._getKeyValue()]).addCallback(function(result){
         self.commit();
         return result;
      });
   };

   /**
    * Записывает текущее состояние записи в базу
    * @param {Object} [options] Опции, модифицирующие процедуру обновления
    * @param {Boolean} [options.consistencyCheck = false] Отслеживать целостность записи ?
    * @param {Boolean} [options.diffOnly = false] Сохранять только измененные поля
    * @returns {$ws.proto.Deferred}
    */
   Record.prototype.update = function(options){
      var self = this;

      if (options && options.diffOnly && this.getKey() && !this.isChanged()) {
         return new $ws.proto.Deferred().callback(this.getKey());
      }

      return this._parentRecordSet.updateRecord(this, options).addCallback(function(r){
         self.commit();
         return r;
      });
   };

   /**
    * Помечаем запись как неизменённую, без записи в базу, после вызова функции isChanged вернёт false
    * После этого rollback вернёт нас к этому зафиксированному состоянию
    * @param {Object} arguments Названия полей, по которым надо провести commit
    */
   Record.prototype.commit = function() {
      var fullRecord = (arguments.length > 0) ? false : true,
          l = (arguments.length > 0) ? arguments.length : this._forGetValues.length,
          i = 0,
          colDef, colType, idx;
      if (fullRecord){
         this._changedFields = [];
      }
      var tryCommit = function (fieldValue, i) {
         if (fieldValue !== undefined) {
            if ($ws.helpers.hasFunctionProperty(fieldValue, 'commit')) {
               fieldValue.commit();
            }
            colDef = this._colDef[i];
            colType = typeof(colDef.t) == 'string' ? colDef.t : colDef.t.n;
            if (!fullRecord){
               delete this._changedFields[i];
            }
            this._row[i] = this._importValueForSet(fieldValue, colType);
         }
      };
      while (i < l) {
         if (fullRecord) {
            tryCommit.apply(this, [this._forGetValues[i], i]);
         } else {
            idx = this.getColumnIdx(arguments[i]);
            tryCommit.apply(this, [this._forGetValues[idx], idx]);
         }
         i++;
      }
      l = (arguments.length > 0) ? arguments.length : this._settedValues.length;
      i = 0;
      while (i < l) {
         if (fullRecord) {
            tryCommit.apply(this, [this._settedValues[i], i]);
         } else {
            idx = this.getColumnIdx(arguments[i]);
            tryCommit.apply(this, [this._settedValues[idx], idx]);
         }
         i++;
      }
      if (fullRecord) {
         this._originalRow = undefined;
      }
   };
   /**
    * Если в идентификаторе связи нет разделителя и у нас задано имя объекта, добавим имя объекта
    * @param linkId Идентификатор связи
    * @return {*} Исправленные идентификатор связи
    * @private
    */
   Record.prototype._rewriteLinkId = function(linkId) {
      if(this._objectName) {
         if(("" + linkId).indexOf($ws._const.IDENTITY_SPLITTER) == -1) {
            linkId = linkId + $ws._const.IDENTITY_SPLITTER + this._objectName;
         }
      }
      return linkId;
   };

   /**
    * @param {Number} linkId
    * @param {String} linkName
    * @returns {$ws.proto.Deferred}
    */
   Record.prototype.updateLink = function(linkId, linkName) {
      var self = this;
      return this.readLink(this._rewriteLinkId(linkId), linkName).addCallback(function(spec){
         spec.each(function(col, val){
            try {
               self.set(col, val);
            } catch (e) { }
         });
         return spec;
      })
   };

   Record.prototype.readLink = function(linkId, linkName) {
      return this._parentRecordSet.readRecord(this._rewriteLinkId(linkId), undefined, linkName);
   };

   /**
    * Откат записи в состояние последнего update/rollback
    * @param {Object} arguments Названия полей, по которым необходимо провести rollback.
    * @see onFieldChange
    */
   Record.prototype.rollback = function(){
      var changedFields = this._prepareChangedFields();
      if (arguments.length === 0) {
         this._changedFields = [];
         this._settedValues = [];
         this._forGetValues = [];
         if (this._originalRow) {
            this._row = this._originalRow;
            this._originalRow = undefined;
         }
      } else {
         var args = Array.prototype.slice.call(arguments),
             idx, i, len;
         for (i = 0; i < args.length; i++) {
            idx = this.getColumnIdx(args[i]);
            delete this._changedFields[idx];
            delete this._settedValues[idx];
            delete this._forGetValues[idx];
         }
         changedFields = $ws.helpers.filter(changedFields, function(item){
            return (Array.indexOf(args, item) !== -1);
         });
      }
      this._notifyFieldsChanged(changedFields);
   };
   /**
    * Редьюсер для получения измененных колонок
    * TODO Не надо ли его сделать именованной функцией НЕ в прототипе
    * @private
    */
   Record.prototype._reduceChanged = function(memo, val, fld) {
      if (!!val) {
         memo[this._colDef[fld].n] = 1;
      }
      return memo;
   };

   /**
    * Редьюсер для получения измененных колонок
    * TODO Не надо ли его сделать именованной функцией НЕ в прототипе
    * @private
    */
   Record.prototype._reduceComplex = function(memo, value, fld) {
      if (value && typeof(value.isChanged) == 'function' && value.isChanged()) {
         memo[this._colDef[fld].n] = 1;
      }
      return memo;
   };

   /**
    * Отдает хэш-мэп имен измененных полей данной записи. В качестве ключа - название колонки, в качестве значения - 1
    * @returns {Object}
    */
   Record.prototype.getChangedColumns = function() {
      var changedFields = {};
      $ws.helpers.reduce(this._changedFields, this._reduceChanged, changedFields, this);
      $ws.helpers.reduce(this._settedValues, this._reduceComplex, changedFields, this);
      $ws.helpers.reduce(this._forGetValues, this._reduceComplex, changedFields, this);
      return changedFields;
   };

   /**
    * Позволяет выяснить, менялось ли содержимое записи с последнего update/rollback
    * @param {String} [fieldName] - имя поля. Если указан, то проверять только поле fieldName на изменение
    * @returns {Boolean}
    */
   Record.prototype.isChanged = function(fieldName) {
      var checkValue = function(value){
         if(value && typeof(value.isChanged) == 'function' && value.isChanged())
            return true;
         return false;
      };
      if(fieldName === undefined){
         for(var i = 0, l = this._changedFields.length; i < l; i++){
            if(this._changedFields[i])
               return true;
         }
         var check = function(values){
            for(var i = 0, l = values.length; i < l; i++){
               if(checkValue(values[i]))
                  return true;
            }
            return false;
         };
         if(check(this._settedValues))
            return true;
         if(check(this._forGetValues))
            return true;
         return false;
      }
      else{
         var idx = this.getColumnIdx(fieldName);
         if(this._changedFields[idx] === true)
            return true;
         if(checkValue(this._settedValues[idx]))
            return true;
         if(checkValue(this._forGetValues[idx]))
            return true;
         else
            return false;
      }
   };

   /**
    * Запускает перебор колонок записи
    *
    * @param {Function} f функция, вызываемая для каждой колонки.
    * В аргументах приходит имя колонки и ее значение
    * Если вернуть из функции false перебор остановится.
    */
   Record.prototype.each = function(f) {
      var l = this._colDef.length,
            colName;
      for (var i = 0; i < l; i++) {
         if(i in this._colDef) {
            colName = this._colDef[i].n;
            if(f.apply(this, [colName, this.get(colName)]) === false)
               return;
         }
      }
   };

   /**
    * Проверяет, совпадает ли переданный объект с данным
    * @param {$ws.proto.Record} other Запись, с которой сравниваем
    * @returns {Boolean}
    */
   Record.prototype.equals = function(other) {
      if(other instanceof $ws.proto.Record) {
         if( this.getColumns().length !== other.getColumns().length )
            return false;

         var result = true;
         this.each(function(colName, currentValue){
            if(!other.hasColumn(colName)) // no column - they are different
               return (result = false); // stop enumeration
            if(currentValue && currentValue.equals) { // complex type
               if(!currentValue.equals(other.get(colName))) // if not equals
                  return (result = false); // stop enumeration, they are different
            } else { // simple type
               if(currentValue !== other.get(colName)) // they are different
                  return (result = false); // stop enumeration
            }
         });
         return result;
      } else
         return false;
   };

   Record.FIELD_TYPE_QUERY = "Выборка";
   Record.FIELD_TYPE_RECORD = "Запись";
   Record.FIELD_TYPE_INTEGER = "Число целое";
   Record.FIELD_TYPE_STRING = "Строка";
   Record.FIELD_TYPE_TEXT = "Текст";
   Record.FIELD_TYPE_DOUBLE = "Число вещественное";
   Record.FIELD_TYPE_MONEY = "Деньги";
   Record.FIELD_TYPE_DATE = "Дата";
   Record.FIELD_TYPE_DATETIME = "Дата и время";
   Record.FIELD_TYPE_TIME = "Время";
   Record.FIELD_TYPE_ARRAY = "Массив";
   Record.FIELD_TYPE_BOOLEAN = "Логическое";
   Record.FIELD_TYPE_HIERARCHY = "Иерархия";
   Record.FIELD_TYPE_IDENTITY = "Идентификатор";
   Record.FIELD_TYPE_ENUM = "Перечисляемое";
   Record.FIELD_TYPE_FLAGS = "Флаги";
   Record.FIELD_TYPE_LINK = "Связь";
   Record.FIELD_TYPE_BINARY = "Двоичное";
   Record.FIELD_TYPE_UUID = "UUID";
   Record.FIELD_TYPE_RPCFILE = "Файл-rpc";

   return Record;

})();



/**
 * @class $ws.proto.ReaderAbstract
 * @extends $ws.proto.Abstract
 *
 * @cfgOld {String} adapterType тип используемого адаптера
 * @cfgOld {Object} adapterParams параметры адаптера
 * @cfgOld {String} format имя списочного метода
 *
 */
$ws.proto.ReaderAbstract = $ws.proto.Abstract.extend(/** @lends $ws.proto.ReaderAbstract.prototype*/{
   /**
    * @event onNewRecord событие, генерируемое для каждой прочитанной записи
    * @param {Object} eventObject описание в классе $ws.proto.Abstract
    * @param {Object} data Десериализованные данные для создания записи.
    */
   /**
    * @event onComplete событие, генерируемое при окончании перебора массива данных
    * @param {Object} eventObject описание в классе $ws.proto.Abstract
    * @param {Boolean} isSuccess успешно ли завершился перебор данных
    * @param {String} [error] ошибка, почему не удалось завершить построение
    */
   /**
    * @event onSettingsParsed событие, генерируемое при окончании разбора конфигурации полей
    * @param {Object} eventObject описание в классе $ws.proto.Abstract
    * @param {Object} columnsConfig конфигурация столбцов
    * @param {Number} pkColumnIndex номер столбца с первичным ключем
    */
   /**
    * @event onWayExists событие, сообщает о наличии пути в принятых данных
    * @param {Object} eventObject описание в классе $ws.proto.Abstract
    * @param {Object} way Путь
    */
   /**
    * @event onResults событие, сообщает о наличии итогов в принятых данных
    * @param {Object} eventObject описание в классе $ws.proto.Abstract
    * @param {Object} results Итоги
    */
   /**
    * @event onNextPageChange событие, сообщает о получении данных об общем числе записей / следующей странице
    * @param {Object} eventObject описание в классе $ws.proto.Abstract
    * @param {Object} nextPage Есть ли следующая страница или общее число записей
    */
   $protected: {
      _parser : null,
      _options: {
         parserType : 'ParserAbstract',
         adapterType: '',
         adapterParams: {}
      },
      _nullable: {
         format : undefined
      },
      _adapter: ''
   },
   $constructor: function(){
      var adapterType = this._options.adapterType;
      this._publish('onNewRecord', 'onSettingsParsed', 'onComplete', 'onWayExists', 'onResults', 'onNextPageChange');

      if (adapterType === '')
         throw new Error("Adapter type is not specified");
      if (!(adapterType in $ws.proto) || typeof($ws.proto[adapterType]) !== 'function')
         throw new Error("Adapter of wrong type specified");
   },
   getParser: function(){
      if (!this._parser) {
         this._parser = new $ws.proto[this._options.parserType](this._getParserCfg());
      }
      return this._parser;
   },
   _getParserCfg : function(){
      var
         self = this,
         handlers = {};

      for (var i = 0, l = EVENTS.length; i < l; i++){
         var name = EVENTS[i];
         handlers[name] = function(e){
            arguments[0] = e._eventName;
            self._notify.apply(self, arguments);
         };
      }
      return {handlers : handlers};
   },
   /**
    * @param [method]
    * @param [args]
    * @returns {$ws.proto.TransportAdapterAbstract}
    */
   getAdapter: function(method, args){
      if (this._adapter === '') {
         this._adapter = new $ws.proto[this._options.adapterType](this._options.adapterParams);
      }
      return this._adapter;
   },
   /**
    * Запускает процесс чтения данных из внешнего источника, возвращет deferred, в который придут результаты постраничного отображения
    * @param {Object} args
    * @param {Boolean} notColumnParse
    * @returns {$ws.proto.Deferred}
    */
   readRecords: function(args, notColumnParse){
      var self = this;
      return this.getAdapter().list(this._makeArgsForQuery(args))
         .addCallbacks(
                      function(data){
                         if (data){
                            self._notify('onNextPageChange', data.n);
                            self._onLoaderDone(data, notColumnParse);
                            return data;
                         }
                         else{
                            var e = new Error("Reader error : data is null");
                            self._notify('onComplete', false, e);
                            return e;
                         }
                      },
                      function(error){
                         self._notify('onComplete', false, error);
                         return error;
                      });
   },
   /**
    * Запускает запрос на создание новой строки в базе
    *
    * @param {Object} filter фильтр для создания новой записи
    * @param {String} methodName имя метода для получения формата
    * @return {$ws.proto.Deferred} Асинхронный результат. В нем
    * result.columns - колонки
    * result.row - строка данных
    * result.pk - значние Primary Key
    */
   createRecord: function(filter, methodName){
      var parser = this.getParser();
      return this.getAdapter()
            .create(this._makeArgsForCreate(filter,  methodName === undefined ? this._options.format : methodName))
            .addCallback(parser.readRecord.bind(parser));
   },
   /**
    * Запускает запрос на получение записи по id
    *
    * @param {Number} id идентификатор записи
    * @param {String} methodName имя метода для получения формата
    * @param {String} [linkName] имя вычитываемой связи
    * @return {$ws.proto.Deferred} Асинхронный результат. В нем
    * result.columns - колонки
    * result.row - строка данных
    * result.pk - значние Primary Key
    */
   readRecord: function(id, methodName, linkName){
      var parser = this.getParser();
      return this.getAdapter('read', arguments)
            .read(this._makeArgsForRead(id, methodName === undefined ? this._options.format : methodName, linkName))
            .addCallback(parser.readRecord.bind(parser));
   },
   /**
    * Запускает запрос на получение копии записи по id
    *
    * @param {Number|String} id идентификатор записи
    * @param {String} formatMethod Метод, определяющий формат записи для копирования
    * @return {$ws.proto.Deferred} Асинхронный результат. В нем
    * result.columns - колонки
    * result.row - строка данных
    * result.pk - значние Primary Key
    */
   copyRecord: function(id, formatMethod){
      var parser = this.getParser();
      return this.getAdapter('copy', arguments)
            .copy(this._makeArgsForCopy(id, formatMethod === undefined ? this._options.format : formatMethod))
            .addCallback(parser.readRecord.bind(parser));
   },
   /**
    * Удалить запись с указанным PK
    *
    * @param {Number|String} pk PK
    * @returns {$ws.proto.Deferred}
    */
   deleteRecord: function(pk){
      return this.getAdapter('destroy', arguments).destroy(this._makeArgsForDestroy(pk));
   },
   /**
    * Объединить записи с указанными PK
    *
    * @param {Number|String} mergeKey PK
    * @param {Number|String} recordKey PK
    * @returns {$ws.proto.Deferred}
    */
   mergeRecords: function(mergeKey, recordKey){
      return this.getAdapter('merge', arguments).merge(this._makeArgsForMergeRecords(mergeKey, recordKey));
   },
   /**
    * Обновить запись до указанных данных
    * В результрующем колбэке приходит праймари-ключ записи.
    * Ошибка извещается черезе errback
    *
    * @param {$ws.proto.Record} record
    * @param {Object} [options]
    * @returns {$ws.proto.Deferred}
    */
   updateRecord: function(record, options){
      return this.getAdapter('update', arguments).update(this._makeArgsForUpdate(record, options));
   },
   deleteRecordsByFilter: function(filter, methodName){
      return this.getAdapter('destroyByFilter', arguments).destroyByFilter(this._makeArgsForDestroyByFilter(filter, methodName));
   },
   /**
    * Обработчик события успешной загрузки данных
    * @param {Object} loadedData Данные полученные от лоадера
    * @param {Boolean} notColumnParse Флаг того, что не нужно парсить колонки
    */
   _onLoaderDone: function(loadedData, notColumnParse){
      var
            success = false,
            errorMessage;
      try{
         this.getParser().parseData(loadedData, notColumnParse);
         success = true;
      } catch(e){
         errorMessage = e.message;
         $ws.single.ioc.resolve('ILogger').error(
            "Reader",
            "Parser (" + this._options.parserType + ") parseData ends with error: " + errorMessage,
            e);
      }
      this._notify('onComplete', success, errorMessage, loadedData.e);
   },
   parseData: function(data, notColumnParse){
      //if(!notColumnParse || notColumnParse === undefined)
         this._columnsParser(data);
      if(data.p)
         this._notify('onWayExists', data.p);
      if(data.r)
         this._notify('onResults', this.readRecord(data.r));
      this._dataParser(data);
   },
   _columnsParser: function(data){
      var r = this._columnsParseFnc(data);
      this._notify('onSettingsParsed', this._transformColumns(r.settings), r.pk);
   },
   _columnsParseFnc: function(data){
      throw new Error("Method AbstractReader::_columnsParseFnc must be implemented");
   },
   _dataParser: function(data){
      throw new Error("Method AbstractReader::_dataParser must be implemented");
   },
   _makeArgsForQuery: function(args) {
      return args;
   },
   _makeArgsForCreate: function(filter, methodName){
      throw new Error("Method AbstractReader::_makeArgsForCreate must be implemented");
   },
   _makeArgsForDestroyByFilter: function(filter, methodName){
      throw new Error("Method AbstractReader::_makeArgsForDestroyByFilter must be implemented");
   },
   /**
    * Подготавливает хэш-мэп аргументов для операци объединения записей
    *
    * @param {Number} mergeKey
    * @param {Number} recordKey
    * @returns {Object}
    */
   _makeArgsForMergeRecords: function(mergeKey, recordKey){
      throw new Error("Method AbstractReader::_makeArgsForMergeRecords must be implemented");
   },
   /**
    * Подготавливает хэш-мэп аргументов для операци копирования записи
    *
    * @param {Number} key
    * @returns {Object}
    */
   _makeArgsForCopy: function(key, formatMethod){
      throw new Error("Method AbstractReader::_makeArgsForCopy must be implemented");
   },
   /**
    * Подготавливает хэш-мэп аргументов для операци удаления
    *
    * @param {Number} pk
    * @returns {Object}
    */
   _makeArgsForDestroy: function(pk){
      throw new Error("Method AbstractReader::_makeArgsForDestroy must be implemented");
   },
   /**
    * Подготавливает хэш-мэп аргументов для операции обновления
    *
    * @param {$ws.proto.Record} record
    * @param {Object} options
    * @returns {Object}
    */
   _makeArgsForUpdate: function(record, options){
      throw new Error("Method AbstractReader::_makeArgsForUpdate must be implemented");
   },
   _makeArgsForRead: function(pk, methodName, linkName){
      throw new Error("Method AbstractReader::_makeArgsForRead must be implemented");
   },
   /**
    * Прерывает загрузку
    */
   abort: function(){
      this.getAdapter().abort();
   }
});

/**
 * Класс-читатель формата "Выборка СБиС"
 *
 * @class $ws.proto.ReaderSBIS
 * @extends $ws.proto.ReaderAbstract
 *
 * @cfgOld {String} linkedObject Связанный объект выборки
 * @cfgOld {String} pkName Имя первичного ключа
 */
$ws.proto.ReaderSBIS = $ws.proto.ReaderAbstract.extend(/** @lends $ws.proto.ReaderSBIS.prototype */{
   $protected: {
      _pkColumnName: 'pk',
      _options: {
         parserType : 'ParserSBIS',
         linkedObject: '',
         pkName : 'id'
      }
   },
   $constructor: function(){
      this._publish('onNewData');
      this.getParser().subscribe('onDataParsed', this._onDataParsed.bind(this));
   },
   /**
    * Извлекает простой ключ (числовой) из (возможно) переданного сложного вида ID,Object
    * @param {String|Number} key
    * @returns {Number}
    */
   _extractPlainKey: function(key) {
      var parsedKey = $ws.helpers.parseComplexKey(key).objKey;
      var keyAsNumber = Number(parsedKey);
      return isNaN(keyAsNumber) ? key : keyAsNumber;
   },
   _extractObjectName: function(key) {
      return $ws.helpers.parseComplexKey(key).objName;
   },
   _prepareFilter: function(filter) {
      return $ws.helpers.prepareFilter(filter);
   },
   /**
    * Делает из объекта фильтр вида {d[] s[]}, чтобы можно было хорошо отдать БЛ
    * @param filter
    * @return {*}
    */
   prepareFilter: function (filter){
      return $ws.helpers.prepareFilter(filter);
   },
   _prepareSorting: function(filter){
      return $ws.helpers.prepareSorting(filter);
   },
   _prepareNavigation: function(filter){
      if(!filter || filter['pageNum'] === undefined || filter['pageCount'] === undefined || !filter['usePages']){
         return null;
      }
      return { s:[{ 'n': 'Страница', 't': 'Число целое' }, { 'n': 'РазмерСтраницы', 't': 'Число целое' },
         { 'n': 'ЕстьЕще', 't': 'Логическое' }],
         d:[filter['pageNum'], filter['pageCount'], filter['usePages'] == 'parts' || filter['usePages'] == 'auto'] };
   },
   _makeArgsForQuery: function(filter) {
      return {
         "ДопПоля": [],
         "Фильтр": this._prepareFilter(filter),
         "Сортировка": this._prepareSorting(filter),
         "Навигация": this._prepareNavigation(filter)
      };
   },
   _makeArgsForCreate: function(filter, methodName){

      if(methodName === undefined) {
         methodName = this._options.queryName || "null";
         if(methodName != "null")
            methodName = this._options.dbScheme + this._options.linkedObject + '.' + methodName;
      }

      return {
         "Фильтр": this._prepareFilter(filter),
         "ИмяМетода": methodName
      };
   },
   /**
    * Подготавливает хэш-мэп аргументов для операции обновления
    *
    * @param {$ws.proto.Record} row Сохраняемая запись
    * @param {Object} [options] Опции
    * @param {Boolean} [options.consistencyCheck = false] Проверка целостности TODO: описать
    * @param {Boolean} [options.diffOnly = false] Сохранять только измененнные поля
    * @returns {Object}
    * @private
    */
   _makeArgsForUpdate: function(row, options){
      var retval = {
         "Запись": $ws.single.SerializatorSBIS.serialize(row, options)
      };
      // TODO Выпилить в 3.7 (?) поддержку передачи boolean
      if(options && (typeof options == 'boolean' || options.consistencyCheck)) {
         retval["Проверка"] = true;
      }
      return retval;
   },
   _makeArgsForRead: function(pk, methodName, linkName){

      if(methodName === undefined) {
         methodName = this._options.queryNameForRead || this._options.queryName || "null";
         if(methodName != "null" && methodName != "БазовоеРасширение")
            methodName = this._options.dbScheme + this._options.linkedObject + '.' + methodName;
      }

      var args = {
         'ИдО' : this._extractPlainKey(pk),
         "ИмяМетода": methodName
      };

      if(linkName)
         args['Связь'] = linkName;

      return args;
   },
   _makeArgsForMergeRecords: function(mergeKey, recordKey){
      return {
         'ИдО' : this._extractPlainKey(mergeKey),
         'ИдОУд':this._preparePlainKeys(recordKey)
      };
   },
   _makeArgsForCopy: function(pk, formatMethod){
      return {
         'ИдО' : this._extractPlainKey(pk),
         'ИмяМетода': formatMethod
      };
   },
   _makeArgsForDestroy: function(pk){
      return { 'ИдО' : this._preparePlainKeys(pk)};
   },
   _makeArgsForDestroyByFilter: function(filter, methodName){
      if(methodName === undefined)
         methodName = this._options.dbScheme + this._options.linkedObject + '.' + this._options.queryName;
      return {
         "ИмяМетода" : methodName,
         "Фильтр": this._prepareFilter(filter)
      };
   },
   _preparePlainKeys : function(pk){
      if (pk instanceof Array){
         var result = [];
         for (var i = 0, len = pk.length; i < len ; i++){
            result.push(this._extractPlainKey(pk[i]));
         }
         return result;
      }
      else
         return this._extractPlainKey(pk);
   },
   /**
    * Удаляет запись с указанным PK
    * Возвращает ошибку если от сервера вернулось не true
    *
    * @param {Number} pk
    * @returns {$ws.proto.Deferred}
    */
   deleteRecord: function(pk){
      return $ws.proto.ReaderSBIS.superclass.deleteRecord.apply(this, arguments).addCallback(function(result){
         if(result !== true)
            return new Error("Запись не удалена.");
         else
            return result;
      });
   },
   _onDataParsed: function(event, data){
      this._notify('onNewData', data);
   }
});

/**
 * Класс-читатель старого формата передачи данных.
 *
 * @class $ws.proto.ReaderSimple
 * @extends $ws.proto.ReaderAbstract
 *
 * @cfgOld {String} pkColumnName имя столбца с колонкой-ключем
 */
$ws.proto.ReaderSimple = $ws.proto.ReaderAbstract.extend(/** @lends $ws.proto.ReaderSimple.prototype */{
   $protected: {
      _options: {
         parserType : 'ParserSimple',
         pkColumnName: 'id'
      }
   },
   /**
    * Запускает процесс чтения данных из внешнего источника
    * @param {Object} args
    * @param {Boolean} notColumnParse
    */
   readRecords: function(args, notColumnParse){
      var self = this;
      this.getAdapter().list(this._makeArgsForQuery(args))
         .addCallbacks(
                      function(data){
                         self._onLoaderDone(data, notColumnParse);
                         return data;
                      },
                      function(error){
                         self._notify('onComplete', false, error);
                         return error;
                      });
   },
   _getParserCfg : function(){
      var cfg = $ws.proto.ReaderSimple.superclass._getParserCfg.apply(this, arguments);
      cfg["pkColumnName"] = this._options.pkColumnName;
      return cfg;
   },
   _makeArgsForDestroy: function(pk){
      return {
         pk: pk,
         pkColumn: this._options.pkColumnName
      }
   },
   _makeArgsForUpdate: function(record){
      return {
         pk: record.get(this._options.pkColumnName),
         pkColumn: this._options.pkColumnName,
         row: record.toObject()
      }
   }
});
/**
 * @class $ws.proto.ReaderUnifiedSBIS
 * @extends $ws.proto.ReaderSBIS
 *
 * @cfgOld {String} queryName имя выборки
 * @cfgOld {String} queryNameForRead имя метода передаваемое в метод Прочитать
 * @cfgOld {String} readMethodName имя метода, который будет вызываться для чтения записей
 * @cfgOld {String} createMethodName имя метода, который будет вызываться для чтения записей
 * @cfgOld {String} updateMethodName имя метода, который будет вызываться для сохранения записей в базе
 * @cfgOld {String} destroyMethodName имя метода, который будет вызываться для удаления записей в базе
 */
$ws.proto.ReaderUnifiedSBIS = $ws.proto.ReaderSBIS.extend({
   $protected: {
      _options: {
         parserType : 'ParserSBIS',
         linkedObject: '',
         dbScheme: '',
         adapterType: 'TransportAdapterRPCJSON',
         queryName: 'Список',
         readMethodName: 'Прочитать',
         createMethodName: 'Создать',
         updateMethodName: 'Записать',
         destroyMethodName: 'Удалить',
         otherUrl: false,
         queryNameForRead : null
      }
   },
   $constructor: function(){
      this._options.adapterParams = $ws.core.merge({
//         serviceUrl: 'http://ea1-iis2.corp.tensor.ru:83/sbis-rpc-service.dll',
// временно изменено, так как нужно, чтобы работали наши демки
         serviceUrl: this._options.otherUrl ? this._options.otherUrl : $ws._const.defaultServiceUrl,
         createMethodName: this._options.dbScheme  + this._options.linkedObject + "." + this._options.createMethodName,
         listMethodName: this._options.dbScheme + this._options.linkedObject + '.' + this._options.queryName,
         updateMethodName: this._options.dbScheme + this._options.linkedObject + '.' + this._options.updateMethodName,
         destroyMethodName: this._options.dbScheme + this._options.linkedObject + '.' + this._options.destroyMethodName,
         mergeMethodName: this._options.dbScheme + this._options.linkedObject + '.Объединить',
         copyMethodName: this._options.dbScheme + this._options.linkedObject + '.Копировать',
         readMethodName: this._options.dbScheme + this._options.linkedObject + "." + this._options.readMethodName
      }, this._options.adapterParams || {});
   },
   getAdapter: function(method, args) {
      var
            obj,
            config,
            methodMap = {
               'read': '.Прочитать',
               'copy': '.Копировать',
               'destroy': '.Удалить',
               'update': '.Записать',
               'merge': '.Объединить'
            };
      switch(method) {
         case 'copy':
         case 'read':
            obj = this._extractObjectName(args[0]);
            break;
         case 'destroy':
            // удаление всегда работает с массивом ключей, поэтому возьмем первый ключ и по нему решим какой объект удаляется
            obj = this._extractObjectName(Array.isArray(args[0]) ? args[0][0] : args[0]);
            break;
         case 'update':
            obj = this._extractObjectName(args[0].getKey());
            break;
         case 'merge':
            var oMaster = this._extractObjectName(args[0]);
            var oSlave = this._extractObjectName(args[1]);
            if(oMaster == oSlave) {
               obj = oMaster;
            } else {
               return {
                  merge: function() {
                     return new $ws.proto.Deferred()
                           .errback("Невозможно объединить записи различных типов (" + oMaster + ", " + oSlave +")");
                  }
               }
            }
            break;
      }
      if(obj) {
         if(this._options.linkedObject == obj)
            BOOMR.plugins.WS.reportEvent('ReaderUnifiedSBIS', 'Составной ключ указывает на базовый объект для "' + obj + '"');
         config = $ws.core.merge({}, this._options.adapterParams);
         // ВСЕ методы работы с записью перепишем на новый объект, не только запрашиваемый
         if(this._options.linkedObject != obj){
            for(var mtd in methodMap) {
               if(methodMap.hasOwnProperty(mtd)) {
                  if(this._options[mtd + 'MethodName'] != methodMap[mtd].substr(1))
                     BOOMR.plugins.WS.reportEvent('ReaderUnifiedSBIS',
                           'Составной ключ на объекте "' + this._options.linkedObject + '".'
                           + 'Замена метода "' + this._options[mtd + 'MethodName'] + '" '
                           + 'на "' + (obj + methodMap[mtd]) + '"');
                  config[mtd + 'MethodName'] = obj + methodMap[mtd];
               }
            }
         }
         config['objectName'] = obj;
         return new $ws.proto[this._options.adapterType](config);
      }
      return $ws.proto.ReaderUnifiedSBIS.superclass.getAdapter.apply(this, arguments);
   }
});

function typeDetector(i) {
   // FIXME(oleg) отключаю определение типа массива из-за массовых проблем
   switch(typeof i) {
      /*case 'string':
         return $ws.proto.Record.FIELD_TYPE_TEXT;
      case 'number':
         return $ws.proto.Record.FIELD_TYPE_DOUBLE;
      case 'boolean':
         return $ws.proto.Record.FIELD_TYPE_BOOLEAN;
      case 'object':
         if (i instanceof Date) {
            switch(i.getSQLSerializationMode()) {
               case Date.SQL_SERIALIZE_MODE_DATE:
                  return $ws.proto.Record.FIELD_TYPE_DATE;
               case Date.SQL_SERIALIZE_MODE_TIME:
                  return $ws.proto.Record.FIELD_TYPE_TIME;
               case Date.SQL_SERIALIZE_MODE_DATETIME:
                  return $ws.proto.Record.FIELD_TYPE_DATETIME;
               default:
                  return $ws.proto.Record.FIELD_TYPE_DATETIME;
            }
         } else {
            return $ws.proto.Record.FIELD_TYPE_TEXT;
         }*/
      default:
         return $ws.proto.Record.FIELD_TYPE_TEXT;
   }
}

$ws.proto.ReaderSBIS.serializeParameter = function(field, value) {
   var arrayType, ret = {
      d: null,
      s: null
   };

   if(value instanceof Array){

      // Превратим все null-значения ('null', undefined, null) в настоящий null
      value = $ws.helpers.map(value, function(e){
         return (e === 'null' || e === undefined || e === null) ? null : e;
      });

      // Выясним тип массива. Если все элементы одного типа - то его и возьмем. Если разные - то берем строку
      arrayType = $ws.helpers.reduce(value, function(lastType, e){
         // null-значения не меняют тип
         if (e !== null) {
            var currentType = typeDetector(e);
            if (lastType) {
               // Все далее сравниваем с эталоном
               if (lastType != currentType) {
                  // Если не совпало - падаем в строку
                  lastType = $ws.proto.Record.FIELD_TYPE_TEXT;
               }
            } else {
               // Первый элемент эталонный
               lastType = currentType
            }
         }
         return lastType;
      }, false);

      // Если не удалось определить тип - берем TEXT
      arrayType = arrayType || $ws.proto.Record.FIELD_TYPE_TEXT;

      value = $ws.helpers.map(value, function(e){
         if (e !== null) {
            /*switch(arrayType) {
               case $ws.proto.Record.FIELD_TYPE_TEXT:
                  return '' + e;
               case $ws.proto.Record.FIELD_TYPE_DOUBLE:
               case $ws.proto.Record.FIELD_TYPE_BOOLEAN:
                  return e;
               case $ws.proto.Record.FIELD_TYPE_DATETIME:
               case $ws.proto.Record.FIELD_TYPE_DATE:
               case $ws.proto.Record.FIELD_TYPE_TIME:
                  return e.toSQL(Date.SQL_SERIALIZE_MODE_AUTO);
            }*/
            if (e instanceof Date) {
               return e.toSQL(Date.SQL_SERIALIZE_MODE_AUTO);
            } else {
               return '' + e;
            }
         }
         return e;
      });

      ret.s = {
         n: 'Массив',
         t: arrayType
      };
      ret.d = value;
   }
   else if(value instanceof Date){
      ret.d = value.toSQL(null);
      ret.s = 'Строка';
   }
   else if(value instanceof $ws.proto.Enum) {
      ret.d = value.getCurrentValue() + '';
      ret.s = 'Строка';
   }
   else if(value instanceof Object && value.hierarchy !== undefined){
      ret.d = [
         $ws.single.SerializatorSBIS.serializeHierarchyIdentity(value.hierarchy[0]),
         value.hierarchy[1], null
      ];
      ret.s = [{
         n: field,
         t: 'Идентификатор',
         s: 'Иерархия'
      }, {
         n: field + '@',
         t: 'Логическое',
         s: 'Иерархия'
      }, {
         n: field + '$',
         t: 'Логическое',
         s: 'Иерархия'
      }];
   }
   else if(value instanceof Object){
      var item;
      ret.d = {
         d: [],
         s: []
      };
      ret.s = 'Запись';
      for(var i in value){
         if(value.hasOwnProperty(i)){
            item = $ws.proto.ReaderSBIS.serializeParameter(i, value[i]);
            ret.d.d.push(item.d);
            ret.d.s.push({
               n: i,
               t: item.s
            });
         }
      }
   }
   else if(typeof value == 'boolean') {
      ret.d = value;
      ret.s = 'Логическое';
   }
   else{
      ret.d = (value === null) ? null : ('' + value);
      ret.s = 'Строка';
   }
   return ret;
};



$ws._const.returnType = {
   RECORD : "returnRecord",
   RECORD_SET : "returnRecordSet"
};

/**
 * Абстрактный парсер массива данных
 * @class $ws.proto.ParserAbstract
 * @extends $ws.proto.Abstract
 * @type {*}
 */
$ws.proto.ParserAbstract = $ws.proto.Abstract.extend(/** @lends $ws.proto.ReaderAbstract.prototype */{
   /**
    * @event onNewRecord событие, генерируемое для каждой прочитанной записи
    * @param {Object} eventObject описание в классе $ws.proto.Abstract
    * @param {Object} data Десериализованные данные для создания записи.
    */
   /**
    * @event onSettingsParsed событие, генерируемое при окончании разбора конфигурации полей
    * @param {Object} eventObject описание в классе $ws.proto.Abstract
    * @param {Object} columnsConfig конфигурация столбцов
    * @param {Number} pkColumnIndex номер столбца с первичным ключем
    */
   /**
    * @event onWayExists событие, сообщает о наличии пути в принятых данных
    * @param {Object} eventObject описание в классе $ws.proto.Abstract
    * @param {Object} way Путь
    */
   /**
    * @event onResults событие, сообщает о наличии итогов в принятых данных
    * @param {Object} eventObject описание в классе $ws.proto.Abstract
    * @param {Object} results Итоги
    */
   $protected : {
      _cols : null,
      _rows : []
   },
   $constructor : function(){
      this._publish("onWayExists", "onResults", "onSettingsParsed", "onNewRecord");
   },
   /**
    * Функция десериализации данных
    * @param {object} data
    * @param {$ws._const.returnType.RECORD | $ws._const.returnType.RECORD_SET} type - тип ожидаемых данных
    * @return {$ws.proto.Record | $ws.proto.RecordSet}
    */
   parse : function(data, type){
      var
         self = this,
         result;

      if (data === null){
         return null;
      }

      this._rows = [];
      var
         parsedColumns = this._columnsParseFnc(data);
      this._cols = parsedColumns.settings;
      switch (type) {
         case $ws._const.returnType.RECORD :
            result = new $ws.proto.Record({
               row: data.d,
               colDef: this._cols,
               pkValue: data.d[parsedColumns.pk || 0]
            });
            break;
         case $ws._const.returnType.RECORD_SET :
            var row = [];
            for(var i = 0, l = data.d.length; i < l; i++){
               row = data.d[i];
               this._rows.push(new $ws.proto.Record({
                  row: row,
                  colDef: self._cols,
                  pkValue: row[parsedColumns.pk || 0]
               }));
            }
            result = new $ws.proto.RecordSetStatic({
               defaultColumns: this._cols,
               records: this._rows
            });
            break;
      }
      return result;
   },
   parseData : function(data, notColumnParse){
      //if(!notColumnParse || notColumnParse === undefined)
         this._columnsParser(data);
      if(data.p)
         this._notify('onWayExists', data.p);
      if(data.r)
         this._notify('onResults', this.readRecord(data.r));
      this._dataParser(data);
   },
   _columnsParser: function(data){
      var r = this._columnsParseFnc(data);
      this._notify('onSettingsParsed', this._transformColumns(r.settings), r.pk);
   },
   _columnsParseFnc: function(data){
      throw new Error("Method AbstractReader::_columnsParseFnc must be implemented");
   },
   _dataParser: function(data){
      throw new Error("Method AbstractReader::_dataParser must be implemented");
   },
   _transformColumns : function(parsedCols){
      var
            retval = {},
            l = parsedCols.length,
            colType;
      for (var i = 0; i < l; i++){
         if(parsedCols[i].s && parsedCols[i].s == "Иерархия"){
            retval[parsedCols[i].n] = {
               type: parsedCols[i].t,
               title: parsedCols[i].n,
               s: parsedCols[i].s,
               index: i
            };
         } else if(typeof(parsedCols[i].t) == 'object'){ // тип СБиС++ сложный
            colType = parsedCols[i].t;
            if(colType.n == "Связь"){
               retval[parsedCols[i].n] = {
                  type: colType.n,
                  title: parsedCols[i].n,
                  table: colType.t,
                  index: i
               };
            }
            else if(colType.n == "Массив"){
               retval[parsedCols[i].n] = {
                  type: colType.n,
                  title: parsedCols[i].n,
                  arrayType: colType.t,
                  index: i
               };
            }
            else if(colType.n == "Перечисляемое" || colType.n == "Флаги"){
               retval[parsedCols[i].n] = {
                  type: colType.n,
                  title: parsedCols[i].n,
                  s: colType.s,
                  index: i
               };
            }
         }
         else
            retval[parsedCols[i].n] = {
               type: parsedCols[i].t,
               title: parsedCols[i].n,
               index: i
            };
      }
      return retval;
   },
   getParsedColumns: function(columns){
      columns = this._columnsParseFnc({s: columns, d: []});
      return this._transformColumns(columns.settings);
   },
   readRecord: function(data){
      if(data === null)
         return null;

      var
            parsedColumns = this._columnsParseFnc(data),
            parsed = parsedColumns.settings,
            pkColumnIndex = parsedColumns.pk,
            colsN = parsed.length,
            columns = [],
            row = this._dataParser(data);

      for (var i = 0; i < colsN; i++){
         if(parsed[i].s && parsed[i].s == "Иерархия"){
            if(parsed[i].t == "Логическое"){
               columns[i] = {
                  t: parsed[i].t,
                  n: parsed[i].n,
                  s: parsed[i].s
               };
            }else{
               columns[i] = {
                  t: parsed[i].t,
                  n: parsed[i].n,
                  b: parsed[i].b,
                  f: parsed[i].f,
                  s: parsed[i].s
               };
            }
         }else if(parsed[i].t == "Связь" || parsed[i].t == "Массив"){
            columns[i] = {
               t: parsed[i].t,
               n: parsed[i].n,
               s: parsed[i].s
            };
         }
         else
            columns[i] = {
               t: parsed[i].t,
               n: parsed[i].n
            };
      }
      var config = {
         columns : this._transformColumns(columns),
         row : row,
         pk : pkColumnIndex
      };
      if(data.objectName)
         config.objectName = data.objectName;
      return config;
   }
});

/**
 * @class $ws.proto.ParserSimple
 * @extends $ws.proto.ParserAbstract
 */
$ws.proto.ParserSimple = $ws.proto.ParserAbstract.extend(/** @lends $ws.proto.ParserSimple.prototype */{
   $protected: {
      _options: {
         pkColumnName: 'id'
      }
   },
   _columnsParseFnc: function(data){
      var
         pkColumnIndex =  -1,
         settings = [],
         typeMap = {
            int2: "Число целое",
            int4: "Число целое",
            int8: "Число целое",
            integer: "Число целое",
            smallint: "Число целое",
            bigint: "Число целое",
            decimal: "Число вещественное",
            numeric: "Число вещественное",
            real: "Число вещественное",
            "double": "Число вещественное",
            money: "Деньги",
            date: "Дата",
            timestamp: "Дата и время",
            time: "Время",
            "boolean": "Логическое",
            character: "Символ",
            varchar: "Строка",
            text: "Текст",
            bytea: "Двоичное"
         };

      for(var i = 0, l = data.cols.length; i < l; i++){
         var type = data.cols[i].type.replace(/\([^\)]*\)/, '');
         if(data.cols[i].name == this._options.pkColumnName)
            pkColumnIndex = i;
         settings.push({
               n: data.cols[i].name,
               t: type in typeMap ? type : 'Строка'
            });
      }

      if(pkColumnIndex == -1)
         throw new ReferenceError("Requested pkColumnName = '" + this._options.pkColumnName + "' which is not found");
      return {
         settings: settings,
         pk: pkColumnIndex
      };
   },
   _dataParser:function (data){
      for (var i = 0, l = data.data.length; i < l; i++){
         this._notify('onNewRecord', data.data[i]);
      }
   }
});

/**
 * Парсер данных формата SBIS
 * @class $ws.proto.ParserSBIS
 * @extends $ws.proto.ParserAbstract
 * @type {*}
 */
$ws.proto.ParserSBIS = $ws.proto.ParserAbstract.extend(/** @lends $ws.proto.ParserSBIS.prototype */{
   $constructor: function(){
      this._publish('onDataParsed', 'onNewData');
   },
   _columnsParseFnc: function(data){
      var pk, idx = 0;
      if('s' in data) {
         for (var i = 0; i < data.s.length; i++){
            if(!data.s.hasOwnProperty(i))
               continue;
            if('k' in data && data.k == data.s[i].n)
               pk = idx;
            idx++;
         }
         if(pk === undefined && data.k == '-1'){
            pk = -1;
         }
         return {
            settings: data.s,
            pk: pk || 0
         }
      }
   },
   /**
    * Парсинг строк
    * @param {Object} data строка полученная от транспорта
    * @return {Array} строка
    */
   _dataParser: function (data){
      var notlist = false,
          checkData = data.d[0];
      // Если к нам пришел похожий на дело пакет, но в нем нет структуры - это пустой контейнер.
      if(data.s && data.s.length === 0) {
         // Если мы разбирали Record то он получит пустой row,
         // если же RecordSet то этот возврат никого не волнует, главное что не случится ни одного onNewRecord
         return [];
      }
      if(typeof data.s[0].t == 'object'){
         if(data.s[0].t.n == 'Массив' || data.s[0].t.n == 'Флаги')
            checkData = checkData && checkData[0] || null;
      } else if(data.s[0].t == "Идентификатор"){
         checkData = checkData && checkData[0] === null ? [ null ] : ( checkData && checkData[0] || null );
         // Вот тут мы ловим то, что БЛ нам почему-то null в поле Идентификатор отдает как просто null, а не массив
         // И если первое поле пустой массив
      }

      if (checkData !== undefined && !(checkData instanceof Array)){
         notlist = true;
         data.d = [data.d];
      }

      for (var i = 0, l = data.d.length; i < l; i++){
         var row = [];
         for(var j = 0, len = data.d[i].length; j < len; j++){
            var curDataType = data.s[j].s && data.s[j].s === "Иерархия" ? data.s[j] : data.s[j].t,
                  curData = data.d[i][j];

            if(typeof(curDataType) === "object" && curDataType !== null){
               var type = curDataType.n;
               if(curDataType.s && curDataType.s === "Иерархия")
                  type = "Иерархия";
               else{
                  for (var y in curDataType){
                     var hardTypes = {"Флаги" : 0, "Запись" : 0, "Связь": 0, "Перечисляемое": 0, "Массив": 0};
                     if (y in hardTypes)
                        type = y;
                  }
               }

               var typeDef = curDataType.s || curDataType[type];

               if (type == "Флаги"){
                  var
                     st = {},
                     pairs = Object.sortedPairs(typeDef),
                     fData = [];

                  for(var pI = 0, pL = pairs.keys.length; pI < pL; pI++) {
                     st[pairs.values[pI]] = {
                        type  : "Логическое",
                        title : pairs.values[pI],
                        index : pairs.keys[pI]
                     };
                     fData[pairs.keys[pI]] = curData === null ? null : curData[pI];
                  }

                  row.push(new $ws.proto.Record({
                     row: fData,
                     colDef: st,
                     parentRecordSet: null,
                     pkValue: null
                  }));
               }
               else if(type === "Связь" || type === "Массив"){
                  row.push(curData);
               }
               else if(type === "Перечисляемое"){
                  row.push(new $ws.proto.Enum({
                     availableValues: typeDef,
                     currentValue: curData
                  }));
               }
               else if(type == "Иерархия"){
                  row.push(!(curDataType.n.substr(curDataType.n.length - 1, 1) in { "@": true, "$": true}) ?
                        $ws.helpers.parseIdentity(curData) : curData);
               }
               else if (type === "Запись"){
                  var
                     childData = {
                        d: curData,
                        s: typeDef
                     };

                  row.push(new $ws.proto.Record({
                     row: this._dataParser(childData),
                     colDef: this._transformColumns(typeDef)
                  }));
               }
            }
            else if (curDataType === "Идентификатор"){
               row.push($ws.helpers.parseIdentity(curData));
            }
            else if (curDataType === "Запись"){
               if(curData !== null) {
                  var s = this._columnsParseFnc(curData);
                  row.push(new $ws.proto.Record({
                     row: this._dataParser(curData),
                     colDef: this._transformColumns(s.settings)
                  }));
               } else
                  row.push(null);
            }
            else if((curDataType in {"Дата": 0, "Время" : 0, "Дата и время": 0, "timestamp": 0, "date": 0}) && curData !== null){
               var
                     date = Date.fromSQL(curData),
                     serializeMode = undefined;

               switch(curDataType) {
                  case "Дата и время":
                     serializeMode = true;
                     break;
                  case "Время":
                     serializeMode = false;
                     break;
               }
               date.setSQLSerializationMode(serializeMode);
               row.push(date);
            }
            else if(curDataType == 'Выборка') {
               if(curData !== null) {
                  row.push(new $ws.proto.RecordSet({
                     readerType: 'ReaderSBIS',
                     readerParams: {
                        adapterType: 'TransportAdapterStatic',
                        adapterParams: {
                           data: {
                              d: curData.d,
                              s: curData.s
                           }
                        }
                     }
                  }));
               } else
                  row.push(null);
            }
            else
               row.push(curData);
         }
         if (notlist){
            data.d = data.d[0];
            return row;
         }
         else
            this._notify('onNewRecord', row);
      }
   },
   parseData : function(data, notColumnParse){
      //if(notColumnParse === true)Если не надо парсить колонки
      this._notify('onSettingsParsed', data.s, this._columnsParseFnc(data).pk);
      if(data.p)
         this._notify('onWayExists', data.p);
      if(data.r)
         this._notify('onResults', this.readRecord(data.r));
      this._notify('onDataParsed', data.d);
   },
   getParsedData: function(data){
      return this._dataParser(data);
   },
   readRecord: function(data){
      if(data === null || data === undefined)
         return null;
      var config = {
         columns : data.s,
         row : data.d,
         pk : this._columnsParseFnc(data).pk
      };
      if(data.objectName)
         config.objectName = data.objectName;
      return config;
   }
});

/**
 * Абстрактный класс-адаптер
 *
 * @class $ws.proto.TransportAdapterAbstract
 */
$ws.proto.TransportAdapterAbstract = $ws.core.extend({}, /** @lends $ws.proto.TransportAdapterAbstract.prototype */{
   /**
    * @returns {$ws.proto.Deferred}
    */
   list: function(args){
      throw new Error("TransportAdapterAbstract::list must be implemented");
   },
   create: function(args) {
      throw new Error("TransportAdapterAbstract::create must be implemented");
   },
   update: function(args){
      throw new Error("TransportAdapterAbstract::update must be implemented");
   },
   merge: function(args){
      throw new Error("TransportAdapterAbstract::merge must be implemented");
   },
   copy: function(args){
      throw new Error("TransportAdapterAbstract::copy must be implemented");
   },
   destroy: function(args){
      throw new Error("TransportAdapterAbstract::destroy must be implemented");
   },
   read: function(args){
      throw new Error("TransportAdapterAbstract::read must be implemented");
   },
   /**
    * Прерывает загрузку
    */
   abort: function(){
      throw new Error("TransportAdapterAbstract::abort must be implemented");
   }
});

/**
 * @class $ws.proto.TransportAdapterStatic
 * @extends $ws.proto.TransportAdapterAbstract
 *
 * @cfgOld {Object} data Статические данные для передачи в Reader
 */
$ws.proto.TransportAdapterStatic = $ws.proto.TransportAdapterAbstract.extend(/** @lends $ws.proto.TransportAdapterStatic.prototype */{
   $protected: {
      _options: {
         data: {}
      },
      _pkColumnIndex: 0,
      _pkIndex: null,
      _pkColumnName: undefined,
      _columns: [],
      _data: [],
      _columnsName: "s",
      _dataName: "d",
      _countName: "n",
      _columnTypeName: "t",
      _columnTitleName: "n",
      _pkName: "ИдО",
      _isStandartReader: true
   },
   $constructor: function(){
      if (typeof(this._options.data) === 'string') {
         this._options.data = JSON.parse(this._options.data);
      }
      var data = this._options.data;
      this._isStandartReader = !(data.cols && data.data);
      if(!this._isStandartReader){
         this._columnsName = "cols";
         this._dataName = "data";
         this._columnTypeName = "type";
         this._columnTitleName = "name";
         this._pkName = "pk";
      }
      this._columns = data[this._columnsName];
      this._data = data[this._dataName];
      this._pkColumnIndex = data.k = data.k || 0;
      if(this._pkColumnIndex >= 0 && this._columns && this._columns[this._pkColumnIndex] !== undefined){
         this._pkColumnName = this._columns[this._pkColumnIndex][this._columnTitleName];
      }
   },
   getRPCClient: function(){
      return null;
   },
   _refreshPkIndex: function(){
      var dataRow;
      this._pkIndex = {};
      for(var i = 0, l = this._data.length; i < l; i++){
         dataRow = this._data[i];
         this._pkIndex[dataRow[this._pkColumnIndex]] = i;
      }
   },
   list: function(args){
      var paging = this._isStandartReader && args["Навигация"] || ( args && args.usePages ? args : false ),
          data = {},
          count = this._data.length,
          firstRecordNumber = 0,
          lastRecordNumber = count;
      data[this._countName] = count;
      if(paging){ // если используется постраничная навигация, то обработаем ее
         var pageNumber, recordsPerPage, hasMore;
         if(this._isStandartReader){
            for(var j = 0, l = paging[this._columnsName].length; j < l; j++ ){
               switch(paging[this._columnsName][j].n) {
                  case "Страница":
                     pageNumber = paging[this._dataName][j];
                     break;
                  case "РазмерСтраницы":
                     recordsPerPage = paging[this._dataName][j];
                     break;
                  case "ЕстьЕще":
                     hasMore = paging[this._dataName][j];
                     break;
                  default:
                     break;
               }
            }
         } else {
            pageNumber = paging.pageNum;
            recordsPerPage = paging.pageCount;
            hasMore = paging.usePages == "full";
         }
         if(pageNumber == -1)
            pageNumber = parseInt(count/recordsPerPage, 10);
         firstRecordNumber = pageNumber*recordsPerPage;
         lastRecordNumber = Math.min( firstRecordNumber + recordsPerPage, count);
         if(hasMore)
            data[this._countName] = !!this._data[lastRecordNumber];
      }
      data[this._dataName] = this._data.slice(firstRecordNumber, lastRecordNumber);
      data[this._columnsName] = this._columns;
      if(this._options.data.r) {
         //если нам отдали итоги, то отдадим их как есть в ответ
         data.r = this._options.data.r;
      }
      if(this._options.data.n) {
         //если нам отдали кол-во записей, то отдадим их как есть в ответ
         data.n = this._options.data.n;
      }
      if(this._options.data.p) {
         //если нам отдали путь, то отдадим его как есть в ответ
         data.p = this._options.data.p;
      }
      return new $ws.proto.Deferred().callback(data);
   },
   update : function(args){
      if(this._pkColumnIndex < 0)
         return new $ws.proto.Deferred().errback(new Error("Запрещено редактирование записей в списке без ключа"));
      this._buildPkIndexIfNeeded();
      var record = args["Запись"][this._dataName],
          pk = record[this._pkColumnIndex],
          newRecord = this._pkIndex[pk] === undefined ? [] : this._data[this._pkIndex[pk]];
      for(var i = 0, l = this._columns.length; i < l; i++){
         newRecord[i] = record[i];
      }
      if(this._pkIndex[newRecord[this._pkColumnIndex]] === undefined){
         this._data.push(newRecord);
         this._pkIndex[newRecord[this._pkColumnIndex]] = this._data.length - 1;
      }
      return new $ws.proto.Deferred().callback(newRecord[this._pkColumnIndex]);
   },
   destroy : function(args){
      if(this._pkColumnIndex < 0)
         return new $ws.proto.Deferred().errback(new Error("Запрещено удаление записей в списке без ключа"));
      this._buildPkIndexIfNeeded();
      var pk = args[this._pkName];
      if(this._pkIndex[pk] !== undefined)
         this._data.splice(this._pkIndex[pk], 1);
      this._refreshPkIndex();
      return new $ws.proto.Deferred().callback(true);
   },
   read: function(args){
      this._buildPkIndexIfNeeded();
      var pk = args[this._pkName],
          dataRow = this._data[this._pkIndex[pk]];
      return new $ws.proto.Deferred().callback(this._getRecordByConfig(dataRow));
   },
   copy: function(args){
      if(this._pkColumnIndex < 0)
         return new $ws.proto.Deferred().errback(new Error("Запрещено копирование записей в списке без ключа"));
      var dResult = new $ws.proto.Deferred(),
          self = this;
      this.read(args).addCallback(function(record){
         record[self._dataName][self._pkColumnName] = null;
         dResult.callback(record);
         return record;
      });
      return dResult;
   },
   create : function(args){
      if(this._pkColumnIndex < 0)
         return new $ws.proto.Deferred().errback(new Error("Запрещено создание записей в списке без ключа"));
      return new $ws.proto.Deferred().callback(this._getRecordByConfig(args && args["Фильтр"]));
   },
   /*
   * @param [dataRow] массив значений, по которым заполняем запись
    */
   _getRecordByConfig: function(dataRow){
      var record = {},
          column = {},
          columnTitle,
          data,
          filterCols, filterData;
      if(Object.prototype.toString.call(dataRow) == "[object Object]"){
         filterCols = dataRow[this._columnsName];
         filterData = dataRow[this._dataName];
      }
      record[this._dataName] = [];
      record[this._columnsName] = this._columns;
      for(var i = 0, l = this._columns.length; i < l; i++){
         column = this._columns[i];
         columnTitle = column[this._columnTitleName];
         data = null;
         if(Object.prototype.toString.call(dataRow) == "[object Object]"){
            for(var j= 0, len = filterCols.length; j < len; j++){
               if(filterCols[j][this._columnTitleName] == columnTitle && filterData[j] !== undefined)
                  data = filterData[j];
            }
         } else if(Object.prototype.toString.call(dataRow) == "[object Array]"){
            if(dataRow[i] !== undefined)
               data = dataRow[i];
         }
         record[this._dataName].push(data);
      }
      return record;
   },
   _buildPkIndexIfNeeded: function(){
      if (!this._pkIndex) {
         this._refreshPkIndex();
      }
   },
   /**
    * Прерывает загрузку
    */
   abort: function(){
   }
});

/**
 * Класс-адаптер для работы с абстрактной RPC-службой
 *
 * @class $ws.proto.TransportAdapterRPCAbstract
 * @extends $ws.proto.TransportAdapterAbstract
 *
 * @cfgOld {String} serviceUrl
 * @cfgOld {String} createMethodName
 * @cfgOld {String} listMethodName
 * @cfgOld {String} updateMethodName
 * @cfgOld {String} destroyMethodName
 * @cfgOld {String} mergeMethodName
 * @cfgOld {String} copyMethodName
 * @cfgOld {String} readMethodName
 */
$ws.proto.TransportAdapterRPCAbstract = $ws.proto.TransportAdapterAbstract.extend(/** @lends $ws.proto.TransportAdapterRPCAbstract.prototype */{
   $protected: {
      _errorHandler: function(e) {
         if (e.errType == "error"){
            $ws.single.ioc.resolve('ILogger').error("RPC", (e instanceof HTTPError) ? (e + "") : e.message, e);
         }
         return e;
      },
      _options: {
         objectName: undefined,
         serviceUrl: '',
         createMethodName: '',
         listMethodName: '',
         updateMethodName: '',
         destroyMethodName: '',
         mergeMethodName: '',
         copyMethodName: '',
         readMethodName: ''
      },
      _rpcClient: null
   },
   $constructor: function(){
   },
   /**
    * @returns {Object}
    */
   getRPCClient: function(){
      if(this._rpcClient === null)
         this._rpcClient = this._createRpcClient();
      return this._rpcClient;
   },
   /**
    * @param client
    */
   setRPCClient: function(client){
      if(client.callMethod)
         this._rpcClient = client;
   },
   _invoke: function(method, args) {
      var self = this;
      return this.getRPCClient().callMethod(method, args).addCallbacks(function(d){
         if(self._options.objectName)
            d.objectName = self._options.objectName;
         return d;
      }, this._errorHandler);
   },
   _createRpcClient: function(){
      throw new Error("Abstract method TransportAdapterRPCAbstract::_createRpcClient must be implemented in child class");
   },
   list: function(args){
      return this._invoke(this._options.listMethodName, args);
   },
   update: function(args){
      return this._invoke(this._options.updateMethodName, args);
   },
   merge: function(args){
      return this._invoke(this._options.mergeMethodName, args);
   },
   destroy: function(args){
      return this._invoke(this._options.destroyMethodName, args);
   },
   destroyByFilter: function(args){
      return this._invoke(this._options.destroyMethodName, args);
   },
   create : function(args){
      return this._invoke(this._options.createMethodName, args);
   },
   read: function(args){
      return this._invoke(this._options.readMethodName, args);
   },
   copy: function(args){
      return this._invoke(this._options.copyMethodName, args);
   },
   /**
    * Прерывает загрузку
    */
   abort: function(){
      if(this._rpcClient){
         this._rpcClient.abort();
      }
   },
   getConfig: function() {
      return this._options;
   }
});

/**
 * Класс-адаптер для работы с JSON-RPC службой
 *
 * @class $ws.proto.TransportAdapterRPCJSON
 * @extends $ws.proto.TransportAdapterRPCAbstract
 */
$ws.proto.TransportAdapterRPCJSON = $ws.proto.TransportAdapterRPCAbstract.extend(/** @lends $ws.proto.TransportAdapterRPCJSON.prototype */{
   _createRpcClient: function(){
      return new $ws.proto.RPCJSON({
         serviceUrl: this._options.serviceUrl
      });
   }
});

/**
 * Класс-адаптер для работы с JSONLoader
 *
 * @class $ws.proto.TransportAdapterWS
 * @extends $ws.proto.TransportAdapterAbstract
 *
 * @cfgOld {String} url
 */
$ws.proto.TransportAdapterWS = $ws.proto.TransportAdapterAbstract.extend(/** @lends $ws.proto.TransportAdapterWS.prototype */{
   $protected: {
      _options: {
         url : '',
         updateURL : '',
         destroyURL : '',
         tableName : ''
      },
      _JSONLoader : null
   },
   $constructor : function(){
      this._JSONLoader = new $ws.proto.JSONLoader({
         url: this._options.url,
         updateURL: this._options.updateURL,
         destroyURL: this._options.destroyURL,
         tableName: this._options.tableName
      });
   },
   list : function(args){
      return this._JSONLoader.load(args);
   },
   update : function(args){
      return this._JSONLoader.load(args, "update");
   },
   destroy : function(args){
      return this._JSONLoader.load(args, "destroy");
   }
});
/**
 * Сериализатор данных для ReaderUnifiedSBIS
 *
 * @singleton
 * @class $ws.single.SerializatorSBIS
 */
$ws.single.SerializatorSBIS = /** @lends $ws.single.SerializatorSBIS */{
   /**
    * Метод для сериализации
    * @param {$ws.proto.Record|$ws.proto.RecordSet} row сериализуемые данные
    * @param {Object} [options]
    * @param {Boolean} [options.diffOnly] Сериализовать только измененные поля
    */
   serialize: function(row, options){
      var retval;
      if (row instanceof $ws.proto.RecordSet || row instanceof $ws.proto.Record)
         retval = row.toJSON(options);
      else
         throw new TypeError("Попытка сериализации неподдерживаемого типа");
      return retval;
   },
   /*
   * Получение данных как от БЛ из старого формата описания. момент создания записи или рекордсета через new
   */
   serializeData: function(data, columns){
      var retval = {"d": [], "s": []},
          colType, colDef;
      columns = this.serializeCols(columns);
      retval.s = columns;
      for (var i = 0, cnt = columns.length; i < cnt; i++){
         colDef = columns[i];
         colType = typeof(colDef.t) == 'object' ? colDef.t.n : colDef.t;
         // Заполнение структуры сериализуемой записи
         if(colType == 'Перечисляемое'){
            if(data[i] instanceof $ws.proto.Enum)
               retval.s[i].t.s = data[i].getValues();
         }
         else if(colType == 'Флаги') {
            if(!(data[i] instanceof $ws.proto.Record))
               data[i] = null; //чтобы если значение не валидно, то гарантированно ушел null
         }

         if (data[i] instanceof $ws.proto.Record || data[i] instanceof $ws.proto.RecordSet){
            if(colType === 'Флаги'){
               /**
                * Ожидается, что флаги в структуре и в данных переданы в одлинаковом порядке.
                * Поэтому сначала мы собираем сопоставление индекса флага и его названия
                * Потом сортируем по индексу
                * и собираем отдельно данные, отдельно структуру по уже упорядоченному набору
                */
               var dt = [],
                   s = {},
                   t = data[i].getColumns();
               for (var x = 0, l = t.length; x < l; x++){
                  s[data[i].getColumnIdx(t[x])] = t[x];
               }

               var sorted = Object.sortedPairs(s), rO = data[i].toObject();
               s = {};
               for(var y = 0, ly = sorted.keys.length; y < ly; y++) {
                  s[sorted.keys[y]] = sorted.values[y];
                  dt.push(rO[sorted.values[y]]);
               }
               retval.d.push(dt);
               retval.s[i].t.s = s;
            }
            else
               retval.d.push(this.serialize(data[i]));
         }
         else {
            if(colDef.s && colDef.s == "Иерархия"){
               if(!(colDef.n.substr(colDef.n.length - 1, 1) in { "@": true, "$": true})){
                  retval.d.push(
                     $ws.single.SerializatorSBIS.serializeHierarchyIdentity(data[i])
                  );
               }else
                  retval.d.push(data[i]);
            }else if(colType == "Связь"){
               retval.d.push(data[i] === null || data[i] == "null" ? null : parseInt(data[i], 10));
            }
            else if(colType == "Массив"){
               retval.d.push((data[i] && data[i] instanceof Array) ? data[i] : []);
            }
            else if(data[i] instanceof Date) {
               if(colType == 'Дата')
                  retval.d.push(data[i].toSQL());
               else if(colType == 'Дата и время')
                  retval.d.push(data[i].toSQL(true));
               else {
                  retval.d.push(data[i].toSQL(false));
               }
            }
            else if(data[i] instanceof $ws.proto.Enum) {
               var eV = data[i].getCurrentValue();
               retval.d.push(eV === null ? null : parseInt(eV, 10));
            }
            else if(colType == 'Идентификатор') {
               retval.d.push($ws.single.SerializatorSBIS.serializeHierarchyIdentity(data[i]));
            }
            else if(colType == 'Число целое') {
               retval.d.push((typeof(data[i]) == 'number') ? data[i] : (isNaN(parseInt(data[i], 10)) ? null : parseInt(data[i], 10)));
            }
            else
               retval.d.push(data[i] !== undefined ? data[i] : null);
         }
      }
      return retval;
   },
   serializeCols : function(columns){
      var result = [];
      for (var t in columns){
         if (columns.hasOwnProperty(t)){
            var
               column = columns[t],
               type = column["type"];

            if(column["s"] && column["s"] == "Иерархия"){
               result.push({
                  n : column["title"],
                  t : column["type"],
                  s : column["s"]
               });
            }
            else if (type == "Перечисляемое" || type == "Флаг"){
               result.push({
                  n : column["title"],
                  t : {
                     n : type,
                     s : column["s"]
                  }
               });
            }
            else if (type == "Массив" || type == "Связь"){
               result.push({
                  n : column["title"],
                  t : {
                     n : type,
                     t : type == "Связь" ? column["table"] : column["arrayType"]
                  }
               });
            }
            else if (type == "Флаги"){
               result.push({
                  n : column["title"],
                  t : {
                     n : type,
                     s : column["s"]
                  }
               });
            }
            else{
               result.push({
                  n : column["title"],
                  t : type
               });
            }
         }
      }
      return result;
   },
   /**
    * Сериализует иерархию
    *
    * @param identity
    * @returns {Array}
    */
   serializeHierarchyIdentity: function(identity) {
      var retval;

      if(identity === null) // Null - превратим в [ null ]
         retval = [ null ];
      else if(identity instanceof Array) { // Если пришел массив, удостоверимся что первый его элемент - число
         if(typeof identity[0] == 'string') {
            var nK = parseInt(identity[0], 10);
            if(!isNaN(nK)) {
               var nA = identity.slice();
               nA[0] = nK;
               return nA;
            } else
               return identity;
         }
         return identity;
      }
      else if(typeof identity == 'string') { // Если пришла строка - сделаем массив и сделаем числовой ключ
         var parsedIdentity = $ws.helpers.parseComplexKey(identity);
         identity = [ parseInt(parsedIdentity.objKey, 10) ];
         if(parsedIdentity.objName)
            identity.push(parsedIdentity.objName);
         retval = identity;
      }
      else // Это просто число - обернем в массив
         retval = [ identity ];

      return retval;
   },
   getColumnConfigByType: function(name, type, details){
      var config = {
             cols: [],
             data: []
          },
          colType;
      switch(type) {
         case $ws.proto.Record.FIELD_TYPE_QUERY:
         case $ws.proto.Record.FIELD_TYPE_RECORD:
         case $ws.proto.Record.FIELD_TYPE_INTEGER:
         case $ws.proto.Record.FIELD_TYPE_STRING:
         case $ws.proto.Record.FIELD_TYPE_TEXT:
         case $ws.proto.Record.FIELD_TYPE_DOUBLE:
         case $ws.proto.Record.FIELD_TYPE_MONEY:
         case $ws.proto.Record.FIELD_TYPE_DATE:
         case $ws.proto.Record.FIELD_TYPE_DATETIME:
         case $ws.proto.Record.FIELD_TYPE_TIME:
         case $ws.proto.Record.FIELD_TYPE_BOOLEAN:
         case $ws.proto.Record.FIELD_TYPE_IDENTITY:
         case $ws.proto.Record.FIELD_TYPE_BINARY:
         case $ws.proto.Record.FIELD_TYPE_UUID:
         case $ws.proto.Record.FIELD_TYPE_RPCFILE:
            config.cols.push({
               t: type,
               n: name
            });
            break;
         case $ws.proto.Record.FIELD_TYPE_LINK:
         case $ws.proto.Record.FIELD_TYPE_ARRAY:
            if(details) {
               colType = {
                  n: type,
                  t: details
               };
               config.cols.push({
                  t: colType,
                  n: name
               });
            } else
               return false;
            break;
         case $ws.proto.Record.FIELD_TYPE_ENUM:
         case $ws.proto.Record.FIELD_TYPE_FLAGS:
            if(details) {
               colType = {
                  n: type,
                  s: details
               };
               config.cols.push({
                  t: colType,
                  n: name
               });
            } else
               return false;
            break;
         case $ws.proto.Record.FIELD_TYPE_HIERARCHY:
            config.cols.push({
               s: "Иерархия",
               t: "Идентификатор",
               n: name
            });
            config.cols.push({
               s: "Иерархия",
               t: "Логическое",
               n: name + "@"
            });
            config.cols.push({
               s: "Иерархия",
               t: "Логическое",
               n: name + "$"
            });
            break;
         default:
            return false;
      }

      switch(type) {
         case $ws.proto.Record.FIELD_TYPE_QUERY:
         case $ws.proto.Record.FIELD_TYPE_RECORD:
            config.data.push({
               s: [],
               d: []
            });
            break;
         case $ws.proto.Record.FIELD_TYPE_IDENTITY:
            config.data.push([null]);
            break;
         case $ws.proto.Record.FIELD_TYPE_ARRAY:
         case $ws.proto.Record.FIELD_TYPE_FLAGS:
            if(details){
               config.data.push([]);
            } else
               return false;
            break;
         case $ws.proto.Record.FIELD_TYPE_HIERARCHY:
            config.data.push([null]);
            config.data.push(false);
            config.data.push(false);
            break;
         default:
            config.data.push(null);
      }
      return config;
   }
};

/**
 * Сериализатор выборки-СБИС.
 * Сериализует выборку-СБИС или Запись в XML.
 * @see http://inside.sbis.ru/doc/_layouts/DocIdRedir.aspx?ID=SBIS-5-946
 *
 * @class $ws.single.RecordSetToXMLSerializer
 * @singleton
 */
$ws.single.RecordSetToXMLSerializer = /** @lends $ws.single.RecordSetToXMLSerializer.prototype */{
   _complexFields: {
      "Связь" : true,
      "Иерархия" : true,
      "Перечисляемое" : true,
      "Флаги" : true,
      "Массив" : true,
      "Запись" : true,
      "Выборка" : true
   },
   _colNameToTag: {
      "Число целое" : "ЧислоЦелое",
      "Число вещественное" : "ЧислоВещественное",
      "Дата и время" : "ДатаИВремя"
   },
   _branchTypes: {
      "true": "Узел",
      "false": "Лист",
      "null": "СкрытыйУзел"
   },
   /**
   * Сериализует контейнер в XML-документ
   * @param {$ws.proto.Record | $ws.proto.RecordSet | Array} records набор сериализуемых записей
   * @return {Document}  результат сериализации
   */
   serialize: function(records, columns, titleColumn, rootNode){
      var doc = this._createXMLDocument(),
          object = records instanceof $ws.proto.Record ? [ records ] : records;
      this._serializeObject(object, doc, doc);
      this._serializeColumns(columns, object, doc, titleColumn, rootNode);
      return doc;
   },
   _serializeColumns : function(columns, object, doc, titleColumn, rootNode){
      var hierField = '',
          cols, column;
      if(columns && columns instanceof Array && columns.length > 0) {
         doc.documentElement.appendChild(cols = doc.createElement('Колонки'));
         for(var i = 0, l = columns.length; i < l; i++){
            cols.appendChild(column = doc.createElement('Колонка'));
            column.setAttribute('Имя', columns[i].title);
            column.setAttribute('Поле', columns[i].field);
         }
      }
      if(object instanceof $ws.proto.RecordSet) {
         hierField = object.getHierarchyField();
      }
      if(object instanceof Array && object[0] instanceof $ws.proto.Record && object[0].getRecordSet() !== null) {
         var rs = object[0].getRecordSet();
         if(rs) {
            hierField = rs.getHierarchyField();
         }
      }
      if(hierField !== ''){
         doc.documentElement.setAttribute('ПолеИерархии', hierField);
         doc.documentElement.setAttribute('ИмяИерархии', titleColumn === undefined ? '' : titleColumn);
         doc.documentElement.setAttribute('Корень', rootNode ? (rootNode + "") : '');
      }
   },
   _serializeObject: function(object, parentElement, document){
      var dataRow,
          currentElement,
          columns = [],
          recordElement,
          pkColumnName;
      if(object instanceof $ws.proto.RecordSet){
         parentElement.appendChild(currentElement = document.createElement('Выборка'));
         object.rewind();
         while((dataRow = object.next()) !== false){
            this._serializeObject(dataRow, currentElement, document);
         }
      } else if(object instanceof Array){
         parentElement.appendChild(currentElement = document.createElement('Выборка'));
         var l = object.length;
         for(var i=0; i < l; i++)
            this._serializeObject(object[i], currentElement, document);
      }else if(object instanceof $ws.proto.Record){
         parentElement.appendChild(recordElement = document.createElement('Запись'));
         var key = object.getKey();
         if(key === null){
            key = 'null';
         }
         recordElement.setAttribute('КлючЗаписи', key);
         columns = object.getColumns();
         pkColumnName = object.getRecordSet() === null ? columns[0] : columns[object.getRecordSet().getPkColumnIndex()];
         recordElement.setAttribute('ПолеКлюча', pkColumnName);
         for(var k = 0, cnt = columns.length; k < cnt; k++) {
            this._serializeField(columns[k], object, recordElement, document);
         }
      }
   },
   _serializeField: function(columnName, record, recordElement, document){
      var colDef,
          fieldElement,
          tagName,
          element;
      colDef = record.getColumnDefinition(columnName);
      recordElement.appendChild(fieldElement = document.createElement('Поле'));
      fieldElement.setAttribute('Имя', colDef.title);
      var fieldValue = record.get(colDef.title) === null ? "" : record.get(colDef.title);
      var typeName = typeof(colDef.type) == 'object' ? colDef.type.n : colDef.type;
      if(!this._complexFields[typeName] && !colDef.s && !this._complexFields[colDef.s]){
         tagName = this._colNameToTag[colDef.type] ? this._colNameToTag[colDef.type] : colDef.type;
         element = document.createElement(tagName);
         if(fieldValue instanceof Date){
            if(colDef.type == "Дата и время")
               fieldValue = fieldValue.toSQL() + "T" + fieldValue.toTimeString().replace(" GMT", "").replace(/\s[\w\W]*/, "");
            if(colDef.type == "Дата")
               fieldValue = fieldValue.toSQL();
            if(colDef.type == "Время")
               fieldValue = fieldValue.toTimeString().replace(" GMT", "").replace(/\s[\w\W]*/, "");
         }
         fieldValue = $ws.helpers.removeInvalidXMLChars(fieldValue + "");
         element.appendChild(document.createTextNode(fieldValue));
         fieldElement.appendChild(element);
      } else if(typeName == 'Связь'){
         element = document.createElement('Связь');
         element.setAttribute('Таблица', typeof(colDef.type) == 'object' ? colDef.type.t : colDef.table);
         element.appendChild(document.createTextNode(fieldValue));
         fieldElement.appendChild(element);
      } else if(typeName == 'Иерархия' || (colDef.s && colDef.s == 'Иерархия')){
         fieldElement.appendChild(element = document.createElement('Иерархия'));
         var pID, flBranch;
         element.appendChild(pID = document.createElement('Родитель'));
         element.appendChild(flBranch = document.createElement('ТипУзла'));
         if(typeof(colDef.type) == 'object'){
            element.setAttribute('ИмяИерархии', colDef.type.f + "");
            pID.appendChild(document.createTextNode(fieldValue[1] + ""));
            flBranch.appendChild(document.createTextNode(this._branchTypes[fieldValue[0] + ""]));
         } else {
            if(typeName == "Идентификатор"){
               element.setAttribute('ИмяИерархии', colDef.titleColumn + "");
               pID.appendChild(document.createTextNode(fieldValue + ""));
               fieldValue = this._branchTypes[record.get(colDef.title + "@") + ""];
               flBranch.appendChild(document.createTextNode(fieldValue));
            } else {
               recordElement.removeChild(fieldElement);
            }
         }
      } else if(typeName == 'Перечисляемое'){
         fieldElement.appendChild(element = document.createElement('Перечисляемое'));
         var option;
         fieldValue = fieldValue.toObject();
         for(var key in fieldValue.availableValues){
            if(fieldValue.availableValues.hasOwnProperty(key)) {
               element.appendChild(option = document.createElement('Вариант'));
               option.setAttribute('Значение', key);
               var value = fieldValue.availableValues[key];
               if(value === null){
                  value = '';
               }
               option.setAttribute('Название', value);
               if(key == fieldValue.currentValue)
                  option.setAttribute('Выбран', 'true');
            }
         }
      } else if(typeName == 'Флаги'){
         fieldElement.appendChild(element = document.createElement('Флаги'));
         var flag;
         fieldValue = fieldValue.toObject();
         for(var number in fieldValue){
            if(fieldValue.hasOwnProperty(number)) {
               element.appendChild(flag = document.createElement('Флаг'));
               flag.setAttribute('Название', number);
               flag.setAttribute('Состояние', fieldValue[number] + "");
            }
         }
      } else if(typeName == 'Массив'){
         fieldElement.appendChild(element = document.createElement('Массив'));
         element.setAttribute('ТипДанных', typeof(colDef.type) == 'object' ? colDef.type.t : colDef.arrayType);
         var elem;
         for(var i = 0, l = fieldValue.length; i < l; i++){
            element.appendChild(elem = document.createElement('Значение'));
            //для элементов массива всегда добавляем их значение как текст, ведь там может быть null
            elem.appendChild(document.createTextNode(fieldValue[i] + ''));
         }
      } else if(fieldValue instanceof $ws.proto.RecordSet || fieldValue instanceof $ws.proto.Record){
         this._serializeObject(fieldValue, fieldElement, document);
      }
   },
   _createXMLDocument: function(){
      var doc;
      // нормальные браузеры
      if (document.implementation && document.implementation.createDocument)
         doc = document.implementation.createDocument("", "", null);
      // IE
      if(window.ActiveXObject)
         doc = new ActiveXObject("Microsoft.XmlDom");
      return doc;
   }
};

/**
 * @class $ws.proto.ReportPrinter
 *
 * @cfgOld {Array} columns
 * @cfgOld {String} titleColumn
 */
$ws.proto.ReportPrinter = $ws.core.extend({}, /** @lends $ws.proto.ReportPrinter.prototype */{
   $protected:{
      _options:{
         columns: [],
         titleColumn: ''
      }
   },
   /**
    * Подготавливает отчет по входящим данным и трансормации
    *
    * @param {$ws.proto.Record|$ws.proto.RecordSet} object Данные для отчета
    * @param {string|Document} xsl Адрес, текстовое содержимое или инстанс XSL-документа
    * @param {*|number|string} rootNode Текущий отображаемый узел
    * @param {Document} xml XML-документ
    * @returns {$ws.proto.Deferred} Асинхронный результат, возвращающий текст отчета
    */
   prepareReport: function(object, xsl, rootNode, xml){
      var xmlDoc = xml && xml.documentElement ? xml : $ws.single.RecordSetToXMLSerializer.serialize(object, this._options.columns, this._options.titleColumn, rootNode);
      return $ws.core.attachInstance('xslt:XSLTransform', { xml : xmlDoc, xsl : xsl}).addCallback(function(transofrmer){
         var res = transofrmer.transformToText();
         transofrmer.destroy();
         return res;
      });
   },
   /**
    * Возвращает набор колонок, по которым строится отчет на печать
    * @returns {*|Array}
    */
   getColumns: function() {
      return this._options.columns;
   },
   /**
    * Возвращает поле с названием иерархии, по которому строится отчет на печать
    * @return {string}
    */
   getTitleColumn: function() {
      return this._options.titleColumn;
   }
});


$ws.proto.BLObject = function(config) {
   return $ws.single.ioc.resolve('IBLObject', config);
};

/**
 * $ws.proto.BLObject — абстрактный класс объекта бизнес-логики. Предназначен для вызова методов бизнес-логики и
 * разбора их результатов. Не хранит никакого состояния, сам по себе не представляет никакого конкретного экземпляра указанного объекта БЛ.
 *
 * Существует 2 способа создания этого объекта: - new $ws.proto.BLObject(«ObjectName»);
 * В этом случае ObjectName – имя объекта бизнес-логики - new $ws.proto.BLObject({name: «ObjectName», serviceUrl: »/service/url/»});
 * В этом случае “serviceUrl” – точка входа в другой сервис (указывается в свойствах приложения), и все методы будут вызваны с указанного сервиса.
 *
 * Все точки входа, заданные в свойствах приложения, попадают в интерфейсном движке в массив — $ws._const.services.
 *
 * Точки входа мы создавали для приложения “shop.tensor.ru”. Это означает, что мы устанавливаем связь между несколькими приложениями.
 * Например, из приложения “shop.tensor.ru” можно вызывать методы приложения “shop.tensor.ru auth” и “shop.tensor.ru admin”.
 *
 * Класс $ws.proto.BLObject имеет два метода, которые позволяют вызывать методы бизнес-логики:
 * 1. call( method, args, type, hierarchyField, updateMethod, destroyMethod ) — Вызов произвольного метода Бизнес-логики, где
 *                  method — Имя вызываемеого метода
 *                  args — Аргументы вызова, должны быть объектом.
 *                  type — Тип ожидаемого результата. Одна из констант:
 *                          $ws.proto.BLObject.RETURN_TYPE_ASIS - «как есть», что пришло то и отдадим без какой-либо обработки. Подходит для скаляров
 *                          $ws.proto.BLObject.RETURN_TYPE_RECORD - запись
 *                          $ws.proto.BLObject.RETURN_TYPE_RECORDSET - RecordSet
 *                  hierarchyField — Поле иерархии, работает только для $ws.proto.BLObject.RETURN_TYPE_RECORDSET
 *                  updateMethod — Имя метода, который будет вызываться для сохранения записей в базе
 *                  destroyMethod — Имя метода, который будет вызываться для удаления записей в базе
 *
 * 2. query( method, filter, paging, sorting ) — Выполняет вызов классического списочного метода (штатные 4 аргумента: ДопПоля, Фильтр, Навигация, Сортировка), где
 *                  method — Имя списочного метода
 *                  filter — Фильтр, должен быть объектом
 *                  paging — Объект с параметрами пейджинга
 *                           paging.type — Тип пейджинга. 'parts' - частичный, 'full' - полный
 *                           paging.page — Номер страницы
 *                           paging.pageSize — Размер страницы
 *                  sorting — Параметры сортировки. Массив массивов. [ ['ИмяПоля', true|false ], ['ИмяПоля2', true|false] ]. true|false - направление сортировки. true - по убыванию.
 * Результатом выполнения методов будет $ws.proto.Deferred, на который можно повесить callback-функцию. Уже в в callback-функцию придет результат выполнения метода бизнес-логики.
 *
 * Пример использования для вызова
 * <pre>
 *    var obj = new $ws.proto.BLObject("Пользователь");
 *    obj.call(
 *       "ПолучитьПользователяПоСессии",
 *       { "ИдСессии": 'xxx-yyy' },
 *       $ws.proto.BLObject.RETURN_TYPE_RECORD).addCallback(function(record){
 *          record.getKey();
 *          // smth else...
 *       });
 * </pre>
 *
 * @class $ws.proto.ClientBLObject
 */
$ws.proto.ClientBLObject = $ws.core.extend($ws.proto.BLObject, /** @lends $ws.proto.ClientBLObject.prototype */{
   $protected: {
      _name: '',
      _serviceUrl: ''
   },
   $constructor: function(cfg) {
      if(cfg && typeof(cfg) == 'object') {
         if('name' in cfg)
            this._name = cfg.name;

         if('serviceUrl' in cfg)
            this._serviceUrl = cfg.serviceUrl;
      } else if(typeof(cfg) == 'string')
         this._name = cfg;

      if(!this._name)
         throw new Error("Name of the object must be specified then creating BLObject instance");
   },
   /**
    * Возвращает имя объекта
    * @return {String} Имя объекта
    */
   getName: function() {
      return this._name;
   },
   /**
    * Вызов произвольного метода Бизнес-логики
    *
    * @param {String} method Имя вызываемеого метода
    * @param {Object} args Аргументы вызова. Передаются без изменений со следующими исключениями:
    *   - $ws.proto.Record, $ws.proto.RecordSet - сериализуется по формату обмена
    *   - Date - сериализуется в строку через Date.toSQL(null)
    * @param {String} type Тип ожидаемого результата
    * Одна из констант
    *   - $ws.proto.BLObject.RETURN_TYPE_ASIS - "как есть", что пришло то и отдадим без какой-либо обработки. Подходит для скаляров
    *   - $ws.proto.BLObject.RETURN_TYPE_RECORD - запись
    *   - $ws.proto.BLObject.RETURN_TYPE_RECORDSET - RecordSet
    * @param {String} [hierarchyField] Поле иерархии, работает только для $ws.proto.BLObject.RETURN_TYPE_RECORDSET
    * @param {String} [updateMethod] Имя метода, который будет вызываться для сохранения записей в базе
    * @param {String} [destroyMethod] Имя метода, который будет вызываться для удаления записей в базе
    * @returns {$ws.proto.Deferred} Асинхронный результат операции. Тип результат в колбэке зависит от type
    *
    * @throws TypeError если method не строка
    * @throws TypeError если args не объект или путой
    * @throws TypeError если type указывает на недопустимый тип
    */
   call: function(method, args, type, hierarchyField, updateMethod, destroyMethod) {
      if(!method || typeof(method) != 'string')
         throw new TypeError("Method name must be specified");
      if(!args || typeof(args) !== 'object')
         throw new TypeError("Wrong arguments specified. Must be an object");

      switch(type) {
         case $ws.proto.BLObject.RETURN_TYPE_RECORD:
            var rs,
                updateMethodName = updateMethod ? (updateMethod.indexOf('.') !== -1 ?
                                   updateMethod : this._name + '.' + updateMethod) : this._name + '.Записать',
                destroyMethodName = destroyMethod ? (destroyMethod.indexOf('.') !== -1 ?
                                    destroyMethod : this._name + '.' + destroyMethod) : this._name + '.Удалить';
            rs = new $ws.proto.RecordSet({
               firstRequest: false,
               readerType: 'StraightArgsReader',
               readerParams: {
                  dbScheme: '',
                  adapterType: 'TransportAdapterRPCJSON',
                  adapterParams: {
                     serviceUrl : this._serviceUrl,
                     readMethodName: this._name + '.' + method,
                     updateMethodName: updateMethodName,
                     destroyMethodName: destroyMethodName
                  }
               }
            });
            return rs.readRecord(args);
            break;
         case $ws.proto.BLObject.RETURN_TYPE_RECORDSET:
            return $ws.helpers.newRecordSet(this._name, method, args, 'StraightArgsUnifiedReader', true, this._serviceUrl, hierarchyField);
            break;
         case $ws.proto.BLObject.RETURN_TYPE_ASIS:
            $ws.helpers.forEach(args, function(v, k, o){
               if(v instanceof $ws.proto.Record || v instanceof $ws.proto.RecordSet) {
                  o[k] = $ws.single.SerializatorSBIS.serialize(v);
               }
            });
            return new $ws.proto.RPCJSON({ serviceUrl: this._serviceUrl }).callMethod(this._name + '.' + method, args);
            break;
         default:
            throw new TypeError("Wrong return type specified");
      }
   },
   /**
    * Выполняет вызов классического списочного метода СБиС++ 3.0 (штатные 4 аргумента: ДопПоля, Фильтр, Навигация, Сортировка)
    * @param {String} method Имя списочного метода
    * @param {Object} filter Фильтр
    * @param {Object} [paging] Объект с параметрами пейджинга.
    * @param {String} paging.type Тип пейджинга. 'parts' - частичный, 'full' - полный
    * @param {Number} paging.page Номер страницы
    * @param {Number} paging.pageSize Размер страницы
    * @param {Array} [sorting] Параметры сортировки. Массив массивов. [ ['ИмяПоля', true|false ], ['ИмяПоля2', true|false] ]. true|false - направление сортировки. true - по убыванию.
    * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет $ws.proto.RecordSet
    *
    * @throws TypeError если method не строка
    * @throws TypeError если paging не объект
    * @throws TypeError если paging.page не приводится к числу
    * @throws TypeError если paging.pageSize не приводится к числу
    * @throws TypeError если sorting не массив
    */
   query: function(method, filter, paging, sorting){
      if(!method || typeof(method) != 'string')
         throw new TypeError("Method name must be specified");
      if(paging) {
         if(typeof paging != 'object') {
            throw new TypeError("Paging parameter must be an object");
         } else {
            if(paging.type) {
               paging.page = +paging.page;
               paging.pageSize = +paging.pageSize;
               if(isNaN(paging.page))
                  throw new TypeError("Page must be a number (paging.page)");
               if(isNaN(paging.pageSize))
                  throw new TypeError("Page size must be a number (paging.pageSize)");
            }
         }
      }
      if(sorting && !(sorting instanceof Array))
         throw new TypeError("Sorting parameter must be an array");
      return $ws.helpers.newRecordSet(this._name, method, filter, undefined, !(sorting || paging), this._serviceUrl, undefined).addCallback(function(rs){
         if(sorting || paging) {
            var loadRes = new $ws.proto.Deferred();
            if(sorting)
               rs.setSorting(sorting, undefined, undefined, true);
            if(paging && paging.type) {
               rs.setUsePages(paging.type);
               rs.setPageSize(paging.pageSize, true);
               rs.setPage(paging.page, true);
            }
            rs.once('onAfterLoad', function(event, recordSet, isSuccess, error){
               if(isSuccess)
                  loadRes.callback(recordSet);
               else
                  loadRes.errback(error);
            });
            rs.reload();
            return loadRes;
         } else
            return rs;
      });
   }
});

/**
 * Специальный ридер для вызова списочных методов с нестандартной сигнатурой
 * @class $ws.proto.StraightArgsUnifiedReader
 * @extends $ws.proto.ReaderSBIS
 */
$ws.proto.StraightArgsUnifiedReader = $ws.proto.ReaderUnifiedSBIS.extend(/** @lends $ws.proto.StraightArgsUnifiedReader.prototype */{
   _makeArgsForQuery: function(args) {
      $ws.helpers.forEach(args, function(v, k, o){
         if(v instanceof $ws.proto.Record || v instanceof $ws.proto.RecordSet) {
            o[k] = $ws.single.SerializatorSBIS.serialize(v);
         }
         else if(v instanceof Date) {
            o[k] = v.toSQL(null);
         }
      });
      return args;
   }
});

/**
 * Специальный ридер для вызова методов, возвращающих Record с нестандартной сигнатурой (произвольное кол-во аргументов)
 * @class $ws.proto.StraightArgsReader
 * @extends $ws.proto.ReaderSBIS
 */
$ws.proto.StraightArgsReader = $ws.proto.ReaderSBIS.extend(/** @lends $ws.proto.StraightArgsReader.prototype */{
   _makeArgsForRead: function(args) {
      $ws.helpers.forEach(args, function(v, k, o){
         if(v instanceof $ws.proto.Record || v instanceof $ws.proto.RecordSet) {
            o[k] = $ws.single.SerializatorSBIS.serialize(v);
         }
         else if(v instanceof Date) {
            o[k] = v.toSQL(null);
         }
      });
      return args;
   }
});
/**
 * Специальный ридер для вызова методов через GET
 * @class $ws.proto.ReaderGETJSON
 * @extends $ws.proto.ReaderAbstract
 *
 */
$ws.proto.ReaderGETJSON = $ws.proto.ReaderAbstract.extend(/** @lends $ws.proto.ReaderGETJSON.prototype */{
   _columnsParseFnc: function(data) {
      var
         settings = [],
         res = JSON.parse(data);
      for (var i in res[0]) {
         settings.push({
            'n' : i,
            't' : 'Строка'
         });
      }
      return {
         'settings' : settings,
         'pk' : 0
      }
   },
   _dataParser: function(data) {
      var
         row,
         res = JSON.parse(data);
      for (var i in res) {
         row = [];
         for (var j in res[i]) {
            row.push(res[i][j])
         }
         this._notify('onNewRecord', row);
      }
   },
   _makeArgsForQuery: function(args) {
      return args;
   }
});
/**
 * Класс-адаптер для вызова методов через GET
 *
 * @class $ws.proto.TransportAdapterGETJSON
 * @extends $ws.proto.TransportAdapterAbstract
 *
 * @cfgOld {String} url
 */
$ws.proto.TransportAdapterGETJSON = $ws.proto.TransportAdapterAbstract.extend(/** @lends $ws.proto.TransportAdapterGETJSON.prototype */{
   $protected : {
      _options: {
         url: ''
      },
      _xhrTransport: null
   },
   list: function(args) {
      this._xhrTransport =
         $ws.single.ioc.resolve('ITransport', {
            'url' : this._options.url
         });
      var
         query = [];
      for (var i in args) {
         query.push(encodeURI(i)+"="+encodeURI(args[i]))
      }
      return this._xhrTransport.execute(query.join("&"));
   },
   getRPCClient: function() {
      return {};
   },
   abort: function() {
      if (this._xhrTransport)
         this._xhrTransport.abort();
   }
});
$ws.proto.BLObject.RETURN_TYPE_ASIS = "asis";
$ws.proto.BLObject.RETURN_TYPE_RECORD = "record";
$ws.proto.BLObject.RETURN_TYPE_RECORDSET = "recordset";

$ws.proto.Template._importNode = function(document, node, allChildren, compat) {
   /**
    * Adopted from http://www.alistapart.com/articles/crossbrowserscripting/
    * by elifantievon
    */
   if(compat !== false && document.importNode) {
      try {
         return document.importNode(node, allChildren);
      } catch(e) {
         compat = false;
      }
   }
   switch (node.nodeType) {
      case $ws._const.nodeType.ELEMENT_NODE:
         var newNode = document.createElement(node.nodeName), i, il;
         /* does the node have any attributes to add? */
         if (node.attributes && node.attributes.length > 0) {
            for (i = 0, il = node.attributes.length; i < il; i++) {
               var attrName = node.attributes[i].nodeName,
                  value = node.getAttribute(attrName);
               if(attrName.toLowerCase() === 'style' && $ws._const.browser.isIE){
                  newNode.style.cssText = value;
               }
               else{
                  newNode.setAttribute(attrName, value);
               }
            }
         }
         /* are we going after children too, and does the node have any? */
         if (allChildren && node.childNodes && node.childNodes.length > 0) {
            for (i = 0, il = node.childNodes.length; i < il; i++) {
               var importedChild = $ws.proto.Template._importNode(document, node.childNodes[i], allChildren, compat);
               if(importedChild)
                  newNode.appendChild(importedChild);
            }
         }
         return newNode;
         break;
      case $ws._const.nodeType.TEXT_NODE:
      case $ws._const.nodeType.CDATA_SECTION_NODE:
         return document.createTextNode(node.nodeValue);
      case $ws._const.nodeType.COMMENT_NODE:
         return null;
         break;
   }
};

$ws.single.Storage.store('Source', function(d){
   d.callback();
});
