/**
 * Created by am.gerasimov on 10.04.2015.
 */
define('js!SBIS3.CONTROLS.PathFilterComboBox',
   [
      'js!SBIS3.CONTROLS.ComboBox',
      'html!SBIS3.CONTROLS.PathFilterComboBox/PathFilterComboBoxArrow',
      'html!SBIS3.CONTROLS.PathFilterComboBox/PathFilterComboBoxCross'
   ],

   function(ComboBox, ArrowTpl, CrossTpl) {


      'use strict';

      var PathFilterComboBox = ComboBox.extend({
         $protected: {
            _options: {
               mode: 'hover',
               afterFieldWrapper: CrossTpl,
               beforeFieldWrapper: ArrowTpl,
               pickerClassName: 'controls-PathFilter_comboBox'
            },
            _crossButton: null,
            _defaultValue: null
         },
         $constructor: function() {
            this._crossButton = this._container.find('.controls-TextBox__afterFieldWrapper');
            this._defaultValue = this._options.items[0].title;
            this.setText(this._defaultValue);
            this._initEvents();
         },
         _setPickerConfig: function () {
            return {
               corner: 'bl',
               verticalAlign: {
                  side: 'top'
               },
               horizontalAlign: {
                  side: 'left'
               },
               closeByExternalOver: true,
               targetPart: true
            };
         },
         _initEvents: function() {
            this._crossButton.click(this.setDefaultValue.bind(this));
            this._container.bind('mouseenter', this.showPicker.bind(this));
         },
         setDefaultValue: function() {
            this.setText(this._defaultValue);
            this._crossButton.hide();
         },
         _drawSelectedItem: function(newText) {
            this._crossButton[newText !== this._defaultValue ? 'show' : 'hide']();
            PathFilterComboBox.superclass._drawSelectedItem.call(this, newText);
         }
      });
      return PathFilterComboBox;
   });
