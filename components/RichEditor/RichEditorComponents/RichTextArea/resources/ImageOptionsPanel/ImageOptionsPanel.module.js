
define('js!SBIS3.CONTROLS.RichEditor.ImageOptionsPanel',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'js!SBIS3.CONTROLS.PopupMixin',
      'js!SBIS3.CORE.FileStorageLoader',
      'js!WS.Data/Di',
      'Core/helpers/fast-control-helpers',
      'html!SBIS3.CONTROLS.RichEditor.ImageOptionsPanel',
      'js!SBIS3.CONTROLS.CommandsButton',
      'js!SBIS3.CONTROLS.Link',
      'css!SBIS3.CONTROLS.RichEditor.ImageOptionsPanel'
   ], function(CompoundControl, PopupMixin, FileStorageLoader, Di, fcHelpers, dotTplFn) {
      'use strict';
      //todo: отказаться от этого модуля в 3.7.5.50 перейти на контекстное меню
      var
         imagePanelhOffset = 24,// 32 - 6 - 2*1?  height - input padding - 2 * border
         imagePanelhOffsetBottom = 4,// 6 - 2*1? input padding - 2 * border
         ImageOptionsPanel =  CompoundControl.extend([PopupMixin], {
            _dotTplFn: dotTplFn,
            $protected: {
               _options: {
                  richMode: false
               }
            },
            _replaceButton: undefined,
            _commandsButton: undefined,
            _deleteButton: undefined,
            _imageViewer: undefined,

            _modifyOptions: function(options) {
               options = ImageOptionsPanel.superclass._modifyOptions.apply(this, arguments);
               if (Di.isRegistered('ImageEditor')) {
                  options.richMode = this._options.target.attr('alt') !== ''; //если файлы грузили через fileStorageLoader, то не надо показывать редактор изображений
               }
               return options;
            },

            $constructor: function(){
               this._publish('onImageChange', 'onImageDelete');
            },

            init: function(){
               ImageOptionsPanel.superclass.init.call(this);

               this._replaceButton = this.getChildControlByName('replaceButton');
               this._replaceButton.subscribe('onActivated', this._replaceButtonClickHandler.bind(this));

               if (this._options.richMode) {
                  this._commandsButton = this.getChildControlByName('commandsButton');
                  this._commandsButton.subscribe('onMenuItemActivate', this._commandsButtonItemActivateHandler.bind(this));
               } else {
                  this._deleteButton = this.getChildControlByName('deleteButton');
                  this._deleteButton.subscribe('onActivated', this._deleteButtonClickHandler.bind(this));
               }
            },

            recalcPosition: function() {
               ImageOptionsPanel.superclass.recalcPosition.apply(this, arguments);
               var
                  inputOffset = this.getParent().getInputContainer().offset().top,
                  panelOffset = this._container.offset().top,
                  inputHeight = this.getParent().getInputContainer().height();
               this._container.css('width',this.getTarget().width());
               this._container.css('height','32px'); // dich3000
               this._container.css('overflow-y','hidden'); // dich3000
               if (this._container.hasClass('controls-popup-revert-vertical')) {
                  if (panelOffset + imagePanelhOffset < inputOffset) {
                     this._container.css('top', inputOffset - imagePanelhOffset);
                  }
               } else {
                  if (panelOffset > inputOffset + inputHeight + imagePanelhOffsetBottom) {
                     this._container.css('top', inputOffset + this.getParent().getInputContainer().height());
                  }
               }
            },

            getFileLoader: function() {
               return Di.resolve('ImageUploader').getFileLoader();
            },

            getEditor: function() {
               return Di.resolve('ImageEditor');
            },

            _replaceButtonClickHandler: function() {
               this.getFileLoader().startFileLoad(this._replaceButton._container, false, this._options.imageFolder).addCallback(function(fileobj){
                  this._notify('onImageChange', fileobj);
                  this.hide();
               }.bind(this));
            },

            _deleteButtonClickHandler: function () {
               this._notify('onImageDelete');
               this.hide();
            },

            _commandsButtonItemActivateHandler: function(event, key){
               switch (key) {
                  case "delete":
                     this._notify('onImageDelete');
                     this.hide();
                     break;
                  case "edit":
                     var
                        self = this;
                     this.getEditor().openFullScreenByFileId(this.getTarget().attr('alt')).addCallback(function(fileobj){
                        self._notify('onImageChange', fileobj);
                     });
                     this.hide();
                     break;
               }
            }
         });
      return ImageOptionsPanel;
   });