define('js!SBIS3.SPEC.input.interface.IInputTag', [
], function() {

   /**
    * Интерфейс работы c тегами (цветными информационными уголками) в полях ввода.
    * @mixin SBIS3.SPEC.input.interface.IInputTag
    * @public
    */

   /**
    * @name SBIS3.SPEC.input.interface.IInputTag#tagStyle
    * @cfg {String | undefined} Цвет тега
    * @variant primary
    * @variant done
    * @variant attention
    * @variant error
    * @variant info
    */

   /**
    * @event SBIS3.SPEC.input.interface.IInputTag#onTagClick Происходит при клике по тегу (информационному уголку).
    */

   /**
    * @event SBIS3.SPEC.input.interface.IInputTag#onTagHover Происходит когда курсор мыши входит в область тега (информационного уголка).
    */
});