/*global define, $ws*/
define('js!SBIS3.CONTROLS.Action.DialogMixin', [
   "Core/core-merge",
   "Core/Deferred",
   "js!SBIS3.CORE.Dialog",
   "js!SBIS3.CORE.FloatArea",
   "js!WS.Data/Entity/Model",
   "js!WS.Data/Utils",
   "Core/helpers/collection-helpers"
], function( cMerge, Deferred,Dialog, FloatArea, Model, Utils, colHelpers){
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
            /*
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
         this._openComponent(meta, meta.template || this._options.template);
         return false;
      },

      _openDialog: function(meta, template) {
         this._openComponent(meta, template, 'dialog');
      },

      _openFloatArea: function(meta, template) {
         this._openComponent(meta, template, 'floatArea');
      },

      _openComponent: function(meta, template, mode) {
         var
            config = this._getDialogConfig(meta, template, mode);
         mode = mode || this._options.mode;
         if (this._dialog && (typeof this._dialog.isAutoHide == 'function') && !this._dialog.isAutoHide()) {
            cMerge(this._dialog._options, config);
            this._dialog.reload();
         }
         else {
            cMerge(config, meta);
            this._createComponent(config, meta, mode);
         }
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
      _getDeafuiltDialogConfig: function(mode) {
         var config = this._options.dialogOptions || {};
         if (mode == 'floatArea') {
            return cMerge({
               isStack: true,
               autoHide: true,
               buildMarkupWithContext: true,
               showOnControlsReady: false,
               autoCloseOnHide: true,
               border: true,
               target: '',
               title: '',
               side: 'left',
               animation: 'slide'
               /* временнное решение проблемы описанной в надзадаче */
               , block_by_task_1173286428: false
            }, config)
         } else {
            return cMerge({}, config);
         }
      },
      /**
       * Возвращает конфигурацию диалога - всплывающей панели или окна.
       * @param {Object} meta
       * @param {String} mode
       * @returns {Object}
       * @private
       */
      _getDialogConfig: function(meta, template, mode) {
         mode = mode || this._options.mode;
         var config = this._getDeafuiltDialogConfig(mode),
            self = this,
            compOptions = this._buildComponentConfig(meta);

         meta.componentOptions = meta.componentOptions  ||  {};
         meta.dialogOptions = meta.dialogOptions  ||  {};
         colHelpers.forEach(config, function(defaultValue, key){
            if (meta.hasOwnProperty(key)){
               IoC.resolve('ILogger').log('OpenDialogAction', 'Опция ' + key + ' для диалога редактирования должна задаваться через meta.componentOptions');
               config[key] = meta[key];
            }
            else {
               config[key] = (meta.componentOptions[key] !== undefined) ? meta.componentOptions[key] : defaultValue;
            }
         });
         cMerge(config, meta.dialogOptions);

         cMerge(config, {
            opener: this,
            template: template,
            componentOptions: compOptions,
            handlers: { 
               onAfterClose: function(e, meta){
                  self._notifyOnExecuted(meta);
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
         IoC.resolve('ILogger').info('SBIS3.CONTROLS.OpenEditDialog', 'method _opendEditComponent was deprecated please use _openComponent instead.');
         this._openComponent.call(this, meta, dialogComponent, mode);
      }

   };

   return DialogMixin;
});