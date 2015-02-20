$ws._const.XSLTCaps = {
   TRANSFORM_TO_TEXT: 1,
   TRANSFORM_TO_DOC: 2,
   TRANSFORM_TO_FRAGMENT: 4,
   LOAD_URL: 8,
   LOAD_TEXT: 16
};

/**
 * Класс-обертка для кроссбраузерного выполнения XSL-трансформаций
 *
 * @description
 * <pre>
 *    var transform = new $ws.proto.XSLTransform({ xml: './xml.xml', xsl: './xsl.xsl' });
 *    transform.transformToText();
 *    transform.transformToDocument();
 * </pre>
 *
 * @class $ws.proto.XSLTransform
 * @cfgOld {String|Document} xml Адрес, текстовове содержимое или инстанс XML-документа
 * @cfgOld {String|Document} xsl Адрес, текстовое содержимое или инстанс XSL-документа
 */
$ws.proto.XSLTransform = $ws.core.extend({}, {
   /**
    * @lends $ws.proto.XSLTransform.prototype
    */
   $protected: {
      _xmlDoc: '',
      _xslDoc: '',
      _loadedFiles: [],
      _options: {
         xml: '',
         xsl: ''
      },
      _nsResolver: null
   },
   $constructor: function() {
      this._xmlDoc = new $ws.proto.XMLDocument({ name: this._options.xml }).getDocument();
      this._xslDoc = new $ws.proto.XMLDocument({ name: this._options.xsl }).getDocument();
      if($.browser.webkit) {
         this._nsResolver = function(ns) {
            switch(ns) {
               case 'xsl':
                  return 'http://www.w3.org/1999/XSL/Transform';
               default:
                  return null;
            }
         };
         this._chromeWorkaround();
         if($ws._const.debug) {
            var logger = $ws.single.ioc.resolve('ILogger');
            logger.log("xslt", "XML document:\n" + new XMLSerializer().serializeToString(this._xmlDoc));
            logger.log("xslt", "XSL document:\n" + new XMLSerializer().serializeToString(this._xslDoc));
         }
      }
   },
   _loadDoc: function(doc) {
      if(Array.indexOf(this._loadedFiles, doc) == -1) {
         var rv = new $ws.proto.XMLDocument({ name: doc }).getDocument();
         this._loadedFiles.push(doc);
         return rv;
      } else {
         $ws.single.ioc.resolve('ILogger').log('XSLTransfor', 'Potential cyclic dependency on file ' + doc);
         return null;
      }
   },
   /**
    * Зачем это?
    * В Google Chrome не работают директивы xsl:import и xsl:include. Данный метод пересобирает документы так, чтобы
    * обйти эти ограничения другими средствами XSLT
    *
    * Как это работает?
    *
    * xsl:include
    * Проще всего. Находи все директивы, загружаем файлы по найденным адресам и просто вставляем в документ
    *
    * xsl:import
    * Чуть сложнее. Также находим все документы, загружаем файлы, вставляем в документ НО
    * - xsl:template name=... проверяем что нет с таким же именем в главном документе
    *    случаи нахождения одноименных template логаются в текущим логгером
    * - xsl:template match=... добавляем mode=imports если такой же match уже есть в документе
    * - xsl:apply-import заменяем на xsl:apply-templates select=. mode=imports
    *
    * document()
    * При нахождении функции document в исходном XSLT проводятся следующие действия:
    * 1. В исходном XML (!) создается нода ws-foreign-documents-namespace
    * 2. Для каждого документа, подключаемого через document() генерируется нода внутри ws-foreign-documents-namespace
    *    с названием, равным пути к документу но все / заменены на -, в начале дописано х (для обработки путей
    *    начинающихся со /, в конце дописан -document
    *    т.е. получаются ноды вида x-res-qualifier-dictionary1.xml-document для документа /res/qualifier/dictionary1.xml
    * 3. Содержимое документа целиком подгружается в ноду, созданную на шаге 2
    * 4. в XSL document(...) заменяется на конструкцию вида /ws-foreign-documents-namespace/x-translated-doc.xml-document
    * 5. в XSL создается пустой шаблон для ноды ws-foreign-documents-namespace (для предотвращения ее обработки)
    *
    * Обработка циклических зависимостей
    * Тупо. Просто не даем по второму разу грузить уже подгруженный документ.
    * Случаи потенциальных циклических зависимостей логаются текущим логгером
    */
   _chromeWorkaround: function() {

      while(this._xslDoc.getElementsByTagName('import').length > 0) {
         this._preparseImports(this._xslDoc);
         this._preparseImportAppliance(this._xslDoc);
      }

      while(this._xslDoc.getElementsByTagName('include').length > 0) {
         this._preparseIncludes(this._xslDoc);
      }

      this._preparseDocumentFunction(this._xmlDoc, this._xslDoc);
   },
   _convertAbsolutePath: function(path, mainPath){
      if (path.charAt(0) !== '/'){
         if (mainPath === ''){
            /*
             * У нас не указан основной путь шаблона. Сформируем из корня сайта.
             */
            mainPath = window.location.protocol + '//' + window.location.hostname;
         } else {
            /*
             * У нас указан основной путь до шаблона. Возьмем его путь.
             */
            if (mainPath.lastIndexOf('/') > (mainPath.indexOf('//')+1)){
               mainPath = mainPath.substring(0, mainPath.lastIndexOf('/'));
            }
         }
         /*
          * Проверяем и прогоняем наш путь path, на ../
          */
         while(/^\.\.\//.test(path)){
            /*
             * Производим выход на уровень только в том случае, если мы не в корне.
             */
            if (mainPath.lastIndexOf('/') > (mainPath.indexOf('//')+1)){
               mainPath = mainPath.substring(0, mainPath.lastIndexOf('/'));
            }
            path = path.substring(3);
         }
         /*
          * Сформируем наш сконвертированный путь.
          */
         path = mainPath + '/' + path;
         /*
          * Удалим все возможные вхождения ./
          */
         path = path.replace('./', '');
      }
      return path;
   },
   _preparseIncludes: function(docXSL) {
      var includes = docXSL.getElementsByTagName('include');
      while(includes.length > 0) {
         var includeNode = includes[0];
         var docName = this._convertAbsolutePath(includeNode.getAttribute('href'), docXSL.URL);
         var doc = this._loadDoc(docName);
         var p = includeNode.parentNode;
         if(doc) {
            var children = doc.documentElement.childNodes;
            for(var j = 0, lj = children.length; j < lj; j++) {
               p.insertBefore(docXSL.importNode(children[j], true), includeNode);
            }
         }
         p.removeChild(includeNode);
      }
   },
   _preparseImportAppliance: function(docXSL) {
      var importAppliance = docXSL.getElementsByTagName('apply-imports');
      while(importAppliance.length > 0) {
         var applyNode = importAppliance[0];
         var p = applyNode.parentNode;
         var replacement = docXSL.createElement('xsl:apply-templates');
         replacement.setAttribute('select', '.');
         replacement.setAttribute('mode', 'imports');
         p.replaceChild(replacement, applyNode);
      }
   },
   _preparseImports: function(docXSL) {
      var imports = docXSL.getElementsByTagName('import');
      while(imports.length > 0) {
         var importNode = imports[0];
         var docName = this._convertAbsolutePath(importNode.getAttribute('href'), docXSL.URL);
         var doc = this._loadDoc(docName);
         var p = importNode.parentNode;
         if(doc) {
            var children = doc.documentElement.childNodes;
            for(var j = 0, lj = children.length; j < lj; j++) {
               var child = children[j];
               if(child.nodeName == 'xsl:template') {

                  if(child.hasAttribute('name')) {
                     var n = child.getAttribute('name');
                     var numDups = docXSL.evaluate("count(//xsl:template[@name='" + n + "'])", docXSL, this._nsResolver, XPathResult.NUMBER_TYPE, null);
                     if(numDups && numDups.numberValue > 0) {
                        $ws.single.ioc.resolve('ILogger').log("xslt", "Ignored duplicate named template: " + n);
                        continue; // If template with same name is already declared - ignore it
                     }
                  }

                  if(child.hasAttribute('match')) {
                     var m = child.getAttribute('match');
                     var numSameMatchPattern = docXSL.evaluate("count(//xsl:template[@match='" + m + "'])", docXSL, this._nsResolver, XPathResult.NUMBER_TYPE, null);

                     // Если такой темплейт с таким же match уже есть - выставим mode=imports
                     // А если нет - не выставим
                     if(numSameMatchPattern && numSameMatchPattern.numberValue > 0)
                        child.setAttribute('mode', 'imports');
                  }
               }
               p.insertBefore(docXSL.importNode(child, true), importNode);
            }
         }
         p.removeChild(importNode);
      }
   },
   _preparseDocumentFunction: function(docXML, docXSL) {
      var hasDocumentF = docXSL.evaluate("//*[contains(@select, 'document(')]", docXSL, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
      var i;
      var changes = [];
      while((i = hasDocumentF.iterateNext()) !== null) {
         var sExpr = i.getAttribute('select');
         var m = sExpr.match(/document\('([^\)]+)'\)/);
         if(m && m.length > 0) {
            var url = this._convertAbsolutePath(m[1], docXSL.URL);
            var foreignDoc = this._loadDoc(url);
            if(foreignDoc) {
               var fakeNodeName = "x" + url.replace(/\//g,'-') + '-document';
               var docCtr = docXML.createElement(fakeNodeName);
               var fakeCtr = this._getForeignDocContainer(docXML);
               fakeCtr.appendChild(docCtr);

               docCtr.appendChild(docXML.importNode(foreignDoc.documentElement, true));

               sExpr = "//ws-foreign-documents-namespace/" + fakeNodeName + sExpr.substring(url.length + 12);
               changes.push([ i, sExpr ]);
            }
         }
      }

      if(changes.length > 0) {
         var fakeFix = docXSL.createElement('xsl:template');
         fakeFix.setAttribute('match', 'ws-foreign-documents-namespace');
         docXSL.documentElement.appendChild(fakeFix);
         for(var k = 0, l = changes.length; k < l; k++) {
            changes[k][0].setAttribute('select', changes[k][1]);
         }
      }
   },
   _getForeignDocContainer: function(doc) {
      var ctr = doc.getElementsByTagName('ws-foreign-documents-namespace')[0];
      if(!ctr) {
         ctr = doc.createElement('ws-foreign-documents-namespace');
         doc.documentElement.appendChild(ctr);
      }
      return ctr;
   },
   _insertForeignDoc: function(toDoc, docName) {
      var foreignDoc = new $ws.proto.XMLDocument({ name: docName });
      var xmlDocName = 'xxx';

      var ctr = this._getForeignDocContainer(toDoc);
      var docE = toDoc.createElement(xmlDocName);
      docE.appendChild(docE.importNode(foreignDoc.getDocument(), true));
      ctr.appendChild(docE);
   },
   /**
    * Добавляет параметры (xsl:param) в xsl-документ
    * @param   {Document}  xslDoc   Документ, в который необходимо добавить параметры
    * @param   {Object}    params   Мап с ключ-значение
    * @returns {Document}           Результирующий документ
    */
   _ieAddParams: function(xslDoc, params){
      if(!params){
         return xslDoc;
      }
      for(var p in params){
         try{
            var value = params[p];
            if(typeof value === 'boolean' || (isNaN(parseInt(value,10)) && (typeof value !== 'string' || value.charAt(0) !== "'"))){
               value = "'" + value + "'";
            }
            var element = xslDoc.selectSingleNode('//xsl:param[@name="' + p + '"]');
            if(element){
               element.setAttribute('select', value);
            }
         }
         catch(e){
            throw new Error('Problems with setting parameter ' + p + ' in the xsl transform');
         }
      }
      return xslDoc;
   },
   /**
    * Выполняет XSL-трансформацию в строку
    * <strong>ВНИМАНИЕ!!!</strong> если ваша трансформация использует method="text" результат работы
    * этого метода в разных браузерах будет разный.
    * Лучше всего работает IE - он действительно вернет текст. Chrome и FF вернут XML в виде текста в котором будет
    * присутствовать результат трансформации в т.ч.
    *
    * @param {Object} [params] Ассоциативный массив с параметрами
    * @returns {String}
    * @throws {Error} Если трансформация в текст недоступна
    */
   transformToText: function(params) {
      if(window.XMLSerializer && !$ws._const.browser.isIE) { //Проверка на ИЕ вставлена специально (koshelevav). Теоретически в девятке должно работать, НО падает. Насильно запущено по второй ветке
         return new XMLSerializer().serializeToString(this.transformToDocument(params));
      } else {
         if(window.ActiveXObject)
            return this._xmlDoc.transformNode(this._ieAddParams(this._xslDoc, params));
      }
      throw new Error("Transform to text is not supported in your environment");
   },
   /**
    * Выполняет XSL-трансформацию в документ
    *
    * @param {Object} [params] Ассоциативный массив с параметрами
    * @returns {Document}
    * @throws {Error} Если трансформация в документ недоступна
    */
   transformToDocument: function(params) {
      if(window.XSLTProcessor) {
         var xsltProcessor = new XSLTProcessor();
         for(var p in params){
            xsltProcessor.setParameter(null, p, params[p]);
         }
         if(xsltProcessor.transformToDocument) {
            xsltProcessor.importStylesheet(this._xslDoc);
            return xsltProcessor.transformToDocument(this._xmlDoc);
         }
      } else {
         if(window.ActiveXObject) {
            var doc = new ActiveXObject("Microsoft.XMLDOM");
            this._ieAddParams(doc, params);
            if('transformNodeToObject' in this._xmlDoc) {
               this._xmlDoc.transformNodeToObject(this._ieAddParams(this._xslDoc, params), doc);
               return doc;
            }
         }
      }
      throw new Error("Transform to document is not supported in your environment");
   },
   /**
    * Трансформирует в фрагмент указанного документа
    *
    * @param {Document} doc
    * @params {Object} [params] Ассоциативный массив с параметрами
    * @returns {Document}
    * @throws {Error} Если трансформация в фрагмент недоступна
    */
   transformToFragment: function(doc, params) {
      if (window.XSLTProcessor) {
         var proc = new XSLTProcessor();
         for(var p in params){
            proc.setParameter(null, p, params[p]);
         }
         if (proc.transformToFragment) {
            proc.importStylesheet(this._xslDoc);
            return proc.transformToFragment(this._xmlDoc, doc);
         }
      } else {
         if (window.ActiveXObject) {
            var fragment = doc.createDocumentFragment();
            var output = this._xmlDoc.transformNode(this._ieAddParams(this._xslDoc, params));
            var container = doc.createElement('div');
            container.innerHTML = output;
            while (container.hasChildNodes()) {
               fragment.appendChild(container.firstChild);
            }
            return fragment;
         }
      }
      throw new Error("Transform to fragment is not supported in your environment");
   },
   /**
    * Выясняет возможности текущегно окружения
    * @see {$ws._const.XSLTCaps}
    * @returns {number}
    */
   getCapabilities: function() {
      var
            caps = $ws._const.XSLTCaps.LOAD_URL, // Anyone can load through XMLHttpRequest
            proc;
      if(window.DOMParser)
         caps |= $ws._const.XSLTCaps.LOAD_TEXT;
      if(window.XSLTProcessor) {
         proc = new XSLTProcessor();
         if(proc.transformToDocument)
            caps |= $ws._const.XSLTCaps.TRANSFORM_TO_DOC;
         if(proc.transformToFragment)
            caps |= $ws._const.XSLTCaps.TRANSFORM_TO_FRAGMENT;
      } else {
         if(window.ActiveXObject) {
            proc = new ActiveXObject("Microsoft.XMLDOM");
            if('transformNodeToObject' in proc)
               caps |= $ws._const.XSLTCaps.TRANSFORM_TO_DOC;
            if('transformNode' in proc)
               caps |= $ws._const.XSLTCaps.TRANSFORM_TO_TEXT;
            if('loadXML' in proc)
               caps |= $ws._const.XSLTCaps.LOAD_TEXT;
         }
      }

      if(window.XMLSerializer)
         caps |= $ws._const.XSLTCaps.TRANSFORM_TO_TEXT;

      return caps;
   },
   /**
    * Зачищает внутренние структуры. После выполнения данного метода класс более не пригоден к использоавнию
    */
   destroy: function() {
      this._xmlDoc = null;
      this._xslDoc = null;
      this._options = null;
   }
});

/**
 * Создаем XMLDocument через ioc, чтобы подменять реализации на сервере на другую
 */
$ws.proto.XMLDocument = function(config) {
   return $ws.single.ioc.resolve('IXMLDocument', config);
};

/**
 * @class $ws.proto.XMLDocument
 * @cfgOld {String} name Текст документа, инстанс документа или URL - тип определяется автоматически
 */
$ws.proto.ClientXMLDocument = $ws.core.extend($ws.proto.XMLDocument, {
   /**
    * @lends $ws.proto.XMLDocument.prototype
    */
   $protected: {
      _options: {
         name: ''
      },
      _doc: null
   },
   $constructor: function() {
      this._doc = this._loadDocument(this._options.name);
   },
   /**
    * @returns {Document}
    */
   getDocument: function() {
      return this._doc;
   },
   /**
    * Проверяет документ - не является ли он результатом ошибки разбора
    *
    * @param {Document} document
    * @returns {Document}
    * @throws {EvalError} Если документ некорректный (в результате его разбора произошла ошибка)
    */
   checkDocument: function(document) {
      var error = null;
      if(document) {
         if(document.parseError) {
            if(document.parseError.errorCode !== 0)
               error = document.parseError.reason;
         } else {
            var pErr = document.getElementsByTagName('parsererror');
            if(pErr.length)
               error = pErr[0].textContent;
         }
      }
      else
         error = "Empty document";
      if(error !== null)
         throw new EvalError("Parse error: " + error);
      return document;
   },
   /**
    * Загружает и проверяет документ
    * @param {String|Document} resource
    * @returns {Document}
    */
   _loadDocument: function(resource) {
      var doc = null;
      if(resource.documentElement)
         doc = resource;
      else
         doc = this['_loadDocumentFrom' + (this._isUrl(resource) ? 'Url' : 'String')](resource);
      return this.checkDocument(doc);
   },

   /**
    * @param {String} content
    * @returns {Document}
    * @throws {Error} Если нет возможности получить документ из строки
    */
   _loadDocumentFromString: function(content) {
      var doc = null;
      content = $ws.helpers.removeInvalidXMLChars(content);
      if (window.ActiveXObject) {
         doc = new ActiveXObject("Microsoft.XMLDOM");
         doc.async = false;
         doc.loadXML(content);
      } else
      if(window.DOMParser)
         doc = new DOMParser().parseFromString(content, "text/xml");
      if(doc !== null)
         return doc;
      throw new Error("Your environment is not able to parse XML documents from string");
   },
   /**
    * @param {String} url
    * @returns {Document}
    */
   _loadDocumentFromUrl: function(url) {
      if(window.ActiveXObject) { // IE
         var doc = new ActiveXObject("Microsoft.XMLDOM");
         doc.async = false;
         doc.load(url);
         return doc;
      } else {
         var xhttp = new XMLHttpRequest();
         xhttp.open("GET", url, false);
         xhttp.send("");
         return xhttp.responseXML;
      }
   },
   /**
    * Проверяет, является ли строка URL'ом
    * Поддерживаются схемы:
    *  - http://host/file
    *  - https://host/file
    *  - /file
    *  - ./file
    *  - ../file
    *  - file
    *
    * @param {String} str проверяемая строка
    * @returns {Boolean}
    */
   _isUrl: function(str) {
      if(str.substr === undefined || str === '' || !str)
         return false;
      if (!/^http[s]?:/.test(str)) {
         var firstChar = str.substr(0, 1);
         if (firstChar != '/' && firstChar != '.') {
            if(firstChar == '<') // Begin of XML declaration
               return false;
         }
      }
      return true;
   },
   /**
    * Зачищает внутренние структуры. После выполнения данного метода класс более не пригоден к использоавнию
    */
   destroy: function() {
      this._doc = null;
      this._options = null;
   }
});
//@ sourceURL="xslt.js"