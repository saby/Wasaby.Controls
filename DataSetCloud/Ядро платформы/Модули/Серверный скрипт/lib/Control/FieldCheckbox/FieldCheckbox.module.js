/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 21.04.13
 * Time: 17:24
 * To change this template use File | Settings | File Templates.
 *
 * Контрол "Флаг"
 */
define("js!SBIS3.CORE.FieldCheckbox", ["js!SBIS3.CORE.FieldAbstract", "html!SBIS3.CORE.FieldCheckbox", "css!SBIS3.CORE.FieldCheckbox"], function( FieldAbstract, dotTplFn ) {

   "use strict";

   /**
    *
    * Флаг - контрол для определения результата какого-либо события.
    * Результатом события можно считать: прочтение пользователем правил форума, лицензионного соглашения или принятие решения на получение новостных рассылок.
    * Флаги часто используются в различных формах, например, при регистрации аккаунтов/ пользователей.
    * Контрол "Флаг", обычно, может принимать 2 значения: флаг установлен (true) и флаг сброшен (false).
    * Но при включении параметра "Трехпозиционный" появляется возможность выбора третьего значения: неопределён или значение неизвестно (null).
    * @class $ws.proto.FieldCheckbox
    * @extends $ws.proto.FieldAbstract
    * @control
    * @initial
    * <component data-component='SBIS3.CORE.FieldCheckbox'>
    *    <option name='caption'>Флаг</option>
    * </component>
    * @category Select
    * @designTime plugin /design/DesignPlugin
    * @ignoreOptions maxLength
    * @ignoreOptions width
    * @ignoreOptions cssClass
    */
   $ws.proto.FieldCheckbox = FieldAbstract.extend(/** @lends $ws.proto.FieldCheckbox.prototype */{
      $protected: {
         _box : null,
         _options : {
            /**
             * @cfg {String} Текст возле флага
             * <wiTag group="Отображение">
             * @example
             * При клике на кнопку (btn) определить состояние флага (fieldCheckbox).
             * Если он установлен, то подпись флага дублируется в поле ввода (fieldString).
             * <pre>
             *    btn.subscribe('onClick', function() {
             *       if (fieldCheckbox.getValue()) {
             *          fieldString.setValue('Выбран фильтр: ' + fieldCheckbox.getCaption());
             *       }
             *    });
             * </pre>
             * @see setCaption
             * @see getCaption
             * @see align
             * @translatable
             */
            caption: '',
            /**
             * @cfg {Boolean} Включить трехзначный флаг
             * <wiTag group="Отображение">
             * По умолчанию значения флага: "true" и "false". При активации данной опции будет доступно третье значение флага: "null".
             * Поле флага при установке значения "null" будет полностью закрашиваться в голубой цвет.
             * На данный момент нет программных методов (setter или getter) изменения этого свойства.             
             * Возможные значения:
             * 1. "true" - флаг трехпозиционный.
             * 2. "false" - флаг двухпозиционный.
             */
            isThirdPosition : false,
            /**
             * @cfg {String} Ширина контрола
             * Это ширина, которую занимает контрол "Флаг": текст флага и поле для установки флага.
             * Значение можно указать в пикселях (px) или в процентах (%).
             * 1. width:'350px',
             * 2. width:'90%'.
             * @noShow
             */
            width: '100%',
            /**
             * @cfg {String} Положение флага в контроле
             * Контрол "Флаг" может быть широким, поэтому поле флага, где пользователь устанавливает значение,
             * можно выровнять по какому-либо краю: правому или левому.             
             * Если для флага определен текст (caption), то он выравнивается совместо с полем для флага.
             * @see caption
             * @variant left выравнивание к левому краю
             * @variant right справа выравнивание к правому краю
             */
            align : 'left',
            cssClass: "ws-field-checkbox",
            value: false
         },
         _curval : 'false',
         _caption: '',
         _keysWeHandle: [
            $ws._const.key.space
         ]
      },
      $constructor : function(){
         var self = this;
         this._caption = this._options.caption;
         this._curval = typeof this._options.value  == 'boolean' ? this._options.value.toString() : this._curval;
         this._box.addClass(this._curval);
         this._container
            .attr('title', this._options.tooltip)
            .addClass("ws-checkbox-" + this._options.align);
         //добавляем класс для метки, если она привязана к флагу
         var wrap;
         if((wrap = this._container.parent()).hasClass('ws-labeled-control ws-non-control'))
            wrap.addClass('bind-for-checkbox');

         this._inputControl
               .click(function(){
                  if (self._isChangeable())
                     self._changeState();
               })
               .hover(function(e){
                  self._container.toggleClass('ws-checkbox-hover', e.type == 'mouseenter');
               });
      },
      /**
       * Обработчик нажатия клавиши
       * @param {Object} event Объект jQuery-события
       * @private
       */
      _keyboardHover: function(event){
         if(event.which === $ws._const.key.space && this.isEnabled()){
            this._changeState();
         }
      },

      _dotTplFn: dotTplFn,

      _bindInternals: function() {
         this._box = this._container.find('.box');
         this._inputControl = this._container.find('.box, .checkbox-label');
      },
      /**
       * Возвращает значение флага по умолчанию.
       * Возможные значения:
       * 1. true - флаг установлен.
       * 2. false - флаг сброшен.
       * 3. null - значение флага не определено.
       * @returns {*}
       * @private
       */
      _getDefaultValue: function(){
         var self = this,
            checkValue = function(value){
            if(typeof value === 'boolean'){
               return value;
            }
            else if(value === null && self._options.isThirdPosition){
               return null;
            }
            else{
               $ws.single.ioc.resolve('ILogger').error("FieldCheckBox::_getDefaultValue", "Incorrect default value " + value);
            }
            return false;
         };
         if (typeof this._options.value === 'function'){
            var value = this._options.value();
            return checkValue(value);
         }
         return checkValue(this._options.value);
      },
      /**
       * Это функция, которая разруливает установку в элемент управления дефолтного значения, заданного при проектировании
       */
      _defaultValueHandler: function(){
         this.setValue(this.getDefaultValue());
      },
      _changeState : function(){
         this.setValue({
            'true'  : this._options.isThirdPosition ? 'null' : 'false',
            'false' : 'true',
            'null'  : 'false'
         }[this._curval]);
         this._notify('onChange', this._notFormatedVal());
      },
      _setValueInternal : function(value){
         value = (value === null || value === undefined) ? 'null' : value.toString();
         this._curval = value === 'null' && !this._options.isThirdPosition ? false : value;
         this._box
            .removeClass()
            .addClass('box')
            .addClass(this._curval);
      },
      _notFormatedVal : function(){
         return {
               'true' : true,
               'false' : false,
               'null' : null
            }[this._curval];
      },
      _setEnabled : function(e){
         $ws.proto.Control.prototype._setEnabled.apply(this, arguments);
      },
      /**
       * <wiTag group="Управление">
       * Установить текст подписи флага.
       * @param {String} caption Текст подписи флага.
       * @example
       * Из массива names установить подписи каждому флагу.
       * <pre>
       *    //names - массив с названиями товаров
       *    //flags - массив объектов-флагов
       *    $ws.helpers.forEach(names, function(name, index) {
       *       flags[index].setCaption(name);
       *    });
       * </pre>
       * @see getCaption
       * @see caption
       */
      setCaption : function(caption){
         this._caption = caption;
         this._inputControl[1].innerHTML = caption;
      },
      /**
       * <wiTag group="Данные">
       * Получить текст подписи флага.
       * @returns {string} Текст подписи.
       * @example
       * При клике на кнопку (btn) вывести список заказанных товаров.
       * <pre>
       *    btn.subscribe('onClick', function() {
       *       var message = 'Вы заказали: ';
       *       //flags - массив с объектами-флагами
       *       $ws.helpers.forEach(flags, function(element) {
       *          if (element.getValue()) {
       *             message += element.getCaption() + ', ';
       *          }
       *       });
       *       //выводим список товаров и просим пользователя подтвердить заказ
       *       $ws.helpers.question(message.substring(0, message.length - 2) + '. Оформить заказ?');
       *    });
       * </pre>
       * @see setCaption
       * @see caption
       */
      getCaption: function(){
         return this._caption;
      },
       /**
        * <wiTag group="Отображение">
        * Изменить положение поля флага
        * Если для флага определена подпись ({@link caption}), то её текст выравнивается совместно с полем для флага.
        * @param {String} align Положение поля флага.
        * Возможные значения:
        * <ol>
        * <li>left - выравнивание к левому краю.</li>
        * <li>right - выравнивание к правому краю.</li>
        * </ol>
        */
      setAlign: function(align) {
         this._container
            .removeClass('ws-checkbox-' + this._options.align)
            .addClass("ws-checkbox-" + align);
         this._options.align = align;
      },

      getStringValue : function(){
         var res;
         if (this.getValue())
            res = this._options.caption ? this._options.caption : this.getName();
         else
            res = '';
         return res;
      }
   });

   return $ws.proto.FieldCheckbox;

});
