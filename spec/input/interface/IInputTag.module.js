define('js!SBIS3.SPEC.interface.IInputTag', [
], function() {

   /**
    * Интерфейс работы c тегами в полях ввода.
    * @mixin SBIS3.SPEC.interface.IInputTag
    * @public
    */

   /**
    * @name SBIS3.SPEC.interface.IInputTag#tagStyle
    * @cfg {String | undefined} Набор цветов для иконки
    * @variant primary #587AB0.
    * @variant done #72BE44.
    * @variant attention #FEC63F.
    * @variant error #EF463A.
    * @variant info #999999.
    */

   /**
    * @event SBIS3.SPEC.interface.IInputTag#onTagClick Происходит при клике по тегу.
    */

   /**
    * @event SBIS3.SPEC.interface.IInputTag#onTagHover Происходит когда курсор мыши входит в область тега.
    */
});