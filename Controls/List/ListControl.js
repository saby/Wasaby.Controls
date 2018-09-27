define('Controls/List/ListControl', [
   'Core/Control',
   'wml!Controls/List/ListControl/ListControl',
   'Core/Deferred',
   'Controls/List/BaseControl'
], function(
   Control,
   ListControlTpl,
   Deferred
) {
   'use strict';

   /**
    * Plain list control with custom item template. Can load data from data source.
    *
    * @class Controls/List
    * @extends Controls/List/BaseControl
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IItemTemplate
    * @mixes Controls/interface/IMultiSelectable
    * @mixes Controls/interface/IGroupedView
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/List/interface/IListControl
    * @control
    * @public
    * @author Авраменко А.С.
    * @category List
    */

   var ListControl = Control.extend(/** @lends Controls/List/ListControl */{
      _template: ListControlTpl,
      reload: function() {
         this._children.baseControl.reload();
      },
      editItem: function(options) {
         return this._options.readOnly ? Deferred.fail() : this._children.baseControl.editItem(options);
      },
      addItem: function(options) {
         return this._options.readOnly ? Deferred.fail() : this._children.baseControl.addItem(options);
      },

      /**
       * Ends editing in place without saving.
       * @returns {Core/Deferred}
       */
      cancelEdit: function() {
         return this._options.readOnly ? Deferred.fail() : this._children.baseControl.cancelEdit();
      },

      /**
       * Ends editing in place with saving.
       * @returns {Core/Deferred}
       */
      commitEdit: function() {
         return this._options.readOnly ? Deferred.fail() : this._children.baseControl.commitEdit();
      },
      _onCheckBoxClick: function(e, key, status) {
         var newSelectedKeys = this._options.selectedKeys.slice();
         if (status) {
            newSelectedKeys.splice(newSelectedKeys.indexOf(key), 1);
            this._notify('selectedKeysChanged', [newSelectedKeys, [], [key]]);
         } else {
            newSelectedKeys.push(key);
            this._notify('selectedKeysChanged', [newSelectedKeys, [key], []]);
         }
      },

      _markedKeyChangedHandler: function(event, key) {
         this._notify('markedKeyChanged', [key]);
      }
   });

   ListControl.getDefaultOptions = function() {
      return {
         uniqueKeys: true,
         multiSelectVisibility: 'hidden'
      };
   };

   return ListControl;
});
