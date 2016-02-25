/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.MoveDialogTemplate', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.MoveDialogTemplate',
   'js!SBIS3.CONTROLS.Button',
   'js!SBIS3.CONTROLS.TreeDataGridView'
], function(Control, dotTplFn) {

   var MoveDialogTemplate = Control.extend({
      _dotTplFn: dotTplFn,

      $protected: {
         _options: {
            name: 'moveDialog',
            autoHeight: false,
            width: '400px',
            height: '400px',
            resizable: false,
            linkedView: undefined,
            records: undefined,
            rootNodeName: 'Корень',
            rootNodeId: 'moveDialog_rootNode',
            cssClassName: 'controls-MoveDialog'
         },
         treeView: undefined
      },
      $constructor: function() {
         this._publish('onPrepareFilterOnMove');
         this._container.removeClass('ws-area');
         this.subscribe('onReady', this._onReady.bind(this));
      },
      _onReady: function() {
         var
             linkedView = this._options.linkedView,
             filter;
         this._treeView = this.getChildControlByName('MoveDialogTemplate-TreeDataGridView');
         //TODO: Избавиться от этого события в .100 версии. Придрот для выпуска .20 чтобы подменить фильтр в диалоге перемещения. Необходимо придумать другой механизм.
         filter = this._notify('onPrepareFilterOnMove', this._options.records) || {};
         if ($ws.helpers.instanceOfModule(linkedView._dataSource, 'SBIS3.CONTROLS.SbisServiceSource') || $ws.helpers.instanceOfModule(linkedView._dataSource,'SBIS3.CONTROLS.Data.Source.SbisService')) {
            filter['ВидДерева'] = "Только узлы";
            //TODO: костыль написан специально для нуменклатуры, чтобы не возвращалась выборка всех элементов при заходе в пустую папку
            filter['folderChanged'] = true;
         }
         this._treeView.setFilter(filter, true);
         this._treeView.setDataSource(linkedView._dataSource);
      },
      _onMoveButtonActivated: function() {
         var
             self = this.getParent(),
             moveTo = self._treeView.getSelectedKey();
         moveTo = moveTo !== self._options.rootNodeId ? self._treeView._dataSet.getRecordByKey(moveTo) : null;
         if (self._treeView._checkRecordsForMove(self._options.records, moveTo)) {
            self._options.linkedView._move(self._options.records, moveTo);
         }
         this.sendCommand('close');
      },
      _onDataLoad: function(event, data) {
         var
             root = {},
             self = this.getParent(),
             hierField = this.getHierField();
         //Установим всем записям в родителя фейковый корень
         data.each(function(item) {
            item.set(hierField, self._options.rootNodeId);
         });
         //Создадим и подкинем фейковый корень
         root[this._options.keyField] = self._options.rootNodeId;
         root[hierField] = null;
         root[hierField + '@'] = true;
         root[this._options.displayField] = self._options.rootNodeName;
         data.push(root);
         event.setResult(data);
      },
      //TODO: после второго создания диалога начинает падать ошибка: SBIS3.CONTROLS.Data.Projection.CollectionEnumerator: position is out of bounds
      //Разобраться с Мальцевым в чём проблема и поправить в 3.7.4 задав опцию selectedKey через шаблон.
      _onDrawItems: function() {
         var self = this.getParent();
         this.setSelectedKey(self._options.rootNodeId);
      }
   });

   return MoveDialogTemplate;
});