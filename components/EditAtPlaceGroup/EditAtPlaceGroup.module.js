/**
 * Created by iv.cheremushkin on 18.11.2014.
 */
define('js!SBIS3.CONTROLS.EditAtPlaceGroup',
     ['js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.IconButton',
      'js!SBIS3.CONTROLS._PickerMixin',
      'js!SBIS3.CONTROLS.EditAtPlace',
      'js!SBIS3.CORE.Dialog',
      'html!SBIS3.CONTROLS.EditAtPlaceGroup'],
   function (CompoundControl, IconButton, _PickerMixin, EditAtPlace, Dialog, dotTplFn) {
      'use strict';
      /**
       * @class SBIS3.CONTROLS.EditAtPlaceGroup
       * @extends SBIS3.CORE.CompoundControl
       * @control
       * @public
       * @category Inputs
       * @mixes SBIS3.CONTROLS._PickerMixin
       */

      var EditAtPlaceGroup = CompoundControl.extend([_PickerMixin], /** @lends SBIS3.CONTROLS.EditAtPlaceGroup.prototype */{
         $protected: {
            _dotTplFn: dotTplFn,
            _textField: null,
            _cancelButton: null,
            _okButton: null,
            _cancelCross: null,
            _editorTpl: null,
            _options: {
               /**
                * @cfg {String} шаблон
                */
               template: null,
               /**
                * @cfg {Boolean} отображать как редактор
                */
               displayAsEditor: false,
               /**
                * @cfg {Boolean} редактировать во всплывашке или в собственном контейнере
                */
               editInPopup: false
            }
         },

         $constructor: function () {
            var self = this;
            this._publish('onCancel', 'onApply');
            this._loadChildControls();

            if (this._options.displayAsEditor) {
               this.setInPlaceEditMode();
            } else {
               // всем EditAtPlace задаем свой обработчик клика
               this._iterateChildEditAtPlaces(function(child){
                  child._setClickHandler(function () {
                     self._clickHandler();
                  });
                  if ($(child._options.editorTpl).attr('data-component') == 'SBIS3.CONTROLS.TextArea'){
                     $(child._container.children()[0]).addClass('controls-EditAtPlace__textAreaWrapper');
                  }
               });
            }
         },

         _setPickerContent: function () {
            var self = this;
            this._picker._container.addClass('controls-EditAtPlaceGroup__editorOverlay');
            this._picker._container.bind('keypress', function (e) {
               self._keyPressHandler(e);
            });
            this._picker._loadChildControls();

            this._iterateChildEditAtPlaces(function(child){
               child.setInPlaceEditMode(true);
            }, this._picker);

            this._addControlPanel(this._picker._container);
         },

         _iterateChildEditAtPlaces: function(func, parent){
            var children;
            if (!parent){
               children = this.getChildControls();
            } else {
               children = parent.getChildControls();
            }
            for (var i = 0; i < children.length; i++) {
               if (children[i] instanceof EditAtPlace) {
                  func(children[i]);
               }
            }
         },

         setInPlaceEditMode: function (inPlace) {
            this._iterateChildEditAtPlaces(function(child){
               child.setInPlaceEditMode(inPlace);
            });
         },

         // Добавляем кнопки
         _addControlPanel: function (container) {
            this._cancelCross = $('<span class="controls-EditAtPlace__cancel"></span>');
            var self = this,
               $ok = $('<span class="controls-EditAtPlace__okButton"></span>'),
               $cntrlPanel = $('<span class="controls-EditAtPlaceGroup__controlPanel"></span>').append($ok).append(this._cancelCross);

            // Добавляем кнопки
            this._okButton = new IconButton({
               parent: self._picker,
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
            this._iterateChildEditAtPlaces(function (child) {
               child._setOldText();
            });
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
               closeByExternalClick: true,
               isModal: true,
               template: this._options.template
            };
         },

         _clickHandler: function () {
            this._iterateChildEditAtPlaces(function (child) {
               child._saveOldText();
            });
            if (this._options.editInPopup) {
               this.showPicker();
            } else {
               this.setInPlaceEditMode(true);
               this._addControlPanel(this._container);
            }
         },

         _keyPressHandler: function (e) {
            if (e.which == 13) {
               //this.hidePicker();
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
            return deferred;
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

      return EditAtPlaceGroup;
   });