define('SBIS3.CONTROLS/RichEditor/Components/RichTextArea/resources/ImageOptionsPanel/ImageOptionsPanel',
   [
      'SBIS3.CONTROLS/CompoundControl',
      'SBIS3.CONTROLS/Mixins/PopupMixin',
      'WS.Data/Di',
      'tmpl!SBIS3.CONTROLS/RichEditor/Components/RichTextArea/resources/ImageOptionsPanel/ImageOptionsPanel',
      'SBIS3.CONTROLS/RichEditor/Components/Toolbar/resources/ImagePanel/ImagePanel',
      'SBIS3.CONTROLS/Commands/CommandsButton',
      'SBIS3.CONTROLS/Link',
      'css!SBIS3.CONTROLS/RichEditor/Components/RichTextArea/resources/ImageOptionsPanel/ImageOptionsPanel',
      'css!SBIS3.CONTROLS/Menu/Menu'
   ], function(CompoundControl, PopupMixin, Di, dotTplFn, ImagePanel) {
      'use strict';
      //todo: отказаться от этого модуля в 3.7.5.50 перейти на контекстное меню
      var
         imagePanelhOffset = 24,// 32 - 6 - 2*1?  height - input padding - 2 * border
         imagePanelhOffsetBottom = 4,// 6 - 2*1? input padding - 2 * border
         imagePanelHeight = 32,
         ImageOptionsPanel =  CompoundControl.extend([PopupMixin], {
            _dotTplFn: dotTplFn,
            $protected: {
               _options: {
                  imageUuid: null
               }
            },
            _replaceButton: undefined,
            _commandsButton: undefined,
            _imageViewer: undefined,
            _imagePanel: undefined,

            $constructor: function(){
               this._publish('onImageChange', 'onImageDelete', 'onImageSizeChange');
            },

            init: function(){
               ImageOptionsPanel.superclass.init.call(this);

               this._replaceButton = this.getChildControlByName('replaceButton');
               this._replaceButton.subscribe('onActivated', this._commandsButtonItemActivateHandler.bind(this, null, 'change'));
               this._commandsButton = this.getChildControlByName('commandsButton');
               this._commandsButton.subscribe('onMenuItemActivate', this._commandsButtonItemActivateHandler.bind(this));
               // Это следствие ошибки в WSControls/Buttons/MenuButton - в методе _getContextMenu неправильно возвращается значение. После исправления - убрать try-catch
               // https://online.sbis.ru/opendoc.html?guid=7928aef9-cf28-499c-9c87-49b1f788907c
               try {
                  this._updateCommandsButtonItems();
               }
               catch (ex) {
                  require(['SBIS3.CONTROLS/Menu/ContextMenu'], function (ctxMenu) {
                     this._updateCommandsButtonItems();
                  }.bind(this));
               }
            },

            setImageUuid: function (uuid) {
               this._options.imageUuid = uuid || null;
               this._updateCommandsButtonItems();
            },

            getImageUuid: function () {
               return this._options.imageUuid;
            },

            _updateCommandsButtonItems: function () {
               if (Di.isRegistered('ImageEditor') && this._commandsButton.getPicker()) {
                  this._commandsButton.getItemInstance('edit').setVisible(!!this._options.imageUuid);
               }
            },
            updateTemplate: function() {
                var
                    icon,
                    target,
                    className,
                    buttons,
                    setTemplate = function() {
                        buttons = this._commandsButton.getItemsInstances();
                        if (buttons) {
                            buttons.template.setIcon('icon-16 icon-' + icon + ' icon-primary')
                        }
                    }.bind(this);
                if (this._options.templates && this._commandsButton) {
                    target = this.getTarget();
                    className = target.attr('class');
                    if (className) {
                        icon = 'PicRight';
                        if (className === 'image-template-left') {
                            icon = 'PicLeftT';
                        }
                    } else if (target.parent('.image-template-center').length) {
                        icon = 'PicCenter';
                    } else {
                        icon = 'PicLeft';
                    }
                    if (this._commandsButton.getPicker()) {
                        setTemplate();
                    } else {
                        this.subscribeOnceTo(this._commandsButton, 'onPickerOpen', setTemplate);
                    }
                }
            },

            _getLinkedContainer: function () {
               var richTextArea = this.getParent();
               var richTextAreaContainer = richTextArea.getContainer();
               var srcollSelector = '.controls-ScrollContainer__content';
               var srcollContainer = richTextAreaContainer.find(srcollSelector);
               if (srcollContainer.length && srcollContainer[0].clientHeight < srcollContainer[0].scrollHeight) {
                  return srcollContainer;
               }
               var srcollContainer = richTextAreaContainer.parent(srcollSelector);
               return srcollContainer.length ? srcollContainer : richTextArea.getInputContainer();
            },

            recalcPosition: function() {
               //todo: убрать при переходе на контекстное меню
               ImageOptionsPanel.superclass.recalcPosition.apply(this, arguments);
               this.updateTemplate();
               var linkedContainer = this._getLinkedContainer();
               var
                  inputOffset = linkedContainer.offset().top,
                  panelOffset = this._container.offset().top,
                  inputHeight = linkedContainer.height(),
                  inputOffsetLeft = linkedContainer.offset().left,
                  panelOffsetleft = this._container.offset().left;
               this._container.css('width',this.getTarget().width());
               this._container.css('max-width', this.getParent().getInputContainer().width() - imagePanelhOffset);
               this._container.css('height',imagePanelHeight + 'px'); // dich3000
               this._container.css('overflow-y','hidden'); // dich3000
               if (this._container.hasClass('controls-popup-revert-vertical')) {
                  if (panelOffset + imagePanelhOffset < inputOffset - imagePanelHeight / 2) {
                     this._container.css('top', inputOffset - imagePanelhOffset);
                  }
               } else {
                  if (panelOffset > inputOffset + inputHeight + imagePanelhOffsetBottom) {
                     this._container.css('top', inputOffset + inputHeight - imagePanelHeight / 2);
                  }
               }
               //ждем реализации нового стандарта(по правой кнопке)
               //http://axure.tensor.ru/standarts/v7/%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD_%D0%B2%D1%81%D1%82%D0%B0%D0%B2%D0%BA%D0%B8_%D0%B8%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_2_.html
               if (panelOffsetleft < inputOffsetLeft) {
                  this._container.css('left', inputOffsetLeft);
               }
            },

            getEditor: function() {
               return Di.resolve('ImageEditor');
            },

            getImagePanel: function(button){
               var
                  self = this;
               if (!this._imagePanel) {
                  this._imagePanel = new ImagePanel({
                     windowTitle: 'Смена шаблона',
                     onlyTemplate: true,
                     parent: button,
                     opener: this.getParent(),
                     target: button.getContainer(),
                     verticalAlign: {
                        side: 'top'
                     },
                     horizontalAlign: {
                        side: 'left',
                        offset: -100
                     },
                     element: $('<div></div>'),
                     linkedEditor: this.getParent(),
                     imageFolder: this.getParent()._options.imageFolder
                  });
                  this._imagePanel.subscribe('onTemplateChange', function(event, template){
                     self._notify('onTemplateChange', template);
                     self._imagePanel.hide();
                  });
               }
               return this._imagePanel;
            },
            _openImagePanel: function(button){
               var
                  imagePanel = this.getImagePanel(button);
               imagePanel.show();
            },

            _commandsButtonItemActivateHandler: function(event, key){
               switch (key) {
                  case "delete":
                     this._notify('onImageDelete');
                     this.hide();
                     break;
                  case "size":
                     // Для того, чтобы активность не уходила на floatArea, что приведёт к прокрутке в редакторе, закрывать только после открытия диалога
                     // 1174814497 https://online.sbis.ru/opendoc.html?guid=8089187f-3917-4ae4-97ab-9dcd6a30b5ef
                     this._notify('onImageSizeChange')
                        .addCallback(this.hide.bind(this));
                     break;
                  case "change":
                     var editor = this.getParent();
                     editor.selectAndUploadImage(this._replaceButton._container, this._options.imageFolder, false).addCallback(function(fileobj){
                        this._notify('onImageChange', fileobj);
                        this.hide();
                     }.bind(this));
                     break;
                  case "template":
                     this._openImagePanel(this);
                     var
                        selection = window.getSelection ? window.getSelection() : null;
                     if (selection) {
                        selection.removeAllRanges();
                     }
                     break;
                  case "edit":
                     var
                        self = this,
                        uuid = this._options.imageUuid;
                     if (uuid) {
                        this.getEditor().openFullScreenByFileId(uuid).addCallback(function(fileobj){
                           self._notify('onImageChange', fileobj);
                        });
                     }
                     this.hide();
                     break;
               }
            }
         });
      return ImageOptionsPanel;
   });
