/*global define, $ws*/
define('js!SBIS3.CONTROLS.Action.DialogMixin', [
   "Core/core-merge",
   "Core/Deferred",
   "js!SBIS3.CORE.Dialog",
   "js!SBIS3.CORE.FloatArea",
   "js!WS.Data/Entity/Model",
   "js!WS.Data/Utils",
   "Core/helpers/collection-helpers",
   'Core/IoC'
], function( cMerge, Deferred,Dialog, FloatArea, Model, Utils, colHelpers, IoC){
   'use strict';

   /**
    * Действие открытия окна с заданным шаблоном
    * @mixin  SBIS3.CONTROLS.Action.DialogMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var DialogMixin = /** @lends SBIS3.CONTROLS.Action.DialogMixin.prototype */{
      $protected : {
         _options : {
            /**
             * @deprecated используйте template
             * @cfg {String} Устанавливает компонент, который будет использован в качестве диалога редактирования записи.
             * @see template
             */
            dialogComponent: '',
            /**
             * @cfg {String} Устанавливает компонент, который будет использован в качестве диалога редактирования записи.
             * @remark
             * Компонент должен быть наследником класса {@link SBIS3.CONTROLS.FormController}.
             * Подробнее о создании таких компонентов вы можете прочитать в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/editing-dialog/component/">Создание компонента для диалога редактирования</a>.
             * Режим отображения диалога редактирования устанавливают с помощью опции {@link mode}.
             * @see mode
             */
            template : '',
            /**
             * @cfg {String} Устанавливает режим открытия диалога редактирования компонента.
             * @variant dialog Открытие производится в новом диалоговом окне.
             * @variant floatArea Открытие производится на всплывающей панели.
             * @remark
             * Диалог редактирования устанавливают с помощью опции {@link template}.
             * @see template
             */
            mode: 'dialog',
            /**
             * @cfg {Object} Объект содержащий опции компонента.
             */
            componentOptions: null,
            /**
             * @cfg {Object} Объкт содержащий опции диалога 
             */
            dialogOptions: null
         },
         _dialog: undefined,
         /**
          * Ключ модели из связного списка
          * Отдельно храним ключ для модели из связного списка, т.к. он может не совпадать с ключом редактируемой модели
          * К примеру в реестре задач ключ записи в реестре и ключ редактируемой записи различается, т.к. одна и та же задача может находиться в нескольких различных фазах
          */
         _linkedModelKey: undefined
      },
      /**
       * @typedef {Object} ExecuteMetaConfig
       * @property {DataSource} dataSource Источник данных, который будет установлен для диалога редактирования.
       * @property {String|Number} id Первичный ключ записи, которую нужно открыть на диалоге редактирования. Если свойство не задано, то нужно передать запись свойством record.
       * @property {Boolean} newModel Признак: true - в диалоге редактирования открыта новая запись, которой не существует в источнике данных.
       * @property {Object} filter Объект, данные которого будут использованы в качестве инициализирующих данных при создании новой записи.
       * Название свойства - это название поля записи, а значение свойства - это значение для инициализации.
       * @property {WS.Data/Entity/Model} record Редактируемая запись. Если передаётся ключ свойством key, то запись передавать необязательно.
       * @property {$ws.proto.Context} ctx Контекст, который нужно установить для диалога редактирования записи.
       */
      $constructor: function() {

         if ( this._options.dialogComponent && !this._options.template) {
            Utils.logger.stack(this._moduleName + '::$constructor(): option "dialogComponent" is deprecated and will be removed in 3.8.0', 1);
            this._options.template = this._options.dialogComponent;
         }
         this._publish('onAfterShow', 'onBeforeShow');
      },
      /**
       * Открывает диалог редактирования записи.
       * @param {ExecuteMetaConfig} meta Параметры, которые будут использованы для конфигурации диалога редактирования.
       * @example
       * Произведём открытие диалога с предустановленными полями для создаваемой папки:
       * <pre>
       * myAddFolderButton.subscribe('onActivated', function() { // Создаём обработчик нажатия кнопки
       *    myDialogAction.execute({ // Инициируем вызов диалога для создания новой папки
       *       filter: {
       *          'Раздел': null, // Поле иерархии, папка создаётся в корне иерархической структуры
       *          'Раздел@': true // Признак папки в иерархической структуре
       *       }
       *    });
       * });
       *
      */
      _doExecute: function(meta) {
         this._openComponent(meta);
         return false;
      },

      _openDialog: function(meta) {
         this._openComponent(meta, 'dialog');
      },

      _openFloatArea: function(meta) {
         this._openComponent(meta, 'floatArea');
      },

      _openComponent: function(meta, mode) {
         var config = this._getDialogConfig(meta);
         this._createComponent(config, meta, mode || this._options.mode);
      },

      _buildComponentConfig: function(meta) {
         var
            config = cMerge({}, this._options.componentOptions || {}),
            metaConfig = meta && meta.componentOptions ? meta.componentOptions : {};
         return cMerge(config,  metaConfig )
      },

      _createComponent: function(config, meta, mode) {
         var Component = (mode == 'floatArea') ? FloatArea : Dialog;
         if (this._isNeedToRedrawDialog()){
            //FloatArea предоставляет возможность перерисовать текущий установленный шаблон. При перерисовке сохраняются все опции, которые были установлены как на FloatArea, так и на редактируемом компоненте.
            //Производим открытие новой записи по новой конфигурации, все что лежало в опциях до этого не актуально и при текущем конфиге может поломать требуемое поведение.
            //Поэтому требуется избавиться от старых опций, чтобы reload компонента, фактически, открывал "новую" floatArea с новой конфигурацией, только в текущем открытом контейнере.
            this._dialog._options.componentOptions = {};
            cMerge(this._dialog._options, config);
            this._dialog.reload();
         }
         else{
            this._dialog = new Component(config);
         }
      },
      /**
       * Возвращает конфигурацию диалога по умолчанию.
       * @param mode
       * @returns {*}
       * @private
       */
      _getDeafuiltDialogConfig: function() {
         var config = this._options.dialogOptions || {};
         return cMerge({
            isStack: true,
            showOnControlsReady: false,
            autoCloseOnHide: true,
            block_by_task_1173286428: false // временнное решение проблемы описанной в надзадаче
         }, config)
      },
      /**
       * Возвращает конфигурацию диалога - всплывающей панели или окна.
       * @param {Object} meta
       * @param {String} template
       * @param {String} mode
       * @returns {Object}
       * @private
       */
      _getDialogConfig: function(meta) {
         var config = this._getDeafuiltDialogConfig(),
             compOptions = this._buildComponentConfig(meta),
             self = this;
         colHelpers.forEach(config, function(defaultValue, key){
            if (meta.hasOwnProperty(key)){
               IoC.resolve('ILogger').log('OpenDialogAction', 'Опция ' + key + 'должна задаваться через meta.dialogOptions');
               config[key] = meta[key];
            }
         });
         cMerge(config, meta.dialogOptions  ||  {});
         cMerge(config, {
            opener: this,
            template: meta.template || this._options.template,
            componentOptions: compOptions,
            handlers: { 
               onAfterClose: function(e, result){
                  self._notifyOnExecuted(meta, result);
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

         return config;
      },

      /**
       * Установить режим открытия диалога редактирования компонента.
       * @param {String} mode режим открытия диалога редактирования компонента {@link mode}.
       */
      setMode: function(mode) {
         this._options.mode = mode;
      },
      /**
       * Получить режим открытия диалога редактирования компонента.
       * @param {String} mode режим открытия диалога редактирования компонента {@link mode}.
       */
      getMode: function() {
         return this._options.mode;
      },
      /**
       * Устанавливает название шаблона
       * @param {String} Название модуля шаблона.
       * @deprecated
       */
      setDialogComponent: function (template) {
         //нужно для того чтобы работал метод setProperty(dialogComponent)
         Utils.logger.stack(this._moduleName + '::$constructor(): option "dialogComponent" is deprecated and will be removed in 3.8.0', 1);
         this._options.template = template;

      },

      _isNeedToRedrawDialog: function(){
         return this._dialog && !this._dialog.isDestroyed() && (this._dialog.isAutoHide && !this._dialog.isAutoHide());
      },

      /**
       @deprecated
       **/
      _opendEditComponent: function(meta, dialogComponent, mode){
         IoC.resolve('ILogger').error('SBIS3.CONTROLS.OpenEditDialog', 'Используйте публичный метод execute для работы с action\'ом открытия диалога редактирования');
         meta.template = dialogComponent;
         this._openComponent.call(this, meta, mode);
      }

   };

   return DialogMixin;
});