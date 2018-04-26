define('Controls/List/ListControl', [
   'Core/Control',
   'tmpl!Controls/List/ListControl/ListControl',
   'Controls/List/BaseControl'
], function(Control,

   ListControlTpl
) {
   'use strict';

   var _private = {
   };

   /**
    * Компонент плоского списка, с произвольным шаблоном отображения каждого элемента. Обладает возможностью загрузки/подгрузки данных из источника.
    * @class Controls/List
    * @extends Controls/List/BaseControl
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IGroupedView
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/interface/IReorderMovable
    * @mixes Controls/List/interface/IListControl
    * @mixes Controls/interface/IRemovable
    * @control
    * @public
    * @category List
    */

   var ListControl = Control.extend({
      _template: ListControlTpl
   });

   return ListControl;
});
