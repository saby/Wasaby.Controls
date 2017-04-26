/**
 * Модуль для загрузки шрифтов
 * Запрашивает шрифты с роутинга
 *
 * Для IE 8 и 9 использовать будем css с eot шрифтом
 * Для Android используем ttf шрифты
 * Для всего остального используем woff шрифты
 * SVG не используем нигде
 *
 * @link http://caniuse.com/#feat=ttf
 * @link http://caniuse.com/#feat=woff
 * @link http://caniuse.com/#feat=svg-fonts
 */

var web_fonts = [
   {
      'font-family': 'TensorFont',
      'font-weight': 'normal',
      'font-style': 'normal',
      'path': 'TensorFont',
      'version': '1.2.3',
      'use': true
   },
   {
      'font-family': 'TensorFont',
      'font-weight': 'bold',
      'font-style': 'normal',
      'path': 'TensorFontBold',
      'version': '1.2.3',
      'use': true
   },
   {
      'font-family': 'TensorFont',
      'font-weight': 'bold',
      'font-style': 'italic',
      'path': 'TensorFontBoldItalic',
      'version': '1.2.4',
      'use': true
   },
   {
      'font-family': 'TensorFont',
      'font-weight': 'normal',
      'font-style': 'italic',
      'path': 'TensorFontItalic',
      'version': '1.2.3',
      'use': true
   },
   {
      'font-family': 'cbuc-icons',
      'font-weight': 'normal',
      'font-style': 'normal',
      'version': '1.12.18',
      'use': true
   },
   {
      'font-family': 'cbuc-icons24',
      'font-weight': 'normal',
      'font-style': 'normal',
      'version': '1.12.18',
      'use': true
   }
];

(function(win) {
   var
      storage = win.localStorage,
      ua = win.navigator.userAgent,
      appRoot = (win.service && win.service.appRoot) || getLocation(),
      ttf = /Android (2|3|4.0|4.1|4.2|4.3)/.test(ua) && /AppleWebKit/.test(ua) && /Mobile/.test(ua),
      eot = win.navigator.appVersion.indexOf('MSIE 8.') > -1,
      styleElement = document.createElement('LINK'),
      head = win.document.getElementsByTagName('head')[0],
      href = removeTrailingSlash(appRoot) + '/webfonts/?type=' + (eot ? 'eot' : ttf ? 'ttf' : 'woff') + '&fonts=' + JSON.stringify(web_fonts);

   styleElement.setAttribute('rel', 'stylesheet');
   styleElement.setAttribute('type', 'text/css');
   styleElement.setAttribute('href', encodeURI(href));

   head.appendChild(styleElement);

   if (win.addEventListener) {
      win.addEventListener('load', onLoad);
   } else {
      win.attachEvent('onload', onLoad);
   }

   // TODO: удалить после 3.7.3
   // Почистим старые шрифты все, а потом начнем с чистого листа
   (function clear() {
      var re = new RegExp(/^x-font-/),
          rv = [],
          i, l, key;

      for (i = 0, l = storage.length; i < l; i++) {
         key = storage.key(i);
         if (key && re.test(key)) {
            storage.removeItem(key)
         }
      }
   })();
   
   function removeTrailingSlash(path) {
      if (path) {
         var tail = path.substr(path.length - 1);
         if (tail == '/' || tail == '\\') {
            path = path.substr(0, path.length - 1);
         }
      }
      return path;
   }
        
   function getLocation() {
      var
         scripts = win.document.getElementsByTagName('script'),
         script, currUrl = '/';

      for (var i = 0, len = scripts.length; i < len; i++) {
         script = scripts[i];
         // Билдер может заверсионировать файл
         if (/(webfonts(\.v[\s\S]+)?.js$)/.test(script.src)) {
            currUrl = script.src.replace(/\/resources\/.*$/, '/');
            break;
         }
      }

      return currUrl;
   }

   function onLoad() {
      /**
       * Chrome и Safari начинают грузить шрифты только если у элемента есть контент
       * @link https://dev.opera.com/articles/better-font-face/
       */
      var
         body = win.document.getElementsByTagName('body')[0],
         div;

      for (var i = 0, len = web_fonts.length; i < len; i++) {
         font = web_fonts[i];
         div = win.document.createElement('div');

         body.appendChild(div);
         div.style.top = '-100px';
         div.style.left = '-100px';
         div.style.position = 'absolute';
         div.style.font = font['font-style'] + ' 14px \''  + font['font-family'] + '\'';
         div.innerHTML = 'Font-fix';
      }
   }
})(this);