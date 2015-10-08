/**
 * Created by ps.borisov on 08.10.2015.
 */
define('js!SBIS3.CONTROLS.Utils.ImageUtil',[], function () {
   'use strict';
   /**
    *
    */
   var ImageUtil = {
      getDimensions: function(target) {
         var
            doc = document.documentElement,
         //коэффициент отступа
            perIndent = 0.05,
         //минимальная ширина/длина модального окна
            dialogDimensionMin = 200,
         //ширина окна документа
            docWidth = doc.clientWidth,
         //длина окна документа
            docHeight = doc.clientHeight,
         //расчет процента превышения размера изображения над размером документа
            perDimension = function (docDimension, imgDimension) {
               return docDimension > imgDimension ? 1 : docDimension / imgDimension;
            },
         //выбор наибольшего соотношения сторон по которому производить уменьшение изображения
            perMostSide = function (dimensions) {
               var
                  widthPer = perDimension(dimensions.docW, dimensions.imgW),
                  heightPer = perDimension(dimensions.docH, dimensions.imgH),
               //чем больше процент, тем меньше соотношение сторон
                  isHeightMostSide = widthPer >= heightPer,
                  mostSidePer = 0;
               if (widthPer !== heightPer) {
                  mostSidePer = isHeightMostSide ? heightPer : widthPer;
                  if (mostSidePer > perIndent) {
                     mostSidePer -= perIndent;
                  }
                  $(target).css(isHeightMostSide ? 'height' : 'width', '100%');
               }
               return mostSidePer;
            },
         //расчёт сторон окна для оптимального просмотра изображения
            sideDimension = function (docDimension, imgDimension, percentageRatio) {
               if (percentageRatio) {
                  imgDimension *= percentageRatio;
               }
               return imgDimension < dialogDimensionMin ? dialogDimensionMin : imgDimension;
            },
         //процент уменьшения изображения
            perRatio = perMostSide({
               docW: docWidth,
               docH: docHeight,
               imgW: target.naturalWidth,
               imgH: target.naturalHeight
            });

         return {
            width: sideDimension(docWidth, target.naturalWidth, perRatio),
            height: sideDimension(docHeight, target.naturalHeight, perRatio)
         };
      }
   };

   return ImageUtil;
});