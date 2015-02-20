/**
 * Модуль "Компонент Абстрактная область, заполняющая себя по XML-шаблону".
 *
 * @description
 */
define("js!SBIS3.CORE.TemplatedAreaAbstract", ["js!SBIS3.CORE.AreaAbstract"], function( AreaAbstract ) {

   "use strict";

   /**
    * Абстрактная область, заполняющая себя по XML-шаблону
    *
    * @class $ws.proto.TemplatedAreaAbstract
    * @extends $ws.proto.AreaAbstract
    *
    */
   $ws.proto.TemplatedAreaAbstract = AreaAbstract.extend(/** @lends $ws.proto.TemplatedAreaAbstract.prototype */{
      $protected: {
         _needOptionsOverrideData: true,
         _width : '300px',
         _height : '100px',
         _title : undefined,
         _isPage: false,
         _currentTemplateInstance: null,
         _options : {
            /** @cfg {String} Имя шаблона
             * <wiTag group="Отображение">
             * <wiTag class="GroupCheckBox" noShow>
             * Передаем название окна\шаблона, которое открываем
             *
             * Пример:
             * <pre>
             *    template: 'myTemplate'
             * </pre>
             * @editor ExternalComponentChooser
             */
            template: '',
            /** @cfg {Object} Опции для комопнента, отображаемом внутри области
             * <wiTag group="Управление">
             * Передаем опции для комопнента, которой будем отображать в окне/диалоге/области по шаблону
             * <b>Опция актуальна только если в качестве шаблона выступает компонент</b>
             *
             * Пример:
             * <pre>
             *    ...
             *    template: 'js!SBIS3.User.Info'
             *    componentOptions: {
             *       firstName: 'John',
             *       secondName: 'Snow',
             *       nationality: 'Westerosi'
             *    }
             *    ...
             * </pre>
             */
            componentOptions: {},
            page: false,
            keepSize: true
         },
         _defaultSize: null,
         _defaultTpl : null,
         _constructorOptions : [],
         _initContextRestriction: ''
      },
      $constructor : function(cfg) {

         this._constructorOptions = $ws.helpers.reduce(cfg, function(memo, v, k){
            memo[k] = 1;
            return memo;
         }, {});
         this._defaultSize = {
            autoHeight : this._options.autoHeight,
            autoWidth: this._options.autoWidth,
            verticalAlignment: this._verticalAlignment,
            horizontalAlignment: this._horizontalAlignment,
            _width: this._options.autoWidth? 'auto': this._container.width(),
            _height: this._options.autoHeight? 'auto': this._container.height()
         };
         this._prepareElements();

         if(this._options.template) {
            this._defaultTpl = this._options.template;
         }

         // запись значений из опций "width", "height" во внутренние свойства
         var propsFromOptions = ['width', 'height'];
         for(var i = 0, l = propsFromOptions.length; i<l; i++) {
            var prop = propsFromOptions[i];
            if (this._options[prop]) {
               this['_' + prop] = this._options[prop];
            }
         }

         if(this._width === "") {
            this._width = this._options.autoWidth ? 'auto' : this._container.width();
         }

         if(this._height === "") {
            this._height = this._options.autoHeight ? 'auto' : this._container.height();
         }
         this._initContextRestriction = this._context.getRestriction();
      },

      /**
       * Создаёт заголовок
       * @protected
       */
      _prepareElements: function(){
         this._title = $('<span />');
      },

      _collectControlsToBuild: function(template, parentId){
         var result = $ws.proto.TemplatedAreaAbstract.superclass._collectControlsToBuild.apply(this, arguments);
         if (template && template instanceof $ws.proto.CompoundControlTemplate && result.length == 1){
            result[0] = $ws.core.merge(result[0], this._options.componentOptions || {});
         }
         return result;
      },

      _setTemplateDimensions: function(dimensions) {
         this._width = dimensions.width;
         this._height = (this._isPage && !this._parent) ? "100%": dimensions.height;
         if((this._options.page || dimensions.height == '100%') && !this._options.autoHeight) {
            this._container.addClass('ws-area-height-100-fix');
         }
      },
      _setMinMaxSizes: function(){
         this._container.css({
            'min-width': this._options.minWidth,
            'min-height': this._options.minHeight,
            'max-width': this._options.maxWidth == Infinity ? '' : this._options.maxWidth,
            'max-height': this._options.maxHeight == Infinity ? '' : this._options.maxHeight
         })
      },

      _restoreTemplateOverridenOptions: function() {
         $ws.helpers.forEach(this._templateOverridenOptions, function(optVal, optName) {
            this._options[optName] = optVal;
         }, this);
         this._templateOverridenOptions = {};
      },
      _updateDocumentTitle: function() {
         var titleTxt = this.getTitle(),
            lastIndex = document.title.lastIndexOf(titleTxt);
         // Если есть что обновлять...
         if(titleTxt && lastIndex == -1) {
            document.title = titleTxt + document.title;
         }
      },
      _clearDocumentTitle: function() {
         var lastIndex = document.title.lastIndexOf(this.getTitle());
         if(lastIndex > 0) {
            document.title = document.title.slice(lastIndex, document.title.length);
         }
      },

      _getTitle : function() {
         return this._title.text();
      },

      _setTitle : function(title) {
         // Удаляем старый title с названия страницы
         this._clearDocumentTitle();
         this._title.attr('title', title)
         this._title.text(title);
         this._updateDocumentTitle();
      },

      /**
       * <wiTag group="Отображение">
       * Получить заголовок окна
       * @return {String} текст заголовка окна
       */
      getTitle : function() {
         return String.trim(this._getTitle());
      },
      /**
       * <wiTag group="Отображение">
       * Изменить заголовок окна
       * @param {String} title заголовок окна
       */
      setTitle : function(title){
         if( title ) {
            // Удаляем старый title с названия страницы
            this._setTitle(title)
         }
      },
      /**
       * Загрузка шаблона
       * Возвращает Deferred, который происходит после завершения инициализации всех контролов.
       * Этот же Deferred генерирует всем onBeforeLoad
       * @param {String|$ws.proto.Template|Document} [templateName] Шаблон для загрузки
       * @returns {$ws.proto.Deferred}
       */
      _loadTemplate : function (templateName, templateOptions) {
         /**
          * Результат загрузки темплейта состоит из:
          *    - загрузки самого файла (attachtemplate)
          *    - инстанцирования всех дочерних контролов (dChildReady)
          *    - и, если эти контролы - контейнеры, инстанцирования всех детей внутри них
          */
         return this._runInBatchUpdate('_loadTemplate ' + templateName + ' - ' + this._id, function() {
            this._isReady = false;
            templateName = templateName || this._options.template;
            var
               _templateName = (typeof templateName == 'string' ? templateName : (templateName.getName ? templateName.getName() : (templateName instanceof $ws.proto.Deferred ? 'Deferred' : "DOM"))),
               block = BOOMR.plugins.WS.startBlock("loadTpl:" +  _templateName),
               self = this,
               dMultiResult = this._createChildrenLoadCallback(), // Это результат загрузки тепмлейта
               errorHandler = this._makeLoadErrorHandler(dMultiResult),// В случае ошибки errorHandler завершит dMultiResult и просигналит на нём эту ошибку
               checkDestroyed = this._createCheckDestroyedFunc('_loadTemplate', _templateName, errorHandler),
               templateHandler = function(template){
                  block.openSyncBlock();
                  // Общая функция обработки шаблона.
                  // Тут шаблон уже готовый, attachTemplate дожидался загрузки обработчиков и стилей
                  if (checkDestroyed(true)) {
                     return;
                  }

                  self._currentTemplateInstance = template;

                  //Удаляем из конфига шаблона опции, перекрытые в конструкторе шаблонной области,
                  // поскольку приоритет опций, переданных в конструкторе, выше, чем у опций шаблона.
                  function removeNonDefaults(newCfg, optVal, optName) {
                     if (this._isOptionDefault(optName)) {
                        newCfg[optName] = optVal;
                     }

                     return newCfg;
                  }

                  //Сохраняем опции, которые собираемся перетереть опциями пришедшего шаблона.
                  //Их нужно будет восстановить на следующей загрузке шаблона, чтобы значения опций, отсутствующих в новом шаблоне,
                  //заменились своими изначальными значениями (после конструктора).
                  function saveOverridingOptions(memo, optVal, optName) {
                     memo[optName] = this._options[optName];
                     return memo;
                  }

                  //Фильтруем конфиг из шаблона. Берем только нужные опции
                  function filterTemplateConfig(obj, val, name){
                     if (Array.indexOf(filter, name) > -1){
                        obj[name] = val;
                     }
                     return obj;
                  }

                  var
                     handlers = template.getDeclaredHandlers(),
                     filter = self._templateOptionsFilter(),
                     templateConfig = template.getConfig(),
                     cfgOptions = $ws.helpers.reduce(templateConfig, filterTemplateConfig, {});

                  if(cfgOptions.resizeable !== undefined) {
                     cfgOptions.resizable = cfgOptions.resizeable;
                     delete cfgOptions.resizeable;
                  }
                  if (!self._context.isGlobal()) {
                     cfgOptions.contextRestriction = cfgOptions.independentContext ? 'setget' : (cfgOptions.contextRestriction || self._initContextRestriction);
                     self._context.setRestriction(cfgOptions.contextRestriction);
                  }

                  var
                     cfg = $ws.helpers.reduce(cfgOptions, removeNonDefaults, {}, self),
                     windowStyle = template.getStyle();

                  //Восстанавливаем опции, заданные в конструкторе, если они были затёрты предыдущим шаблоном
                  self._restoreTemplateOverridenOptions();
                  /*
                   исключаем ситуацию затирания свойства 'enabled' из шаблона значением true; например, в случае,
                   когда контролу проставлен enabled false, а у шаблона стоит по-умолчанию true, получается, что
                   при первоначальной прогрузке конрол не будет задизайблен
                   */
                  if (cfg.enabled && !self._options.enabled) {
                     delete cfg.enabled;
                  }
                  //Сохраняем опции, которые собираемся перетереть опциями пришедшего шаблона
                  self._templateOverridenOptions = $ws.helpers.reduce(cfg, saveOverridingOptions, {}, self);

                  //если имени нет, берём его прямо из поля windowName нефильтрованного конфига шаблона.
                  //в фильтр его не заносим, чтобы не засорять опции
                  if(!self._options.name)
                     self._options.name = templateConfig.windowName;

                  self._options.autoHeight = self._defaultSize.autoHeight;
                  self._options.autoWidth = self._defaultSize.autoWidth;
                  // сбросим inline стили width, height, min-width, min-height
                  self._container.width('').height('').css({'min-width':'', 'min-height':'','max-width':'','max-height':''});
                  self._options = $ws.core.merge(self._options, cfg); // здесь мы также замержили опции autoWidth, autoHeight, maxWidth, maxHeight, minWidth, minHeight (!)
                  var dimensions = template.getDimensions();
                  if (self._options.keepSize) {// брать размеры шаблона

                     //В случае, если нужно брать размеры по содержимому шаблона, автоширину и автовысоту надо брать в любом случае из шаблона,
                     //даже если в конструкторе эти опции переданы.
                     //Однако, автовысоту и автоширину опции шаблона выключать не должны, поскольку это приводит к лишним мучениям
                     //с установкой размеров у окон в xaml-е, и у компонентов - шаблонов.
                     //В xaml-окне с фикс. высотой всё равно есть фиксированная сетка, а компонент-шаблон обычно сделан под автовысоту,
                     //или же ставит себе мин. высоту стилями.
                     if (templateConfig.autoWidth) {
                        self._options.autoWidth = true;
                     }

                     if (templateConfig.autoHeight) {
                        self._options.autoHeight = true;
                     }

                     if (self._horizontalAlignment !== 'Stretch') {
                        self._container.css({ width:self._options.autoWidth ? 'auto' : dimensions.width});
                     } else {
                        //TODO: (***) переделать: костыль, исправляющий такую проблему:
                        //при загрузке шаблона без автоширины область перестаёт тянуться по ширине.
                        //включаем автоширину для растягивания (ту, что в конструкторе задана).
                        //После релиза 3.3 надо переделать так, чтобы во всех контролах растягивание не зависело от авторазмера
                        //Это и потому надо переделать, что при смене шаблона с автоширинного на не автоширинный
                        //css у шаблонной области не меняется, и привязки к краям (растягивание) не отменяются
                        self._options.autoWidth = self._options.autoWidth || self._defaultSize.autoWidth;
                     }
                     if (self._verticalAlignment !== 'Stretch') {
                        self._container.css({ height:self._options.autoHeight ? 'auto' : dimensions.height});
                     } else {
                        //TODO: (***)
                        self._options.autoHeight = self._options.autoHeight || self._defaultSize.autoHeight;
                     }
                  } else {// оставлять собственные размеры
                     self._options.autoHeight = self._defaultSize.autoHeight;
                     self._options.autoWidth = self._defaultSize.autoWidth;
                     self._options.maxWidth = Infinity;
                     self._options.minWidth = 0;
                     self._options.maxHeight = Infinity;
                     self._options.minHeight = 0;
                  }
                  // преобразуем опции размеров в числовой тип
                  self._initSizeOptions();
                  self._setMinMaxSizes();
                  self._isPage = template.isPage();

                  // Подпишем инстанс области на все, что можно, все что было определено
                  var i, j, ln;
                  for(i in handlers) {
                     if(handlers.hasOwnProperty(i)) {
                        if (typeof handlers[i] === 'function')
                           self.subscribe(i, handlers[i]);
                        else {
                           ln = handlers[i].length || 0;
                           for (j = 0; j !== ln; j++) {
                              self.subscribe(i, handlers[i][j]);
                           }
                        }
                     }
                  }

                  var
                     containerStyles = (self._container.attr('style') || "").replace(/background-color:.+?;/ig, ""),
                     title = template.getTitle() || '',
                     titleStyles =  windowStyle.replace(/background-color:#.+?;/ig, "");

                  if (self._isOptionDefault('title')) {
                     self._title.html($ws.helpers.escapeHtml(title)).attr('style', titleStyles);
                     self._options.title = title;
                  }
                  if (self._options.page){
                     self.setTitle(title);
                  }

                  self._container.attr('style', containerStyles + ';' + windowStyle);

                  if (!self._hasMarkup()) {
                     if (self._resizer) {
                        //при вставке вёрстки ресайзер может не убиться из-за каких-нибудь особенностей поведения шаблона. 
                        //надо его прибить самим для надёжности
                        self._resizer.remove();
                        self._resizer = null;                        
                     }

                     template.createMarkup(self._container, templateOptions);
                  }
                  self._setTemplateDimensions(template.getDimensions());


                  self._delayToConstructionFinished('_loadControls', true, function() {
                     block.openSyncBlock();
                     //onBeforeControlsLoad нужно стрелять непосредственно перед загрузкой контролов, после подписки на события шаблона
                     //До загрузки шаблона его стрелять нельзя, поскольку не загружены ещё его обработчики
                     self._notify('onBeforeControlsLoad');

                     self._loadControls(dMultiResult, template, undefined, checkDestroyed, errorHandler);
                     block.closeSyncBlock();
                  });
                  block.closeSyncBlock();
               },
               dMultiResultCloseSpan = function(result){ block.close(); return result;};

            dMultiResult.getResult().addErrback(dMultiResultCloseSpan);
            this._container.attr('templatename', _templateName);

            try {
               checkDestroyed();
               /**
                * Вот только здесь начинается сам процесс загрузки.
                * До этого - подготовка цепочек и прочего...
                */
               block.openSyncBlock();
               this._notify('onBeforeLoad');
               block.closeSyncBlock();

               $ws.core.attachComponent('Source').addCallbacks(function() {
                  if (checkDestroyed(true)) {
                     return;
                  }

                  if(typeof(templateName) === 'string' || !templateName) { // Строка - имя темплейта
                     var tpl = (templateName == self._defaultTpl && self._hasMarkup()) ? String.trim(self.getContainer()[0].outerHTML) : undefined;
                     $ws.core.attachTemplate(templateName, {
                        fast: $ws._const.fasttemplate,
                        html: tpl
                     }).addCallback(templateHandler)
                       .addErrback(errorHandler);//обрабатываем ошибку в случае исключения в templateHandler
                  }
                  else if( templateName instanceof $ws.proto.Deferred ){
                     templateName.addCallback( function( template ){
                        self._options.template = template.getName(); // Задаем имя шаблона (хотя наверно можно и сам шаблон)
                        return template;
                     } ).addCallbacks(templateHandler, errorHandler)
                        .addErrback(errorHandler);//обрабатываем ошибку в случае исключения в templateHandler
                  }
                  else if(templateName instanceof $ws.proto.Template) // Или готовый темплейт
                     templateHandler(templateName);
                  else
                     templateHandler(new $ws.proto.Template({  // Или DOM-документ
                        templateXML: templateName
                     }));
               }, errorHandler).addErrback(errorHandler);

               dMultiResult.getResult().addCallback(dMultiResultCloseSpan);
            } catch (e) {
               errorHandler(e);//В случае исключения нужно точно так же сигналить ошибку в результате функции _loadTemplate, как и в других случаях.
            }

            return dMultiResult.getResult().createDependent();
         });
      },

      /**
       * <wiTag group="Управление">
       * Возвращает имя шаблона области
       * @return {String} имя шаблона
       */
      getTemplateName: function(){
         return this._options.template._templateName;
      },
      /**
       * <wiTag group="Управление">
       * Возвращает имя текущего установленного в область шаблона.
       * @returns {String}
       * @example
       * <pre>
       *     class.getCurrentTemplateName();
       * </pre>
       */
      getCurrentTemplateName: function() {
         var tpl = this._options.template,
             tplName = tpl instanceof $ws.proto.Template ? tpl.getName() : tpl;
         if(tplName.indexOf("pre--") !== -1)
            tplName = tplName.substr(5);
         return tplName;
      },

      _isOptionDefault: function(option) {
         return !(option in this._constructorOptions);
      },

      /**
       * Возвращает массив опций, которые нужно получить от шаблона
       * Нуобходимо переопределить, дополнив массив, если от шаблона, нужны дополнительные опции
       * @private
       */
      _templateOptionsFilter: function(){
         return ['isRelativeTemplate', 'height', 'minHeight', 'maxHeight', 'enabled', 'autoHeight', 'width', 'minWidth', 'maxWidth', 'autoWidth', 'title', 'independentContext', 'contextRestriction'];
      },

      destroy: function() {
         this._currentTemplateInstance = null;
         $ws.proto.TemplatedAreaAbstract.superclass.destroy.apply(this, arguments);
      }
   });

   return $ws.proto.TemplatedAreaAbstract;
});
