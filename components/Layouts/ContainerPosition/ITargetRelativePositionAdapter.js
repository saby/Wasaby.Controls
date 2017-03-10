define('js!SBIS3.CONTROLS.ITargetRelativePositionAdapter', [], function () {
   'use strict';
   /**
    * Интерфейс адаптера, осуществляющиего операции c домом(виртуальным домом / произвольной моделью) в контексте позиционирования относительно таргета
    * @mixin SBIS3.CONTROLS.ITargetRelativePositionAdapter
    * @public
    * @author Дубровин Игорь
    */

   /**
    * @typedef {String} ContainerName - один из контейнеров учавствующий в позиционировании
    * @variant target - обозначение контейнера выступающего в качестве таргета (относительно какого контейнера позиционируем)
    * @variant targetRelative справа - обозначение позиционируемого контейнера
    * @variant parentContainer справа - обозначение контейнера в котором находится позиционируемый контейнер, координаты targetRelative будут считаться от него
    *
    * @typedef {String} DimensionName - один из контейнеров учавствующий в позиционировании
    * @variant width - ширина
    * @variant height - высота
    *
    * @typedef {Object} Coordinates - координаты вида {top: 10, left:10} в зависимости от выбранного способа позиционирования
    */


   return {
      /**
       * По названию контейнера(target/targetRelative/parentContainer) одного из контейнеров и dimensionName(width/height) он должен возвращать число(ширину/высоту)
       * @param {ContainerName} containerName
       * @param {DimensionName} dimensionName
       * @protected
       */
      getContainerSize: function(containerName, dimensionName){
         throw new Error("Метод для получения размеров контейнера должен быть импелементирован");
      },

      /**
       * По названию контейнера должен возвращать его css offset
       * @param {ContainerName} containerName
       * @protected
       */
      getContainerOffset: function(containerName){
         throw new Error("Метод для получения offset'a контейнера должен быть импелементирован");
      },

      /**
       * Координаты должны применятся к позиционируемому блоку (targetRelative)
       * @param {Coordinates} coordinates
       * @protected
       */
      setCoordinatesOfTargetRelative: function(coordinatesType, coordinates){
         throw new Error("Метод для задания offset'a targetRelative контейнера должен быть импелементирован");
      }
   };
})
