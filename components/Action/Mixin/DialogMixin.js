/*global define, $ws*/
define('SBIS3.CONTROLS/Action/Mixin/DialogMixin', [
   'Core/core-merge',
   'Core/Deferred',
   'Core/core-instance',
   'WS.Data/Utils',
   'SBIS3.CONTROLS/ControlHierarchyManager',
   'Core/IoC',
   'Core/helpers/isNewEnvironment',
   'Controls/Utils/isVDOMTemplate'
], function(cMerge, Deferred, cInstance, Utils, ControlHierarchyManager, IoC, isNewEnvironment, isVDOMTemplate) {
   'use strict';

   /**
    * Миксин, который описывает Действие открытия окна, созданного по шаблону.
    * @mixin  SBIS3.CONTROLS/Action/Mixin/DialogMixin
    * @public
    * @author Крайнов Д.О.
    */
   var DialogMixin = /** @lends SBIS3.CONTROLS/Action/Mixin/DialogMixin.prototype */{
      /**
        * @event onAfterShow Происходит после отображения диалога.
        * @param {Core/EventObject} eventObject Дескриптор события.
        * @param {SBIS3.CONTROLS/Action/Mixin/DialogMixin} this Экземпляр класса Действия.
        * @see onBeforeShow
        */
      /**
        * @event onBeforeShow Происходит перед отображением диалога.
        * @param {Core/EventObject} eventObject Дескриптор события.
        * @param {SBIS3.CONTROLS/Action/Mixin/DialogMixin} this Экземпляр класса Действия.
        * @see onAfterShow
        */
      $protected: {
         _options: {

            /**
             * @deprecated Используйте опцию {@link template}.
             * @cfg {String} Устанавливает компонент, который будет использован в качестве диалога.
             * @see template
             * @see setDialogComponent
             */
            dialogComponent: '',

            /**
             * @cfg {String} Устанавливает шаблон диалога редактирования.
             * @remark
             * В качестве значения устанавливают имя компонента в виде "Examples/MyArea/MyName".
             * Подробнее о создании шаблона читайте в разделе <a href="/doc/platform/developmentapl/interface-development/forms-and-validation/windows/editing-dialog/create/">Создание диалога редактирования</a>.
             * @see mode
             */
            template: '',

            /**
             * @cfg {String} Устанавливает режим отображения диалога.
             * @variant dialog Открытие диалога производится в новом модальном окне, которое создаётся на основе контрола {@link Lib/Control/Dialog/Dialog}.
             * @variant floatArea Открытие диалога производится на всплывающей панели, которая создаётся на основе контрола {@link Lib/Control/FloatArea/FloatArea}.
             * @remark
             * Для получения/изменения значения опции используйте методы {@link setMode} и {@link getMode}.
             * @see template
             * @see setMode
             * @see getMode
             */
            mode: 'dialog',

            /**
             * @cfg {Object} Объект с пользовательскими опциями, которые передаются в диалог в секцию _options.
             */
            componentOptions: null,

            /**
             * @cfg {Object} Объект со опциями контрола Lib/Control/Dialog/Dialog или Lib/Control/FloatArea/FloatArea, на основе которого создаётся диалог.
             * @remark
             * Выбор контрола определяется по значению опции {@link mode}.
             * Для компонентов <a href="/doc/platform/developmentapl/interface-development/wasaby/">Wasaby</a>,
             * которые планируется открывать с помощью SBIS3.CONTROLS/Action/OpenDialog, список опций расширен:
             * <ul>
             *    <li>onResultHandler - функция-обработчик на событие onResult</li>
             *    <li>onCloseHandler - функция-обработчик на событие onClose</li>
             * </ul>
             */
            dialogOptions: null
         },
         _dialog: undefined,
         _openedPanelConfig: {},

         /**
          * Ключ модели из связного списка
          * Отдельно храним ключ для модели из связного списка, т.к. он может не совпадать с ключом редактируемой модели
          * К примеру в реестре задач ключ записи в реестре и ключ редактируемой записи различается, т.к. одна и та же задача может находиться в нескольких различных фазах
          */
         _linkedModelKey: undefined,
         _isExecuting: false, //Открывается ли сейчас панель
         _executeDeferred: undefined
      },
      $constructor: function() {
         if (this._options.dialogComponent && !this._options.template) {
            Utils.logger.log(this._moduleName + '::$constructor()', 'option "dialogComponent" is deprecated and will be removed in 3.8.0');
            this._options.template = this._options.dialogComponent;
         }
         if (isNewEnvironment()) {
            if (this._options.closeByFocusOut === undefined) {
               this._options.closeByFocusOut = true;
            }
         }
         this._documentClickHandler = this._documentClickHandler.bind(this);
         document.addEventListener('mousedown', this._documentClickHandler);
         document.addEventListener('touchstart', this._documentClickHandler);
         this._publish('onAfterShow', 'onBeforeShow');
      },
      _doExecute: function(meta) {
         if (!this._isExecuting) { //Если завершился предыдущий execute
            this._closeDialogAfterDestroy = meta && meta.hasOwnProperty('closeDialogAfterDestroy') ? meta.closeDialogAfterDestroy : true;
            this._executeDeferred = new Deferred();
            this._openComponent(meta);
            return this._executeDeferred;
         }
         return (new Deferred()).callback();
      },

      /**
       * Закрывает открытый диалог
       */
      closeDialog: function() {
         if (this._dialog) {
            this._dialog.close();
         }
      },

      _openDialog: function(meta) {
         this._openComponent(meta, 'dialog');
      },

      _openFloatArea: function(meta) {
         this._openComponent(meta, 'floatArea');
      },

      _openComponent: function(meta, mode) {
         var self = this;
         meta = meta || {};
         meta.mode = mode || meta.mode || this._options.mode; //todo в 3.17.300 убрать аргумент mode, его через execute проставить нельзя
         var config = this._getDialogConfig(meta);
         if (this._isDialogClosing()) {
            this._dialog.once('onAfterClose', function() {
               self._createComponent(config, meta);
            });
         }
         else {
            this._createComponent(config, meta);
         }
      },

      _buildComponentConfig: function(meta) {
         var config = cMerge({}, this._options.componentOptions || {});
         return cMerge(config,  meta.componentOptions || {});
      },

      _createComponent: function(config, meta) {
         var componentName = this._getComponentName(meta),
            self = this;

         if (this._isNeedToRedrawDialog()) {
            this._reloadTemplate(config);
         } else {
            this._isExecuting = true;
            requirejs([componentName], function(Component) {
               try {
                  var deps = [];
                  if (isNewEnvironment()) {
                     deps = self._prepareCfgForNewEnvironment(meta, config);
                     requirejs(deps, function(BaseOpener, CompatibleOpener, CompatibleLayer, Strategy, cfgTemplate) {
                        CompatibleLayer.load().addCallback(function() {
                           config._initCompoundArea = function(compoundArea) {
                              self._dialog = compoundArea;
                           };
                           if (isVDOMTemplate(cfgTemplate)) {
                              CompatibleOpener._preparePopupCfgFromOldToNew(config, cfgTemplate);
                           }
                           BaseOpener.showDialog(cfgTemplate, config, Strategy);
                        });
                     });
                  } else {
                     requirejs([config.template], function (cfgTemplate) {
                        //Если vdom - идем в слой совместимости
                        if (isVDOMTemplate(cfgTemplate)) {
                           requirejs(['Controls/Popup/Opener/BaseOpener', 'Controls/Popup/Compatible/BaseOpener'], function (BaseOpener, CompatibleOpener) {
                              self._prepareCfgForOldEnvironment(self, BaseOpener, CompatibleOpener, cfgTemplate, config);
                              //Синхронной проверки недостаточно, т.к. тут асинхронщина инстанс может не задестроиться и зависнуть
                              if (self._isNeedToRedrawDialog()) {
                                 self._reloadTemplate(config);
                                 return;
                              }
                              config.className = (config.className || "") + " controls-compoundAreaNew__floatArea";
                              self._dialog = new Component(config);
                           });
                        } else {
                           self._dialog = new Component(config);
                        }
                     });
                  }
               } catch (error) {
                  this._finishExecuteDeferred(error);
               }
            }.bind(this));

         }
      },

      _prepareCfgForNewEnvironment: function(meta,cfg) {
         cfg._mode = meta.mode;
         var dependencies = ['Controls/Popup/Opener/BaseOpener', 'Controls/Popup/Compatible/BaseOpener', 'Controls/Popup/Compatible/Layer'];
         if (meta.mode !== 'dialog' && cfg.isStack === true) {
            dependencies.push('Controls/Popup/Opener/Stack/StackController');
            cfg._type = 'stack';
            cfg._popupComponent = cfg._mode;
            cfg.className = (cfg.className || '') + ' controls-Stack';
         } else if (meta.mode !== 'dialog' && cfg.isStack === false && cfg.target) {
            dependencies.push('Controls/Popup/Opener/Sticky/StickyController');
            cfg._type = 'sticky';
            cfg._popupComponent = 'floatArea';
         } else {
            dependencies.push('Controls/Popup/Opener/Dialog/DialogController');
            cfg._type = 'dialog';
            cfg._popupComponent = cfg._mode;
         }
         dependencies.push(cfg.template);
         return dependencies
      },

      _prepareCfgForOldEnvironment: function(self, BaseOpener, CompatibleOpener, cfgTemplate, config) {
         if (isVDOMTemplate(cfgTemplate)) {
            CompatibleOpener._prepareConfigForNewTemplate(config, cfgTemplate);
            config.className = (config.className || '') + ' ws-invisible'; //Пока не построился дочерний vdom  шаблон - скрываем панель, иначе будет прыжок
            config.componentOptions._initCompoundArea = function(coumpoundArea) {
               var dialog = coumpoundArea && coumpoundArea.getParent();
               if (dialog) {
                  dialog._recalcPosition && dialog._recalcPosition(); //for floatarea
                  dialog._adjustWindowPosition && dialog._adjustWindowPosition(); //for window
                  dialog._container.closest('.ws-invisible').removeClass('ws-invisible');
               }
            };
         }
         config._openFromAction = true;
      },

      _reloadTemplate: function(config) {
         var self = this;
         this._resetComponentOptions();

         if (this._dialog._setCompoundAreaOptions) {
            requirejs(['Controls/Popup/Compatible/BaseOpener', config.template], function(compatibleOpener, Template) {
               compatibleOpener._prepareConfigForOldTemplate(config, Template);
               self._dialog._setCompoundAreaOptions(config.templateOptions);
               self._dialog.reload();
            });
         }
         else {
            var resetWidth = this._dialog._options.template !== config.template;
            cMerge(this._dialog._options, config);
            this._dialog.reload(true, resetWidth);
         }
      },

      _getComponentName: function(meta) {
         switch (meta.mode) {
            case 'floatArea':
               return 'Lib/Control/FloatArea/FloatArea';
            case 'recordFloatArea':
               //Для тех, кто переходит на vdom и на старой странице юзает recordFloatArea. Чтобы пользовались единой оберткой - action'ом.
               return 'Deprecated/Controls/RecordFloatArea/RecordFloatArea';
            default:
               return 'Lib/Control/Dialog/Dialog';
         }
      },

      _documentClickHandler: function(event) {
         //Клик по связному списку приводит к перерисовке записи в панели, а не открытию новой при autoHide = true
         if (this._dialog && this._openedPanelConfig.mode === 'floatArea' && this._dialog.isVisible() && this._openedPanelConfig.autoHide) {
            if (this._needCloseDialog(event.target) && !this._isClickToScroll(event)) {
               this._dialog.close();
            }
         }
      },
      _needCloseDialog: function(target) {
         // Диалог нужно закрыть при клике при следующих условиях
         if (
            // 1. Клик был по элементу в body (элемент не удалился сразу после клика)
            document.body.contains(target) &&
            // 2. Кликнутый элемент находится не внутри самого диалога
            !ControlHierarchyManager.checkInclusion(this._dialog, target) &&
            // 3. Кликнутый элемент не находится внутри "связанного" (например по опенеру) диалога
            !this._isLinkedPanel(target)
         ) {
            return true;
         }
         return false;
      },

      //Если клик был по другой панели, проверяю, связана ли она с текущей
      _isLinkedPanel: function(target) {
         var floatArea = $(target).closest('.ws-float-area-stack-cut-wrapper').find('.ws-float-area'); //Клик может быть в стики шапку, она лежит выше .ws-float-area
         if (floatArea.length) {
            return ControlHierarchyManager.checkInclusion(this._dialog, floatArea.wsControl().getContainer());
         }
         var openerContainer;

         //todo Compatible
         var compoundArea = $(target).closest('.controls-CompoundArea');
         if (compoundArea.length) {
            var opener = compoundArea[0].controlNodes[0].control.getOpener();
            while (opener) {
               if (opener === this._dialog) {
                  return true;
               }
               openerContainer = opener.getOpener && opener.getOpener() && opener.getOpener().getContainer();
               compoundArea = openerContainer && $(openerContainer).closest('.controls-CompoundArea');
               opener = compoundArea && compoundArea[0] && compoundArea[0].controlNodes[0].control;
            }
         }

         // Если кликнули в вдомный попап, связанный с текущей панелью по опенерам, то не закрываем панель
         var vdomPopup = $(target).closest('.controls-Popup')[0];
         if (vdomPopup) {
            var vdomPopupInstance;
            var prevOpenerContainer;
            while (vdomPopup) {
               // ищем до тех пор, пока не доберемся до опенера, лежащего не в вдом попапе
               vdomPopupInstance = vdomPopup.controlNodes[0].control;
               prevOpenerContainer = vdomPopupInstance._options.opener && vdomPopupInstance._options.opener._container;
               if (prevOpenerContainer) {
                  openerContainer = prevOpenerContainer;
                  vdomPopup = $(openerContainer).closest('.controls-Popup')[0];
               } else {
                  vdomPopup = null;
               }
            }
            return ControlHierarchyManager.checkInclusion(this._dialog, openerContainer);
         }

         //Определяем связь popupMixin и панели по опенерам. в цепочке могут появиться vdom компоненты, поэтому старый механизм может работать с ошибками
         var popupMixin = $(target).closest('.controls-FloatArea');
         if (popupMixin.length) {
            opener = popupMixin.wsControl().getOpener();
            while (opener) {
               if (opener === this._dialog) {
                  return true;
               }
               opener = opener.getOpener && opener.getOpener() || (opener.getParent && opener.getParent());
            }
         }

         //Если кликнули по инфобоксу или информационному окну или overlay - popup закрывать не нужно
         var infoBox = $(target).closest('.ws-info-box, .controls-InformationPopup, .ws-window-overlay, .js-controls-NotificationStackPopup, .controls-Container__overlay, .ws-OperationsPanel__wrapper, .ws-wait-indicator_global');
         return !!infoBox.length;
      },

      //При клике по нативному скроллу на странице не закрываем панель
      _isClickToScroll: function(event) {
         var hasContainerScroll = event.target.scrollWidth - event.target.offsetWidth > 0;
         return hasContainerScroll && event.target.offsetHeight - event.clientY < 17;
      },
      _resetComponentOptions: function() {
         //FloatArea предоставляет возможность перерисовать текущий установленный шаблон. При перерисовке сохраняются все опции, которые были установлены как на FloatArea, так и на редактируемом компоненте.
         //Производим открытие новой записи по новой конфигурации, все что лежало в опциях до этого не актуально и при текущем конфиге может поломать требуемое поведение.
         //Поэтому требуется избавиться от старых опций, чтобы reload компонента, фактически, открывал "новую" floatArea с новой конфигурацией, только в текущем открытом контейнере.
         //Требуется только сохранить опции, которые отвечают за размер панели
         var dialogOptions = this._dialog._options;
         dialogOptions.componentOptions = {
            isPanelMaximized: dialogOptions.maximized
         };
      },

      /**
       * Возвращает конфигурацию диалога по умолчанию.
       * @param meta
       * @returns {*}
       * @private
       */
      _getDefaultDialogConfig: function(meta) {
         return cMerge({
            isStack: true,
            showOnControlsReady: false,
            autoCloseOnHide: true,
            needSetDocumentTitle: false,
            opener: meta.opener || this._getOpener(), //opener по умолчанию
            template: meta.template || this._options.template,
            target: undefined,
            block_by_task_1173286428: false // временнное решение проблемы описанной в надзадаче
         }, this._options.dialogOptions || {});
      },
      _getOpener: function() {
         //В 375 все прикладники не успеют указать у себя правильных opener'ов, пока нахожу opener за них.
         //В идеале они должны делать это сами и тогда этот код не нужен
         var popup = this.getContainer() && this.getContainer().closest('.controls-FloatArea'),
            topParent,
            floatArea,
            floatAreaContainer;

         //Указываем opener'ом всплывающую панель, в которой лежит action, это может быть либо controls.FloatArea, либо core.FloatArea
         //Нужно в ситуации, когда запись перерисовывается в уже открытой панели, чтобы по opener'aм добраться до панелей, которые открыты из той,
         //которую сейчас перерисовываем, и закрыть их.
         if (popup && popup.length) {
            return popup.wsControl();
         } else {
            topParent = this.getTopParent();
            if (topParent !== this) {
               floatAreaContainer = topParent.getContainer().closest('.ws-float-area');
               floatArea = floatAreaContainer.length ? floatAreaContainer[0].wsControl : false;
            }
         }
         return floatArea || null;
      },

      /**
       * Возвращает конфигурацию диалога - всплывающей панели или окна.
       * @param {Object} meta
       * @returns {Object}
       * @private
       */
      _getDialogConfig: function(meta) {
         var config = this._getDefaultDialogConfig(meta),
            self = this;

         cMerge(config, meta.dialogOptions);
         this._saveAutoHideState(meta, config);
         config.componentOptions = this._buildComponentConfig(meta);
         config.handlers = config.handlers || {};
         var handlers = this._getDialogHandlers(meta);

         for (var name in handlers) {
            if (handlers.hasOwnProperty(name)) {
               if (config.handlers.hasOwnProperty(name) && config.handlers[name] instanceof Array) {
                  config.handlers[name].push(handlers[name]);
               } else if (config.handlers.hasOwnProperty(name))  {
                  config.handlers[name] = [config.handlers[name], handlers[name]];
               } else {
                  config.handlers[name] = handlers[name];
               }
            }
         }

         return config;
      },

      _getDialogHandlers: function(meta) {
         var self = this;
         return {
            onAfterClose: function(e, result) {
               self._isExecuting = false;
               self._finishExecuteDeferred();
               self._notifyOnExecuted(meta, result);
               self._dialog = undefined;
            },
            onBeforeShow: function() {
               self._notify('onBeforeShow', this);
            },
            onAfterShow: function() {
               self._isExecuting = false;
               self._notify('onAfterShow', this);
            }
         };
      },

      _saveAutoHideState: function(meta, config) {
         if (!this._options.closeByFocusOut) {
            this._openedPanelConfig = {
               autoHide: config.autoHide !== undefined ? config.autoHide : true,
               mode: meta.mode
            };
            config.autoHide = false;
         }
      },

      _finishExecuteDeferred: function(error) {
         if (this._executeDeferred && !this._executeDeferred.isReady()) {
            if (!error) {
               //false - т.к. приходится нотифаить событие onExecuted самому, из-за того, что базовый action
               //не может обработать валидный результат false
               //Выписал задачу, чтобы мог https://online.sbis.ru/opendoc.html?guid=c7ff3ac1-5884-40ef-bf84-e544d8a41ffa
               this._executeDeferred.callback(false);
            } else {
               this._executeDeferred.errback(error);
            }
         }
      },

      /**
       * Устанавливает режим открытия диалога редактирования компонента.
       * @param {String} mode режим открытия диалога редактирования компонента {@link mode}.
       * @see mode
       * @see getMode
       */
      setMode: function(mode) {
         this._options.mode = mode;
      },

      /**
       * Получить режим открытия диалога редактирования компонента.
       * @param {String} mode режим открытия диалога редактирования компонента {@link mode}.
       * @see mode
       * @see setMode
       */
      getMode: function() {
         return this._options.mode;
      },

      /**
       * @deprecated Используйте опцию {@link template}.
       * @description
       * Устанавливает компонент, который будет использован в качестве диалога редактирования записи.
       */
      setDialogComponent: function(template) {
         //нужно для того чтобы работал метод setProperty(dialogComponent)
         Utils.logger.log(this._moduleName + '::$constructor()', 'option "dialogComponent" is deprecated and will be removed in 3.8.0');
         this._options.template = template;

      },

      _isNeedToRedrawDialog: function() {
         //Нужно перерисовать панель если она есть, не задестроена и не находится в процессе открытия/закрытия
         return this._dialog && !this._dialog.isDestroyed() && !this._isDialogClosing();
      },

      _isDialogClosing: function() {
         //Панель либо закрывается, либо дожидается, пока закроются дочерние панели, чтобы закрыться самой
         return this._dialog && (this._dialog._state === 'hide' || this._dialog._deferClose === true);
      },

      /**
       @deprecated
       **/
      _opendEditComponent: function(meta, dialogComponent, mode) {
         IoC.resolve('ILogger').error('SBIS3.CONTROLS.OpenEditDialog', 'Используйте публичный метод execute для работы с action\'ом открытия диалога редактирования');
         meta.template = dialogComponent;
         this._openComponent.call(this, meta, mode);
      },

      after: {
         destroy: function() {
            if (this._dialog && this._closeDialogAfterDestroy) {
               if (cInstance.instanceOfModule(this._dialog, 'Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea')) {
                  this._dialog.close();
               } else {
                  this._dialog.destroy();
               }
            }
            this._dialog = undefined;
            document.removeEventListener('mousedown', this._documentClickHandler);
            document.removeEventListener('touchstart', this._documentClickHandler);

            // Очистим ссылку на обработчик клика, чтобы DialogMixin не остался в памяти
            this._documentClickHandler = undefined;
         }
      }
   };

   return DialogMixin;
});
