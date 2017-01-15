
define('js!SBIS3.CONTROLS.RichEditor.ImageOptionsPanel',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'js!SBIS3.CONTROLS.PopupMixin',
      'js!SBIS3.CORE.FileStorageLoader',
      'js!WS.Data/Di',
      'Core/helpers/fast-control-helpers',
      'html!SBIS3.CONTROLS.RichEditor.ImageOptionsPanel',
      'js!SBIS3.CONTROLS.CommandsButton'
   ], function(CompoundControl, PopupMixin, FileStorageLoader, Di, fcHelpers, dotTplFn) {
      'use strict';

      var
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
               if (Di.isRegistered('imageEditor')) {
                  options.richMode = true;
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
               this._container.css('width',this.getTarget().width());
            },

            getFileLoader: function() {
               return Di.resolve('ImageUploader').fileLoader;
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