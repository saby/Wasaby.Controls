/**
 * Created by iv.cheremushkin on 11.11.2014.
 */
define('js!SBIS3.CONTROLS.EditAtPlace', [
   'js!SBIS3.CONTROLS.TextBoxBase',
   'js!SBIS3.CONTROLS.TextBox',
   'js!SBIS3.CONTROLS.IconButton',
   'js!SBIS3.CONTROLS.TextArea',
   'js!SBIS3.CONTROLS._PickerMixin',
   'html!SBIS3.CONTROLS.EditAtPlace',
], function(TextBoxBase, TextBox, IconButton, TextArea, _PickerMixin, dotTplFn) {
   'use strict';
   /**
    * @class SBIS3.CONTROLS.EditAtPlace
    * @extends SBIS3.CONTROLS.TextBoxBase
    * @control
    * @public
    * @category Inputs
    * @mixes SBIS3.CONTROLS._PickerMixin
    */

   var EditAtPlace = TextBoxBase.extend([_PickerMixin], /** @lends SBIS3.CONTROLS.EditAtPlace.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _textField: null,
         _editor: null,
         _cancelButton: null,
         _okButton: null,
         _oldText: '',
         _options: {
            editorTpl: '<component data-component="SBIS3.CONTROLS.TextBox"> </component>',
            isMultiline: false,
            displayAsEditor: false
         }
      },

      $constructor: function () {
         var self = this;
         this._textField = $('.controls-EditAtPlace__textField', this._container.get(0));
         this._textField.bind('click', function(){
            self._clickHandler();
         });
         if (this._options.isMultiline){
            this._textField.addClass('controls-EditAtPlace__multiline');
         }
         $ws.single.EventBus.channel('EditAtPlaceChannel').subscribe('onCancel', this._cancelHandler, this);
         $ws.single.EventBus.channel('EditAtPlaceChannel').subscribe('onOpen', this._openHandler, this);
      },

      _cancelHandler: function(){
         this.setText(this._oldText);
      },

      _openHandler: function(){
         this._oldText = this._options.text;
      },

      _clickHandler: function(){
         this.showPicker();
         this._oldText = this._options.text;
      },

      _setClickHandler: function(newHandler){
         if (typeof newHandler == 'function') {
            this._textField.unbind('click');
            this._textField.bind('click', newHandler);
            this._clickHandler = newHandler;
         }
      },

      _setPickerContent: function () {
         this._picker.getContainer().addClass('controls-EditAtPlace__editorOverlay');
         this._picker._container.append($(this._options.editorTpl).attr('data-bind', this._container.attr('data-bind')));
         this._picker._loadChildControls();
         this._editor = this._picker._getChildControls()[0];
         this._editor._container.width(this._container.width() + 20);
         this._addControlPanel();
      },

      _addControlPanel: function(){
         var self = this,
            $ok = $('<div class="controls-Button controls-EditAtPlace__okButton"></div>'),
            $cancel = $('<div class="controls-EditAtPlace__cancel"></div>'),
            $btnsContainer = $('<div class="controls-EditAtPlace__controlPanel"></div>').append($ok).append($cancel);

         // Добавляем кнопки
         this._okButton = new IconButton({
            parent: self._picker,
            element : $ok,
            icon: 'sprite:icon-16 icon-Successful icon-done'
         });

         this._picker.getContainer().append($btnsContainer);

         // Подписываемся на клики кнопок
         this._okButton.subscribe('onActivated', function(){
            self.hidePicker();
         });

         $cancel.bind('click',function(){
            self.setText(self._oldText);
            self.hidePicker();
         });
      },

      _setPickerConfig: function(){
         return {
            corner: 'tl',
            verticalAlign: {
               side: 'top'
            },
            horizontalAlign: {
               side: 'left'
            },
            closeByExternalClick: true,
            isModal: true
         };
      },

      setText: function(text){
         this._textField.html(text);
         EditAtPlace.superclass.setText.call(this, text);
      }

   });

   return EditAtPlace;
});