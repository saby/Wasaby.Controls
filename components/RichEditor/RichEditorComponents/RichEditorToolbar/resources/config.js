define('js!SBIS3.CONTROLS.RichEditorToolbar/resources/config',
   [
   "Core/constants",
   'js!SBIS3.CONTROLS.RichEditorToolbar/resources/handlers',
   "js!SBIS3.CONTROLS.RichTextArea/resources/smiles",
   "i18n!SBIS3.CONTROLS.RichEditor"
], function (constants, handlers, smiles) {

   'use strict';

   return function () {
      return [
      {
         name: 'undo',
         componentType: 'WSControls/Buttons/Button',
         tooltip: rk('Шаг назад'),
          className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
         icon: 'sprite:icon-24 icon-Undo2 icon-primary',
         handlers: {
            onActivated: handlers.undo
         },
         enabled: false,
         order: 10
      },

      {
         name: 'redo',
         componentType: 'WSControls/Buttons/Button',
         tooltip: rk('Шаг вперед'),
         className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
         icon: 'sprite:icon-24 icon-Redo2 icon-primary',
         handlers: {
            onActivated: handlers.redo
         },
         enabled: false,
         order: 10
      },
      {
         name: 'styles',
         componentType: 'WSControls/Buttons/Button',
         tooltip: rk('Стили'),
         icon: 'sprite:icon-24 icon-TFCurtailRTE2 icon-primary',
         className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
         handlers: {
            onActivated: handlers.styles
         },
         visible: false,
         order: 25
      },
      {
         name: 'style',
         componentType: 'SBIS3.CONTROLS.ComboBox',
         items: [
            { key: 'mainText', title: rk('Основной') },
            { key: 'title', title: rk('Заголовок'), className: 'titleText'},
            { key: 'subTitle', title: rk('Подзаголовок'),  className: 'subTitleText' },
            { key: 'additionalText', title: rk('Дополнительный'), className: 'additionalText' }
         ],
         pickerClassName: 'controls-RichEditorToolbar__stylePicker',
         idProperty: 'key',
         selectedKey: 'mainText',
         editable: false,
         handlers: {
            onSelectedItemChange: handlers.style
         },
         order: 20
      },

      {
         name: 'bold',
         componentType: 'WSControls/Buttons/ToggleButton',
         className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
         tooltip: rk('Полужирный'),
         icon: 'sprite:icon-24 icon-Bold icon-primary',
         handlers: {
            onActivated: handlers.bold
         },
         order: 30
      },

      {
         name: 'italic',
         componentType: 'WSControls/Buttons/ToggleButton',
         className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
         tooltip: rk('Курсив'),
         icon: 'sprite:icon-24 icon-Italic icon-primary',
         handlers: {
            onActivated: handlers.italic
         },
         order: 40
      },

      {
         name: 'underline',
         componentType: 'WSControls/Buttons/ToggleButton',
         className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
         tooltip: rk('Подчеркнутый'),
         icon: 'sprite:icon-24 icon-Underline icon-primary',
         handlers: {
            onActivated: handlers.underline
         },
         order: 50
      },

      {
         name: 'strikethrough',
         componentType: 'WSControls/Buttons/ToggleButton',
         className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
         tooltip: rk('Зачеркнутый'),
         icon: 'sprite:icon-24 icon-Stroked icon-primary',
         handlers: {
            onActivated: handlers.strikethrough
         },
         order: 60
      },

      {
         name: 'mceBlockQuote',
         componentType: 'WSControls/Buttons/ToggleButton',
         className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
         tooltip: rk('Цитата'),
         icon: 'sprite:icon-24 icon-Quote icon-primary',
         handlers: {
            onActivated: handlers.mceBlockQuote
         },
         order: 65
      },

      {
         name: 'align',
         componentType: 'WSControls/Buttons/MenuButton',
         tooltip: rk('Выравнивание текста'),
         items: [
            { key: 'alignleft',title: ' ', tooltip: rk('По левому краю'), icon: 'icon-24 icon-AlignmentLeft icon-primary'},
            { key: 'aligncenter', title: ' ',tooltip: rk('По центру'), icon: 'icon-24 icon-AlignmentCenter icon-primary'},
            { key: 'alignright',title: ' ', tooltip: rk('По правому краю'), icon: 'icon-24 icon-AlignmentRight icon-primary'},
            { key: 'alignjustify', title: ' ',tooltip: rk('По ширине'), icon: 'icon-24 icon-AlignmentWidth icon-primary'}
         ],
         idProperty: 'key',
         editable: false,
         icon: 'icon-24 icon-AlignmentLeft icon-primary',
         selectedKey: 'alignleft',
         className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
         pickerClassName: 'controls-RichEditorToolbarMenu controls-MenuIcon__Menu controls-Menu__hide-menu-header',
         handlers: {
            onMenuItemActivate: handlers.align
         },
         pickerConfig: {
            verticalAlign: {
               side: "top",
               offset: 2 //border
            },
            horizontalAlign: {
               side: "left",
               offset: 6
            }
         },
         order: 80
      },

      {
         name: 'color',
         componentType: 'WSControls/Buttons/MenuButton',
         tooltip: rk('Цвет текста'),
         icon: 'sprite:icon-24 icon-LetterA icon-primary',
         className: 'fre-color controls-ToggleButton__square controls-ToggleButton-square__medium',
         pickerClassName: 'fre-color controls-MenuIcon__Menu controls-Menu__hide-menu-header',
         items: [
            { key: 'black', tooltip: rk('Черный'), title: '<div  unselectable ="on" class="controls-RichEditorToolbar__color controls-RichEditorToolbar__colorBlack"></div>'},
            { key: 'red', tooltip: rk('Красный'), title: '<div  unselectable ="on" class="controls-RichEditorToolbar__color controls-RichEditorToolbar__colorRed"></div>' },
            { key: 'green', tooltip: rk('Зеленый'),title: '<div  unselectable ="on" class="controls-RichEditorToolbar__color controls-RichEditorToolbar__colorGreen"></div>' },
            { key: 'blue', tooltip: rk('Синий'),  title: '<div  unselectable ="on" class="controls-RichEditorToolbar__color controls-RichEditorToolbar__colorBlue"></div>' },
            { key: 'purple', tooltip: rk('Пурпурный'), title: '<div  unselectable ="on" class="controls-RichEditorToolbar__color controls-RichEditorToolbar__colorPurple"></div>' },
            { key: 'grey', tooltip: rk('Серый'), title: '<div  unselectable ="on" class="controls-RichEditorToolbar__color controls-RichEditorToolbar__colorGrey"></div>' }
         ],
         handlers: {
            onMenuItemActivate: handlers.color
         },
         pickerConfig: {
             verticalAlign: {
                 side: "top",
                 offset: 2 //border
             },
            horizontalAlign: {
               side: "left",
               offset: 6
            }
         },
         order: 70
      },

      {
         name: 'list',
         componentType: 'WSControls/Buttons/MenuButton',
         tooltip: rk('Вставить/Удалить список'),
         className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
         pickerClassName: 'fre-list controls-RichEditorToolbarMenu controls-MenuIcon__Menu controls-Menu__hide-menu-header',
         icon   : 'sprite:icon-24 icon-ListMarked icon-primary',
         items: [
            { key: 'InsertUnorderedList', title: ' ', icon:'sprite:icon-24 icon-ListMarked icon-primary' },
            { key: 'InsertOrderedList', title: ' ',icon:'sprite:icon-24 icon-ListNumbered icon-primary' }
         ],
         idProperty: 'key',
         handlers: {
            onMenuItemActivate: handlers.list
         },
         pickerConfig: {
            verticalAlign: {
               side: "top",
               offset: 2 //border
            },
            horizontalAlign: {
               side: "left",
               offset: 6
            }
         },
         order: 90
      },

      {
         name: 'link',
         componentType: 'WSControls/Buttons/ToggleButton',
         className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
         tooltip: rk('Вставить/редактировать ссылку'),
         icon: 'sprite:icon-24 icon-Link icon-primary',
         handlers:{
            onActivated: handlers.link
         },
         visible: true,
         order: 100
      },

      {
         name: 'unlink',
         componentType: 'WSControls/Buttons/Button',
         tooltip: rk('Убрать ссылку'),
         icon: 'sprite:icon-24 icon-Unlink icon-primary',
         className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
         handlers: {
            onActivated: handlers.unlink
         },
         enabled: false,
         visible: true,
         order: 110
      },

      {
         name: 'image',
         componentType: 'WSControls/Buttons/Button',
         icon: 'sprite:icon-24 icon-Picture icon-primary',
         tooltip: rk('Вставить изображение'),
         className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
         handlers: {
            onActivated: handlers.image
         },
         order: 140
      },

      {
         name: 'smile',
         tooltip: rk('Вставить смайлик'),
         componentType: 'WSControls/Buttons/MenuButton',
         icon: 'sprite:icon-24 icon-SmileBtr icon-primary',
         pickerClassName: 'controls-RichEditorToolbar__smilesPicker controls-Menu__hide-menu-header controls-MenuButton__Menu',
         className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
         items: smiles,
         handlers: {
            onMenuItemActivate: handlers.smile
         },
         idProperty: 'key',
         visible: false,
         order: 150
      },

      {
         name: 'paste',
         componentType: 'WSControls/Buttons/MenuButton',
         className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
         pickerClassName: 'controls-MenuButton__Menu',
         caption: rk('Вставка'),
         tooltip: rk('Вставка'),
         icon: 'sprite:icon-24 icon-PasteBtr icon-primary',
         pickerConfig: {
            verticalAlign: {
               side: "top",
               offset: 2
            },
            horizontalAlign: {
               side: "left",
               offset: -10
            }
         },
         items: [
            { key: 'style', title: 'С сохранением стилей', icon:'sprite:icon-24 icon-PasteStyle icon-primary' },
            { key: 'empty', title: 'Без форматирования',icon:'sprite:icon-24 icon-PasteAsText icon-primary' }
         ],
         handlers: {
            onMenuItemActivate: handlers.paste
         },
         idProperty: 'key',
         visible: !constants.browser.isMobilePlatform && !constants.browser.isMacOSDesktop,
         order: 120
      },

      {
         name: 'source',
         componentType: 'WSControls/Buttons/ToggleButton',
         className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
         tooltip: rk('html-разметка'),
         icon: 'sprite:icon-24 icon-Html icon-primary',
         handlers: {
            onActivated: handlers.source
         },
         order: 160
      },
      {
         name: 'history',
         caption: rk('История ввода'),
         componentType: 'WSControls/Buttons/MenuButton',
         pickerClassName: 'controls-MenuIcon__Menu',
         icon: 'sprite:icon-24 icon-InputHistory icon-primary',
         multiselect: false,
         className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
         handlers: {
            onMenuItemActivate: handlers.history
         },
         idProperty: 'key',
         pickerConfig: {
            verticalAlign: {
               side: "top",
               offset: 2
            },
            horizontalAlign: {
               side: "left",
               offset: -10
            }
         },
         visible:false,
         order: 160
      },
      {
         name: 'codesample',
         tooltip: rk('Вставка кода'),
         componentType: 'WSControls/Buttons/Button',
         icon: 'sprite:icon-24 icon-PasteCodeBtr icon-primary',
         multiselect: false,
         className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
         handlers: {
            onActivated: handlers.codesample
         },
         visible: false,//!constants.browser.isMobilePlatform && !constants.browser.isMacOSDesktop,
         order: 130
      }
   ];
   };
});