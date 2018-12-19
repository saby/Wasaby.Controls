define('Controls/List/ListControl', [
   'Core/Control',
   'wml!Controls/List/ListControl/ListControl',
   'Core/Deferred'
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
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IGroupedView
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/List/interface/IListControl
    * @mixes Controls/interface/IEditableList
    * @control
    * @public
    * @author Авраменко А.С.
    * @category List
    */

   var ListControl = Control.extend(/** @lends Controls/List/ListControl.prototype */{
      _template: ListControlTpl,
      reload: function() {
         return this._children.baseControl.reload();
      },
      beginEdit: function(options) {
         return this._options.readOnly ? Deferred.fail() : this._children.baseControl.beginEdit(options);
      },
      beginAdd: function(options) {
         return this._options.readOnly ? Deferred.fail() : this._children.baseControl.beginAdd(options);
      },

      cancelEdit: function() {
         return this._options.readOnly ? Deferred.fail() : this._children.baseControl.cancelEdit();
      },

      commitEdit: function() {
         return this._options.readOnly ? Deferred.fail() : this._children.baseControl.commitEdit();
      }
   });

   ListControl.getDefaultOptions = function() {
      return {
         uniqueKeys: true
      };
   };

   return ListControl;
});
