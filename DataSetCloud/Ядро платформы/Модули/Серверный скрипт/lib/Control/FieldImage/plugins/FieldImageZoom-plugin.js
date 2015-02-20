/**
 * @fileoverview Файл с плагином для FieldImage
 *    - ZoomPlugin
 * @author nefedovao
 */
define("js!SBIS3.CORE.ZoomPlugin", [ "js!SBIS3.CORE.FieldImage" ], function(FieldImage) {

$ws._const.FieldImageZoomPlugin = {
   zoomSteps: [
      0.25,
      0.33,
      0.50,
      0.67,
      0.75,
      0.90,
      1,
      1.10,
      1.25,
      1.50,
      1.75,
      2.00,
      2.50,
      3.00,
      4.00,
      5.00
   ],
   defaultZoom: 1,
   rotateClasses: [
      '',
      'ws-rotate-left ws-rotate-left-top-right',
      'ws-rotate-half-turn',
      'ws-rotate-right'
   ],
   saveRotateDelay: 1400
};

/**
 * Позволяет увеличивать/уменьшать изображение для просмотра
 * @usage Для включения плагина следует использовать опцию {@link zoomEnabled}.
 *
 * @class $ws.proto.FieldImage.ZoomPlugin
 * @extends $ws.proto.FieldImage
 * @plugin
 */
$ws.proto.FieldImage.ZoomPlugin = FieldImage.extendPlugin(/** @lends $ws.proto.FieldImage.ZoomPlugin.prototype */{
   $protected: {
      _options: {
         /**
          * @cfg {Boolean} Активирует плагин увеличения/уменьшения изображения
          * <wiTag group="Управление">
          * По-умолчанию плагин выключен
          */
         zoomEnabled: false,
         /**
          * @cfg {Boolean} Сохранять ли поворот через бизнес-логику
          * <wiTag group="Управление">
          * Елси включено, результат работы будет сохраняться в БД
          */
         saveRotate: false,
         /**
          * @cfg {String} Имя метода, для сохранения результата
          * <wiTag group="Данные">
          * Будет вызван для сохранения результата увеличения/уменьшения в БД
          * @editor MethodBLChooser
          */
         BLObjLoadMethodName: ''
      },
      _zoomElement: undefined,
      _zoomContainer: undefined,
      _zoomImageContainer: undefined,
      _zoomImage: undefined,
      _zoomScale: $ws._const.FieldImageZoomPlugin.defaultZoom,
      _zoomStartScale: $ws._const.FieldImageZoomPlugin.defaultZoom,
      _zoomInElement: undefined,
      _zoomOutElement: undefined,
      _fullScreenElement: undefined,
      _zoomButtons: undefined,
      _fullScreenHandler: undefined,
      _isFullScreen: false,
      _zoomFakeOption: undefined,
      _zoomScaledToContainer: false,
      _rotate: 0,
      _zoomDropDownDeferred: undefined,
      _zoomDropDown: undefined,
      _rotateTimer: undefined,
      _rotateSavedState: 0
   },
   $condition: function(){
      return this._options.zoomEnabled === true;
   },
   /**
    * Инициализация всего
    * @private
    */
   _build: function(){
      this._initDropDownDeferred();
      this._createContainer();
      this._attachDropDown();
      this._bindElements();
      this._initZoomEvents();
      this._declareCommands();
      this._onPluginLoaded('ZoomPlugin');
   },
   /**
    * Создаёт деферред готовности выпадающего списка
    * @private
    */
   _initDropDownDeferred: function(){
      this._zoomDropDownDeferred = new $ws.proto.Deferred();
   },
   /**
    * Создаёт элементы
    * @private
    */
   _createContainer: function(){
      this._container.append('<div class="ws-fieldImage-zoom">' +
         '<div class="ws-fieldImage-zoom-container">' +
            '<div class="ws-fieldImage-zoom-image-container"></div>' +
         '</div>' +
         '<div class="ws-fieldImage-zoom-buttons-container">' +
            '<span class="ws-fieldImage-zoom-button icon-16 icon-Unsuccess icon-disabled" title="Отдалить"></span>' +
            '<span class="ws-fieldImage-zoom-button icon-16 icon-Add icon-disabled" title="Приблизить"></span>' +
            '<div class="ws-fieldImage-zoom-select"></div>' +
            '<span class="ws-fieldImage-zoom-button icon-16 icon-Move2 icon-disabled" title="Вписать"></span>' +
            ($ws._const.compatibility.fullScreen ? '<span class="ws-fieldImage-zoom-button icon-16 icon-NewTab icon-disabled" title="Посмотреть в полноэкранном режиме"></span>' : '') +
            '<span class="ws-fieldImage-zoom-button icon-16 icon-TurnL icon-disabled" title="Повернуть влево"></span>' +
            '<span class="ws-fieldImage-zoom-button icon-16 icon-TurnR icon-disabled" title="Повернуть вправо"></span>' +
         '</div>' +
      '</div>');
   },
   /**
    * Подключает выпадающий список
    * @private
    */
   _attachDropDown: function(){
      var keys = [],
         values = [],
         steps = $ws._const.FieldImageZoomPlugin.zoomSteps,
         self = this;
      for(var i = 0; i < steps.length; ++i){
         keys.push(steps[i]);
         values.push(this._zoomDropDownOptionText(steps[i]));
      }
      $ws.core.attachInstance('Control/Field/FieldDropdown', {
         element: this._container.find('.ws-fieldImage-zoom-select'),
         data: {
            keys: keys,
            values: values
         },
         name: this.getName() + '_dropdown',
         value: $ws._const.FieldImageZoomPlugin.defaultZoom,
         enabled: false,
         handlers: {
            'onAfterLoad': function(){
               this.setEnabled(self._imageReady);
               self._zoomDropDown = this;
               self._zoomDropDownDeferred.callback();
            },
            'onChange': function(event, value){
               self._zoomToScale(value);
            }
         }
      });
   },
   /**
    * Запоминает нужные элементы
    * @private
    */
   _bindElements: function(){
      this._zoomElement = this._container.children('.ws-fieldImage-zoom');
      this._zoomContainer = this._container.find('.ws-fieldImage-zoom-container');
      this._zoomImageContainer = this._container.find('.ws-fieldImage-zoom-image-container');
      this._zoomInElement = this._container.find('.icon-Add');
      this._zoomOutElement = this._container.find('.icon-Unsuccess');
      this._fullScreenElement = this._container.find('.icon-NewTab');
      this._zoomButtons = this._container.find('.ws-fieldImage-zoom-button');
   },
   /**
    * <wiTag group="Управление">
    * Показывает изображение на полный экран, если браузер поддерживает это
    * @command
    */
   toggleFullScreen: function(){
      if( $ws._const.compatibility.fullScreen ){
         if( this._getFullScreenElement() ){
            if( document.cancelFullScreen ){
               document.cancelFullScreen();
            }
            else if( document.mozCancelFullScreen ) {
               document.mozCancelFullScreen();
            }
            else if( document.webkitCancelFullScreen ){
               document.webkitCancelFullScreen();
            }
         }
         else{
            var img = this._zoomElement.get(0);
            if( img.requestFullscreen ){
               img.requestFullscreen();
            }
            else if( img.mozRequestFullScreen ){
               img.mozRequestFullScreen();
            }
            else if( img.webkitRequestFullscreen ){
               img.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
         }
      }
   },
   /**
    * Включает / выключает кнопки зума, в зависимости от доступности
    * @param {Number} scale Масштаб
    * @private
    */
   _toggleZoomButtons: function(scale){
      var steps = $ws._const.FieldImageZoomPlugin.zoomSteps,
         zoomInEnabled = Math.abs(scale - steps[steps.length - 1]) > 1e-6,
         zoomOutEnabled = Math.abs(scale - steps[0]) > 1e-6;
      this._zoomInElement.toggleClass('icon-disabled', !zoomInEnabled).toggleClass('icon-primary action-hover', zoomInEnabled);
      this._zoomOutElement.toggleClass('icon-disabled', !zoomOutEnabled).toggleClass('icon-primary action-hover', zoomOutEnabled);
   },
   /**
    * Текст, который должен быть отображён на опции в выпадающем списке
    * @param {Number} scale Масштаб
    * @returns {string}
    * @private
    */
   _zoomDropDownOptionText: function(scale){
      return Math.round(scale * 100) + '%';
   },
   /**
    * Создаёт новую опцию в селекте, чтобы отображался текущий масштаб
    * @param {Number} scale Какой масштаб у опции
    * @param {jQuery} before Перед какой опции вставлять
    * @private
    */
   _zoomAppendFakeOptions: function(scale, before){
      this._zoomFakeOption = scale;
      this._zoomDropDownDeferred.addCallback(function(){
         this._zoomDropDown.insertOption(scale, this._zoomDropDownOptionText(scale), before);
         this._zoomDropDown.setValue(scale);
      }.bind(this));
   },
   /**
    * Устанавливает текст в селекте, который соответствует текущему масштабу
    * @param {Number} scale Текущий масштаб
    * @private
    */
   _zoomSetSelectValue: function(scale){
      this._zoomDropDownDeferred.addCallback(function(){
         if( this._zoomFakeOption ){
            this._zoomDropDown.removeOption(this._zoomFakeOption);
            this._zoomFakeOption = undefined;
         }
         var steps = $ws._const.FieldImageZoomPlugin.zoomSteps,
            after = steps[0];
         for(var i = 0; i < steps.length; ++i){
            var optionScale = steps[i];
            if( Math.abs(scale - optionScale) < 1e-6 ){
               this._zoomDropDown.setValue(optionScale);
               return;
            }
            else if( optionScale < scale + 1e-6 ){
               after = steps[i + 1];
            }
         }
         this._zoomAppendFakeOptions(scale, after);
      }.bind(this));
   },
   /**
    * Возвращает объект с часто используемыми значениями
    * @param {Boolean} [scaled] Нужны ли размеры изображения с учётом масштаба
    * @return {Object}
    * @private
    */
   _getZoomSizes: function(scaled){
      var containerWidth = this._zoomContainer.width(),
         containerHeight = this._zoomContainer.height(),
         imageWidth = this.getRealWidth(),
         imageHeight = this.getRealHeight();
      if( this._rotate % 2 === 1 ){
         var temp = imageHeight;
         //noinspection JSSuspiciousNameCombination
         imageHeight = imageWidth;
         imageWidth = temp;
      }
      if( scaled ){
         imageWidth *= this._zoomScale;
         imageHeight *= this._zoomScale;
      }
      return {
         containerWidth: containerWidth,
         containerHeight: containerHeight,
         imageWidth: imageWidth,
         imageHeight: imageHeight
      };
   },
   /**
    * Пересчитывает позицию изображения с учётом поворота
    * @param {Object} offset Рассчитанный отступ
    * @param {Object} sizes Объект с расчитанными размерами
    * @private
    */
   _fixRotationPosition: function(offset, sizes){
      if( $ws._const.compatibility.cssTransform ){
         if( this._rotate === 1 ){
            //noinspection JSSuspiciousNameCombination
            offset.left -= sizes.imageHeight;
         }
         else if( this._rotate === 2 ){
            offset.top -= sizes.imageHeight;
            offset.left -= sizes.imageWidth;
         }
         else if( this._rotate === 3 ){
            //noinspection JSSuspiciousNameCombination
            offset.top -= sizes.imageWidth;
         }
      }
   },
   /**
    * Пересчитывает позицию изображения
    * @private
    */
   _zoomReposition: function(){
      var sizes = this._getZoomSizes(true),
         offset = {
            'left': 0,
            'top': 0
         };
      if( sizes.containerWidth > sizes.imageWidth ){
         offset.left = Math.round((sizes.containerWidth - sizes.imageWidth) / 2);
      }
      if( sizes.containerHeight > sizes.imageHeight ){
         offset.top = Math.round((sizes.containerHeight - sizes.imageHeight) / 2);
      }
      //overflow: auto scrollbars fix
      if( sizes.imageWidth <= sizes.containerWidth && sizes.imageHeight <= sizes.containerHeight ){
         this._zoomContainer.css('overflow', 'hidden');
      }
      else{
         this._zoomContainer.css('overflow', '');
      }
      this._fixRotationPosition(offset, sizes);
      this._zoomImageContainer.css(offset);
   },
   /**
    * Возвращает функцию, которая будет пересчитывать позицию изображения
    * @returns {Function}
    * @private
    */
   _getRepositionMethod: function(){
      return this._zoomReposition;
   },
   /**
    * Масштабирует в указанном значении
    * Требуется изменение скролла для лучшей работы, поэтому много вычислений
    * @param {Number} scale Масштаб
    * @private
    */
   _zoomToScale: function(scale){
      this._zoomScale = scale;
      this._zoomScaledToContainer = false;
      var img = this._container.find('img'),
         oldWidth = img.width(),
         newWidth = Math.round(this.getRealWidth() * scale),
         containerWidth = this._zoomContainer.width() / 2,
         xScale = newWidth / oldWidth,
         prevScrollLeft = this._zoomContainer.scrollLeft(),
         oldHeight = img.height(),
         newHeight = Math.round(this.getRealHeight() * scale),
         containerHeight = this._zoomContainer.height() / 2,
         yScale = newHeight / oldHeight,
         prevScrollTop = this._zoomContainer.scrollTop();
      this._zoomContainer.css('overflow', 'hidden');
      this._zoomReposition();
      img.width(newWidth);
      img.height(newHeight);
      // have to reposition image - center point must be the same one
      this._zoomContainer.scrollLeft((prevScrollLeft + containerWidth) * xScale - containerWidth);
      this._zoomContainer.scrollTop((prevScrollTop + containerHeight) * yScale - containerHeight);
      this._zoomContainer.css('overflow', '');
      this._zoomSetSelectValue(scale);
      this._toggleZoomButtons(scale);
   },
   /**
    * Увеличивает/уменьшает зум по шагам из <b>$ws._const.FieldImageZoomPlugin.zoomSteps</b>. Учитывает ситуацию, когда масштаб "между" шагами.
    * @param {Number} by На сколько "шагов" менять масштаб, в большинстве случаев - 1/-1
    * @private
    */
   _zoomModify: function(by){
      var steps = $ws._const.FieldImageZoomPlugin.zoomSteps,
         len = steps.length,
         scale = this._zoomScale,
         newStep,
         lastCorrect;
      for(var i = 0; i < steps.length; ++i){
         if( Math.abs(scale - steps[i]) < 1e-6 ){
            newStep = i + by;
         }
         else if( scale + 1e-6 > steps[i] ){
            lastCorrect = i;
         }
      }
      if( newStep === undefined ){
         if( by > 0 ){
            newStep = lastCorrect + by;
         }
         else{
            newStep = lastCorrect + 1 + by;
         }
      }
      if( newStep >= len ){
         newStep = len - 1;
      }
      else if( newStep < 0 ){
         newStep = 0;
      }
      this._zoomToScale($ws._const.FieldImageZoomPlugin.zoomSteps[newStep]);
   },
   /**
    * Уменьшает изображение
    * @command
    */
   zoomOut: function(){
      this._zoomModify(-1);
      return true;
   },
   /**
    * <wiTag group="Управление">
    * Увеличивает изображение
    * @command
    */
   zoomIn: function(){
      this._zoomModify(1);
      return true;
   },
   /**
    * <wiTag group="Управление">
    * Возвращает масштаб 100%
    * @command
    */
   resetZoom: function(){
      this._zoomToScale(1);
      return true;
   },
   /**
    * <wiTag group="Управление">
    * Масштабирует картинку к размерам контейнера
    * @command
    */
   zoomToContainer: function(){
      var sizes = this._getZoomSizes(),
         steps = $ws._const.FieldImageZoomPlugin.zoomSteps,
         zoom = Math.min(sizes.containerWidth / sizes.imageWidth, sizes.containerHeight / sizes.imageHeight);
      if( zoom > steps[steps.length - 1] ){
         zoom = steps[steps.length - 1];
      }
      if( zoom < steps[0] ){
         zoom = steps[0];
      }
      this._zoomToScale(zoom);
      this._zoomScaledToContainer = true;
   },
   /**
    * Поворачивает изображение до нужной позиции
    * @param {Number} to Поворот (0-3)
    * @private
    */
   _rotateTo: function(to){
      var image = this._getImage();
      image.removeClass($ws._const.FieldImageZoomPlugin.rotateClasses[this._rotate]);
      this._rotate = to;
      image.addClass($ws._const.FieldImageZoomPlugin.rotateClasses[this._rotate]);
      this._zoomReposition();
      this._rotateStartSave();
   },
   /**
    * Поворачивает на опеределённое число шагов по 90 градусов
    * @param {Number} by На сколько шагов поворачивать
    * @private
    */
   _rotateBy: function(by){
      this._rotateTo((this._rotate + by + 4) % 4);
   },
   /**
    * Поворачивает изображение влево
    * <wiTag group="Управление">
    * @command
    */
   rotateLeft: function(){
      this._rotateBy(1);
   },
   /**
    * Поворачивает изображение вправо
    * <wiTag group="Управление">
    * @command
    */
   rotateRight: function(){
      this._rotateBy(-1);
   },
   /**
    * Обработчик для кнопок
    * @param {Function} callback Функция, которую нужно вызвать
    * @returns {Function}
    * @private
    */
   _zoomButtonClick: function(callback){
      var self = this;
      return function(event){
         if( event.type === 'click' && !$(this).hasClass('icon-disabled') ){
            callback.call(self);
         }
         else{
            $(this).trigger('wsmousedown');
         }
         event.preventDefault();
         return false;
      };
   },
   /**
    * Обработчик конца жеста
    * @private
    */
   _zoomGestureEnd: function(){
      this._zoomContainer.unbind('.wszoom');
   },
   /**
    * Ограничивает указанный масштаб в пределах допустимого
    * @param {Number} scale Масштаб
    * @returns {Number}
    * @private
    */
   _trimScale: function(scale){
      var steps = $ws._const.FieldImageZoomPlugin.zoomSteps;
      if( scale < steps[0] ){
         scale = steps[0];
      }
      else if( scale > steps[steps.length - 1] ){
         scale = steps[steps.length - 1];
      }
      return scale;
   },
   /**
    * Изменение жеста. Используется только .scale
    * @param {Object} event jQuery-событие
    * @returns {boolean}
    * @private
    */
   _zoomGestureChange: function(event){
      var scale = event.originalEvent.scale;
      if( scale !== undefined ){
         var newScale = this._trimScale(this._zoomStartScale * scale);
         if( Math.abs(newScale - this._zoomScale) > 1e-6 ){
            this._zoomToScale(newScale);
            event.preventDefault();
            event.stopPropagation();
            return false;
         }
      }
      return true;
   },
   /**
    * Начало жеста
    * @private
    */
   _zoomGestureStart: function(){
      //Запоминает масштаб в начале жеста, так как значения .scale мы будем получать именно относительно его
      this._zoomStartScale = this._zoomScale;
      this._zoomContainer.bind('gesturechange.wszoom', this._zoomGestureChange.bind(this));
      this._zoomContainer.bind('gestureend.wszoom', this._zoomGestureEnd.bind(this));
   },
   /**
    * Возвращает элемент, который сейчас показывается полноэкранно
    * @returns {HTMLElement|null|undefined}
    * @private
    */
   _getFullScreenElement: function () {
      return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
   },
   /**
    * Обработчик смены состояния полноэкранного режима на нашем элементе
    * @param {Boolean} isFullScreen Находимся ли мы теперь в полноэкранном режиме
    * @private
    */
   _zoomPostFullScreen: function(isFullScreen){
      this._isFullScreen = isFullScreen;
      if( isFullScreen ){
         this._zoomElement.addClass('full-screen').attr('tabindex', '0').focus();
      }
      else{
         this._zoomElement.removeClass('full-screen').removeAttr('tabindex');
         if( !this._imageReady ){
            this._fullScreenElement.removeClass('icon-primary action-hover').addClass('icon-disabled');
         }
      }
      if( this._zoomScaledToContainer ){
         this.zoomToContainer();
      }
      else{
         this._zoomReposition();
      }
      this._zoomDropDownDeferred.addCallback(function(){
         this._zoomDropDown.toggleOptionsToContainer(isFullScreen);
      }.bind(this));
   },
   /**
    * Изменено состояние показа в полноэкранном режиме
    * @private
    */
   _fullScreenChanged: function(){
      var element = this._getFullScreenElement();
      if( $(element).is(this._zoomElement) ){ // toggle fullscreen on
         this._zoomPostFullScreen(true);
      }
      else if( this._zoomElement.hasClass('full-screen') ){ // toggle off
         this._zoomPostFullScreen(false);
      }
   },
   /**
    * Обработчик нажатия клавиши
    * @param {Object} event jQuery-событие
    * @private
    */
   _zoomKeyDown: function(event){
      if( event.which === $ws._const.key.esc ){
         event.stopPropagation();   //disable window close
      }
   },
   /**
    * Обрабатывает клик на контейнере
    * @param {Object} event jQuery-событие
    * @private
    */
   _zoomContainerClick: function(event){
      event.stopImmediatePropagation();
   },
   /**
    * Иницаилизирует события, которые мы будем обрабатывать
    * @private
    */
   _initZoomEvents: function(){
      this._fullScreenElement.bind('click mousedown', this._zoomButtonClick(this.toggleFullScreen));
      this._zoomOutElement.bind('click mousedown', this._zoomButtonClick(this.zoomOut));
      this._zoomInElement.bind('click mousedown', this._zoomButtonClick(this.zoomIn));
      this._container.find('.icon-Move2').bind('click mousedown', this._zoomButtonClick(this.zoomToContainer));
      this._container.find('.icon-TurnL').bind('click mousedown', this._zoomButtonClick(this.rotateLeft));
      this._container.find('.icon-TurnR').bind('click mousedown', this._zoomButtonClick(this.rotateRight));
      this._zoomContainer.bind('gesturestart', this._zoomGestureStart.bind(this));
      if( $ws._const.compatibility.fullScreen ){
         this._container.bind('keydown', this._zoomKeyDown.bind(this));
         this._zoomContainer.bind('click', this._zoomContainerClick.bind(this));
         $(document).bind('fullscreenchange mozfullscreenchange webkitfullscreenchange', this._fullScreenHandler = this._fullScreenChanged.bind(this));
      }
   },
   /**
    * Возвращает элемент, куда нужно положить изображение
    * @returns {jQuery}
    * @private
    */
   _getImageContainer: function(){
      return this._zoomImageContainer;
   },
   /**
    * Возвращает элемент изображения
    * @returns {jQuery}
    * @private
    */
   _getImage: function(){
      return this._container.find('img');
   },
   /**
    * Публикует команды
    * @private
    */
   _declareCommands: function(){
      $ws.single.CommandDispatcher.declareCommand(this, 'zoomIn', this.zoomIn);
      $ws.single.CommandDispatcher.declareCommand(this, 'zoomOut', this.zoomOut);
      $ws.single.CommandDispatcher.declareCommand(this, 'resetZoom', this.resetZoom);
      $ws.single.CommandDispatcher.declareCommand(this, 'zoomToContainer', this.zoomToContainer);
      $ws.single.CommandDispatcher.declareCommand(this, 'rotateLeft', this.rotateLeft);
      $ws.single.CommandDispatcher.declareCommand(this, 'rotateRight', this.rotateRight);
      if( $ws._const.compatibility.fullScreen ){
         $ws.single.CommandDispatcher.declareCommand(this, 'toggleFullScreen', this.toggleFullScreen);
      }
   },
   /**
    * Метод уничтожения контрола
    * <wiTag noShow>
    */
   destroy: function(){
      if( this._fullScreenHandler ){
         $(document).unbind('fullscreenchange mozfullscreenchange webkitfullscreenchange', this._fullScreenHandler);
      }
      this._rotateSave();
   },
   /**
    * Выключает кнопки. Не выключает кнопку полноэкранного режима, если сейчас находимся в полноэкранном режиме
    * @private
    */
   _disableButtons: function(){
      var buttons = this._zoomButtons.filter('.icon-primary');
      if( this._isFullScreen ){
         buttons = buttons.filter(':not(.icon-NewTab)');
      }
      buttons.removeClass('icon-primary action-hover').addClass('icon-disabled');
      this._zoomDropDownDeferred.addCallback(function(){
         this._zoomDropDown.setEnabled(false);
      }.bind(this));
   },
   /**
    * Дополнительно к обычному удалению изображения мы должны очистить масштаб, поворот
    */
   removeImage: function(){
      this._zoomScale = $ws._const.FieldImageZoomPlugin.defaultZoom;
      this._rotate = 0;
      this._zoomScaledToContainer = false;
      this._disableButtons();
      this._zoomDropDownDeferred.addCallback(function(){
         this._zoomDropDown.setValue($ws._const.FieldImageZoomPlugin.defaultZoom);
      }.bind(this));
   },
   /**
    * Делает кнопки активными при загрузке изображения
    * @private
    */
   _rebuildImage: function(){
      if( !this._imageReady ){
         return;
      }
      this._zoomButtons.filter('.icon-disabled').removeClass('icon-disabled').addClass('icon-primary action-hover');
      this._zoomDropDownDeferred.addCallback(function(){
         this._zoomDropDown.setEnabled(true);
      }.bind(this));
      this.zoomToContainer();
   },
   /**
    * Подключился какой-то плагин
    * @param pluginName
    * @private
    */
   _onPluginLoaded: function(pluginName){
      if( pluginName === 'CropPlugin' ){
         this.subscribe('onCropInit', this._zoomFreezeImage);
      }
   },
   /**
    * Выключает манипуляции изображением - идёт обрезание изображения
    * @private
    */
   _zoomFreezeImage: function(){
      this._rotateTo(0);
      this._disableButtons();
   },
   /**
    * Очищает таймер сохранения
    * @private
    */
   _rotateClearTimer: function(){
      if( this._rotateTimer ){
         clearTimeout(this._rotateTimer);
         this._rotateTimer = undefined;
      }
   },
   /**
    * Делает вызов к бизнес-логике для поворота изображения
    * @private
    */
   _rotateSave: function(){
      this._rotateClearTimer();
      if( this._rotateSavedState !== this._rotate && this._options.saveRotate ){
         var linkedObject = this._options.dataSource.readerParams.linkedObject,
            idSource = this._options.filterParams["ИдО"],
            linkedFieldName = idSource.fieldName,
            writeMethod = this._options.BLObjLoadMethodName,
            readMethod = linkedObject + '.' + this._options.dataSource.readerParams.queryName,
            ID,
            degrees = (4 - (this._rotate - this._rotateSavedState + 4) % 4) * 90,
            send;
         if( idSource instanceof Object ){
            ID = this.getLinkedContext().getValue(linkedFieldName);
         }
         else{
            ID = idSource;
         }
         send = {
            readMethod: readMethod,
            writeMethod: writeMethod,
            degrees: degrees,
            ID: ID
         };
         this._rotateSavedState = this._rotate;

         var blObject = new $ws.proto.BLObject("ImageEditingPython"),
            deferred = blObject.call("ПовернутьФото", send, $ws.proto.BLObject.RETURN_TYPE_ASIS);
         this.getTopParent().addPendingOperation(deferred);
      }
   },
   /**
    * Начинает сохранение поворота
    * @private
    */
   _rotateStartSave: function(){
      this._rotateClearTimer();
      this._rotateTimer = setTimeout(this._rotateSave.bind(this), $ws._const.FieldImageZoomPlugin.saveRotateDelay);
   }
});

});