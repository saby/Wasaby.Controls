define('SBIS3.CONTROLS/Mixins/EditAtPlaceMixin',
   [
      'Core/Deferred',
      'SBIS3.CONTROLS/Button/IconButton',
      'Lib/Control/ModalOverlay/ModalOverlay',
      'Lib/Control/Dialog/Dialog'
   ], function(Deferred, IconButton, ModalOverlay) {
      /**
       * @mixin SBIS3.CONTROLS/Mixins/EditAtPlaceMixin
       * @public
       * @author Крайнов Д.О.
       */
      'use strict';

      var EditAtPlaceMixin = /**@lends SBIS3.CONTROLS/Mixins/EditAtPlaceMixin.prototype  */ {
         $protected: {
            _inEditMode: null,
            _cntrlPanel: null,
            _options: {

               /**
                * @cfg {Boolean} отображать как редактор
                * @see setInPlaceEditMode
                */
               displayAsEditor: false,

               /**
                * @cfg {Boolean} редактировать во всплывающей панели или в собственном контейнере
                */
               editInPopup: false,

               /**
                * @cfg {Boolean} отображать кнопки отмены и применения редактирования или нет
                */
               enableControlPanel: false
            }
         },

         $constructor: function() {
         },

         _applyEdit: function() {
            if (this.validate(undefined, undefined, true)) {
               var values = {};
               this._inEditMode = false;
               if (this._options.editInPopup) {
                  this._requireDialog = false;
                  this._picker.hide();
               } else {
                  this.setInPlaceEditMode(false);
                  this._removeControlPanel();
               }
               this._deactivateActiveChildControl();
               this._notify('onApply', values);
            }
         },

         //Метод необходим, так как при завершении редактирования(esc или enter), дочерние контролы скрываются, при этом
         //нативный фокус уходит на body и в событие focusout у контрола приходит event.relatedTarget = null, из-за этого
         //контрол не понимает куда уходит фокус и не может сделать setActive(false), т.к. при деактивации нужно обязательно
         //указывать контрол на который ушёл фокус. У некоторых контролов(например DatePicker) есть логика на уход фокуса
         //и эта логика не выполняется. Поэтому мы сами позовём setActive(false) у активного дочернего контрола.
         _deactivateActiveChildControl: function() {
            var activeControl = this.getActiveChildControl();

            //метод getActiveControl определен у compoundControl, поэтому у контролов унаследованных от Control его нет
            while (activeControl && activeControl.getActiveChildControl && activeControl.getActiveChildControl()) {
               activeControl = activeControl.getActiveChildControl();
            }
            activeControl && activeControl.setActive(false);
         },

         /**
          * Открывает диалог подтверждения при отмене радактирования.
          * @returns {Deferred} deferred на закрытие модального диалога подтверждения.
          * @private
          */
         _openConfirmDialog: function() {
            var
               self = this,
               deferred = new Deferred();

            require(['SBIS3.CONTROLS/Utils/InformationPopupManager'], function(InformationPopupManager) {
               InformationPopupManager.showConfirmDialog({
                  message: rk('Сохранить изменения?'),
                  details: rk('Чтобы продолжить редактирование, нажмите "Отмена".'),
                  hasCancelButton: true,
                  parent: self._options.editInPopup ? self._picker : self,
                  opener: self._options.editInPopup ? self._picker : self
               }, function() {
                  deferred.callback('yesButton');
               }, function() {
                  deferred.callback('noButton');
               }, function() {
                  deferred.callback('cancelButton');
               });
            });

            return deferred;
         },

         _keyPressHandler: function(e) {
            if (!this._picker || this._picker.isVisible()) {
               switch (e.which) {
                  case 13:
                     this._applyEdit();
                     break;
                  case 27:
                     this._cancelEdit();
                     break;
                  default:
                     break;
               }
            }
         },

         after: {
            _initializePicker: function() {
               var self = this;
               this.subscribeTo(ModalOverlay, 'onClick', function(event) {
                  if (this.isVisible() && this._picker._zIndex - ModalOverlay.getZIndex() === 1) {
                     if (self._requireDialog) {
                        self._openConfirmDialog().addCallback(function(result) {
                           switch (result) {
                              case 'yesButton':
                                 self._applyEdit();
                                 break;
                              case 'noButton':
                                 self._cancelEdit();
                                 break;
                           }
                        });
                     }
                  }
               }.bind(this));

               this._picker.subscribe('onClose', function(event) {
                  event.setResult(!self._requireDialog);
               });
            },

            showPicker: function() {
               this._requireDialog = false;
            }
         },

         instead: {
            _setPickerConfig: function() {
               return {
                  corner: 'tl',
                  className: 'controls-EditAtPlaceGroup__editorOverlay',
                  verticalAlign: {
                     side: 'top'
                  },
                  horizontalAlign: {
                     side: 'left'
                  },
                  template: this._getEditTemplate(),
                  closeByExternalClick: true,
                  isModal: true
               };
            }
         },

         // Добавляем кнопки
         _addControlPanel: function(container) {
            if (this._options.enableControlPanel) {
               var self = this,
                  $ok = $('<span class="controls-EditAtPlace__okButton"></span>'),
                  $cancelCross = $('<span class="controls-EditAtPlace__cancel"><i class="controls-Button__icon icon-size icon-Close icon-primary"></i></span>');
               this._cntrlPanel = $('<span class="controls-EditAtPlace__controlPanel"></span>').append($ok).append($cancelCross);

               // Добавляем кнопки
               this._okButton = new IconButton({
                  parent: self._picker || self,
                  element: $ok,
                  style: 'bordered',
                  size: 's',
                  primary: true, //Нужно, чтобы кнопка была дефолтной в своей области. иначе ctrl+enter вызовет обработчик дефолтной кнопки, расположенной выше.
                  icon: 'sprite:icon-16 icon-Yes icon-done'
               });
               container.append(this._cntrlPanel);
               this._okButton.subscribe('onActivated', function() {
                  self._applyEdit();
               });
               $cancelCross.bind('mousedown', function() {
                  self._cancelEdit();
               });
            }
         },

         _removeControlPanel: function() {
            if (this._options.enableControlPanel) {
               this._cntrlPanel.remove();
            }
         }
      };

      return EditAtPlaceMixin;
   });
