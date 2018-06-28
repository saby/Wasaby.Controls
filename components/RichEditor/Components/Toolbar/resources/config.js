define('SBIS3.CONTROLS/RichEditor/Components/Toolbar/resources/config',
   [
      'Core/constants',
      'SBIS3.CONTROLS/RichEditor/Components/Toolbar/resources/handlers',
      'SBIS3.CONTROLS/RichEditor/Components/RichTextArea/resources/smiles',
      'i18n!SBIS3.CONTROLS/RichEditor'
   ], function(constants, handlers, smiles) {

      'use strict';

      return function() {
         return [
            {
               name: 'undo',
               componentType: 'SBIS3.CONTROLS/WSControls/Buttons/Button',
               tooltip: rk('Шаг назад'),
               className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
               icon: 'sprite:icon-24 icon-Undo2 icon-primary',
               handlers: {
                  onActivated: handlers.undo
               },
               enabled: false,
               order: 10,
               tabindex: 0
            },

            {
               name: 'redo',
               componentType: 'SBIS3.CONTROLS/WSControls/Buttons/Button',
               tooltip: rk('Шаг вперед'),
               className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
               icon: 'sprite:icon-24 icon-Redo2 icon-primary',
               handlers: {
                  onActivated: handlers.redo
               },
               enabled: false,
               order: 10,
               tabindex: 0
            },
            {
               name: 'styles',
               componentType: 'SBIS3.CONTROLS/WSControls/Buttons/Button',
               tooltip: rk('Стили'),
               icon: 'sprite:icon-24 icon-TFCurtailRTE2 icon-primary',
               className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
               handlers: {
                  onActivated: handlers.styles
               },
               visible: false,
               order: 25,
               tabindex: 0
            },
            {
               name: 'style',
               componentType: 'SBIS3.CONTROLS/ComboBox',
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
               order: 20,
               tabindex: 0
            },

            {
               name: 'bold',
               componentType: 'SBIS3.CONTROLS/WSControls/Buttons/ToggleButton',
               className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
               tooltip: rk('Полужирный'),
               icon: 'sprite:icon-24 icon-Bold icon-primary',
               handlers: {
                  onActivated: handlers.bold
               },
               order: 30,
               tabindex: 0
            },

            {
               name: 'italic',
               componentType: 'SBIS3.CONTROLS/WSControls/Buttons/ToggleButton',
               className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
               tooltip: rk('Курсив'),
               icon: 'sprite:icon-24 icon-Italic icon-primary',
               handlers: {
                  onActivated: handlers.italic
               },
               order: 40,
               tabindex: 0
            },

            {
               name: 'underline',
               componentType: 'SBIS3.CONTROLS/WSControls/Buttons/ToggleButton',
               className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
               tooltip: rk('Подчеркнутый'),
               icon: 'sprite:icon-24 icon-Underline icon-primary',
               handlers: {
                  onActivated: handlers.underline
               },
               order: 50,
               tabindex: 0
            },

            {
               name: 'strikethrough',
               componentType: 'SBIS3.CONTROLS/WSControls/Buttons/ToggleButton',
               className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
               tooltip: rk('Зачеркнутый'),
               icon: 'sprite:icon-24 icon-Stroked icon-primary',
               handlers: {
                  onActivated: handlers.strikethrough
               },
               order: 60,
               tabindex: 0
            },

            {
               name: 'blockquote',
               componentType: 'SBIS3.CONTROLS/WSControls/Buttons/ToggleButton',
               className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
               tooltip: rk('Цитата'),
               icon: 'sprite:icon-24 icon-Quote icon-primary',
               handlers: {
                  onActivated: handlers.blockquote
               },
               order: 65,
               tabindex: 0
            },

            {
               name: 'align',
               componentType: 'SBIS3.CONTROLS/WSControls/Buttons/MenuButton',
               tooltip: rk('Выравнивание текста'),
               items: [
                  { key: 'alignleft', title: ' ', tooltip: rk('По левому краю'), icon: 'icon-24 icon-AlignmentLeft icon-primary'},
                  { key: 'aligncenter', title: ' ', tooltip: rk('По центру'), icon: 'icon-24 icon-AlignmentCenter icon-primary'},
                  { key: 'alignright', title: ' ', tooltip: rk('По правому краю'), icon: 'icon-24 icon-AlignmentRight icon-primary'},
                  { key: 'alignjustify', title: ' ', tooltip: rk('По ширине'), icon: 'icon-24 icon-AlignmentWidth icon-primary'}
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
                     side: 'top',
                     offset: 2 //border
                  },
                  horizontalAlign: {
                     side: 'left',
                     offset: 6
                  }
               },
               order: 80,
               tabindex: 0
            },

            {
               name: 'color',
               componentType: 'SBIS3.CONTROLS/WSControls/Buttons/MenuButton',
               tooltip: rk('Цвет текста'),
               icon: 'sprite:icon-24 icon-LetterA icon-primary',
               className: 'fre-color controls-ToggleButton__square controls-ToggleButton-square__medium',
               pickerClassName: 'fre-color controls-MenuIcon__Menu controls-Menu__hide-menu-header',
               items: [
                  { key: 'black', tooltip: rk('Черный'), title: '<div  unselectable ="on" class="controls-RichEditorToolbar__color controls-RichEditorToolbar__colorBlack"></div>'},
                  { key: 'red', tooltip: rk('Красный'), title: '<div  unselectable ="on" class="controls-RichEditorToolbar__color controls-RichEditorToolbar__colorRed"></div>' },
                  { key: 'green', tooltip: rk('Зеленый'), title: '<div  unselectable ="on" class="controls-RichEditorToolbar__color controls-RichEditorToolbar__colorGreen"></div>' },
                  { key: 'blue', tooltip: rk('Синий'),  title: '<div  unselectable ="on" class="controls-RichEditorToolbar__color controls-RichEditorToolbar__colorBlue"></div>' },
                  { key: 'purple', tooltip: rk('Пурпурный'), title: '<div  unselectable ="on" class="controls-RichEditorToolbar__color controls-RichEditorToolbar__colorPurple"></div>' },
                  { key: 'grey', tooltip: rk('Серый'), title: '<div  unselectable ="on" class="controls-RichEditorToolbar__color controls-RichEditorToolbar__colorGrey"></div>' }
               ],
               handlers: {
                  onMenuItemActivate: handlers.color
               },
               pickerConfig: {
                  verticalAlign: {
                     side: 'top',
                     offset: 2 //border
                  },
                  horizontalAlign: {
                     side: 'left',
                     offset: 6
                  }
               },
               order: 70,
               tabindex: 0
            },

            {
               name: 'list',
               componentType: 'SBIS3.CONTROLS/WSControls/Buttons/MenuButton',
               tooltip: rk('Вставить/Удалить список'),
               className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
               pickerClassName: 'fre-list controls-RichEditorToolbarMenu controls-MenuIcon__Menu controls-Menu__hide-menu-header',
               icon: 'sprite:icon-24 icon-ListMarked icon-primary',
               items: [
                  { key: 'InsertUnorderedList', title: ' ', icon: 'sprite:icon-24 icon-ListMarked icon-primary' },
                  { key: 'InsertOrderedList', title: ' ', icon: 'sprite:icon-24 icon-ListNumbered icon-primary' }
               ],
               idProperty: 'key',
               handlers: {
                  onMenuItemActivate: handlers.list
               },
               pickerConfig: {
                  verticalAlign: {
                     side: 'top',
                     offset: 2 //border
                  },
                  horizontalAlign: {
                     side: 'left',
                     offset: 6
                  }
               },
               order: 90,
               tabindex: 0
            },

            {
               name: 'link',
               componentType: 'SBIS3.CONTROLS/WSControls/Buttons/ToggleButton',
               className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
               tooltip: rk('Вставить/редактировать ссылку'),
               icon: 'sprite:icon-24 icon-Link icon-primary',
               handlers: {
                  onActivated: handlers.link
               },
               visible: true,
               order: 100,
               tabindex: 0
            },

            {
               name: 'unlink',
               componentType: 'SBIS3.CONTROLS/WSControls/Buttons/Button',
               tooltip: rk('Убрать ссылку'),
               icon: 'sprite:icon-24 icon-Unlink icon-primary',
               className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
               handlers: {
                  onActivated: handlers.unlink
               },
               enabled: false,
               visible: true,
               order: 110,
               tabindex: 0
            },

            {
               name: 'image',
               componentType: 'SBIS3.CONTROLS/WSControls/Buttons/Button',
               icon: 'sprite:icon-24 icon-PicBtr icon-primary',
               tooltip: rk('Вставить изображение'),
               className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
               handlers: {
                  onInit: handlers.checkImageLoader,
                  onActivated: handlers.image
               },
               order: 140,
               tabindex: 0
            },

            {
               name: 'smile',
               tooltip: rk('Вставить смайлик'),
               componentType: 'SBIS3.CONTROLS/WSControls/Buttons/MenuButton',
               icon: 'sprite:icon-24 icon-SmileBtr icon-primary',
               pickerClassName: 'controls-RichEditorToolbar__smilesPicker controls-Menu__hide-menu-header controls-MenuButton__Menu',
               className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
               items: smiles,
               handlers: {
                  onMenuItemActivate: handlers.smile
               },
               idProperty: 'key',
               visible: false,
               order: 150,
               tabindex: 0
            },

            {
               name: 'paste',
               componentType: 'SBIS3.CONTROLS/WSControls/Buttons/MenuButton',
               className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
               pickerClassName: 'controls-RichEditorToolbar_Menu',
               caption: rk('Вставка'),
               tooltip: rk('Вставка'),
               icon: 'sprite:icon-24 icon-PasteBtr icon-primary',
               pickerConfig: {
                  verticalAlign: {
                     side: 'top',
                     offset: 2
                  },
                  horizontalAlign: {
                     side: 'left',
                     offset: -10
                  }
               },
               items: [
                  { key: 'style', title: rk('С сохранением стилей'), icon: 'sprite:icon-24 icon-PasteStyle icon-primary' },
                  { key: 'empty', title: rk('Без форматирования'), icon: 'sprite:icon-24 icon-PasteAsText icon-primary' }
               ],
               handlers: {
                  onMenuItemActivate: handlers.paste
               },
               idProperty: 'key',
               visible: !constants.browser.isMobilePlatform && !constants.browser.isMacOSDesktop,
               order: 120,
               tabindex: 0
            },

            {
               name: 'source',
               componentType: 'SBIS3.CONTROLS/WSControls/Buttons/ToggleButton',
               className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
               tooltip: rk('html-разметка'),
               icon: 'sprite:icon-24 icon-Html icon-primary',
               handlers: {
                  onActivated: handlers.source
               },
               order: 160,
               tabindex: 0
            },
            {
               name: 'history',
               caption: rk('История ввода'),
               componentType: 'SBIS3.CONTROLS/WSControls/Buttons/MenuButton',
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
                     side: 'top',
                     offset: 2
                  },
                  horizontalAlign: {
                     side: 'left',
                     offset: -10
                  }
               },
               visible: false,
               order: 160,
               tabindex: 0
            },
            {
               name: 'codesample',
               tooltip: rk('Вставка кода'),
               componentType: 'SBIS3.CONTROLS/WSControls/Buttons/Button',
               icon: 'sprite:icon-24 icon-PasteCodeBtr icon-primary',
               multiselect: false,
               className: 'controls-ToggleButton__square controls-ToggleButton-square__medium',
               handlers: {
                  onActivated: handlers.codesample
               },
               visible: false, //!constants.browser.isMobilePlatform && !constants.browser.isMacOSDesktop,
               order: 130,
               tabindex: 0
            }
         ];
      };
   });
