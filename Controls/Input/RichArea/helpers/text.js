define('Controls/Input/RichArea/helpers/text', [
   'Core/Sanitize',
   'Core/core-merge'
], function(Sanitize, cMerge) {
   /**
    * Module which provides text's processing
    */

   var TextHelper = {

         /**
       * Function trims text
       * @param text
       * @returns {string}
       */
         trimText: function(text) {
            if (!text) {
               return '';
            }
            var regs = {
               regShiftLine1: /<p>[\s\xA0]*(?:<br[^<>]*>)+[\s\xA0]*/gi, // регулярка пустой строки через shift+ enter и space
               regShiftLine2: /[\s\xA0]*(?:<br[^<>]*>)+[\s\xA0]*<\x2Fp>/gi, // регулярка пустой строки через space и shift+ enter
               beginReg: /^<p>[\s\xA0]*<\x2Fp>[\s\xA0]*/i, // регулярка начала строки
               endReg: /[\s\xA0]*<p>[\s\xA0]*<\x2Fp>$/i // регулярка конца строки
            };
            var substitutes = {
               regShiftLine1: '<p>',
               regShiftLine2: '</p>'
            };
            text = _private.removeEmptyTags(text);
            text = text.replace(/&nbsp;/gi, String.fromCharCode(160));

            // tinyMCE на ipad`e в методе getContent возвращает блоки вида <p class=\"\">text</p>
            text = text.replace(/ class=\"\"/gi, '');
            for (var name in regs) {
               for (var prev = -1, cur = text.length; cur !== prev; prev = cur, cur = text.length) {
                  text = text.replace(regs[name], substitutes[name] || '');
               }
               text = text.replace(/^[\s\xA0]+|[\s\xA0]+$/g, '');
               if (!text) {
                  return '';
               }
            }
            text = text.replace(/\xA0/gi, '&nbsp;');
            return text;
         },

         /**
       * Function returns html text
       * @param self
       * @param html
       * @returns {string}
       */
         htmlToText: function(self, html) {
            if (!html) {
               return '';
            }
            var node = document.createElement('div');
            node.innerHTML = html;
            var texts = [];
            var dom = self._editor.dom;

            // Регулярное выражение для символа, соответствующему &nbsp;
            var reNbsp = /\xA0/g;

            // Регулярное выражение для перевода строк
            var reRn = /^(?:\r?\n)+$/;
            for (var i = 0, list = node.childNodes; i < list.length; i++) {
               var e = list[i];
               var txt = e.nodeType === 1 ? e.innerText : e.nodeValue;
               if (e.nodeType === 3 && reRn.test(txt)) {
               // Если это просто текстовый узел, содержащий только переводы строки - игнорировать его
                  continue;
               }
               if (txt) {
                  txt = txt.replace(reNbsp, ' ');
                  if (texts.length && e.nodeType === 1 && dom.isBlock(e)) {
                     texts.push('\r\n\r\n');
                  }
                  texts.push(txt);
               }
            }
            return texts.join('');
         },
         sanitizeClasses: function(text, images, options) {
            var _options = options || this._options;
            var sanitizeOptions = {
               validNodes: {
                  img: images ? {
                     'data-img-uuid': true,
                     'data-mce-src': true,
                     'data-mce-style': true,
                     onload: false,
                     onerror: false
                  } : false,
                  table: {
                     border: true,
                     cellspacing: true,
                     cellpadding: true
                  }
               },
               validAttributes: {
                  'class': function(content, attributeName) {
                     this._sanitizeClassCallback(content, attributeName, _options);
                  }.bind(this)
               },
               checkDataAttribute: false,
               escapeInvalidTags: false
            };
            var validAttributes = _options ? _options.validAttributes : null;
            if (validAttributes && typeof validAttributes === 'object') {
               sanitizeOptions.validAttributes = cMerge(validAttributes, sanitizeOptions.validAttributes);
            }
            return Sanitize(text, sanitizeOptions);
         },

         _sanitizeClassCallback: function(content, attributeName, options) {
            var
               _options = options || this._options,

               // проверка options для юнит тестов, тк там метод зовётся на прототипе
               classValidator = _options ? _options.validateClass : null,
               validateIsFunction = typeof classValidator === 'function',
               currentValue = content.attributes[attributeName].value,
               classes = currentValue.split(' '),
               whiteList = [
                  'titleText',
                  'subTitleText',
                  'additionalText',
                  'controls-RichEditor__noneditable',
                  'without-margin',
                  'has-img-left',
                  'image-template-left',
                  'image-template-center',
                  'image-template-right',
                  'mce-object-iframe',
                  'ws-hidden',
                  'language-javascript',
                  'language-css',
                  'language-markup',
                  'language-php',
                  'token',
                  'comment',
                  'prolog',
                  'doctype',
                  'cdata',
                  'punctuation',
                  'namespace',
                  'property',
                  'tag',
                  'boolean',
                  'number',
                  'constant',
                  'symbol',
                  'deleted',
                  'selector',
                  'attr-name',
                  'string',
                  'char',
                  'builtin',
                  'inserted',
                  'operator',
                  'entity',
                  'url',
                  'style',
                  'attr-value',
                  'keyword',
                  'function',
                  'regex',
                  'important',
                  'variable',
                  'bold',
                  'italic',
                  'LinkDecorator__link',
                  'LinkDecorator',
                  'LinkDecorator__simpleLink',
                  'LinkDecorator__linkWrap',
                  'LinkDecorator__decoratedLink',
                  'LinkDecorator__wrap',
                  'LinkDecorator__image'
               ],
               index = classes.length - 1;

            while (index >= 0) {
               if (!~whiteList.indexOf(classes[index]) &&
               (!validateIsFunction || !classValidator(classes[index]))) {
                  classes.splice(index, 1);
               }
               index -= 1;
            }
            currentValue = classes.join(' ');
            if (currentValue) {
               content.attributes[attributeName].value = currentValue;
            } else {
               delete content.attributes[attributeName];
            }
         }
      }, _private = {
         removeEmptyTags: function(text) {
            var temp = document.createElement('div');
            temp.innerHTML = text;
            while (temp.querySelectorAll(':empty:not(img):not(iframe)').length) {
               var item = temp.querySelector(':empty:not(img):not(iframe)'),
                  parent = item.parentNode;
               parent.removeChild(item);
            }
            return temp.innerHTML;
         }
      };

   return TextHelper;
});
