define('js!Controls/List/TreeControl', [
   'Core/Control'

], function (Control
) {
   'use strict';

   var _private = {};

   /**
    * Tree Control
    * @class Controls/List/TreeControl
    * @extends Controls/Control
    * @mixes Controls/interface/IItems
    * @mixes Controls/interface/IDataSource
    * @mixes Controls/interface/ISingleSelectable
    * @mixes Controls/interface/IPromisedSelectable
    * @mixes Controls/interface/IGroupedView
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/IHighlighter
    * @mixes Controls/List/interface/ITreeControl
    * @control
    * @public
    * @category List
    */

   var TreeControl = Control.extend({
      _controlName: 'Controls/List/TreeControl'

   });
   return TreeControl;
});