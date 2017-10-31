define('js!SBIS3.SPEC.input.interface.IInputTag', [
], function() {

   /**
    * Интерфейс работы c тегами (цветными информационными ярлыками) в полях ввода
    * @mixin SBIS3.SPEC.input.interface.IInputTag
    * @public
    */

   /**
    * @name SBIS3.SPEC.input.interface.IInputTag#tagStyle
    * @cfg {String | undefined} Тип тега (цветной информационный ярлык)
    * @variant primary
    * @variant done
    * @variant attention
    * @variant error
    * @variant info
    */

   /**
    * @event SBIS3.SPEC.input.interface.IInputTag#tagClick Происходит при клике по тегу (информационному ярлыку)
    */

   /**
    * @event SBIS3.SPEC.input.interface.IInputTag#tagHover Происходит, когда курсор мыши входит в область тега (информационного ярлыка)
    */
});