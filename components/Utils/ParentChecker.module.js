/**
 * Created by am.gerasimov on 28.03.2017.
 */
define('js!SBIS3.CONTROLS.ParentCheckerUtil', [], function() {

   'use strict';

   function getParent(ctrl) {
      return ctrl ?
         ctrl.getParent() || (ctrl.getOpener instanceof Function ? ctrl.getOpener() : null) :
         null;
   }

   function isSameCtrl(ctrl, target) {
      return ctrl === target;
   }
   /**
    * Определяет по переданным компонентам, являются ли они "родственниками" т.е. является ли комопнент родителем для другого компонента.
    * @param {ctrl} Компонент родитель
    * @param {target} Дочерний компонент
    */
   return function parentChecker(ctrl, target) /** @lends SBIS3.CONTROLS.ParentCheckerUtil.prototype */ {
      var parent = getParent(target);
      return parent ? isSameCtrl(ctrl, parent) || parentChecker(ctrl, parent) : false;
   };
});