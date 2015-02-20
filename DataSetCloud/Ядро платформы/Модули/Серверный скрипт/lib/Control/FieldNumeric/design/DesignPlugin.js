define('js!SBIS3.CORE.FieldNumeric/design/DesignPlugin',
   [
      'js!SBIS3.CORE.FieldNumeric'
   ],
   function(FieldNumeric){
      /**
       * @class $ws.proto.FieldNumeric.DesignPlugin
       * @extends $ws.proto.FieldNumeric
       * добавляет нужные Genie setter'ы и getter'ы,
       * @plugin
       */
      $ws.proto.FieldNumeric.DesignPlugin = FieldNumeric.extendPlugin({
         $constructor : function(){
            this.setInitValue(this.getValue());
         },
         /**
          * Метод изменения значения инициализации.
          * Установка значения в обход setValue
          * @param {Number} initValue значение инициализации
          */
         setInitValue: function(initValue){
            var val = this._selectNullValue(initValue);
            this._setValueInternal(this._selectNullValue(val));
         },
         /**
          * Метод изменения значения поля.
          * @param {Number} value значение поля
          */
         setValue: function(value){
            this.setInitValue(value);
         },
         /**
          * Метод изменения количества знаков после запятой.
          * Без параметров, т.к. функция вызовется после setDecimals(val) из FieldNumeric
          */
         setDecimals: function(){
            this.setInitValue(this.getValue());
         },
         /**
          * Метод изменения количества знаков в целой части.
          * Без параметров, т.к. функция вызовется после setIntegers(val) из FieldNumeric
          */
         setIntegers: function(){
            this.setInitValue(this.getValue());
         },
         /**
          * Метод изменения пустого значения.
          * @param {Boolean} defaultValueIsNull true - null, false - 0
          */
         setDefaultValueIsNull: function(defaultValueIsNull){
            this._options.defaultValueIsNull = defaultValueIsNull;
            this.setInitValue(this.getValue());
         },
         /**
          * Прятать пустые копейки
          * @param {Boolean} hideEmptyDecimals true - прятать пустые копейки
          */
         setHideEmptyDecimals: function(hideEmptyDecimals){
            this._options.hideEmptyDecimals = hideEmptyDecimals;
            this.setInitValue(this.getValue());
         },
         /**
          * Показывать или нет разделители триад
          * @param {Boolean} delimiters true - показывать разделители триад
          */
         setDelimiters: function(delimiters){
            this._options.delimiters = delimiters;
            this.setInitValue(this.getValue());
         },
         /**
          * Показывать только неотрицательное значения или произвольные
          * @param {Boolean} notNegative true - только неотрицательное значения
          */
         setNotNegative: function(notNegative){
            this._options.notNegative = notNegative;
            this.setInitValue(this.getValue());
         }
      });
   });