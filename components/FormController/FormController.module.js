define('js!SBIS3.CONTROLS.FormController', ['js!SBIS3.CORE.CompoundControl'], 
   function(CompoundControl, dotTpl) {
   /**
    * Компонент, на основе которого создают диалоги редактирования записей
    *
    * Он позволяет решить задачу открытия диалога редактирования в новой вкладке веб-браузера.
    * Ранее задача решалась крайне сложным образом, что требовало создания нового подхода.
    * Теперь для диалога редактирования можно указать источник, который будет соответствовать источнику представления данных.
    * Поэтому теперь для открытия в новой вкладке требуется передать всего лишь идентификатор записи, которая будет подгружена из источника.
    *
    * @class SBIS3.CONTROLS.FormController
    * @extends $ws.proto.CompoundControl
    * @control
    * @public
    */
   'use strict';

   var FormController = CompoundControl.extend([], {
      _dotTplFn: dotTpl,
      $protected: {
         _record: null,
         _options: {
            /**
             * @cfg {DataSource} Источник данных для диалога редактирования записи
             * Его нужно настроить так же, как и источник представления данных.
             * Из него по первичному ключу, переданному в опции {@link key}, подгружается запись при редактировании.
             * Имеет приоритет над записью, переданной в опции {@link record}.
             * Если источник не задан, то диалог сможет отобразить только запись из опции {@link record}.
             * @example
             * Зазадим в качестве источника данных БЛ:
             * <pre>
             *    // инициализируем источник данных БЛ
             *    var dataSource = new SbisService ({
             *       service: 'Товар'
             *    });
             *    this.setDataSource(dataSource); // устанавливаем источник данных
             * </pre>
             * @see setDataSource
             */
            dataSource: null,
            /**
             * @cfg {String} Первичный ключ редактируемой записи
             * По данному ключу будет подгружена запись из источника данных, который задан опцией {@link dataSource}.
             * Если ключ не передан (null), то этот сценарий означает создание новой записи.
             * Передать ключ можно, например, в обработчике события onItemActivate при запуске редактирования записи:
             * <pre>
             * myView.subscrive('onItemActivate', function(eventObject, meta) {
             *    myOpener.execute(meta); // это opener, который управляет открытием диалога редактирования
             *    // meta - это объект, в котором присутствует id редактируемой записи
             * });
             * </pre>
             *
             */
            key: null,
            /**
             * @cfg {SBIS3.CONTROLS.Data.Model} Редактируемая запись
             * Используется в случае, когда не задан источник данных в опции {@link dataSource}.
             */
            record: null,
            /**
             * @cfg {Object} Ассоциативный массив, который используют только при создании новой записи для инициализации её начальными значениями.
             * При редактировании существующей записи (первичный ключ не задан) опция будет проигнорирована.
             * @example
             * Дополним создаваемую карточку товаров информация, что это новинка:
             * <pre>
             * _options: {
             *    initValue: {
             *       'Новинка': true
             *    }
             * }
             * </pre>
             * Или через вёрстку
             * <pre>
             * <options name="columns" type="array">
             *    <option name="Новинка" type="boolean">true</option>
             * </options>
             * </pre>
             */
            initValues: null
         }
      },
      
      $constructor: function() {
         this._publish('onSubmit');
         $ws.single.CommandDispatcher.declareCommand(this, 'submit', this.submit);
         if (this._options.dataSource){
            this._runQuery();
         } else {
            this._setContextRecord(this._options.record);
         }
      },
      /**
       * Сохраняет редактируемую или создаваемую запись
       * Чтобы в связанном представлении отобразить сохраненную запись, нужно его перезагрузить с помощью метода {@link SBIS3.CONTROLS.ListView#reload}.
       * @command
       * @example
       * Сохранение записи по нажатию кнопки:
       * <pre>
       * this.getChildControlByName('Сохранить').subscribe('onActivated', function() {
       *    this.sendCommand('submit');
       * });
       * </pre>
       */
      submit: function(){
         var self = this;
         this._options.dataSource.update(this._options.record).addCallback(function(){
            self.getTopParent().ok();
         });
      },

      _readRecord: function(key){
         return this._options.dataSource.read(key);
      },

      _setContextRecord: function(record){
         this.getLinkedContext().setValue('record', record);               
      },
      /**
       * Устанавливает источник данных диалогу редактирования
       * @param {DataSource} source Источник данных
       * @see dataSource
       * @example
       * Зазадим в качестве источника данных БЛ:
       * <pre>
       *    // инициализируем источник данных БЛ
       *    var dataSource = new SbisService ({
       *       service: 'Товар'
       *    });
       *    this.setDataSource(dataSource); // устанавливаем источник данных
       * </pre>
       */
      setDataSource: function(source){
         this._options.dataSource = source;
         this._runQuery();
      },
      /**
       * Установаливает запись диалогу редактирования
       * @param {SBIS3.CONTROLS.Data.Model} record
       * @see record
       */
      setRecord: function(record){
         this._options.record = record;
         this._setContextRecord(record);
      },

      _runQuery: function() {
         var self = this,
            hdl;
         if (this._options.key) {
            hdl = this._readRecord(this._options.key);
         }
         else {
            hdl = this._options.dataSource.create(this._options.initValues);
         }
         hdl.addCallback(function(record){
            self._options.record = record;
            self._setContextRecord(record);   
         });
         
      }
   });

   return FormController;

});