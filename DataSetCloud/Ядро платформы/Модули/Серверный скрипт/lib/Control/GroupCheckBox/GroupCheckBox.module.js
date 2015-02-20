/**
 * Модуль "Компонент группа флагов".
 *
 * @description
 */
define('js!SBIS3.CORE.GroupCheckBox', ['js!SBIS3.CORE.AreaAbstract', 'js!SBIS3.CORE.FieldCheckbox', 'html!SBIS3.CORE.GroupCheckBox', 'js!SBIS3.CORE.DataBoundMixin'], function( AreaAbstract, FieldCheckbox, dotTplFn, DataBoundMixin ) {

   var FLAGS_SPACE = 15;

   'use strict';

   /**
    * Группа флагов - это контрол, состоящий из нескольких флагов.
    * Каждый флаг в составе данного контрола предназначен для установки битовой переменной, значение которой показывает наличие или отсутствие какого-либо признака.
    *
    * По умолчанию каждый флаг может принимать два значения: true (флаг установлен) и false (флаг сброшен).
    * Если свойство "Трёхпозиционный" установлено в true, то у флага появляется возможность выбора третьего значения: null (неопределён/значение неизвестно).
    *
    * Значения флагов хранятся в record, описание которого расположено в классе {@link $ws.proto.Record}.
    * @class $ws.proto.GroupCheckBox
    * @extends $ws.proto.AreaAbstract
    * @mixes $ws.mixins.DataBoundMixin
    * @control
    * @initial
    * <component data-component='SBIS3.CORE.GroupCheckBox'>
    * <options name='elements' type='array'>
    * <options>
    *    <option name='name' value='Имя флага 1'></option>
    *    <option name='tabindex' value='1'></option>
    *    <option name='caption' value='Подпись флага 1'></option>
    *    <option name='isThirdPosition' value='false'></option>
    *    <option name='value' value='true'></option>
    * </options>
    * <options>
    *    <option name='name' value='Имя флага 2'></option>
    *    <option name='tabindex' value='2'></option>
    *    <option name='caption' value='Подпись флага 2'></option>
    *    <option name='isThirdPosition' value='true'></option>
    *    <option name='value' value='false'></option>
    * </options>
    * </options>
    * <option name='buttonDirection' value='inline'></option>
    * <option name='columnWidth' value='200'></option>
    * <option name='autoHeight' value='true'></option>
    * <option name='autoWidth' value='true'></option>
    * </component>
    * @designTime plugin /design/DesignPlugin
    * @designTime actions /design/design
    * @category Select
    * @ignoreOptions context record
    */
   $ws.proto.GroupCheckBox = $ws.core.mixin(AreaAbstract, DataBoundMixin).extend(/** @lends $ws.proto.GroupCheckBox.prototype */{
      /**
       * @event onChange При изменении значения группы флагов
       * Событие, наступающее при изменении значения группы флагов.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {$ws.proto.Record} currentValue Текущее значение группы флагов.
       * @param {String} triggerCheckbox Имя флага, вызвавшего событие.
       * @example
       * В поле ввода (fieldString) отображаются подписи установленных флагов, находящихся в группе флагов (groupCheckbox).
       * При изменении значения группы флагов изменяется строка, отображаемая в поле ввода.
       * <pre>
       *    groupCheckbox.subscribe('onChange', function(eventObject, currentValue, triggerCheckbox) {
       *       //проверяем значение флага, вызвавшего событие
       *       if (currentValue.get(triggerCheckbox)) {
       *          //формируем новую строку, отображаемую в поле ввода
       *          var newString = fieldString.getValue() + ' ' + this.getFlagCaption(triggerCheckbox);
       *          fieldString.setValue(newString);
       *       } else {
       *          //получаем содержимое поля ввода
       *          var content = fieldString.getValue(),
       *              //формируем часть строки, которую хотим удалить
       *              deleteValue = ' ' + this.getFlagCaption(triggerCheckbox);
       *          //обновляем содержимое поля ввода
       *          fieldString.setValue(content.replace(deleteValue, ''));
       *       }
       *    });
       * </pre>
       */
      $protected : {
         _options : {
             /**
              * @typedef {Object} Elements
              * @property {String} name уникальное имя флага
              * @property {Number} tabindex табиндекс флага
              * @property {String} caption подпись флага
              * @property {Boolean} isThirdPosition трёхпозиционный флаг
              * @property {Boolean} value начальное значение флага
              * @property {String} tooltip текст подсказки
              */
             /**
              * @cfg {Elements[]} Конфигурация флагов
              * Массив объектов, описывающих конфигурации флагов. В каждом объекте возможны следующие свойства:
              * <ol>
              * <li>{String} {@link name} - уникальное имя флага.</li>
              * <li>{Number} [{@link tabindex}] - табиндекс флага.</li>
              * <li>{String} [<a href='http://wi.sbis.ru/docs/index.html#$ws.proto.FieldCheckbox:caption'>caption</a> = ""] - подпись флага.</li>
              * <li>{Boolean} [<a href='http://wi.sbis.ru/docs/index.html#$ws.proto.FieldCheckbox:isThirdPosition'>isThirdPosition</a> = false] - трёхпозиционный флаг.</li>
              * <li>{Boolean} [{@link value} = false] - начальное значение флага.</li>
              * </ol>
              * <wiTag group="Данные">
              * @example
              * Конфигурация двух флагов.
              * <pre>
              *    elements: [{
              *       name: 'Имя флага 1',
              *       tabindex: 1,
              *       caption: 'Подпись флага 1',
              *       isThirdPosition: false,
              *       value: true
              *    },{
              *       name: 'Имя флага 2',
              *       tabindex: 2,
              *       caption: 'Подпись флага 2',
              *       isThirdPosition: true,
              *       value: false
              *    }];
              * </pre>
              * @see appendFlags
              * @see name
              * @see tabindex
              * @see value
              */
            elements : [],
             /**
              * @cfg {Boolean} Разрешить перенос текста подписи флага
              * Позволяет переносить текст подписи флага на новую строку, если он не помещается по ширине контрола.
              *
              * Возможные значения:
              * <ol>
              * <li>true - разрешить перенос подписи.</li>
              * <li>false - запретить перенос подписи.</li>
              * </ol>
              * <wiTag group="Отображение">
              */
            wordWrap : false,
             /**
              * @cfg {String} Пространственная ориентация
              * <wiTag group="Отображение">
              * Пространственная ориентация группы флагов определяет направление построения флагов.
              * @see columnWidth
              * @see uniform
              * @variant inblock вертикальная ориентация - флаги строятся друг под другом, образуя столбец
              * @variant inline горизонтальная ориентация - флаги строятся друг за другом, образуя строку
              * @variant auto автоматическое определение ориентации в зависимости от ширины контрола
              */
            buttonDirection : 'auto',
             /**
              * <wiTag noShow>
              */
            fixWidth: true,
             /**
              * @cfg {Boolean} Разрешить оставаться незаполненной
              * Незаполненная группа флагов - это ситуация, в которой все флаги сброшены.
              *
              * Если группе флагов запретить оставаться незаполненной, то один из флагов всегда будет установлен.
              * Единственный установленный флаг становится недоступным для взаимодействия с пользователем.
              * Пользователь не может изменять состояние этого флага до тех пор, пока не будет установлен любой другой флаг.
              *
              * Возможные значения:
              * <ol>
              * <li>true - разрешить.</li>
              * <li>false - запретить.</li>
              * </ol>
              * <wiTag group="Управление">
              */
            allowEmpty: true,
             /**
              * @cfg {Number} Высота одного флага
              * Свойство определяет высоту контейнера контролов "Флаг", входящих в группу флагов.
              * Высота контейнера флага задаётся в pixel.
              * <wiTag group="Отображение">
              */
            elementHeight: 24,
             /**
              * @cfg {Number|undefined} Ширина столбца
              * Ширина столбца группы флагов. Задаётся в pixel.
              * Свойство актуально, если {@link buttonDirection} установлено в значение auto.
              * <wiTag group="Отображение">
              * @see buttonDirection
              */
            columnWidth: undefined,
             /**
              * @cfg {Boolean} Распределение флагов
              *
              * Возможные значения:
              * <ol>
              * <li>true - равномерное распределение.
              * Каждому флагу устанавливается ширина = W/N, где W - ширина группы флагов, N - число флагов в группе.
              * </li>
              * <li>false - распределение по размеру текста.
              * Каждому флагу устанавливается минимальная ширина, которой хватает на отображение поля и подписи.
              * </li>
              * </ol>
              *
              * Свойство актуально, если {@link buttonDirection} установлено в значение inline.
              * <wiTag group="Отображение">
              * @see buttonDirection
              */
            uniform: true,
             /**
              * <wiTag noShow>
              */
            align: ''   //'left' == auto-width, '' - percent width
         },
         _flagAlign: {
            flagTop: 1, //px
            flagRight: "0px",
            flagBottom: "0px",
            flagLeft: 1 // px
         },
         _disabledFlag: undefined,
         _defaultValue: undefined,
         _columnCount: undefined,
         _columnElementsCount: undefined,
         _columnWidth: undefined,
         _checkboxesContext: null,
         _settedElementHeight: undefined,
         _randomCheckboxesId: ''
      },
      $constructor : function(cfg){
         this._settedElementHeight = cfg.elementHeight;
         this._container.removeClass('ws-area' ).addClass('ws-groupcheckbox')
                        .addClass(this._options.wordWrap ? "ws-prewrap" : "ws-nowrap");
         if (this._options.width && !this._options.autoWidth) {
            this._container.width(this._options.width);
         }
         if (!this._options.columnWidth && this._options.buttonDirection === 'inline') {
            this._options.columnWidth = this._container.width() / this._options.elements.length;
         }
         this._options.height && this._container.height(this._options.height);
         this._height = '';
         this._width = '';
         this._randomCheckboxesId = $ws.helpers.randomId();
         this._checkboxesContext = $ws.single.GlobalContext.createDependent();
         this._createRecord();
      },
      _dotTplFn: dotTplFn,

      _redraw: function(){
         return this._runInBatchUpdate('_redraw', function() {
            var dMultiResult = this._createChildrenLoadCallback();
            this._dChildReady = new $ws.proto.ParallelDeferred();
            this._isReady = false;
            this._createRecord(); // создаст первоначальный рекорд, значения потрутся
            this._removeControls(); // удалит детей
            this._createFlags(); // Добавим старые флаги
            this.setValue( this._curval ); // Установим новый рекорд со значениями
            return dMultiResult.done().getResult().createDependent();
         });
      },

      _refreshFlagMarkup: function(div, idx, offset) {
         var elementsCount = this._options.elements.length;

         if( this._options.buttonDirection === "inblock" ){
            div.css({
               "padding-left": this._flagAlign.flagLeft,
               "display": "block",
               "top": offset,
               "position": "absolute",
               "width": this._options.columnWidth,
               'height': this._settedElementHeight || 'auto'
            });
         } else if( this._options.buttonDirection === "inline" ){
            div.css({
               "padding-left": this._flagAlign.flagLeft + (idx ? 4: 0),
               "width": this._options.uniform ? ( 100 / (elementsCount || 1 ) ) + "%" : "auto",
               "display": "inline-block",
               "position": "absolute",
               "height": this._options.elementHeight,
               "left": offset
            });
            if(!this._options.align){
               div.css("width", ( 100 / (elementsCount || 1 ) ) + "%");
            }
         }
         else if(this._options.buttonDirection === "auto"){
            div.css({
               "display": "inline-block",
               "position": "absolute",
               "width": this._columnWidth,
               "height": this._options.elementHeight,
               "top": offset.top,
               "left": offset.left
            });
         }
         return div;
      },

      _templateInnerCallback: function() {
         if (this._options.name !== '') {
            var ctxVal = this.getLinkedContext().getValue(this._options.name);
            if (ctxVal === undefined || ctxVal.getColumns().length === 0 )
               this.setValue(this._curval);
            else
               this._setValueInternal(ctxVal);
         }

         $ws.proto.GroupCheckBox.superclass._templateInnerCallback.call(this);
      },

      /**
       * Загрузка потомков
       * Возвращает Deferred, который происходит после завершения инициализации всех контролов.
       * Этот же Deferred генерирует всем onBeforeLoad
       * @returns {$ws.proto.Deferred}
       */
      _loadControls:function (pdResult, template, parentId, checkDestroyed, errorHandler){
         return this._runInBatchUpdate('_loadControls', function() {
            this._createFlags();
            return pdResult.done();
         });
      },

      /**
       * Общая функция, генерирующая параметры как для создания флагов, так и для пересчёта их размеров
       * @param callback Функция, принимающая параметры флагов
       * @private
       */
      _iterateFlagsPositions: function(callback) {
         var
            idx = 0,
            offset = 0;
         if(this._options.buttonDirection === 'auto'){
            this._columnElementsCount = Math.floor(this._container.height() / parseInt(this._options.elementHeight, 10)) || 1;
            this._columnCount = Math.ceil(this._options.elements.length / this._columnElementsCount);
            this._columnWidth = Math.floor(this._container.width() / this._columnCount);
            offset = {
               top: 0,
               left: 0
            };
            var columnHeight = this._columnElementsCount * parseInt(this._options.elementHeight, 10);
         } else if (this._options.buttonDirection === 'inblock' && this._options.autoHeight) {
            this._container.height(this._options.elements.length * this._options.elementHeight);
         } else if (this._options.buttonDirection === 'inline' && this._options.autoHeight) {
            this._container.height(this._options.elementHeight);
         }
         $ws.helpers.forEach(this._options.elements, function(_, flag) {
            var id = [this._randomCheckboxesId, idx].join('-'),
                previousFlagHeight = callback.call(this, flag, id, idx, offset);

            idx++;
            if(this._options.buttonDirection === 'inline'){
               if(!this._options.uniform){
                  var
                     label = this._container.find('#' + id).find('.checkbox-label'),
                     box = this._container.find('#' + id).find('.box');

                  if (label.css('display') !== 'inline-block'){
                     label.css('display', 'inline-block');
                  }
                  offset += box.outerWidth() + parseInt(box.css('margin-left'), 10) + parseInt(box.css('margin-right'), 10) + label.outerWidth() + FLAGS_SPACE;
               }
               else {
                  offset += parseFloat(this._options.columnWidth);
               }
            }
            else if (this._options.buttonDirection === 'inblock') {
               offset += previousFlagHeight;
            }
            else if(this._options.buttonDirection === 'auto'){
               var
                  left = Math.floor(idx / this._columnElementsCount) * this._columnWidth,
                  top = (idx * parseInt(this._options.elementHeight, 10)) % columnHeight;

               offset = {
                  top: top,
                  left: left
               };
            }
         }, this);
      },

      /**
       * Функция, переопределяющая AreaAbstract._resizeChilds: подгоняет размеры флагов в случае изменения размеров родительского контейнера.
       * Вызывается из AreaAbstract._onResizeHandler.
       * @private
       */
      _resizeChilds: function() {
         this._resizeFlags();
      },

      _resizeFlags: function() {
         this._iterateFlagsPositions(function(flag, id, idx, offset) {
            var div = this._container.find('#' + id);
            this._refreshFlagMarkup(div, idx, offset);
            return div.height();
         });
      },

      /**
       * Создание флагов, заданных в Jinnee
       * Создает флаг и закидывает его в Deferred
       * @private
       */
      _createFlags: function(){
         this._iterateFlagsPositions(function(flag, id, idx, offset) {
            var div = $('<div id="' + id + '" class="ws-groupcheckbox-item-' + idx + '"></div>');
            this._container.append(this._refreshFlagMarkup(div, idx, offset));

            var self = this,
                element = this._options.elements[flag],
                flagConfig = $.extend({
                   name : element.name || flag,
                   element: id,
                   parent: this,
                   linkedContext: this._checkboxesContext,
                   subcontrol: true,
                   handlers: {
                      onChange : function(e, val){
                         self._onFlagChange(this.getName(), val);
                      }
                   }
               }, element);

            var control = new FieldCheckbox(flagConfig);
            control._notifyOnSizeChanged();
            return control.getContainer().height();
         });
      },
      /**
       * Возвращает список "взведённых" флагов
       * @return {Array}
       * @private
       */
      _getCheckedFlags: function(){
         var list = [];
         for(var i = 0; i < this._childControls.length; ++i){
            var flag = this._childControls[i];
            if(flag){
               if(flag.getValue()){
                  list.push(flag);
               }
            }
         }
         return list;
      },
      /**
       * Выключает/включает флаги, если нужно
       * @private
       */
      _checkEmpty: function () {
         if(!this._options.allowEmpty){
            var checkedFlags = this._getCheckedFlags();
            if(checkedFlags.length !== 1){
               if(this._disabledFlag){
                  this._disabledFlag.setEnabled(true);
               }
            }
            else if(checkedFlags.length === 1){
               this._disabledFlag = checkedFlags[0];
               this._disabledFlag.setEnabled(false);
            }
         }
      },
      /**
       * Обработчик изменения состояния флага
       * @param {String} name Имя флага, изменившего значение
       * @param {Boolean} val Новое значение флага
       * @private
       */
      _onFlagChange: function(name, val){
         this._curval.set(name, val);
         this.setValue(this._curval);
         this._notify('onChange', this._curval, name);
         this._checkEmpty();
      },
      _removeControls: function() {
         $ws.proto.GroupCheckBox.superclass._removeControls.apply(this, arguments);
         this._childsTabindex = {};
      },
      _createRecord : function(){
         var colDef = [], row = [];
         for (var x in this._options.elements){
            if(this._options.elements.hasOwnProperty(x)){
               colDef.push({
                  "n" : this._options.elements[x].name || x,
                  "t" : 'Логическое'
               });
               var value = this._options.elements[x].value;
               if(value === undefined){
                  value = false;
               }
               row.push(value);
            }
         }
         this._curval = new $ws.proto.Record({
            row: row,
            colDef: colDef
         });
         this._defaultValue = this._curval.cloneRecord();
      },
      /**
       * <wiTag group="Данные">
       * Установить значение группы флагов.
       * @param {$ws.proto.Record} val Метод принимает record, контрол заново не отрисовывается.
       * @example
       * 1. Установить новый record для группы флагов (groupCheckbox).
       * <pre>
       *    var record = groupCheckbox.getValue();
       *    record.set({
       *       'Имя флага 1': true,
       *       'Имя флага 2': false,
       *       'Имя флага 3': true,
       *    });
       *    groupCheckbox.setValue(record);
       * </pre>
       *
       * 2. При клике на кнопку (btn) восстановить начальное состояние группы флагов (groupCheckbox).
       * <pre>
       *    btn.subscribe('onClick', function() {
       *       groupCheckbox.setValue(groupCheckbox.getDefaultValue());
       *    });
       * </pre>
       *
       * 3. При клике на кнопку (btn) установить/сбросить все флаги.
       * <pre>
       *    btn.subscribe('onClick', function() {
       *       var record = groupCheckbox.getValue(),
       *          //получим массив с именами флагов
       *          names = record.getColumns(),
       *          configObject = {};
       *       $ws.helpers.forEach(names, function(element) {
       *          //false - сбросить, true - установить
       *          configObject[element] = false;
       *       });
       *       record.set(configObject);
       *       groupCheckbox.setValue(record);
       * </pre>
       *
       * 4. При клике на кнопку (btn) инвертировать значения группы флагов (groupCheckbox).
       * <pre>
       *    btn.subscribe('onClick', function() {
       *       //получаем текущее состояние группы флагов
       *       var record = groupCheckbox.getValue(),
       *           //получаем массив значений флагов
       *           values = record.getDataRow(),
       *           //получаем массив имён флагов
       *           names = record.getColumns();
       *       $ws.helpers.forEach(values, function(element, index) {
       *          record.set(name, !values[index]);
       *       )};
       *       groupCheckbox.setValue(record);
       *    });
       * </pre>
       * @see getValue
       * @see getDefaultValue
       * @see appendFlags
       * @see getFlagCaption
       */
      setValue : function(val){
         this._setValueInternal(val);
         this.getLinkedContext().setValue(this._options.name, val, undefined, true);
         this._checkEmpty();
      },
      _notFormatedVal: function() {
         return this._curval;
      },
      _setValueInternal : function(val){
         if(val instanceof $ws.proto.Record) {
            this._curval = val;
            for (var flag in this._childControls){
               if(this._childControls.hasOwnProperty(flag)) {
                  var
                     name = this._childControls[flag].getName(),
                     value = val.get(name) === null && !this._options.elements[flag].isThirdPosition ? false : val.get(name);
                  this._childControls[flag].setValue(value === undefined ? false : value);
                  this._curval.set(name, value === undefined ? false : value);
               }
            }
         }
      },
      validate: function(){
         return true;
      },
       /**
        * <wiTag group="Данные">
        * Получить значение группы флагов.
        * @returns {$ws.proto.Record}
        * @example
        * При клике на кнопку (btn) установить/сбросить все флаги.
        * <pre>
        *    btn.subscribe('onClick', function() {
        *       var record = groupCheckbox.getValue(),
        *           //получим массив с именами флагов
        *           names = record.getColumns(),
        *           configObject = {};
        *       $ws.helpers.forEach(names, function(element) {
        *          //false - сбросить, true - установить
        *          configObject[element] = false;
        *       });
        *       record.set(configObject);
        *       groupCheckbox.setValue(record);
        *    });
        * </pre>
        * @see elements
        * @see setValue
        * @see getDefaultValue
        * @see getFlagCaption
        * @see appendFlags
        */
      getValue : function(){
         return this.getLinkedContext().getValue(this._options.name);
      },
      /**
       * <wiTag group="Управление">
       * Добавить новые флаги в существующую группу флагов.
       * @param {Array} flags Массив с данными по новым флагам.
       * @param {Object} [flags.object] Объект с конфигурацией флага.
       * @param {Boolean} [removeOld = false] Удалить старые флаги. Если true, то старые флаги будут удалены при добавлении новых флагов.
       * @example
       * При клике на кнопку (btn) добавить два флага в группу флагов (groupCheckbox).
       * <pre>
       *    var flags = [{
       *       'name': 'Имя флага 1',
       *       'caption': 'Подпись у флага 1',
       *       'value': true,
       *       'isThirdPosition': false,
       *       'tooltip': 'Подсказка у флага 1'
       *    },{
       *       'name': 'Имя флага 2',
       *       'caption': 'Подпись у флага 2',
       *       'value': false,
       *       'isThirdPosition': true,
       *       'tooltip': 'Подсказка у флага 2'
       *    }];
       *    btn.subscribe('onClick', function() {
       *       groupCheckbox.appendFlags(flags);
       *    });
       * </pre>
       * @see elements
       * @see getFlagCaption
       * @see getValue
       * @see setValue
       * @see getDefaultValue
       */
      appendFlags: function( flags, removeOld ){
         var self = this;
         // Добавим уже новые флаги
         if( removeOld ) {
            self._options.elements.length = 0;
         }

         $ws.helpers.forEach(flags, function(flag) {
            self._options.elements[ self._options.elements ? self._options.elements.length : 0 ] = {
               'name':              flag.name            || flag['Имя']             || '',
               'caption':           flag.caption         || flag['Текст']           || flag.name  || flag['Имя']  || '',
               'value':             flag.value           || flag['Значение']        || false,
               'tooltip':           flag.tooltip         || flag['Подсказка']       || '',
               'isThirdPosition':   flag.isThirdPosition || flag['Трехпозиционный'] || false,
               'tabindex':          self._options.elements.length
            };
         });
         this._redraw();
      },
      /**
       * <wiTag group="Управление">
       * Получить начальное значение группы флагов.
       * @returns {$ws.proto.Record}
       * @example
       * При клике на кнопку (btn) вернуть группу флагов в начальное состояние.
       * <pre>
       *    btn.subscribe('onClick', function() {
       *       groupCheckbox.setValue(groupCheckbox.getDefaultValue());
       *    });
       * </pre>
       * @see elements
       * @see getValue
       * @see setValue
       * @see appendFlags
       * @see getFlagCaption
       */
      getDefaultValue: function(){
         return this._defaultValue.cloneRecord();
      },
      /**
       * <wiTag group="Управление">
       * Получить текст подписи флага.
       * @param {String} flagName Имя флага.
       * @returns {String|undefined} Текст подписи флага. Если флага не существует, то возвращается undefined.
       * @example
       * Если флаг с именем Flag6 не существует, добавить такой в группу флагов (groupCheckbox).
       * <pre>
       *    if (groupCheckbox.getFlagCaption('Flag6') === undefined) {
       *       groupCheckbox.appendFlags([{
       *          'Имя': 'Flag6',
       *          'Текст': 'Упорядочить по id',
       *          'Значение': false,
       *          'Трехпозиционный': false,
       *          'Подсказка': 'Применить фильтр сортировки по id'
       *       }], false);
       *    }
       * </pre>
       * @see elements
       * @see getValue
       * @see setValue
       * @see getDefaultValue
       * @see appendFlags
       */
      getFlagCaption: function(flagName){
         var flags = this._options.elements;
         for(var i = 0; i < flags.length; ++i){
            var flag = flags[i];
            if(flag.name === flagName){
               return flag.caption;
            }
         }
         return undefined;
      },
      _onContextValueReceived: function (ctxVal) {
         this._setValueInternal(ctxVal);
         this._checkEmpty();
      },
      _initDefaultValue: function () {

      },
      _curValue: function () {
         return this._curval;
      }
   });

   return $ws.proto.GroupCheckBox;

});
