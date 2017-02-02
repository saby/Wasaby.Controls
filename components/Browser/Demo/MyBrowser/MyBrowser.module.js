define('js!SBIS3.CONTROLS.Demo.MyBrowser',
   [
      'html!SBIS3.CONTROLS.Demo.MyBrowser',
      'js!SBIS3.CORE.CompoundControl',
      'css!SBIS3.CONTROLS.Demo.MyBrowser',
      'js!SBIS3.CONTROLS.Browser',
      'js!SBIS3.CONTROLS.TreeDataGridView',
      'js!SBIS3.CONTROLS.SearchForm',
      'js!SBIS3.CONTROLS.BreadCrumbs',
      'js!SBIS3.CONTROLS.BackButton',
      'js!SBIS3.CONTROLS.CommonHandlers',
      'js!SBIS3.CONTROLS.FilterButton',
      'js!SBIS3.CONTROLS.Link',
      'js!SBIS3.CONTROLS.Demo.FilterButtonFilterContent',
      'js!SBIS3.CONTROLS.DataGridView'
   ],
   function(dot, CompoundControl) {
      'use strict';
      var MyBrowser = CompoundControl.extend({
         _dotTplFn : dot,
         $protected: {
            _options: {
            }
         },

         $constructor: function () {
         },

         init: function() {
            MyBrowser.superclass.init.call(this);
         }
      });
      return MyBrowser;
   }
);