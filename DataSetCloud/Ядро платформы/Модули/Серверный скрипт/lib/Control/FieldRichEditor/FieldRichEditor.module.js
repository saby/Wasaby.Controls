/**
 * Created with JetBrains PhpStorm.
 * User: as.avramenko
 * Date: 02.06.14
 * Time: 14:02
 */
define("js!SBIS3.CORE.FieldRichEditor",
   [
      "js!SBIS3.CORE.FieldString",
      "html!SBIS3.CORE.FieldRichEditor",
      "is!browser?js!SBIS3.CORE.FieldRichEditor/resources/config",
      "js!SBIS3.CORE.Button",
      "js!SBIS3.CORE.FieldDropdown",
      'is!browser?js!SBIS3.CORE.FieldRichEditor/resources/utilites',
      'is!browser?js!SBIS3.CORE.Dialog',
      'is!browser?js!SBIS3.CORE.FieldRichEditor.ImagePropertiesDialog',
      "css!SBIS3.CORE.FieldRichEditor",
      "is!browser?js!SBIS3.CORE.FieldRichEditor/resources/ckeditor/ckeditor",
      "native-css!" + $ws._const.resourceRoot + $ws.helpers.transliterate('Тема Скрепка/Шаблоны/css/basic-style')
   ], function(FieldString, dotTplFn, defaultConfig, Button, Dropdown, Utils, Dialog) {

   "use strict";

   $ws._const.FieldRichEditor = {
      toolbarHeight: 24
   };

   var DEFAULT_YOUTUBE_WIDTH = 640,
       DEFAULT_YOUTUBE_HEIGHT = 360;

   $ws.proto.FieldRichEditorDropdown = Dropdown.extend(/** @lends $ws.proto.FieldRichEditorDropdown.prototype */{
      $constructor: function() {
         if (this._options.handlers && this._options.handlers.onChangeItem) {
            this.subscribe('onChangeItem', this._options.handlers.onChangeItem.bind(this));
         }
      },
      _fillDropdown: function() { //Переопределение функции заполнения DropDown (специальный hover-режим для FieldRichEditor)
         var data = this._options.data;
         if (!data) {
            return;
         }
         var
            keys = data.k,
            values = data.v,
            rendered = data.r,
            visual;
         this._optCont.find('.custom-select-option')
            .unbind('click')
            .remove();
         for (var i = 0, l = keys.length; i < l; i++) { //Бежим по массиву ключей
            visual = rendered[i] || values[i]; //Что отображаем визуально
            if (!this._options.required || !this._isEmptyOption(keys[i], visual)){ //Если необязательно выбирать значение или не пустой итем
               var row = this._createCustomRow(keys[i], visual).appendTo(this._optContList); //Создаем div с выбранной записью
               if (this._valuesAreEqual(keys[i])) { //Если рендерим заголовок
                  this._textSelectedRow = values[i];
                  if (this._options.titleRender) {
                     row = this._options.titleRender.apply(this, [keys[i], values[i]]);
                     row = this._createCustomRow(keys[i], row);
                  } else {
                     row = row.clone();
                  }
                  row
                     .addClass('ws-field-dropdown-current')
                     .prepend(this._optArrow.clone().addClass('custom-select-arrow-open'))
                     .prependTo(this._optContHead);
               }
            }
         }
      },
      _selectingEvent: function(e) {
         var
            target = $(e.target),
            valEquals;
         this._curval = target.closest('.custom-select-option').attr('value');
         valEquals = this._inputControl.val() === this._curval;
         // Для режима hover не надо обрабатывать клик, если значения одинаковые - иначе слетает max-width
         if (!valEquals || !target.hasClass('ws-fre-dropdown-text')) {
            this._hideOptions();
            if (!valEquals) {
               this._inputControl.val(this._curval);
               this._inputControl.change();
            }
            this._inputControl.focus();
            this._notify('onChangeItem', this._curval, valEquals);
         }
         this._notify('onRowClick', e);
         e.stopImmediatePropagation();
      }
   });

   /**
    * @class $ws.proto.FieldRichEditor Богатый текстовый редактор (WYSIWYG editor)
    * @extends $ws.proto.FieldString
    * @control
    * @category Fields
    * @initial
    * <component data-component='SBIS3.CORE.FieldRichEditor' style='width: 650px;'>
    *    <option name="value">Текст</option>
    * </component>
    * @designTime actions SBIS3.CORE.FieldString/design/design
    * @ignoreOptions maxlength
    * @ignoreOptions readonly
    * @ignoreOptions password
    */
   $ws.proto.FieldRichEditor = FieldString.extend(/** @lends $ws.proto.FieldRichEditor.prototype */{
      $protected : {
         _defaultItems: defaultConfig || {},
         _options : {
            cssClassName: 'ws-field-rich-editor',
            /**
             * @cfg {Boolean} Видимость панели инструментов
             * <wiTag group="Отображение">
             * При скрытии панели инструментов работа в текстовом редакторе будет осуществляться только с клавиатуры.
             * Возможные значения:
             * <ol>
             *    <li>true - панель инструментов показана;</li>
             *    <li>false - скрыта.</li>
             * </ol>
             * @see toggleToolbar
             */
            toolbarVisible: true,
            /**
             * @cfg {Boolean} Включение режима автовысоты
             * <wiTag group="Управление">
             * Режим автовысоты текстового редактора.
             */
            autoHeight: false,
            /**
             * @cfg {Number} Минимальная высота (в пикселях)
             * <wiTag group="Управление">
             * Минимальная высота текстового поля (для режима с автовысотой).
             */
            minimalHeight: 200,
            /**
             * @cfg {Number} Максимальная высота (в пикселях)
             * <wiTag group="Управление">
             * Максимальная высота текстового поля (для режима с автовысотой).
             */
            maximalHeight: 300,
            // TODO свойство подлежит удалению
            /**
             * @cfg {Boolean} Скрывать ли границы редактора
             * <wiTag group="Управление">
             * Опция позволяет отображать редактор без границ.
             * Возможные значения:
             * <ol>
             *    <li>true - скрывать границы редактора;</li>
             *    <li>false - отображать границы.</li>
             * </ol>
             * @deprecated Использовать опцию {@link border}. Будет удалено в 3.7.Х
             */
            hideBorder: false,
            /**
             * @cfg {Boolean} Отображение границ редактора
             * <wiTag group="Управление">
             * Опция позволяет отображать редактор без границ.
             * Возможные значения:
             * <ol>
             *    <li>true - отображать границы редактора;</li>
             *    <li>false - не отображать границы.</li>
             * </ol>
             */
            border: true,
             /**
              * @cfg {Object} Объект с настройками платформенных и пользовательских кнопок
              * Для пользовательской кнопки доступны настройки:
              * <ul>
              *    <li>caption - текст: на кнопке без иконки, справа от кнопки с иконкой;</li>
              *    <li>image - иконка: путь до икноки или sprite;</li>
              *    <li>tooltip - подсказка;</li>
              *    <li>handlers - объект с обработчиками действия клика по кнопке;</li>
              *    <li>visible - видимость;</li>
              *    <li>enabled - активность (доступность к взаимодействию);<li>
              * </ul>
              * Пользовательские кнопки вставляются после платформенных в заявленном порядке.
              *
              * Для платформенных кнопок возможно управление только их видимостью (visible) и активностью (enabled).
              * Список платформенных кнопок:
              * <ol>
              *    <li>undo - Шаг назад;</li>
              *    <li>redo - Шаг вперед;</li>
              *    <li>style - Стиль текста;</li>
              *    <li>bold - Полужирный;</li>
              *    <li>italic - Курсив;</li>
              *    <li>underLine - Подчеркнутый;</li>
              *    <li>strike - Зачеркнутый;</li>
              *    <li>justify - Выравнивание текста;</li>
              *    <li>textColor - Цвет текста;</li>
              *    <li>list - Вставить/Удалить список;</li>
              *    <li>link - Вставить/редактировать ссылку;</li>
              *    <li>unlink - Убрать ссылку;</li>
              *    <li>table - Добавить таблицу - ведутся работы, не использовать!!!;</li>
              *    <li>image - Вставить картинку;</li>
              *    <li>smile - Смайлики - ведутся работы, не использовать!!!;</li>
              *    <li>history - История ввода - ведутся работы, не использовать!!!;</li>
              *    <li>source - html-разметка;</li>
              * </ol>
              */
             userItems: {},
            cssClass: 'ws-field-rich-editor'
         },
         _instances: {},
         _itemsContext: undefined,
         _fieldText: undefined,
         _toolbarContainer: undefined,
         _toggleToolbarButton: undefined,
         //Флаг выполнения смены значения поля (нужно из-за асинхронности функции setData)
         _doSetData: false,
         _richEditor: undefined,
         _contentsEditor: undefined,
         _buttonsState: undefined,
         _hackInput: undefined,
         _hackDiv: undefined,
         _dChildReady: null
      },

      /**
       * @lends $ws.proto.FieldRichEditor.prototype
       */
      $constructor: function() {
         var
            extraPlugins = '',
            editorHeight,
            toolbarHeight = this._options.toolbarVisible ? $ws._const.FieldRichEditor.toolbarHeight : 0;

         this._dChildReady = new $ws.proto.Deferred();
         this._inputControl.height('100%').val('');

         this._fieldText = this._container.find('.ws-field');
         this._fieldText.addClass('ws-field-fullheight');

         this._inputControl.unbind('keypress paste keyup');

         this._toolbarContainer = this._container.find('.ws-field-rich-editor-toolbar');
         //Находим кнопку переключения видимости тулбара и биндим на неё клик
         this._toggleToolbarButton = this._container.find('.ws-field-rich-editor-toolbar-toggle-button').bind('click', this._onClickToggleButton.bind(this));
         //Добавляем элементы тулбара
         this._drawItems();
         CKEDITOR.basePath = $ws._const.wsRoot + 'lib/Control/FieldRichEditor/resources/ckeditor/';

         if (this._options.autoHeight) {
            if (this._options.maximalHeight !== 0 && this._options.maximalHeight < this._options.minimalHeight) {
               this._options.maximalHeight = this._options.minimalHeight;
            }
            if (!$ws._const.browser.isIE8) {
               extraPlugins += ',autogrow';
            }
            this._container.css('height', 'auto');
         }
         editorHeight = !this._options.autoHeight || !$ws._const.browser.isIE8 ?
            parseInt(this.getContainer().height(), 10) - toolbarHeight :
            this._options.maximalHeight || this._options.minimalHeight;
         if (!$ws._const.browser.isIE) {
            extraPlugins += ',dragresize';
         }

         if ($ws._const.browser.isMobileSafari) {
            this._hackInput = this._container.find('.ws-field-rich-editor-hack-input');
            this._hackDiv = this._container.find('.ws-field-rich-editor-hack-div');
         }

         this._richEditor = CKEDITOR.replace(this._fieldText[0], {
            extraPlugins: 'wysiwygarea,onchange,blockquote' + extraPlugins,
            autoGrow_onStartup: this._options.autoHeight ? true : undefined,
            autoGrow_maxHeight: this._options.autoHeight ?  this._options.maximalHeight : undefined,
            autoGrow_minHeight: this._options.autoHeight ?  this._options.minimalHeight : undefined,
            autoGrow_bottomSpace: 5,
            removeButtons: '',
            //Убираю возможность вызова контекстного меню
            removePlugins: 'contextmenu',
            //Высота редактора
            height: editorHeight,
            //Подключаю файл с описанием базовых стилей и навешиваю базовый класс на CKEditor
            contentsCss: $ws._const.resourceRoot + $ws.helpers.transliterate('Тема Скрепка/Шаблоны/css/basic-style.css?') + $ws.helpers.createGUID(),
            bodyClass: 'ws-basic-style',
            readOnly: !this._options.enabled,
            resize_enabled: false
         });
         this._richEditor.wsControl = this;
         //Обработка изменения содержимого редактора
         this._richEditor.on('change', this._onValueChangeHandler.bind(this));
         //На изменение размеров проверяем новые размеры и нотифицируем родителя об изменениях
         this._richEditor.on('resize', this._onResizeEditor.bind(this));
         this._richEditor.on('focus', function() {
            this._toolbarContainer.trigger('mouseup');
            this.setActive(true);
         }.bind(this));
         //Обработка готовности ckeditor'а
         this._richEditor.on('instanceReady', function() {
            this._richEditor.addFeature({
               allowedContent: 'iframe[*]',
               requiredContent: 'iframe'
            });
            this._contentsEditor = this._container.find('.cke_contents');
            this._inputControl = this._container.find('.cke');
            //Биндим действия
            this._bindActions();
            //Включаем/отключаем панель инструментов
            this._setEnabled(this._options.enabled);
            //Нотифицируем изменение размеров
            this._notifyOnSizeChanged();
            //Стреляем готовность ws-контрола
            this._dChildReady.addCallback(function(){
               this._notify('onReady');
            }.bind(this));
            this._dChildReady.callback();
         }.bind(this));

         this._richEditor.on('key', function(event) {
            var e = event.data.keyEvent;
            if ((e.which === $ws._const.key.enter && e.ctrlKey) || e.which === $ws._const.key.esc) {
               this.getContainer().trigger($.Event('keydown', {which: e.which, ctrlKey: e.ctrlKey}));
            }
         }.bind(this));

         this._richEditor.on('doubleclick', function(event) {
            var target = event.data.element;
            if (target.is('img') && !target.data("cke-realelement") && !target.isReadOnly()) {
               this._showImagePropertiesDialog(event.data);
            }
         }.bind(this));

         this._richEditor.on('paste', function(event) {
            var result = this.addYouTubeVideo(event.data.dataValue);

            if (result) {
               event.cancel();
            }

            this._onResizeEditor();
         }.bind(this));
      },

      _showImagePropertiesDialog: function(target) {
         var $image = $(target.element.$);
         new Dialog({
            name: 'imagePropertiesDialog',
            template: 'js!SBIS3.CORE.FieldRichEditor.ImagePropertiesDialog',
            selectedImage: $image,
            handlers: {
               onBeforeClose: function() {
                  var
                     percentSizes = this.getChildControlByName('valueType').getValue() === 'per',
                     width = this.getChildControlByName('imageWidth').getValue(),
                     height = this.getChildControlByName('imageHeight').getValue();
                  $image.width(width !== null ? width + (percentSizes ? '%' : '') : '');
                  $image.height(height !== null ? height + (percentSizes ? '%' : '') : '');
               }
            }
         });
      },

      /**
       * Добавить youtube видео
       * @param {String} link Ссылка на youtube видео.
       * @return {Boolean} Результат добавления видео (true - добавилось, false - не добавилось).
       * @example
       * Добавить в богатый редактор youtube видео по ссылке
       * <pre>
       *     richEditor.subscribe('onReady', function() {
       *        richEditor.addYouTubeVideo('http://www.youtube.com/watch?v=...');
       *     });
       * </pre>
       */
      addYouTubeVideo: function(link) {
         var result = false,
             content,
             id;

         if (typeof link !== 'string') {
            return result;
         }

         if ((id = this._getYouTubeVideoId($ws.helpers.escapeTagsFromStr(link, [])))) {
            content = [
               '<iframe',
               ' width="' + DEFAULT_YOUTUBE_WIDTH + '"',
               ' height="' + DEFAULT_YOUTUBE_HEIGHT + '"',
               ' src="' + '//www.youtube.com/embed/' + id + '"',
               ' frameborder="0"',
               ' allowfullscreen>',
               '</iframe>'
            ].join('');

            this._richEditor.insertElement(CKEDITOR.dom.element.createFromHtml(content));
            result = true;
         }

         return result;
      },

      /**
       * JavaScript function to match (and return) the video Id
       * of any valid Youtube Url, given as input string.
       * @author: Stephan Schmitz <eyecatchup@gmail.com>
       * @url: http://stackoverflow.com/a/10315969/624466
       */
      _getYouTubeVideoId: function(link) {
         var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

         return link.match(p) ? RegExp.$1 : false;
      },

      _onResizeEditor: function() {
         var newHeight = this._contentsEditor.height();
         if (this._richEditorHeight !== newHeight) {
            this._richEditorHeight = newHeight;
            this._notifyOnSizeChanged();
         }
      },

      /**
       * Обработчик клика по кнопке переключения видимости тулбара
       * @private
       */
      _onClickToggleButton: function() {
         //Обрабатываем клик только в том случае, если не выполняется анимация и контрол активен
         if (!this._doAnimate && this.isEnabled()) {
            this._doAnimate = true;
            this.toggleToolbar();
            this._richEditor.focus();
         }
      },

      /**
       * Установить стиль для выделенного текста
       * @param {Object} style Объект, содержащий устанавливаемый стиль текста
       * @private
       */
      _setFontProperties: function(style) {
         var
            styleSize = CKEDITOR.config.fontSize_style,
            styleBold = CKEDITOR.config.coreStyles_bold,
            editor = this._richEditor;
         editor.focus();
         editor.fire("saveSnapshot");
         editor.removeStyle(new CKEDITOR.style(styleSize , {'size': 'inherit'}));
         editor.removeStyle(new CKEDITOR.style(styleBold));

         if (style.size) {
            editor.applyStyle(new CKEDITOR.style(styleSize, {size: style.size }));
         }
         if (style.bold) {
            editor.applyStyle(new CKEDITOR.style(styleBold));
         }
         editor.fire("saveSnapshot")
      },

      /**
       * Назначить обработчики команд
       * @private
       */
      _bindActions: function() {
         var
            editor = this._richEditor,
            buttons = this._instances,
            self = this;
         editor.getCommand('undo').on('state', function(){
            buttons.undo.setEnabled(this.state);
         });
         editor.getCommand('redo').on('state', function(){
            buttons.redo.setEnabled(this.state);
         });
         editor.getCommand('bold').on('state', function(){
            buttons.bold.getContainer().toggleClass('ws-fre-button-pressed', this.state === 1);
         });
         editor.getCommand('italic').on('state', function(){
            buttons.italic.getContainer().toggleClass('ws-fre-button-pressed', this.state === 1);
         });
         editor.getCommand('underline').on('state', function(){
            buttons.underline.getContainer().toggleClass('ws-fre-button-pressed', this.state === 1);
         });
         editor.getCommand('strike').on('state', function(){
            buttons.strike.getContainer().toggleClass('ws-fre-button-pressed', this.state === 1);
         });
         editor.getCommand('unlink').on('state', function(){
            buttons.unlink.setEnabled(this.state);
         });
         editor.getCommand('source').on('state', function(){
            buttons.source.getContainer().toggleClass('ws-fre-button-pressed', this.state === 1);
            self._setButtonsState(this.state, true);
         });
      },

      /**
       * Включить/отключить кнопки тулбара
       * @param {Boolean} state Включить (true) / отключить (false)
       * @param ignoreSourceButton Игнорировать при включении/отключении кнопку отображения html-кода
       * @private
       */
      _setButtonsState: function(state, ignoreSourceButton) {
         var
            buttons = this._instances;
         if (state === 1 && !this._buttonsState) {
            this._buttonsState = {};
            for (var i in buttons) {
               if (!ignoreSourceButton || i !== 'source') {
                  this._buttonsState[i] = buttons[i].isEnabled();
                  buttons[i].setEnabled(false);
               }
            }
         } else if (state === 2 && this._buttonsState) {
            for (var j in this._buttonsState) {
               if (!ignoreSourceButton || j !== 'source') {
                  buttons[j].setEnabled(this._buttonsState[j]);
               }
            }
            this._buttonsState = undefined;
         }
      },

      /**
       * Установить цвет для выделенного текста
       * @param {Object} color Устанавливаемый цвет
       * @private
       */
      _setTextColor: function(color) {
         var
            editor = this._richEditor,
            style = CKEDITOR.config.colorButton_foreStyle;
         editor.focus();
         editor.fire("saveSnapshot");
         editor.removeStyle(new CKEDITOR.style(style, {color: 'inherit'}));
         editor.applyStyle(new CKEDITOR.style(style, {color: color}))
         editor.fire("saveSnapshot")
      },

      /**
       * Рендер добавления (рендера) элементов тулбара
       * @private
       */
      _drawItems: function() {
         var itemsArray = this._prepareItems(),
             result = this._instances;
         this._itemsContext = new $ws.proto.Context({ isGlobal: true });
         for (var i in itemsArray) {
            if (itemsArray.hasOwnProperty(i)) {
               var div = $('<div></div>').appendTo(this._toolbarContainer),
                   item = itemsArray[i],
                   type = item.type,
                   isButton = type === 'button',
                   itemCfg = $ws.core.merge({
                      name: i,
                      element: div,
                      fieldRichEditor: this,
                      cssClassName: 'ws-fre-toolbar-item',
                      cssClass: 'ws-fre-toolbar-item',
                      linkedContext: this._itemsContext,
                      renderStyle: isButton ? 'asLink' : 'hover'
                   }, itemsArray[i].config);
               if (isButton) {
                  result[i] = new Button(itemCfg);
               } else if (type === 'dropdown') {
                  result[i] = new $ws.proto.FieldRichEditorDropdown(itemCfg);
               }
               result[i].getOwner = function() {
                  return this._options.fieldRichEditor;
               }
            }
         }
      },

      /**
       * Подготовка массива элементов тулбара
       * @returns {Object} Итоговые элементы тулбара
       * @private
       */
      _prepareItems: function () {
         var items = $ws.core.clone(this._defaultItems),
             userItems = this._options.userItems;
         if (!Object.isEmpty(userItems)) {
            for (var i in userItems) {
               if (userItems.hasOwnProperty(i)) {
                  if (items.hasOwnProperty(i)) {
                     if (userItems[i].config) {
                        if (userItems[i].config.visible !== undefined) {
                           items[i].config.visible = !!userItems[i].config.visible;
                        }
                        if (userItems[i].config.enabled !== undefined) {
                           items[i].config.enabled = !!userItems[i].config.enabled;
                        }
                     }
                  } else {
                     items[i] = userItems[i];
                  }
               }
            }
         }
         return items;
      },

      /**
       * Возращает элемент тулбара с указанным именем или false (если он отсутствует)
       * @param {String} name Имя элемента
       * @returns {$ws.proto.Button|$ws.proto.FieldDropdown|Boolean}
       */
      getToolbarItem: function(name) {
         return (typeof name === 'string' && this._instances[name]) || false;
      },

      /**
       * Устанавливает минимальную высоту текстового поля редактора
       * @param {Number} value Минимальная высота поля редактора
       */
      setMinimalHeight: function(value) {
         if (this._options.autoHeight && typeof value === 'number') {
            this._options.minimalHeight = value;
            if (this._options.maximalHeight !== 0 && this._options.maximalHeight < value) {
               this._options.maximalHeight = value;
            }
            CKEDITOR.instances[this._richEditor.name].config.autoGrow_minHeight = this._options.minimalHeight;
            CKEDITOR.instances[this._richEditor.name].config.autoGrow_maxHeight = this._options.maximalHeight;
            if (this._contentsEditor.height() < value) {
               this._richEditor.resize('', '' + (value - $ws._const.FieldRichEditor.toolbarHeight));
            }
            this._richEditor.execCommand('autogrow');
         }
      },

      /**
       * Устанавливает максимальную высоту текстового поля редактора
       * @param {Number} value Максимальная высота поля редактора
       */
      setMaximalHeight: function(value) {
         if (this._options.autoHeight && typeof value === 'number') {
            this._options.maximalHeight = value;
            if (value !== 0 && value < this._options.minimalHeight) {
               this._options.minimalHeight = value;
            }
            CKEDITOR.instances[this._richEditor.name].config.autoGrow_minHeight = this._options.minimalHeight;
            CKEDITOR.instances[this._richEditor.name].config.autoGrow_maxHeight = this._options.maximalHeight;
            if (this._contentsEditor.height() > value) {
               this._richEditor.resize('', '' + (value - $ws._const.FieldRichEditor.toolbarHeight));
            }
            this._richEditor.execCommand('autogrow');
         }
      },

      /**
       * <wiTag group="Управление">
       * Добавить в текущую позицию указанный html-код
       * @param {String} html Добавляемый html
       * @example
       * Вставить цитату
       * <pre>
       *    richEditor.insertHtml('<blockquote>Текст цитаты</blockquote>');
       * </pre>
       */
      insertHtml: function(html) {
         if (typeof html === 'string' && this._richEditor) {
            if (this._richEditor.status === 'loaded' || this._richEditor.status === 'ready') {
               this._richEditor.insertHtml(html);
            } else {
               this._richEditor.on('instanceReady', function() {
                  this._richEditor.insertHtml(html);
               }.bind(this));
            }
         }
      },

      /**
       * Возвращает минимальную высоту текстового поля редактора
       * @returns {Number}
       */
      getMinimalHeight: function() {
         if (this._options.autoHeight) {
            return this._options.minimalHeight;
         }
      },

      /**
       * Возвращает максимальную высоту текстового поля редактора
       * @returns {Number}
       */
      getMaximalHeight: function() {
         if (this._options.autoHeight) {
            return this._options.maximalHeight;
         }
      },
      getReadyDeferred: function() {
         return this._dChildReady;
      },
      _initFocusCatch: function() {
      },
      _getElementToFocus: function() {
         return this._richEditor.document && $(this._richEditor.document.$.body);
      },
      /**
       * <wiTag group="Отображение">
       * Скрыть/отобразить панель инструментов.
       * При скрытии панели инструментов работа в текстовом редакторе будет осуществляться только с клавиатуры.
       * @param visible {Boolean} Возможные значения:
       * <ol>
       *    <li>true - показать панель инструментов;</li>
       *    <li>false - скрыть.</li>
       * </ol>
       * @see toolbarVisible
       */
      toggleToolbar: function(visible) {
         var
            self = this,
            contHeight = this._container.height();
         this._options.toolbarVisible = visible === true ? true : visible === false ? false : !this._options.toolbarVisible;
         if (this._options.toolbarVisible) {
            this._toolbarContainer.slideDown('fast', function() {
               self._doAnimate = false;
               self._richEditor.resize('', '' + (contHeight - $ws._const.FieldRichEditor.toolbarHeight));
            });
         } else {
            this._toolbarContainer.slideUp('fast', function() { self._doAnimate = false; });
            this._richEditor.resize('', '' + contHeight);
         }
         this._container.toggleClass('ws-field-rich-editor-hide-toolbar', !this._options.toolbarVisible);
      },

      /**
       * Обрабатываем пришедший запрос на изменение размера
       * @private
       */
      _onSizeChangedBatch: function() {
         var contHeight = this._container.height();
         this._richEditor.resize('', '' + (this._options.toolbarVisible && this._options.enabled ? contHeight - $ws._const.FieldRichEditor.toolbarHeight : contHeight));
         return true;
      },

      _setEnabled: function(enabled) {
         if (this._richEditor.status === 'loaded' || this._richEditor.status === 'ready') {
            this._richEditor.setReadOnly(!enabled);
            //Требуем в будущем пересчитать размеры контрола
            this._notifyOnSizeChanged();
         }
         this._toolbarContainer.css('display', enabled && this._options.toolbarVisible ? '' : 'none');
         if (this._dataReview) {
            this._richEditor.setMode('wysiwyg');
            this._dataReview.css('height', this._inputControl.height() + (this._options.toolbarVisible ? 24 : 0));
         }
         $ws.proto.FieldRichEditor.superclass._setEnabled.apply(this, arguments);
      },
      /**
       * Получить текущее значение
       * @returns {*} Текущее значение (в формате html-кода)
       */
      _curValue: function() {
         var contentClass = 'content-wrap',
            // обернуть элемент в div с навешанным событием при отсутвии оного
            checkWrap = function(html) {
               return html && html.search(contentClass) === -1 && html.search('img') !== -1
                  ? '<div class="' + contentClass + '" onclick="$ws.helpers.openImageViewer.apply(this, arguments)">'+html+'</div>'
                  : html;
            };
         if (this._doSetData ) { // Если выполняется смена значения через setData - возвращаем данные, сохраненные в _curval
            return checkWrap(this._curval);
         } else { // иначе - возвращаем данные, введенное в редакторе
            return this._richEditor.status === 'loaded' || this._richEditor.status === 'ready' ? checkWrap(this._richEditor.getData()) : '';
         }
      },

      _notFormatedVal: function() {
         return this._curValue();
      },

      _setRichEditorValue: function(value) {
         this._richEditor.setData(value, function() {
            this._doSetData = false;
         }.bind(this));
      },

      _firstSelect : function(){
         return true;
      },

      _setValueInternal : function(value) {
         if (value === null || value === undefined) {
            value = '';
         } else if (typeof value !== 'string') {
            value = value + '';
         }
         if (this._curval !== value) {
            this._doSetData = true; //Флаг смены данных извне (т.е. не при помощи ввода с клавиатуры)
            this._curval = value;
            if (this._richEditor) {
               if (this._richEditor.status === 'loaded' || this._richEditor.status === 'ready') {
                  this._setRichEditorValue(value);
               } else {
                  this._richEditor.on('instanceReady', function() {
                     this._setRichEditorValue(value);
                  }.bind(this));
               }
            }
         }
      },

      _updateDataReview: function(value) {
         if (this._dataReview) {
            this._dataReview.html(this._options.highlightLinks ? $ws.helpers.wrapURLs($ws.helpers.wrapFiles(value), true) : value);
         }
      },

      _updateSelfContextValue: function(value) {
         if (this._richEditor.status === 'ready' && this._richEditor.document) {
            this._richEditor.dataProcessor.toHtml(value);
         }
         $ws.proto.FieldString.superclass._updateSelfContextValue.apply(this, arguments);
      },

      _onContextValueReceived: function(ctxVal) {
         if (ctxVal !== null) {
            $ws.proto.FieldRichEditor.superclass._onContextValueReceived.apply(this, arguments);
         }
      },

      setActive: function(active) {
         //Ниже хак для IPad: чтобы клавиатура убиралась при потере фокуса ставим фокус сначала на инпут, потом на див и потом вообще снимаем фокус
         if ($ws._const.browser.isMobileSafari && !active) {
            this._hackInput.focus();
            this._hackDiv.focus();
            this._hackDiv.blur();
         }
         $ws.proto.FieldRichEditor.superclass.setActive.apply(this, arguments);
      },

      destroy: function() {
         this._richEditor && this._richEditor.destroy();
         //Вызываем destroy у созданных дочерних контролов
         for (var i in this._instances) {
            this._instances[i].destroy instanceof Function && this._instances[i].destroy();
         }
         $ws.proto.FieldRichEditor.superclass.destroy.apply(this, arguments);
      },

      _dotTplFn: dotTplFn

   });

   return $ws.proto.FieldRichEditor;

});