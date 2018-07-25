define('Controls/EngineBrowser', [
   'Core/Control',
   'tmpl!Controls/EngineBrowser/EngineBrowser',
   'css!Controls/EngineBrowser/EngineBrowser'
], function(BaseControl, template) {
   
   
   /**
    * Base class (layout) for creating the registry.
    *
    * Here u can see the <a href="/materials/demo-ws4-engine-browser">demo</a>.
    *
    * @class Controls/EngineBrowser
    * @extends Core/Control
    * @mixes Controls/Input/interface/ISearch
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/INavigation
    * @demo
    * @author Герасимов Александр
    * @control
    * @public
    */
   
   /**
    * @name Controls/EngineBrowser#filterButtonSource
    * @cfg {Array|Function|WS.Data/Collection/IList} FilterButton items or function, that return FilterButton items
    * @remark if the historyId option is setted, function will recive filter history
    * @see Controls/Filter/Button#items
    */
   
   /**
    * @name Controls/EngineBrowser#fastFilterSource
    * @cfg {Array|Function|WS.Data/Collection/IList} FastFilter items or function, that return FastFilter items
    * @remark if the historyId option is setted, function will recive filter history
    * @see Controls/Filter/FastFilter#items
    */
   
   /**
    * @name Controls/EngineBrowser#historyId
    * @cfg {String} The identifier under which the filter history will be saved.
    */
   
   /**
    * @name Controls/EngineBrowser#search
    * @cfg {Function} Template containing the Search {@link Controls/Input/Search}
    */
   
   /**
    * @name Controls/EngineBrowser#fastFilter
    * @cfg {Function} Template containing the FastFilter {@link Controls/Filter/Fast}
    */
   
   /**
    * @name Controls/EngineBrowser#filterButton
    * @cfg {Function} Template containing the FilterButton {@link Controls/Filter/Button}
    */
   
   /**
    * @name Controls/EngineBrowser#content
    * @cfg {Function} Template containing the List control.
    */
   
   /**
    * @name Controls/EngineBrowser#topTemplate
    * @cfg {Function} Template for the space between the filters and the Search.
   */
   
   
   'use strict';

   var Browser = BaseControl.extend({
      _template: template
   });

   return Browser;
});
