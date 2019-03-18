define('Controls/BreadCrumbs', [
   'Controls/crumbs'
], function(breadCrumbsLib) {
   'use strict';

   /**
    * Breadcrumbs.
    *
    * @class Controls/crumbs:Path
    * @extends Core/Control
    * @mixes Controls/interface/IBreadCrumbs
    * @mixes Controls/BreadCrumbs/BreadCrumbsStyles
    * @control
    * @public
    * @author Зайцев А.С.
    * @demo Controls-demo/BreadCrumbs/BreadCrumbsPG
    */
   return breadCrumbsLib.Path;
});
