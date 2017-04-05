define('js!SBIS3.CONTROLS.RichEditorToolbar/resources/config',
   [
   "Core/constants",
   "js!SBIS3.CONTROLS.RichTextArea/resources/smiles",
   "i18n!SBIS3.CONTROLS.RichEditor"
], function ( constants,smiles) {

   'use strict';

   var
      onButtonClick = function() {
         this.getParent()._execCommand(this._options.name);
      };

   return [
       {
         name: 'undo',
         componentType: 'SBIS3.CONTROLS.Button',
         tooltip: rk('Шаг назад'),
         icon: 'sprite:icon-16 icon-Undo2 icon-primary',
         handlers: {
            onActivated: onButtonClick
         },
         enabled: false,
         order: 10
      },

      {
         name: 'redo',
         componentType: 'SBIS3.CONTROLS.Button',
         tooltip: rk('Шаг вперед'),
         icon: 'sprite:icon-16 icon-Redo2 icon-primary',
         handlers: {
            onActivated: onButtonClick
         },
         enabled: false,
         order: 10
      },

      {
         name: 'style',
         componentType: 'SBIS3.CONTROLS.RichEditor.RichEditorDropdown',
         items: [
            { key: 'title', title: rk('Заголовок') },
            { key: 'subTitle', title: rk('Подзаголовок') },
            { key: 'mainText', title: rk('Основной текст') },
            { key: 'additionalText', title: rk('Дополнительный текст') },
            { key: 'selectedMainText', title: rk('Выделенный основной текст') }
         ],
         type: 'fastDataFilter',
         selectedKeys: ['mainText'],
         pickerClassName: 'fre-style',
         className: 'fre-style',
         handlers: {
            onSelectedItemsChange: function(e, key) {
               this.getParent()._setFontStyle(key[0]);
            }
         },
         order: 20
      },

      {
         name: 'bold',
         componentType: 'SBIS3.CONTROLS.ToggleButton',
         tooltip: rk('Полужирный'),
         icon: 'sprite:icon-16 icon-Bold icon-primary',
         handlers: {
            onActivated: onButtonClick
         },
         order: 30
      },

      {
         name: 'italic',
         componentType: 'SBIS3.CONTROLS.ToggleButton',
         tooltip: rk('Курсив'),
         icon: 'sprite:icon-16 icon-Italic icon-primary',
         handlers: {
            onActivated: onButtonClick
         },
         order: 40
      },

      {
         name: 'underline',
         componentType: 'SBIS3.CONTROLS.ToggleButton',
         tooltip: rk('Подчеркнутый'),
         icon: 'sprite:icon-16 icon-Underline icon-primary',
         handlers: {
            onActivated: onButtonClick
         },
         order: 50
      },

      {
         name: 'strikethrough',
         componentType: 'SBIS3.CONTROLS.ToggleButton',
         tooltip: rk('Зачеркнутый'),
         icon: 'sprite:icon-16 icon-Stroked icon-primary',
         handlers: {
            onActivated: onButtonClick
         },
         order: 60
      },

      {
         name: 'align',
         componentType: 'SBIS3.CONTROLS.RichEditor.RichEditorDropdown',
         tooltip: rk('Выравнивание текста'),
         items: [
            { key: 'alignleft', title: rk('По левому краю'), icon: 'icon-16 icon-AlignmentLeft icon-primary'},
            { key: 'aligncenter', title: rk('По центру'), icon: 'icon-16 icon-AlignmentCenter icon-primary'},
            { key: 'alignright', title: rk('По правому краю'), icon: 'icon-16 icon-AlignmentRight icon-primary'},
            { key: 'alignjustify', title: rk('По ширине'), icon: 'icon-16 icon-AlignmentWidth icon-primary'}
         ],
         selectedKeys: ['alignleft'],
         pickerClassName: 'fre-align',
         className: 'fre-align',
         handlers: {
            onSelectedItemsChange: function(event, key) {
               this.getParent()._setTextAlign(key[0]);
            }
         },
         order: 70
      },

      {
         name: 'color',
         componentType: 'SBIS3.CONTROLS.RichEditor.RichEditorMenuButton',
         tooltip: rk('Цвет текста'),
         withoutHeader: true,
         icon: 'sprite:icon-16 icon-TextColor icon-primary',
         className: 'fre-color',
         pickerClassName: 'fre-color',
         items: [
            { key: 'black', value: rk('Черный'), title: '<div  unselectable ="on" class="controls-RichEditorToolbar__color controls-RichEditorToolbar__colorBlack"></div>'},
            { key: 'red', value: rk('Красный'), title: '<div  unselectable ="on" class="controls-RichEditorToolbar__color controls-RichEditorToolbar__colorRed"></div>' },
            { key: 'green', value: rk('Зеленый'),title: '<div  unselectable ="on" class="controls-RichEditorToolbar__color controls-RichEditorToolbar__colorGreen"></div>' },
            { key: 'blue', value: rk('Синий'),  title: '<div  unselectable ="on" class="controls-RichEditorToolbar__color controls-RichEditorToolbar__colorBlue"></div>' },
            { key: 'purple', value: rk('Пурпурный'), title: '<div  unselectable ="on" class="controls-RichEditorToolbar__color controls-RichEditorToolbar__colorPurple"></div>' },
            { key: 'grey', value: rk('Серый'), title: '<div  unselectable ="on" class="controls-RichEditorToolbar__color controls-RichEditorToolbar__colorGrey"></div>' }
         ],
         handlers: {
            onMenuItemActivate: function(event, key) {
               this.getParent()._setFontColor(key);
            }
         },
         order: 80
      },

      {
         name: 'list',
         componentType: 'SBIS3.CONTROLS.RichEditor.RichEditorMenuButton',
         tooltip: rk('Вставить/Удалить список'),
         withoutHeader: true,
         pickerClassName: 'fre-list',
         icon   : 'sprite:icon-16 icon-ListMarked icon-primary',
         items: [
            { key: 'InsertUnorderedList', title: ' ', icon:'sprite:icon-16 icon-ListMarked icon-primary' },
            { key: 'InsertOrderedList', title: ' ',icon:'sprite:icon-16 icon-ListNumbered icon-primary' }
         ],
         handlers: {
            onMenuItemActivate: function(event, key) {
               this.getParent()._execCommand(key);
            }
         },
         order: 90
      },

      {
         name: 'link',
         componentType: 'SBIS3.CONTROLS.ToggleButton',
         tooltip: rk('Вставить/редактировать ссылку'),
         icon: 'sprite:icon-16 icon-Link icon-primary',
         handlers:{
            onActivated: function(){
               this.setChecked(true);
               this.getParent()._insertLink(function(){
                  this.setChecked(false);
               }.bind(this), this._container);
            }
         },
         visible: true,
         order: 100
      },

      {
         name: 'unlink',
         componentType: 'SBIS3.CONTROLS.Button',
         tooltip: rk('Убрать ссылку'),
         icon: 'sprite:icon-16 icon-Unlink icon-primary',
         handlers: {
            onActivated: onButtonClick
         },
         enabled: false,
         visible: true,
         order: 110
      },

      {
         name: 'image',
         componentType: 'SBIS3.CONTROLS.Button',
         icon: 'sprite:icon-16 icon-Picture icon-primary',
         tooltip: 'Вставить изображение',
         handlers: {
            onActivated: function() {
               this.getParent()._openImagePanel(this);
            }
         },
         order: 120
      },

      {
         name: 'smile',
         componentType: 'SBIS3.CONTROLS.RichEditor.RichEditorMenuButton',
         icon: 'sprite:icon-16 icon-EmoiconSmile icon-primary',
         pickerClassName: 'fre-smiles',
         className: 'fre-smiles',
         items: smiles,
         handlers: {
            onMenuItemActivate: function(event, key) {
               this.getParent()._insertSmile(key);
            }
         },
         visible: false,
         order: 130
      },

      {
         name: 'paste',
         componentType: 'SBIS3.CONTROLS.ToggleButton',
         tooltip: rk('Вставить с учётом стилей'),
         icon: 'sprite:icon-16 icon-PasteStyle icon-primary',
         handlers: {
            onActivated: function() {
               var self = this;
               this.setChecked(true);
               this.getParent()._pasteFromBufferWithStyles(function() {
                  self.setChecked(false);
               }, this._container);
            }
         },
         visible: !constants.browser.isMobilePlatform && !constants.browser.isMacOSDesktop,
         order: 140
      },

      {
         name: 'source',
         componentType: 'SBIS3.CONTROLS.ToggleButton',
         tooltip: rk('html-разметка'),
         icon: 'sprite:icon-16 icon-Html icon-primary',
         handlers: {
            onActivated: function() {
               this.getParent()._toggleContentSource();
            }
         },
         order: 150
      }
   ];
});