/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Types.Flags', [
   'js!SBIS3.CONTROLS.Data.Types.IFlags',
   'js!SBIS3.CONTROLS.Data.Collection.IEnumerable'
], function (IFlags, IEnumerable) {
   'use strict';
   var Flags = $ws.core.extend({}, [IFlags,IEnumerable], {
      _moduleName: 'SBIS3.CONTROLS.Data.Types.Enum',
      $protected: {
         _options: {
            data: []
         },
         _selected: undefined,
         _enumerator: undefined
      },
      $constructor: function(cfg) {

      }


   });
   return Flags;
});
