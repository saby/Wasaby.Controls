define('Controls/Input/RichArea/TinyMCE', [
   'Core/Control',
   'Core/constants',
   'tmpl!Controls/Input/RichArea/TinyMCE/TinyMCE',
   'Core/moduleStubs',
   'Core/Sanitize',
   'css!Controls/Input/RichArea/TinyMCE/TinyMCE'
], function(Control, cConstants, template, moduleStabs, sanitize) {
   'use strict';

   /**
    * Component TinyMCE
    * @class Controls/Container/TinyMCE
    * @extends Core/Control
    * @control
    * @authors Volotskoy V.D., Sukhoruchkin A.S., Avramenko A.S.
    */
   var _private = {
         tinyInit: function(self) {
            self.editorConfiguration.target = self._children.mceContainer;
            self.editorConfiguration.setup = function(editor) {
               self._tinyEditor = editor;
               _private.bindEvents(self);
            };
            tinyMCE.init(self.editorConfiguration);
         },
         drawText: function(self, text) {
            var autoFormat = true;
            if (!self._typeInProcess && text != _private.getTinyEditorValue(self)) {
               text = '<p>' + text.replace(/\n/gi, '<br/>') + '</p>';
               autoFormat = false;
            }
            text = _private.replaceWhitespaces(text);
            self._tinyEditor.setContent(_private.prepareReviewContent(_private.trimText(text)), autoFormat ? undefined : {format: 'raw'});
            self._tinyEditor.undoManager.add();
         },
         getTinyEditorValue: function(self) {
            var
               content = self._tinyEditor.getContent({no_events: true}),
               args = self._tinyEditor.fire('PostProcess', {content: content});
            return args.content;
         },
         replaceWhitespaces: function(text) {
            if (typeof text !== 'string') {
               return text;
            }
            var out = '';
            for (var a = 0, b = -1, opening = true, notEnd = true; notEnd; opening = !opening) {
               b = text.indexOf(opening ? '<' : '>', a);
               notEnd = b !== -1;
               if (opening) {
                  if (a !== notEnd ? b : text.length) {
                     // Это фрагмент между тегами
                     out += text.substring(a, notEnd ? b : text.length)

                     // Сначала заменяем все вхождения сущности &nbsp; на эквивалентный символ
                        .replace(/&nbsp;/g, String.fromCharCode(160))

                        // Затем регуляризуем все пробельные цепочки
                        .replace(/[\x20\xA0]+/g, function($0/*, index, source*/) {
                           if ($0.length === 1) {
                              return $0.charCodeAt(0) === 32 ? $0 : '&nbsp;';
                           } else {
                              // Получена цепочка пробельных символов - заменяем чередованием. Первым в цепочке всегда берём &nbsp;
                              var spaces = '';
                              for (var i = 0; i < $0.length; i++) {
                                 spaces += i % 2 === 1 ? ' ' : '&nbsp;';
                              }
                              return spaces;
                           }
                        });
                  }
                  a = b;
               } else {
                  // Это фрагмент внутри тега
                  out += text.substring(a, notEnd ? b + 1 : text.length);
                  a = b + 1;
               }
            }
            return out;
         },
         trimText: function(text) {
            if (!text) {
               return '';
            }
            var regs = {
               regShiftLine1: /<p>[\s\xA0]*(?:<br[^<>]*>)+[\s\xA0]*/gi,    // регулярка пустой строки через shift+ enter и space
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
         removeEmptyTags: function(text) {
            var temp = document.createElement('div');
            temp.innerHTML = text;
            while (temp.querySelectorAll(':empty:not(img):not(iframe)').length) {
               var item = temp.querySelector(':empty:not(img):not(iframe)'),
                  parent = item.parentNode;
               parent.removeChild(item);
            }
            return temp.innerHTML;
         },
         prepareReviewContent: function(text) {
            if (text && text[0] !== '<') {
               text = '<p>' + text.replace(/\n/gi, '<br/>') + '</p>';
            }
            return sanitize(text);
         },
         bindEvents: function(self) {
            var editor = self._tinyEditor;
            editor.on('keyup', function(e) {
               self._typeInProcess = false;
               if (!(e.keyCode === cConstants.key.enter && e.ctrlKey)) { // Не нужно обрабатывать ctrl+enter, т.к. это сочетание для дефолтной кнопки
                  self.textChanged();
               }
            });

            editor.on('keydown', function() {
               self._typeInProcess = true;
            });
         }
      },
      tinyMCEController = Control.extend({
         _template: template,
         _typeInProcess: false,
         editorConfiguration: {
            className: null,
            plugins: 'media,paste,lists,noneditable,codesample',
            codesample_content_css: false,
            inline: true,
            relative_urls: false,
            convert_urls: false,
            formats: cConstants.styles,
            paste_webkit_styles: 'color font-size text-align text-decoration width height max-width padding padding-left padding-right padding-top padding-bottom',
            paste_retain_style_properties: 'color font-size text-align text-decoration width height max-width padding padding-left padding-right padding-top padding-bottom',
            paste_as_text: true,
            extended_valid_elements: 'div[class|onclick|style|id],img[unselectable|class|src|alt|title|width|height|align|name|style]',
            body_class: 'ws-basic-style',
            invalid_elements: 'script',
            paste_data_images: false,
            paste_convert_word_fake_lists: false, //TODO: убрать когда починят https://github.com/tinymce/tinymce/issues/2933
            statusbar: false,
            toolbar: false,
            menubar: false,
            browser_spellcheck: true,
            smart_paste: true,
            noneditable_noneditable_class: 'controls-RichEditor__noneditable',
            object_resizing: false,
            inline_boundaries: false
         },

         _beforeMount: function() {
            if (cConstants.isBrowserPlatform) {
               return moduleStabs.require([cConstants.browser.isIE10 ? 'SBIS3.CONTROLS/RichEditor/third-party/tinymce46-ie10' : 'SBIS3.CONTROLS/RichEditor/third-party/tinymce/tinymce.min']);
            }
         },

         _afterMount: function(opts) {
            _private.tinyInit(this);
            _private.drawText(this, opts.value);
         },

         _beforeUpdate: function(opts) {
            if (!this._typeInProcess && _private.getTinyEditorValue(this) !== opts.value) {
               _private.drawText(this, opts.value);
            }
         },

         /**
          * Function strikes 'textChanged' to upper control with current editor value
          */
         textChanged: function() {
            this._notify('textChanged', [_private.trimText(this._tinyEditor.getContent())]);
         }
      });

   return tinyMCEController;
});
