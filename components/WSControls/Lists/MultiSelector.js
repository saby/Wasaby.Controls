define('js!WSControls/Lists/MultiSelector', [
   'js!WSControls/Lists/Selector',
   'js!WSControls/Lists/resources/utils/ItemsUtil',
   'js!WSControls/Utils/Array'
], function(Selector, ItemsUtil, ArrayUtil) {
   
   var prepareKeys = function(keys, options) {
      if (keys) {
         if (keys.length > 1 && !options.multiSelect) {
            keys = [keys[0]];
         }
      } else {
         //null if the selection is empty
         keys = null;
      }
      return keys;
   };
   /**
    * Provides an abstract class for controls that allow multiple items to be selected.
    *
    * @class WSControls/Lists/MultiSelector
    * @extends WSControls/Lists/Selector
    * @author Герасимов Александр Максимович
    */
   
   var MultiSelector = Selector.extend({
      
      _controlName: 'WSControls/Lists/MultiSelector',
      
      constructor: function (cfg) {
         MultiSelector.superclass.constructor.apply(this, arguments);
         
         this._selectedKeys = prepareKeys(cfg.selectedKeys, cfg);
         this._applyAllowEmptyMultiSelection(cfg);
         this._publish('onSelectedItemsChange');
      },
   
      //<editor-fold desc='lifeCycle'>
      
      _beforeUpdate: function(newOptions) {
         MultiSelector.superclass._beforeUpdate.apply(this, arguments);
         
         if (this._options.selectedKeys !== newOptions.selectedKeys || this._options.multiSelect !== newOptions.multiSelect) {
            this._selectedKeys = prepareKeys(newOptions.selectedKeys, newOptions);
         }
         this._applyAllowEmptyMultiSelection(newOptions);
      },
   
      //</editor-fold>
   
      //<editor-fold desc='private'>
   
      _displayChangeCallback: function(options) {
         MultiSelector.superclass._displayChangeCallback.apply(this, arguments);
         
         if(this._isEmptyMultiSelection()) {
            this._applyAllowEmptyMultiSelection(options);
         }
      },
      
      _applyAllowEmptyMultiSelection: function(options) {
         options = options || this._options;
         if (options.allowEmptyMultiSelection === false && this._isEmptyMultiSelection()) {
            if (this._display.getCount()) {
               this._selectedKeys = [ItemsUtil.getPropertyValue(this._display.at(0).getContents(), this._getOption('idProperty'))];
            }
         }
      },
   
      _isItemMultiSelected: function(displayItem) {
         var key = ItemsUtil.getPropertyValue(displayItem.getContents(), this._getOption('idProperty'));
         return !this._isEmptyMultiSelection() && this._selectedKeys.indexOf(key) !== -1;
      },
      
      _setSelectedKeys: function(keys) {
         var oldKeys = this._selectedKeys;
         
         this._selectedKeys = prepareKeys(keys, this._options);
         this._applyAllowEmptyMultiSelection();
         this._notify('onSelectedItemsChange', this._selectedKeys, oldKeys);
      },
   
      _onItemClick: function(e, displayItem) {
         // FIXME делать при клике на чекбокс, как будем шаблоны делать
         this._setSelectedKeys(ArrayUtil.toggle(this._selectedKeys || [], [ItemsUtil.getPropertyValue(displayItem.getContents(), this._getOption('idProperty'))]));
         MultiSelector.superclass._onItemClick.apply(this, arguments);
      },
      
      _isEmptyMultiSelection: function() {
         // null || [] || [null] means the selection is empty
         return !this._selectedKeys || !this._selectedKeys.length || this._selectedKeys.length === 1 && this._selectedKeys[0] === null;
      }
      
      //</editor-fold>
      
      
   });
   
   return MultiSelector;
});