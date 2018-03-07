/**
 * Created by am.gerasimov on 21.02.2018.
 */
define('Controls/Filter/Button',
   [
      'Core/Control',
      'tmpl!Controls/Filter/Button/Button',
      'Core/moduleStubs',
      'css!Controls/Filter/Button/Button'
   ],
   
   function(Control, template, moduleStubs) {
      
      /**
       * @class Controls/Layout/Search
       * @extends Controls/Control
       * @control
       * @public
       */
      
      'use strict';
   
      var _private = {
         getFilterButtonCompatible: function(self) {
            return moduleStubs.require('Controls/Filter/Button/_FilterCompatible').addCallback(function(_FilterCompatible) {
               if (!self._oldPanelOpener) {
                  self._oldPanelOpener = new _FilterCompatible[0]({
                     filterButton: self,
                     filterButtonOptions: self._options
                  });
               }
               return self._oldPanelOpener;
            });
         }
      };
      
      var FilterButton = Control.extend({
         
         _template: template,
         _oldPanelOpener: null,
         _text: '',
         
         _getFilterState: function() {
            return this.isEnabled() ? 'default' : 'disabled';
         },
   
         _clearClick: function() {
            _private.getFilterButtonCompatible(this).addCallback(function(panelOpener) {
               panelOpener.clearFilter();
            });
         },
   
         _openFilterPanel: function() {
            if (this.isEnabled()) {
               /* if template - show old component */
               if (this._options.filterTemplate) {
                  _private.getFilterButtonCompatible(this).addCallback(function (panelOpener) {
                     panelOpener.showFilterPanel();
                  });
               } else {
                  //...soon
               }
            }
         }
         
      });
      
      FilterButton.getDefaultOptions = function() {
         return {
            filterAlign: 'right'
         };
      };
      
      return FilterButton;
   });