/**
 * Created with JetBrains PhpStorm.
 * User: delukinmv
 * Date: 16.01.13
 * Time: 13:42
 */

define("js!SBIS3.CORE.CropPlugin", [
   "js!SBIS3.CORE.FieldImage",
   "is!browser?js!SBIS3.CORE.FieldImage/resources/ext/jcrop/jquery.Jcrop.min",
   "css!SBIS3.CORE.FieldImage/resources/ext/jcrop/jquery.Jcrop.min"
], function(FieldImage){
//TODO Поправить документацию
   /** 
    * Позволяет с помощью метода на бизнес-логике производить обрезку фотографии.
    * @usage Фотография получается из БЛ и обрабатывается там же. На клиенте никаких операций не происходит.
    * Для применения нужно в Джине подключить плагин, находящийся временно сейчас в https://svn.sbis.ru/svn/WIS/%repo%/plugins/PhotoCrop/
    *
    * Последовательность применения:
    * 0. Получить в контрол фото с БЛ (возможно предварительно загрузив его)
    * 1. После появления изображения вызвать cropInit() для начала процесса обрезки
    * 2. Пользователь выделяет прямоугольник с помощью мыши.
    * 3. После выделения области в изображении вызвать cropPerform(). В случае успеха изображение будет перезагружено!
    * 4. В случае отказа от проведения обрезки вызвать cropFinish()
    *
    * @class $ws.proto.FieldImage.CropPlugin
    * @extends $ws.proto.FieldImage
    * @plugin
    */
   $ws.proto.FieldImage.CropPlugin = FieldImage.extendPlugin(/** @lends $ws.proto.FieldImage.CropPlugin.prototype */{
      /**
       * @event onCropInit Происходит перед началом выбора области, по которой будет происходить обрезание
       * <wiTag group="Управление">
       * @param {$ws.proto.EventObject} eventObject Объект события
       * <pre>
       *    this.subscribe('onCropInit', function() {
       *       help.show('Инструкция по усечению фото'); // Покажем инструкцию для пользователя, например
       *    });
       * </pre>
       */
      /**
       * @event onCropChange Происходит в момент смены области, по которой будет происходить обрезание
       * <wiTag group="Управление">
       * @param {$ws.proto.EventObject} eventObject Объект события
       * <pre>
       *    this.subscribe('onCropChange', function() {
       *       output.setChangeRange(); // Например, выведем координаты выделения
       *    });
       * </pre>
       */
      /**
       * @event onCropStarted Происходит перед вызовом метода обрезки. Обработчик события может вернуть false, Object или $ws.proto.Deferred.
       * В случае false запрос на БЛ не будет произведён.
       * В случае Object запрос будет произведён с отправленным объектом.
       * В случае Deferred - дождёмся его, а затем обработаем так, как написано выше.
       * @param {Object} eventObject   описание в классе $ws.proto.Abstract
       * @param {Object} cropConfig    объект, содержащий параметры обрезки изображений. Содержит поля:
       * <pre>
       *   "readMethod":   метод получения файла изображения ("Изображение.Получить")
       *   "writeMethod":  метод записи файла изображения    ("Изображение.Записать")
       *   "left":         координата X левого верхнего угла
       *   "top":          координата Y левого верхнего угла
       *   "width":        ширина выделенной области
       *   "height":       высота выделенной области
       *   "rwidth":       (необяз., по умол. 0) ширина, к которой нужно привести изображение после кадрирования
       *   "rheight":      (необяз., по умол. 0) высота, к которой нужно привести изображение после кадрирования
       * </pre>
       * @returns Обрабатываются следующие результаты:
       * <pre>
       *    false — отмена метода
       *    Object — переданный объект станет параметрами вызова БЛ, при этом:
       *       * можно передать ID записи
       *       * можно заменить метод кадрирования в опции cropMethodName, он не попадёт в параметры вызова (см пример)
       *       * можно задать параметр для метода чтения в опции readMethodParam (см. пример).
       *    Ничего — метод вызовется по обычному сценарию.
       * </pre>  
       * @example
       * <pre>
       *    this.subscribe('onCropStarted', function(event, cropConfig) {
       *       if(this.getRealHeight() == cropConfig.height && this.getRealWidth() == cropConfig.width) {
       *          $ws.helpers.alert('Требуется уменьшить изображение!');
       *          event.setResult(false);
       *       } else {
       *          // у нас ID — строка
       *          cropConfig.cropMethodName = 'КадрироватьФотоС'; 
       *          cropConfig.cropMethodName = 'КадрироватьФотоС'; 
       *          cropConfig.readMethodParam = { 'Параметры' : self.getRecord() };
       *          cropConfig.ID = 'abcd-6672-348f-9624';
       *          event.setResult(cropConfig);
       *       }
       *    });
       * </pre>
       */
      /**
       * @event onCropFinished Происходит после вызова метода обрезки на сервере.
       * @param {Object} eventObject      описание в классе $ws.proto.Abstract
       * @param {Number|Error} response   Ответ бизнес-логики. Вернёт 0 (ноль) в случае успеха.
       *
       * @example
       * <pre>
       *    this.subscribe('onCropFinished', function(eventObject, response) {
       *      if(response instanceof Error) {
       *         $ws.helpers.alert(response.message);
       *      }
       *    });
       * </pre>
       */
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} Активация плагина обрезки фотографий
             * <wiTag group="Управление">
             * По-умолчанию плагин отключен
             */
            cropEnabled: false,
            /**
             * @cfg {Number} Соотношение сторон в выделяемой области
             * <wiTag group="Отображение">
             * Например: 1, 3/4
             */
            cropAspectRatio: undefined,
            /**
             * @cfg {Boolean} Максимально расширять область выделения и центрировать её
             * <wiTag group="Отображение">
             * Если установлено в false выделение будет установлено в соотстветствии с параметром cropStartSelect
             */
            cropStartSelectAuto: true,
            /**
             * @cfg {Array} Координаты начального выделения
             * <wiTag group="Отображение">
             * Например: [10,10,60,60]
             */
            cropStartSelect: undefined,
            /**
             * @cfg {String} Имя метода БЛ для сохранения усеченного изображения
             * <wiTag group="Данные">
             * Вызывается после успешного усечения. Должен сохранить результат в БД
             * @editor MethodBLChooser
             */
            BLObjLoadMethodName: ''
         }
      },
      $condition: function(){
         return this._options.cropEnabled === true;
      },
      $constructor: function(){
         this._publish('onCropInit', 'onCropStarted', 'onCropFinished', 'onCropChange');
         if(this._options.cropStartSelect)
            this._options.cropStartSelect = (this._options.cropStartSelect + "").split(',');
         this._onPluginLoaded('CropPlugin');
      },
      /**
       * <wiTag group="Управление">
       * Инициализирует crop, отображается рамка выделения рабочей области
       */
      cropInit: function() {
         var
                 self = this,
                 jcropObj,
                 element,
                 startSelection = this._options.cropStartSelect,
                 _storeCropCoords = function(c){
                    self._cropCoords = c;
                    self._notify('onCropChange');
                 };
         this._notify('onCropInit');
         if(this._options.cropStartSelectAuto) {
            var
                    img = this._getImage(),
                    w = img.width(),
                    h = img.height(),
                    m = Math.min(w,h);
            startSelection = [(w-m)/2,(h-m)/2,m,m];
         }
         jcropObj = {
            aspectRatio: self._options.cropAspectRatio,
            setSelect: startSelection,

            onChange: _storeCropCoords,
            onSelect: _storeCropCoords
         };
         element = self._getImage().eq(0);
         if($ws._const.browser.isModernIE) {
            jQuery.Jcrop(element[0], jcropObj);
         } else {
            element.Jcrop(jcropObj);
         }
         self._getRepositionMethod().call(self);
      },
      /**
       * <wiTag group="Управление">
       * Выполняет crop при наличии выделения, загружает измнения на сервер
       * Вызывает собыия {@link onCropStarted} и {@link onCropFinished}. 
       */
      cropPerform: function(){
         var coord = this._cropCoords;
         if(!coord || coord.x >= coord.x2 || coord.y >= coord.y2) {
            //Если не заданы координаты - выходим и нотифицируем onCropFinished со значением false
            this._notify('onCropFinished', false);
            return;
         }
         var
               self = this,
               image = this._getImage(),
               cH = image.height(),
               cW = image.width(),
               aH = this.getRealHeight(),
               aW = this.getRealWidth(),
               cf = Math.max( aH/cH, aW/cW ),
               blName = this._options.dataSource.readerParams.linkedObject,
               linkedFieldName = this._options.filterParams['ИдО'] && this._options.filterParams['ИдО'].fieldName,
               loadMethod = this._options.BLObjLoadMethodName,
               readMethod = blName + '.' + this._options.dataSource.readerParams.queryName,
               cropMethodName = 'КадрироватьФото',
               sendObject = {
                  "rwidth": 0,
                  "rheight": 0,
                  "readMethod": readMethod,
                  "writeMethod": loadMethod,
                  "left": Math.round(coord.x*cf),
                  "top": Math.round(coord.y*cf),
                  "width": Math.round(coord.w*cf),
                  "height": Math.round(coord.h*cf)
               };
         // ToDo: возможно здесь лучше отдавать склонированный объект, а не по ссылке.
         $ws.helpers.callbackWrapper(this._notify('onCropStarted', sendObject), function(r) {
            if(r !== false){
               var blObj = new $ws.proto.BLObject('ImageEditingPython');
               if(r instanceof Object) {
                  if(r.cropMethodName) {
                     cropMethodName = r.cropMethodName;
                     r.cropMethodName = undefined;
                  }
                  sendObject = r;
               }
               if(sendObject.ID === undefined) {
                  if(!linkedFieldName) {
                     throw 'FieldImage.CropPlugin. Не могу получить ID записи. Укажите ID в обработчике onCropStarted.';
                  } else {
                     sendObject.ID = self.getLinkedContext().getValue(linkedFieldName);
                  }
               }
               blObj.call(cropMethodName, sendObject, $ws.proto.BLObject.RETURN_TYPE_ASIS).addBoth( function(res){
                  self.cropFinish();
                  self._notify('onCropFinished', res);
                  return res;
               });
            }
            return r;
         });
      },
      /**
       * <wiTag group="Управление">
       * Завершает/отменяет возможность совершения crop'а
       * @param {Object} [options={}]. Передайте объект с параметром noReload=true чтобы не вызывать перезагрузку изображения и просто сбросить обрезку
       */
      cropFinish: function(options){

         options = options || {};

         this._dropCrop();

         if (!options.noReload) {
            this._cropCoords = undefined;
            this.reloadImage();
            this._rebuildImage();
         }
      },
      _dropCrop: function() {
         var jCropApi = this._getImage().data('Jcrop');
         if (jCropApi && jCropApi.destroy) {
            jCropApi.destroy();
         }
      },
      destroy: function() {
         this._dropCrop();
      }
   });
});