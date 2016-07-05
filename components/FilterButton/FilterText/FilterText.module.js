/**
 * Created by am.gerasimov on 05.07.2016.
 */
define('js!SBIS3.CONTROLS.FilterText',
    [
       'js!SBIS3.CONTROLS.ButtonBase',
       'html!SBIS3.CONTROLS.FilterText',
       'js!SBIS3.CONTROLS.ITextValue'
    ], function(ButtonBase, dotTplFn, ITextValue) {
       'use strict';

       var FilterText = ButtonBase.extend([ITextValue], {
          _dotTplFn: dotTplFn,
          $protected: {
             _options: {
                filterValue: null
             },
             _visibleValue: null
          },

          $constructor:function () {
             this.getContainer().find('.controls__filterButton__FilterText__reset').click(this.hide.bind(this));
             this._visibleValue = this._options.filterValue;
             this._setFilterValue(this.isVisible() ? this._visibleValue : null);
          },

          getFilterValue: function(){
             return this._options.filterValue;
          },

          _setVisibility: function(show) {
             FilterText.superclass._setVisibility.apply(this, arguments);
             this._notifyOnSizeChanged(this);
             this._setFilterValue(show ? this._visibleValue : null)
          },

          _setFilterValue: function(value) {
             this._options.filterValue = value;
             this._notifyOnPropertyChanged('filterValue');
          },

          getTextValue: function () {
             return this.isVisible() ? this.getCaption() : '';
          }
       });

       return FilterText;
    });