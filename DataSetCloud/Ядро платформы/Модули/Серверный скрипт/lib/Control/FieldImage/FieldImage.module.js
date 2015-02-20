/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 21.04.13
 * Time: 21:54
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.FieldImage", ["js!SBIS3.CORE.Control", "js!SBIS3.CORE.TDataSource", "html!SBIS3.CORE.FieldImage", "css!SBIS3.CORE.FieldImage"], function( Control, TDataSource, dotTplFn ) {

   "use strict";
   
   var 
      LOADING_PATH = $ws.helpers.getImagePath('AreaAbstract|ajax-loader-indicator.gif');

   $ws.single.DependencyResolver.register('SBIS3.CORE.FieldImage', function(config){
      var result = [];

      if(config) {
         if(config.cropEnabled) {
            result.push('js!SBIS3.CORE.CropPlugin');
         }
         if(config.zoomEnabled) {
            result.push('js!SBIS3.CORE.ZoomPlugin');
         }
      }

      return result;
   });

   /**
    * Контрол "Картинка". Позволяет отображать изображение как из статического файла, так и из БД через вызов
    * метода бизнес-логики
    *
    * @class $ws.proto.FieldImage
    * @extends $ws.proto.DataBoundControl
    * @control
    * @category Decorate
    * @designTime actions /design/design
    * @ignoreOptions validators
    * @ignoreOptions enabled
    * @ignoreOptions allowChangeEnable
    * @initial
    * <component data-component='SBIS3.CORE.FieldImage' style='width: 100px; height: 100px'>
    * </component>
    */
   $ws.proto.FieldImage = Control.DataBoundControl.extend(/** @lends $ws.proto.FieldImage.prototype */{
      /**
       * @event onImageReady Происходит при успешной загрузке изображения в контрол.
       * <wiTag group="Управление">
       * @param {$ws.proto.EventObject} eventObject дескриптор события
       *
       * <pre>
       *    img.subscribe("onImageReady", function(event) {
       *       var w = this.getRealWidth(), h = this.getRealHeight();
       *       alert("Загружено изрбражение " + w + "x" + h);
       *    });
       * </pre>
       */
      /**
       * @event onError Происходит при ошибке загрузки изображения.
       * <wiTag group="Управление">
       * @param {$ws.proto.EventObject} eventObject дескриптор события
       *
       * <pre>
       *    img.subscribe("onError", function(event) {
       *       alert("Изображение не загружено");
       *    });
       * </pre>
       */
      $protected: {
         _options: {
            tabindex : false,
            /**
             * @cfg {Object} Источник данных для изображения (загрузка картинки из БД методом бизнес-логики)
             * <wiTag group="Данные">
             * Описывается источник данных.
             * Формат совпадает с аналогичным параметром у DataView {@link $ws.proto.DataViewAbstract#dataSource}
             * @editor TDataSourceEditorNoMethods
             * @group Data
             */
            dataSource: TDataSource,
            /**
             * @cfg {String} Шаблон формирования URL для загрузки статического файла
             * <wiTag group="Данные">
             * Позволяет построить URL запрашиваемой картинки по шаблону, используя данные из контекста,
             * полученные по имени контрола.
             * В переданном URL подстрока <code>{VALUE}</code> будет заменена на полученные данные.
             * Например, если контрол имеет имя <code>product</code> и в связанном контексте имеются данные
             * <code>product: 19553</code>, и задан шаблон <code>http://static.server.name/images/{VALUE}.png</code>
             * то будет загружено и отображено изображение с адресом <code>http://static.server.name/images/19553.png</code>
             */
            urlTemplate: '',
            /**
             * @cfg {Boolean} Разрешено или нет уменьшение размеров изображения
             * <wiTag group="Отображение">
             * Если уменьшение размеров разрешено - загруженное изображение будет уменьшено для вписывания в отведенную область.
             * Если нет - изображение отображается в исходном размере и, по мере надобности, отображаются полосы прокрутки.
             * @see setAllowSizeReduce
             */
            allowSizeReduce: false,
            /**
             * @cfg {Boolean} Разрешено или нет увеличение размеров изображения
             * <wiTag group="Отображение">
             * Если увеличение размеров разрешено - загруженное изображение будет увеличено для вписывания в отведенную область.
             * Если нет - изображение отображается в исходном размере.
             * @see setAllowSizeIncrease
             */
            allowSizeIncrease: false,
            /**
             * @typedef {Object} FilterParam
             * @property {string} fieldName Имя поля
             * @property {boolean} [autoreload=true] Перезагружать данные при изменении поля в контексте
             */
            /**
             * @cfg {Object.<string, boolean|number|string|FilterParam>} Параметры фильтрации списочного метода бизнес-логики
             * <wiTag group="Данные">
             * См. описание в {@link $ws.proto.DataViewAbstract#filterParams}
             * @group Data
             */
            filterParams: {},
            /**
             * @cfg {Boolean} Показывать индикатор во время загрузки
             * <wiTag group="Отображение">
             */
            loadingIndicator : true
         },
         _cH: 0,
         _cW: 0,
         _imageReady: false,
         _realImH: 0,
         _realImW: 0,
         _url: '',
         _loading: undefined
      },
      $constructor: function(){
         this._publish('onImageReady', 'onError');
         this._createLoading();
         this._options.tabindex = null;
         this._build();
         this._buildUrl();
         if (this._url !== '') {
            this._createImage(this._url);
         }
      },
      _dotTplFn: dotTplFn,
      /**
       * Думается, что создаёт контейнер или вроде того
       * @protected
       */
      _build: function(){
      },
      _buildUrl: function() {
         var
            readerParams,
            dataSource = this._options.dataSource,
            urlTemplate = this._options.urlTemplate;
         if (typeof urlTemplate == 'string' && urlTemplate !== '') {
            if (urlTemplate.indexOf('{VALUE}') == -1) {
               this._url = urlTemplate;
               this._options.urlTemplate = '';
            } else if (this._options.value) {
               this._url = urlTemplate.replace(/{VALUE}/g, this._options.value);
            }
         } else if(typeof(dataSource) == 'object' && !Object.isEmpty(dataSource)) {
            this._options.dataSource = dataSource = $ws.core.merge({
               filterParams: this._options.filterParams,
               readerParams: {
                  serviceUrl: '',
                  linkedObject: '',
                  queryName: ''
               }
            }, dataSource);
            readerParams = dataSource.readerParams;
            if (readerParams.linkedObject && readerParams.queryName) {
               this._url = this._buildRPCUrl(dataSource);
            }
         }
      },

      /**
       * <wiTag group="Данные">
       * Задание шаблона формирования URL
       * @param {String} urlTemplate
       */
      setUrlTemplate: function(urlTemplate) {
         this._options.urlTemplate = urlTemplate;
         this._buildUrl();
         if(this._url !== '') {
            this._createImage(this._url);
         }
      },

      /**
       * <wiTag group="Отображение">
       * Разрешать или нет уменьшение размеров изображения
       * @param {Boolean} allowSizeReduce
       * @see allowSizeReduce
       */
      setAllowSizeReduce: function(allowSizeReduce) {
         if(this._options.allowSizeReduce !== allowSizeReduce) {
            this._options.allowSizeReduce = allowSizeReduce;
            this._rebuildImage();
         }
      },

      /**
       * <wiTag group="Отображение">
       * Разрешать или нет увеличение размеров изображения
       * @param {Boolean} allowSizeIncrease
       * @see allowSizeIncrease
       */
      setAllowSizeIncrease: function(allowSizeIncrease) {
         if(this._options.allowSizeIncrease !== allowSizeIncrease) {
            this._options.allowSizeIncrease = allowSizeIncrease;
            this._rebuildImage();
         }
      },

      show: function() {
         $ws.proto.FieldImage.superclass.show.apply(this, arguments);
         // После показа контейнера пересчитаем его размеры
         this._onResizeHandler();
      },

      /**
       * <wiTag group="Данные">
       * Задает новый источник данных.
       * @param {Object} newDataSource Конфигурация источника данных
       */
      setSource: function(newDataSource) {
         this._options.dataSource = newDataSource;
         this.reloadImage();
      },
      /**
       * <wiTag group="Данные">
       * Возвращает текущий источник данных.
       * @returns {Object}
       */
      getSource: function(){
         return this._options.dataSource;
      },
      _onContextValueReceived: function(ctxVal) {
         if(ctxVal !== undefined && ctxVal !== null)
            this.setValue(ctxVal);
      },
      /**
       * Обработчик клика мышкой
       */
      _onClickHandler: function(){
      },
      _onResizeHandler: function(){
         this._cH = this._container.height();
         this._cW = this._container.width();
         this._getRepositionMethod().call(this);
      },
      /**
       * Возвращает элемент изображения, с которым работает FieldImage
       * @protected
       */
      _getImage: function(){
         return this._container.children('img:not(.ws-fieldImage-loading-indicator)');
      },
      /**
       * Пересчитывает поцизию изображения
       * @private
       */
      _reposition: function(){
         var wrapper = this._container.children('div'),
            iH = this.getRealHeight(),
            iW = this.getRealWidth(),
            h,
            w,
            img = this._getImage();
         wrapper = wrapper[0] ? wrapper : img;

         if(iH > this._cH || iW > this._cW){ // image is larger than container
            if(this._options.allowSizeReduce) { // we can reduce the image
               var max = Math.max(iH / this._cH, iW / this._cW);
               h = iH / max;
               w = iW / max;

               wrapper.css({
                  height: Math.round(h),
                  width: Math.round(w),
                  left: Math.round((this._cW - w) / 2),
                  top: Math.round((this._cH - h) / 2)
               });
            } else {
               this._container.css('overflow', 'auto');
            }
         } else { // center image in container
            var min = Math.min(this._cH / iH, this._cW / iW);
            h = iH * min;
            w = iW * min;
            if (!this._options.allowSizeIncrease && (h > this._realImH || w > this._realImW)){
               // Если не разрешено увеличивать размеры изображения и изображение увеличилось, то ставим обратно на 100% 
               h = this._realImH;
               w = this._realImW;
            }
            this._container.css('overflow', 'hidden');
            wrapper.css({
               position: 'relative',
               height: Math.round(h),
               width: Math.round(w),
               left: Math.round((this._cW - w) / 2),
               top: Math.round((this._cH - h) / 2)
            });
         }
      },
      /**
       * Возвращает функцию, которая будет пересчитывать позицию изображения
       * @returns {Function}
       * @protected
       */
      _getRepositionMethod: function(){
         return this._reposition;
      },
      /**
       * Перестроить изображение под текущие размеры контейнера
       * Вызывает в общем случае метод {@link _reposition}
       * @protected
       */
      _rebuildImage: function(){
         if (this._imageReady === false) {
            return;
         }
         var
            $img = this._getImage(),
            $secImg;
         this._container.css('overflow', 'hidden');
         //Снимем css настройки чтобы получить реальные размеры картинки
         $img.css({
            'visibility': 'hidden',
            'width': '',
            'height': ''
         });
         this._realImH = $img[0].naturalHeight || $img[0].height || $img.height();
         this._realImW = $img[0].naturalWidth || $img[0].width || $img.width();
         if(!this._realImH || !this._realImW) {
            $secImg = $img.clone();
            this._realImH = this._realImH || $secImg.height;
            this._realImW = this._realImW || $secImg.width;
         }
         $img.css('visibility', '');
         if (this._cH > 0 && this._cW > 0) {
            this._getRepositionMethod().call(this);
         }
      },
      /**
       * <wiTag group="Отображение">
       * Возвращает реальную высоту изображения.
       * @returns {Number} высота изображения
       */
      getRealHeight: function(){
         return this._realImH;
      },
      /**
       * <wiTag group="Отображение">
       * Возвращает реальную ширину изображения.
       * @returns {Number} ширина изображения
       */
      getRealWidth: function(){
         return this._realImW;
      },
      /**
       * <wiTag group="Данные">
       * Устанавливает значение,
       * используемое для построения URL по шаблону (если задан параметр {@link $ws.proto.FieldImage#urlTemplate}.
       * Вызывает перезагрузку изображения.
       *
       * @param {*} value Значение
       */
      setValue: function(value) {
         if(this._options.urlTemplate !== '') {
            this._createImage(this._options.urlTemplate.replace('{VALUE}', value));
         }
      },
      /**
       * Указывает, куда нужно вставлять изображение
       * @returns {jQuery}
       * @private
       */
      _getImageContainer: function () {
         return this._container;
      },
      _createImage: function(url) {
         var self = this,
             altName = this._options.tooltip ===  '' ? this.getName() : this._options.tooltip,
             tooltip = this._options.tooltip;
         this._imageReady = false;
         var img = $("<img />", {
            title: tooltip,
            alt: altName
         }).load(function(){
            setTimeout(function(){
               self.removeImage();
               self._hideLoading();
               self._getImageContainer().append(img);
               self._imageReady = true;
               self._onResizeHandler();
               self._rebuildImage();
               // Костыль "мама-не-горюй": хром не вовремя стреляет onImageReady (до того как пересчитались размеры картинки)
               if ($ws._const.browser.chrome) {
                  setTimeout(function() {
                     self._notify('onImageReady');
                  }, 50);
               } else {
                  self._notify('onImageReady');
               }
            }, 0);
         }).error(function(){
            self._hideLoading();
            self._notify('onError');
         });
         this._showLoading();
         img.attr('src', url);
      },
      /**
       * Построить индикатор загрузки
       * Создаёт индикатор загрузки. Пытается получить его из вёрстки. 
       * Если его в вёрстке нет, а опция loadingIndicator была включена позже, то создаёт новый элемент.
       * @private
       */
      _createLoading: function(){
         if(!this._options.loadingIndicator) {
            return;
         }
         if(!this._loading) {
            var 
               loading = this._container.find('img.ws-fieldImage-loading-indicator');
            if(loading.length) { 
               this._loading = loading.eq(0);
               this._hideLoading();
               this._loading.attr('src', LOADING_PATH);
            } else { 
               this._loading = $("<img />", {
                  'src': LOADING_PATH,
                  'class': 'ws-fieldImage-loading-indicator'
               });
            }
         }
      },
      /**
       * Отобразить индикатор загрузки
       * @private
       */
      _showLoading: function(){
         if (!this._options.loadingIndicator) {
            return;
         }
         if (!this._loading) {
            this._createLoading();
         }
         this._loading.appendTo(this._container);
      },
      /**
       * Скрыть индикатор загрузки
       * @private
       */
      _hideLoading: function(){
         if (this._loading) {
            this._loading.detach();
         }
      },
      _buildRPCUrl: function(dataSource) {
         return $ws.helpers.prepareGetRPCInvocationURL(
            dataSource.readerParams.linkedObject,
            dataSource.readerParams.queryName,
            dataSource.filterParams,
            this._context,
            dataSource.readerParams.otherUrl);
      },
      /**
       * <wiTag group="Управление">
       * Перезагружает изображение
       */
      reloadImage: function(){
         this._buildUrl();
         if(this._url !== ''){
            this._createImage(this._url);
         }
      },
      /**
       * <wiTag group="Отображение">
       * Устанавливает подсказку на картинку.
       * @param {String} tooltip текст всплывающей подсказки
       */
      setTooltip: function(tooltip){
         $ws.proto.FieldImage.superclass.setTooltip.apply(this, arguments);
         this._container.find('img').attr("title", tooltip);
      },
      /**
       * <wiTag group="Управление">
       * Очищает контрол, убирает отображаемое изображение
       */
      removeImage: function() {
         this._getImageContainer().empty();
         this._imageReady = false;
      },
      /**
       * Метод, вызываемый по окончании инициализации плагина
       * @param {String} pluginName Название плагина
       * @protected
       */
      _onPluginLoaded: function(pluginName){
      },
      destroy: function(){
         if(this._loading) {
            this._loading.remove();
         }
         $ws.proto.FieldImage.superclass.destroy.apply(this, arguments);
      }
   });

   return $ws.proto.FieldImage;

});