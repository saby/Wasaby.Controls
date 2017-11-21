define('js!Controls/Input/interface/IInputTag', [
], function() {

   /**
    * Интерфейс работы c тегами (цветными информационными ярлыками) в полях ввода
    * @mixin Controls/Input/interface/IInputTag
    * @public
    */

   /**
    * @name Controls/Input/interface/IInputTag#tagStyle
    * @cfg {String | undefined} Тип тега (цветной информационный ярлык)
    * @variant primary
    * @variant done
    * @variant attention
    * @variant error
    * @variant info
    */

   /**
    * @event Controls/Input/interface/IInputTag#tagClick Происходит при клике по тегу (информационному ярлыку)
    */

   /**
    * @event Controls/Input/interface/IInputTag#tagHover Происходит, когда курсор мыши входит в область тега (информационного ярлыка)
    */
});