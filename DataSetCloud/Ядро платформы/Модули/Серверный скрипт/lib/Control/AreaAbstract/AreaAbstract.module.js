/**
 * Модуль "Компонент Абстрактная область-контейнер".
 *
 * @description
 */
define('js!SBIS3.CORE.AreaAbstract', ['js!SBIS3.CORE.Control', 'css!SBIS3.CORE.AreaAbstract'], function( control ) {

   'use strict';

   control.ControlBatchUpdater.registerDelayedAction('AreaAbstract.activateSiblingControlOrSelf', function(area, isShiftKey, searchFrom) {
      if (!area.isDestroyed()) {
         area._activateSiblingControlOrSelfLow(isShiftKey, searchFrom);
      }
   }, 'FocusActions');

   function sortControlsByTabIndex(a, b) {
      if (a && b) {
         var vA = +a.tabindex,
             vB = +b.tabindex;

         if (isNaN(vA) || vA == -1) {
            return 1;
         }

         if (isNaN(vB) || vB == -1) {
            return -1;
         }

         return vA - vB;
      } else {
         return 0;
      }
   }


   var GroupWrapper = $ws.core.extend({},{
      $protected: {
         _group: []
      },
      $constructor: function(group) {
         this._group = group;
      },
      _setEnabled: function(enabled) {

      },
      setVisible: function(visible) {

      },
      getGroupContainers: function() {

      },
      destroy: function() {
         this._group = null;
      }
   });

   /**
    * Так должен себя вести обычный Deferred:
    * если обработчик в цепочке вернул undefined, то отдавать дальше в цепочку не undefined, а предыдущее значение.
    * А то стандартное поведение неочевидно, и сильно портит жизнь прикладникам, особенно когда они подписываются на
    * waitChildByName, и забывают отдавать входной результат.
    */
   var DeferredForWaiters = (function() {
      var
          Deferred = $ws.proto.Deferred,
          DeferredForWaiters = function() {
             Deferred.call(this);
          },
          addCallbacksBase = Deferred.prototype.addCallbacks;

      function ignoreUndefined(cbk) {
         return cbk && function(res) {
            var newRes = cbk(res);
            return newRes === undefined ? res : newRes;
         };
      }

      $ws.core.classicExtend(DeferredForWaiters, Deferred);

      DeferredForWaiters.prototype.addCallbacks = function(cb, eb) {
         return addCallbacksBase.call(this, ignoreUndefined(cb), ignoreUndefined(eb));
      };

      return DeferredForWaiters;
   })();

   /**
    * Абстрактная область-контейнер
    *
    * @class $ws.proto.AreaAbstract
    * @extends $ws.proto.Control
    * @ignoreOptions tooltip extendedTooltip
    *
    */
   $ws.proto.AreaAbstract = control.Control.extend(/** @lends $ws.proto.AreaAbstract.prototype */{
      /**
       * @event onResize При изменении размеров контейнера
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    control.subscribe('onResize', function(event) {
       *       $ws.core.alert('Зачем ты меняешь мои размеры? Тебе разве не нравится, как я выгляжу?');
       *    });
       * </pre>
       * @see setSize
       */
      /**
       * @event onReady При полной готовности области
       * Все контролы внутри уже построились и готовы.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    control.subscribe('onReady', function(event) {
       *       $ws.core.alert(this.getName()+ ' Готов к труду и обороне!');
       *    });
       * </pre>
       */
      /**
       * <wiTag class="GroupCheckBox" noShow>
       * @event onActivate При переходе фокуса в область
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    control.subscribe('onActivate', function(event) {
       *       this.setValue('Im activated');
       *       event.setResult(true);
       *    });
       * </pre>
       * @see tabindex
       */
      /**
       * @event onBeforeControlsLoad Перед началом загрузки контролов
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    control.subscribe('onBeforeControlsLoad', function(event) {
       *       log('Контролы еще не загружены');
       *    });
       * </pre>
       * @see onAfterLoad
       * @see onBeforeLoad
       */
      /**
       * @event onBeforeShow Перед открытием области
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    control.subscribe('onBeforeShow', function(event) {
       *       alert(this.getName() + ': Меня еще не видно, но я уже загрузился');
       *    });
       * </pre>
       * @see onBeforeShow
       */
      /**
       * @event onAfterShow После открытия области
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    control.subscribe('onAfterShow', function(event) {
       *       alert(this.getName() + ': вот я во всей своей красе!');
       *    });
       * </pre>
       * @see onAfterShow
       */
      /**
       * @event onBeforeLoad Перед загрузкой данных области
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    control.subscribe('onBeforeLoad', function(event) {
       *       alert(this.getName() + ': Трепещите! Я начинаю загружаться.');
       *    });
       * </pre>
       * @see onAfterLoad
       * @see onBeforeControlsLoad
       */
      /**
       * @event onAfterLoad После загрузки данных области
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    control.subscribe('onAfterLoad', function(event) {
       *       this.setValue('Im loaded');
       *       event.setResult(true);
       *    });
       * </pre>
       * @see onBeforeLoad
       * @see onBeforeControlsLoad
       */
      $protected: {
         _horizontalAlignment: 'Left',

         _options: {
            /**
             * @cfg {$ws.proto.Context|false} Контекст
             * <wiTag group="Данные">
             * Свой собственный контекст данной области.
             * Если не передан, создастся новый из предыдущего (родительского) контекста.
             * Если нет родителя (не передали), то создаётся из Глобального контекста.
             * @see independentContext
             * @noShow
             */
            context: false,
            /**
             * @cfg {Boolean} Независимый контекст
             * <wiTag group="Управление">
             * Возможность установить для данной области независимый контекст. 
             * ВНИМАНИЕ! Может испортить контекст, переданный в опции {@link context} и {@link $ws.proto.Control#linkedContext}, 
             * поменяв предка контексту! Передавайте данные объектом. 
             * Будет создан новый контекст, зависимый от глобального. Т.е. контролы смогут обмениваться информацией с 
             * внешним миром, если в глобальном контексте присутствует устанавливаемое локально значение.
             * @see context
             */
            independentContext: false,
            /**
             * @cfg {String} ограничить контекст
             * <wiTag group="Управление">
             * Возможность установить для контекста данной области ограничения.
             * Работа только с текущим контекстом, игнорируется previousContext
             * Если значение set, то запись происходит только в текущий контекст, чтение не ограничено
             * Если значение setget, то запись происходит только в текущий контекст, чтение только из текущего контекста
             * @see context
             */
            contextRestriction: '',
            /**
             * @cfg {Object} Заменить контекст ( $ws.proto.Context )
             * <wiTag group="Данные">
             * @noShow
             */
            record: false,
            /**
             * <wiTag noShow>
             */
            groups: {},
            /**
             * <wiTag noShow>
             */
            tabindex: 1,
            /**
             * @cfg {Boolean} Модальность
             * <wiTag noShow>
             * ToDo: опция должна находиться в классе Window. Необходим рефакторинг.
             */
            modal: false,

            currentTemplate: '',
            isRelativeTemplate: false,
            children: [],
            _doGridCalculation: false
         },
         _pending: [],
         _waiting: [],
         _groupInstances: {},
         _contextName : '',
         _rigisteredControls: 0,
         _activeChildControl: -1,      //Табиндекс контрола, на котором находится фокус.
                                       //Если для контрола запрещён табиндекс, то это его номер в массиве дочерних контролов.
         _activatedWithTabindex: true, //true - означает, что _activeChildControl является табиндексом контрола, на котором находится фокус.
         _childControls: [],           //Массив child'ов
         _childNonControls: [],        //Массив non-child'ов (всякий текст)
         _childsMapName: {},           //Мап с child'ами по имени
         _childsMapId: {},             //Мап с child'ами по id
         _childContainers: [],         //Массив детей-контейнеров для рекурсивного поиска
         _childsTabindex : false,
         _childsSizes: {},
         _maxTabindex : false,
         _dChildReady : null,
         _keysWeHandle: [
            $ws._const.key.tab,
            $ws._const.key.enter
         ],
         _resizer: null,
         _toolbarCount: {'top': 0, 'right': 0, 'bottom': 0, 'left': 0},  //Хранит инфу о количестве тулбаров, лежащей в ней
         _defaultButton: null,
         _craftedContext: false,       //Индикатор того, что контекст мы изготовили сами и можно его уничтожить
         _activationIndex: 0,          //Индекс последней активации области
         _opener: undefined,           //Контрол, который открыл окно, но может не являться родителем области
         _isModal: false,
         _isReady: false,
         _waitersByName: {},
         _waitersById: {},
         _fakeFocusDiv: null, //Див, создаваемый и фокусируемый тогда,
                              //когда области некому отдать фокус, а себе нельзя - Хром и IE могут прокрутить
                              //родительский блок вниз, если места в видимой области экрана не хватает для всей области.
         _onDestroyOpener: null,
         _isInitComplete: false //Флаг отвечающий за прохождение _initComplete
      },
      $constructor: function(cfg) {
         var self = this;
         this._publish('onResize', 'onActivate', 'onBeforeShow', 'onAfterShow', 'onBeforeLoad', 'onAfterLoad', 'onBeforeControlsLoad', 'onBatchFinished');

         this._isModal = this._options.modal;
         this._dChildReady = new $ws.proto.ParallelDeferred();

         this._setContext();

         if (!this._isCorrectContainer()) {
            this._container = $('<div></div>', {tabindex: this._options.tabindex >= 0 ? 0 : -1 })
               .bind('click', this._onClickHandler.bind(this));
            this._container[0].wsControl = this;
            if (this._options.cssClassName) {
               this._container.addClass(this._options.cssClassName);
            }

            this._initKeyboardMonitor();
         }

         /* Обработка клика на Area. Вызывает активацию текущей Area.
          Если Area находится на окне, то окно должно "видвинутся" вперед.
          ($.events.props используется для того, чтобы не использовать остановку события,
          но предотвратить его всплытие(обработку) во всех родительских Area.
          При клике на Area устанавливается флаг, а когда событие завершается - флаг снимается.)
          */
         this._container.bind('mousedown.activate', function() {
            if (!$.event.props['ws-area-activated-id']) {
               // move window or closest parent window to Top.
               var parent = self.findParent(function(parent) {
                  return ($ws.helpers.instanceOfModule(parent, 'SBIS3.CORE.Window')) || ($ws.helpers.instanceOfModule(parent, 'SBIS3.CORE.FloatArea'));
               });
               if (parent) {
                  parent.moveToTop();
               }
               // Рассылаем кастомное jQ сообщение о клике на контейнер
               self._container.trigger('container-clicked');
               $.event.props['ws-area-activated-id'] = self.getId();
            }
         });
         $ws._const.$doc.bind('mousedown.' +  this.getId(), function() {
            if (self.getId() == $.event.props['ws-area-activated-id']) {
               $.event.props['ws-area-activated-id'] = null;
            }
         });

         //Если ареа имеет предка, то он уже будет подписан на онресайз и событие произойдёт больше одного раза
         if (!this.getParent()) {
            this._subscribeToWindowResize();
         }

         this._container.addClass('ws-area');
         this._dChildReady.getResult().addCallback(function() {
            self._childNonControls = self._container.children($ws.helpers.NON_CTRL);
         });

         this.setOpener(cfg && cfg.opener);
      },

      /**
       * Устанавливает контекст
       * @protected
       */
      _setContext: function() {
         // Нам всегда придет какой-то контекст.
         // Или глобальный (об этом позаботился Control)
         // или какой-то если его указали в параметре конфигурации

         // Кто-то создал Area и передал в опции готовый контекст
         if (this._options.context instanceof $ws.proto.Context) {
            // если пришел корректный контекст, то используем его
            this._context = this._options.context;
            this._options.context = null;
            delete this._options['context'];
         } else {
            // не передали в опции валидный контекст _context - от {$ws.proto.Control}
            // Если _context был глобальный (это значит что у Control тоже не было),
            // то создаем новый свой с previous = Global,
            // иначе создаем свой и предыдущий - контекст родителя или Global если нет парента
            this._craftedContext = true;
            this._context = this._context.isGlobal() ? new $ws.proto.Context() : this._createDependentContext();
         }

         // если нам нужен изолированный контекст, то изолируем его
         this._context.setRestriction(this._options.independentContext ? 'setget' : (this._options.contextRestriction || this._context.getRestriction()));

         if ($ws.proto.Record && this._options.context instanceof $ws.proto.Record) {
            this._context.replaceRecord(this._options.context);
         } else if (this._options.context && typeof(this._options.context) == 'object') {
            // Если нам передали объект, то вставим его в текущий контекст
            this._context.setValue(this._options.context, true);
         }
         // Если нам передали и запись, то вставим ее в текущий контекст
         // Предыдущий record будет потерян, значения из record перезатрут старые
         if (this._options.record) {
            this._context.replaceRecord(this._options.record);
         }
      },

      /**
       * Создает новый контекст, с уже установленым предком
       * @protected
       */
      _createDependentContext: function() {
         var parentContext = this._parent ? this._parent.getLinkedContext() : $ws.single.GlobalContext;
         return parentContext.createDependent();
      },

      /**
       * Подписка на изменение размера окна браузера. Некоторым наследникам, например, FloatArea, нужно его переопределить,
       * (FloatArea выключает эту подписку).
       * @private
       */
      _subscribeToWindowResize: function() {
         $ws._const.$win.bind('resize.' + this.getId(), this._onResizeHandler.bind(this));
      },

      /**
       * <wiTag group="Управление">
       * Добавить отложенную асинхронную операцию в очередь ожидания окна.
       * @param {$ws.proto.Deferred} dOperation Отложенная операция.
       * @returns {Boolean} "true", если добавление операции в очередь успешно.
       * @see waitAllPendingOperations
       */
      addPendingOperation: function(dOperation) {
         var result = !!(dOperation && (dOperation instanceof $ws.proto.Deferred));
         if (result) {
            this._pending.push(dOperation);
            dOperation.addBoth(this._checkPendingOperations.bind(this));
         } 
         return result;
      },
      /**
       * <wiTag group="Управление">
       * Добавить асинхронное событие на завершение всех отложенных операций.
       * Добавить асинхронное событие, которое сработает в момент завершения всех отложенных операций,
       * добавленных с помощью {@link addPendingOperation}.
       * Если очередь пуста, то сработает сразу.
       * Если попытаться передать Deferred, находящийся в каком-либо состоянии (успех, ошибка), то метод вернет false и
       * ожидающий не будет добавлен в очередь.
       * @param {$ws.proto.Deferred} dNotify Deferred-объект, ожидающий завершения всех отложенных операций.
       * @returns {Boolean} "true", если добавление в очередь ожидающих успешно.
       * @see addPendingOperation
       */
      waitAllPendingOperations: function(dNotify) {
         if(dNotify && (dNotify instanceof $ws.proto.Deferred) && !dNotify.isReady()) {
            if(this._pending.length === 0)
               dNotify.callback();
            else
               this._waiting.push(dNotify);
            return true;
         } else
            return false;
      },
      _checkPendingOperations: function(res) {
         var totalOps = this._pending.length, result;

         // Сперва отберем Deferred, которые завершились
         result = $ws.helpers.filter(this._pending, function(dfr){
            return dfr.isReady();
         });

         // Затем получим их результаты
         result = $ws.helpers.map(result, function(dfr) {
            return dfr.getResult();
         });

         // If every waiting op is completed
         if(result.length == totalOps) {
            this._pending = [];
            while(this._waiting.length > 0) {
               this._waiting.pop().callback(result);
            }
         }
         // if res instanceof Error, return it as non-captured
         return res;
      },

      init: function() {
         $ws.single.WindowManager.addWindow(this);

         $ws.proto.AreaAbstract.superclass.init.apply(this, arguments);

         this._runInBatchUpdate('AreaAbstract - init - ' + this._id, function() {
            return $ws.helpers.callbackWrapper(this._loadDescendents(),
                                               this._childrenLoadCallback.bind(this));
         });
      },

      /**
       * <wiTag group="Управление">
       * Переустановка opener-а. Нужно для классов-наследников вроде плавающих панелей или окон, которым может быть нужно
       * перед показом панели переустановить opener-а, поскольку старый удалился по какой-то причине (например, шаблон переустановили или ещё что).
       * В этом случае, по событию onDestroy, область автоматически отвяжется от opener-а, и перед повторным показом области (наследника AreaAbstract - плавающей панели или окна)
       * нужно будет установить нового opener-а. Это и можно сделать с помощью метода setOpener.
       * Для примера смотри метод $ws.helpers.showFloatArea.
       * @param {$ws.proto.Control} opener
       * @see opener
       */
      setOpener: function(opener) {
         if (this._opener) {
            this._opener.unsubscribe('onDestroy', this._onDestroyOpener);
         }

         this._opener = opener;
         if(this._opener){
            if (!this._onDestroyOpener) {
               this._onDestroyOpener = this.setOpener.bind(this, undefined);
            }

            this._opener.once('onDestroy', this._onDestroyOpener);

            if (this._opener.getContainer()) {
               this._opener.getContainer().trigger('wsWindowOpen', this);
            }
         }
      },

      _childrenLoadCallback: function() {
         this._notify('onBeforeShow');
         this._notifyBatchDelayed('onAfterShow');
      },

      _createCheckDestroyedFunc: function(funcName, areaName, errorHandler) {
         var self = this;
         return function(silent) {
            if(self.isDestroyed()){
               var err = new Error(funcName + ": Область " + areaName + ", id = " + self._id + " была уничтожена до начала создания дочерних контролов.");
               if (silent) {
                  err.silent = true;
                  errorHandler(err, true);
               } else {
                  //Область уже уничтожена (во время загрузки шаблона), кидаем ошибку,
                  // которая вернётся в деферреде setTemplate/prepareTemplate и других функциях, пользующихся _loadTemplate
                  throw err;
               }
            }
            return self.isDestroyed();
         }
      },

      _makeLoadErrorHandler: function(parallelDeferred) {
         return function(e) {
            if (!e.silent) {
               var message = e.message;
               if(e instanceof HTTPError){
                  message += ', ' + e.url;
               }

               var indicatorMsg = '<div class="ws-area-service"><p>Ошибка при попытке загрузки ресурса. ' +
                                  '</p><p>Описание ошибки: ' + e.message + '</p></div>';

               $ws.single.ioc.resolve('ILogger').error("AreaAbstract", "Ошибка при загрузке дочерних компонентов (" + message + ")");
               this._container.find('.ws-loading-indicator-outer').remove().end().append(indicatorMsg);
            }

            try {
               var errorDeferred = new $ws.proto.Deferred();
               errorDeferred.errback(e);

               parallelDeferred.push(errorDeferred);//Передаём ошибку в виде деферреда, ибо иначе никак
               parallelDeferred.done();
            } catch (err) {
               BOOMR.plugins.WS.reportError(err);//Игнорируем ошибку, чтоб не испортить обработку ошибок, которой была вызвана эта функция
            }
            return e;
         }.bind(this);
      },

      _createChildrenLoadCallback: function() {
         var
            self = this,
            pdResult = new $ws.proto.ParallelDeferred(),
            innerCallback = this._dChildReady.getResult().addCallback(this._templateInnerCallback.bind(this)).createDependent();

         pdResult.getResult().addErrback(function (e) {
            //Для родительского контейнера: нужно _dChildReady засигналить ошибкой, а то его родитель ждёт.
            //Ошибка пройдёт в родительский _dChildReady и выше.
            //
            //addErrback нужно добавлять первым, чтобы ошибка в _templateInnerCallback не вызывала бы этот код, и не было бы второго done у _dChildReady
            var errorDeferred = new $ws.proto.Deferred();
            self._dChildReady.push(errorDeferred.errback(e)).done();
            return e;
         }).addCallback(function () {
            self._dChildReady.done();
            return innerCallback;
         });

         return pdResult;
      },

      _showControls: function(){
         this._notify('onAfterLoad');
      },

      _collectControlsToBuild: function(template, parentId){
         var result = this._options.children;
         if (!result.length && template) {
            result = template.getControls(parentId, this.getContainer());
         }
         return result;
      },
      /**
       * Отдает список контролов для построения в порядке tabindex (если указан)
       * @param {String} template
       * @param {String} parentId
       * @returns {Array}
       * @private
       */
      _getControlsToBuild: function(template, parentId) {
         var
            block = BOOMR.plugins.WS.startBlock('_getControlsToBuild', true),
            result = this._collectControlsToBuild(template, parentId);

         if (!template || template.needSetZindexByOrder()) {
            result = $ws.helpers.map(result, function(i, idx){
               i.zIndex = ('zIndex' in i) ? i.zIndex : idx + 1;
               return i;
            });
         }

         result = result.sort(sortControlsByTabIndex);
         block.close();
         return result;
      },

      _loadControls: function(pdResult, template, parentId, checkDestroyed, errorHandler) {
         return this._runInBatchUpdate('_loadControls - ' + this._id, function() {
            var
               self = this,
               controls = this._getControlsToBuild(template, parentId),
               jsModRegex = /js!/;

            controls = $ws.helpers.map($ws.core.clone(controls), function(control){
               var type = control.type,
                   typeDesc,
                   result;

               if (jsModRegex.test(type)) {
                  result = {
                     ctor: require(type),
                     config: control
                  };
               } else {
                  typeDesc = $ws.core.extractComponentPath(type);

                  result = {
                     ctor: typeDesc.isModule ? require('js!' + typeDesc.moduleName) : $ws.proto[typeDesc.className],
                     config: control
                  };
               }

               return result;
            });

            $ws.helpers.forEach(controls, function(control){
               var
                   containerEl = self._container[0],
                   controlConfig = control.config,
                   ctor = control.ctor,
                   span = BOOMR.plugins.WS.startSpan("+inst:" + controlConfig.type),
                   instance;

               try {
                  controlConfig.element = $('#' + controlConfig.id, containerEl);
                  controlConfig.parent = self;
                  controlConfig.linkedContext = self._context;
                  controlConfig.currentTemplate = template;

                  instance = new ctor(controlConfig);

                  if (typeof instance.getReadyDeferred === 'function') {
                     self._dChildReady.push(instance.getReadyDeferred());
                  }
                  var alignment = instance.getAlignment();
                  if (alignment.horizontalAlignment != 'Stretch' || alignment.verticalAlignment != 'Stretch') {
                     self._doGridCalculation = true;
                  }
               }
               finally {
                  span.stop();//если внутри try вылетит исключение, то оно пройдёт в errorHandler, прицепленный в addErrback
               }
            });

            pdResult.done();

            return pdResult;
         });
      },
      /**
       * Загрузка потомков
       * Возвращает Deferred, который происходит после завершения инициализации всех контролов, или undefined, если инициализация прошла синхронно.
       * Этот же Deferred генерирует всем onBeforeLoad
       * @returns {$ws.proto.Deferred|undefined}
       */
      _loadDescendents:function (){
         return this._runInBatchUpdate('_loadDescendents - ' + this._id, function() {
            var
               dMultiResult = this._createChildrenLoadCallback(),
               errorHandler = this._makeLoadErrorHandler(dMultiResult),
               template = this._options.currentTemplate,
               checkDestroyed = this._createCheckDestroyedFunc('_loadDescendents', this._options.name, errorHandler);

            this._notify('onBeforeLoad');    //По-видимому, onBeforeLoad должен происходить всё же ДО загрузки
            this._notify('onBeforeControlsLoad');
            try {
               this._isPage = !!(template && template.isPage());
               this._loadControls(dMultiResult, template, this.getId(), checkDestroyed, errorHandler);
            } catch (e) {
               errorHandler(e);
            }

            return dMultiResult.getResult().createDependent();
         });
      },

      /**
       * <wiTag group="Управление">
       * <wiTag class="GroupCheckBox" noShow>
       * Готова ли area и всё её дочерние area
       * @returns {Boolean}
       */
      isAllReady: function(){
         var controls = this.getChildControls();
         for(var i = 0; i < controls.length; ++i){
            if(controls[i].isReady && !controls[i].isReady()){
               return false;
            }
         }
         return true;
      },

      /**
       * Метод, перекрываемый в потомках. Нужен, чтобы выполнить какой-то код после готовности области, но до отработки пользовательских событий готовности (onReady+onAfterLoad)
       * @private
       */
      _templateInnerCallbackBeforeReady: function() {
      },

      _templateInnerCallback: function() {
         var block = BOOMR.plugins.WS.startBlock('_templateInnerCallback', true);
         this._isReady = true;

         this._initResizers();

         this._notifyOnSizeChanged(this, this);
         this._templateInnerCallbackBeforeReady();

         this._notifyOnReady();
         this._showControls();
         block.close();
      },
      _notifyOnReady: function(){
         this._notify('onReady');
      },

      /**
       * Обработчик клика по области
       * @param {Event} event стандартный jQuery-ивент
       * @private
       */
      _onClickHandler: function(event){
         event.stopImmediatePropagation();
         if (!$ws.helpers.getTextSelection()) {
            this.onBringToFront();
         } else {
            this._moveFocusToSelf(true);
         }
         this._notify('onClick', event);
      },
      /**
       * Активирует контрол при получении фокуса. Но в случае области мы этого не делаем
       * @private
       */
      _initFocusCatch: function(){
      },
      /**
       * <wiTag group="Управление">
       * <wiTag class="GroupCheckBox" noShow>
       * Переместить область "выше" остальных. Актуально в случае окон.
       * @example
       * После отрытия окна переместить его выше остальных.
       * <pre>
       *    window.subscribe('onAfterShow', function() {
       *       this.moveToTop();
       *    });
       * </pre>
       */
      moveToTop: function(){
      },
      /**
       * <wiTag group="Управление">
       * Deferred готовности области. Он завершится успехом в момент, когда все дочерние контролы области готовы.
       * @return {$ws.proto.Deferred}
       */
      getReadyDeferred: function() {
         return this._dChildReady.getResult();
      },
      /**
       * <wiTag group="Отображение">
       * <wiTag class="GroupCheckBox" noShow>
       * Сбросить для кнопки опцию "Кнопка по умолчанию" в значение false.
       * @param {$ws.proto.Button} defButton Экземпляр класса кнопки.
       * @example
       * При готовности контрола сбросить для дочерней кнопки опцию "Кнопка по умолчанию".
       * <pre>
       *    control.subscribe('onReady', function() {
       *       var button = this.getChildControlByName('Зарегистрировать');
       *       this.unregisterDefaultButton(button);
       *    });
       * </pre>
       * @see registerDefaultButton
       */
      unregisterDefaultButton: function(defButton) {
         if(this._defaultButton === defButton)
            this._defaultButton = null;
      },
      /**
       * <wiTag group="Отображение">
       * <wiTag class="GroupCheckBox" noShow>
       * Установить для кнопки опцию "Кнопка по умолчанию" в значение true.
       * Свойства такой кнопки:
       * <ol>
       *    <li>Выделена оранжевым цветом.</li>
       *    <li>Активируется при нажатии Enter из любого поля данного контейнера.</li>
       * </ol>
       * Кнопка является "кнопкой по умолчанию" в рамках только той области, в которой она определена.
       * @param {$ws.proto.Button} defButton Экземпляр класса кнопки.
       * @example
       * При готовности контрола установить для дочерней кнопки опцию "Кнопка по умолчанию".
       * <pre>
       *    control.subscribe('onReady', function() {
       *       var button = this.getChildControlByName('Зарегистрировать');
       *       this.registerDefaultButton(button);
       *    });
       * </pre>
       * @see registerDefaultButton
       */
      registerDefaultButton: function(defButton) {
         var self = this;
         if(this._defaultButton)
            this._defaultButton.setDefault(false);
         this._defaultButton = defButton;
         this._defaultButton.subscribe('onDestroy', function() {
            if (self._defaultButton === this) {
               self._defaultButton = null;
            }
         });
      },
      _restoreSize:function () {
         if (this._width || this._height) {
            this._container.css({
               width:this._options.autoWidth || this._horizontalAlignment === "Stretch" ? 'auto' : this._width,
               height:this._options.autoHeight || this._verticalAlignment === "Stretch" ? 'auto' : this._height
            });
         }
      },
      /**
       * Пересчитывает размер видимых дочерних элементов
       * @protected
       */
      _resizeChilds: function(){
         var i, ln, control;

         if(this.isVisible() || this._needRecalkInvisible()){
            for (i = 0, ln = this._childControls.length; i < ln; i++) {
               control = this._childControls[i];
               if (control && control.isVisible()) {
                  control._onResizeHandler();
               }
            }
         }
      },
      _onResizeHandler: function(event, initiator){
         // fix для корневой области устанавливается высота 100%
         this._restoreSize(); // todo ещё раз проверить
         $ws.proto.AreaAbstract.superclass._onResizeHandler.apply(this, arguments);
         this._resizeChilds();

         if (this._needResizer()){
            if (!this._resizer) {
               this._initResizers();
            } else {
               this._updateResizer();
            }
         }

         this._notify('onResize', initiator);
      },
      /**
       * <wiTag group="Управление">
       * Перевести фокус на первый дочерний контрол.
       * @example
       * При нажатии клавиши "n" фокус переходит на следующий дочерний контрол (движение вниз).
       * Если переход фокуса на следующий дочерний контрол невозможен или контрола нет, то фокус переходит на первый дочерний контрол.
       * <pre>
       *    control.subscribe('onKeyPressed', function(eventObject, event) {
       *       if (event.which == $ws._const.key.n) {
       *          var res = this.detectNextActiveChildControl();
       *          if (!res) {
       *             this.activateFirstControl();
       *          }
       *       }
       *    });
       * </pre>
       * @see setActive
       * @see onActivate
       * @see activateLastControl
       */
      activateFirstControl: function(){
         this._activateSiblingControlOrSelf(false, -1);
      },
      /**
       * <wiTag group="Управление">
       * Перевести фокус на последний дочерний контрол.
       * @example
       * При нажатии клавиши "p" фокус переходит на предыдущий дочерний контрол (движение вверх).
       * Если переход фокуса на предыдущий дочерний контрол невозможен или контрола нет, то фокус переходит на последний дочерний контрол.
       * <pre>
       *    control.subscribe('onKeyPressed', function(eventObject, event) {
       *       if (event.which == $ws._const.key.p) {
       *          var res = this.detectNextActiveChildControl();
       *          if (!res) {
       *             this.activateLastControl();
       *          }
       *       }
       *    });
       * </pre>
       * @see activateFirstControl
       * @see setActive
       * @see onActivate
       */
      activateLastControl: function(){
         this._activateSiblingControlOrSelf(true, this._maxTabindex ? this._maxTabindex + 1 : this._childControls.length);
      },
      /**
       * Активирует первый контрол и проставляет таб-индекс, если нужного контрола нет
       * @protected
       */
      _activateFirstCtrl : function(){
         this.activateFirstControl();
      },
      /**
       * <wiTag group="Отображение">
       * Установить размеры области.
       * @param {Object} size Объект, описыващий размеры области.
       * @example
       * 1. Структура передаваемого объекта. Значения опций указаны в pixel.
       * <pre>
       *    var object = {
       *       //ширина в 250px
       *       width: 250,
       *       height: 380
       *    };
       * </pre>
       *
       * 2. Перед открытием окна (window) задать ему размеры 300x300 px.
       * <pre>
       *    window.subscribe('onBeforeShow', function() {
       *       this.setSize({
       *          width: 300,
       *          height: 300
       *       });
       *    });
       * </pre>
       * @see onResize
       */
      setSize: function(size) {
         if (this._options.autoHeight) {
            size['height'] = 'auto';
         } else {
            this._getFixedHeight.reset();
         }

         if (!this._options.autoWidth) {
            this._getFixedWidth.reset();
         }

         this._container.css(size);
         this._resizeChilds();
         this._notify('onResize');
      },
      /**
       * <wiTag group="Управление">
       * Установить фокус на контрол.
       * @param {Boolean} active true - перевести фокус на контрол.
       * @param {Boolean} [isShiftKey] Направление перехода фокуса.
       *
       * Возможные значения:
       * <ol>
       *    <li>true - если у контрола существуют дочерние контролы, то фокус переходит на последний из них.</li>
       *    <li>false - если у контрола существуют дочерние контролы, то фокус переходит на первый из них.</li>
       * </ol>
       * Если контрол не обладает дочерними контролами, то параметр игнорируется.
       * @example
       * При готовности контрола перевести на него фокус.
       * <pre>
       *    control.subscribe('onReady', function() {
       *       this.setActive(true, false);
       *    });
       * </pre>
       * @see activateLastControl
       * @see activateFirtsControl
       * @see onActivate
       */
      setActive: function(active, isShiftKey){
         this._isControlActive = active;
         if(active){
            this._container.removeClass('ws-control-inactive');
            if(isShiftKey){
               this.activateLastControl();
            }
            else{
               this.activateFirstControl();
            }
         }
      },
      /**
       * <wiTag group="Управление" noShow>
       * Отдает объект, для выполнения массовых действий над контролами группы
       *
       * @param {String} name Имя группы
       * @return {GroupWrapper} Враппер группы или null если такой группы не существует
       */
      getNamedGroup: function(name) {
         if(name in this._options.groups) {
            if(name in this._groupInstances) {
               return this._groupInstances[name];
            }
            else {
               var group = [];
               var groupMembers = this._options.groups[name];
               for(var i = 0, l = groupMembers.length; i < l; i++) {
                  try {
                     group.push(this.getChildControlById(groupMembers[i]));
                  } catch (e) {
                     // ignore
                  }
               }
               return (this._groupInstances[name] = new GroupWrapper(group));
            }
         } else {
            return null;
         }
      },
      /**
       * <wiTag group="Управление">
       * Зарегистрировать контрол как дочерний.
       * Метод добавляет контролы в массив дочерних контролов, получить который можно с помощью {@link getChildControls}.
       * @param {$ws.proto.Control} control Контрол, который хотим зарегистрировать как дочерний.
       * @example
       * Если anotherControl не является дочерним, то зарегистрировать его как дочерний.
       * <pre>
       *    control.subscribe('onReady', function() {
       *       var array = this.getChildControls();
       *       $ws.helpers.forEach(array, function(element) {
       *          if (element.getName() != anotherControl.getName()) {
       *             this.registerChildControl(anotherControl);
       *          }
       *       });
       *    });
       * </pre>
       * @see getChildControls
       * @see unregisterChildControl
       */
      registerChildControl: function(control){
         if(control instanceof $ws.proto.Control){
            var oldParent = control.getParent();
            if(oldParent){
               if (oldParent !== this || this._childsMapId[control.getId()]) {
                  $ws.single.ioc.resolve('ILogger').error('AreaAbstract::registerChildControl',
                     'Нельзя зарегистрировать этот контрол: (' + control.getId() + ') в контроле: ' +
                        this.getId() + ', у него уже есть родитель: ' + oldParent.getId());
               }
            }
            var cur = this._childControls.length,
               tabindex = control.getTabindex();
            if(tabindex){
               var tabindexVal = parseInt(tabindex, 10);

               // Если индекс занят или -1 (авто) назначим последний незанятый
               if(tabindexVal == -1 || this._childsTabindex[tabindexVal] !== undefined){
                  tabindexVal = this._maxTabindex + 1;
                  control.setTabindex(tabindexVal, true);
               }
               if(tabindexVal > 0){
                  if(!this._maxTabindex){
                     this._maxTabindex = tabindexVal;
                  } else {
                     this._maxTabindex = this._maxTabindex > tabindexVal ? this._maxTabindex : tabindexVal;
                  }
                  if(!this._childsTabindex) {
                     this._childsTabindex = {};
                  }
                  this._childsTabindex[tabindexVal] = cur;
               }
            }
            this._childsMapId[control.getId()] = cur;
            this._childsMapName[control.getName()] = cur;
            this._childControls.push(control);
            if(control instanceof $ws.proto.AreaAbstract) {
               this._childContainers.push(control);
            }

            control.once('onInit', function() {
               if (control._prevState === undefined) {
                  control._prevState = control.isEnabled();
               }
               if (!this._options.enabled) {
                  control.setEnabled(false);
               }

               this._notifyOnChildAdded(control);
            }.bind(this));
         }
      },
      /**
       * <wiTag group="Управление">
       * Изменить {@link tabindex} у переданного контрола.
       * @param {$ws.proto.Control} control Контрол, которому необходимо изменить табиндекс.
       * @param {Number} tabindex Значение табиндекса.
       * @example
       * Изменить табиндекс дочернему контролу Child.
       * <pre>
       *    control.subscribe('onReady', function() {
       *       this.changeControlTabIndex(Child, 1);
       *    });
       * </pre>
       */
      changeControlTabIndex : function(control, tabindex){
         var
            controlPos,
            curTabIndex = control.getTabindex();

         delete this._childsTabindex[control.getTabindex()];

         for (var i = 0, l = this._childControls.length; i < l; i++){
            var child = this._childControls[i];
            if(!child){
               continue;
            }

            var childTabIndex = parseInt(child.getTabindex(), 10);
            if (tabindex > curTabIndex){
               if (childTabIndex > curTabIndex && childTabIndex <= tabindex){
                  this._childsTabindex[childTabIndex - 1] = i;
                  this._childControls[i].setTabindex(childTabIndex - 1, true);
               }
            }
            else{
               if (childTabIndex >= tabindex && childTabIndex < curTabIndex){
                  this._childsTabindex[childTabIndex + 1] = i;
                  this._childControls[i].setTabindex(childTabIndex + 1, true);
               }
            }

            if (this._childControls[i] == control)
               controlPos = i;
         }

         this._childsTabindex[tabindex] = controlPos;
         this._maxTabindex = this._maxTabindex < tabindex ? tabindex : this._maxTabindex;
      },
      /**
       * <wiTag group="Управление">
       * Убрать сведения о контроле, как о дочернем.
       * Метод удаляет информацию о контроле из массива дочерних контролов, получить который можно с помощью {@link getChildControls}.
       * @param {$ws.proto.Control} control Контрол, который хотим убрать из списка дочерних.
       * @example
       * Убрать контрол из списка дочерних, если его имя "ФильтрДокументов".
       * <pre>
       *    control.subscribe('onReady', function() {
       *       var array = this.getChildControls();
       *       $ws.helpers.forEach(array, function(element) {
       *          if (element.getName() == 'ФильтрДокументов') {
       *             this.unregisterChildControl(element);
       *          }
       *       });
       *    });
       * </pre>
       * @see getChildControls
       * @see registerChildControl
       */
      unregisterChildControl: function(control){
         var controlNumber = this._childsMapId[control.getId()];
         if(controlNumber !== undefined){
            delete this._childControls[controlNumber];
            delete this._childsMapId[control.getId()];
            delete this._childsMapName[control.getName()];
            if(control instanceof $ws.proto.AreaAbstract) {
               for(var i = 0, l = this._childContainers.length; i < l; i++) {
                  if(this._childContainers[i] == control) {
                     delete this._childContainers[i];
                     break;
                  }
               }
            }
         }
      },
      /**
       * Ищет дочерние контролы в детях-контейнерах
       *
       * @param {String} by Как искать ("Id", "Name")
       * @param {String} value Что искать
       * @returns {$ws.proto.Control}
       */
      _searchChildren: function(by, value) {
         var containers = this._childContainers;
         for(var i = 0, l = containers.length; i < l; i++) {
            if (containers[i]) { //может быть удалён
               try {
                  return containers[i]['getChildControlBy' + by](value);
               } catch(e) {}
            }
         }
         return null;
      },
      /**
       * <wiTag group="Управление">
       * Получить дочерний контрол по его идентификатору.
       * @param {String} controlId Идентификатор контрола.
       * @returns {$ws.proto.Control} Экземпляр искомого класса.
       * @throws Error Если элемент с заданным ID не найден.
       * @example
       * Активность дочернего контрола зависит от значения флага (fieldCheckbox).
       * <pre>
       *    fieldCheckbox.subscribe('onChange', function(eventObject, value) {
       *       //получаем экземпляр класса родительского контрола
       *       var parent = this.getParent();
       *       parent.getChildControlById('div_FNPN').setEnabled(value);
       *    });
       * </pre>
       * @see getId
       * @see getChildControlByName
       * @see waitChildControlByName
       * @see waitChildControlById
       * @see hasChildControlByName
       * @see getChildControls
       * @see getNearestChildControlByName
       * @see getImmediateChildControls
       * @see getActiveChildControl
       */
      getChildControlById: function(controlId){
         if(this._childsMapId[controlId] !== undefined){
            return this._childControls[this._childsMapId[controlId]];
         }
         var atChildren = this._searchChildren('Id', controlId);
         if(atChildren) {
            return atChildren;
         }
         throw new Error('Control with ID ' + controlId + ' is not present in this container');
      },
      /**
       * <wiTag group="Управление">
       * Получить дочерний контрол по его имени.
       * @param {String} controlName Имя искомого контрола.
       * @returns {$ws.proto.Control} Экземпляр искомого класса.
       * @throws Error Если контрол с нужным именем не найден.
       * @example
       * Активность дочернего контрола зависит от значения флага (fieldCheckbox).
       * <pre>
       *    fieldCheckbox.subscribe('onChange', function(eventObject, value) {
       *       //получаем экземпляр класса родительского контрола
       *       var parent = this.getParent();
       *       parent.getChildControlByName('ТабличноеПредставление').setEnabled(value);
       *    });
       * </pre>
       * @see name
       * @see getName
       * @see getChildControlById
       * @see waitChildControlByName
       * @see waitChildControlById
       * @see hasChildControlByName
       * @see getChildControls
       * @see getNearestChildControlByName
       * @see getImmediateChildControls
       * @see getActiveChildControl
       */
      getChildControlByName: function(controlName){
         if(this._childsMapName[controlName] !== undefined){
            return this._childControls[this._childsMapName[controlName]];
         }
         var atChildren = this._searchChildren('Name', controlName);
         if(atChildren) {
            return atChildren;
         }
         throw new Error('Control with name ' + controlName + ' is not present in this container');
      },
      /**
       * @param {$ws.proto.Control} child
       * @private
       */
      _notifyOnChildAdded: function(child) {
         var myParent = this.getParent();
         this._checkWaiters(child);
         if ($ws.helpers.instanceOfModule(myParent, 'SBIS3.CORE.AreaAbstract')) {
            myParent._notifyOnChildAdded(child);
         }
      },
      /**
       * @param {$ws.proto.Control} addedChild
       * @private
       */
      _checkWaiters: function(addedChild) {
         var name = addedChild.getName(),
             id = addedChild.getId(),
             d;

         if (this._waitersByName && (name in this._waitersByName)) {
            d = this._waitersByName[name];
            delete this._waitersByName[name];
            d.callback(addedChild);
         }

         if (this._waitersById && (id in this._waitersById)) {
            d = this._waitersById[id];
            delete this._waitersById[id];
            d.callback(addedChild);
         }
      },
      /**
       * @param {String} by Name или Id
       * @param {String} what кого ищем
       * @returns {$ws.proto.Deferred}
       * @private
       */
      _waitUtility: function(by, what) {
         var waitHolderProperty = '_waitersBy' + by,
             searchMethod = 'getChildControlBy' + by,
             control;

         try {
            // попробуем найти контрол который хотят
            control = this[searchMethod](what);
         } catch (e) {
            // ignore
         }

         if (control) {
            // если нашли - сразу вернем
            return new DeferredForWaiters().callback(control);
         } else {
            // иначе либо вернем уже имеющийся ожидающий Deferred, либо создадим новый и вернем (если нету)
            return this[waitHolderProperty][what] || (this[waitHolderProperty][what] = new DeferredForWaiters());
         }
      },
      /**
       * <wiTag group="Управление">
       * Ожидать по имени создание дочернего контрола.
       * Метод теряет актуальность, если для родительского контрола произошло событие {@link onReady}.
       *
       * Обязательное условие - вернуть в качестве результата экземпляр класса дочернего контрола.
       * Механизм Deferred построен таким образом, что первый подписант на результат deferred получит ожидаемый дочерний контрол.
       * Второй подписант на этот же deferred получит то, что вернётся из callback первого подписанта.
       * Аналогично третий подписант получит результат второго подписанта, и т.д.
       * @param {String} controlName Имя дочернего контрола.
       * @returns {$ws.proto.Deferred} Аргумент callback - экземпляр класса ожидаемого контрола.
       * @example
       * После создания дочернего контрола изменить его активность.
       * <pre>
       *    control.subscribe('onInit', function() {
       *       //ChildName - имя дочернего контрола
       *       this.waitChildControlByName(ChildName).addCallback(function(child) {
       *          child.setEnabled(false);
       *          //выполняем обязательно условие
       *          return child;
       *       });
       *    });
       * </pre>
       * @see waitChildControlById
       * @see hasChildControlByName
       * @see name
       * @see onReady
       */
      waitChildControlByName: function(controlName) {
         return this._waitUtility('Name', controlName);
      },
      /**
       * <wiTag group="Управление">
       * Ожидать по идентификатору создание дочернего контрола.
       * Метод теряет актуальность, если для родительского контрола произошло событие {@link onReady}.
       *
       * Обязательное условие - вернуть в качестве результата экземпляр класса дочернего контрола.
       * Механизм Deferred построен таким образом, что первый подписант на результат deferred получит ожидаемый дочерний контрол.
       * Второй подписант на этот же deferred получит то, что вернётся из callback первого подписанта.
       * Аналогично третий подписант получит результат второго подписанта, и т.д.
       * @param {String} controlId Идентификатор контейнера контрола.
       * @returns {$ws.proto.Deferred} Аргумент callback - экземпляр класса ожидаемого контрола.
       * @example
       * После создания дочернего контрола изменить его активность.
       * <pre>
       *    control.subscribe('onInit', function() {
       *       //ChildId - имя дочернего контрола
       *       this.waitChildControlById(ChildId).addCallback(function(child) {
       *          child.setEnabled(false);
       *          //выполняем обязательно условие
       *          return child;
       *       });
       *    });
       * </pre>
       * @see waitChildControlByName
       * @see getId
       * @see onReady
       * @see hasChildControlByName
       */
      waitChildControlById: function(controlId) {
         return this._waitUtility('Id', controlId);
      },
      /**
       * <wiTag group="Управление">
       * Присутствует ли дочерний контрол с указанным именем.
       * @param {String} name Имя дочернего контрола.
       * @returns {Boolean} true - да, присутствует.
       * @example
       * Если дочерний контрол присутствует, то изменить его активность.
       * <pre>
       *    control.subscribe('onInit', function() {
       *       //name - имя дочернего контрола
       *       if (this.hasChildControlByName(name)) {
       *          this.waitChildControlByName(name).addCallback(function(child) {
       *             child.setEnabled(false);
       *             return child;
       *          });
       *       }
       *    });
       * </pre>
       * @see waitChildControlByName
       * @see waitChildControlById
       */
      hasChildControlByName: function(name){
         if(this._childsMapName[name] !== undefined){
            return true;
         }
         return !!this._searchChildren('Name', name);
      },
      /**
       * <wiTag group="Управление">
       * Находит ближайший контрол по имени
       * @param {String} name Имя нужного контрола
       * @param {Boolean} [subAreas] Нужен ли поиск в дочерних контейнерах, или только "вверх"
       */
      getNearestChildControlByName: function(name, subAreas){
         var marks = {},
            queue = [],
            parent,
            append = function(area){
               if(area && !marks[area.getId()]){
                  marks[area.getId()] = true;
                  queue.push(area);
               }
            };
         if(subAreas){
            append(this);
            while(queue.length){
               var areas = queue.shift();
               if(areas.hasChildControlByName){
                  if(areas.hasChildControlByName(name)){
                     return areas.getChildControlByName(name);
                  }
               }
               else if(areas.getName && areas.getName() === name){
                  return areas;
               }
               parent = areas.getParent();
               if(parent){
                  append(parent);
               }
               if(areas.getOpener){
                  append(areas.getOpener());
               }
               if(areas._childContainers){
                  for(var i = 0, len = areas._childContainers.length; i < len; ++i){
                     append(areas._childContainers[i]);
                  }
               }
            }
         }
         else{
            parent = this;
            while(parent){
               if(parent.hasChildControlByName){
                  if(parent.hasChildControlByName(name)){
                     return parent.getChildControlByName(name);
                  }
               }
               parent = parent.getParent() || (parent.getOpener && parent.getOpener());
            }
         }
         return undefined;
      },
      /**
       * <wiTag group="Управление">
       * Получить все дочерние контролы. Метод выполняется с рекурсивным обходом.
       * @param {Boolean} [excludeContainers = false] Исключать контейнеры из возвращаемого набора.
       * @returns {Array} Массив дочерних контролов.
       * @example
       * Проверить наличие кнопки среди дочерних контролов. При положительном результате изменить активность кнопки.
       * <pre>
       *    control.subscribe('onReady', function() {
       *       var array = this.getChildControls(true);
       *       $ws.helpers.forEach(array, function(element) {
       *          if (element instanceof $ws.proto.ButtonAbstract) {
       *             element.setEnabled(false);
       *          }
       *       });
       *    });
       * </pre>
       * @see getImmediateChildControls
       * @see getChildControlByName
       * @see getChildControlById
       * @see waitChildControlByName
       * @see waitChildControlById
       * @see hasChildControlByName
       * @see getNearestChildControlByName
       * @see getActiveChildControl
       */
      getChildControls: function(excludeContainers) {
         var children = [];
         for(var i = 0, l = this._childControls.length; i < l; i++) {
            if(i in this._childControls) {
               var c = this._childControls[i];
               if(c){
                  if(c instanceof $ws.proto.AreaAbstract) {
                     Array.prototype.push.apply(children, c.getChildControls(excludeContainers));
                     if(excludeContainers) {
                        continue;
                     }
                  }
                  children.push(c);
               }
            }
         }
         return children;
      },
      /**
       * <wiTag group="Управление">
       * Получить непосредственные дочерние контролы.
       * @returns {Array} Массив дочерних контролов.
       * @example
       * Получить непосредственные дочерние контролы. Среди них найти кнопку и табличное представление.
       * Установить табличное представление владельцем кнопки.
       * <pre>
       *    control.subscribe('onReady', function() {
       *       var array = this.getImmediateChildControls(),
       *           button,
       *           tableView;
       *       $ws.helpers.forEach(array, function(element) {
       *          if (element instanceof $ws.proto.ButtonAbstract) {
       *             button = element;
       *          } else if (element instanceof $ws.proto.TableView) {
       *             tableView = element;
       *          }
       *       });
       *       button.setOwner(tableView);
       *    });
       * </pre>
       * @see getChildControls
       * @see getChildControlByName
       * @see getChildControlById
       * @see waitChildControlByName
       * @see waitChildControlById
       * @see hasChildControlByName
       * @see getNearestChildControlByName
       * @see getActiveChildControl
       */
      getImmediateChildControls: function() {
         return $ws.helpers.filter(this._childControls);//не включаем удалённых сюда (при удалении туда undefined пишется)
      },
      /**
       * <wiTag group="Управление">
       * Получить дочерний контрол, на котором находится фокус.
       * @param {Boolean} [canAcceptFocus = false] Если нужен контрол, который должен получить фокус.
       * @returns {$ws.proto.Control|undefined} Дочерний контрол, на котором находится фокус.
       * Возвращается undefined, если фокус не находится ни на одном из дочерних контролов.
       * @example
       * При готовности контрола перевести фокус на дочерний контрол, если фокус неустановлен.
       * <pre>
       *    control.subscribe('onReady', function() {
       *       var res = this.getActiveChildControl();
       *       if (res) this.detectNextActiveChildControl(false);
       *    });
       * </pre>
       * Может ли контрол получать фокус.
       * Метод сработает, если контрол видим, активен и у него есть табиндекс.
       */
      getActiveChildControl: function(canAcceptFocus) {
         var res = this._activatedWithTabindex ? this._childsTabindex[this._activeChildControl] : this._activeChildControl;
         if(canAcceptFocus && this._childControls[res] && !this._childControls[res].canAcceptFocus()){
            for(var i = 0; i < this._childControls.length; ++i){
               if(this._childControls[i] && this._childControls[i].canAcceptFocus()){
                  return this._childControls[i];
               }
            }
         }
         return this._childControls[res];
      },
      /**
       *
       */
      _isActiveByTabindex : function(){
         return this._childsTabindex &&
            this._activeChildControl in this._childsTabindex &&
            this._childControls[this._childsTabindex[this._activeChildControl]];
      },
      /**
       * <wiTag noShow>
       * ToDo: опция modal должна находиться в классе Window. Поэтому и метод к ней тоже нужен в Windows. Необходим рефакторинг.
       */
      isModal: function() { return this._isModal; },

      /**
       * <wiTag group="Данные">
       * Получить связанный с контролом контекст.
       * @returns {$ws.proto.Context} Связанный с контролом контекст.
       * @example
       * При готовности группы флагов (groupCheckbox) установить в поле контекста значение из пользовательских данных.
       * <pre>
       *    var userData;
       *    groupCheckbox.subscribe('onReady', function() {
       *       this.getContext().setValue(this.getName(), this.getUserData(userData));
       *    });
       * </pre>
       */
      getContext: function(){
         return this._context;
      },
      _removeControls: function() {
         var controls = this._childControls;

         $ws.helpers.forEach(controls, $ws.helpers.methodCaller('destroy'));

         this._childControls = [];
         this._childsMapId = {};
         this._childsMapName = {};
         this._childContainers = [];
         this._childsSizes = {};

         $ws.helpers.forEach(controls, function(control) {
            if (!control.isDestroyed()) {
               var err = 'Деструктор дочернего контрола (id = cid, name = cname) отработал не полностью. Видимо, где-то забыли вызвать деструктор базового класса. ' +
                         'Родитель: (id = pid, name = pname)',
                   data = {
                      cid: control.getId(),
                      cname: control.getName(),
                      pid: this.getId(),
                      pname: this.getName()
                   },
                   str = $ws.helpers.reduce(data, function(str, val, key) {
                      return str.replace(key, val);
                   }, err);

               throw new Error(str);
            }
         }.bind(this));
      },
      destroy: function(){
         var updater = $ws.single.ControlBatchUpdater;
         updater.beginBatchUpdate('AreaAbstract_destroy');
         try {
            for(var i in this._groupInstances) {
               if(this._groupInstances.hasOwnProperty(i)) {
                  this._groupInstances[i].destroy();
               }
            }
            this._waitersById = null;
            this._waitersByName = null;
            this._defaultButton = null;
            this._removeControls();

            this.setOpener(null);

            if(this._craftedContext && this._context) {
               // Если контекст изготовлен внутри класса - уничтожаем его
               this._context.destroy();
            }
            $ws._const.$win.unbind('resize.'+this.getId());
            $ws._const.$doc.unbind('mousedown.'+this.getId());

            $ws.single.WindowManager.removeWindow(this);

            $ws.proto.AreaAbstract.superclass.destroy.apply(this, arguments);
         }
         finally {
            updater.endBatchUpdate('AreaAbstract_destroy');
         }
      },
      /**
       * <wiTag group="Управление">
       * Разрушить дочерний контрол c указанным идентификатором.
       * @param {String} id Идентификатор дочернего контрола.
       * @example
       * При клике на кнопку уничтожать последний дочерний флаг (fieldCheckbox).
       * <pre>
       *    //массив с идентификаторами флагов
       *    var flags;
       *    button.subscribe('onClick', function() {
       *       var number = this.getUserData('NumberOfFlags');
       *       if (number > 0) {
       *          var parent = this.getParent();
       *          parent.destroyChild(flags[number-1]);
       *          this.setUserData('NumberOfFlags', number-1);
       *       }
       *    });
       * </pre>
       */
      destroyChild: function(id){
         var childControlNumber = this._childsMapId[id];
         if(childControlNumber !== undefined){
            var childControl = this._childControls[childControlNumber];
            if(childControl){
               this.unregisterChildControl(childControl);
               childControl.destroy();
            }
         }
      },
      /**
       * <wiTag group="Отображение">
       * Убрать фокус с дочернего контрола.
       * @param {Boolean} [selfOnly = false] Убрать фокус только с контрола.
       *
       * Возможные значения:
       * 1. true - убрать фокус только с контрола.
       * 2. false - убрать фокус с контрола и области, на которой он построен.
       * @example
       * При нажатии клавиши "n" перевести фокус на следующий дочерний контрол, который является полем ввода.
       * Если переход невозможен, то убрать фокус с дочернего контрола.
       * <pre>
       *    var i = 0,
       *        fields; //массив с номерами полей ввода
       *    control.subscribe('onKeyPressed', function(eventObject, event) {
       *       if (event.which == $ws._const.key.n) {
       *          var res = this.detectNextActiveChildControl(false, fields[i]);
       *          //в зависимости от результата либо увеличиваем индекс, либо снимаем фокус
       *          res ? i++ : this.disableActiveCtrl();
       *       }
       *    });
       * </pre>
       * @see getActiveChildControl
       */
      disableActiveCtrl : function(selfOnly){
         var activeControl = this.getActiveChildControl();

         if (activeControl && activeControl.isActive()){
            var isArea = activeControl instanceof $ws.proto.AreaAbstract;
            if(isArea && !selfOnly || !isArea){
               activeControl.setActive(false);
            }
         }
      },
      /**
       *  Обработка клавиатурных нажатий
       *  @param {Event} e
       */
      _keyboardHover: function(e){
         if(e.which in this._keysWeHandle){
            if(e.which == $ws._const.key.tab){
               return this.moveFocus(e);
            }
            if(e.which == $ws._const.key.enter) {
               if(!(e.altKey || e.shiftKey)) { // Enter, Ctrl+Enter
                  if(this._defaultButton && this._defaultButton.isEnabled()) {
                     this._defaultButton._notify('onActivated');
                     return false;
                  } else {
                     return true;
                  }
               }
            }
         }
      },
      /**
       * <wiTag group="Управление">
       * Переместить фокус к следующему/предыдущему контролу.
       *
       * Направление перехода зависит от нажатой клавиши Shift:
       * 1. Клавиша нажата. Переход к предыдущему контролу.
       * 2. Клавиша отпущена. Переход к следующему контролу.
       * @param {Object} event Объект события.
       * @return {Boolean} Результат выполнения функции.
       *
       * Возможные значения:
       * 1. true - фокус был отдан родителю. Если родителя не существует, то фокус переходит браузеру.
       * 2. false - фокус переместился к следующему/предыдущему контролу.
       * @example
       * Подписать группу флагов (groupCheckbox) на перемещение фокуса между дочерними контролами при нажатии клавиши "n".
       * <pre>
       *    groupCheckbox.subscribe('onKeyPressed', function(eventObject, event) {
       *       if (event.which == $ws._const.key.n) {
       *          this.moveFocus(event);
       *       }
       *    });
       * </pre>
       */
      moveFocus: function(event){
         event.stopPropagation();
         if(!this.detectNextActiveChildControl(event.shiftKey)){//Не смогли найти следующий
            // Мы должны либо отпустить фокус в браузер либо выйти из вложенного ареа
            if(this.focusCatch(event)){
               return true;
            }
         }
         return false;
      },
      /**
       * <wiTag group="Управление">
       * Установить фокус на следующий/предыдущий контрол, находящийся на одном структурном уровне с родительским контролом.
       *
       * Направление перехода зависит от нажатой клавиши Shift:
       * 1. Клавиша нажата. Переход к предыдущему контролу.
       * 2. Клавиша отпущена. Переход к следующему контролу.
       * @param {Object} event Объект события.
       * @returns {Boolean} Результат выполнения функции.
       *
       * Возможные значения:
       * 1. true - у контрола нет родителя. Фокус перешёл браузеру.
       * 2. false - фокус был передан ближайшему контролу, который находится на одном структурном уровне с родительским контролом.
       * @example
       * Подписать группу флагов (groupCheckbox) на перемещение фокуса на следующий контрол при нажатии клавиши "p".
       * <pre>
       *    groupCheckbox.subscribe('onKeyPressed', function(eventObject, event) {
       *       if (event.which == $ws._const.key.p) {
       *          this.focusCatch(event);
       *       }
       *    });
       * </pre>
       */
      focusCatch: function(event){
         var parent = this.getParent();
         if(!parent){ //Если нет парента то это либо окно, либо самая верхняя ареа => отпускаем в браузер
            $ws.single.WindowManager.disableLastActiveControl();
            if(event.shiftKey){
               $ws.single.WindowManager.focusToFirstElement();
            }
            else{
               $ws.single.WindowManager.focusToLastElement();
            }
            return true;
         }
         else{
            //Пытаемся найти следующий, пробегаюсь по своим парентам.
            return parent.moveFocus(event);
         }
      },
      /**
       * Переводит фокус на следующий/предыдущий дочерний контрол, или на себя, если не найден подходящий
       * @param {Boolean} isShiftKey Если да - то выбирается предыдущий контрол
       * @param {Number} searchFrom С какого контрола искать новый
       * @private
       */
      _activateSiblingControlOrSelf: function(isShiftKey, searchFrom) {
         if ($ws.helpers.isElementVisible(this.getContainer())) {
            control.ControlBatchUpdater.runBatchedDelayedAction('AreaAbstract.activateSiblingControlOrSelf', [this, isShiftKey, searchFrom]);
         }
      },

      _moveFocusToFakeDiv: function() {
         //Тогда, когда области некому отдать фокус, а себе нельзя (Хром и IE могут прокрутить
         //родительский блок вниз, если места в видимой области экрана не хватает для всей области),
         //нужно создать фиктивный дочерний элемент, и отдать фокус ему.
         //Клавиатурные события же от него приходить всё равно будут на область.
         //Позиционирование фиксированное, чтоб блок был всегда виден на экране, и не влиял на размеры области.
         //tabindex=1000, чтобы он сам случайно фокус не получил, если вдруг появится кто-то, кому нужен фокус.
         if (!this._fakeFocusDiv) {
            this._fakeFocusDiv = $('<div style="position: fixed; top: 0; left: 0; width: 1px; height: 1px;" tabindex="1000"></div>');
            this._container.prepend(this._fakeFocusDiv);
         }

         this._fakeFocusDiv.focus();
      },

      /**
       * Переносит фокус на себя
       * @param {Boolean} [dontChangeDomFocus=false] Не переносить фокус (предполагается, что он уже установлен каким-то внешним способом,
       * например, в результате выделения текста в вёрстке).
       * @protected
       */
      _moveFocusToSelf: function(dontChangeDomFocus){
         $ws.single.WindowManager.disableLastActiveControl(this);
         this._activeChildControl = -1;

         if (!dontChangeDomFocus) {
            this._moveFocusToFakeDiv();

            // firefox не дружит с contenteditable (hack)
            if($.browser.mozilla){
               try{
                  document.getSelection().removeAllRanges();
               }
               catch(e){}
            }
         }

         this._notify('onActivate');
      },
      _activateSiblingControlOrSelfLow: function(isShiftKey, searchFrom){
         if (!this.detectNextActiveChildControl(isShiftKey, searchFrom)) {
            this._moveFocusToSelf();
         }
      },
      /**
       * <wiTag group="Управление">
       * Переместить фокус на следующий/предыдущий дочерний контрол.
       * @param {Boolean} isShiftKey Направление перехода фокуса.
       *
       * Возможные значения:
       * 1. true - фокус перейдёт на предыдущий дочерний контрол, если он существует.
       * 2. false - фокус перейдёт на следующий дочерний контрол, если он существует.
       * @param {Number} [searchFrom = undefined] С номера какого дочернего контрола искать следующий, на который перевести фокус.
       * Нумерация дочерних контролов начинается с 1.
       *
       * В значении undefined поиск будет произведён:
       *    a) С первого дочернего контрола.
       *    b) С дочернего контрола, который в данный момент находится в фокусе.
       * @return {Boolean} Результат поиска и перемещения фокуса.
       *
       * Возможные значения:
       * 1. true - следущий/предыдущий дочерний контрол найден и на него переведён фокус.
       * 2. false - следущий/предыдущий дочерний контрол не найден или он не может принимать фокус.
       * Фокус остаётся в прежней позиции.
       * @example
       * При нажатии клавиши "n" перевести фокус на следующий дочерний контрол, который является полем ввода.
       * <pre>
       *    var i = 0,
       *        fields; //массив с номерами полей ввода
       *    control.subscribe('onKeyPressed', function(eventObject, event) {
       *       if (event.which == $ws._const.key.n) {
       *          this.detectNextActiveChildControl(false, fields[i]);
       *          i++;
       *       }
       *    });
       * </pre>
       * @see setChildActive
       * @see getChildControls
       */
      detectNextActiveChildControl: function(isShiftKey, searchFrom){
         var act = searchFrom !== undefined ? searchFrom : this._activeChildControl,
            self = this,
            cur = isShiftKey ? act - 1 : act + 1,
            res = true,
            validate = function(now){
               return self._childsTabindex ? (now > 0 && now <= self._maxTabindex) : (now >= 0 && now < self._childControls.length);
            },
            controlOk = function(tabIdx) {
               var contrIdx = self._childsTabindex[tabIdx],
                   contr = contrIdx !== undefined && self._childControls[contrIdx];
               return contr && contr.canAcceptFocus();
            };

         if(!validate(cur) && !validate(act)){
            var l = this._childsTabindex ? this._maxTabindex + 1 : this._childControls.length;
            cur = isShiftKey ? l-1 : 1;
         }
         if(this._childsTabindex) { //если есть табиндексы бегаем по ним и ищем следующий
            if(!controlOk(cur)) {
               while(cur >= 0 && cur <= this._maxTabindex ) {
                  if(controlOk(cur)) {
                     break;
                  }
                  cur = isShiftKey ? cur - 1 : cur + 1;
               }
            }
         }
         else{ //если нету табиндексов
            while(this._childControls[cur] && !this._childControls[cur].canAcceptFocus() &&
               (cur >= 0 && cur < this._childControls.length)){
               cur = isShiftKey ? cur - 1 : cur + 1;
            }
         }
         var length = this._childsTabindex ? this._maxTabindex : this._childControls.length;

         if(cur < 0 || cur > length){//Если ничего не нашлось
            res = false;
         }

         if(res){//Установка фокуса на найденный контрол
            var active = this._childsTabindex ? this._childsTabindex[cur] : cur;
            res = !!this._childControls[active];
            if (res) {
               this._childControls[active].setActive(true, isShiftKey);
            }
         }
         return res;
      },
      /**
       * <wiTag group="Управление">
       * Перевести фокус на дочерний контрол.
       * @param {$ws.proto.Control} child Дочерний контрол.
       * @example
       * При готовности контрола перевести фокус на его первый дочерний контрол.
       * <pre>
       *    control.subscribe('onReady', function() {
       *       var array = this.getChildControls();
       *       this.setChildActive(array[0]);
       *    });
       * </pre>
       * @see detectNextActiveChildControl
       * @see getChildControls
       */
      setChildActive: function(child){
         var childId = child.getId();
         if(child.getTabindex() > 0){
            this._activeChildControl = parseInt(child.getTabindex(), 10);
            this._activatedWithTabindex = true;
         }
         else{
            for(var i = 0, l = this._childControls.length; i < l; i++){
               if(this._childControls[i] && this._childControls[i].getId() === childId){
                  this._activeChildControl = i;
                  this._activatedWithTabindex = false;
                  break;
               }
            }
         }
      },
      /**
       * <wiTag group="Управление" noShow>
       * При переводе на передний план
       * Вызывается при переводе окна на передний план - фокусируется нужный элемент управления.
       */
      onBringToFront: function(){
         if(this._childControls && this._childControls.length) {
            var control = this.getActiveChildControl(true);
            if(control){
               if(control instanceof $ws.proto.AreaAbstract){
                  control.onBringToFront();
               }
               else{
                  control.setActive(true);
               }
            }
            else{
               this._activateFirstCtrl();
            }
         }
         else{
            this._moveFocusToSelf();
         }
      },
      /**
       * <wiTag group="Управление">
       * Срхраняет информацию о том, что это дочерний контрол был активен, у себя и своих родительских элементов
       * @param {$ws.proto.Control} child Дочерний контрол
       */
      storeActiveChild: function(child){
            this.setChildActive(child);
         var parent = this.getParent();
         if(parent){
            parent.storeActiveChild(this);
         }
      },
      /**
       * <wiTag group="Управление">
       * Делает область активной
       * @param {$ws.proto.Control|undefined} control Контрол, который при этом стал активным
       */
      activate: function(control){
         var activeControl;
         if(control){
            var window = $ws.single.WindowManager.getActiveWindow();
            if(window){
               var prevActive = window.getActiveChildControl();
               if(prevActive != control && prevActive && prevActive.getParent() === window){
                  activeControl = prevActive;
               }
            }
         }
         else{
            this._activeChildControl = undefined;
         }
         this.storeActiveChild(control);
         this._notify('onActivate');
         if(activeControl){
            activeControl.setActive(false, undefined, undefined, control);
         }
      },
      /**
       * <wiTag noShow>
       * Установить индекс активации области.
       * @param index
       */
      setActivationIndex: function(index){
         this._activationIndex = index;
      },
      /**
       * <wiTag noShow>
       * Проверить видно ли текущее окно.
       * @return {Boolean} Признак: true - видно, false - нет.
       */
      isShow: function(){
         return true;
      },
      /**
       * <wiTag noShow>
       * Получить z-index текущего окна.
       */
      getZIndex: function(){
         return 0;
      },
      /**
       * <wiTag group="Данные">
       * Запустить <a href='http://wi.sbis.ru/dokuwiki/doku.php/api:validator'>валидацию</a> области/контрола.
       * @param {Boolean} [firstRun = true] Признак первого запуска валидации.
       * Значение true информирует о первом запуске валидации контрола или текущей области.
       * @param {Boolean} [forceValidateHidden = false] false - валидировать не смотря на то, что контрол или область скрыты.
       * @returns {Boolean} Результат валидации.
       * Возможные значения:
       * <ol>
       *    <li>true - валидация пройдена успешно.</li>
       *    <li>false - ошибка при прохождении валидации.</li>
       * </ol>
       */
      validate: function(firstRun, forceValidateHidden){
         if (!this.isVisible() && !forceValidateHidden) {
            return true;
         }
         firstRun = firstRun === undefined ? true : firstRun;
         var hasErrors = false;
         for (var x in this._childControls){
            if(this._childControls.hasOwnProperty(x)) {
               var childControl = this._childControls[x];
               if (childControl && childControl.validate && !childControl.validate(false)) {
                  hasErrors = true;
               }
            }
         }
         /**
          * Код ниже перемещает сообщение об ошибке на первое ошибочное поле, если
          * - это "первый запуск", т.е. валидацию запустили на текущей области
          * - есть ошибки
          * - область не скрыта сама по себе
          * - и ее родители тоже не скрыты
          */
         if(firstRun && hasErrors && this.isVisible() && this._container.parents('.ws-hidden').length === 0 && this.getZIndex() === $ws.single.WindowManager.getMaxZWindow().getZIndex()) {
            this._moveFailValidatedToFocus();
         }
         return !hasErrors;
      },
      /**
       * moves first fail validated element to focus
       * this also should cause errorBox showing
       * @protected
       */
      _moveFailValidatedToFocus: function(){
         var
            res = true,
            minTab = -1,
            minEl = -1,
            val,
            children = Object.keys(this._childControls),
            self = this,
            elementFound,
            areaFound;
         // Сортируем элементы по табиндексу
         children.sort(function(a,b) {
            var x = self._childControls[a] && self._childControls[a].getTabindex(),
               y = self._childControls[b] && self._childControls[b].getTabindex();
            x = parseInt(x, 10);
            y = parseInt(y, 10);
            if(!x || x == -1) {
               return 1;
            }
            if(!y || y == -1) {
               return -1;
            }
            return ( (x<y) ? -1 : (x>y) ? 1 : 0 );
         });
         for (var i = 0; i < children.length; ++i){
            var childControl = this._childControls[children[i]];
            if(!childControl){
               continue;
            }
            val = childControl.getTabindex();
            elementFound = childControl.isMarked && childControl.isMarked() && childControl.getContainer && $ws.helpers.isElementVisible(childControl.getContainer());
            areaFound = childControl._moveFailValidatedToFocus && !childControl._moveFailValidatedToFocus();
            if ( elementFound || // Либо ошибка у контрола
               areaFound ){    // Либо в area есть контрол с ошибкой
               res = false;
               minTab = val;
               minEl = children[i];
               break;
            }
         }
         if (elementFound) { // Если мы нашли элемент (он будет самым первым), то отдаём ему фокус
            this._childControls[minEl].setActive(true);
         }
         return res;
      },
      /**
       * <wiTag noShow>
       * Получить число тулабаров с определённой стороны области.
       * @param {String} side Сторона:
       * <ol>
       *    <li>top - сверху;</li>
       *    <li>right - справа;</li>
       *    <li>bottom - снизу;</li>
       *    <li>left - слева.</li>
       * </ol>
       * @example
       * <pre>
       *    if (this.getToolBarCount('top') === 0) {
       *       $ws.core.attachInstance('SBIS3.CORE.ToolBar', {
       *          position: 'top',
       *          buttonsSide: 'right',
       *          subBtnCfg: [
       *          //конфигурация кнопок
       *          ]
       *       });
       *       this.increaseToolBarCount('top');
       *    }
       * <pre>
       * @see increaseToolBarCount
       */
      //TODO: надо убрать
      getToolBarCount: function(side){
         return this._toolbarCount[side];
      },
      /**
       * <wiTag noShow>
       * Увеличить число тулабаров с какой-либо стороны области.
       * @param {String} side Сторона:
       * <ol>
       *    <li>top - сверху;</li>
       *    <li>right - справа;</li>
       *    <li>bottom - снизу;</li>
       *    <li>left - слева.</li>
       * </ol>
       * @example
       * <pre>
       *    toolbar.subscribe('onReady', function() {
       *       area.increaseToolBarCount('top');
       *    });
       * </pre>
       * @see getToolBarCount
       */
      //TODO: надо убрать
      increaseToolBarCount: function(side){
         ++this._toolbarCount[side];
      },
      /**
       * Описывает поведение контрола контейнерного типа при переключении состояния.
       * Если устанавливаем состояние в false - в переменную _prevState контролла записывается его текущее состояние,
       * а затем изменяется.
       * Если устанавливаем состояние в true - всем дочерним контролам устанавливаем его предыдущее состояние из
       * переменной _prevState.
       * @private
       */
      _setEnabled: function(enabled) {
         if (this._options.allowChangeEnable) {
            $ws.proto.AreaAbstract.superclass._setEnabled.apply(this, arguments);
            $ws.helpers.forEach(this.getImmediateChildControls(), function(control) {
               if (control._prevState === undefined || !enabled) {
                  control._prevState = control.isEnabled();
               }
            });
            for (var i = 0, len = this._childControls.length; i < len; ++i) {
               if (this._childControls[i] && this._childControls[i].setEnabled) {
                  if (!enabled) {
                     this._childControls[i].setEnabled(enabled);
                  } else {
                     this._childControls[i].setEnabled(this._childControls[i]._prevState);
                  }
               }
            }
         }
      },
      /**
       * <wiTag group="Управление">
       * Изменяет статус включенности элемента и всех его дочерних элементов.
       * При смене состояния в false - меняет всем дочерним контролам состояние на false, в противном случае
       * меняет состояние дочерних элементов на то, которое было до переключение в false.
       * @param {Boolean} enabled Статус "включенности" элемента управления.
       * @example
       * <pre>
       *    if(control.isEnabled())
       *       control.setEnabled(false);
       * </pre>
       */
      setEnabled : function(enabled) {
         $ws.proto.AreaAbstract.superclass.setEnabled.apply(this, arguments);
      },
      _getAutoHeight: function() {
         return this._resizer ?
                $ws.helpers.getElementCachedDim(this._resizer, 'height') :
                this._container.outerHeight();
      },

      _getAutoWidth: function() {
         return this._resizer ?
                $ws.helpers.getElementCachedDim(this._resizer, 'width') :
                this._container.outerWidth();
      },

      /**
       * Вычисляет свою возможную минимальную высоту
       * @return {Number}
       * @private
       */
      _calcMinHeight: function() {
         var result, size;
         if (this._resizer) {
            result = $ws.helpers.getElementCachedDim(this._resizer, 'height');
         } else {
            result = Math.max(this._options.minHeight, this._getResizerHeight());
         }
         return result || 0;
      },
      /**
       * Вычисляет свою возможную минимальную ширину
       * @return {Number}
       * @private
       */
      _calcMinWidth: function() {
         var result, size;
         if (this._resizer) {
            result = $ws.helpers.getElementCachedDim(this._resizer, 'width');
         } else {
            result = Math.max(this._options.minWidth, this._getResizerWidth());
         }
         return result || 0;
      },

      _needResizer: function() {
         return !this._options.isRelativeTemplate;
      },

      /**
       * Инициализация ресайзера контрола
       */
      _initResizers:function (){
         if(this._resizer){
            this._resizer.remove();
            this._resizer = null;
         }

         if (this._needResizer()) {
            if(this._options.autoHeight){
               this._container.height('auto');
               this._container.removeClass('ws-area-height-100-fix');
            }
            if(this._options.autoWidth){
               this._container.width('auto');
            }
            if(this._options.autoHeight || this._options.autoWidth || !this.parent){ // создавать ресайзер только если есть авторазмеры или мы корневой элемент

               this._resizer = $('<div />', {
                  'class': 'r',
                  'id': 'resizer-' + this.getId()
               });

               this._container.prepend(this._resizer);
               this._updateResizer();
            }
         }
      },
      /**
       * <wiTag noShow>
       * Получить ресайзер.
       * @returns {null|*}
       */
      getResizer: function(){
         return this._resizer;
      },

      _haveAutoSize: function() {
         return this._options.autoHeight || this._options.autoWidth;
      },

      _haveStretch: function() {
         return this._horizontalAlignment === 'Stretch' || this._verticalAlignment === 'Stretch';
      },

      _onResizeHandlerBatch: function() {
         this._onResizeHandler();

         if ($.dtPostFilter) {
            $.dtPostFilter({dom: this._container});
         }
      },

      _onSizeChangedBatch: function(controls) {
         $ws.helpers.forEach(controls, function(control) {
            delete this._childsSizes[control.getId()];
         }, this);

         if (this._needResizer()) {
            if (this._resizer) {
               this._updateResizer();
            }
            else {
               this._initResizers();
            }
         }

         return true;
      },

      /**
       * тут инициализируются размеры дочерних контролов, если ещё не инициализированы
       * @param doSetHeight - надо ли проставлять высоты. сделано, чтоб они не проставлялись два раза в _getResizerHeight
       * @private
       */
      _ensureControlsSizes: function(dim) {
         // высоту придётся брать всегда по новой потому что контрол с автовысотой может её изменить
         for(var i in this._childsMapId){
            if (!this._childsMapId.hasOwnProperty(i)) {
               continue;
            }

            var control = this._childControls[this._childsMapId[i]];
            if(control && control._isContainerInsideParent()){
               var size = this._childsSizes[i];
               if(size === undefined) {
                  size = this._childsSizes[i] = {};
               }

               var methods = {minWidth: 'getMinWidth', minHeight: 'getMinHeight'};
               if (size[dim] === undefined) {
                  size[dim] = control[methods[dim]]();
               }
            }
         }
      },

      _getResizerHeight : function(){
         var isVerticalFixedSize = !this._options.autoHeight,
            maxHeight = 0,
            h;

         if(!isVerticalFixedSize || (isVerticalFixedSize && !this.getParent())){
            this._ensureControlsSizes('minHeight');
            for(var id in this._childsSizes){
               if (!this._childsSizes.hasOwnProperty(id)) {
                  continue;
               }

               maxHeight = Math.max(maxHeight, this._childsSizes[id].minHeight);
            }
            h = $ws.helpers.getNonControlSize(this._childNonControls, 'Height');
            if(h > maxHeight){
               maxHeight = h;
            }
         }
         // для контролов с фиксированной шириной/высотой устанавливаем ресайзер, равный этой фиксированной ширине/высоте
         if(isVerticalFixedSize && this.getParent()){
            maxHeight = this._container.height();//getMinHeight();
         }
         return maxHeight;
      },

      _getResizerWidth : function(){
         var isHorizontalFixedSize = !this._options.autoWidth,
             maxWidth = 0, w;
         // if any dimention is "Auto" OR(!!!) this is root control with fixed
         // then calculate it from childsSizes
         if(!isHorizontalFixedSize || (isHorizontalFixedSize && !this.getParent())){
            this._ensureControlsSizes('minWidth');

            for(var id in this._childsSizes){
               if (!this._childsSizes.hasOwnProperty(id)) {
                  continue;
               }

               maxWidth = Math.max(maxWidth, this._childsSizes[id].minWidth);
            }
            w = $ws.helpers.getNonControlSize(this._childNonControls, 'Width');
            if(w > maxWidth){
               maxWidth = w;
            }
         }

         // для котнролов с фиксированной шириной/высотой устанавливаем ресайзер, равный этой фиксированной ширине/высоте
         if(isHorizontalFixedSize && this.getParent()){
            maxWidth = this._container.width();//getMinWidth();
         }
         return maxWidth;
      },

      _postUpdateResizer: function(width, height) {
      },

      /**
       * Обновляет ресайзер у контрола на основе текущих размеров вложенных в него контролов
       * (при auto-размере), иначе берет размеры контейнера.
       */
      _updateResizer:function (){
         if (this._needResizer()){
            var
               optMinHeight = parseInt(this._options.minHeight, 10),
               optMinWidth = parseInt(this._options.minWidth, 10),
               maxHeight = Math.max(this._getResizerHeight(), optMinHeight),
               maxWidth = Math.max(this._getResizerWidth(), optMinWidth);

            $ws.helpers.setElementCachedSize(this._resizer, {height: maxHeight, width: maxWidth});
            this._postUpdateResizer(maxWidth, maxHeight);
         } else if (this._resizer) {
            this._resizer.remove();
            this._resizer = null;
         }
      },
      /**
       * <wiTag group="Управление" noShow>
       * Получить индекс активации области.
       * @return {Number}
       */
      getActivationIndex: function(){
         return this._activationIndex;
      },
      /**
       * <wiTag group="Управление">
       * Получить контрол, который открыл окно.
       * Этот контрол может не являться родителем окна.
       * @returns {$ws.proto.Control|undefined} Экземпляр класса контрола.
       * @see opener
       */
      getOpener: function(){
         return this._opener;
      },
      canAcceptFocus: function(){
         function childOk(child) {
            return child && child.canAcceptFocus();
         }

         return this.isVisible() &&
                $ws.helpers.isElementVisible(this.getContainer()) &&
                !!$ws.helpers.find(this._childControls, childOk);
      },

      /**
       * <wiTag group="Управление">
       * Готова ли область.
       * @returns {Boolean} Признак: готова (true) или нет (false).
       * @see isAllReady
       * @see getReadyDeferred
       */
      isReady: function(){
         return this._isReady;
      },

      /**
       * <wiTag group="Отображение" noShow>
       * Является ли область страницей.
       * @returns {Boolean} Признак: true - является, false - нет.
       */
      isPage : function(){
         return this._isPage;
      },

      /**
       * Есть ли активный дочерний контрол
       * @return {boolean}
       */
      hasActiveChildControl: function() {
         return !!$ws.helpers.find(this._childControls, function(child) {
            if (child.isActive()) {
               return true;
            }
            if (child instanceof $ws.proto.AreaAbstract) {
               return child.hasActiveChildControl();
            }
         });
      }
   });

   return $ws.proto.AreaAbstract;

});
