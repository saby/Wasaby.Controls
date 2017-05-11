/**
 * Created by as.avramenko on 09.08.2016.
 */

define('js!SBIS3.CONTROLS.Accordion', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.ItemsControlMixin',
   'html!SBIS3.CONTROLS.Accordion',
   "Core/Context",
   'browser!tmpl!SBIS3.CONTROLS.Accordion/resources/ItemTemplate',
   'browser!tmpl!SBIS3.CONTROLS.Accordion/resources/ItemContentTemplate',
   'js!SBIS3.CONTROLS.Spoiler'
], function(CompoundControl, ItemsControlMixin, dotTplFn, cContext, ItemTemplate, ItemContentTemplate) {

   'use strict';

   /**
    * Класс контрола "Аккордеон".
    * Стандарт описан <a href='http://axure.tensor.ru/standarts/v7/%D0%B0%D0%BA%D0%BA%D0%BE%D1%80%D0%B4%D0%B5%D0%BE%D0%BD__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_7_1_.html'>здесь</a>.
    * @class SBIS3.CONTROLS.Accordion
    * @extends SBIS3.CORE.CompoundControl
    * @author Авраменко Алексей Сергеевич
    * @public
    * @mixes SBIS3.CONTROLS.ItemsControlMixin
    */

   var Accordion = CompoundControl.extend([ItemsControlMixin], /** @lends SBIS3.CONTROLS.Accordion.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            itemTpl: ItemTemplate,
            itemContentTpl: ItemContentTemplate,
            _canServerRender: true,
            _buildTplArgs: function(cfg) {
               var
                  tplCfg = cfg._buildTplArgsSt.apply(this, arguments);
               // Контекст каждого элемента аккордеона должен быть изолирован, иначе бинды поплывут вверх до родительских
               // контекстов, возможно их пересечение между собой и просто с другими забинденными свойствами
               tplCfg.generateContext = function() {
                  return new cContext({restriction: 'set'});
               };
               return tplCfg;
            }
         },
         _checkClickByTap: false
      }
   });

   return Accordion;

});
