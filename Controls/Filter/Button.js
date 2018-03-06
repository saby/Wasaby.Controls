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
         
         notifyOnFilterChange: function(self, filter) {
            self._notify('filterChanged', filter, {bubbling: true});
         },
         
         oldPanelChangeHandler: function(self, stringTransformer) {
            var panelOpener = self._oldPanelOpener;
            self._text = stringTransformer.string(panelOpener.getFilterStructure(), 'itemTemplate');
            _private.notifyOnFilterChange(self, panelOpener.getFilter());
            self._forceUpdate();
         },
         
         getOldPanelConfig: function(self) {
           return {
              element: self._container.querySelector('.controls-FilterButton__oldTemplate'),
              template: self._options.template,
              filterStructure: self._options.items,
              filterAlign: self._options.filterAlign === 'left' ? 'right' : 'left'
           };
         },
         
         getOldPanelOpener: function(self) {
            return moduleStubs.require(['Controls/Filter/Button/OldPanelOpener', 'SBIS3.CONTROLS/Filter/Button/Utils/FilterToStringUtil', 'Controls/Filter/Button/converterFilterStructure']).addCallback(function(result) {
               if (!self._oldPanelOpener) {
                  self._oldPanelOpener = new result[0](_private.getOldPanelConfig(self));
                  self._oldPanelOpener.subscribe('onApplyFilter', function() {
                     _private.oldPanelChangeHandler(self, result[1]);
                  });
                  self._oldPanelOpener.subscribe('onResetFilter', function(event, internal) {
                     if (!internal) {
                        _private.oldPanelChangeHandler(self, result[1]);
                     }
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
            _private.getOldPanelOpener(this).addCallback(function(panelOpener) {
               panelOpener.sendCommand('reset-filter');
            });
         },
   
         _openFilterPanel: function() {
            if (this.isEnabled()) {
               /* if template - show old component */
               if (this._options.template) {
                  _private.getOldPanelOpener(this).addCallback(function (panelOpener) {
                     panelOpener.showPicker();
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