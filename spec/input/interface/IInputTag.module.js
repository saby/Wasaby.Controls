define('js!SBIS3.SPEC.interface.IInputTag', [
], function() {

   /**
    * Интерфейс работы тегами в полях ввода.
    * @mixin SBIS3.SPEC.interface.IInputTag
    * @public
    */

   /**
    * @name SBIS3.SPEC.interface.IInputTag#tagStyle
    * @cfg {String} primary, done, attention, error, info
    */

   /**
    * @event SBIS3.SPEC.interface.IInputTag#onTagClick Происходит при клике по тегу.
    */

   /**
    * @event SBIS3.SPEC.interface.IInputTag#onTagHover Происходит когда курсор мыши входит в область тега.
    */
});