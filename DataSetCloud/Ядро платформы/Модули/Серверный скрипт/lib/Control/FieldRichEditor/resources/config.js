define(["js!SBIS3.CORE.FieldString", "js!SBIS3.CORE.FieldText", "js!SBIS3.CORE.FileStorageLoader", "js!SBIS3.CORE.Dialog", "js!SBIS3.CORE.Button"], function (FieldString, FieldText, FileLoader, Dialog, Button) {

   'use strict';

   var
      ICONS = {
         justifyleft   : 'icon-16 icon-AlignmentLeft icon-primary',
         justifycenter : 'icon-16 icon-AlignmentCenter icon-primary',
         justifyright  : 'icon-16 icon-AlignmentRight icon-primary',
         justifyblock  : 'icon-16 icon-AlignmentWidth icon-primary',
         numberedlist  : 'icon-16 icon-ListNumbered icon-primary',
         bulletedlist  : 'icon-16 icon-ListMarked icon-primary',
         textColor     : 'icon-16 icon-TextColor icon-primary',
         table         : 'icon-16 icon-Table icon-primary',
         smile         : 'icon-16 icon-EmoiconSmile icon-primary',
         history       : 'icon-16 icon-InputHistory icon-primary'
      },
      fontStyles = {
         title: { size: '18px' },
         subTitle: { size: '15px' },
         mainText: { },
         selectedMainText: { bold: true },
         additionalText: { size: '11px' }
      },
      isMobileBrowser = $ws._const.browser.isMobileSafari || $ws._const.browser.isMobileAndroid,
      additionalPictureIndent = 80,
      minimalPictureWidth = 100,
      widthDropdownIcon = 18,
      onButtonClick = function() {
         this._options.fieldRichEditor._richEditor.execCommand(this._options.name);
      },
      renderDropdownTitle = function(onlyIcon) {
         return onlyIcon ?
            function(key, value) {
               return $('<div class="ws-fre-dropdown-text ws-fre__' + key + '" style="width: ' +
                  (this._options.width - widthDropdownIcon) + 'px;"><div class="ws-fre-dropdown-icon ' + ICONS[key] + '" title="' + value + '" value="' + key + '"></div></div>');
            } :
            function(key, value) {
               return $('<div class="ws-fre-dropdown-text ws-fre__styleText-' + key + '" style="width: ' +
                  (this._options.width - widthDropdownIcon) + 'px;" value="' + key + '">' + value + '</div>');
            }
      },
      renderDropdownValue = function(onlyIcon) {
         return onlyIcon ?
            function(key, value) {
               return $('<div class="ws-fre__' + key + '"><div class="ws-fre-dropdown-icon ' + ICONS[key] + '"title="' + value + '" value="' + key + '"></div></div>');
            } :
            function(key, value) {
               return $('<div class="ws-fre__styleText-' + key + '" value="' + key + '">' + value + '</div>');
            }
      };

   return {
      undo : {
         type: 'button',
         config: {
            caption: '',
            tooltip: 'Шаг назад',
            image: 'sprite:icon-16 icon-Undo2 icon-primary',
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
            tooltip: 'Шаг вперед',
            image: 'sprite:icon-16 icon-Redo2 icon-primary',
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
            tooltip: 'Стиль текста',
            data: [
               { key: 'title', value: 'Заголовок' },
               { key: 'subTitle', value: 'Подзаголовок' },
               { key: 'mainText', value: 'Основной текст' },
               { key: 'selectedMainText', value: 'Выделенный основной текст' },
               { key: 'additionalText', value: 'Дополнительный текст' }
            ],
            titleRender: renderDropdownTitle(),
            valueRender: renderDropdownValue(),
            value: 'mainText',
            width: 128,
            visible: true,
            handlers: {
               onChangeItem: function(e, key) {
                  this._options.fieldRichEditor._setFontProperties(fontStyles[key]);
               }
            },
            enabled: true
         }
      },
      bold : {
         type: 'button',
         config: {
            caption: '',
            tooltip: 'Полужирный',
            image: 'sprite:icon-16 icon-Bold icon-primary',
            handlers: {
               onActivated: onButtonClick
            },
            visible: true,
            enabled: true
         }
      },
      italic : {
         type: 'button',
         config: {
            caption: '',
            tooltip: 'Курсив',
            image: 'sprite:icon-16 icon-Italic icon-primary',
            handlers: {
               onActivated: onButtonClick
            },
            visible: true,
            enabled: true
         }
      },
      underline : {
         type: 'button',
         config: {
            caption: '',
            tooltip: 'Подчеркнутый',
            image: 'sprite:icon-16 icon-Underline icon-primary',
            handlers: {
               onActivated: onButtonClick
            },
            visible: true,
            enabled: true
         }
      },
      strike : {
         type: 'button',
         config: {
            caption: '',
            tooltip: 'Зачеркнутый',
            image: 'sprite:icon-16 icon-Stroked icon-primary',
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
            tooltip: 'Выравнивание текста',
            data: [
               { key: 'justifyleft', value: 'По левому краю' },
               { key: 'justifycenter', value: 'По центру' },
               { key: 'justifyright', value: 'По правому краю' },
               { key: 'justifyblock', value: 'По ширине' }
            ],
            titleRender: renderDropdownTitle(true),
            valueRender: renderDropdownValue(true),
            handlers: {
               onChange: function(event, value) {
                  this._options.fieldRichEditor._richEditor.execCommand(value);
               }
            },
            value: 'justifyleft',
            width: 38,
            visible: !isMobileBrowser,
            enabled: true
         }
      },
      textColor : {
         type: 'dropdown',
         config: {
            tooltip: 'Цвет текста',
            data: [
               { key: 'textColor', value: 'Цвет текста' }
            ],
            titleRender: renderDropdownTitle(true),
            valueRender: function() {
               var result = $('<div class="ws-fre-toolbar-color-menu"  value="textColor"></div>');
               result
                  .append($('<div class="ws-fre-color-menu-item"><div class="ws-fre-color ws-fre-black"></div></div>'))
                  .append($('<div class="ws-fre-color-menu-item"><div class="ws-fre-color ws-fre-red"></div></div>'))
                  .append($('<div class="ws-fre-color-menu-item"><div class="ws-fre-color ws-fre-green"></div></div>'))
                  .append($('<div class="ws-fre-color-menu-item"><div class="ws-fre-color ws-fre-blue"></div></div>'))
                  .append($('<div class="ws-fre-color-menu-item"><div class="ws-fre-color ws-fre-purple"></div></div>'))
                  .append($('<div class="ws-fre-color-menu-item"><div class="ws-fre-color ws-fre-grey"></div></div>'));
               return result;
            },
            handlers: {
               onAfterLoad: function() {
                  this.subscribe('onRowClick', function(eventObject, event) {
                     var
                        $t = $(event.target),
                        editor = this._options.fieldRichEditor;
                     if ($t.hasClass('ws-fre-color-menu-item')) {
                        editor._setTextColor(CKEDITOR.tools.convertRgbToHex($t.children().css('background-color')));
                     } else if ($t.hasClass('ws-fre-color')) {
                        editor._setTextColor(CKEDITOR.tools.convertRgbToHex($t.css('background-color')));
                     }
                  });
               }
            },
            value: 'textColor',
            width: 32,
            visible: !isMobileBrowser,
            enabled: true
         }
      },
      list : {
         type: 'dropdown',
         config: {
            tooltip: 'Вставить/Удалить список',
            data: [
               { key: 'bulletedlist', value: 'Маркированный список' },
               { key: 'numberedlist', value: 'Нумерованный список' }
            ],
            titleRender: renderDropdownTitle(true),
            valueRender: renderDropdownValue(true),
            handlers: {
               onAfterLoad: function() {
                  this.subscribe('onRowClick', function(eventObject, event) {
                     this._options.fieldRichEditor._richEditor.execCommand(this.getValue());
                  });
               }
            },
            value: 'bulletedlist',
            width: 38,
            visible: !isMobileBrowser,
            enabled: true
         }
      },
      link : {
         type: 'button',
         config: {
            caption: '',
            tooltip: 'Вставить/редактировать ссылку',
            image: 'sprite:icon-16 icon-Link icon-primary',
            handlers: {
               onActivated: function() {
                  var
                     self = this,
                     plugin = CKEDITOR.plugins.link,
                     editor = this._options.fieldRichEditor._richEditor,
                     link = plugin.getSelectedLink(editor),
                     selection = editor.getSelection(),
                     element = null,
                     href = '',
                     context = new $ws.proto.Context(),
                     protocol = /(https?|ftp|file):\/\//gi;
                  if ((element = plugin.getSelectedLink(editor)) && element.hasAttribute('href')) {
                     if (!selection.getSelectedElement()) {
                        selection.selectElement(element);
                     }
                     href = element.getAttribute('href');
                  } else {
                     element = null;
                  }
                  this.getContainer().addClass('ws-fre-button-pressed');
                  new Dialog({
                     caption: 'Вставить/редактировать ссылку',
                     disableActions: true,
                     resizable: false,
                     width: 440,
                     height: 48,
                     keepSize: false,
                     opener: this._options.fieldRichEditor,
                     context: context,
                     handlers: {
                        onReady: function() {
                           var
                              self = this,
                              hrefLabel = $('<div class="ws-fre-link-window-href-label">Адрес</div>'),
                              okButton = $('<div class="ws-fre-link-window-ok-button"></div>');
                           this._fieldHref = $('<div class="ws-fre-link-window-href"></div>');
                           this.getContainer()
                              .append(hrefLabel)
                              .append(this._fieldHref);
                           this._fieldHref = new FieldString({
                              value: href,
                              parent: this,
                              element: this._fieldHref,
                              linkedContext: context,
                              name: 'fre_link_href'
                           });
                           this._titleBar
                              .prepend($('<a href="javascript:void(0)"></a>')
                                 .addClass('ws-window-titlebar-action close')
                                 .click(function() {
                                    self.close();
                                    return false;
                                 }))
                              .append(okButton);
                           new Button({
                              caption: 'ОК',
                              defaultButton: true,
                              parent: this,
                              handlers: {
                                 onActivated: function() {
                                    href = this.getParent()._fieldHref.getValue();
                                    if (href && href.search(protocol) === -1) {
                                       href = 'http://' + href;
                                    }
                                    var attributes = {
                                       'href': href,
                                       'data-cke-saved-href': href,
                                       'target' : '_blank'
                                    };
                                    if (element) {
                                       if (attributes.href) {
                                          element.setAttributes(attributes);
                                       } else {
                                          editor.execCommand('unlink');
                                       }
                                    } else {
                                       var range = selection.getRanges()[0];
                                       if (range.collapsed) {
                                          var text = new CKEDITOR.dom.text(attributes['data-cke-saved-href'], editor.document);
                                          range.insertNode(text);
                                          range.selectNodeContents(text);
                                       }
                                       var style = new CKEDITOR.style({ element: 'a', attributes: attributes });
                                       style.type = CKEDITOR.STYLE_INLINE;
                                       style.applyToRange(range);
                                       range.select();
                                    }
                                    self.close();
                                    editor.fire('change');
                                 }
                              },
                              element: okButton
                           });
                        },
                        onAfterClose: function() {
                           self.getContainer().removeClass('ws-fre-button-pressed');
                        }
                     }
                  });
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
               tooltip: 'Убрать ссылку',
               image: 'sprite:icon-16 icon-Unlink icon-primary',
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
            tooltip: 'Добавить таблицу',
            data: [
               { key: 'table', value: 'Добавить таблицу' }
            ],
            titleRender: renderDropdownTitle(true),
            valueRender: renderDropdownValue(true),
            handlers: {
               onChange: function(event, value) {
                  this._options.fieldRichEditor._richEditor.execCommand(value);
               }
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
            tooltip: 'Вставить картинку',
            image: 'sprite:icon-16 icon-Picture icon-primary',
            handlers: {
               onInit: function() {
                  var
                     self = this,
                     cont = $('<div class="test_div"></div>');
                  this._container.append(cont);
                  this._fileLoader = new FileLoader({
                     fileStorage: true,
                     extensions: ['image'],
                     element: cont,
                     linkedContext: this.getLinkedContext(),
                     handlers: {
                        onLoaded: function(e, json) {
                           if (json.result && json.result.code === 201) {
                              $('<img src="' + json.result.filePath + '"></img>').bind('load', function() {
                                    var
                                    editor = self._options.fieldRichEditor,
                                    imgWidth = this.width,
                                    contWidth = editor._contentsEditor.width() - additionalPictureIndent,
                                    style = '';
                                 if (imgWidth > contWidth) {
                                    style = ' style="width: ' + (contWidth >= minimalPictureWidth ? contWidth :  minimalPictureWidth) + 'px;"';
                                 }
                                 editor._richEditor.insertHtml('<img src="' + json.result.filePath + '"' + style + '></img>');
                                 if (editor._options.autoHeight) {
                                    editor._richEditor.execCommand('autogrow');
                                 }
                              });
                           } else {
                              $ws.helpers.alert(decodeURIComponent(json.result ? json.result.message : json.error ? json.error.message : ''));
                           }
                        }
                     }
                  });
               },
               onActivated: function(e) {
                  this._fileLoader.selectFile();
               }
            },
            visible: true,
            enabled: true
         }
      },
      smile : {
         type: 'dropdown',
         config: {
            tooltip: 'Смайлики',
            data: [
               { key: 'smile', value: 'Добавить смайлик' }
            ],
            titleRender: renderDropdownTitle(true),
            valueRender: renderDropdownValue(true),
            handlers: {
               onChange: function(event, value) {
                  this._options.fieldRichEditor._richEditor.execCommand(value);
               }
            },
            value: 'smile',
            width: 38,
            visible: false,
            enabled: true
         }
      },
      history : {
         type: 'dropdown',
         config: {
            tooltip: 'История ввода',
            data: [
               { key: 'history', value: 'История ввода' }
            ],
            titleRender: renderDropdownTitle(true),
            valueRender: renderDropdownValue(true),
            handlers: {
               onChange: function(event, value) {
                  this._options.fieldRichEditor._richEditor.execCommand(value);
               }
            },
            value: 'history',
            width: 38,
            visible: false,
            enabled: true
         }
      },
      source : {
         type: 'button',
         config: {
            caption: '',
            tooltip: 'html-разметка',
            image: 'sprite:icon-16 icon-Html icon-primary',
            handlers: {
               onActivated: onButtonClick
            },
            visible: true,
            enabled: true
         }
      }
   };
});