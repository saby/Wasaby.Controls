define('js!SBIS3.CONTROLS.TreeView', ['js!SBIS3.CONTROLS.ListView', 'js!SBIS3.CONTROLS._TreeMixin'], function(ListView, _TreeMixin) {
   'use strict';
   /**
    * Контрол, отображающий данные имеющие иерархическую структуру. Позволяет отобразить данные в произвольном виде с возможностью открыть или закрыть отдельные узлы
    * @class SBIS3.CONTROLS.TreeView
    * @extends SBIS3.CONTROLS.ListView
    * @mixes SBIS3.CONTROLS._TreeMixin
    */

   var TreeView = ListView.extend([_TreeMixin], /** @lends SBIS3.CONTROLS.TreeView.prototype*/ {
      $protected: {
      },

      $constructor: function() {
      }
   });

   return TreeView;

});