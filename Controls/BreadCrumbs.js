define('Controls/BreadCrumbs', [
   'Controls/crumbs',
   'Env/Env'
], function(breadCrumbsLib,
   Env) {
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

   Env.IoC.resolve('ILogger').error('Controls/BreadCrumbs', 'Контрол переехал. Используйте Controls/crumbs:Path');
   return breadCrumbsLib.Path;
});
