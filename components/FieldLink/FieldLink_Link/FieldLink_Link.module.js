define('js!SBIS3.CONTROLS.FieldLink.Link', [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.Clickable',
      'Core/core-instance',
      'tmpl!SBIS3.CONTROLS.FieldLink.Link',
      'css!SBIS3.CONTROLS.FieldLink.Link'
   ],
   function(CompoundControl, Clickable, cInstance, dotTplFn) {
      
      'use strict';
      
      /**
       * Сслыка, которая может использоваться в качестве метки поля связи.
       * Так же можно положить её в placeholder поля связи.
       * Клик по ссылке посылает комманду showSelector. Если ссылка используется в качестве метки,
       * то нужно задать опцию {@link owner}, чтобы комманду обработало поле связи с имененем, указанном в {@link owner}.
       * @class SBIS3.CONTROLS.FieldLink.Link
       * @extends SBIS3.CONTROLS.Link
       * @author Герасимов Александр Максимович
       *
       * @cssModifier controls-FieldLink-Link__filterButton Стилизация ссылки для кнопки фильтров.
       *
       * @control
       * @public
       */
      
      var FieldLink_Link = CompoundControl.extend([ Clickable ], {
         _dotTplFn: dotTplFn,
         $constructor: function() {
            this._options.command = 'showSelector';
            // Если ссылка находится внутри поля связи (placeholder) фокус принимать она не должна.
            this._options.activableByClick = false;
            this.setTabindex(0);
         }
      });
      
      return FieldLink_Link;
   });
