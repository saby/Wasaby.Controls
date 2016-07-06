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
            name: 'controls-moveDialog',
            autoHeight: false,
            width: '400px',
            height: '400px',
            resizable: false,
            displayField: undefined,
            hierField: undefined,
            keyField: undefined,
            dataSource: undefined,
            items: undefined,
            prepareFilter: undefined,
            /**
             * @cfg {String} Заголовок диалог
             */
            title: 'Перенести записи в',
            filter: undefined
         },
         treeView: undefined
      },
      $constructor: function() {
         this._container.removeClass('ws-area');
         this.subscribe('onReady', this._onReady.bind(this));
      },
      _onReady: function() {
         var
             filter = this._options.filter || {},
             dataSource = this._options.dataSource;
         this._treeView = this.getChildControlByName('MoveDialogTemplate-TreeDataGridView');
         if ($ws.helpers.instanceOfModule(dataSource, 'SBIS3.CONTROLS.Data.Source.SbisService')) {
            filter['ВидДерева'] = "Только узлы";
         }
         this._treeView.setFilter(filter, true);
         this._treeView.setDataSource(dataSource);
      },
      _onMoveButtonActivated: function() {
         var
             self = this.getParent(),
             treeView = self._treeView,
             target = treeView.getSelectedKey();
         target = target !== 'null' ? treeView._dataSet.getRecordByKey(target) : null;
         this.sendCommand('close', target);
      },
      //TODO: в 3.7.4 переделать на фейковую запись, а не тупо подпихивать tr.
      _createRoot: function() {
         var
             self = this,
             rootBlock = $('<tr class="controls-DataGridView__tr controls-ListView__item controls-ListView__folder" style="" data-id="null"><td class="controls-DataGridView__td controls-MoveDialog__root"><div class="controls-TreeView__expand js-controls-TreeView__expand has-child controls-TreeView__expand__open"></div>Корень</td></tr>');
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
   });

   return MoveDialogTemplate;
});