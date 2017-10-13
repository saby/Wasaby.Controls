define('js!SBIS3.SPEC.interface.IInputTag', [
], function() {

   /**
    * Интерфейс работы c тегами (цветными информационными уголками) в полях ввода.
    * @mixin SBIS3.SPEC.interface.IInputTag
    * @public
    */

   /**
    * @name SBIS3.SPEC.interface.IInputTag#tagStyle
    * @cfg {String | undefined} Цвет тега
    * @variant primary #587AB0 (синий).
    * @variant done #72BE44 (зеленый).
    * @variant attention #FEC63F (оранжевый).
    * @variant error #EF463A (красный).
    * @variant info #999999 (серый).
    */

   /**
    * @event SBIS3.SPEC.interface.IInputTag#onTagClick Происходит при клике по тегу (информационному уголку).
    */

   /**
    * @event SBIS3.SPEC.interface.IInputTag#onTagHover Происходит когда курсор мыши входит в область тега (информационного уголка).
    */
});