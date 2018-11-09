define('Controls/Container/MultiSelector', [
   'Core/Control',
   'wml!Controls/Container/MultiSelector/MultiSelector',
   'Controls/Utils/tmplNotify'
], function(
   Control,
   template,
   tmplNotify
) {
   'use strict';

   /**
    * Container for content that can work with multiselection.
    * Puts selection in child context.
    *
    * @class Controls/Container/MultiSelector
    * @extends Core/Control
    * @mixes Controls/interface/IPromisedSelectable
    * @control
    * @author Зайцев А.С.
    * @public
    */

   var MultiSelector = Control.extend(/** @lends Controls/Container/MultiSelector.prototype */{
      _template: template,

      _selectedTypeChangedHandler: function(event, typeName) {
         this._children.registrator.start(typeName);
      },

      _selectedKeysCountChanged: function(e, count) {
         this._selectedKeysCount = count;
         return this._notify('selectedKeysCountChanged', Array.prototype.slice.call(arguments, 1));

         // TODO: по этой задаче сделаю так, что опции selectedKeysCount вообще не будет: https://online.sbis.ru/opendoc.html?guid=d9b840ba-8c99-49a5-98d3-78715d10d540
      },

      _notifyHandler: tmplNotify
   });

   return MultiSelector;
});
