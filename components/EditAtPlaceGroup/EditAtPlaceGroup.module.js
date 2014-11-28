/**
 * Created by iv.cheremushkin on 18.11.2014.
 */
define('js!SBIS3.CONTROLS.EditAtPlaceGroup', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.IconButton',
   'js!SBIS3.CONTROLS._PickerMixin',
   'js!SBIS3.CONTROLS.EditAtPlace'
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
         this._container.append(this._options.template);
         this._loadChildControls();

         this._editorTpl = $(this._container).clone(); //сохраняем шаблон для слоя редактора
         var children = this._getChildControls(this._container);
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
         this._childEditsArray = children;
      },

      _setPickerContent: function () {
         var self = this;
         for (var i = 0; i < this._childEditsArray.length; i++) {
            // В шаблоне редактора заменяем все EditAtPlace на соответствующие им редакторы
            $('[id = "' + this._childEditsArray[i].getId() + '"]', this._editorTpl.get(0))
               .replaceWith($(this._childEditsArray[i]._options.editorTpl())
                  .attr('data-bind', this._childEditsArray[i]._container.attr('data-bind'))
                  .width(this._childEditsArray[i]._container.width() + 24)); // TODO: 20???
            this._childEditsArray[i]._container.css('width', this._childEditsArray[i]._container.width());
         }
         this._picker._container.addClass('controls-EditAtPlace__editorOverlay controls-EditAtPlaceGroup__editorOverlay').append(this._editorTpl);
         this._picker._container.bind('keypress', function(e){
            self._keyPressHandler(e);
         });
         this._picker._loadChildControls();
         this._addControlPanel();
      },

      // Добавляем кнопки
      _addControlPanel: function(){
         var self = this,
            $ok = $('<div class="controls-Button controls-EditAtPlace__okButton"></div>'),
            $cancel = $('<div class="controls-EditAtPlace__cancel"></div>'),
            $btnsContainer = $('<div class="controls-EditAtPlaceGroup__controlPanel"></div>').append($ok).append($cancel);

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
            isModal: true
         };
      },

      _clickHandler: function () {
         this.showPicker();
      },

      _keyPressHandler: function(e) {
         if (e.which == 13){
            this.hidePicker();
         }
      },

      _initializePicker: function(){
         EditAtPlaceGroup.superclass._initializePicker.call(this);

         this._picker.subscribe('onOpen', function(){
            $ws.single.EventBus.channel('EditAtPlaceChannel').notify('onOpen');
         });
      },

      /*TODO переопределяем метод compoundControl - костыль*/
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
      },

      /*TODO Метод скопирован из areaAbstract - костыль*/
      _getChildControls: function (excludeContainers) {
         var children = [];
         for (var i = 0, l = this._childControls.length; i < l; i++) {
            if (i in this._childControls) {
               var c = this._childControls[i];
               if (c) {
                  if (c instanceof $ws.proto.AreaAbstract) {
                     Array.prototype.push.apply(children, c.getChildControls(excludeContainers));
                     if (excludeContainers) {
                        continue;
                     }
                  }
                  children.push(c);
               }
            }
         }
         return children;
      }
   });

   return EditAtPlaceGroup;
});