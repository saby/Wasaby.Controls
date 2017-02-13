define('js!SBIS3.CONTROLS.EditAtPlace',
   ['js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.TextBox',
      'js!SBIS3.CONTROLS.PickerMixin',
      'js!SBIS3.CONTROLS.EditAtPlaceMixin',
      'js!SBIS3.CONTROLS.Utils.HtmlDecorators.DateFormatDecorator',
      'html!SBIS3.CONTROLS.EditAtPlace',
      'Core/helpers/string-helpers',
      'i18n!SBIS3.CONTROLS.EditAtPlace'
   ],
   function (CompoundControl, TextBox, PickerMixin, EditAtPlaceMixin, DateFormatDecorator, dotTplFn, strHelpers) {
      'use strict';

      var dateDecorator = null;

      function formatText(text) {
         var getTextFromDate = function(date){
            if (!dateDecorator) {
               dateDecorator = new DateFormatDecorator();
            }
            return dateDecorator.apply(date, this.dateDecoratorMask);
         }.bind(this);

         var getTextByDateRange = function(range){
            return [rk('с'), getTextFromDate(range.startDate), rk('по'), getTextFromDate(range.endDate)].join(' ');
         }.bind(this);

         //TODO: Декоратор даты, временно применяется здесь до лучших времен (ждем virtualDOM'a)
         if (text instanceof(Date)){
            text = getTextFromDate(text);
         }
         //Если пришел период - склеиваем из дат строку
         else if (text instanceof Object && text.startDate && text.endDate){
            text = getTextByDateRange(text);
         }
         return strHelpers.escapeHtml(text);
      }

      /**
       * @class SBIS3.CONTROLS.EditAtPlace
       * @extends $ws.proto.CompoundControl
       * @control
       * @public
       * @category Inputs
       * @mixes SBIS3.CONTROLS.PickerMixin
       * @mixes SBIS3.CONTROLS.EditAtPlaceMixin
       * @author Крайнов Дмитрий Олегович
       * @cssModifier controls-EditAtPlace__ellipsis Текстовое поле обрезается троеточием, если не умещается в контейнере
       */
      var EditAtPlace = CompoundControl.extend([PickerMixin, EditAtPlaceMixin], /** @lends SBIS3.CONTROLS.EditAtPlace.prototype */{
         _dotTplFn: dotTplFn,
         _aliasForContent: 'editorTpl',
         $protected: {
            _textField: null,
            _okButton: null,
            _oldText: '',
            _requireDialog: false,
            _isEditInGroup: false, //Находится ли редактирование в группе
            _options: {
               /**
                * @cfg {String} Текст в поле ввода
                * @example
                * <pre>
                *     <option name="text">При нажатии на этот текст его можно будет редактировать</option>
                * </pre>
                * @see setText
                * @see getText
                */
               text: '',
               /**
                * @cfg {String} Текст подсказки внутри редактирования
                * @remark
                * Данный текст отображается внутри поля до момента получения фокуса 
                * и как текст по нажатию на который начнется редактирование
                * @example
                * <pre>
                *     <option name="placeholder">Фамилия</option>
                * </pre>
                * @translatable
                * @see setPlaceholder
                */
               placeholder: '',
               /**
                * @cfg {Content} Устанавливает компонент, который будет использован для редактирования текста.т
                */
               editorTpl: '<component data-component="SBIS3.CONTROLS.TextBox"></component>',
               /**
                * @cfg {Boolean} Определяет, будет ли многострочным редактируемый текст.
                * Если указано, текст будет переноситься, убираясь в ширину контейнера.
                */
               multiline: false,

               dateDecoratorMask: 'DD.MM.YY',

               _escape: function(txt) {
                  return strHelpers.escapeHtml(txt)
               },

               formattedText: function() {
                  return formatText.call(this, this.text);
            }
            }
         },

         $constructor: function () {
            this._publish('onCancel', 'onApply', 'onShowEditor');
            var self = this;
            this._textField = $('.controls-EditAtPlace__textField', this._container.get(0));
            this._textField.bind('click', function () {
               self._clickHandler();
            });
            /*FixMe: придрот, выпилить когда будет номральный CompoundControl*/
            this._container.removeClass('ws-area');
            
            //TODO: Декораторы не должны разбираться тут (ждем virtualDOM'a) 
            var decorators = this._container.attr('decorators');
            if (decorators && decorators.indexOf('format:') !== -1) {
               decorators = decorators.split('format:');
               if (decorators.length > 1){
                  this._options.dateDecoratorMask = decorators[1];
               }
            }

            this.subscribe('onTextChange', function(event, text){
               self._requireDialog = text != self._oldText;
            });

            if ($(this._options.editorTpl).attr('data-component') == 'SBIS3.CONTROLS.TextArea'){
               $(this._container.children()[0]).addClass('controls-EditAtPlace__textAreaWrapper');
            }
         },

         init: function(){
            EditAtPlace.superclass.init.apply(this, arguments);
            var editor = $('.js-controls-EditAtPlace__editor', this._container.get(0)),
               editorComponent = this.getChildControls(undefined, false)[0], //Получим дочерний компонент на первом уровне вложенности
               self = this;
            //Начальный текст может быть и не пустой строкой
            this._saveOldText();

            editorComponent.subscribe('onFocusOut', function(event, destroyed, focusedControl){
               if (!self._isEditInGroup && self.validate() && !self._isEditorChild(focusedControl, this)){
                  if (this.getText() !== self._oldText){
                     self._editorFocusOutHandler(true);
                  } else {
                     self._editorFocusOutHandler(false);
                  }
               }
            });

            //Подобная подписка на события через jQuery в редактировании по месту используется во многих местах
            //Имеет смысл в 374 перевести логику работы непосредственно через компонент, который мы получаем чуть выше
            editor.bind('keydown', function (e) {
               self._keyPressHandler(e);
            });
         },

         /**
          * При потере полем редактирования фокуса вызываем завершение редактирования
          * @private
          */
         _editorFocusOutHandler: function(apply) {
            if (!this._isEditInGroup && this._options.displayAsEditor){
               apply ? this._applyEdit() : this._cancelEdit();
            }
         },

         // Проверяем не ушел ли фокус на одного из детей редактора (например выпадашка у поля связи)
         _isEditorChild: function(focusedControl, control){
            var isChild = false;
            while (focusedControl.getParent && focusedControl.getParent()){
               if (focusedControl == control){
                  isChild = true;
                  break;
               }
               focusedControl = focusedControl.getParent();
            }
            return isChild;
         },

         /**
          * Устанавливаем флаг, указывающий на то, что редактирование находится в группе
          * Используется EditAtPlaceGroup
          * @private
          */
         _setEditInGroup: function(){
            this._isEditInGroup = true;
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

         _setKeyPressHandler: function(newHandler){
            if (typeof newHandler == 'function') {
               var editors = $('.js-controls-EditAtPlace__editor', this._container.get(0));
               editors.unbind('keydown', this._keyPressHandler);
               editors.bind('keydown', newHandler);
               this._keyPressHandler = newHandler;
            }
         },

         _setPickerContent: function () {
            var self = this;
            this._picker.getContainer().addClass('controls-EditAtPlace__editorOverlay');
            this._picker.reviveComponents();
            this._addControlPanel(this._picker._container);
            this._picker._container.bind('keydown', function (e) {
               self._keyPressHandler(e);
            });
         },

         /**
          * Установить режим редактирования по месту
          * @param {Boolean} inPlace 
          * true - отображение только редактора
          * false - отображение текста при клике по которому отображается редактор
          * @see displayAsEditor
          */
         setInPlaceEditMode: function (inPlace) {
            this._options.displayAsEditor = inPlace;
            $('.js-controls-EditAtPlace__fieldWrapper', this._container).toggleClass('ws-hidden', inPlace);
            $('.js-controls-EditAtPlace__editor', this._container).toggleClass('ws-hidden', !inPlace);
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
            this._setOldText();
            this._deactivateActiveChildControl();
            this._notify('onCancel');
         },

         _getEditTemplate: function(){
            return this._options.editorTpl;
         },

         /**
          * Установить текст внутри поля. Текст установиться и в редактор и в отображение.
          * @param {String} text Текст для установки.
          * @see text
          * @see getText
          */
         setText: function (text) {
            var oldText = this._options.text;
            this._options.text = text;
            if (oldText !== this._options.text) {
               this._notify('onTextChange', this._options.text);
               this._notifyOnPropertyChanged('text');
            }
            this._drawText(this._options.formattedText());
         },
            
         /**
          * Получить текстовое значение контрола
          * @returns {String} Текст - значение поля
          * @example
          * @see text
          * @see setText
          */
         getText: function () {
            return this._options.text;
         },

         _drawText: function(text){
            if (!text){
               text = '<span class="controls-EditAtPlace__placeholder">' + this._options.placeholder + '</span>';
            }
            this._textField.html(text || '&nbsp;');
         }

      });

      return EditAtPlace;
   });