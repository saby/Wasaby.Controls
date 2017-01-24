define('js!SBIS3.CONTROLS.DialogActionBase', [
   "Core/core-merge",
   "Core/helpers/collection-helpers",
   "Core/IoC",
   "js!SBIS3.CONTROLS.ActionBase",
   "js!SBIS3.CORE.Dialog",
   "js!SBIS3.CORE.FloatArea",
   "i18n!SBIS3.CONTROLS.DialogActionBase"
], function(cMerge, colHelpers, IoC, ActionBase, Dialog, FloatArea){
   'use strict';

   /**
    * Класс, который описывает действие открытия окна с заданным шаблоном.
    * @class SBIS3.CONTROLS.DialogActionBase
    * @public
    * @extends SBIS3.CONTROLS.ActionBase
    * @author Крайнов Дмитрий Олегович
    *
    * @ignoreOptions validators independentContext contextRestriction extendedTooltip
    * @ignoreOptions visible tooltip tabindex enabled className alwaysShowExtendedTooltip allowChangeEnable
    *
    * @ignoreMethods activateFirstControl activateLastControl addPendingOperation applyEmptyState applyState clearMark
    * @ignoreMethods changeControlTabIndex destroyChild detectNextActiveChildControl disableActiveCtrl findParent
    * @ignoreMethods focusCatch getActiveChildControl getChildControlById getChildControlByName getChildControls
    * @ignoreMethods getClassName getContext getEventBusOf getEventHandlers getEvents getExtendedTooltip getOpener
    * @ignoreMethods getImmediateChildControls getLinkedContext getNearestChildControlByName getOwner getOwnerId
    * @ignoreMethods getReadyDeferred getStateKey getTabindex getUserData getValue hasActiveChildControl hasChildControlByName
    * @ignoreMethods hasEventHandlers isActive isAllReady isDestroyed isMarked isReady makeOwnerName setOwner setSize
    * @ignoreMethods markControl moveFocus moveToTop once registerChildControl registerDefaultButton saveToContext
    * @ignoreMethods sendCommand setActive setChildActive setClassName setExtendedTooltip setOpener setStateKey activate
    * @ignoreMethods setTabindex setTooltip setUserData setValidators setValue storeActiveChild subscribe unregisterChildControl
    * @ignoreMethods unregisterDefaultButton unsubscribe validate waitAllPendingOperations waitChildControlById waitChildControlByName
    * @ignoreMethods setVisible toggle show isVisible hide getTooltip isAllowChangeEnable isEnabled isVisibleWithParents
    *
    * @ignoreEvents onActivate onAfterLoad onAfterShow onBeforeControlsLoad onBeforeLoad onBeforeShow onChange onClick
    * @ignoreEvents onFocusIn onFocusOut onKeyPressed onReady onResize onStateChanged onTooltipContentRequest
    * @ignoreEvents onDragIn onDragMove onDragOut onDragStart onDragStop
    */
   var DialogActionBase = ActionBase.extend(/** @lends SBIS3.CONTROLS.DialogActionBase.prototype */{
      $protected : {
         _options : {
            /**
             * @cfg {String} Устанавливает компонент, который будет открыт на диалоге.
             * @remark
             * К компоненту установлены требования - он должен быть наследником класса {@link SBIS3.CONTROLS.FormController}.
             * Подробнее о создании такого компонента и его конфигурации вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/dialogs/create-and-config/">Создание компонента диалога и его конфигурация</a>.
             */
            dialogComponent : '',
            /**
             * @cfg {String} Устанавливает тип диалога.
             * @variant dialog Открытие диалога производится в модальном окне, которое создаётся на основе контрола {@link SBIS3.CORE.Dialog}.
             * @variant floatArea Открытие диалога производится на всплывающей панели, которая создаётся на основе контрола {@link SBIS3.CORE.FloatArea}.
             */
            mode: 'dialog'
         },
         _dialog: undefined
      },
      $constructor: function() {
         this._publish('onAfterShow', 'onBeforeShow', 'onExecuted', 'onReadModel', 'onUpdateModel', 'onDestroyModel', 'onCreateModel');
      },
      /**
       * Установить компонент, который будет использован в качестве диалога редактирования записи.
       * @param dialogComponent компонент, который будет использован в качестве диалога редактирования записи. {@link dialogComponent}.
       */
      setDialogComponent: function(dialogComponent){
         this._options.dialogComponent = dialogComponent;
      },
      /**
       * Установить режим открытия диалога редактирования компонента.
       * @param {String} mode режим открытия диалога редактирования компонента {@link mode}.
       */
      setMode: function(mode){
         this._options.mode = mode;
      },
      /**
       * @typedef {Object} ExecuteMetaConfig
       * @property {String|Number} id Первичный ключ записи. Передается в конфигурацию диалога в опцию {@link SBIS3.CONTROLS.FormController#key}.
       * @property {Object} filter Объект, свойства которого могут быть использованы для установки инициализирующих данных при создании новой записи. Передается в конфигурацию диалога в опцию {@link SBIS3.CONTROLS.FormController#initValues}.
       * @property {Object} readMetaData Дополнительные мета-данные, которые будут переданы в метод прочитать. Передается в конфигурацию диалога в опцию {@link SBIS3.CONTROLS.FormController#readMetaData}.
       * @property {WS.Data/Entity/Record} item Экземпляр класса записи. Передается в конфигурацию диалога в опцию {@link SBIS3.CONTROLS.FormController#record}.
       * @property {String} initializingWay Способ инициализации данных диалога, подробнее о котором вы можете прочитать <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/dialogs/initializing-way/">здесь</a>.
       * @property {Object} componentOptions Пользовательские опции, которые будут переданы в диалог в секцию _options.
       * @property {Object} dialogOptions Опции, которые переопределяют конфигурацию диалога. Набор опций зависит от типа диалога (см. {@link mode}).
       * <ul>
       *    <li>Если <i>mode=dialog</i>, то набор опций такой: {@link $ws.proto.Dialog#title title}, {@link $ws.proto.Dialog#border border} и {@link $ws.proto.Dialog#buildMarkupWithContext buildMarkupWithContext}.</li>
       *    <li>Если <i>mode=floatArea</i>, то набор опций такой: {@link $ws.proto.FloatArea#title title}, {@link $ws.proto.FloatArea#border border}, {@link $ws.proto.FloatArea#buildMarkupWithContext buildMarkupWithContext}, {@link $ws.proto.FloatArea#animation animation}, {@link $ws.proto.FloatArea#autoCloseOnHide autoCloseOnHide}, {@link $ws.proto.FloatArea#showOnControlsReady showOnControlsReady}, {@link $ws.proto.FloatArea#autoHide autoHide}, {@link $ws.proto.FloatArea#isStack isStack}, {@link $ws.proto.FloatArea#side side} и {@link $ws.proto.FloatArea#target target}.</li>
       * </ul>
       */
      /**
       * Производит открытие диалога.
       * @param {ExecuteMetaConfig} meta Параметры, которые переопределяют конфигурацию диалога.
       * @remark
       * Подробнее об использовании параметров вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/editing-dialog/open-dialog/#_2">Изменение конфигурации данных диалога</a>.
       * @example
       * Открытие диалога при нажатии на кнопку.
       * <pre>
       * // myButton - экземпляр класса кнопки
       * // myDialogAction - экземпляр класса SBIS3.CONTROLS.OpenDialogAction
       * myButton.subscribe('onActivated', function(){
       *    myDialogAction.execute({
       *       id: myId,
       *       item: myItem
       *    });
       * });
       * </pre>
       */
      execute : function(meta) {
         this._opendEditComponent(meta, this._options.dialogComponent);
      },

      _opendEditComponent: function(meta, dialogComponent, mode){
         this._setConfig(meta, dialogComponent, mode);
      },

      _setConfig: function(meta, dialogComponent, mode){
         var config = this._getDialogConfig(meta),
             self = this,
             compOptions = this._buildComponentConfig(meta);

         mode = mode || this._options.mode;

         cMerge(config, {
            opener: this,
            template: dialogComponent,
            componentOptions: compOptions,
            handlers: {
               onAfterClose: function(e, meta){
                  self._notifyOnExecuted(meta, this._record);
                  self._dialog = undefined;
               },
               onBeforeShow: function(){
                  self._notify('onBeforeShow');
               },
               onAfterShow: function(){
                  self._notify('onAfterShow');
               }
            }
         });

         this._showDialog(config, meta, mode);
      },

      _showDialog: function(config, meta, mode){
         this._createDialog(config, meta, mode);
      },

      _buildComponentConfig: function(meta){
         return {};
      },

      _createDialog: function(config, meta, mode){
         var Component = (mode == 'floatArea') ? FloatArea : Dialog;
         this._dialog = new Component(config);
      },

      _getDialogConfig: function(meta){
         var defaultConfig = {
               isStack: true,
               autoHide: true,
               buildMarkupWithContext: true,
               showOnControlsReady: false,
               autoCloseOnHide: true,
               border: true,
               target: '',
               side: 'left',
               animation: 'slide'
               /* временнное решение проблемы описанной в надзадаче */
               , block_by_task_1173286428: false
            },
            floatAreaCfg = {};
         if (!meta.dialogOptions){
            meta.dialogOptions = {};
         }

         //FloatArea и Dialog позволяют задать title прямо на опциях шаблона-компонента.
         //Поэтому, если при вызове execute, нам явно не говорят, какой должен быть title, то не перебиваем его
         if (meta.dialogOptions.title) {
            defaultConfig.title = meta.dialogOptions.title;
         }

         colHelpers.forEach(defaultConfig, function(defaultValue, key) {
            if (meta.hasOwnProperty(key)) {
               IoC.resolve('ILogger').log('OpenDialogAction', 'Опция ' + key + ' для диалога редактирования должна задаваться через meta.dialogOptions');
               floatAreaCfg[key] = meta[key];
            }
            else {
               floatAreaCfg[key] = (meta.dialogOptions[key] !== undefined) ? meta.dialogOptions[key] : defaultValue;
            }
         });

         return floatAreaCfg;
      }
   });
   return DialogActionBase;
});