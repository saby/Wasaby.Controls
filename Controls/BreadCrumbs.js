define('Controls/BreadCrumbs', [
   'Controls/breadCrumbs',
   'Core/IoC'
], function(breadCrumbsLib,
   IoC) {
   'use strict';

   /**
    * Breadcrumbs.
    *
    * @class Controls/BreadCrumbs
    * @extends Core/Control
    * @mixes Controls/interface/IBreadCrumbs
    * @mixes Controls/BreadCrumbs/BreadCrumbsStyles
    * @control
    * @public
    * @author Зайцев А.С.
    * @demo Controls-demo/BreadCrumbs/BreadCrumbsPG
    */

   IoC.resolve('ILogger').error('Controls/BreadCrumbs', 'Контрол переехал. Используйте Controls/breadCrumbs:Path');
   return breadCrumbsLib.Path;
});
