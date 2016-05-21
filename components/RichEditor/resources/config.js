define('js!SBIS3.CONTROLS.RichEditor/resources/config', ['i18n!js!SBIS3.CONTROLS.RichEditor'], function () {

   'use strict';

   var
      ICONS = {
         alignleft           : 'icon-16 icon-AlignmentLeft icon-primary',
         aligncenter         : 'icon-16 icon-AlignmentCenter icon-primary',
         alignright          : 'icon-16 icon-AlignmentRight icon-primary',
         alignjustify        : 'icon-16 icon-AlignmentWidth icon-primary',
         table               : 'icon-16 icon-Table icon-primary',
         history             : 'icon-16 icon-InputHistory icon-primary'
      },
      blankImgPath = 'https://cdn.sbis.ru/richeditor/26-01-2015/blank.png',
      widthDropdownIcon = 18,
      onButtonClick = function() {
         this._options.fieldRichEditor.execCommand(this._options.name);
      },
      renderDropdownTitle = function(onlyIcon) {
         return onlyIcon ?
            function(key, value) {
               return $('<div class="controls-RichEditor__DropdownText controls-RichEditor__' + key + '" style="width: ' +
                  (this._options.width - widthDropdownIcon) + 'px;"><div class="controls-RichEditor__DropdownIcon ' + ICONS[key] + '" title="' + value + '" value="' + key + '"></div></div>');
            } :
            function(key, value) {
               return $('<div class="controls-RichEditor__DropdownText controls-RichEditor__styleText-' + key + '" style="width: ' +
                  (this._options.width - widthDropdownIcon) + 'px;" value="' + key + '">' + value + '</div>');
            };
      },
      renderDropdownValue = function(onlyIcon) {
         return onlyIcon ?
            function(key, value) {
               return $('<div class="controls-RichEditor__' + key + '"><div class="controls-RichEditor__DropdownIcon ' + ICONS[key] + '"title="' + value + '" value="' + key + '"></div></div>');
            } :
            function(key, value) {
               return $('<div class="controls-RichEditor__styleText-' + key + '" value="' + key + '">' + value + '</div>');
            };
      },
      renderSmile = function(key, name){
         return '<img class="ws-fre__smile smile' + key + '" data-mce-resize="false" src="'+blankImgPath+'" title="' + name + '" />';
      },
      onChangeValue = function(event, value) {
         //при вставке таблиц в будующем тоже не забываем менять источник смены значения
         this._options.fieldRichEditor._changeValueFromSetText = false;
         this._options.fieldRichEditor._checkFocus();
         this._options.fieldRichEditor._tinyEditor.execCommand(value);
      };

   return {
      undo : {
         type: 'button',
         config: {
            caption: '',
            tooltip: rk('Шаг назад'),
            icon: 'sprite:icon-16 icon-Undo2 icon-primary',
            handlers: {
               onActivated: onButtonClick
            },
            visible: true,
            enabled: false
         }
      },
      redo : {
         type: 'button',
         config: {
            caption: '',
            tooltip: rk('Шаг вперед'),
            icon: 'sprite:icon-16 icon-Redo2 icon-primary',
            handlers: {
               onActivated: onButtonClick
            },
            visible: true,
            enabled: false
         }
      },
     style : {
         type: 'dropdown',
         config: {
            tooltip: rk('Стиль текста'),
            data: [
               { key: 'title', value: rk('Заголовок') },
               { key: 'subTitle', value: rk('Подзаголовок') },
               { key: 'mainText', value: rk('Основной текст') },
               { key: 'selectedMainText', value: rk('Выделенный основной текст') },
               { key: 'additionalText', value: rk('Дополнительный текст') }
            ],
            titleRender: renderDropdownTitle(),
            valueRender: renderDropdownValue(),
            value: 'mainText',
            width: 128,
            visible: true,
            handlers: {
               onChange: function(e, key) {
                  this._options.fieldRichEditor.setFontStyle(key);
               }
            },
            enabled: true
         }
      },
      bold : {
         type: 'ToggleButton',
         config: {
            caption: '',
            tooltip: rk('Полужирный'),
            icon: 'sprite:icon-16 icon-Bold icon-primary',
            handlers: {
               onActivated: onButtonClick
            },
            visible: true,
            enabled: true
         }
      },
      italic : {
         type: 'ToggleButton',
         config: {
            caption: '',
            tooltip: rk('Курсив'),
            icon: 'sprite:icon-16 icon-Italic icon-primary',
            handlers: {
               onActivated: onButtonClick
            },
            visible: true,
            enabled: true
         }
      },
      underline : {
         type: 'ToggleButton',
         config: {
            caption: '',
            tooltip: rk('Подчеркнутый'),
            icon: 'sprite:icon-16 icon-Underline icon-primary',
            handlers: {
               onActivated: onButtonClick
            },
            visible: true,
            enabled: true
         }
      },
      strikethrough : {
         type: 'ToggleButton',
         config: {
            caption: '',
            tooltip: rk('Зачеркнутый'),
            icon: 'sprite:icon-16 icon-Stroked icon-primary',
            handlers: {
               onActivated: onButtonClick
            },
            visible: true,
            enabled: true
         }
      },
      justify : {
         type: 'dropdown',
         config: {
            tooltip: rk('Выравнивание текста'),
            data: [
               { key: 'alignleft', value: rk('По левому краю') },
               { key: 'aligncenter', value: rk('По центру') },
               { key: 'alignright', value: rk('По правому краю') },
               { key: 'alignjustify', value: rk('По ширине') }
            ],
            titleRender: renderDropdownTitle(true),
            valueRender: renderDropdownValue(true),
            handlers: {
               onChange: function(event, value) {
                  this._options.fieldRichEditor._checkFocus();
                  this._options.fieldRichEditor._setTextAlign(value);
               }
            },
            value: 'alignleft',
            width: 38,
            visible: true,
            enabled: true
         }
      },
      textColor : {
         type: 'MenuButton',
         config: {
            tooltip: rk('Цвет текста'),
            withoutHeader: true,
            icon: 'sprite:icon-16 icon-TextColor icon-primary',
            className: 'fre-color',
            pickerClassName: 'fre-color',
            displayField: 'title',
            keyField: 'key',
            items: [
               { key: 'black', value: rk('Черный'), title: '<div  unselectable ="on" class="controls-RichEditor__Color controls-RichEditor__ColorBlack"></div>'},
               { key: 'red', value: rk('Красный'), title: '<div  unselectable ="on" class="controls-RichEditor__Color controls-RichEditor__ColorRed"></div>' },
               { key: 'green', value: rk('Зеленый'),title: '<div  unselectable ="on" class="controls-RichEditor__Color controls-RichEditor__ColorGreen"></div>' },
               { key: 'blue', value: rk('Синий'),  title: '<div  unselectable ="on" class="controls-RichEditor__Color controls-RichEditor__ColorBlue"></div>' },
               { key: 'purple', value: rk('Пурпурный'), title: '<div  unselectable ="on" class="controls-RichEditor__Color controls-RichEditor__ColorPurple"></div>' },
               { key: 'grey', value: rk('Серый'), title: '<div  unselectable ="on" class="controls-RichEditor__Color controls-RichEditor__ColorGrey"></div>' }
            ],
            handlers: {
               onMenuItemActivate: function(event, key) {
                  this._options.fieldRichEditor.setFontColor(key);
               }
            },
            value: 'textColor',
            width: 32,
            visible: true,
            enabled: true
         }
      },
      list : {
         type: 'MenuButton',
         config: {
            tooltip: rk('Вставить/Удалить список'),
            displayField: 'value',
            keyField: 'key',
            withoutHeader: true,
            pickerClassName: 'fre-list',
            icon   : 'sprite:icon-16 icon-ListMarked icon-primary',
            items: [
               { key: 'InsertUnorderedList', value: ' ', icon:'sprite:icon-16 icon-ListMarked icon-primary' },
               { key: 'InsertOrderedList', value: ' ',icon:'sprite:icon-16 icon-ListNumbered icon-primary' }
            ],
            handlers: {
               onMenuItemActivate: function(event, key) {
                     this._options.fieldRichEditor._changeValueFromSetText = false;
                     this._options.fieldRichEditor._tinyEditor.execCommand(key);
               }
            },
            value: 'InsertUnorderedList',
            width: 38,
            visible: true,
            enabled: true
         }
      },
      link : {
         type: 'ToggleButton',
         config: {
            caption: '',
            tooltip: rk('Вставить/редактировать ссылку'),
            icon: 'sprite:icon-16 icon-Link icon-primary',
            handlers:{
               onActivated: function(){
                  this.setChecked(true);
                  this._options.fieldRichEditor.insertLink(function(){
                     this.setChecked(false);
                  }.bind(this), this._container);
               }
            },
            visible: true,
            enabled: true
         }
      },
      unlink : {
         type: 'button',
         config: {
            caption: '',
            tooltip: rk('Убрать ссылку'),
            icon: 'sprite:icon-16 icon-Unlink icon-primary',
            handlers: {
               onActivated: onButtonClick
            },
            visible: true,
            enabled: false
         }
      },
      table : {
         type: 'dropdown',
         config: {
            tooltip: rk('Добавить таблицу'),
            data: [
               { key: 'table', value: rk('Добавить таблицу') }
            ],
            titleRender: renderDropdownTitle(true),
            valueRender: renderDropdownValue(true),
            handlers: {
               onChange: onChangeValue
            },
            value: 'table',
            width: 38,
            visible: false,
            enabled: true
         }
      },
      image : {
         type: 'button',
         config: {
            caption: '',
            tooltip: rk('Вставить картинку'),
            icon: 'sprite:icon-16 icon-Picture icon-primary',
            handlers: {
               onActivated: function(event, originalEvent) {
                  this._options.fieldRichEditor._changeValueFromSetText = false;
                  this._options.fieldRichEditor._getFileLoader().selectFile(originalEvent);
               }
            },
            visible: true,
            enabled: true
         }
      },
      smile : {
         type: 'MenuButton',
         config: {
            tooltip: rk('Смайлики'),
            icon: 'sprite:icon-16 icon-EmoiconSmile icon-primary',
            pickerClassName: 'fre-smiles',
            className: 'fre-smiles',
            displayField: 'title',
            keyField: 'key',
            items: [
               { key: 'Smile', value: rk('улыбка'), title: renderSmile('Smile',rk('улыбка')) },
               { key: 'Nerd', value: rk('умник'), title: renderSmile('Nerd',rk('умник')) },
               { key: 'Angry', value: rk('злой'), title: renderSmile('Angry',rk('злой')) },
               { key: 'Annoyed', value: rk('раздраженный'), title: renderSmile('Annoyed',rk('раздраженный')) },
               { key: 'Blind', value: rk('слепой'), title: renderSmile('Blind',rk('слепой')) },
               { key: 'Cool', value: rk('крутой'), title: renderSmile('Cool',rk('крутой')) },
               { key: 'Cry', value: rk('плачет'), title: renderSmile('Cry',rk('плачет')) },
               { key: 'Devil', value: rk('дьявол'), title: renderSmile('Devil',rk('дьявол')) },
               { key: 'Dumb', value: rk('тупица'), title: renderSmile('Dumb',rk('тупица')) },
               { key: 'Inlove', value: rk('влюблен'), title: renderSmile('Inlove',rk('влюблен')) },
               { key: 'Kiss', value: rk('поцелуй') , title: renderSmile('Kiss',rk('поцелуй'))},
               { key: 'Laugh', value: rk('смеётся'), title: renderSmile('Laugh',rk('смеётся'))},
               { key: 'Money', value: rk('алчный'), title: renderSmile('Money',rk('алчный')) },
               { key: 'Neutral', value: rk('нейтральный'), title: renderSmile('Neutral',rk('нейтральный')) },
               { key: 'Puzzled', value: rk('недоумевает'), title: renderSmile('Puzzled',rk('недоумевает')) },
               { key: 'Rofl', value: rk('подстолом'), title: renderSmile('Rofl',rk('улыбка')) },
               { key: 'Sad', value: rk('расстроен'), title: renderSmile('Sad',rk('расстроен')) },
               { key: 'Shocked', value: rk('шокирован'), title: renderSmile('Shocked',rk('шокирован')) },
               { key: 'Snooze', value: rk('дремлет'), title: renderSmile('Snooze',rk('дремлет')) },
               { key: 'Tongue', value: rk('дразнит'), title: renderSmile('Tongue',rk('дразнит')) },
               { key: 'Wink', value: rk('подмигивает'), title: renderSmile('Wink',rk('подмигивает')) },
               { key: 'Yawn', value: rk('зевает'), title: renderSmile('Yawn',rk('зевает')) }
            ],
            handlers: {
               onMenuItemActivate: function(event, key) {
                  this._options.fieldRichEditor.insertSmile(key);
               }
            },
            value: 'Smile',
            width: 43,
            visible: false,
            enabled: true
         }
      },
      pasteFormatedText : {
         type: 'ToggleButton',
         config: {
            caption: '',
            tooltip: rk('Вставить с учётом стилей'),
            icon: 'sprite:icon-16 icon-PasteStyle icon-primary',
            handlers: {
               onActivated: function() {
                  var self = this;
                  this.setChecked(true);
                  this._options.fieldRichEditor._changeValueFromSetText = false;
                  this._options.fieldRichEditor.pasteFromBufferWithStyles(function() {
                     self.setChecked(false);
                  }, this._container);
               }
            },
            visible: !$ws._const.browser.isMobilePlatform && !$ws._const.browser.isMacOSDesktop,
            enabled: true
         }
      },
     history : {
         type: 'MenuButton',
         config: {
            tooltip: rk('История ввода'),
            displayField: 'title',
            keyField: 'key',
            pickerClassName: 'controls-RichEditor__History',
            className: 'controls-RichEditor__History',
            icon: 'sprite:icon-16 icon-InputHistory icon-primary',
            handlers: {
               onMenuItemActivate: function(event, key) {
                  var
                     value = this.getItems().getRawData()[key].value;
                  this._options.fieldRichEditor.setValue(value);
               },
               onInit: function() {
                  var fre = this._options.fieldRichEditor;
                  fre._tinyReady.addCallback(function () {
                     fre._fillHistory();
                  });
               }
            },
            showSelectedInList: false,
            value: 'history',
            width: 26,
            visible: false,
            enabled: false
         }
      },
      source : {
         type: 'ToggleButton',
         config: {
            caption: '',
            tooltip: rk('html-разметка'),
            icon: 'sprite:icon-16 icon-Html icon-primary',
            handlers: {
               onActivated: function() {
                  this._options.fieldRichEditor._toggleContentSource();
               }
            },
            visible: true,
            enabled: true
         }
      }
   };
});