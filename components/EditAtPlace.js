define('SBIS3.CONTROLS/EditAtPlace',
   ['Lib/Control/CompoundControl/CompoundControl',
      'SBIS3.CONTROLS/Mixins/PickerMixin',
      'SBIS3.CONTROLS/Mixins/EditAtPlaceMixin',
      'SBIS3.CONTROLS/Mixins/FormWidgetMixin',
      'SBIS3.CONTROLS/Utils/HtmlDecorators/DateFormatDecorator',
      'tmpl!SBIS3.CONTROLS/EditAtPlace/EditAtPlace',
      'Core/helpers/String/escapeHtml',
      'SBIS3.CONTROLS/Utils/TemplateUtil',
      'Core/constants',
      'SBIS3.CONTROLS/ControlHierarchyManager',
      'Core/helpers/Object/isEmpty',
      'SBIS3.CONTROLS/TextBox',
      'i18n!SBIS3.CONTROLS/EditAtPlace',
      'css!SBIS3.CONTROLS/EditAtPlace/EditAtPlace'
   ],
   function (CompoundControl, PickerMixin, EditAtPlaceMixin, FormWidgetMixin, DateFormatDecorator, dotTplFn, escapeHtml, TemplateUtil, constants, ControlHierarchyManager, objectIsEmpty) {
      'use strict';

      var dateDecorator = null;

      function formatText(text) {
         if (!text || objectIsEmpty(text)) {
            return '';
         }

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
         else if (text instanceof Object){
            if (text.startDate && text.endDate) {
               text = getTextByDateRange(text);
            } else {
               text = '';
            }
         }
         return text;
      }

      /**
       * @class SBIS3.CONTROLS/EditAtPlace
       * @extends Lib/Control/CompoundControl/CompoundControl
       * @control
       * @public
       * @category Input
       *
       * @mixes SBIS3.CONTROLS/Mixins/PickerMixin
       * @mixes SBIS3.CONTROLS/Mixins/EditAtPlaceMixin
       * @mixes SBIS3.CONTROLS/Mixins/FormWidgetMixin
       *
       * @author Герасимов А.М.
       * @cssModifier controls-EditAtPlace__ellipsis Текстовое поле обрезается троеточием, если не умещается в контейнере
       */
      var EditAtPlace = CompoundControl.extend([PickerMixin, EditAtPlaceMixin, FormWidgetMixin], /** @lends SBIS3.CONTROLS/EditAtPlace.prototype */{
         /**
          * @event onApply Срабатывает при успешном завершении редактирования
          * @param {Core/EventObject} eventObject Дескриптор события.
          */
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
               editorTpl: '<component data-component="SBIS3.CONTROLS/TextBox"></component>',
               /**
                * @cfg {String|Function} Шаблон отрисовываемого текста
                */
               editFieldTpl: null,
               /**
                * @cfg {Boolean} Определяет, будет ли многострочным редактируемый текст.
                * Если указано, текст будет переноситься, убираясь в ширину контейнера.
                */
               multiline: false,
               inputType: 'Text',

               dateDecoratorMask: 'DD.MM.YY',

               _escape: function(txt) {
                  return escapeHtml(txt)
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

            if ($(this._options.editorTpl).attr('data-component') == 'SBIS3.CONTROLS/TextArea'){
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
               if (!self._options.enableControlPanel) {
                  if (!self._isEditInGroup && self.validate() && !self._isEditorChild(focusedControl, this)){
                     if (this.getText() !== self._oldText){
                        self._editorFocusOutHandler(true);
                     } else {
                        self._editorFocusOutHandler(false);
                     }
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
          * Если не прошла валидация - включаем режим отображения редакторов
          */
         validate: function(){
            var result = EditAtPlace.superclass.validate.apply(this, arguments);
            if (!result && !this._options.editInPopup) {
               this.setInPlaceEditMode(true);
            }
            return result;
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
            return focusedControl && !!ControlHierarchyManager.checkInclusion(control, focusedControl.getContainer());
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
            this._fixIE10TabButtonsEditMode();
            if (inPlace) {
               this._notify('onShowEditor');
            }
            this._notifyOnSizeChanged(this, this, true);
         },

         _fixIE10TabButtonsEditMode: function () {
            //Редактирование по месту, лежащее во вкладке, при переходе в режим редактирования увеличивается в ширине
            //ie не понимает что контент внутри увеличился, и вместо того, чтобы увеличить ширину родительского контейнера (который никто не ограничивает)
            //пытается ужать содержимое внутри себя. Манипуляции с min-width вызывают reflow и все отрисовывается как надо.
            if (constants.browser.isIE) {
               var tbInnerContainer = this.getContainer().closest('.controls-TabButton__inner');
               if (tbInnerContainer.length) {
                  tbInnerContainer.css('min-width', 0);
                  setTimeout(function() {
                     tbInnerContainer.css('min-width', '');
                  }, 50);
               }
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

         /**
          * Отменяет редактирования по месту
          */
         cancelEdit: function () {
            this._cancelEdit();
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

         _drawText: function (text) {
            $('.controls-EditAtPlace__textField', this.getContainer()).toggleClass('controls-EditAtPlace__placeholder', !text);
            if (this._options.editFieldTpl) {
               text = TemplateUtil.prepareTemplate(this._options.editFieldTpl)({text: text});
            } else if (!text) {
               text = escapeHtml(this._options.placeholder);
            } else {
               text = escapeHtml(text);
            }
            this._textField.html(text || '&nbsp;');
         },
         //EditAtPlace должен переключать состояние как TextBox, но т.к. он не наследуется от TextBoxBase, то нужно копипастить его методы
         _getStateToggleContainer: function(){
            return this._container;
         },
         setEnabled: function(enabled) {
            EditAtPlace.superclass.setEnabled.apply(this, arguments);
            this._toggleState();
         },
         clearMark: function() {
            EditAtPlace.superclass.clearMark.apply(this, arguments);
            this._toggleState();
         },
         markControl: function() {
            EditAtPlace.superclass.markControl.apply(this, arguments);
            this._toggleState();
         },
         _updateActiveStyles: function() {
            EditAtPlace.superclass._updateActiveStyles.apply(this, arguments);
            this._toggleState();
         },
         _toggleState: function() {
            var container = this._getStateToggleContainer()[0];
            container.className = container.className.replace(/(^|\s)controls-TextBox_state_\S+/gi, '');
            container.className = container.className.replace(new RegExp('(^|\\\s)controls-' + this._options.inputType + '-InputRender_state_\\\S+', 'gi'), '');
            this._getStateToggleContainer().addClass(this._getToggleState());
         },
         _getToggleState: function() {
            var
               active = this.isActive(),
               enabled = this.isEnabled(),
               marked = this.isMarked();
            return 'controls-TextBox_state_' + (marked ? 'error' : !enabled ? 'disabled controls-TextBox_state_disabled_singleLine' : active ? 'active' : 'default') +
               ' controls-' + this._options.inputType + '-InputRender_state_' + (marked ? 'error' : !enabled ? 'disabled controls-' + this._options.inputType + '-InputRender_state_disabled_singleLine' : active ? 'active' : 'default');
         }
      });

      return EditAtPlace;
   });