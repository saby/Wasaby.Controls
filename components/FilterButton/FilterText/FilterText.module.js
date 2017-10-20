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
        * Класс контрола "Кнопка с крестиком".
        * Используется на Панели фильтрации (см. {@link SBIS3.CONTROLS.FilterButton}) для отображения набранных параметров.
        * Контрол представляет собой текст, рядом с котором в правом верхнем углу расположен крестик.
        * Клик по крестику скрывает контрол, а выбранный параметр удаляется из результирующего фильтра.
        * Контрол используется на панели {@link SBIS3.CONTROLS.FilterButton}.
        *
        * Контрол работает непосредственно с фильтром (объект, по набранным параметрам которого будет производиться фильтрация).
        * Текущее значение, переданное из контрола в фильтр, хранится в опции {@link filterValue}.
        * При изменении видимости контрола (скрыт или отображается), обновляется значение опции **filterValue**.
        * Если контрол становится виден, то в фильтр, ровно как и в опцию **filterValue**, передаётся значение из опции {@link visibleFilterValue}.
        * Если контрол скрывается, то в фильтр, ровно как и в опцию **filterValue**, передаётся значение опции {@link resetValue}.
        * Контрол скрывается, когда пользователь нажимает крестик, отображаемый справа от кнопки.
        *
        * @class SBIS3.CONTROLS.FilterText
        * @extends WSControls/Buttons/ButtonBase
        * @author Герасимов Александр Максимович
        * @control
        * @public
        *
        * @mixes SBIS3.CONTROLS.ITextValue
        */

       var FilterText = WSButtonBase.extend([ITextValue], /** @lends SBIS3.CONTROLS.FilterText.prototype */ {
          _dotTplFn: dotTplFn,
          $protected: {
             _options: {
                _visibleValue: null,
                /**
                 * @cfg {*} Текущее значение, переданное из контрола в фильтр.
                 * @remark
                 * Значение изменяется при скрытии/появлении контрола.
                 * @see getFilterValue
                 * @see resetValue
                 * @see visibleFilterValue
                 */
                filterValue: null,
                /**
                 * @cfg {*} Значение, передаваемое в фильтр при скрытии контрола (см. {@link setVisible}).
                 * @remark
                 * Контрол скрывается, когда пользователь нажимает крестик, отображаемый справа от кнопки.
                 * Значение дублируется в опции {@link filterValue}.
                 * @see getFilterValue
                 */
                resetValue: undefined,
                /**
                 * @cfg {*} Значение, передаваемое в фильтр при отображении контрола (см. {@link setVisible}).
                 * @remark
                 * Значение дублируется в опции {@link filterValue}.
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
           * Возвращает текущее значение фильтра, которое зависит от состояние компонента (скрыт/отображается).
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
           /**
            *
            * @returns {*}
            */
          getTextValue: function () {
             return this.isVisible() ? this.getCaption() : '';
          }
       });

       return FilterText;
    });