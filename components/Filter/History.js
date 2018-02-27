/**
 * Created by am.gerasimov on 23.01.2017.
 */
define('SBIS3.CONTROLS/Filter/History',
   [
      'SBIS3.CONTROLS/Filter/HistoryBase',
      'tmpl!SBIS3.CONTROLS/Filter/History/History',
      'css!SBIS3.CONTROLS/Filter/History/History'
   ],

   function(HistoryBase, template) {

      'use strict';

      return HistoryBase.extend({
         _dotTplFn: template
      });
   });