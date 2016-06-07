define('js!SBIS3.CONTROLS.EditAtPlaceMixin', ['js!SBIS3.CONTROLS.IconButton', 'js!SBIS3.CORE.Dialog'], function(IconButton, Dialog) {
      /**
       * @mixin SBIS3.CONTROLS.EditAtPlaceMixin
       * @public
       * @author Крайнов Дмитрий Олегович
       */
      'use strict';

      var EditAtPlaceMixin = /**@lends SBIS3.CONTROLS.EditAtPlaceMixin.prototype  */ {
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

         _applyEdit: function () {
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
               this._notify('onApply', values);
            }
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

         _keyPressHandler: function (e) {
            switch (e.which) {
               case 13: {
                  this._applyEdit();
               }
                  break;
               case 27: {
                  this._cancelEdit();
               }
                  break;
               default:
                  break;
            }
         },

         after: {
            _initializePicker: function(){
               var self = this;
               this._picker.subscribe('onClose', function(event){
                  event.setResult(!self._requireDialog);
                  if (self._requireDialog) {
                     self._openConfirmDialog().addCallback(function (result) {
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
               });
            },

            showPicker: function(){
               this._requireDialog = false;
            }
         },

         instead: {
            _setPickerConfig: function () {
               return {
                  corner: 'tl',
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
         _addControlPanel: function (container) {
            if (this._options.enableControlPanel) {
               var self = this,
                  $ok = $('<span class="controls-EditAtPlace__okButton controls-IconButton__round-border-24"></span>'),
                  $cancelCross = $('<span class="controls-EditAtPlace__cancel"></span>');
               this._cntrlPanel = $('<span class="controls-EditAtPlaceGroup__controlPanel"></span>').append($ok).append($cancelCross);

               // Добавляем кнопки
               this._okButton = new IconButton({
                  parent: self._picker,
                  element: $ok,
                  icon: 'sprite:icon-16 icon-Yes icon-done action-hover'
               });
               container.append(this._cntrlPanel);
               this._okButton.subscribe('onActivated', function () {
                  self._applyEdit();
               });
               $cancelCross.bind('mousedown', function () {
                  self._cancelEdit();
               });
            }
         },

         _removeControlPanel: function(){
            if (this._options.enableControlPanel) {
               this._cntrlPanel.remove();
            }
         }
      }

      return EditAtPlaceMixin;
   });