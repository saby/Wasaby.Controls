define('js!SBIS3.CONTROLS.Demo.MyBrowser', [
   'html!SBIS3.CONTROLS.Demo.MyBrowser',
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.Browser',
   'js!SBIS3.CONTROLS.TreeDataGridView',
   'js!SBIS3.CONTROLS.SearchForm',
   'js!SBIS3.CONTROLS.BreadCrumbs',
   'js!SBIS3.CONTROLS.BackButton'
], function(dot, CompoundControl){
   'use strict';

   /**
    * Базовый класс для реестра
    *
    * @class SBIS3.CONTROLS.Demo.MyBrowser
    * @extends $ws.proto.CompoundControl
    * @control
    */

   var MyBrowser = CompoundControl.extend( /** @lends SBIS3.CONTROLS.MyBrowser.prototype */{
      _dotTplFn : dot,
      $protected: {
         _options: {

         }
      },

      $constructor: function () {

      }

   });

   return MyBrowser;
});