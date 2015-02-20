/**
 * Модуль "Компонент кнопка".
 *
 * @description
 */
define("js!SBIS3.CORE.ButtonAbstract", ["js!SBIS3.CORE.Control", "css!SBIS3.CORE.ButtonAbstract", "css!SBIS3.CORE.LinkButton"], function( Control ) {

   "use strict";

   /**
    * Абстрактная кнопка
    *
    * @class $ws.proto.ButtonAbstract
    * @extends $ws.proto.DataBoundControl
    * @ignoreOptions value validators
    * @ignoreOptions className
    * @ignoreOptions renderStyle
    * @ignoreOptions saveState
    */
   $ws.proto.ButtonAbstract = Control.DataBoundControl.extend(/** @lends $ws.proto.ButtonAbstract.prototype */{
      /**
       * @event onActivated Происходит при активации кнопки (клик мышкой, кнопки клавиатуры)
       * @param {$ws.proto.EventObject} eventObject дескриптор события
       * @param {Boolean} pressed Нажата ли кнопки (при использовании опции press)
       * @example
       * <pre>
       *    onButtonClick: function(event){
       *       var list = this.getChildControlByName('listOfPersons');
       *       list.sendCommand('newItem');
       *    }
       * </pre>
       */
      $protected: {
         _aliasForContent : "caption",
         _keysWeHandle: [
            $ws._const.key.enter,
            $ws._const.key.esc,
            $ws._const.key.space
         ],
         _tooltipSettings: {
            handleFocus: false
         },
         _options : {
            /**
             * @cfg {String} Текст на кнопке
             * <wiTag group="Отображение">
             * Текст, который будет отображён на кнопке.
             * @example
             * <pre>
             *    <options>
             *      <option name="caption">Сохранить</option>
             *      <option name="id">1</option>
             *    </options>
             * </pre>
             * @translatable
             * @see image
             * @see defaultButton
             * @see renderStyle
             */
            caption: '',
            /**
             * @cfg {String} Путь к изображению.
             * <wiTag group="Отображение">
             * Путь до иконки, которая будет отображена на кнопке.
             * Также поддерживаются хелперы:
             *    - ws:/path/inside/current/theme.png - заменяется на путь внутри папки текущей темы. Например: /ws/img/themes/wi_scheme/path/inside/current/theme.png
             *    - sprite:icon16 icon-Alert icon-done - иконка из набора общих иконок. См. гайд по общим иконкам
             * @example
             * <pre>
             *    <option name="image">sprite:icon-16 icon-Unlock icon-primary</option>
             * </pre>
             * @editor ImageEditor
             * @see imageEditor
             */
            image : '',
            /**
             * @cfg {String} Выравнивание изображения
             * <wiTag group="Отображение">
             * Выравнивание изображения.
             * @example
             * <pre>
             *     <option name="imageAlign">right</option>
             * </pre>
             * @variant left слева
             * @variant right справа
             * @see image
             */
            imageAlign: 'left',
            /**
             * @cfg {Boolean} Является ли кнопкой по умолчанию
             * <wiTag group="Управление">
             * Является кнопкой по умолчанию для диалога. В этом случае активация кнопки произойдет при нажатии Enter в любом поле ввода диалога, а не только по клику на саму кнопку.
             * @example
             * <pre>
             *     <option name="defaultButton">true</option>
             * </pre>
             * @see caption
             */
            defaultButton: false,
            /**
             * @cfg {String} Стиль отображения элемента
             * Как правило используется для кнопок: обычная или в виде ссылки.
             * @deprecated Будет удалено в 3.7.1. Необходимо в зависимости от потребности просто создавать один из контролов (Button или LinkButton)
             * @variant classic классическая - стандартное отображение в виде кнопки
             * @variant asLink отображение кнопки ввиде ссылки
             * @see caption
             */
            renderStyle: 'classic',
            cssClassName: 'ws-field-button'
         },
         _hasProcess: false,
         _isSpriteImage: false,
         _text: undefined,
         _bodyContainer: undefined,
         _menuControl: undefined,
         _onDblClickHandler: undefined,
         _defaultPlace : true
      },
      $constructor: function(cfg){
         //В связи с новой логикой enable/disable контрола в конструкторе сразу ищем DOM-элементы

         this._publish('onActivated');

         // TODO выпилить? Это не будет видно в dotTplFn
         if(cfg.img !== undefined)
            this._options.image = cfg.img;
         if(cfg.imgAlign !== undefined)
            this._options.imageAlign = cfg.imgAlign;
         if(cfg.isDefault !== undefined)
            this._options.defaultButton = !!cfg.isDefault;

         if (typeof this._options.image !== 'string') {
            this._options.image = '';
         }

         if (this._isCorrectContainer()) {
            this._container.bind('selectstart', false);
            this._redraw();
         }
         this._onDblClickHandler = function(event) {
            event.stopPropagation();
         };
         this._container.bind('dblclick', this._onDblClickHandler);
      },
      /**
       * Делает кнопку дефолтной или отменяет таковое состояние
       * <wiTag group="Управление">
       * @param {Boolean} [isDefault] Если не указан, считается true
       * @deprecated используйте setDefaultButton
       */
      setDefault: function(isDefault) {
         this.setDefaultButton(isDefault);
      },
      /**
       * Делает кнопку дефолтной или отменяет таковое состояние
       * <wiTag group="Управление">
       * @param {Boolean} [isDefault] Если не указан, считается true
       * <pre>
       *    var btn = $ws.single.ControlStorage.getByName("myButton")
       *    btn.setDefault(false);
       * </pre>
       */
      setDefaultButton: function(isDefault){
         if(isDefault === undefined)
            isDefault = true;
         if(this._options.defaultButton !== isDefault) {
            this._container.toggleClass('ws-default-button', isDefault);
            if(isDefault)
               this._registerDefaultButton();
            else
               this._unregisterDefaultButton();
            this._options.defaultButton = isDefault;
         }
      },
      /**
       * Является ли кнопка кнопкой по умолчанию
       * <wiTag group="Управление">
       * @returns {boolean}
       */
      isDefaultButton: function(){
         return this._options.defaultButton;
      },
      _unregisterDefaultButton: function() {
         var parent = this.getParent();
         if(parent && parent.unregisterDefaultButton)
            parent.unregisterDefaultButton(this);
      },
      _registerDefaultButton: function() {
         var parent = this.getParent();
         if(parent && parent.registerDefaultButton)
            parent.registerDefaultButton(this);
      },

      _redraw: function() {
         this._bodyContainer = this._options.renderStyle === 'asLink' ? this._container.find('.ws-link-body') : this._container;
         this._applyImageChange();
         if (this._options.defaultButton) {
            this._registerDefaultButton();
         }
      },
      _onClickHandler: function(event) {
         if (this.isEnabled()) {
            $ws.proto.ButtonAbstract.superclass._onClickHandler.apply(this, arguments);
            this._activate(event);
         }
      },
      /**
       * Подписывается на клик по кнопке
       * @private
       */
      _keyboardHover: function(event){
         if (this.isEnabled()) {
            if (event.which == $ws._const.key.enter || event.which == $ws._const.key.space) {
               this._activate(event);
               event.stopImmediatePropagation();
               return false;
            } else if (event.which === $ws._const.key.esc && $ws.helpers.instanceOfModule(this._menuControl, 'SBIS3.CORE.Menu') && this._menuControl.isShow()) {
               this._menuControl.hide();
               return false;
            }
         }
         return true;
      },
      /**
       * Отображает начало/конец процесса
       * @param {Boolean} process Начался ли
       * @private
       */
      _toggleProcess: function(process){
         this._hasProcess = process;
         this.setEnabled(!process);
         this._applyImageChange();
      },
      /**
       * Происходит при активации кнопки - сообщает о нажатии на кнопку, выполняет необходимые действия
       * @private
       */
      _activate: $ws.helpers.forAliveOnly(function(event) {
         // Шилов Д.А. Поскольку кнопки исторически не умеют слать параметры в комманды, запихнем все в овнера
         // Но если хочется, конечно можно и передать параметр )
         var
            self = this,
            owner = this.getOwner(),
            linkedContext = this.getLinkedContext(),
            ownerContext = owner ? owner.getLinkedContext() : null;

         if (linkedContext) {
            linkedContext.setValue('Event', event);
         }

         if (ownerContext) {
            ownerContext.setValue('Event', event);
         }

         var result = this._notify('onActivated');
         if(!this.isDestroyed() && result instanceof $ws.proto.Deferred){
            this._toggleProcess(true);
            result.addBoth(function(result) {
               self._toggleProcess(false);
               return result;
            });
         }
      }),
      _onContextValueReceived: function(ctxVal) {
         if (ctxVal) {
            this.setCaption(ctxVal);
         }
      },
      _insertImage : function(imgTag){
         if (this._options.imgAlign !== 'right' && this._options.imageAlign !== 'right') {
            this._bodyContainer.prepend(imgTag);
         } else {
            this._bodyContainer.append(imgTag);
         }
         return imgTag;
      },
      _setRedIcon : function(spriteClasses){
         return spriteClasses;
      },
      _applyImageChange: function() {
         var imgTag, spritePos, isLeft, isRight, imgTagName,
            image,
            imgCont;

         if(this._hasProcess){
            image = $ws.helpers.resolveComponentPath('SBIS3.CORE.Button/resources/images/process.gif');
         }
         else{
            image = this._options.image;
         }

         this._isSpriteImage = (image.indexOf('sprite:') !== -1);

         imgTag = this._container.find('.ws-button-image');
         imgCont = imgTag.find('.ws-button-image-container');

         if(image !== '') {
            // Если ставим картинку, тэг уже есть, но новый будет другого типа (файл -> спрайт или наоборот)
            if(this._isSpriteImage && imgCont.length || !this._isSpriteImage && !imgCont.length) {
               // Уберем имеющиеся, пересоздадим
               imgTag.empty().remove().length = 0;
            }
         }

         if (imgTag.length === 0) {
            if (image !== '') {
               if (this._isSpriteImage) {
                  imgTag = $('<div class="ws-button-image ws-hover-target"/>');
                  imgCont = this._insertImage(imgTag);
               } else {
                  imgTag = this._insertImage($('<div class="ws-button-image ws-button-image-wrapper ws-hover-target"/>'));
                  imgCont = $('<img class="ws-button-image-container" onload=\"$(this).parent().toggleClass(\'icon-offset\', this.height === 16);\"/>').appendTo(imgTag);
               }
            }
         }
         else if( image === "" ){
            imgTag.remove();
            this._container
               .removeClass('ws-button-image-left')
               .removeClass('ws-button-image-right');
            return;
         }
         if(this._isSpriteImage){
            spritePos = image.indexOf('sprite:');
            var currentSpriteClass = imgTag.data('current-sprite-class');
            if(currentSpriteClass)
               imgTag.removeClass(currentSpriteClass);
            var spriteClasses = this._setRedIcon(image.substr(spritePos + 'sprite:'.length).replace(/_/g, ' '));
            imgTag.addClass(spriteClasses);
            imgTag.data('current-sprite-class', spriteClasses);
         }
         else {
            imgCont.attr('src', $ws.helpers.processImagePath(image));
         }
         if (!image) {
            isLeft = isRight = false;
         } else {
            isRight = this._options.imageAlign === 'right';
            isLeft = !isRight;
         }
         this._container
            .toggleClass('ws-button-image-left', isLeft)
            .toggleClass('ws-button-image-right', isRight);
         if (this._options.renderStyle === 'asLink') {
            if (this._container.find('.ws-button-caption').length && this._options.imageAlign === 'right') {
               imgTag.appendTo(this._bodyContainer);
            } else {
               imgTag.prependTo(this._bodyContainer);
            }
         }
      },
      /**
       * Смена изображения на кнопке.
       * <wiTag group="Отображение">
       * @param {String} path Путь относительно корня сайта. Также поддерживаются следующие хелперы:
       *   - ws:/path/inside/current/theme.png - заменяется на путь внутри папки текущей темы. Например: /ws/img/themes/wi_scheme/path/inside/current/theme.png
       *   - sprite:icon16 icon-Alert icon-done - иконка из набора общих иконок. См. гайд по общим иконкам
       * <pre>
       *    var btn = $ws.single.ControlStorage.getByName("myButton");
       *    btn.setImage(sprite:icon16 icon-Alert icon-done);
       * </pre>
       */
      setImage: function(path) {
         this._options.image = path.replace(/&amp;/gi, '&');
         this._applyImageChange();
      },
      /**
       * Вернет отображается ли на кнопке иконка
       * <wiTag group="Отображение">
       * <pre>
       *    var btn = $ws.single.ControlStorage.getByName("myButton");
       *    if (btn.hasImage()){
       *       btn.setImage("sprite:icon16 icon-Alert icon-done");
       *    }
       * </pre>
       */
      hasImage: function(){
         return !!this._options.image;
      },
      /**
       * Вернет иконку кнопки
       * <wiTag group="Отображение">
       * <pre>
       *    var btn = $ws.single.ControlStorage.getByName("myButton");
       *    if (/icon-Alert/g.test(btn.getImage())){
       *       btn.setImage("sprite:icon16 icon-Alert icon-done");
       *    }
       * </pre>
       * @return {String} иконка
       */
      getImage: function(){
         return this._options.image;
      },
      /**
       * Устанавливает выравнивание изображения.
       * <wiTag group="Отображение">
       * @param {String} align Выравнивание изображения. Поддерживаются значения: 'left', 'right' или 'undertext'
       * <pre>
       *    var btn = $ws.single.ControlStorage.getByName("myButton");
       *    if (btn.hasImage() && btn.getCaption().length){
       *       btn.setImageAlign("undertext");
       *    }
       * </pre>
       */
      setImageAlign: function(align) {
         this._options.imageAlign = align;
         this._applyImageChange();
      },
      /**
       * Получить положение изображения на кнопке.
       * <wiTag group="Отображение">
       * @return {String} align Положение ({'left','right','undertext'})
       */
      getImageAlign: function() {
         return this._options.imageAlign;
      },
      /**
       * Меняет текст на кнопке
       * <wiTag group="Отображение">
       * @param {String} caption подпись на кнопке
       * <pre>
       *    var btn = $ws.single.ControlStorage.getByName("myButton");
       *    btn.setCaption("Кликни меня!");
       * </pre>
       */
      setCaption: function(caption) {
         if(caption === undefined || caption === null || caption === false){
            caption = '';
         }
         else if(typeof(caption) !== 'string'){
            caption = caption + '';
         }

         var captionCont = this._container.find('.ws-button-caption');
         if (caption.length) {
            if (!captionCont.length) {
               captionCont = $('<div class="ws-button-caption"/>');
               if (this._options.imgAlign !== 'right' && this._options.imageAlign !== 'right') {
                  this._bodyContainer.append(captionCont);
               } else {
                  this._bodyContainer.prepend(captionCont);
               }
            }
            captionCont.text(caption);
         } else if (captionCont.length) {
            captionCont.detach().remove();
         }
         this._options.caption = caption;
      },
      /**
       * Возвращает текст на кнопке
       * <wiTag group="Отображение">
       * <pre>
       *    var btn = $ws.single.ControlStorage.getByName("myButton");
       *    btn.getCaption("Кликни меня!");
       * </pre>
       * @return {String}
       */
      getCaption: function(){
         return this._options.caption;
      },
      _setEnabled : function(enable){
         this._container.toggleClass('ws-hover-target', this.isEnabled());
         $ws.proto.ButtonAbstract.superclass._setEnabled.apply(this, arguments);
      },
      destroy: function(){
         this._container.unbind('dblclick', this._onDblClickHandler);
         $ws._const.$win.unbind('scroll.button' + this.getId());
         $ws.proto.ButtonAbstract.superclass.destroy.apply(this, arguments);
      }
   });

   return $ws.proto.ButtonAbstract;

});
