define('Controls/Search/Controller',
   ['Controls/search'],
   function(Control) {
      'use strict';
      /**
       * The search controller allows you to search data in a {@link Controls/list:View}
       * using any component with {@link Controls/Input/interface/IInputField} interface.
       * Search controller allows you:
       * 1) set delay before searching
       * 2) set number of characters
       * 3) set search parameter
       * 4) change the keyboard layout for an unsuccessful search
       * Note: Component with {@link Controls/Input/interface/IInputField} interface must be located in {@link Controls/Search/Input/Container}.
       *
       * More information you can read <a href='/doc/platform/developmentapl/interface-development/controls/filter-search/'>here</a>.
       *
       * <a href="/materials/demo/demo-ws4-explorer-with-search">Here</a>. you a demo with search in Controls/Explorer.
       *
       * @class Controls/Search/Controller
       * @extends Core/Control
       * @mixes Controls/Input/interface/ISearch
       * @mixes Controls/interface/ISource
       * @mixes Controls/interface/IFilter
       * @mixes Controls/interface/INavigation
       * @author Герасимов А.М.
       * @control
       * @public
       */
      return Control.Controller;
   });
