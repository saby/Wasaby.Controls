/* global define */
define('js!SBIS3.CONTROLS.IMenuNewView', [
], function () {
   'use strict';

   /**
    * Интерфейс представления меню
    * @mixin SBIS3.CONTROLS.HierarchyControl.IHierarchyItems
    * @implements SBIS3.CONTROLS.Data.Collection.IEnumerable
    * @implements [SBIS3.CONTROLS.Data.Collection.ITreeItem]
    * @implements [SBIS3.CONTROLS.Data.Collection.ISourceLoadable]
    * @implements [SBIS3.CONTROLS.Data.Bind.IProperty]
    * @author Крайнов Дмитрий Олегович
    */
   return /** @lends SBIS3.CONTROLS.HierarchyControl.IHierarchyItems.prototype */{
      /**
       * Возвращает список всех построеных всплывающих меню
       * @returns {Object} - Объект вида {'Хеш эелемента': ссылка на }
      */
      getSubMenus: function(){
         throw new Error('Method must be implemented');
      },
      /**
       * скрывает все всплывающие меню
      */
      hideSubMenus: function(){
         throw new Error('Method must be implemented');
      }
   };

});