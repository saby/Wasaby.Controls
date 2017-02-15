/**
 * Created by as.krasilnikov on 23.12.2016.
 */
define('js!SBIS3.CONTROLS.FilterDropdown', ['js!SBIS3.CONTROLS.DropdownList'], function (DropdownList) {

   'use strict';
   /**
    * Выпадающий список, позволяющий выбрать одно из предложенных значений.
    * Используется на панели {@link SBIS3.CONTROLS.FilterButton}:
    * @class SBIS3.CONTROLS.FilterDropdown
    * @extends SBIS3.CORE.DropdownList
    * @control
    * @public
    */

   var FilterDropdown = DropdownList.extend([],/** @lends SBIS3.CONTROLS.FilterDropdown.prototype */ {
      $protected: {
         _options: {
            /**
             * @cfg {boolean} Инвертированное значение опции visible.
             * Если значение false - компонент отображается, если значение true - компонент скрыт.
             * @see setInvertedVisible
             * @see getInvertedVisible
             */
            invertedVisible: false,
            /**
             * @cfg {*} Ключ, который установится в компонент после сброса выбранного значения
             * @see getFilterValue
             */
            resetKey: null
         }
      },

      _modifyOptions: function (cfg, parsedCfg) {
         var opts = FilterDropdown.superclass._modifyOptions.apply(this, arguments);
         /* Если invertedVisible выставлена, то компонент должен быть скрыт */
         if (opts.invertedVisible) {
            opts.visible = false;
         }
         opts.className += ' controls-DropdownList__type-filter';
         return opts;
      },

      _resetButtonClickHandler: function () {
         this._hideAllowed = true;
         this._options.selectedKeys = [this._options.resetKey];
         this._notifyOnPropertyChanged('selectedKeys');
         this.hide();
         this._notifyOnPropertyChanged('visible'); // Убрать, как полечится https://inside.tensor.ru/opendoc.html?guid=552af000-7778-4e34-a177-7b704cdf5643&des=
      },

      setInvertedVisible: function (invertedVisible) {
         this._options.invertedVisible = invertedVisible;
         this.toggle(!invertedVisible);
         this._notifyOnSizeChanged(this);
         this._notifyOnPropertyChanged('invertedVisible');
      },

      getInvertedVisible: function () {
         return this._options.invertedVisible
      }
   });

   return FilterDropdown;
});