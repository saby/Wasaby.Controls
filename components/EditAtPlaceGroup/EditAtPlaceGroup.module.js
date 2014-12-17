/**
 * Created by iv.cheremushkin on 18.11.2014.
 */
define('js!SBIS3.CONTROLS.EditAtPlaceGroup', 
     ['js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.IconButton',
      'js!SBIS3.CONTROLS._PickerMixin',
      'js!SBIS3.CONTROLS.EditAtPlace',
      'html!SBIS3.CONTROLS.EditAtPlaceGroup'],
   function (CompoundControl, IconButton, _PickerMixin, EditAtPlace, dotTplFn) {
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
            _editorTpl: null,
            _options: {
               template: null,
               displayAsEditor: false
            }
         },

         $constructor: function () {
            var self = this;
            this._loadChildControls();
            var children = this.getChildControls();

            if (this._options.displayAsEditor) {
               this._setEditorMode();
            } else {
               // всем EditAtPlace задаем свой обработчик клика
               for (var i = 0; i < children.length; i++) {
                  if (children[i] instanceof EditAtPlace) {
                     children[i]._setClickHandler(function () {
                        self._clickHandler();
                     });
                  } else {
                     children.splice(i, 1);
                  }
               }
            }
         },

         _setPickerContent: function () {
            var self = this;
            this._picker._container.addClass('controls-EditAtPlaceGroup__editorOverlay');
            this._picker._container.bind('keypress', function (e) {
               self._keyPressHandler(e);
            });
            this._picker._loadChildControls();
            this._setEditorMode(true);
            this._addControlPanel();
         },

         _setEditorMode: function (inPicker) {
            var children;
            if (inPicker) {
               children = this._picker.getChildControls();
            } else {
               children = this.getChildControls();
            }
            for (var i = 0; i < children.length; i++) {
               if (children[i] instanceof EditAtPlace) {
                  children[i]._setEditorMode();
                  children[i]._loadChildControls();
               }
            }
         },

         // Добавляем кнопки
         _addControlPanel: function () {
            var self = this,
               $ok = $('<span class="controls-EditAtPlace__okButton"></span>'),
               $cancel = $('<span class="controls-EditAtPlace__cancel"></span>'),
               $cntrlPanel = $('<span class="controls-EditAtPlaceGroup__controlPanel"></span>').append($ok).append($cancel);
            // Добавляем кнопки
            this._okButton = new IconButton({
               parent: self._picker,
               element: $ok,
               icon: 'sprite:icon-24 icon-Successful icon-done action-hover'
            });
            this._picker.getContainer().append($cntrlPanel);
            this._okButton.subscribe('onActivated', function () {
               self.hidePicker();
            });
            $cancel.bind('click', function () {
               self.hidePicker();
               $ws.single.EventBus.channel('EditAtPlaceChannel').notify('onCancel');
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
               closeByExternalClick: true,
               isModal: true,
               template: this._options.template
            };
         },

         _clickHandler: function () {
            this.showPicker();
         },

         _keyPressHandler: function (e) {
            if (e.which == 13) {
               this.hidePicker();
            }
         },

         _initializePicker: function () {
            EditAtPlaceGroup.superclass._initializePicker.call(this);
            this._picker.subscribe('onOpen', function () {
               $ws.single.EventBus.channel('EditAtPlaceChannel').notify('onOpen');
            });
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