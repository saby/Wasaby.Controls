define('Controls/BreadCrumbs', [
   'Core/Control'

], function(Control
) {
   'use strict';

   var _private = {};

   /**
    * Компонент - хлебные крошки
    * @class Controls/BreadCrumbs
    * @extends Core/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IHighlighter
    * @control
    * @public
    * @category List
    */

   var BreadCrumbs = Control.extend({
      _controlName: 'Controls/BreadCrumbs'

   });
   return BreadCrumbs;
});
