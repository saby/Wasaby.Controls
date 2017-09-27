define('js!SBIS3.CONTROLS.RichEditor.ImageOptionsPanel',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'js!SBIS3.CONTROLS.PopupMixin',
      'js!SBIS3.CORE.FileStorageLoader',
      'js!WS.Data/Di',
      'tmpl!SBIS3.CONTROLS.RichEditor.ImageOptionsPanel',
      'js!SBIS3.CONTROLS.RichEditor.ImagePanel',
      'js!SBIS3.CONTROLS.CommandsButton',
      'js!SBIS3.CONTROLS.Link',
      'css!SBIS3.CONTROLS.RichEditor.ImageOptionsPanel',
      'css!SBIS3.CONTROLS.Menu'
   ], function(CompoundControl, PopupMixin, FileStorageLoader, Di, dotTplFn, ImagePanel) {
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
                  require(['js!SBIS3.CONTROLS.ContextMenu'], function (ctxMenu) {
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

            recalcPosition: function() {
               //todo: убрать при переходе на контекстное меню
               ImageOptionsPanel.superclass.recalcPosition.apply(this, arguments);
               var
                  parent = this.getParent(),
                  srcollParent = parent.getContainer().parent('.controls-ScrollContainer__content'),
                  linkedContainer = srcollParent.length ? srcollParent : parent.getInputContainer(), // всегда считаем  показ панели от поля ввода редактора
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

            getFileLoader: function() {
               return Di.resolve('ImageUploader').getFileLoader();
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
                     target: button.getContainer(),
                     verticalAlign: {
                        side: 'top'
                     },
                     horizontalAlign: {
                        side: 'left',
                        offset: -100
                     },
                     element: $('<div></div>')
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
                     this._notify('onImageSizeChange');
                     this.hide();
                     break;
                  case "change":
                     this.getFileLoader().startFileLoad(this._replaceButton._container, false, this._options.imageFolder).addCallback(function(fileobj){
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