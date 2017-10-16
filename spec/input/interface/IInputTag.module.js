define('js!SBIS3.SPEC.input.interface.IInputTag', [
], function() {

   /**
    * Интерфейс работы c тегами (цветными информационными иконками) в полях ввода.
    * @mixin SBIS3.SPEC.input.interface.IInputTag
    * @public
    */

   /**
    * @name SBIS3.SPEC.input.interface.IInputTag#tagStyle
    * @cfg {String | undefined} Цвет тега (цветная информационная иконка).
    * @variant primary
    * @variant done
    * @variant attention
    * @variant error
    * @variant info
    */

   /**
    * @event SBIS3.SPEC.input.interface.IInputTag#onTagClick Происходит при клике по тегу (информационной иконке).
    */

   /**
    * @event SBIS3.SPEC.input.interface.IInputTag#onTagHover Происходит, когда курсор мыши входит в область тега (информационной иконки).
    */
});