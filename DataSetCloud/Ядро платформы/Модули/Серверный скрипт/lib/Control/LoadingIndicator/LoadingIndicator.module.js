/**
 * Модуль "Компонент индикатор".
 *
 * @description
 */
define('js!SBIS3.CORE.LoadingIndicator',
   [
      'js!SBIS3.CORE.Control',
      'html!SBIS3.CORE.LoadingIndicator',
      'js!SBIS3.CORE.Window',
      'js!SBIS3.CORE.ProgressBar',
      'i18n!SBIS3.CORE.LoadingIndicator',
      'css!SBIS3.CORE.LoadingIndicator'
   ],
   function( Control, dotTplFn, Window, ProgressBar, rk ) {

   'use strict';

    var IndicatorsWindow = Window.extend({
       $protected : {
          _isIndicator: true,
          _isIndicatorVisible: true,
          _options: {
             resizable  : false,
             border     : false,
             autoHeight : true,
             autoWidth  : true
          }
       },
       isMovableToTop: function() {
          var
             result = true,
             stack = $ws.single.WindowManager.getStack();
          for(var i = stack.length - 1; i >= 0; i--) {
             var stackItem = stack[i];
             if(stackItem.window._isIndicator) {
                if(stackItem.window === this) {
                   // Имеющийся индикатор. Результат зависит от того, видели мы раньше индикатор или нет.
                   return result;
                } else if(stackItem.visible()) {
                   // Мы встретили видимый индикатор.
                   result = false;
                } else {
                   // Мы встретили скрытый индикатор.
                   result = null;
                }
             }
          }
          // Новый индикатор, вставляем в стек.
          return true;
       }
    });
   /**
    * @class $ws.proto.LoadingIndicator
    * @extends $ws.proto.Control
    * @control
    * @category Decorate
    */
    var LoadingIndicator = Control.Control.extend(/** @lends $ws.proto.LoadingIndicator.prototype */{
      $protected: {
         _loadingPic: '',        //контейнер для картинки
         _loadingIndicator: '',  //контейнер для текста, содержит контейнер с картинкой
         _loadingContainer: '',  //контейнер текста индикатора и картинки загрузки
         _loadingText: '',       //текст индикатора
         _picture: '',           //картинка, используется для смены src в методе
         _myWindow: '',          //окно, если нужно
         _myProgressBar: null,
         _progressBarContainer:'',
         _windowHeight: undefined,
         _windowWidth: undefined,
         _isVisible: false,
         _options: {
            /**
             * @cfg {String} Сообщение индикатора
             * <wiTag group="Данные">
             * Опция задаёт текст, выводимый пользователю индикатором.
             * @example
             * Создание индикатора загрузки со своим ообщением:
             * <pre>
             *     var ind = new LoadingIndicator ({
             *        //зададим текст выводимого пользователю сообщения
             *        message: 'Ждите, идёт сохранение документа...'
             *     });
             *     setTimeout(function(){
             *        ind.hide();
             *     }, 2000);
             * </pre>
             * @see setMessage
             * @translatable
             */
            message: rk('Загрузка'),
            /**
             * @cfg {String} Картинка индикатора
             * <wiTag group="Данные">
             * Опция замены картинки индикатора загрузки. Вместо стандартной иконки можно указать свою картинку
             * или файл с расширением *.gif.
             * @example
             * Созданием индикатора загрузки с заменой стандартной иконки:
             * <pre>
             *     var ind = new LoadingIndicator ({
             *        message: 'Ждите, идёт сохранение документа...',
             *        //указываем путь до картинки относительно корня сайта, т.е. до папки куда конвертируем ресурсы
             *        loadingPicture:'/resources/Indikator_zagruzki/Time.png'
             *     });
             *     setTimeout(function(){
             *        ind.hide();
             *     }, 2000);
             * </pre>
             * @see isShowLoadingPicture
             * @see setImg
             */
            loadingPicture: $ws.helpers.getImagePath('AreaAbstract|ajax-loader-indicator.gif'),
            /**
             * @cfg {Boolean} Показывать ли картинку
             * <wiTag group="Управление">
             * Опция задаёт наличие/отсутствие картинки индикатора загрузки.
             * Возможные значения:
             * <ol>
             *    <li>true - показывать картинку;</li>
             *    <li>false - не показывать, будет только текст без стандартной иконки.</li>
             * </ol>
             * @example
             * Создание индикатора загрузки только с сообщением:
             * <pre>
             *     var ind = new LoadingIndicator ({
             *        message: 'Ждите, идёт сохранение документа...',
             *        //отключаем картинку индикатора загрузки
             *        isShowLoadingPicture: false
             *     });
             *     setTimeout(function(){
             *        ind.hide();
             *     }, 2000);
             * </pre>
             * @see loadingPicture
             * @see setImg
             * @see message
             */
            isShowLoadingPicture: true,
            /**
             * @cfg {Boolean} Выводить ли индикатор в отдельном окне
             * <wiTag group="Управление">
             * Возможные значения:
             * <ol>
             *    <li>true - выводить индикатор в отдельном окне;</li>
             *    <li>false - выводить индикатор в этом же окне. Необходимо позаботиться об элементе, на котором отрисовывать индикатор.</li>
             * </ol>
             * @example
             * Создание индикатора загрузки в том же окне:
             * <pre>
             *     var ind = new LoadingIndicator ({
             *        message: 'Ждите, идёт сохранение документа...',
             *        //отменяем вывод индикатора в отдельном окне
             *        showInWindow: false,
             *        //задаём элемент, на котором будет отрисован индикатор. Необходимо создать заранее
             *        element: 'loadingIndicator'
             *     });
             *     setTimeout(function(){
             *        ind.hide();
             *     }, 2000);
             * </pre>
             * @see modal
             * @see getWindow
             */
            showInWindow: true,
            /**
             * @cfg {Number} Высота индикатора
             * <wiTag group="Данные">
             * @see width
             */
            height: 57,
            /**
             * @cfg {Number|String} Ширина индикатора
             * <wiTag group="Данные">
             * @see height
             */
            width: '100%',
            /**
             * @cfg {Boolean} Модален ли индикатор
             * <wiTag group="Данные">
             * Работает только для индикатора, выводимого в отдельном окне.
             * Возможные значения:
             * <ol>
             *    <li>true - индикатор модален;</li>
             *    <li>false - не модален.</li>
             * </ol>
             * @example
             * Создание индикатора загрузки в немодальном окне:
             * <pre>
             *     var ind = new LoadingIndicator ({
             *        message: 'Ждите, идёт сохранение документа...',
             *        showInWindow: true,
             *        //отменяем модальность окна индикатора загрузки
             *        modal: false
             *     });
             *     setTimeout(function(){
             *        ind.hide();
             *     }, 2000);
             * </pre>
             * @see showInWindow
             * @see getWindow
             */
            modal: true,
            /**
             * @cfg {Boolean} Отображать ли состояние
             * <wiTag group="Данные">
             * Опция включения режима progressBar - индикатор загрузки в виде полосы, заполняемой цветом в соответствии
             * с состоянием готовности чего-либо.
             * Возможные значения:
             * <ol>
             *    <li>true - включить режим progressBar: отображать состояние индикатора. При этом необходимо настроить
             *    отображение состояния индикатора методом {@link setProgress};</li>
             *    <li>false - не отображать состояние.</li>
             * </ol>
             * @example
             * Создание индикатора загрузки в режиме progressBar:
             * <pre>
             *     var ind = new LoadingIndicator ({
             *        message: 'Сообщение',
             *        //включаем отображение состояния индикатора
             *        progressBar: true
             *     });
             *     var progress = 0;
             *     var int = setInterval(function () {
             *        ind.setProgress((progress += 25));
             *        ind.setMessage('Прогресс: ' + progress + '%');
             *        if (progress === 100) {
             *           clearInterval(int);
             *           ind.hide();
             *        }
             *     }, 500);
             * </pre>
             * @see showPercent
             * @see setProgress
             */
            progressBar: false,
            /**
             * @cfg {Boolean} Показывать ли проценты
             * <wiTag group="Управление">
             * Опция задаёт наличие/отсутствие указания процентного состояния индикатора загрузки.
             * Возможные значения:
             * <ol>
             *    <li>true - отображать состояние индикатора в процентах;</li>
             *    <li>false - не отображать состояние в процентах.</li>
             * </ol>
             * @example
             * Создание индикатора загрузки в режиме progressBar с отменом показа процентного состояния:
             * <pre>
             *     var ind = new LoadingIndicator ({
             *        message: 'Сообщение',
             *        //включаем отображение состояния индикатора
             *        progressBar: true,
             *        //отключаем указание процентного состояния индикатора загрузки
             *        showPercent: false
             *     });
             *     var progress = 0;
             *     var int = setInterval(function () {
             *        ind.setProgress((progress += 25));
             *        //отображаем процентное состояние индикатора в тексте сообщения
             *        ind.setMessage('Прогресс: ' + progress + '%');
             *        if (progress === 100) {
             *           clearInterval(int);
             *           ind.hide();
             *        }
             *     }, 500);
             * </pre>
             * @see progressBar
             */
            showPercent: true
         }
      },
      $constructor: function(){
         this._redraw();
      },
      getParent: function(){
         return this._parent;
      },
      isVisible: function() {
         return this._isVisible;
      },
      _setWindowVisibleProperty: function(visible) {
         var
            window = this.getWindow();
         if(window) {
            window._isIndicatorVisible = visible;
         }
      },
      show: function(){
         var self = this;
         if (!this._isVisible) {
            if (this._options.showInWindow) {
               this._myWindow.moveWindowToCenter();
               this._myWindow._isShow = false;
               this._myWindow.show();
            } else {
               this._loadingIndicator.show();
            }
            this._isVisible = true;
         }
      },
      hide: function(){
         if (this._isVisible) {
            if (this._options.showInWindow){
               this._myWindow.hide();
            } else {
               this._loadingIndicator.hide();
            }
            this._isVisible = false;
         }
      },
      /**
       * <wiTag group="Данные">
       * Установить текст сообщения индикатора загрузки.
       * Метод установки текста сообщения индикатора загрузки; замены текста сообщения, установленного опцией {@link message}.
       * Если текст не менять, то по умолчанию будет "Загрузка".
       * @param {String} message Текст сообщения.
       * @example
       * Создание индикатора загрузки в режиме progressBar с отменом показа процентного состояния:
       * <pre>
       *     var ind = new LoadingIndicator ({
       *        message: 'Сообщение',
       *        progressBar: true,
       *        showPercent: false
       *     });
       *     var progress = 0;
       *     var int = setInterval(function () {
       *        ind.setProgress((progress += 25));
       *        //устанавливаем новое сообщение индикатора с отображением процентного состояния в нём
       *        ind.setMessage('Прогресс: ' + progress + '%');
       *        if (progress === 100) {
       *           clearInterval(int);
       *           ind.hide();
       *        }
       *     }, 500);
       * </pre>
       * @see message
       */
      setMessage: function(message){
         if(this._loadingText){
            this._loadingText.html($ws.helpers.escapeTagsFromStr(message, ['script']));
            if(this._myWindow) {
               this._recalcWindowSize(this._myWindow._window);
            }
         }
      },
      _recalcWindowSize: function(wind){
         var
               self = this,
               fRes = function(){
                  self._windowHeight = wind.height() || self._windowHeight;
                  self._windowWidth = wind.width() || self._windowWidth;
               };
         if(/none/.test(wind.css('display'))){
            wind.css({
               'display': 'block',
               'visibility': 'hidden'
            });
            fRes();
            wind.css({
               'display': 'none',
               'visibility': 'visible'
            });
         }
         else{
            fRes();
            this._myWindow.moveWindowToCenter();
         }
      },
       /**
        * <wiTag group="Управление">
        * Закрыть индикатор загрузки.
        * @example
        * Создание индикатора загрузки с последующим закрытием его через 2 секунды:
        * <pre>
        *     var ind = new LoadingIndicator ({
        *        message: 'Ждите, идёт сохранение документа...'
        *     });
        *     setTimeout(function(){
        *        //закрываем индикатор загрузки с уничтожением экземпляра класа
        *        ind.close();
        *     }, 2000);
        * </pre>
        */
      close : function LoadingIndicatorClose(){
         this.destroy();
      },
      /**
       * <wiTag group="Данные">
       * Установить/заменить картинку для индикатора загрузки.
       * @param {String} img Путь к картинке относительно корня сайта.
       * @example
       * Создание индикатора загрузки, меняющего иконку через 3 секунды:
       * <pre>
       *     var ind = new LoadingIndicator ({
       *        message: 'Ждите, идёт сохранение документа...'
       *     });
       *     setTimeout(function(){
       *        //меняем картинку через 3 секунды
       *        ind.setImg('/resources/Indikator_zagruzki/Time.png');
       *     }, 3000);
       *     setTimeout(function(){
       *        //закрываем индикатор загрузки с уничтожением экземпляра класа
       *        ind.hide();
       *     }, 6000);
       * </pre>
       * @see loadingPicture
       * @see isShowLoadingPicture
       */
      setImg: function(img){
         $(this._picture).removeClass().empty();
         $(this._picture).append($ws.helpers.getImgBlock(img));
      },
      _redraw: function(){
         // Уже не пустой
         if (this._myWindow) {
            this._myWindow.close();
         }
         // Уже не пустой
         if (this._container && ( this._progressBarContainer || this._loadingIndicator)) {
            this._container.html('');
         }
         if(this._options.showInWindow){
            this._container = $(dotTplFn(this._options));
            this._renderInd();
            var self = this;
            this._myWindow = new IndicatorsWindow({
               opener   : this,
               modal    : this._options.modal,
               handlers : {
                  'onReady' : function(){
                     this._myIndicator = self;
                     this.getContainer().append('<div class="ws-win-loadingIndicator"></div>');
                     //лоадинг индикатор не должен реагировать на нажатие клавиш
                     this._keysWeHandle = [];
                     this.getContainer().find('.ws-win-loadingIndicator').append(self._container);
                     self._windowHeight = this._window.height();
                     self._windowWidth = this._window.width();
                  }
               }
            });
         } else {
            this._container.append($(dotTplFn(this._options)));
            this._renderInd();
         }
      },
      /**
       * рисует индикатор
       */
      _renderInd: function(){
         this._loadingText = this._container.find('.ws-LoadingIndicator__message');
         if(this._options.progressBar){
            this._progressBarContainer = this._container.find('.ws-progressbar-container');
            var self = this;
            this._myProgressBar = new ProgressBar({
               element: self._progressBarContainer,
               width: 289,
               showPercent: self._options.showPercent
            });
         }
         else{
            //если ширина в процентах
            if(typeof(this._options.width) === 'string'){
               var str = this._options.width;
               if(str[str.length-1] != '%'){
                  this._options.width = parseInt(this._options.width,10) + 'px';
               }
            }else{
               this._options.width = this._options.width + 'px';
            }

            this._loadingIndicator = this._container.find('.ws-loading');
            this._loadingContainer = this._loadingIndicator.find('.ws-LoadingIndicator__loadingContainer');
            this._loadingIndicator.css({
               'text-align': 'center',
               'height': this._options.height,
               'width': this._options.showInWindow ? '100%' : undefined
            });
         }
         this._notify('onReady');
      },
       /**
        * <wiTag group="Данные">
        * Получить окно индикатора
        * @returns {IndicatorsWindow|*}
        * @deprecated Не использовать
        */
      getWindow : function(){
         return this._myWindow;
      },
       /**
        * <wiTag group="Управление">
        * Установить отображение изменения состояния индикатора загрузки.
        * @param {Number} percent Шаг отображения прогрузки.
        * @returns {Boolean} Возвращает признак, применилось ли состояние.
        * Возможные значения:
        * <ol>
        *    <li>true - состояние применилось;</li>
        *    <li>false - не удалось применить. Например, при попытке установить 125 процентов.</li>
        * </ol>
        * @example
        * Создание индикатора загрузки в режиме progressBar:
        * <pre>
        *     var ind = new LoadingIndicator ({
        *        message: 'Сообщение',
        *        //включаем отображение состояния индикатора
        *        progressBar: true
        *     });
        *     var progress = 0;
        *     var int = setInterval(function () {
        *        //устанавливаем отображение изменения состояния индикатора загрузки
        *        ind.setProgress((progress += 25));
        *        ind.setMessage('Прогресс: ' + progress + '%');
        *        if (progress === 100) {
        *           clearInterval(int);
        *           ind.hide();
        *        }
        *     }, 500);
        * </pre>
        * @see progressBar
        */
      setProgress : function(percent){
         percent = parseInt(percent, 10);
         if(percent >= 0 && percent <= 100 && this._myProgressBar !== null){
            this._myProgressBar.setProgress(percent);
            return true;
         }
         else {
            return false;
         }
      },
      destroy: function(){
         this.hide();
         LoadingIndicator.superclass.destroy.apply(this, arguments);
         this._myWindow && this._myWindow.destroy();
         this._myProgressBar && this._myProgressBar.destroy();
      }
   });

   function canShow(indic) {
      var
         seenVisibleIndicatorBefore = false,
         stack = $ws.single.WindowManager.getStack();
      for(var i = stack.length - 1; i >= 0; i--) {
         var stackItem = stack[i];
         if(stackItem.window._isIndicator) {
            if(stackItem.window === indic) {
               return !seenVisibleIndicatorBefore;
            } else if(stackItem.visible()) {
               seenVisibleIndicatorBefore = true;
            }
         }
      }
      // new indicator
      return true;
   }

   $ws.proto.LoadingIndicator = LoadingIndicator.extend({
      _initComplete: function() {
         // поместим индикатор на верхушку стэка
         // свойство visible содержит состояние как его ожидает пользователь индикатора
         $ws.proto.LoadingIndicator.superclass._initComplete.apply(this, arguments);
         this.show();
      },
      hide: function() {
         if (this._options.showInWindow) {
            this._setWindowVisibleProperty(false);
            // если текущий индикатор - видимый
            if (this == $ws.single.WindowManager.getCurrentVisibleIndicator()) {
               // скроем его недекорированным методом
               $ws.proto.LoadingIndicator.superclass.hide.apply(this, arguments);
            }
         } else {
            $ws.proto.LoadingIndicator.superclass.hide.apply(this, arguments);
         }
      },
      show: function() {
         if (this._options.showInWindow) {
            this._setWindowVisibleProperty(true);
            if (canShow(this._myWindow)) {
               $ws.single.WindowManager._pendingIndicator = this;
               // скроем текущий видимый индикатор (если есть)
               var
                  currentVisibleIndicator = $ws.single.WindowManager.getCurrentVisibleIndicator();
               if (currentVisibleIndicator) {
                  // используем недекорируемый метод чтобы не трогать желаемое состояние
                  $ws.proto.LoadingIndicator.superclass.hide.apply(currentVisibleIndicator, arguments);
               }
               // покажем текущий
               $ws.proto.LoadingIndicator.superclass.show.apply(this, arguments);
               $ws.single.WindowManager.setCurrentVisibleIndicator(this);
               $ws.single.WindowManager._pendingIndicator = null;
            } else {
               // Поднимем его в стеке насколько можно
               $ws.single.WindowManager.pushUp(this._myWindow);
            }
         } else {
            $ws.proto.LoadingIndicator.superclass.show.apply(this, arguments);
         }
      },
      destroy: function() {
         $ws.single.WindowManager.popBack(this._myWindow);
         if(this._myWindow) {
            delete this._myWindow._myIndicator;
         }
         $ws.proto.LoadingIndicator.superclass.destroy.apply(this, arguments);
      }
   });

   return $ws.proto.LoadingIndicator;

});
