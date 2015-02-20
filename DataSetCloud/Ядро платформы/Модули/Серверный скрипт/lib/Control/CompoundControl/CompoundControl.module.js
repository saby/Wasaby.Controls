/**
 * Модуль "Составной компонент".
 *
 * @description
 */
define('js!SBIS3.CORE.CompoundControl', ['js!SBIS3.CORE.AreaAbstract', 'js!SBIS3.CORE.AttributeCfgParser'], function(AreaAbstract, attributeCfgParser){

   /**
    * @class $ws.proto.CompoundControl
    * @extends $ws.proto.AreaAbstract
    */
   $ws.proto.CompoundControl = AreaAbstract.extend(/** @lends $ws.proto.CompoundControl.prototype */{
      $protected : {
         _options : {
            isRelativeTemplate: true,
            autoHeight: true
         },
         /**
          * Селектор, по которому будут инстанцироваться дочерние компоненты при инициализации
          * Некоторые дочерние компоненты могут инстанцироваться отложенно
          * В случае, если данные селектор равен пустой строке, будут инстанцироваться все дочерние
          */
         _createChildOnInitSelector: '',
         _childEventBusHashMap : {}
      },

      $constructor: function(){
         // создаём eventBus-ы для компонентов, которые будут инстанцироваться при инициализации
         this._prepareControlsConfig(this._createChildOnInitSelector, true);
      },

      init: function() {
         this._markupDataBinding();
         $ws.proto.CompoundControl.superclass.init.apply(this, arguments);
      },

      /**
       * Возвращает EventBus дочернего комопнента
       * @param {String} name имя
       * @returns {$ws.single.EventBus}
       */
      getEventBusOf: function(name){
         var eventBus = null;

         if (this._childEventBusHashMap[name]) {
            var eventBusId = this._childEventBusHashMap[name];
            if ($ws.single.EventBus.hasChannel(eventBusId)){
               eventBus = $ws.single.EventBus.channel(eventBusId);
            }
         }

         if (eventBus === null){
            throw new Error('Component with name "' + name + '" doesn`t exists in CompoundComponent with name "' + this.getName() + '"');
         }
         else{
            return eventBus;
         }
      },

      /**
       * Пересчёт своего размера и внутренней раскладки по событию изменения дочерних компонентов.
       * В базовом классе, который описывает общий случай, не зная вёрстки, мы не знаем, привело ли изменение в дочернем контроле к изменению размеров родителя, или нет.
       * Поэтому всегда считаем, что изменение есть.
       * @private
       */
      _onSizeChangedBatch: function() {
         return this._haveAutoSize() && (this._horizontalAlignment !== 'Stretch' || this._verticalAlignment !== 'Stretch');
      },

      /**
       * Подготавливаем конфигурацию компонентов, строим eventBus для всех, у кого есть имя
       * @private
       */
      _prepareControlsConfig: function(selector, noRevive){
         var
            root = this._container,
            collection = $ws.helpers.getChildContainers(root, selector || '[data-component]'),
            configArray = [],
            cfg,
            cName;

         for (var i = 0, l = collection.length; i < l; i++){
            cName = collection[i].getAttribute('data-component');

            if (cName){
               cfg = $ws.helpers.parseMarkup(collection[i], null, noRevive);
               // для компонентов с одинаковым непустым name создаётся один eventBus
               cfg.eventBusId = (cfg.name && this._childEventBusHashMap[cfg.name]) ?
                  this._childEventBusHashMap[cfg.name] : $ws.helpers.randomId();

               configArray.push({
                  ctor: require('js!' + cName),
                  cfg: cfg,
                  cName: cName
               });

               if (cfg.name && !this._childEventBusHashMap[cfg.name]){
                  $ws.single.EventBus.channel(cfg.eventBusId, {
                     waitForPermit: true
                  });
                  this._childEventBusHashMap[cfg.name] = cfg.eventBusId;
               }
            }
         }

         return configArray;
      },

      /**
       * Во время инициализации инстанцирует компоненты, указанные в разметке составного комопнента.
       * Если у текущего компонента в protected-свойстве _createChildOnInitSelector указан селектор, по которому
       * инстанцировать дочерние при инициализации, то инстанцирует по нему. Иначе инстанцирует все дочерние.
       * В отличие от метода AreaAbstract._loadControls, конфиг компонентов берёт не из родительского шаблона (currentTemplate), а из разметки,
       * и создаёт их синхронно, надеясь на то, что все зависимости уже указаны в define и загружены.
       * Теоретически, потом можно для большей скорости брать из шаблона.
       * @private
       */
      _loadControls: function(pdResult, template, parentId, checkDestroyed, errorHandler) {
         return this._loadControlsBySelector(pdResult, template, this._createChildOnInitSelector);
      },

      /**
       * Инстанцирует все компоненты, указанные в разметке составного комопнента, по селектору
       * @private
       */
      _loadControlsBySelector: function(pdResult, template, selector) {
         return this._runInBatchUpdate('_loadControls', function() {
            var
               configArray = this._prepareControlsConfig(selector),
               instancesArray = [],
               inst,
               cObj,
               cfg,
               Ctor,
               block;

            for (var i = 0, l = configArray.length; i < l; i ++){
               cObj = configArray[i];
               block = BOOMR.plugins.WS.startBlock('createControl:' + cObj.cName);
               cfg  = cObj.cfg;
               Ctor = cObj.ctor;

               cfg.linkedContext = this.getLinkedContext();
               cfg.parent = cfg.parent || this;
               cfg.currentTemplate = template;

               block.openSyncBlock();
               inst = new Ctor(cfg);
               block.closeSyncBlock();
               block.close();
               instancesArray.push(inst);

               if($ws.helpers.instanceOfModule(inst, 'SBIS3.CORE.AreaAbstract')){
                  this._dChildReady.push(inst.getReadyDeferred());
               }
            }

            return pdResult.done(instancesArray);
         });
      },

      /**
       * Осуществляет привязку атрибутов вложенных элементов разметки к полям из контекста
       * @private
       */
      _markupDataBinding : function(){
         var
            hardTypes = {'attr':0,'css':0,'style':0},
            context = this.getLinkedContext(),
            elements = $ws.helpers.getChildContainers(this._container, '[data-bind]');

         function changeElement(element, value, property, subProperty){
            switch (property){
               case 'text' :
                  element.html($ws.helpers.escapeHtml(value));
                  break;
               case 'html' :
                  element.html(value);
                  break;
               case 'attr' :
                  if (subProperty){
                     element.attr(subProperty, value);
                  }
                  break;
               case 'css' :
                  if (subProperty){
                     element.toggleClass(subProperty, !!value);
                  }
                  break;
               case 'style' :
                  if (subProperty){
                     element.css(subProperty, value);
                  }
                  break;
               case 'visible' :
                  changeElement(element, !value, 'css', 'ws-hidden');
                  break;
            }
         }

         function bind(element, field, property, subProperty){
            var curValue = context.getValue(field) || '';
            changeElement(element, curValue, property, subProperty);

            context.subscribe('onFieldChange', function(e, f, v){
               if (f == field){
                  changeElement(element, v, property, subProperty);
               }
            });
         }

         for (var e = 0, l = elements.length; e < l; e++){
            var
               element = $(elements[e]),
               dataBindCfg = attributeCfgParser(element.attr('data-bind') || '');

            for (var i in dataBindCfg){
               if (dataBindCfg.hasOwnProperty(i)){
                  if (i in hardTypes){
                     var nestedCfg = dataBindCfg[i];
                     for (var j in nestedCfg){
                        if (nestedCfg.hasOwnProperty(j)){
                           bind(element, nestedCfg[j], i, j);
                        }
                     }
                  }
                  else{
                     bind(element, dataBindCfg[i], i);
                  }
               }
            }
         }
      },

      /**
       * Тут мы пока не можем посчитать мин. размеры через дочерние контролы, поскольку не знаем, какая тут вёрстка: абсолютная или ещё какая.
       * Старая модель расчёта мин. размеров (как у AreaAbstract) тут не годится.
       * @private
       */
      _calcMinHeight: function() { return this._options.minHeight; },

      /**
       * Тут мы пока не можем посчитать мин. размеры через дочерние контролы, поскольку не знаем, какая тут вёрстка: абсолютная или ещё какая.
       * Старая модель расчёта мин. размеров (как у AreaAbstract) тут не годится.
       * @private
       */
      _calcMinWidth: function() { return this._options.minWidth; }
   });

   return $ws.proto.CompoundControl;
});