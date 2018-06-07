define('SBIS3.CONTROLS/RichEditor/Components/Toolbar/resources/ImagePanel/ImagePanel',
   [
      'SBIS3.CONTROLS/CompoundControl',
      'SBIS3.CONTROLS/Mixins/PopupMixin',
      'Lib/Mixins/LikeWindowMixin',
      'tmpl!SBIS3.CONTROLS/RichEditor/Components/Toolbar/resources/ImagePanel/ImagePanel',
      "Core/EventBus",
      'css!SBIS3.CONTROLS/RichEditor/Components/Toolbar/resources/ImagePanel/ImagePanel'
   ], function(CompoundControl, PopupMixin, LikeWindowMixin, dotTplFn, EventBus) {
      'use strict';

      var
         COLLAGE_TEMPLATE = 4,
         ImagePanel =  CompoundControl.extend([PopupMixin, LikeWindowMixin], {
            _dotTplFn: dotTplFn,
            $protected: {
               _options: {
                  windowTitle: rk('Выберите шаблон вставки изображения:'),
                  closeButton: true,
                  canMultiSelect: false,
                  corner: 'tr',
                  closeByExternalClick: true,
                  onlyTemplate: false
               }
            },
            _selectedTemplate: undefined,
            _buttonHandlerInstance: undefined,

            _modifyOptions: function(options) {
               options = ImagePanel.superclass._modifyOptions.apply(this, arguments);
               options.canMultiSelect = options.linkedEditor.canUploadMultiSelect();
               return options;
            },

            $constructor: function() {
               var
                  self = this;
               this._publish('onImageChange', 'onTemplateChange');
               this._buttonHandlerInstance = this._buttonClickHandler.bind(this);
               this._buttonHandlerInstance = this._buttonClickHandler.bind(this);
               this._container.find('.controls-ImagePanel__Button').wsControl = function() { return self; };
               this._container.find('.controls-ImagePanel__Button').on('click', this._buttonHandlerInstance);
               this._container.on('mousedown focus', this._blockFocusEvents);
            },

            _blockFocusEvents: function(event) {
               var eventsChannel = EventBus.channel('WindowChangeChannel');
               event.preventDefault();
               event.stopPropagation();
               //Если случился mousedown то нужно нотифицировать о клике, перебив дефолтное событие перехода фокуса
               if(event.type === 'mousedown') {
                  eventsChannel.notify('onDocumentClick', event);
               }
            },
            _onTargetChangeVisibility: function(){},
            _buttonClickHandler: function(event) {
               var
                  target = $(event.delegateTarget);
               this._selectedTemplate = target.attr('data-id');
               if (this._options.onlyTemplate) {
                  this._notify('onTemplateChange', this._selectedTemplate);
                  this.hide();
               } else {
                  var editor = this._options.linkedEditor;
                  editor.selectAndUploadImage(target, this._options.imageFolder, this._selectedTemplate === COLLAGE_TEMPLATE).addCallback(function(fileobj) {
                     this._notify('onImageChange', this._selectedTemplate, fileobj);
                     this.hide();
                  }.bind(this))
               }
            },
            destroy: function() {
               this._container.find('.controls-ImagePanel__Button').off('click', this._buttonHandlerInstance);
               this._container.off('mousedown focus', this._blockFocusEvents);
               ImagePanel.superclass.destroy.apply(this, arguments);
            }
         });
      return ImagePanel;
   });
