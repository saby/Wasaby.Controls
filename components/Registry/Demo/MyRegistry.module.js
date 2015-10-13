define('js!SBIS3.CONTROLS.Demo.MyRegistry', [
   'html!SBIS3.CONTROLS.Demo.MyRegistry',
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.Registry',
   'js!SBIS3.CONTROLS.TreeDataGridView'

], function(dot, CompoundControl){
   'use strict';

   /**
    * Базовый класс для реестра
    *
    * @class SBIS3.CONTROLS.RegistryBase
    * @extends $ws.proto.CompoundControl
    * @public
    */

   var RegistryBase = CompoundControl.extend( /** @lends SBIS3.CONTROLS.RegistryBase.prototype */{
      _dotTplFn : dot,
      $protected: {
         _options: {

         }
      },

      $constructor: function () {

      }

   });

   return RegistryBase;
});