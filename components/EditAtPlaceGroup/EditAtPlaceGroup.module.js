/**
 * Created by iv.cheremushkin on 18.11.2014.
 */
define('js!SBIS3.CONTROLS.EditAtPlaceGroup', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.IconButton',
   'js!SBIS3.CONTROLS._PickerMixin',
   'js!SBIS3.CONTROLS.EditAtPlace',
   'html!SBIS3.CONTROLS.EditAtPlaceGroup'
], function (CompoundControl, IconButton, _PickerMixin, EditAtPlace, dotTplFn) {
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
         _childEditsArray: null,
         _options: {
            template: null
         }
      },

      $constructor: function () {
         var self = this;
         this._loadChildControls();
         var children = this.getChildControls();
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
         //_childEditsArray - массив имеющихся EditAtPlace
         this._childEditsArray = children;
         this._createEditorTemplate();
      },

      _setPickerContent: function () {
         var self = this;
         this._picker._container.addClass('controls-EditAtPlaceGroup__editorOverlay');
         this._picker._container.bind('keypress', function(e){
            self._keyPressHandler(e);
         });
         this._picker._loadChildControls();
         this._addControlPanel();
      },

      _createEditorTemplate: function () {
         var template = $(this._options.template);
         $('[data-component="SBIS3.CONTROLS.EditAtPlace"]', template).each(function () {
            var editor = $('[name="editorTpl"]', this),
               dataBind = $(this).attr('data-bind');
            if (editor.length) {
               editor = $(editor.get(0).innerHTML);
            } else {
               editor = $('<component data-component="SBIS3.CONTROLS.TextBox"></component>');
            }
            $.each($(this).prop('attributes'), function () {
               if (this.name != 'data-component' && this.name != 'name' && this.name != 'id') {
                  editor.attr(this.name, this.value);
               }
            });
            $(this).replaceWith(editor);
         });
         this._editorTpl = template.get(0).outerHTML;
      },

      // Добавляем кнопки
      _addControlPanel: function(){
         var self = this,
            $ok = $('<div class="controls-EditAtPlace__okButton"></div>'),
            $cancel = $('<div class="controls-EditAtPlace__cancel"></div>'),
            $cntrlPanel = $('<span class="controls-EditAtPlaceGroup__controlPanel"></span>').append($ok).append($cancel);

         // Добавляем кнопки
         this._okButton = new IconButton({
            parent: self._picker,
            element: $ok,
            icon: 'sprite:icon-24 icon-Successful icon-done'
         });
         this._picker.getContainer().append($cntrlPanel);
         // Подписываемся на клики кнопок
         this._okButton.subscribe('onActivated', function(){
            self.hidePicker();
         });
         $cancel.bind('click',function(){
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
            template: this._editorTpl
         };
      },

      _clickHandler: function () {
         this.showPicker();
      },

      _keyPressHandler: function(e) {
         if (e.which == 13){
            //this.hidePicker();
         }
      },

      _initializePicker: function(){
         EditAtPlaceGroup.superclass._initializePicker.call(this);

         this._picker.subscribe('onOpen', function(){
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