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
            //функция получение реального размера изображения тк в ie8 нет naturalHeight/width
            naturalSizes = this.getNaturalSizes(target),
            targetWidth = naturalSizes.width,
            targetHeight =  naturalSizes.height,
         //процент уменьшения изображения
            perRatio = perMostSide({
               docW: docWidth,
               docH: docHeight,
               imgW: targetWidth,
               imgH: targetHeight
            });
         return {
            width: sideDimension(docWidth, targetWidth, perRatio),
            height: sideDimension(docHeight, targetHeight, perRatio)
         };
      },
      getNaturalSizes: function(DOMelement) {
         var img = new Image();
         img.src = DOMelement.src;
         return {width: img.width || DOMelement.naturalWidth, height: img.height || DOMelement.naturalHeight};
      }
   };

   return ImageUtil;
});