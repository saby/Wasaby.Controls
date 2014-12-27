/**
 * Created by iv.cheremushkin on 11.11.2014.
 */
define('js!SBIS3.CONTROLS.EditAtPlace',
   ['js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.TextBox',
      'js!SBIS3.CONTROLS.IconButton',
      'js!SBIS3.CONTROLS.PickerMixin',
      'js!SBIS3.CONTROLS.DataBindMixin',
      'html!SBIS3.CONTROLS.EditAtPlace'],
   function (CompoundControl, TextBox, IconButton, _PickerMixin, _DataBindMixin, dotTplFn) {
      'use strict';
      /**
       * @class SBIS3.CONTROLS.EditAtPlace
       * @extends SBIS3.CONTROLS.CompoundControl
       * @control
       * @public
       * @category Inputs
       * @mixes SBIS3.CONTROLS._PickerMixin
       */

      var EditAtPlace = CompoundControl.extend([_PickerMixin, _DataBindMixin], /** @lends SBIS3.CONTROLS.EditAtPlace.prototype */{
         _dotTplFn: dotTplFn,
         _aliasForContent: 'editorTpl',
         $protected: {
            _textField: null,
            _cancelCross: null,
            _okButton: null,
            _oldText: '',
            _options: {
               text: '',
               editorTpl: '<component data-component="SBIS3.CONTROLS.TextBox"></component>',
               isMultiline: false,
               displayAsEditor: false,
               editInPopup: false
            }
         },

         $constructor: function () {
            var self = this;
            this._textField = $('.controls-EditAtPlace__textField', this._container.get(0));
            this._textField.bind('click', function () {
               self._clickHandler();
            });
            /*TODO: придрот, выпилить когда будет номральный CompoundControl*/
            this._container.removeClass('ws-area');
            if (this._options.displayAsEditor || !this._options.editInPopup) {
               $('[data-component]', this._container).attr('data-bind', this._container.attr('data-bind')).width(this._container.width());
            }
            this._loadChildControls();
         },

         _saveOldText: function () {
            this._oldText = this._options.text;
         },

         _setOldText: function () {
            this.setText(this._oldText);
         },

         _clickHandler: function () {
            this._saveOldText();
            if (this._options.editInPopup) {
               this.showPicker();
               this._oldText = this._options.text;
            } else {
               this.setInPlaceEditMode(true);
               this._addControlPanel(this._container.parent());
            }
         },

         _setClickHandler: function (newHandler) {
            if (typeof newHandler == 'function') {
               this._textField.unbind('click');
               this._textField.bind('click', newHandler);
               this._clickHandler = newHandler;
            }
         },

         _setPickerContent: function () {
            this._picker.getContainer().addClass('controls-EditAtPlace__editorOverlay');
            $('[data-component]', this._picker.getContainer()).attr('data-bind', this._container.attr('data-bind'));
            $('[data-component]', this._picker.getContainer()).width(this._container.width());
            this._picker._loadChildControls();
            this._addControlPanel(this._picker._container);
         },

         setInPlaceEditMode: function (inPlace) {
            this._options.displayAsEditor = inPlace;
            this._container.toggleClass('controls-EditAtPlace__editorHidden', !inPlace).toggleClass('controls-EditAtPlace__fieldWrapperHidden', inPlace);
         },

         // Добавляем кнопки
         _addControlPanel: function (container) {
            this._cancelCross = $('<span class="controls-EditAtPlace__cancel"></span>');
            var self = this,
               $ok = $('<span class="controls-EditAtPlace__okButton"></span>'),
               $cntrlPanel = $('<span class="controls-EditAtPlace__controlPanel"></span>').append($ok).append(this._cancelCross);

            // Добавляем кнопки
            this._okButton = new IconButton({
               parent: (self._options.editInPopup) ? self._picker : self,
               element: $ok,
               icon: 'sprite:icon-24 icon-Successful icon-done action-hover'
            });
            container.append($cntrlPanel);
            this._okButton.subscribe('onActivated', function () {
               self._applyEdit();
            });
            this._cancelCross.bind('click', function () {
               self._cancelEdit();
            });
         },

         _cancelEdit: function () {
            if (this._options.editInPopup) {
               this.hidePicker();
            } else {
               this._removeControlPanel();
               this.setInPlaceEditMode(false);
            }
            this._setOldText();
            this._notify('onCancel');
         },

         _applyEdit: function () {
            if (this._options.editInPopup) {
               this.hidePicker();
            } else {
               this.setInPlaceEditMode(false);
               this._removeControlPanel();
            }
            this._notify('onApply');
         },

         _removeControlPanel: function(){
            this._cancelCross.parent().remove();
         },

         _setPickerConfig: function () {
            return {
               corner: 'tl',
               verticalAlign: {
                  side: 'top'
               },
               horizontalAlign: {
                  side: 'left'
               },
               template: this._options.editorTpl,
               closeByExternalClick: true,
               isModal: true
            };
         },

         setText: function (text) {
            var oldText = this._options.text;
            this._options.text = text || '';
            if (oldText !== this._options.text) {
               this.saveToContext('Text', text);
               this._notify('onTextChange', this._options.text);
            }
            if (text !== '') {
               this._textField.html(text);
            } else {
               this._textField.html('&nbsp');
            }
         },

         getText: function () {
            return this._options.text;
         },

         //*TODO переопределяем метод compoundControl - костыль*//*
         _loadControls: function (pdResult) {
            return pdResult.done([]);
         },

         /*TODO свой механизм загрузки дочерних контролов - костыль*/
         _loadChildControls: function () {
            var def = new $ws.proto.Deferred();
            var self = this;
            self._loadControlsBySelector(new $ws.proto.ParallelDeferred(), undefined, '[data-component]')
               .getResult().addCallback(function () {
                  def.callback();
               });
            return def;
         }

      });

      return EditAtPlace;
   });