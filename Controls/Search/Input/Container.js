define('Controls/Search/Input/Container',
   ['Controls/search'],
   function(Control) {
      'use strict';
      /**
       * Special container for component with {@link Controls/Input/interface/IInputField}.
       * Listens for child's "valueChanged" event and notify bubbling event "search".
       * NOTE: must be located inside {@link Controls/Search/Controller}.
       *
       * More information you can read <a href='/doc/platform/developmentapl/interface-development/controls/filter-search/'>here</a>.
       *
       * <a href="/materials/demo/demo-ws4-explorer-with-search">Here</a>. you a demo with search in Controls/Explorer.
       *
       * @class Controls/Search/Input/Container
       * @extends Core/Control
       * @author Герасимов А.М.
       * @control
       * @public
       */

      return Control.InputContainer;
   });
