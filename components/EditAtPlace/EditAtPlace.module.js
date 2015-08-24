/**
 * Created by iv.cheremushkin on 11.11.2014.
 */
define('js!SBIS3.CONTROLS.EditAtPlace',
   ['js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.TextBox',
      'js!SBIS3.CONTROLS.IconButton',
      'js!SBIS3.CONTROLS.PickerMixin',
      'js!SBIS3.CONTROLS.DataBindMixin',
      'js!SBIS3.CORE.Dialog',
      'js!SBIS3.CONTROLS.ControlHierarchyManager',
      'html!SBIS3.CONTROLS.EditAtPlace'],
   function (CompoundControl, TextBox, IconButton, _PickerMixin, _DataBindMixin, Dialog, ControlHierarchyManager, dotTplFn) {
      'use strict';
      /**
       * @noShow
       * @class SBIS3.CONTROLS.EditAtPlace
       * @extends SBIS3.CONTROLS.CompoundControl
       * @control
       * @public
       * @category Inputs
       * @mixes SBIS3.CONTROLS.PickerMixin
       * @author Крайнов Дмитрий Олегович
       */

      var EditAtPlace = CompoundControl.extend([_PickerMixin, _DataBindMixin], /** @lends SBIS3.CONTROLS.EditAtPlace.prototype */{
         _dotTplFn: dotTplFn,
         _aliasForContent: 'editorTpl',
         $protected: {
            _textField: null,
            _cancelCross: null,
            _okButton: null,
            _oldText: '',
            _requireDialog: false,
            _options: {
               text: '',
               editorTpl: '<component data-component="SBIS3.CONTROLS.TextBox"></component>',
               multiline: false,
               displayAsEditor: false,
               editInPopup: false,
               enableControlPanel: true
            }
         },

         $constructor: function () {
            var self = this;
            this._textField = $('.controls-EditAtPlace__textField', this._container.get(0));
            this._textField.bind('click', function () {
               self._clickHandler();
            });
            /*FixMe: придрот, выпилить когда будет номральный CompoundControl*/
            this._container.removeClass('ws-area');
            if (this._options.displayAsEditor || !this._options.editInPopup) {
               $('[data-component]', this._container).width(this._container.width());
               if (this._container.attr('data-bind')) {
                  $('[data-component]', this._container).attr('data-bind', this._container.attr('data-bind'));
               }
            }
            this.subscribe('onTextChange', function(event, text){
               self._requireDialog = text != self._oldText;
            });

            if ($(this._options.editorTpl).attr('data-component') == 'SBIS3.CONTROLS.TextArea'){
               $(this._container.children()[0]).addClass('controls-EditAtPlace__textAreaWrapper');
            }

            this.reviveComponents();

            this.getContext().subscribe('onFieldChange', function(e, f, v, o){
               self.getParent().getLinkedContext().setValue(f, v, false, o);
            });

            $('.js-controls-EditAtPlace__editor', this._container.get(0)).bind('keydown', function (e) {
               self._keyPressHandler(e);
            });
         },

         showPicker: function(){
            EditAtPlace.superclass.showPicker.call(this);
            this._requireDialog = false;
            this._resizeTextArea();
         },

         //FixMe костыль для авторесайза TextArea
         _resizeTextArea: function(){
            if (this._options.editInPopup) {
               $('.controls-TextArea__inputField', this._picker._container).each(function () {
                  if ($(this).data('autosize')) {
                     $(this).data('autosize', false).autosize();
                  }
               });
               this._picker._container.height('');
               this._picker.recalcPosition(true);
            } else {
               $('.controls-TextArea__inputField', this._container).each(function () {
                  $(this).data('autosize', false).autosize();
               });
            }
         },

         //FixMe Придрот для менеджера окон. Выпилить когда будет свой
         _moveToTop: function(adjust){
            if (this._options.editInPopup) {
               if (this._picker.isVisible()) {
                  var pos = Array.indexOf($ws.single.WindowManager._modalIndexes, this._picker._zIndex);
                  $ws.single.WindowManager._modalIndexes.splice(pos, 1);
                  pos = Array.indexOf($ws.single.WindowManager._visibleIndexes, this._picker._zIndex);
                  $ws.single.WindowManager._visibleIndexes.splice(pos, 1);
                  if (adjust) {
                     this._picker._zIndex = $ws.single.WindowManager.acquireZIndex(true);
                     this._picker._container.css('z-index', this._picker._zIndex);
                     $ws.single.WindowManager.setVisible(this._picker._zIndex);
                     $ws.single.ModalOverlay.adjust();
                  }
               }
            }
         },

         _saveOldText: function () {
            this._oldText = this._options.text;
         },

         _setOldText: function () {
            this.setText(this._oldText);
         },

         _clickHandler: function () {
            if (this.isEnabled()) {
               this._saveOldText();
               if (this._options.editInPopup) {
                  this.showPicker();
                  this._oldText = this._options.text;
               } else {
                  this.setInPlaceEditMode(true);
                  this._addControlPanel(this._container.parent());
               }
               this._resizeTextArea();

               if (this._options.editInPopup) {
                  if ($('.js-controls-TextBox__field', this._picker._container).get(0)) {
                     $('.js-controls-TextBox__field', this._picker._container).focus();
                  } else if ($('.controls-TextArea__inputField', this._picker._container).get(0)) {
                     $('.controls-TextArea__inputField', this._picker._container).focus();
                  }
               } else {
                  if ($('.js-controls-TextBox__field', this._container).get(0)) {
                     $('.js-controls-TextBox__field', this._container).focus();
                  } else if ($('.controls-TextArea__inputField', this._container).get(0)) {
                     $('.controls-TextArea__inputField', this._container).focus();
                  }
               }
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
            var self = this;
            this._picker.getContainer().addClass('controls-EditAtPlace__editorOverlay');
            $('[data-component]', this._picker.getContainer()).attr('data-bind', this._container.attr('data-bind'));
            $('[data-component]', this._picker.getContainer()).width(this._container.width());
            this._picker.reviveComponents();
            this._addControlPanel(this._picker._container);
            this._picker._container.bind('keydown', function (e) {
               self._keyPressHandler(e);
            });
            this._picker._container.bind('mousedown', function(){
               self._moveToTop(true);
            });
         },

         setInPlaceEditMode: function (inPlace) {
            this._options.displayAsEditor = inPlace;
            this._container.toggleClass('controls-EditAtPlace__editorHidden', !inPlace).toggleClass('controls-EditAtPlace__fieldWrapperHidden', inPlace);
         },

         // Добавляем кнопки
         _addControlPanel: function (container) {
            if (this._options.enableControlPanel) {
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
            }
         },

         _cancelEdit: function () {
            if (this._options.editInPopup) {
               this._requireDialog = false;
               this._picker.hide();
            } else {
               this._removeControlPanel();
               this.setInPlaceEditMode(false);
            }
            this._setOldText();
            this._notify('onCancel');
         },

         _applyEdit: function () {
            if (this.validate()) {
               var values = {};
               if (this._options.editInPopup) {
                  this._requireDialog = false;
                  this._picker.hide();
               } else {
                  this.setInPlaceEditMode(false);
                  this._removeControlPanel();
               }
               this._saveContextTo(values);
               this._notify('onApply', values);
               this._moveToTop(true);
            }
         },

         _removeControlPanel: function(){
            if (this._options.enableControlPanel) {
               this._cancelCross.parent().remove();
            }
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

         /**
          * Открывает диалог подтверждения при отмене радактирования.
          * @returns {$ws.proto.Deferred} deferred на закрытие модального диалога подтверждения.
          * @private
          */
         _openConfirmDialog: function () {
            var result,
               deferred = new $ws.proto.Deferred();
            this._dialogConfirm = new Dialog({
               parent: this,
               opener: this,
               template: 'confirmRecordActionsDialog',
               resizable: false,
               handlers: {
                  onReady: function () {
                     var children = this.getChildControls(),
                        dialog = this,
                        onActivatedHandler = function () {
                           dialog.getLinkedContext().setValue('result', this.getName());
                           dialog.close();
                        };
                     for (var i = 0, len = children.length; i < len; i++) {
                        if (children[i].hasEvent('onActivated')) {
                           children[i].subscribe('onActivated', onActivatedHandler);
                        }
                     }
                  },
                  onKeyPressed: function (event, result) {
                     if (result.keyCode === $ws._const.key.esc) {
                        this.getLinkedContext().setValue('result', 'cancelButton');
                     }
                  },
                  onAfterClose: function () {
                     result = this.getLinkedContext().getValue('result');
                  },
                  onDestroy: function () {
                     deferred.callback(result);
                  }
               }
            });
            ControlHierarchyManager.setTopWindow(this._dialogConfirm);
            return deferred;
         },

         /**
          * Сохранение текущих значений полей ввода (контекста) в объект
          * @param obj {Object} объект, куда сохранить контекст
          * @private
          */
         _saveContextTo: function (obj) {
            var cnt = this.getLinkedContext()._context._contextObject;
            for (var i in cnt){
               if (cnt.hasOwnProperty(i)){
                  obj[i] = cnt[i].value;
               }
            }
            return obj;
         },

         _initializePicker: function(){
            var self = this;
            EditAtPlace.superclass._initializePicker.call(this);
            this._picker.subscribe('onClose', function(event){
               event.setResult(!self._requireDialog);
               if (self._requireDialog) {
                  self._moveToTop(true);
                  self._openConfirmDialog().addCallback(function (result) {
                     switch (result) {
                        case 'yesButton':
                           self._applyEdit();
                           break;
                        case 'noButton':
                           self._cancelEdit();
                           break;
                        default:
                           self._moveToTop(true);
                     }
                  });
               }
            });
         },



         _keyPressHandler: function (e) {
            switch (e.which) {
               /*case 13: {
                  this._applyEdit();
               }
                  break;*/
               case 27: {
                  this._cancelEdit();
                  e.stopPropagation();
               }
                  break;
               default:
                  break;
            }
         },

         setText: function (text) {
            var oldText = this._options.text;
            this._options.text = text || '';
            if (oldText !== this._options.text) {
               this.saveToContext('Text', text);
               this._notify('onTextChange', this._options.text);
            }
            if (text) {
               this._textField.html(text);
               this._textField.css('display', 'inline');
            } else {
               this._textField.html('&nbsp;');
               this._textField.css({
                  display: 'inline-block',
                  width: '100%'
               });
            }
         },

         getText: function () {
            return this._options.text;
         }

      });

      return EditAtPlace;
   });