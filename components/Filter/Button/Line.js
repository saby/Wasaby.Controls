define('SBIS3.CONTROLS/Filter/Button/Line',
   [
      'Lib/Control/CompoundControl/CompoundControl',
      'SBIS3.CONTROLS/Filter/Button/Utils/FilterToStringUtil',
      'tmpl!SBIS3.CONTROLS/Filter/Button/Line/FilterLine',
      'Core/helpers/String/escapeTagsFromStr',
      'SBIS3.CONTROLS/Mixins/Clickable'
   ],
   function(CompoundControl, FilterToStringUtil, dotTplFn, escapeTagsFromStr, Clickable) {

      /**
       * Контрол, отображающий строку из применённых фильтров рядом с кнопкой фильтров.
       * Умеет отображать строку по определенному шаблону. Работает исключительно через контекст.
       * @class SBIS3.CONTROLS/Filter/Button/Line
       * @extends Lib/Control/CompoundControl/CompoundControl
       * @author Крайнов Д.О.
       * @control
       * @public
       */

      var FilterLine = CompoundControl.extend([Clickable], {

         _dotTplFn: dotTplFn,

         $constructor: function() {
            var context = this.getLinkedContext(),
               self = this,
               updateContext = function() {
                  var linkText;
                  var isVisible = self.isVisible();
                  var newVisible;

                  /* Проверяем, изменился ли фильтр */
                  if (context.getValue('filterChanged')) {
                     /* Пробежимся по структуре фильтров и склеим строку */
                     linkText = FilterToStringUtil.string(context.getValue('filterStructure'), 'itemTemplate');
                  } else {
                     linkText = context.getValue('filterResetLinkText');
                  }

                  context.setValueSelf({
                     linkText: linkText,
                     titleText: escapeTagsFromStr(linkText, '')
                  });
   
                  newVisible = !!linkText;
                  
                  /* Внезапно, в AreaAbstract нет проверки в методе toggle, на то, меняется ли visible,
                     и даже если ничего не менялось, код вызывает лишнюю перефокусировку, поэтому проверяю руками. */
                  if (newVisible !== isVisible) {
                     self.toggle(newVisible);
                  }
                  self._notifyOnSizeChanged();
               };

            updateContext();
            context.subscribe('onFieldsChanged', updateContext);
         },
         _clickHandler: function() {
            this.sendCommand('show-filter');
         }
      });

      return FilterLine;
   }
);