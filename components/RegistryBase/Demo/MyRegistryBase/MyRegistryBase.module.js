define('js!SBIS3.CONTROLS.Demo.MyRegistryBase', [
   'html!SBIS3.CONTROLS.Demo.MyRegistryBase',
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.RegistryBase',
   'js!SBIS3.CONTROLS.TreeDataGridView',
   'js!SBIS3.CONTROLS.SearchForm',
   'js!SBIS3.CONTROLS.BreadCrumbs',
   'js!SBIS3.CONTROLS.BackButton'
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