/**
 * Created by iv.cheremushkin on 18.11.2014.
 */
define('js!SBIS3.CONTROLS.EditAtPlaceGroup',
   ['js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.PickerMixin',
      'js!SBIS3.CONTROLS.EditAtPlace',
      'js!SBIS3.CONTROLS.EditAtPlaceMixin',
      'html!SBIS3.CONTROLS.EditAtPlaceGroup',
      'css!SBIS3.CONTROLS.EditAtPlaceGroup'],
   function (CompoundControl, PickerMixin, EditAtPlace, EditAtPlaceMixin, dotTplFn) {
      'use strict';
      /**
       * @class SBIS3.CONTROLS.EditAtPlaceGroup
       * @extends $ws.proto.CompoundControl
       * @control
       * @public
       * @category Inputs
       * @mixes SBIS3.CONTROLS.PickerMixin
       * @author Крайнов Дмитрий Олегович
       * @demo SBIS3.CONTROLS.Demo.MyEditAtPlace
       */

      var EditAtPlaceGroup = CompoundControl.extend([PickerMixin, EditAtPlaceMixin], /** @lends SBIS3.CONTROLS.EditAtPlaceGroup.prototype */{
         _dotTplFn: dotTplFn,
         $protected: {
            _textField: null,
            _cancelButton: null,
            _okButton: null,
            _editorTpl: null,
            _requireDialog: false,
            _options: {
               /**
                * @cfg {Content} шаблон
                */
               template: null
            }
         },

         $constructor: function () {
            this._publish('onCancel', 'onApply', 'onShowEditor');
         },

         init: function(){
            EditAtPlaceGroup.superclass.init.call(this);
            var self = this;
            this.reviveComponents();
            if (this._options.displayAsEditor) {
               this.setInPlaceEditMode(true);
            } else {
               // всем EditAtPlace задаем свой обработчик клика
               this._iterateChildEditAtPlaces(function(child){
                  child._setClickHandler(self._clickHandler.bind(self));
                  child._setKeyPressHandler(self._keyPressHandler.bind(self));
                  child._setEditInGroup();
                  if ($(child._options.editorTpl).attr('data-component') == 'SBIS3.CONTROLS.TextArea'){
                     $(child._container.children()[0]).addClass('controls-EditAtPlace__textAreaWrapper');
                  }
                  child.subscribe('onTextChange', function(event, text){
                     self._requireDialog = text != child._oldText;
                  });
               });
            }
            if (!this._options.editInPopup){
               this.subscribe('onFocusOut', function(){
                  self._applyEdit();
               });
            }
         },

         _setPickerContent: function () {
            var self = this;
            this._picker._container.addClass('controls-EditAtPlaceGroup__editorOverlay');
            this._picker._container.bind('keydown', function (e) {
               self._keyPressHandler(e);
            });

            this._iterateChildEditAtPlaces(function(child){
               child._setEditInGroup();;
               child._setKeyPressHandler(self._keyPressHandler.bind(self));
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
                  func(children[i], i);
               }
            }
         },

         /**
          * Установить режим отображения
          * @param inPlace true - редактирвоание / false - отображение
          */
         setInPlaceEditMode: function (inPlace) {
            this._iterateChildEditAtPlaces(function(child){
               child.setInPlaceEditMode(inPlace);
            });
            if (inPlace) {
               this._notify('onShowEditor');
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
            this._iterateChildEditAtPlaces(function (child) {
               child._setOldText();
            });
            this._deactivateActiveChildControl();
            this._notify('onCancel');
         },

         _getEditTemplate: function(){
            return this._options.template;
         },

         showPicker: function(){
            EditAtPlaceGroup.superclass.showPicker.call(this);
            this._iterateChildEditAtPlaces(function(child){
               child.setInPlaceEditMode(true);
            }, this._picker);
         },

         _clickHandler: function () {
            if (this.isEnabled()) {
               this._iterateChildEditAtPlaces(function (child) {
                  child._saveOldText();
               });
               if (this._options.editInPopup) {
                  this.showPicker();
               } else {
                  this.setInPlaceEditMode(true);
                  this._addControlPanel(this._container);
               }
               if (this._options.editInPopup) {
                  if ($('.js-controls-TextBox__field', this._picker._container).get(0)) {
                     $('.js-controls-TextBox__field', this._picker._container).get(0).focus();
                  } else if ($('.controls-TextArea__inputField', this._picker._container).get(0)) {
                     $('.controls-TextArea__inputField', this._picker._container).get(0).focus();
                  }
               } else {
                  if ($('.js-controls-TextBox__field', this._container).get(0)) {
                     $('.js-controls-TextBox__field', this._container).get(0).focus();
                  } else if ($('.controls-TextArea__inputField', this._container).get(0)) {
                     $('.controls-TextArea__inputField', this._container).get(0).focus();
                  }
               }
            }
         },

         setEnabled: function(enabled){
            EditAtPlaceGroup.superclass.setEnabled.call(this, enabled);
            this._iterateChildEditAtPlaces(function(child){
               child.setEnabled(enabled);
            });
         }
      });

      return EditAtPlaceGroup;
   });