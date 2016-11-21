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
            mode: 'dialog'

         },
         _dialog: undefined
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
         return this._openComponent(meta, this._options.template);
      },

      _openDialog: function(meta, template) {
         this._openComponent(meta, template, 'dialog');
      },

      _openFloatArea: function(meta, template) {
         this._openComponent(meta, template, 'floatArea');
      },

      _openComponent: function(meta, template, mode) {

         this._setConfig();


         this._showDialog(config, meta, mode);

         return executeDeferred;
      },

      _showDialog: function(config, meta, mode) {
         var floatAreaCfg,
             Component;
         mode = mode || this._options.mode;
         if (mode == 'floatArea') {
            Component = FloatArea;
            floatAreaCfg = this._getFloatAreaConfig(meta);
            cMerge(config, floatAreaCfg);
         } else if (mode == 'dialog') {
            Component = Dialog;
         }

         if (this._dialog && !this._dialog.isAutoHide()){
            cMerge(this._dialog._options, config);
            this._dialog.reload();
         }
         else{
            this._dialog = new Component(config);
         }
      },

      showDialog: function(config, meta, mode) {
         this._createDialog(config, meta, mode);
      },

      _buildComponentConfig: function(meta) {
         return {};
      },

      _createComponent: function(config, meta, mode) {
         var Component = (mode == 'floatArea') ? FloatArea : Dialog;
         this._dialog = new Component(config);
      },

      _getComponentConfig: function(meta) {
         var defaultConfig = {
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
            },
            config = {};
         meta.componentOptions = meta.componentOptions ||  {};
         colHelpers.forEach(defaultConfig, function(defaultValue, key){
            if (meta.hasOwnProperty(key)){
               IoC.resolve('ILogger').log('OpenDialogAction', 'Опция ' + key + ' для диалога редактирования должна задаваться через meta.dialogOptions');
               config[key] = meta[key];
            }
            else {
               config[key] = (meta.componentOptions[key] !== undefined) ? meta.componentOptions[key] : defaultValue;
            }
         });
         return config;
      },

      _setComponentConfig: function(meta, dialogComponent, mode) {
         var config = this._getComponentConfig(meta),
            self = this,
            executeDeferred = new Deferred(),
            compOptions = this._buildComponentConfig(meta);

         mode = mode || this._options.mode;

         cMerge(config, {
            opener: this,
            template: dialogComponent,
            componentOptions: compOptions,
            handlers: {
               onAfterClose: function(e, meta){
                  executeDeferred.callback(meta, this._record);
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
      }
   };

   return DialogMixin;
});