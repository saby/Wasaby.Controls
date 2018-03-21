/**
 * Created by as.krasilnikov on 21.03.2018.
 */
define('Controls/Popup/Opener/InfoBox/InfoBoxStrategy', ['Controls/Popup/Opener/InfoBox/resources/themeConstantsGetter'], function (themeConstantsGetter) {
   // Получание констант из темы. Эксперементальный способ
   var constants = themeConstantsGetter('controls-InfoBox__themeConstants', {
      ARROW_WIDTH: 'marginLeft',
      ARROW_H_OFFSET: 'marginRight',
      ARROW_V_OFFSET: 'marginBottom',
      TARGET_OFFSET: 'marginTop'
   });

   var SIDES = {
      't': 'top',
      'r': 'right',
      'b': 'bottom',
      'l': 'left',
      'c': 'center'
   };

   var INVERTED_SIDES = {
      't': 'bottom',
      'r': 'left',
      'b': 'top',
      'l': 'right',
      'c': 'center'
   };

   var _private = {
      // Проверяет хватает ли ширины таргета для корректного позиционирования стрелки.
      // Возвращает offset на который нужно сдвинуть инфобокс.
      getOffset: function(targetSize, alignSide, arrowOffset, arrowWidth){
         var align = INVERTED_SIDES[alignSide];
         /*
          * Проверяем, хватает ли нам ширины таргета для правильного позиционирования стрелки, если нет, то просто
          * сдвигаем стрелку инфобокса на центр таргета
          * */
         if(align !== 'center' && targetSize < arrowWidth + arrowOffset){
            switch(align){
               case 'top':
               case 'left':
                  return arrowWidth/2 + arrowOffset - targetSize/2;
               case 'bottom':
               case 'right':
                  return -arrowWidth/2 + -arrowOffset + targetSize/2;
            }
         }
         return 0;
      }
   };

   return {
      // Возвращаем конфигурацию подготовленную для StickyStrategy
      getStickyParams: function(position, target){
         var side = position[0];
         var alignSide = position[1];
         var topOrBottomSide = side === 't' || side === 'b';

         return {
            verticalAlign: {
               side: topOrBottomSide ? SIDES[side] : INVERTED_SIDES[alignSide],
               offset: topOrBottomSide ?
                  (side === 't' ? -constants.TARGET_OFFSET : constants.TARGET_OFFSET) :
                  _private.getOffset(target.offsetHeight, alignSide, constants.ARROW_V_OFFSET, constants.ARROW_WIDTH)
            },

            horizontalAlign: {
               side: topOrBottomSide ? INVERTED_SIDES[alignSide] : SIDES[side],
               offset: topOrBottomSide ?
                  _private.getOffset(target.offsetWidth, alignSide, constants.ARROW_H_OFFSET, constants.ARROW_WIDTH) :
                  (side === 'l' ? -constants.TARGET_OFFSET : constants.TARGET_OFFSET)
            },

            corner: {
               vertical: topOrBottomSide ? SIDES[side] : SIDES[alignSide],
               horizontal: topOrBottomSide ? SIDES[alignSide] : SIDES[side]
            }
         }
      }
   };
});