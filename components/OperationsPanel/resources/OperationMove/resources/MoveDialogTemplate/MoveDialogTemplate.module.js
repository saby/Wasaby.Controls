/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.MoveDialogTemplate', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.MoveDialogTemplate',
   'js!SBIS3.CONTROLS.Button',
   'js!SBIS3.CONTROLS.TreeDataGridView',
   'i18n!SBIS3.CONTROLS.MoveDialogTemplate'
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
         moveTo = moveTo !== 'null' ? self._treeView._dataSet.getRecordByKey(moveTo) : null;
         if (self._treeView._checkRecordsForMove(self._options.records, moveTo)) {
            self._options.linkedView._move(self._options.records, moveTo);
         }
         this.sendCommand('close');
      },
      //TODO: в 3.7.4 переделать на фейковую запись, а не тупо подпихивать tr.
      _createRoot: function() {
         var
             self = this,
             rootBlock = this._container.find('tbody .controls-MoveDialog__root');
         if (!rootBlock.length) {
            rootBlock = $('<tr class="controls-DataGridView__tr controls-ListView__item controls-ListView__folder" style="" data-id="null"><td class="controls-DataGridView__td controls-MoveDialog__root"><div class="controls-TreeView__expand js-controls-TreeView__expand has-child controls-TreeView__expand__open"></div>' + rk("Корень") + '</td></tr>');
            rootBlock.bind('click', function(event) {
               self._container.find('.controls-ListView__item').toggleClass('ws-hidden');
               rootBlock.toggleClass('ws-hidden').find('.controls-TreeView__expand').toggleClass('controls-TreeView__expand__open');
               self.setSelectedKey('null');
               rootBlock.addClass('controls-ListView__item__selected');
               event.stopPropagation();
            });
            rootBlock.prependTo(self._container.find('tbody'));
            self.setSelectedKey('null');
            //TODO: Установим марке отметки на фейковый корень по таймауту т.к. сначала стреляет событие onDrawItems по которому
            //вызывается данный метод, а потом отрабатывает метод _drawItemsCallback который в Selectable.module.js
            //убирает маркер т.к. не находит запись с id='null' в наборе данных.
            setTimeout(function() {
               rootBlock.addClass('controls-ListView__item__selected');
            }, 0);
         }
      }
   });

   return MoveDialogTemplate;
});