/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Local', [
   'js!SBIS3.CONTROLS.Data.Source.Base',
   'js!SBIS3.CONTROLS.Data.Utils'
], function (Base, Utils) {
   'use strict';

   /**
    * Источник данных, работающий локально
    * @class SBIS3.CONTROLS.Data.Source.Local
    * @extends SBIS3.CONTROLS.Data.Source.Base
    * @public
    * @author Мальцев Алексей
    */

   var Local = Base.extend(/** @lends SBIS3.CONTROLS.Data.Source.Local.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Source.Local',

      //region Public methods
      //endregion Public methods

      //region Protected methods

      _prepareCreateResult: function(data) {
         return Local.superclass._prepareCreateResult.call(
            this,
            Utils.clone(data)
         );
      },

      _prepareReadResult: function(data) {
         return Local.superclass._prepareReadResult.call(
            this,
            Utils.clone(data)
         );
      },

      _prepareCallResult: function(data, itemsProperty, totalProperty) {
         return Local.superclass._prepareCallResult.call(
            this,
            Utils.clone(data),
            itemsProperty,
            totalProperty
         );
      }

      //endregion Protected methods
   });

   return Local;
});
