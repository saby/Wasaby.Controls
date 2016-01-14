/* global define, console, doT, $ws, $ */
define('js!SBIS3.CONTROLS.CompositeViewControl.CompositeView', [
   'js!SBIS3.CONTROLS.ListControl.View',
   'js!SBIS3.CONTROLS.DataGridControl.DataGridViewMixin'
], function (ListView, DataGridViewMixin) {
   'use strict';

   var CompositeView = ListView.extend([DataGridViewMixin], /** @lends SBIS3.CONTROLS.CompositeViewControl.CompositeView.prototype */{
      _moduleName: 'SBIS3.CONTROLS.CompositeViewControl.CompositeView',
      
      _getItemRenderData: function(item) {
         var data = CompositeView.superclass._getItemRenderData.call(this, item);
         data.containerClass += ' controls-CompositeView__item';
         return data;
      }
   });

   return CompositeView;
});