/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 21.04.13
 * Time: 20:30
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.FieldRadio',
      ['js!SBIS3.CORE.FieldAbstract',
       'js!SBIS3.CORE.FieldString',
       'js!SBIS3.CORE.Infobox',
       'html!SBIS3.CORE.FieldRadio',
       'is!browser?js!Ext/jquery-ui/jquery-ui-1.8.5.custom.min',
       'is!browser?js!SBIS3.CORE.FieldRadio/resources/ext/ui.checkbox',
       'css!SBIS3.CORE.FieldRadio'],
      function( FieldAbstract, FieldString, Infobox, dotTplFn ) {

   'use strict';

   /**
    * Группа радиокнопок - контрол, позволяющий пользователю выбрать одно из нескольких возможных значений.
    * Каждую радиокнопку в составе контрола "Группа радиокнопок" можно разделить на две области: поле и подпись.
    *
    * Для группы радиокнопок можно определить горизонтальную или вертикальную пространственную ориентацию.
    * При горизонтальной ориентации радиокнопки строятся строкой, а при вертикальной - столбцом.
    * В режиме "Горизонтальный переключатель" радиокнопки строятся строкой, а поле и подпись активной радиокнопки выделено овальной рамкой.
    *
    * Одинарный клик по полю или подписи радиокнопки производит выбор текущего значения группы радиокнопок.
    * В любой момент времени выбранной может быть только одна радиокнопка из всей группы.
    *
    * Группа радиокнопок не может быть пустой, всегда активна одна из радиокнопок.
    *
    * @class $ws.proto.FieldRadio
    * @extends $ws.proto.FieldAbstract
    * @control
    * @category Select
    * @designTime plugin SBIS3.CORE.FieldRadio/design/DesignPlugin
    * @ignoreOptions width
    * @ignoreOptions maxLength
    * @initial
    * <component data-component='SBIS3.CORE.FieldRadio'>
    *    <options name='data' type='array'>
    *       <options>
    *          <option name='name'>Радиокнопка1</option>
    *          <option name='value'>Радиокнопка1</option>
    *          <option name='label'>Радиокнопка1</option>
    *          <option name='align'>left</option>
    *       </options>
    *       <options>
    *          <option name='name'>Радиокнопка2</option>
    *             <option name='value'>Радиокнопка2</option>
    *             <option name='label'>Радиокнопка2</option>
    *             <option name='align'>left</option>
    *          </options>
    *       </options>
    *    </options>
    *    <option name='value'>Радиокнопка1</option>
    * </component>
    */
   $ws.proto.FieldRadio = FieldAbstract.extend(/** @lends $ws.proto.FieldRadio.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {String} Ширина области радиокнопок
             * <wiTag group="Отображение">
             * @noShow
             */
            width: 'auto',
            /**
             * <wiTag noShow>
             * TODO: Не описаны значения, которые может принимать параметр
             * @noShow
             */
            display: '',
            /**
             * @typedef {Object} AlignEnum
             * @variant left слева
             * @variant right справа
             */
            /**
             * @typedef {Object} Data
             * @property {String} name Имя кнопки
             * @property {String} value Идентификатор положения переключателя
             * @property {String} label Текст на кнопке
             * @property {AlignEnum} align Слева или справа будет текст от кнопки
             * @property {String} tooltip Текст всплывающей подсказки
             */
            /**
             * @cfg {Data[]} Конфигурация радиокнопок
             * <wiTag group="Отображение">
             * Массив объектов, описывающих конфигурации радиокнопок.
             * <pre>
             * data: [{
             *      "name": "Радиокнопка1",
             *      "value": "1",
             *      "label": "Купить",
             *      "align": "left",
             *      "tooltip": "Текст всплывающей подсказки"
             *    },
             *    {
             *      "name": "Радиокнопка2",
             *      "value": "2",
             *      "label": "Отложить",
             *      "align": "left",
             *      "tooltip": "Текст  другой всплывающей подсказки"
             *    }
             *    ] - в группе две радиокнопки с текстом соответственно Купить и Отложить.
             * </pre>
             * @see setData
             * @see align
             * @see value
             * @see columnsCount
             * @group Display
             */
            data: [],
            /**
             * @cfg {String|Number} Начальное значение группы радиокнопок
             * <wiTag group="Данные">
             * Опция позволяет определить изначально выбранную радиокнопку.
             * В качестве значения опции указывают имя радиокнопки или её идентификатор.
             * Нумерация идентификаторов начинается с нуля.
             * @see date
             * @see name
             * @see setValue
             * @see getValue
             */
            value: '',
            /**
             * @cfg {String} Выравнивание радиокнопок
             * <wiTag group="Отображение">
             * работает при горизонтальном расположении.             
             * Опция позволяет выбрать выравнивание группы радиокнопок.
             * Актуальна при горизонтальном расположении группы радиокнопок и зависит от количества колонок.             
             * @see data
             * @see columnsCount
             * @see mode
             * @variant left выравнивание по размеру текста(рядом)
             * @variant center выравнивание по ширине контейнера(равномерно)
             * @group Display
             */
            align: 'left',
            /**
             * @cfg {Number} Количество колонок
             * <wiTag group="Отображение">
             * Опция определяет количество колонок для отрисовки радиокнопок.
             * @see mode
             * @see align
             * @group Display
             */
            columnsCount: 1,
            /**
             * @cfg {Boolean} Разрешить перенос текста меток
             * <wiTag group="Отображение">
             * Опция определяет возможность выводить подпись радиокнопки в несколько строк.
             * Возможные значения:
             * <ol>
             *    <li>false - текст у кнопки в одну строку.</li>
             *    <li>true - текст у кнопки будет в несколько строк.</li>
             * </ol>
             * @see data
             */
            wordWrap: false,
            cssClassName: 'ws-field-radio',
            /**
             * @cfg {String} Расположение радиокнопок
             * <wiTag group="Отображение">             
             * <wiTag noShow>
             * TODO: убрать опцию за ненадобностью
             *  @variant inline горизонтальное
             *  @variant inblock вертикальное
             *  @group Display
             */
            buttonDirection: 'inblock',
            /**
             * @cfg {String} Режим группы радиокнопок
             * <wiTag group="Отображение">
             * Опция определяет режим построения группы радиокнопок.             
             * Если не выставить значение, то по умолчанию кнопки выстроятся вертикально.
             * @example
             * <pre>
             *    mode: "horizontal"
             * </pre>
             * @see buttonDirection
             * @see columnsCount
             * @variant horizontal горизонтальное
             * @variant vertical вертикальное
             * @variant horizontalSwitcher горизонтальный переключатель
             * @group Display
             */
            mode: 'vertical',
            /**
             * @cfg {String} Привязка текста к краю
             * <wiTag group="Отображение">
             * К какому краю следует выравнивать радиокнопки.
             * Опция определяет край, по которому следует выравнивать радиокнопки.
             * @variant left слева
             * @variant right справа
             * @group Display
             */
            textAlign: 'left',
            autoHeight: false,
            /**
             * @cfg {Function($ws.proto.FieldRadio.Data): jQuery} Функция отрисовки строки
             * <wiTag group="Отображение">
             * Функция в качестве аргументов получает очередной елемент {@link data}
             * и должна возвращать jQuery элемент. Не работает при {@link mode} = 'horizontalSwitcher'.
             * @example
             * <pre>
             *    userRender: function(data) {
             *       if (data.label) {
             *          return $('<h1>'+data.label+'</h1>');
             *       }
             *       else {
             *          return $('<h1>'+data.name+'</h1>');
             *       }
             *    }
             * </pre>
             * @see data
             * @group Display
             */
            userRender: undefined
         },
         _curRadio : '',
         _readOnlyValue: '',
         _calcWidthBound: null
      },
      $constructor : function(){
         var parent = this.getParent();
         this._initRadio();
         if (parent) {
            parent.subscribe('onResize', this._calcWidthBound)
               .subscribe('onActivate', this._calcWidthBound);
            if(parent.hasEvent('onAfterShow')) {
               parent.subscribe('onAfterShow', this._calcWidthBound);
            }
         } else {
            this._calcWidthBound();
         }
      },
      _initRadio: function(){
         var
            self = this;
         $ws.helpers.forEach(this._container.find('.radioStr'), function(elem, i) {
            if(!self._options.data[i].extendedTooltip) {
               return;
            }
            elem = $(elem);
            elem.bind('mouseenter', function () {
               elem.addClass('ws-radioStr-hovered');
               Infobox.show(elem, self._options.data[i].extendedTooltip, 'auto', $ws.single.Infobox.SHOW_TIMEOUT, $ws.single.Infobox.ACT_CTRL_HIDE_TIMEOUT, function(){
                  return elem.hasClass('ws-radioStr-hovered');
               });
            });
            elem.bind('mouseleave', function () {
               elem.removeClass('ws-radioStr-hovered');
               if(Infobox.isCurrentTarget(elem)) {
                  Infobox.hide();
               }
            });
         });
         this._calcWidthBound = this._calculateWidth.bind(this);
         this._container.find('.ws-field').addClass(this._options.wordWrap ? 'ws-prewrap' : 'ws-nowrap');
         this._wrapColumns();
         if ($ws._const.theme){
            this._inputControl.find('input').checkBox();
         }
         if (this._options.autoHeight) {
            this._container.css('height', 'auto');
         }
      },
      _getLinkedLabel : function() {
         var parent = this.getContainer().parent(),
            label;
         if (this._hasLinkedLabel()) {
            if (parent.hasClass('ws-labeled-control')) {
               parent.find('label').each(function(pos, elem) {
                  var $elem = $(elem);
                  //Если не висят на элементе классы контрола field-radio, значит это нужный label - запоминаем и выходим из each
                  if (!$elem.hasClass('ws-field-radio-switcher') && !$elem.hasClass('ws-field-radio-standart')) {
                     label = $elem;
                     return false;
                  }
               });
            } else if (this._options.name) {
               label = this._options.name && parent.find('label[for="fld-' + this._options.name + '"]');
            }
         }
         if (label && label.parent) {
            label = label.parent();
         }
         return label;
      },
      _redraw: function(){
         var $tpl = $(this._dotTplFn(this._options));
         // при повторном построении шаблона появляется лишняя div-обертка, с установленным классом.
         // убираем её в случае обнаружения
         this._container.html($tpl.hasClass(this._options.cssClass) ? $tpl.find('.ws-field').unwrap() : $tpl);
         this._bindInternals();
         this._initRadio();
         this._initEvents();
      },
       /**
        * <wiTag group="Данные">
        * Изменить набор радиокнопок.
        * @param {Array} data Массив, описывающий конфигурацию радиокнопок.
        * Метод позволяет перезаписать опции радиокнопок, заданных в {@link data}.
        * @example
        * <pre>
        *    fieldRadio.setData([
        *       {
        *          name:'Радиокнопка1',
        *          value: 0,
        *          label: 'Текст у первой кнопки',
        *          tooltip: 'Всплывающая подсказка для первой кнопки',
        *          //хотим видеть кнопку справа, текст (label) будет относительно кнопки слева, т.е. до неё
        *          align: 'right'
        *       },
        *       {
        *          name:'Радиокнопка2',
        *          value: 1,
        *          label: 'Текст у второй кнопки',
        *          tooltip: 'Всплывающая подсказка для второй кнопки',
        *          //хотим видеть кнопку слева, текст (label) будет относительно кнопки справа, т.е. после неё
        *          align: 'left'
        *       }
        *    ])
        * </pre>
        * @see data
        * @see name
        * @see tooltip
        */
      setData: function(data) {
         if ($ws.helpers.type(data) === 'array') {
            this._options.data = [];
            for (var i = 0, l = data.length; i < l; i++) {
               var radioBtn = data[i];
               if (radioBtn.name && radioBtn.value) {
                  this._options.data.push({
                     name: radioBtn.name,
                     value: radioBtn.value,
                     label: radioBtn.label ? radioBtn.label : radioBtn.value,
                     tooltip: radioBtn.tooltip || '',
                     align: radioBtn.align ? radioBtn.align : 'left'
                  });
               }
            }
            this._redraw();
            this.setValue(this._createEnum());
         }
      },
      /**
       * <wiTag group="Отображение">
       * Установить функцию рендера({@link userRender}) для елементов группы радиокнопок.
       * @param {Function} функция рендера.
       * @see userRender
       */
      setUserRender: function(render) {
         if (render instanceof Function) {
            this._options.userRender = render;
         }
      },
      /**
       * <wiTag group="Отображение">
       * Получить функцию рендера({@link userRender}) для елементов группы радиокнопок.
       * @returns {Function} функция рендера.
       * @see userRender
       */
      getUserRender: function() {
         return this._options.userRender;
      },
      /**
       * Проверяет опции
       * @protected
       */
      _initConfig: function() {
         var
            mode = this._options.mode,
            mapping,
            dataLength = this._options.data.length;
         $ws.proto.FieldRadio.superclass._initConfig.apply(this, arguments);
         if (!mode) {
            if (this._options.buttonDirection) {
               mapping = {
                  'inline': 'horizontal',
                  'inblock': 'vertical',
                  'auto': 'auto'
               };
               this._options.mode = mapping[this._options.buttonDirection];
            } else {
               this._options.mode = 'vertical';
            }
         } else if (mode === 'horizontalSwitcher') {
            this._options.align = 'left';
            this._options.columnsCount = dataLength;
            for (var i = 0; i < dataLength; ++i) {
               this._options.data[i].align = this._options.textAlign;
            }
         }
      },
      destroy : function(){
         var parent = this.getParent();
         try{
            this._inputControl.find('input').checkBox('destroy');
         } catch(e){}
         if(parent) {
            parent.subscribe('onResize', this._calcWidthBound)
                  .subscribe('onActivate', this._calcWidthBound);
            if(parent.hasEvent('onAfterShow')) {
               parent.subscribe('onAfterShow', this._calcWidthBound);
            }
         }
         $ws.proto.FieldRadio.superclass.destroy.apply(this, arguments);
      },
      /**
       *  подсчет ширины контролов
       */
      _calculateWidth : function(){
         if (this._options.align === 'center') {
            this._container.find('.radio-group-col').width(100/this._options.columnsCount + '%');
         }
      },
      _changeState : function(val){
         var a = this._curval.getValues();
         for (var i in a){
            if (a[i] == val){
               this._curval.set(i);
               break;
            }
         }
         this._setValueInternal(this._curval);
      },
      /**
       * @returns {$ws.proto.Enum}
       * @private
       */
      _createEnum : function(){
         var
            available = { 'null': null },
            idx = 0,
            cur = 'null',
            self = this;
         for (var val in this._options.data){
            available[idx] = this._options.data[val].name || val;
            if (available[idx] == this._options.value)
               cur = idx;
            idx++;
         }
         // если других валидаторов нет, то установим стандартную проверку на значение
         if (!this.getValidators().length) {
            this._options.validators = [{
               validator: function() {
                  //индекс может быть и 0
                  return self.getValueAsIndex() !== null;
               },
               errorMessage: 'Поле обязательно для заполнения'
            }];
         }
         return new $ws.proto.Enum({
            availableValues: available,
            currentValue: cur
         });
      },
      _curValue : function(){
         //this._changeState($('input[type="radio"]:checked', this._container[0]).val()); //теперь функция только возвращает
         return this._notFormatedVal();
      },
      _dotTplFn: dotTplFn,
      _bindInternals : function(){
         this._inputControl = this._container.find('.radioStr');
      },
      _wrapColumns : function(){
         var
            r = this._container.find('.radioStr'),
            l = r.length,
            perColumn = (l + (l % this._options.columnsCount)) / this._options.columnsCount,
            b = 0;

         while(b < l){
            r.slice(b, b + perColumn).wrapAll('<span class=\'radio-group-col\'></span>');
            b += perColumn;
         }
         this._container.find(".radio-group-col").wrapAll('<form></form>');
         this._container.find('form').addClass(this._options.textAlign === 'right' ? 'ws-field-radio-align-right' : 'ws-field-radio-align-left');
      },
      _setValueInternal : function(val){
         var enumObject;
         if(typeof val === 'string'){
            enumObject = this._getEnumWithValue(val);
         }
         else if(typeof val === 'number'){
            enumObject = this._getEnumWithIndex(val);
         }
         else{
            enumObject = val;
         }
         if (enumObject instanceof $ws.proto.Enum) {
            var
               self = this,
               value = enumObject.toObject(),
               current = value.currentValue,
               inputs = self._inputControl.find('input');
            value = value.availableValues[current];
            inputs.removeAttr('checked');
            this._inputControl.each(function () {
               if ($(this).find('input').val() == value && $(this).attr('checked') != 'checked')
                  self._curRadio = $(this).find('input').attr('checked', 'checked');
            });
            if (this._widgetIsApplied()) { // применился ли widget
               inputs.checkBox('reflectUI');
            }
            enumObject.set(current);
            this._curval = enumObject;
         }
      },
      _widgetIsApplied : function(){
         return 'checkBox' in this._inputControl.find('input') && this._inputControl.find('span.ui-radio').length;
      },
      _getElementToFocus : function(){
         return this._container;
      },
      _setDisableAttr : function(s){
         var inputs = this._inputControl.find('input');

         if (!s)
            inputs.attr('disabled', 'disabled');
         else
            inputs.removeAttr('disabled');

         if (this._widgetIsApplied())
            inputs.checkBox('reflectUI');
      },
      /**
       * <wiTag group="Управление">
       * Установить активность радиокнопки.
       * Неактивная радиокнопка выделена серым цветом и недоступна для выбора.
       * @param {String|Number} index Индекс радиокнопки. Первой радиокнопке соответствует индекс 0.
       * @param {Boolean} enabled Состояние активности. true - радиокнопка активна.
       * @example
       * В зависимости от значения флага (fieldCheckBox) изменить активность радиокнопки.
       * <pre>
       *    fieldCheckBox.subscribe('onChange', function(eventObject, value) {
       *       fieldRadio.setOptionEnabled(index, !value);
       *    }):
       * </pre>
       * @see enabled
       * @see data
       * @see getIndexByStringValue
       * @see getValueAsIndex
       * @see setValueByIndex
       */
      setOptionEnabled: function( index, enabled ) {
         enabled = !!enabled;
         var
            inputs = this._inputControl.find('input'),
            input = $(inputs[index]);
         if(!enabled) {
            input.attr('disabled', 'disabled');
         }
         else {
            input.removeAttr('disabled');
         }
         if (this._widgetIsApplied())
            input.checkBox('reflectUI');
      },
      _onValueChangeHandler: function() {
         var newVal = $('input[type="radio"]:checked', this._container[0]).val();
         if(newVal === this.getStringValue())
            return;
         this._changeState(newVal);
         var nFV = this._notFormatedVal();
         this._updateSelfContextValue(nFV);
         this._notify('onChange', nFV);
         this._notifyOnValueChange(nFV);
         this.validate();
      },
      getStringValue: function(){
         return this._curval && this._curval.toString() || '';
      },
      /**
       * <wiTag group="Данные">
       * Получить индекс радиокнопки по её имени.
       * @param {String} value Имя радиокнопки.
       * @returns {String|undefined} Индекс радиокнопки. Первой радиокнопке соответствет индекс 0.
       * Возвращает undefined, если радиокнопка с заданным именем не существует.
       * @example
       * Если в группе радиокнопок (fieldRadio) нет нужной радиокнопки, то скрыть аккордеон (accordion).
       * <pre>
       *    fieldRadio.subscribe('onReady', function() {
       *       //name - имя радиокнопки
       *       if (this.getIndexByStringValue(name) === undefined) {
       *          accordion.hide();
       *       }
       *    });
       * </pre>
       * @see data
       * @see getValueAsIndex
       * @see setOptionEnabled
       * @see getValueByIndex
       */
      getIndexByStringValue: function(value){
         var
            data = this._options.data;
         for(var i in data){
            if(data.hasOwnProperty(i)){
               if(value === data[i].name){
                  return i;
               }
            }
         }
         return undefined;
      },
      /**
       * Возвращает дефолтное значение
       * @return {$ws.proto.Enum}
       */
      _getDefaultValue: function(){
         return this._createEnum();
      },
      /**
       * <wiTag group="Данные">
       * Получить начальное значение группы радиокнопок.
       * @returns {$ws.proto.Enum} Возвращается копия Enum'а вместо оригинала.
       * @example
       * При клике на кнопку (btn) восстановить начальное значение группы радиокнопок (fieldRadio).
       * <pre>
       *    btn.subscribe('onClick', function() {
       *       //для установленной по умолчанию радиокнопки получаем индекс из Enum
       *       var index = fieldRadio.getDefaultValue().getCurrentValue();
       *       fieldRadio.setValueByIndex(index);
       *    });
       * </pre>
       * @see getValueAsIndex
       * @see getValueAsString
       * @see setValueByIndex
       * @see setValueByString
       * @see getIndexByStringValue
       */
      getDefaultValue: function(){
         return this._defaultValue.clone();
      },
      /**
       * <wiTag group="Данные">
       * Получить индекс радиокнопки, выбранной в данный момент.
       * @return {Number} Индекс радиокнопки.
       * @example
       * Изменять видимость табличного представления (tableView) в зависимости от значения группы радиокнопок (fieldRadio).
       * <pre>
       *    fieldRadio.subscribe('onChange', function() {
       *       tableView.toggle(this.getValueAsIndex() != 2);
       *    });
       * </pre>
       * @see data
       * @see getIndexByStringValue
       * @see getValueAsString
       * @see setValueByString
       * @see setValueByIndex
       * @see getDefaultValue
       */
      getValueAsIndex: function(){
         return this._curval.valueOf();
      },
      /**
       * <wiTag group="Данные">
       * Получить имя радиокнопки, выбранной в данный момент.
       * @return {String} Имя радиокнопки.
       * @example
       * При готовности группы радиокнопок (fieldRadio) установить фильтр на табличное представление (tableView).
       * <pre>
       *    fieldRadio.subscribe('onReady', function() {
       *       //fieldName - имя поля, по которому хотим фильтровать
       *       tableView.setQuery({fieldName : this.getValueAsString()});
       *    });
       * </pre>
       * @see data
       * @see getIndexByStringValue
       * @see getValueAsIndex
       * @see setValueByString
       * @see setValueByIndex
       * @see getDefaultValue
       */
      getValueAsString: function(){
         return this.getStringValue();
      },
      /**
       * Возвращает enum с выбранным индексом
       * @param index
       * @returns {$ws.proto.Enum|undefined}
       * @private
       */
      _getEnumWithIndex: function(index){
         var result = this.getValue().clone();
         try{
            result.set(index);
            return result;
         }
         catch(e){
            $ws.single.ioc.resolve('ILogger').error('FieldRadio', e.message);
            return undefined;
         }
      },
      /**
       * <wiTag group="Данные">
       * Установить по индексу новое значение группы радиокнопок.
       * @param {number} index Индекс радиокнопки, которую хотим установить в качестве текущего значения группы.
       * @example
       * Установить группу радиокнопок (fieldRadio) в значение, соотвествующее дню недели.
       * <pre>
       *    fieldRadio.subscribe('onReady', function() {
       *       var day = new Date();
       *       //0 - воскресенье, 1 - понедельник и т.д.
       *       this.setValueByIndex(day.getDay());
       *    });
       * </pre>
       * @see data
       * @see getIndexByStringValue
       * @see getValueAsIndex
       * @see setValueByString
       * @see getValueAsString
       * @see getDefaultValue
       */
      setValueByIndex: function(index){
         var value = this._getEnumWithIndex(index);
         if(value){
            this.setValue(value);
         }
      },
      /**
       * Возвращает enum с выбранным значением
       * @param value
       * @returns {$ws.proto.Enum|undefined}
       * @private
       */
      _getEnumWithValue: function(value){
         var
            result = this.getValue().clone(),
            index = this.getIndexByStringValue(value);
         if( index !== undefined ) {
            result.set(index);
            return result;
         }
         $ws.single.ioc.resolve('ILogger').error('FieldRadio', 'Connot set value by name "' + value + '"');
         return undefined;
      },
      /**
       * <wiTag group="Данные">
       * Установить по имени новое значение группы радиокнопок.
       * @param {String} value Имя радиокнопки, которую хотим установить в качестве текущего значения группы.
       * @example
       * Установить группу радиокнопок (fieldRadio) в значение, соотвествующее текущему месяцу.
       * <pre>
       *    fieldRadio.subscribe('onReady', function() {
       *       var date = new Date();
       *       //names - массив с именами радиокнопок
       *       this.setValueByString(names[date.getMonth()]);
       *    });
       * </pre>
       * @see data
       * @see getIndexByStringValue
       * @see getValueAsIndex
       * @see setValueByIndex
       * @see getValueAsString
       * @see getDefaultValue
       */
      setValueByString: function(value){
         var result = this._getEnumWithValue(value);
         if(result){
            this.setValue(result);
         }
      }
   });

   return $ws.proto.FieldRadio;

});

