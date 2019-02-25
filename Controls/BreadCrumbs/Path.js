define('Controls/BreadCrumbs/Path', [
   'Controls/crumbs',
   'Env/Env'
], function(breadCrumbsLib,
   Env) {
   'use strict';

   /**
    * Breadcrumbs with back button.
    *
    * @class Controls/BreadCrumbs/Path
    * @extends Core/Control
    * @mixes Controls/interface/IBreadCrumbs
    * @mixes Controls/BreadCrumbs/PathStyles
    * @mixes Controls/interface/IHighlighter
    * @control
    * @public
    * @author Зайцев А.С.
    *
    * @demo Controls-demo/BreadCrumbs/PathPG
    */

   /**
    * @name Controls/BreadCrumbs/Path#showActionButton
    * @cfg {Boolean} Determines whether the arrow near "back" button should be shown.
    * @default
    * true
    */

   /**
    * @event Controls/BreadCrumbs/Path#arrowActivated Happens after clicking the button "View Model".
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    */

   Env.IoC.resolve('ILogger').error('Controls/BreadCrumbs/Path', 'Контрол переехал. Используйте Controls/crumbs:HeadingPath');

   return breadCrumbsLib.HeadingPath;
});
