/**
 * Created by ps.borisov on 08.09.2016.
 */

define('js!SBIS3.CONTROLS.FilterPanelDataRange',
   [
      'js!SBIS3.CONTROLS.IFilterItem',
      'js!SBIS3.CONTROLS.SliderInput'
   ], function(IFilterItem, SliderInput) {
      'use strict';
      var
         FilterPanelDataRange = SliderInput.extend([IFilterItem], /** @lends SBIS3.CONTROLS.FilterPanelDataRange.prototype */{
            $protected: {
               _options: {
                  filter: []
               },
               _notifyFilterChange: null
            },

            _modifyOptions: function(options) {
               options = SliderInput.superclass._modifyOptions.apply(this, arguments);
               options.startValue = options.filter[0];
               options.endValue = options.filter[1];
               return options;
            },

            $constructor: function() {
               this._notifyFilterChange =  this._notifyFilterChangeFn.debounce(0);
            },

            setFilter: function(filter) {
               if (filter[0] === this.getStartValue() && filter[1] === this.getEndValue()) {
                  return;
               }
               this._options.filter = filter;
               this.setStartValue(filter[0]);
               this.setEndValue(filter[1]);
            },

            getFilter: function() {
               return this._options.filter;
            },

            setStartValue: function(value) {
               this._options.filter = [value, this._options.filter[1]];
               FilterPanelDataRange.superclass.setStartValue.apply(this, [value]);
               this._notifyFilterChange();
            },

            setEndValue: function(value) {
               this._options.filter = [this._options.filter[0], value];
               FilterPanelDataRange.superclass.setEndValue.apply(this, [value]);
               this._notifyFilterChange();
            },

            _notifyFilterChangeFn: function () {
               this._notifyOnPropertyChanged('filter');
               this._notify('onFilterChange', this._options.filter);
            }
         });
      return FilterPanelDataRange;
   });
