define('js!SBIS3.CONTROLS.Browser', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Browser',
   'js!SBIS3.CONTROLS.ComponentBinder',
   'js!SBIS3.CORE.DialogRecord'
], function(CompoundControl, dotTplFn, ComponentBinder, DialogRecord){
   'use strict';

   /**
    * Базовый класс для реестра
    *
    * @class SBIS3.CONTROLS.Browser
    * @extends $ws.proto.CompoundControl
    * @public
    */

   var
      checkViewType = function(view) {
         if (view && $ws.helpers.instanceOfModule(view, 'SBIS3.CONTROLS.ListView')) {
            return $ws.helpers.instanceOfMixin(view, 'SBIS3.CONTROLS.TreeMixinDS');
         }
         else {
            throw new Error('Browser: Can\'t define linkedView');
         }
      },
      convertRecord = function(record) {
         var rec;
         if (record._raw.s && record._raw.d) {
            //TODO очень нужный метод
            var
               parser = new $ws.proto.ParserSBIS(),
               cfg = parser.readRecord(record._raw),
               pkValue;
            if (record._raw.d[0]) {
               pkValue = record._raw.d[0] instanceof Array ? record._raw.d[0][0] : record._raw.d[0];
            }
            rec = new $ws.proto.Record({
               colDef : cfg.columns,
               row : cfg.row,
               pkValue : pkValue
            })
         }
         return rec;
      };

   var Browser = CompoundControl.extend( /** @lends SBIS3.CONTROLS.Browser.prototype */{
      _dotTplFn : dotTplFn,
      $protected: {
         _view: null,
         _filtersButton: null,
         _backButton: null,
         _breadCrumbs: null,
         _searchForm: null,
         _operationsPanel: null,

         _hierMode : false,
         _componentBinder : null,
         _options: {
            /**
             * @cfg {Content} Содержимое реестра
             */
            content: '',
            /**
             * @cfg {String} Имя параметр фильтрации для поиска
             */
            searchParam : 'СтрокаПоиска',
            /**
             * @cfg {String} Компонент, который будет использоваться для диалога редактирования записи-листа
             */
            itemDialog: null,
            /**
             * @cfg {String} Компонент, который будет использоваться для диалога редактирования записи-узла
             */
            folderDialog: null
         }
      },

      $constructor: function () {

      },

      init: function() {
         Browser.superclass.init.apply(this, arguments);
         $ws.single.CommandDispatcher.declareCommand(this, 'editItem', this._editDialog);
         this._view = this._getView();
         var self = this;
         this._view.subscribe('onItemClick', function(e, id, data, target){
            //TODO нет метода для получения поля иерархии
            var hier = data.get(self._view._options.hierField + '@');
            if (!hier) {
               self._view.sendCommand('editItem', data, id);
            }
         });
         this._hierMode = checkViewType(this._view);


         this._searchForm = this._getSearchForm();
         if (this._hierMode) {
            this._backButton = this._getBackButton();
            this._breadCrumbs = this._getBreadCrumbs();
               if (this._backButton && this._breadCrumbs) {
                  this._componentBinder = new ComponentBinder({
                     backButton : this._backButton,
                     breadCrumbs : this._breadCrumbs,
                     view: this._view
                  });
                  this._componentBinder.bindBreadCrumbs();
               }
               else {
                  this._componentBinder = new ComponentBinder({
                     view: this._view
                  });
               }
         }
         else {
            this._componentBinder = new ComponentBinder({
               view: this._view
            });
         }
         if (this._searchForm) {
            /*TODO вторым аргументом отдаем undefined - это параметр шаблон хлебных крошек в режиме поиска
             решить что с этим делать, может выпилить но юзается в номенклатуре?*/
            this._componentBinder.bindSearchGrid(this._options.searchParam, undefined, this._searchForm);
         }


         this._operationsPanel = this._getOperationsPanel();
         if (this._operationsPanel) {
            this._componentBinder.bindOperationPanel(true, this._operationsPanel);
         }

      },



      _getLinkedControl: function(name) {
         var ctrl = null;
         if (this.hasChildControlByName(name)) {
            ctrl = this.getChildControlByName(name);
         }
         return ctrl;
      },

      _getView: function() {
         return this._getLinkedControl('browserView');
      },

      _getSearchForm: function() {
         return this._getLinkedControl('browserSearch');
      },
      _getBackButton: function() {
         return this._getLinkedControl('browserBackButton');
      },
      _getBreadCrumbs: function() {
         return this._getLinkedControl('browserBreadCrumbs');
      },
      _getOperationsPanel: function() {
         return this._getLinkedControl('browserOperationsPanel');
      },

      _editDialog: function(id, data, hier) {
         //onFolderEdit onItemEdit
         this._notify('on' + (hier ? 'Folder' : 'Item') + 'Edit', id, data);
      },

      openCompatibleDialog: function(dialogComponent, record, handlers) {
         var oldRecord = convertRecord(record);
         new DialogRecord({
            template : dialogComponent,
            record : oldRecord,
            handlers : handlers
         })
      }


   });

   return Browser;
});