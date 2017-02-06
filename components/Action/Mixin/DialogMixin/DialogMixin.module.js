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
            Utils.logger.stack(this._moduleName + '::$constructor(): option "dialogComponent" is deprecated and will be removed in 3.7.4.100', 1);
            this._options.template = this._options.dialogComponent;
         }

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
         return this._opendEditComponent(meta, this._options.template);
      },
      _openDialog: function(meta, template) {
         this._opendEditComponent(meta, template, 'dialog');
      },
      _openFloatArea: function(meta, template) {
         this._opendEditComponent(meta, template, 'floatArea');
      },

      _opendEditComponent: function(meta, template, mode) {
         //Производим корректировку идентификатора только в случае, когда идентификатор передан
         if (meta.hasOwnProperty('id')) {
            meta.id = this._getEditKey(meta.item) || meta.id;
         }

         var self = this,
            compOptions = this._buildComponentConfig(meta),
            editDeferred = new Deferred(),
            config = {
               opener: this,
               template: template||this._options.template,
               componentOptions: compOptions
            };

         if (meta.title) {
            config.title = meta.title;
         }


         config.handlers = {
            onAfterClose: function (e, meta) {
               self._dialog = undefined;
               editDeferred.callback(meta, this._record);
            }
         };

         this._showDialog(config, meta, mode);

         return editDeferred;
      },

      _showDialog: function(config, meta, mode){
         var floatAreaCfg,
             Component;
         if (this._options.dialogOptions) {
            cMerge(config, this._options.dialogOptions);
         }
         mode = mode || this._options.mode;
         if (mode == 'floatArea') {
            Component = FloatArea;
            floatAreaCfg = this._getFloatAreaConfig(meta);
            cMerge(config, floatAreaCfg);
         } else if (mode == 'dialog') {
            Component = Dialog;
            cMerge(config, meta);
         }

         if (this._dialog && !this._dialog.isAutoHide()){
            cMerge(this._dialog._options, config);
            this._dialog.reload();
         }
         else{
            this._dialog = new Component(config);
         }
      },

      _getFloatAreaConfig: function(meta){
         var defaultConfig = {
               isStack: true,
               autoHide: true,
               buildMarkupWithContext: false,
               showOnControlsReady: true,
               autoCloseOnHide: true,
               target: '',
               side: 'left',
               animation: 'slide'
            },
            floatAreaCfg = {};

         colHelpers.forEach(defaultConfig, function(value, prop){
            floatAreaCfg[prop] = meta[prop] !== undefined ? meta[prop] : defaultConfig[prop];
         });

         return floatAreaCfg;
      },

      _buildComponentConfig: function(meta) {
         var
            config = cMerge({}, this._options.componentOptions || {}),
            metaConfig = meta && meta.componentOptions ? meta.componentOptions : {};
         return cMerge(config,  metaConfig );
      },

      setDialogComponent: function(val) {
         Utils.logger.stack(this._moduleName + '::$constructor(): option "dialogComponent" is deprecated and will be removed in 3.7.4.100', 1);
         this._options.template = val;
      }
   };

   return DialogMixin;
});