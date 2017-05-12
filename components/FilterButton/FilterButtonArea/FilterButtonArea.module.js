/**
 * Created by am.gerasimov on 05.04.2017.
 */
define('js!SBIS3.CONTROLS.FilterButtonArea',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'tmpl!SBIS3.CONTROLS.FilterButtonArea',
      'js!SBIS3.CONTROLS.Link',
      'js!SBIS3.CONTROLS.Button',
      'js!SBIS3.CONTROLS.ScrollContainer',
      'js!SBIS3.CONTROLS.AdditionalFilterParams',
      'js!SBIS3.CONTROLS.FilterHistory',
      'css!SBIS3.CONTROLS.FilterButtonArea'
   ], function(CompoundControl, dotTplFn) {
      'use strict';
      
      /**
       * @class SBIS3.CONTROLS.FilterButtonArea
       * @extends SBIS3.CONTROLS.CompoundControl
       * @author Герасимов Александр Максимович
       * @control
       * @public
       */
      
      return CompoundControl.extend([], /** @lends SBIS3.CONTROLS.FilterButtonArea.prototype */ {
         _dotTplFn: dotTplFn
      });
   });