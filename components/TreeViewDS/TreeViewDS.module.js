define('js!SBIS3.CONTROLS.TreeViewDS', [
   'js!SBIS3.CONTROLS.ListViewDS',
   'js!SBIS3.CONTROLS.hierarchyMixin',
   'js!SBIS3.CONTROLS.TreeMixinDS'
], function (ListViewDS, hierarchyMixin, TreeMixinDS) {
   'use strict';
   /**
    * Контрол, отображающий данные имеющие иерархическую структуру. Позволяет отобразить данные в произвольном виде с возможностью открыть или закрыть отдельные узлы
    * @class SBIS3.CONTROLS.TreeViewDS
    * @extends SBIS3.CONTROLS.ListView
    * @mixes SBIS3.CONTROLS.TreeMixin
    */

   return ListViewDS.extend([hierarchyMixin, TreeMixinDS], /** @lends SBIS3.CONTROLS.TreeViewDS.prototype*/ {
      $protected: {
         _options: {
            //FixME: так как приходит набор от листвью. пока он не нужен
            itemsActions: []
         }
      }
   });

});
