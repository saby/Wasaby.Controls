/**
 * Created by as.avramenko on 09.08.2016.
 */

define('js!SBIS3.CONTROLS.Accordion', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.ItemsControlMixin',
   'html!SBIS3.CONTROLS.Accordion',
   'browser!tmpl!SBIS3.CONTROLS.Accordion/resources/ItemTemplate',
   'browser!tmpl!SBIS3.CONTROLS.Accordion/resources/ItemContentTemplate',
   'js!SBIS3.CONTROLS.Spoiler'
], function(CompoundControl, ItemsControlMixin, dotTplFn, ItemTemplate, ItemContentTemplate) {

   'use strict';

   /**
    * Контрол, содержащий несколько областей содержащих контент.
    * В каждый момент времени отображается только одна область.
    * Отображаемая область может переключаться при клике на корневые пункты аккордеона.
    * @author Авраменко Алексей Сергеевич
    * @class SBIS3.CONTROLS.Accordion
    * @extends SBIS3.CONTROLS.CompoundControl
    */

   var Accordion = CompoundControl.extend([ItemsControlMixin], /** @lends SBIS3.CONTROLS.Accordion.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            itemTpl: ItemTemplate,
            itemContentTpl: ItemContentTemplate,
            _canServerRender: true
         },
         _checkClickByTap: false
      }
   });

   return Accordion;

});
