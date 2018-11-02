define('Controls/Input/RichEditor/Toolbar/buttonConstants', [], function() {
   /**
    * Module with default toolbar's buttons' constants
    */

   return {
      BOLD: {
         id: 'bold',
         showType: 2,
         template: 'wml!Controls/Input/RichEditor/Toolbar/templates/formatButton',
         title: rk('Полужирный'),
         icon: 'Bold',
         format: 'bold'
      },
      ITALIC: {
         id: 'italic',
         showType: 2,
         template: 'wml!Controls/Input/RichEditor/Toolbar/templates/formatButton',
         title: rk('Курсивный'),
         icon: 'Italic',
         format: 'italic'
      },
      UNDERLINE: {
         id: 'underline',
         showType: 2,
         template: 'wml!Controls/Input/RichEditor/Toolbar/templates/formatButton',
         title: rk('Подчеркнутый'),
         icon: 'Underline',
         format: 'underline'
      },
      STROKED: {
         id: 'stroked',
         showType: 2,
         template: 'wml!Controls/Input/RichEditor/Toolbar/templates/formatButton',
         title: rk('Зачеркнутый'),
         icon: 'Stroked',
         format: 'strikethrough'
      },
      BLOCKQUOTE: {
         id: 'stroked',
         showType: 2,
         template: 'wml!Controls/Input/RichEditor/Toolbar/templates/formatButton',
         title: rk('Цитата'),
         icon: 'Quote',
         format: 'blockquote'
      },
      UNDO: {
         id: 'undo',
         showType: 2,
         template: 'wml!Controls/Input/RichEditor/Toolbar/templates/undoRedoButton',
         title: rk('Шаг назад'),
         icon: 'Undo2',
         command: 'undo'
      },
      REDO: {
         id: 'redo',
         showType: 2,
         template: 'wml!Controls/Input/RichEditor/Toolbar/templates/undoRedoButton',
         title: rk('Шаг назад'),
         icon: 'Redo2',
         command: 'redo'
      },
      CUSTOM_FORMAT: {
         id: 'customFormat',
         showType: 2,
         template: 'wml!Controls/Input/RichEditor/Toolbar/templates/customFormatButton'
      },
      COLOR: {
         id: 'color',
         showType: 2,
         template: 'wml!Controls/Input/RichEditor/Toolbar/templates/colorButton'
      },
      ALIGN: {
         id: 'align',
         showType: 2,
         template: 'wml!Controls/Input/RichEditor/Toolbar/templates/alignButton'
      },
      LIST: {
         id: 'list',
         showType: 2,
         template: 'wml!Controls/Input/RichEditor/Toolbar/templates/listButton'
      },
      PASTE: {
         id: 'paste',
         showType: 2,
         template: 'wml!Controls/Input/RichEditor/Toolbar/templates/pasteButton'
      },
      LINK: {
         id: 'link',
         showType: 2,
         template: 'wml!Controls/Input/RichEditor/Toolbar/templates/editLinkButton'
      },
      UNLINK: {
         id: 'unlink',
         showType: 2,
         template: 'wml!Controls/Input/RichEditor/Toolbar/templates/unlinkButton'
      }
   };
});
