define('Controls/Input/RichArea/helpers/constants', [
   'Core/constants'
], function(cConstants) {
   /**
    * Module with constants for rich text editor
    */

   var ConstantsPlugin = {
      coreConstants: cConstants,
      tinyConstants: {
         decreaseHeight1: 2, // Высоты всего, содержащегося внутри .controls-RichEditor__richTextArea уменьшаются на 2px так как она имеет верхнюю и нижнюю границы по 1px
         decreaseHeight2: 2, // Высоты всего, содержащегося внутри .controls-RichEditor__scrollContainer уменьшаются на 2px так как он имеет нижний отступ 2px
         baseAreaWidth: 768, // 726
         defaultImagePercentSize: 25, // Начальный размер картинки (в процентах)
         defaultPreviewerSize: 768, // 512
         imageOffset: 40, // 16 слева +  24 справа
         defaultYoutubeHeight: 300,
         minYoutubeHeight: 214,
         defaultYoutubeWidth: 430,
         minYoutubeWidth: 350,
         baseFontSize: 14,
         styles: {
            header: {
               inline: 'span',
               classes: 'titleText'
            },
            subheader: {
               inline: 'span',
               classes: 'subTitleText'
            },
            additional: {
               inline: 'span',
               classes: 'additionalText'
            }
         },
         colorsMap: {
            'rgb(0, 0, 0)': 'black',
            'rgb(255, 0, 0)': 'red',
            'rgb(0, 128, 0)': 'green',
            'rgb(0, 0, 255)': 'blue',
            'rgb(128, 0, 128)': 'purple',
            'rgb(128, 128, 128)': 'grey'
         },
         ipadCoefficient: {
            top: {
               vertical: 0.65,
               horizontal: 0.39
            },
            bottom: {
               vertical: 0.7,
               horizontal: 0.44
            }
         }
      },

      /**
       * Default formats contained in format model
       */
      defaultFormats: [
         'bold',
         'italic',
         'strikethrough',
         'blockquote',
         'aligncenter',
         'alignjustify',
         'alignleft',
         'alignright',
         'underline',
         'header',
         'subheader',
         'additional',
         'forecolor',
         'fontsize'
      ],
      getTrueIEVersion: function() {
         var version = cConstants.browser.IEVersion;

         // В cConstants.browser.IEVersion неправильно определяется MSIE 11
         if (version < 11 && typeof window !== 'undefined') {
            var ms = navigator.userAgent.match(/Trident\/([0-9]+)\.[0-9]+/);
            if (ms) {
               version = +ms[1] + 4;
            }
         }
         return version;
      },

      // Константа - имя регистрации загрузчика изображений в инжекторе зависимостей
      DI_IMAGE_UPLOADER: 'ImageUploader',
      SMILES: [
         {
            key: 'first', code: '128514', title: '&#128514;', multiline: true
         },
         {
            key: 'second', code: '128516', title: '&#128516;', multiline: true
         },
         {
            key: 'third', code: '128565', title: '&#128565;', multiline: true
         },
         {
            key: 'fourth', code: '128520', title: '&#128520;', multiline: true
         },
         {
            key: 'fifth', code: '128521', title: '&#128521;', multiline: true
         },
         {
            key: 'sixth', code: '128523', title: '&#128523;', multiline: true
         },
         {
            key: 'seventh', code: '128525', title: '&#128525;', multiline: true
         },
         {
            key: 'eighth', code: '128526', title: '&#128526;', multiline: true
         },
         {
            key: 'ninth', code: '128528', title: '&#128528;', multiline: true
         },
         {
            key: 'tenth', code: '128532', title: '&#128532;', multiline: true
         },
         {
            key: 'eleventh', code: '128536', title: '&#128536;', multiline: true
         },
         {
            key: 'twelfth', code: '128544', title: '&#128544;', multiline: true
         },
         {
            key: 'thirteenth', code: '128547', title: '&#128547;', multiline: true
         },
         {
            key: 'fourteenth', code: '128553', title: '&#128553;', multiline: true
         },
         {
            key: 'fifteenth', code: '128554', title: '&#128554;', multiline: true
         },
         {
            key: 'sixteenth', code: '128555', title: '&#128555;', multiline: true
         },
         {
            key: 'seventeenth', code: '128557', title: '&#128557;', multiline: true
         },
         {
            key: 'eighteenth', code: '128562', title: '&#128562;', multiline: true
         },
         {
            key: 'nineteenth', code: '128567', title: '&#128567;', multiline: true
         },
         {
            key: 'twentieth', code: '128584', title: '&#128584;', multiline: true
         },
         {
            key: 'twenty first', code: '128585', title: '&#128585;', multiline: true
         },
         {
            key: 'twenty second', code: '128586', title: '&#128586;', multiline: true
         },
         {
            key: 'twenty third', code: '128522', title: '&#128522;', multiline: true
         },
         {
            key: 'twenty fourth', code: '128515', title: '&#128515;', multiline: true
         }
      ],

      /**
       * Default formats which are observing by editor's formatter
       */
      formats: 'bold,italic,underline,strikethrough,alignleft,aligncenter,alignright,alignjustify,header,subHeader,additional,blockquote'
   };

   ConstantsPlugin.BROWSER = cConstants.browser;
   ConstantsPlugin.TINYMCE_URL_BASE = ConstantsPlugin.BROWSER.isIE && ConstantsPlugin.getTrueIEVersion() < 11 ? 'SBIS3.CONTROLS/RichEditor/third-party/tinymce46-ie10' : 'SBIS3.CONTROLS/RichEditor/third-party/tinymce';
   ConstantsPlugin.EDITOR_MODULE = ConstantsPlugin.TINYMCE_URL_BASE + '/tinymce';

   return ConstantsPlugin;
});
