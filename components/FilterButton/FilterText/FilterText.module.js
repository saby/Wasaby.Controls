/**
 * Created by am.gerasimov on 05.07.2016.
 */
define('js!SBIS3.CONTROLS.FilterText',
    [
       'js!WSControls/Buttons/ButtonBase',
       'html!SBIS3.CONTROLS.FilterText',
       'js!SBIS3.CONTROLS.ITextValue'
    ], function(WSButtonBase, dotTplFn, ITextValue) {
       'use strict';

       /**
        * Компонент, отображающий текст с крестиком удаления, при клике на крест скрывается.
        * Используется на панели {@link SBIS3.CONTROLS.FilterButton}:
        * @class SBIS3.CONTROLS.FilterText
        * @extends WSControls/Buttons/ButtonBase
        * @author Герасимов Александр Максимович
        * @control
        * @public
        */

       var FilterText = WSButtonBase.extend([ITextValue], /** @lends SBIS3.CONTROLS.FilterText.prototype */ {
          _dotTplFn: dotTplFn,
          $protected: {
             _options: {
                _visibleValue: null,
                /**
                 * @cfg {*} Значение, которое проставляется, если компонент виден.
                 * @see getFilterValue
                 */
                filterValue: null,
                /**
                 * @cfg {*} Значение, которое проставляется, при нажатии на крестик.
                 * @see getFilterValue
                 */
                resetValue: undefined,
                /**
                 * @cfg {*} Значение, которое проставляется в фильтр, если компонент виден.
                 * @see getFilterValue
                 */
                visibleFilterValue: undefined
             }
          },

          $constructor:function () {
             this.getContainer().on('click', '.controls__filterButton__FilterText__reset', this.hide.bind(this));
             this._setFilterValue(this.isVisible() ? this._getVisibleValue() : null);
          },

          /**
           * Возвращает текущее значение filterValue (Зависит от состояние компонента скрыт/отображается)
           * @returns {*} filterValue
           */
          getFilterValue: function(){
             return this._options.filterValue;
          },

          _modifyOptions: function() {
             var cfg = FilterText.superclass._modifyOptions.apply(this, arguments);
             cfg._visibleValue = cfg.visibleFilterValue !== undefined ? cfg.visibleFilterValue : cfg.filterValue;
             return cfg;
          },

          _getVisibleValue: function() {
             return this._options._visibleValue;
          },

          _setVisibility: function(show) {
             FilterText.superclass._setVisibility.apply(this, arguments);
   
             var resetValue = this._options.resetValue !== undefined ? this._options.resetValue : null;
             this._notifyOnSizeChanged(this);
             this._setFilterValue(show ? this._getVisibleValue() : resetValue)
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