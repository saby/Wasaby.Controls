import Control = require('Core/Control');
import template = require('wml!Controls/_MoveDialog/MoveDialog');
import 'css!theme?Controls/_MoveDialog/MoveDialog';

   /**
    * A standard dialog template for selecting a target item for moving items.
    * <a href="/materials/demo-ws4-operations-panel">Demo examples.</a>.
    * @class Controls/_list/Mover/MoveDialog
    * @extends Core/Control
    * @mixes Controls/_list/interface/IHierarchy
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/ISource
    *
    * @mixes Controls/_list/Mover/MoveDialog/Styles
    * @control
    * @public
    * @author Авраменко А.С.
    * @category List
    */

   /**
    * @name Controls/_list/Mover/MoveDialog#root
    * @cfg {String} Identifier of the root node.
    * @default null
    */

   /**
    * @name Controls/interface/ISearch#searchParam
    * @cfg {String} Name of the field that search should operate on. Search value will insert in filter by this parameter.
    */

let MoveDialog = Control.extend({
      _template: template,
      _itemActions: undefined,

      _beforeMount: function(options) {
         this._itemActions = [{
            id: 1,
            title: rk('Выбрать'),
            showType: 2
         }];
         this._root = options.root;

         // TODO: сейчас прикладной программист передает в MoveDialog опцию columns, что плохо, т.к. он может повлиять на
         // отображение колонки, а диалог во всех реестрах должен выглядеть одинаково. Нужно убрать возможно передавать
         // конфигурации колонки и дать возможность настривать имя поля, из которого необходимо брать название папок.
         // Выписана задача: https://online.sbis.ru/opendoc.html?guid=aeaff20a-ee07-4d1b-8a9d-2528a269bc91
         this._columns = options.columns.slice();
         this._columns[0].textOverflow = 'ellipsis';
         this._onItemClick = this._onItemClick.bind(this);
         this._itemsFilterMethod = this._itemsFilterMethod.bind(this);
         this._itemActionVisibilityCallback = this._itemActionVisibilityCallback.bind(this);
      },

      _itemsFilterMethod: function(item) {
         var result = true;

         if (item.get) {
            result = this._options.movedItems.indexOf(item.get(this._options.keyProperty)) === -1;
         }

         return result;
      },

      _itemActionVisibilityCallback: function(action, item) {
         return item.get(this._options.hasChildrenProperty);
      },

      _onItemClick: function(event, item) {
         if (!item.get(this._options.hasChildrenProperty)) {
            this._applyMove(item);
         }
      },

      _onItemActionsClick: function(event, action, item) {
         this._applyMove(item);
      },

      _applyMove: function(item) {
         this._notify('sendResult', [item, this._options.movedItems], {bubbling: true});
         this._notify('close', [], {bubbling: true});
      }
   });

MoveDialog.getDefaultOptions = (): object => {
   return {
      root: null
   };
};

export = MoveDialog;