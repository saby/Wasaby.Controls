/**
 * Created by ad.Chistyakova on 27.09.13.
 */
define('js!SBIS3.CORE.ImageGallery', [
   'js!SBIS3.CORE.Control', 'js!SBIS3.CORE.TDataSource', 'js!SBIS3.CORE.FieldImage',
   'css!SBIS3.CORE.ImageGallery', 'js!SBIS3.CORE.FileBrowse', 'js!SBIS3.CORE.Button', 'html!SBIS3.CORE.ImageGallery'
], function( Control, TDataSource, FieldImage, ImageGallery, FileBrowse, Button, mainTpl ) {

   'use strict';

   var DISTANCE_BETWEEN_SMALL = 4,
       BOTTOM_PADDING = 30,
       BIG_ARROWS_WIDTH = 32;

   /**
    * Галерея изображений
    *
    * Галерея изображений предназначена для удобного просмотра фотографий и картинок. Возможны добавление/удаление и
    * перемена позиции изображений в галерее. Ограничить возможность действий можно опцией {@link readOnly}.
    *
    * @class $ws.proto.ImageGallery
    * @extends $ws.proto.DataBoundControl
    * @control
    * @category Content
    * @ignoreOptions tooltip
    * @ignoreOptions extendedTooltip
    */
   $ws.proto.ImageGallery = Control.DataBoundControl.extend(/** @lends $ws.proto.ImageGallery.prototype */{
      /**
       * @event onCreateRecordForImage Событие, происходящее перед загрузкой изображения
       * <wiTag group="Загрузка">
       * Происходит перед загрузкой изображения (перед созданием записи, в которую будет сохранено изображение).
       * Позволяет подменить запись, в которую будет загружено изображение
       * — Обработка результата:
       * Record - если отдали запись, то картинку запишем в нее. Запись к этому моменту уже должна иметь свой id(!!!)
       * @example
       * <pre>
       *    ImageGallery.subscribe('onCreateRecordForImage', function(event){
       *      event.setResult(false);
       *    });
       * </pre>
       */
      $protected: {
         _options: {
            /**
             * @cfg {Object} Источник данных для галереи
             * <wiTag group="Данные">
             * Описывается источник данных (загрузка картинки из базы данных методом бизнес-логики).
             * Источником данных является декларативный списочный метод БЛ без параметров сортировки.
             * Формат совпадает с аналогичным параметром у DataView {@link $ws.proto.DataViewAbstract#dataSource}.
             * @group Data Source
             * @see methodSaveFile
             * @see methodReadFile
             * @see imageField
             * @see imageTooltipField
             * @see filterParams
             * @editor TDataSourceEditor
             */
            dataSource: TDataSource,
            /**
             * @cfg {String} Название метода загрузки изображения
             * <wiTag group="Данные">
             * При создании метода в Джинне необходимо в разделе "Работа с файлами" выбрать "Загрузку с прикреплением".
             * Формат вида - Объект.Метод.
             * @editor MethodBLLinkedObject
             * @group Data Source
             */
            methodSaveFile: '',
            /**
             * @cfg {String} Название метода чтения изображения
             * <wiTag group="Данные">
             * При создании метода в Джинне необходимо в разделе "Работа с файлами" выбрать "Чтение".
             * Формат вида - Объект.Метод.
             * @editor MethodBLLinkedObject
             * @group Data Source
             */
            methodReadFile: '',
            /**
             * @cfg {Boolean} Режим "Только для чтения"
             * Возможные значения:
             * <ol>
             *    <li>true - включён, редактирование галереи изображений невозможно;</li>
             *    <li>false - выключен, возможно добавление/удаление изображений, изменение их позиций в наборе.</li>
             * </ol>
             * <wiTag group="Управление">
             * @see isReadOnly
             * @group Data Source
             */
            readOnly: false,
            /**
             * @cfg {String} Поле отображения картинки
             * <wiTag group="Отображение">
             * Поле таблицы, отвечающее за хранение изображения.
             * @see dataSource
             * @see methodSaveFile
             * @see methodReadFile
             * @see imageTooltipField
             * @group Data Source
             * @editor BLFieldsChooser
             */
            imageField: '',
            /**
             * @cfg {String} Текст при пустой галерее
             * Текст, отображаемый в случае отсутствия изображений в галерее.
             * <wiTag group="Отображение">
             * @see setEmptyImageGalleryText
             * @see getEmptyImageGalleryText
             */
            emptyImageGalleryText: 'Нет изображений',
            /**
             * @cfg {String} Поле отображения подсказки
             * <wiTag group="Отображение">
             * Поле таблицы, отвечающее за хранение подсказки для изображения.
             */
            imageTooltipField: '',
            /**
             * @cfg {Number} Размеры мини-изображений
             * <wiTag group="Отображение">
             * Так как мини-изображение будет помещено в квадратный контейнер, то нужна только высота.
             * Количество отображаемых мини-изображений зависит от заданной в данной опции высоты и ширины контейнера
             * галереи изображения.
             * @see bigImageHeight
             * @group Image Sizes
             */
            smallImageHeight: 25,
            /**
             * @cfg {Number} Размеры активного (большого) изображения
             * <wiTag group="Отображение">
             * Вычисляется как разница между высотой контейнера для галереи изображений и высотой мини-изображения,
             * заданной опцией {@link smallImageHeight}.
             * @see smallImageHeight
             * @group Image Sizes
             */
            bigImageHeight: 50, //Будем сами вычислять
            /**
             * @typedef {Object} FilterParam
             * @property {string} fieldName Имя поля
             * @property {boolean} [autoreload=true] Перезагружать данные при изменении поля в контексте
             */
            /**
             * @cfg {Object.<string, boolean|number|string|FilterParam>} Параметры фильтрации списочного метода бизнес-логики
             * <wiTag group="Данные">
             * См. описание в {@link $ws.proto.DataViewAbstract#filterParams}
             * @group Data Source
             */
            filterParams: {},
            /**
             * @cfg {String} Название поля, в котором хранится информация о порядке(номере) изображения в БД
             * <wiTag group="Управление">
             * @group Data Source
             * @editor BLSequenceNumberChooser
             */
            sequenceNumberColumn: 'ПорНомер'
         },
         _width: 0,
         _height: 0,
         _smallImagesNum: 0,
         _startIndex: 0, //индекс  - как показывать галерею (по позициям в списке)
         _activeImagePosition: 0, // может и не нужно
         _savedRecordsLength: -1,// если после перезагрузки изменилось количество записей, то галерея будет пересоздана, а не "пересчитана"
         _mainRecordSet: false,
         _galleryCreated: false, 
         _smallGallery: [],
         _$activeDiv: undefined,
         _addButton: undefined,
         _bigImage: undefined,
         _leftArrow: undefined,
         _rightArrow: undefined,
         _bottomBlockGallery: undefined,
         _filterRecordSet: {},
         _textBlockEmptyGallery: undefined
      },
      _dotTplFn: mainTpl,
      $constructor: function() {
         this._calcSizes();
         this._addControls();
         this._prepareMainRecordSet();
         this._publish('onCreateRecordForImage');

         //Создаем контейнер с текстом для пустой галереи
         this._bottomBlockGallery = this.getContainer().find('.ws-ImageGallery-bottom');
         this._bottomBlockGallery.append('<table class="ws-hidden"><tr><td>' + this._options.emptyImageGalleryText + '</td></tr></table>');
         this._textBlockEmptyGallery = this._bottomBlockGallery.find('table');
      },
      _calcSizes: function() {
         var $container = this.getContainer();
         this._width = $container.width();
         this._height = $container.height();

         this._options.smallImageHeight = parseInt(this._options.smallImageHeight, 10);
         if (this._options.smallImageHeight < 60) {
            this._options.smallImageHeight = 60;
            $container.find('.ws-ImageGallery-top').css('height', this._options.smallImageHeight);
         }
         this._options.bigImageHeight = this._height - this._options.smallImageHeight - BOTTOM_PADDING;

         if (this._options.smallImageHeight > 0) {
            this._smallImagesNum = parseInt((this._width - 3 * BIG_ARROWS_WIDTH) / (this._options.smallImageHeight + DISTANCE_BETWEEN_SMALL), 10);
         }

         $container.find('.ws-ImageGallery-bottom').css('height', this._options.bigImageHeight);
         $container.find('.ws-ImageGallery-table-div').css('width', this._width - 3 * BIG_ARROWS_WIDTH);
         $container.find('.ws-ImageGallery-small-table').css('width', this._width - 3 * BIG_ARROWS_WIDTH);
      },
      /**
       * Проверка наличия изображений в галерее (отображаем/скрываем текст пустой галереи)
       * @private
       */
      _toggleEmptyTextBlock: function() {
         var hasImage = this._mainRecordSet instanceof $ws.proto.RecordSet && this._mainRecordSet.getRecords().length > 0;
         this._textBlockEmptyGallery.toggleClass('ws-hidden', hasImage);
         this._bottomBlockGallery.toggleClass('ws-ImageGallery__emptyBottom', !hasImage);
      },
      show: function() {
         $ws.proto.ImageGallery.superclass.show.apply(this, arguments);
         if(!this._galleryCreated) {
            return;
         }
         // После показа галереи отправим команду показа всем изображениям 
         this._bigImage.show();
         for(var i = 0, len = this._smallGallery.length; i < len; ++i) {
            this._smallGallery[i].show();
         }
      },
      /**
       * <wiTag group="Отображение">
       * Установить текст, выводимый для пустой галереи изображений
       * Если не задать, то по умолчанию будет такой текст: "Нет изображений".
       * @param {String} text Новый текст.
       * @example
       * Меняем текст, отображаемый для пустой галереи изображений
       * <pre>
       *    object.setTextEmptyGallery('Изображения в выбранной галерее отсутсвуют')
       * </pre>
       * @see emptyImageGalleryText
       * @see getEmptyImageGalleryText
       */
      setEmptyImageGalleryText: function(text) {
         if (typeof text === 'string') {
            this._options.emptyImageGalleryText = text;
            if (this._textBlockEmptyGallery) {
               this._textBlockEmptyGallery.find('td').text(text);
            }
         }
      },
      /**
       * <wiTag group="Отображение">
       * Возвращает текст, выводимый для пустой галереи изображений.
       * @return {String} Вернёт текст, установленный либо свойством {@link emptyImageGalleryText}, либо методом
       * {@link setEmptyImageGalleryText}. Если ничего не меняли, то текст такой: "Нет изображений".
       * @see emptyImageGalleryText
       * @see setEmptyImageGalleryText
       */
      getEmptyImageGalleryText: function() {
         return this._options.emptyImageGalleryText;
      },
      _addControls: function() {
         // положить кнопочку добавления + стрелочки - посмотреть на режим просмотра
         var self = this,
             otherUrl = '';
         try {
            otherUrl = this._options.dataSource.readerParams.adapterParams.serviceUrl || '';
         } catch (e) {
            otherUrl = '';
         }
         this._addButton = new FileBrowse({
            element: 'ws-ImageGallery-addButton',
            extensions: 'image',
            image: 'sprite: icon-32 icon-Add icon-primary',
            imageAlign: 'Left',
            otherUrl: otherUrl,
            method: this._options.dataSource.readerParams.linkedObject + '.' + this._options.methodSaveFile,
            caption: '',
            className: 'ws-field-button ws-ImageGallery-add-button ws-ImageGallery-button' + (self.isReadOnly() ? ' ws-hidden': ''),
            renderStyle: 'asLink',
            enable: !self.isReadOnly(),
            paramsMapping: {},
            showIndicator: false,
            handlers: {
               'onLoadStarted': function(event) {
                  // создать запись и попробовать прописаться в id
                  var result = self._notify('onCreateRecordForImage'),
                      button = this,
                      eventResult,
                      obj = {};
                  if (!(result instanceof $ws.proto.Record)) {
                     eventResult = new $ws.proto.Deferred();
                     obj[self._options.sequenceNumberColumn] = self._mainRecordSet.getRecordCount();
                     self._mainRecordSet.createRecord($ws.core.merge(obj,
                           self._mainRecordSet.getQuery())).addCallback(function(record) {
                        record.update().addCallback(function() {
                           button.setUploadParams({
                              'ИдО': record.getKey()
                           });
                           eventResult.callback(true);
                        });
                     });
                  }
                  else {
                     eventResult = true;
                     this.setUploadParams({
                        'ИдО': result.getKey()
                     });
                  }
                  event.setResult(eventResult);
               },
               'onLoaded': function() {
                  self._smallGallery = [];
                  self._startIndex = 0;
                  self._activeImagePosition = 0;
                  self._reloadFilteredRecordSet();
               }
            },
            filterParams: ['ИдО'],
            queryFilter: {}
         });

         this._leftArrow = this._prepareArrowButton({
            element: 'ws-ImageGallery-leftArrow',
            image: 'sprite:icon-32 icon-DayBackward icon-primary action-hover',
            className: 'ws-ImageGallery-left-arrow ws-ImageGallery-button ws-invisible',
            handlers: {
               'onActivated': function(event) {
                  if (this.getContainer().find('.icon-primary').length) {
                     self._moveActiveImage(false);
                  }
                  event.setResult(true);
               }
            }
         });
         this._rightArrow = this._prepareArrowButton({
            element: 'ws-ImageGallery-rightArrow',
            image: 'sprite:icon-32 icon-DayForward icon-primary action-hover',
            className: 'ws-ImageGallery-right-arrow ws-ImageGallery-button ws-invisible',
            handlers: {
               'onActivated': function(event) {
                  if (this.getContainer().find('.icon-primary').length) {
                     self._moveActiveImage(true);
                  }
                  event.setResult(true);
               }
            }
         });
      },
      /**
       * <wiTag group="Управление">
       * Проверить режим работы.
       * Режим задаётся только при создании галереи изображений, сменить его нельзя.
       * <wiTag group="Данные">
       * @returns {Boolean} Возможные значения:
       * <ol>
       *    <li>true - режим только для чтения;</li>
       *    <li>false - режим редактирования.</li>
       * </ol>
       * @example
       * Если галерея изображений находится в режиме "Только чтение", то установить заголовок "Прикреплённые документы
       * (режим просмотра):", иначе "Прикрёпленные документы (режим редактирования):"
       * <pre>
       *    if(gallery.isReadOnly()) {
       *       labelObject.setValue('Прикреплённые документы (режим просмотра):');
       *    } else {
       *        labelObject.setValue('Прикрёпленные документы (режим редактирования):');
       *    }
       * </pre>
       * @see readOnly
       */
      isReadOnly: function() {
         return this._options.readOnly;
      },
      setEnabled: function(enabled) {
         if(this._options.allowChangeEnable && this._options.enabled !== !!enabled){
            this.setReadOnly(!enabled);
         }
      },
      setReadOnly: function(readOnly){
         this._options.readOnly = readOnly;
         if (this._addButton) {
            this._addButton.getContainer().toggleClass('ws-hidden', readOnly);
            this._addButton.setEnabled(!readOnly);
         }
         if (this._$activeDiv){
            this._$activeDiv.parent().find('.ws-ImageGallery-small-controls').toggleClass('ws-hidden', readOnly);
         }
      },
      _prepareMainRecordSet: function() {
         var self = this,
             dataSource = $ws.core.merge({context: this.getLinkedContext()}, this._options.dataSource, {clone: true});
         dataSource.handlers = {
            'onBeforeLoad': function() {
               //Соответственно, перед каждой загрузкой запоминаем предыдущее количество записей
               self._savedRecordsLength = this.getRecords().length;
            },
            'onAfterLoad': function() {
               self.showGallery(self._startIndex, undefined, true);
            }
         };
         $ws.core.attachInstance('Source:RecordSet', dataSource).addCallback(function(instance) {
            self._mainRecordSet = instance;
         });
      },
      _prepareDataSourceForRead: function(setFilterIndex) {
         var readDS = $ws.core.merge({}, this._options.dataSource, {clone: true});
         readDS.readerParams.queryName = this._options.methodReadFile;
         if (setFilterIndex !== undefined) {
            readDS.filterParams = this._options.filterParams;
            readDS.filterParams['ИдО'] = setFilterIndex;
         }
         return readDS;
      },
      _createSmallGallery: function($tableTR, records) {
         var j = 0,
             tdWidth = this._options.smallImageHeight - DISTANCE_BETWEEN_SMALL;
        //при создании галереи обнуляем массив сохраненных jQuery мини-изображений
         this._smallGallery = [];
         for (var i = this._startIndex, len = this._startIndex + this._smallImagesNum; i < len; i++) {
            if (i >= records.length) {
               break;
            }
            var $div = $('<div class="ws-ImageGallery-small-div" id="ImageGallery-small-' + j + '" rowkey=' + records[i].getKey() + '></div>'),
                $td,
                $smallLeft,
                $smallRight,
                $delete;
            if (i === this._activeImagePosition) {
               $div.addClass('ws-ImageGallery-active-border');
               this._$activeDiv = $div;
            }
            $tableTR.append($td = $('<td class="ws-ImageGallery-small-td" style="width: ' + tdWidth + 'px"></td>'));
            $td.append($div);
            $div.css({
               height: tdWidth + 'px',
               width: tdWidth + 'px'
            });

            $smallLeft = $('<div class="icon-16 icon-DayBackward icon-primary action-hover ws-invisible"></div>');
            $smallRight = $('<div class="icon-16 icon-DayForward icon-primary action-hover ws-invisible"></div>');
            $delete = $('<div class="icon-16 icon-Erase icon-error action-hover" title="Удалить изображение"></div>');
            $td.append($('<div class="ws-ImageGallery-small-controls ws-hidden" style="width: ' + this._options.smallImageHeight + 'px"></div>')
               .append($smallLeft)
               .append($smallRight)
               .append($delete));

            $delete.bind('click', this._deletePicture.bind(this));
            $smallLeft.bind('click', this._moveRecords.bind(this));
            $smallRight.bind('click', this._moveRecords.bind(this));

            this._smallGallery.push(this._prepareFieldImage({
               elem: 'ImageGallery-small-' + j,
               id: records[i].getKey(),
               height: this._options.smallImageHeight,
               width: this._options.smallImageHeight
            }));
            j++;
         }
      },
      _reloadSmallGallery: function(records) {
         var j = 0,
             key;
         for (var i = this._startIndex, len = this._startIndex + this._smallImagesNum; i < len; i++) {
            if (i >= records.length) {
               break;
            }
            key = records[i].getKey();
            if (this._smallGallery[j].getContainer().attr('rowkey') !== key) {
               this._smallGallery[j].getContainer().attr('rowkey', key);
               this._smallGallery[j].setSource($ws.core.merge(this._smallGallery[j].getSource(), {
                  'filterParams': {
                     'ИдО': key
                  }
               }));
            }
            j++;
         }
      },
      /**
       * <wiTag group="Отображение" noShow>
       * Показать изображение галереи слева/справа от выведенных мини-изображений. Или вывести первые мини-изображения.
       * Основная функция.
       * @param {Number} startIndex С какого изображения в списке начать отображать.
       * @param {String} goRight Нужна для отображения активого индекса: справа или слева.
       * @param {Boolean} saveActiveImagePosition Сохранить ли предыдущую позицию активного изображения.
       * Возможные значения:
       * <ol>
       *    <li>true - сохранить позицию активного изображения;</li>
       *    <li>false - сбросить и установить активное изображение первым в списке.</li>
       * </ol>
       */
      showGallery: function(startIndex, goRight, saveActiveImagePosition) {
         var self = this,
             records = this._mainRecordSet.getRecords(),
             $tableTR = $('<tr></tr>'),
             $galleryTop = this.getContainer().find('.ws-ImageGallery-top');

         this._leftArrow.getContainer().toggleClass('ws-invisible', !records.length || startIndex >= records.length);
         this._rightArrow.getContainer().toggleClass('ws-invisible', !records.length || startIndex >= records.length);

         self._toggleEmptyTextBlock();

         if (!records.length || startIndex >= records.length) {
            $galleryTop.find('table').empty();
            if (this._bigImage) {
               //Пока решила, что лучше destroy ибо можно увидеть старую картинку снимая hidden
               this._bigImage.destroy();
               this._bigImage = undefined;
//               this._bigImage.getContainer().addClass('ws-hidden');
            }
            return;
         }
         this._startIndex = startIndex || 0;

         // показ галереи предполагает полное обновление данных, так что подписываемся на стартИндекс
         this._activeImagePosition = (saveActiveImagePosition && this._smallImagesNum > 1) ? this._activeImagePosition : (!goRight ? this._startIndex : this._activeImagePosition + 1);

         if (this._smallGallery.length && 
               (this._smallGallery.length === records.length || this._smallGallery.length === this._smallImagesNum) &&
               records.length === self._savedRecordsLength) {
            this._reloadSmallGallery(records);
         } else {
            $galleryTop.find('table').empty().append($tableTR);
            self._createSmallGallery($tableTR, records);
         }
         self.setActiveImage(records[this._activeImagePosition].getKey());
         $galleryTop.find('.ws-ImageGallery-small-div').click(function(event) {
            //event.target = img или div. Если img, то берем parentNode
            //+ теперь можно клинуть по "ошибке загрузки изображения" и она тоже будет в активный бордер ставится
            var $target = $(event.target).attr('rowkey') ? $(event.target) : $(event.target.parentNode);
            //TODO может искать по rowkey?
            if (self._$activeDiv.get(0) != $target.get(0)) {
               self.setActiveImage($target.attr('rowkey'));
            }
         });
         this._galleryCreated = true;
      },
      _deletePicture: function(event) {
         var key = $(event.target.parentNode.parentNode.firstChild).attr('rowkey'),
             record = this._mainRecordSet.getRecordByPrimaryKey(key),
             self = this;
         $ws.helpers.question('Удалить изображение?', {
            opener: this,
            resizable: false
         }).addCallback(function(result) {
            if (result) {
               record.destroy().addCallback(function() {
                  //TODO при внедрении порядкового номера на БЛ не сбрасывать индексы (будем вставлять по месту)
                  if (self._activeImagePosition > 0) {
                     if (self._startIndex > 0) {
                        self._startIndex--;
                        self._activeImagePosition--;
                     } else if (self._activeImagePosition === self._mainRecordSet.getRecordCount()) {
                        self._activeImagePosition--;
                     }
                  }
                  self._smallGallery = [];
                  self._reloadFilteredRecordSet();
               });
            }
         });
      },
      _moveRecords: function(event) {
         var $imageDiv = $(event.target.parentNode.parentNode.firstChild),
            records = this._mainRecordSet.getRecords(),
            self = this,
            idPos = parseInt($imageDiv.attr('id').match(/\d+/), 10),
            left = $(event.target).hasClass('icon-DayBackward'),
            parallelDeferred = new $ws.proto.ParallelDeferred(),
            idx1 = idPos + this._startIndex,
            idx2 = idPos + this._startIndex + (left ? -1 : +1),
            sequenceNumberColumn = this._options.sequenceNumberColumn,
            rec1,
            rec2,
            tmpIndex;

         event.stopImmediatePropagation();
         if ((left && (idx1 === 0)) || (!left && (idx1 === this._mainRecordSet.getRecordCount() - 1))) {
            return false;
         }
         rec1 = records[idx1];
         rec2 = records [idx2];

         tmpIndex = rec1.get(sequenceNumberColumn);
         rec1.set(sequenceNumberColumn, rec2.get(sequenceNumberColumn));
         rec2.set(sequenceNumberColumn, tmpIndex);

         parallelDeferred.push(rec1.update());
         parallelDeferred.push(rec2.update());
         //Чтобы юзер не закликивал кнопки перемещения\удаления не по делу
         this._$activeDiv.parent().find('.ws-ImageGallery-small-controls').addClass('ws-hidden');

         parallelDeferred.done().getResult().addCallback(function() {
            var recCount = self._mainRecordSet.getRecordCount();
            if (left) {
               if (self._startIndex > 0 &&
                     (self._activeImagePosition !== (self._startIndex + self._smallImagesNum - 1))) {
                  self._startIndex--;
               }
               if (self._activeImagePosition > 0) {
                  self._activeImagePosition--;
               }
            } else {
               if (self._startIndex !== self._activeImagePosition &&
                     (self._smallImagesNum < recCount) &&
                     (self._smallImagesNum + self._startIndex < recCount)) {
                  self._startIndex++;
               }
               self._activeImagePosition++;
            }
            self._reloadFilteredRecordSet();
         });
         return true;
      },
      /**
       * <wiTag group="Управление">
       * Установить активное изображение по ключу записи.
       * @param id Ключ записи.
       * @example
       * <pre>
       *    $ws.single.ControlStorage.getByName('Галерея').setActiveImage('12');
       * </pre>
       */
      setActiveImage: function(id) {
         try {
            this._mainRecordSet.getRecordByPrimaryKey(id);
         } catch (error) {
            return;
         }
         var $target = this.getContainer().find('[rowkey=' + id + ']');
         this._prepareActiveImage($target);
         this._setBigImage(id);
      },
      _prepareActiveImage: function($target) {
         var $smallControls,
             recCount = this._mainRecordSet.getRecordCount();
         this._$activeDiv.removeClass('ws-ImageGallery-active-border');
         this._$activeDiv.parent().find('.ws-ImageGallery-small-controls').addClass('ws-hidden');
         this._$activeDiv = $target;
         $target.addClass('ws-ImageGallery-active-border');

         //из id узнаем позицию в _smallGallery (так мы самми записывали)
         this._activeImagePosition = parseInt($target.attr('id').split('ImageGallery-small-')[1], 10) + this._startIndex;
         $smallControls = this._$activeDiv.parent().find('.ws-ImageGallery-small-controls');
         $smallControls.toggleClass('ws-hidden', this.isReadOnly());

         //Рассчет стрелочек icon-primary action-hover
         this._leftArrow.getContainer().toggleClass('ws-invisible', !(this._activeImagePosition > 0));
         $smallControls.find('.icon-DayBackward').toggleClass('ws-invisible', !(this._activeImagePosition > 0));

         $smallControls.find('.icon-DayForward').toggleClass('ws-invisible', !(this._activeImagePosition < recCount - 1));
         this._rightArrow.getContainer().toggleClass('ws-invisible', !(this._activeImagePosition < recCount - 1));
      },
      _setBigImage: function(id) {
         var source;
         if (this._bigImage) {
            source = this._bigImage.getSource();
            if (source.filterParams['ИдО'] !== id) {
               this._bigImage.setSource($ws.core.merge(source, {
                  'filterParams': {
                     'ИдО': id
                  }
               }));
            }
            return;
         }
         this.getContainer().find('.ws-ImageGallery-bottom').append('<div id="ws-ImageGallery-bigPicture"></div>');

         this._bigImage = this._prepareFieldImage({
            elem: 'ws-ImageGallery-bigPicture',
            id: id,
            height: this._options.bigImageHeight - BOTTOM_PADDING,
            width: this._width
         });
      },
      _moveActiveImage: function(right) {
         var step = right ? 1 : -1;
         // если активное изображение находится с краю, перегружаем всю галлерею
         if ((this._activeImagePosition + step < this._startIndex) || (this._activeImagePosition + step >= this._smallImagesNum + this._startIndex)) {
            this.showGallery(this._startIndex + step, right);
         } else {
            // по идее это можно заменить на setActiveImage, но поиск будет такой же - профит небольшой
            this._prepareActiveImage(this._smallGallery[ this._activeImagePosition + step - this._startIndex].getContainer());
            this._setBigImage(this._$activeDiv.attr('rowkey'));
         }

      },
      _prepareArrowButton: function(cfg) {
         return new Button($ws.core.merge({
            width: 32,
            renderStyle: 'asLink',
            imageAlign: 'left'
         }, cfg || {}));
      },
      /**
       *
       * @param cfg (elem, id, height, width)
       * @private
       */
      _prepareFieldImage: function(cfg) {
         return new FieldImage({
            element: cfg.elem,
            dataSource: this._prepareDataSourceForRead(cfg.id),
            height: cfg.height,
            width: cfg.width,
            allowSizeReduce: true,
            loadingIndicator: false,
            context: this.getLinkedContext(),
            filterParams: this._options.filterParams,
            cropEnabled: false,
            saveRotate: false,
            zoomEnabled: false,
            cropStartSelectAuto: false,
            cssClassName: 'ws-ImageGallery-image',
            handlers: {
               'onError': function() {
                  //Пока не ясно, что здесь будет. нужно, наверное, вывести текст с 'Oops smth went wrong'
                  this.getContainer().empty().append('<div>Ошибка! Изображение не загружено</div>');
               }
            }
         });
      },
      /**
       * <wiTag group="Данные">
       * Возвращает текущий набор данных табличного браузера
       * @returns {$ws.proto.RecordSet}
       */
      getRecordSet: function(){
         return this._mainRecordSet;
      },
      _reloadFilteredRecordSet: function() {
         var params = this._filterRecordSet;
         return this._mainRecordSet.setQuery(params.filter, params.clear, params.options);
      },
      /**
       * <wiTag group="Управление">
       * Меняет параметры выборки.
       * Не зря сделали публичный метод прямо из галереи, ибо setQuery напрямую в рекордсет не будет хорошо работать
       * !Внимание. Параметры фильтрации не заменяются безусловно.
       * Вновь переданные домердживаются на все ранее сделанные.
       * @param {Object} filter Параметры фильтрации
       * @param {Boolean|undefined} clear очищать ли все записи при загрузке
       * @param {Object} [options] Объект с пользовательскими параметрами
       * @returns {$ws.proto.Deferred} Асинхронное событие. Результатом работы является количество записей в новой выборке.
       * @example
       * <pre>
       *    myRecordSet.setQuery({'ГодРождения' : 1965})
       *       .addCallback(function(records_count){
       *              alert('Пришло ' + records_count + ' записей');
       *              return records_count;
       *           });
       * </pre>
       */
      setQuery: function(filter, clear, options){
         this._startIndex = 0;
         this._activeImagePosition = 0;
         this._filterRecordSet = {
            filter: filter,
            clear: clear,
            options: options
         };
         return this._reloadFilteredRecordSet();
      }
   });

   return $ws.proto.ImageGallery;

});
