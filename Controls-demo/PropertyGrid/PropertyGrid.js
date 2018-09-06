define('Controls-demo/PropertyGrid/PropertyGrid',
   [
      'Core/Control',
      'wml!Controls-demo/PropertyGrid/PropertyGrid'
   ],
   function (
      Base, template
   ) {
      'use strict';
      var PropertyGrid = Base.extend({
         _template: template,
         _validationErrorsHandler: function (event, tmp) {
            this._notify('validationErrorsValueChanged', [tmp]);
         },
         _selectOnClickHandler: function (event, tmp) {
            this._notify('selectOnClickValueChanged', [tmp]);
         },
         _readOnlyHandler: function (event, tmp) {
            this._notify('readOnlyValueChanged', [tmp]);
         }
      });
      return PropertyGrid;
   }
);