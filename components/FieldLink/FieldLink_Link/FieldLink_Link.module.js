define('js!SBIS3.CONTROLS.FieldLink.Link', [
       'js!SBIS3.CONTROLS.Link',
       'Core/core-instance'
    ],
    function(Link, instance) {

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

       var FieldLink_Link =  Link.extend([], {
          $constructor: function() {
             this.once('onInit', function() {
                var parent = this.getParent();

                /* Если ссылка находится внутри поля связи (placeholder)
                   фокус принимать она не должна. */
                if(instance.instanceOfModule(this.getParent(), 'SBIS3.CONTROLS.FieldLink')) {
                   this._options.activableByClick = false;
                   this.setTabindex(0);
                   /* Зададим owner'a, чтобы команду обрабатывало поле связи,
                      в котором лежит ссылка */
                   this.setOwner(parent);
                }
             });
          },

          _modifyOptions: function() {
             var cfg = FieldLink_Link.superclass._modifyOptions.apply(this, arguments);
             cfg.className += ' controls-FieldLink__Link';
             /* Зашиваем комманду для обработки полем связи */
             cfg.command = 'showSelector';
             return cfg;
          }
       });

       return FieldLink_Link;
    });
