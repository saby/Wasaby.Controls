/**
 * Created by am.gerasimov on 05.04.2017.
 */
define('SBIS3.CONTROLS/Filter/Button/Area',
   [
      'SBIS3.CONTROLS/CompoundControl',
      'tmpl!SBIS3.CONTROLS/Filter/Button/Area/FilterButtonArea',
      'SBIS3.CONTROLS/Link',
      'SBIS3.CONTROLS/Button',
      'SBIS3.CONTROLS/ScrollContainer',
      'SBIS3.CONTROLS/Filter/Button/AdditionalParams',
      'SBIS3.CONTROLS/Filter/Button/History',
      'css!SBIS3.CONTROLS/Filter/Button/Area/FilterButtonArea'
   ], function(CompoundControl, dotTplFn) {
      'use strict';
      
      /**
       * @class SBIS3.CONTROLS/Filter/Button/Area
       * @extends SBIS3.CONTROLS/CompoundControl
       * @author Герасимов А.М.
       * @control
       * @public
       */
      
      return CompoundControl.extend([], /** @lends SBIS3.CONTROLS/Filter/Button/Area.prototype */ {
         _dotTplFn: dotTplFn
      });
   });