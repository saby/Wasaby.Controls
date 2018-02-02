/**
 * Created by am.gerasimov on 30.01.2018.
 */
/**
 * Created by am.gerasimov on 26.01.2018.
 */
define('Controls/Search/SearchUtil', ['Core/moduleStubs'],
   function(moduleStubs) {
      
      'use strict';
      
      return {
         getSearch: function(self, cfg) {
            if(!self._searchDef) {
               self._searchDef = moduleStubs.require('Controls/Search/Search').addCallback(function (res) {
                  if (!self._search) {
                     self._search = new res[0](cfg);
                  }
                  return self._search;
               });
            }
            
            return self._searchDef;
         }
      };
   });
