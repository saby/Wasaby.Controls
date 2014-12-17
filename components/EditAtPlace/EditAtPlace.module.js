/**
 * Created by iv.cheremushkin on 11.11.2014.
 */
define('js!SBIS3.CONTROLS.EditAtPlace',
     ['js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.TextBox',
      'js!SBIS3.CONTROLS.IconButton',
      'js!SBIS3.CONTROLS._PickerMixin',
      'js!SBIS3.CONTROLS._DataBindMixin',
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
            _cancelButton: null,
            _okButton: null,
            _oldText: '',
            _options: {
               text: '',
               editorTpl: '<component data-component="SBIS3.CONTROLS.TextBox"></component>',
               isMultiline: false,
               displayAsEditor: false
            }
         },

         $constructor: function () {
            var self = this;
            this._textField = $('.controls-EditAtPlace__textField', this._container.get(0));
            this._textField.bind('click', function () {
               self._clickHandler();
            });
            this._container.removeClass('ws-area');
            /*TODO: придрот, выпилить когда будет номральный CompoundControl*/
            $ws.single.EventBus.channel('EditAtPlaceChannel').subscribe('onCancel', this._cancelHandler, this);
            $ws.single.EventBus.channel('EditAtPlaceChannel').subscribe('onOpen', this._openHandler, this);
            if (this._options.displayAsEditor) {
               $('[data-component]', this._container).attr('data-bind', this._container.attr('data-bind'));
               this._loadChildControls();
            }
         },

         _cancelHandler: function (e) {
            /*if (this.isVisible()) {
             this.setText(this._oldText);
             }*/
         },

         _openHandler: function () {
            this._oldText = this._options.text;
         },

         _clickHandler: function () {
            this.showPicker();
            this._oldText = this._options.text;
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
            $('[data-component]', this._picker.getContainer().get(0)).attr('data-bind', this._container.attr('data-bind'));
            this._picker._loadChildControls();
            this._addControlPanel();
         },

         _setEditorMode: function () {
            this._options.displayAsEditor = true;
            $('.js-controls-EditAtPlace__editor', this._container.get(0)).removeClass('controls-EditAtPlace__editorHidden');
            $('.js-controls-EditAtPlace__fieldWrapper', this._container.get(0)).addClass('controls-EditAtPlace__fieldWrapperHidden');
         },

         // Добавляем кнопки
         _addControlPanel: function () {
            var self = this,
               $ok = $('<div class="controls-EditAtPlace__okButton"></div>'),
               $cancel = $('<div class="controls-EditAtPlace__cancel"></div>'),
               $cntrlPanel = $('<span class="controls-EditAtPlace__controlPanel"></span>').append($ok).append($cancel);
            // Добавляем кнопки
            this._okButton = new IconButton({
               parent: self._picker,
               element: $ok,
               icon: 'sprite:icon-24 icon-Successful icon-done action-hover'
            });
            this._picker.getContainer().append($cntrlPanel);
            // Подписываемся на клики кнопок
            this._okButton.subscribe('onActivated', function () {
               self.hidePicker();
            });
            $cancel.bind('click', function () {
               self.hidePicker();
               self.setText(self._oldText);
            });
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
            this._textField.html(text);
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