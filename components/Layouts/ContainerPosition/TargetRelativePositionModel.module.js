/* Ответственный за модуль: Дубровин Игорь Михайлович */
/* Created by im.dubrovin */
define('js!SBIS3.CONTROLS.TargetRelativePositionModel', [
   'Core/core-extend',
   'js!SBIS3.CONTROLS.ContainerModel'
], function(cExtend, ContainerModel) {
   /*
   Класс производит необходимы расчеты для позиционирования targetRelative контейнера относительно
   target в parentContainer. Пример:
   <pre>
      .
      .   parentContainer
 . . .+-----------------------------------------------------+
      |                                                     |
      |   +-----------+                                     |
      |   |   target  |                                     |
      |   +-----------X . . . . . . .                       |
      |          top  .             .                       |
      |               . . . . . . . Y-----------------+     |
      |                   left      |      target     |     |
      |                             |     relateive   |     |
      |                             +-----------------+     |
      |                                                     |
      |                                                     |
      +-----------------------------------------------------+

      на вход принимает сдвиг относительно таргета (на схеме: точка Y относительно точки X ), на выход выдает либо css offset либо координаты внутри парента
      (например: top:10, right:15 или bottom:10). Возможность выбирать тип координат позволяет мимимализировать изменения их значений в разных приминениях.
      Например если target за счет ксс спозиционирован через right то предпочтительней использовать right для позиционирования targetRelative.

      Манипуляции домом такие как (получение размеров контейнеров, полчение css offset'a target'a, выставление координат target relative) должны быть реализованы
      в переданном адаптере реализующим интерфес ITargetRelativePositionAdapter
   </pre>
   */



   /**
    * @typedef {String} VerticalAlignEnum - расположение по вертикали сверху / снизу
    * @variant top сверху
    * @variant bottom снизу
    *
    * @typedef {String} HorizontalAlignEnum - расположение по горизонтали слева / справа
    * @variant left слева
    * @variant right справа
    *
    * @typedef {{vertical: VerticalAlignEnum, horizontal: HorizontalAlignEnum}} CoordinatesType - тип координат, например {vertical:'top', horizontal:'right'}
    * @typedef {{vertical: VerticalAlignEnum, horizontal: HorizontalAlignEnum}} Corner - обозначение одного из углов контейнера {vertical:'top', horizontal:'right'}
    * @typedef {{top: number, left: number}} Offset - отступ, например: {top: 10, left:20}
    *
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

   var TOP_LEFT_CORNER = {vertical:'top', horizontal:'left'},

   OPTION_NAMES = {
      coordinatesType:1,
      originCornerOfTargetRelative:1,
      originCornerOfTarget:1,
      relativeOffset:1,
      adapter:1
   },
   TargetRelativePositionModel = cExtend({
      /**
       * @cfg {CoordinatesType} тип координат которые будут передаваться в метод _setOffsetOfTargetRelative, если опция не задана(null) то будет
       * передаваться offset html блока, если задано например {vertical:'top', horizontal:'right'} то будут переданы координаты html элемента {top: 10, right: 200}
       */
      _coordinatesType: null,

      /**
       * @cfg {Corner} выбранная точка(угол) отсчета на target контейнере
       */
      _originCornerOfTarget: {
         horizontal: 'left',
         vertical: 'top'
      },

      /**
       * @cfg {Corner} выбранная точка(угол) отсчета на targetRelative контейнере(позиционируемый контейнер)
       */
      _originCornerOfTargetRelative: {
         horizontal: 'left',
         vertical: 'top'
      },

      /**
       * @cfg {Offset} координаты выбранной точки отсчета на позиционируемом контейнере относительно выбранной точки отсчета на таргете
       */
      _relativeOffset: {
         top: 0,
         left: 0
      },

      /**
       * @cfg {Offset} реалиация ITargetRelativePositionAdapter
       */
      _adapter: null,


      // блоки/контейнеры учавствующие в позиционировании
      _containerModels: {
         target : null,
         targetRelative : null,
         parentContainer : null
      },


      constructor: function(options){
         // Забор опций
         for(var optionName in options) if(options.hasOwnProperty(optionName)){
            if(OPTION_NAMES.hasOwnProperty(optionName)){
               this['_' + optionName] = options[optionName];
            }else{
               throw new Error('Не распознанная опция: ' + optionName);
            }
         };
         this._init();
      },

      _init: function(){
         // создаем модели контейнеров
         this._containerModels.target = new ContainerModel();
         this._containerModels.targetRelative = new ContainerModel();
         this._containerModels.parentContainer = new ContainerModel();
      },

      /**
       * Задаем угол на target конетейнере относительно которого будем позиционировать(точка отсчета - X)
       * @param {Corner} originCorner
       */
      setOriginCornerOfTarget: function(originCorner){
         if(this._isCornerOk(originCorner)) {
            this._originCornerOfTarget = originCorner;
         }
      },

      /**
       * Задаем угол(точку) на позиционируемом конетейнере (Y), через координаты которого будет позиционироваться контейнер
       * @param {Corner} originCorner
       */
      setOriginCornerOfTargetRelative: function(originCorner){
         if(this._isCornerOk(originCorner)) {
            this._originCornerOfTargetRelative = originCorner;
         }
      },


      /**
       * Задать коориднаты выбранной точки на позиционируемом контейнере(Y) относительно выбранной точки на таргете(X)
       * @param offset
       */
      setRelativeOffset: function(offset){
         if(this._isOffsetOk(offset)) {
            this._relativeOffset = offset;
         }
      },

      /**
       * Задать тип необходимых координат, например {}
       * @param {Corner} coordinatesType
       */
      setCoordinatesType: function(coordinatesType){
         if(coordinatesType === null || this._isCornerOk(coordinatesType)) {
            this._coordinatesType = coordinatesType;
         }
      },

      /**
       * Обновляет  targetRelative контейнер(позиция, размеры) в модели
       * @private
       */
      recalcPositionOfTargetRelative: function(){
         // обновляем данные контейнеров через адаптер
         this._refreshContainerSize('target');
         this._refreshContainerSize('targetRelative');
         this._refreshContainerOffset('target');
         // если требуется получить координаты относительно parent container модель парент контейнера через адаптер
         if(this._coordinatesType !== null){
            this._refreshContainerOffset('parentContainer');
            this._refreshContainerSize('parentContainer');
         }

         var originPoint = {};
         // получаем offset точеки отсчета на таргете
         originPoint.onTarget = this._containerModels.target.getOffsetByCorner(this._originCornerOfTarget);
         // вычисляем offset точки отсчета на targetRelative
         originPoint.onTargetRelative = this._calcOriginPointOfTargetRelative(originPoint.onTarget, this._relativeOffset);
         // выставляем offset targetRelative контейнера по его originCorner
         this._containerModels.targetRelative.setOffsetByCorner( this._originCornerOfTargetRelative , originPoint.onTargetRelative );

         // применяем позицию из модели через адаптер
         this._applyPositionOfTargetRelative();
      },

      /**
       * Обновить размер в модели контейнера
       * @param {ContainerName} containerName
       * @private
       */
      _refreshContainerSize: function(containerName){
         var containerModel, width, height;

         containerModel = this._containerModels[containerName];
         // получаем размеры через адаптер
         width = this._adapter.getContainerSize(containerName, 'width');
         height = this._adapter.getContainerSize(containerName, 'height');
         // записываем модель
         containerModel.setWidth( width );
         containerModel.setHeight( height );
      },

      /**
       * Обновить offset в модели контейнера
       * @param {ContainerName} containerName
       * @private
       */
      _refreshContainerOffset: function(containerName){
         var containerModel, offset;

         containerModel = this._containerModels[containerName];
         // получаем через адаптер
         offset = this._adapter.getContainerOffset(containerName);
         // записываем в модель
         containerModel.setOffsetByCorner( TOP_LEFT_CORNER , offset);
      },

      /**
       * Вычисляет offset точки отсчета позиционируемого блока
       * @param {Offset} originPointOnTarget offset точки остчета
       * @param relativeOffset сдвиг позиционируемого контейнера относительно точки отсчета
       * @returns {Offset}
       * @private
       */
      _calcOriginPointOfTargetRelative: function(originPointOnTarget, relativeOffset){
         return {
            top: originPointOnTarget.top + relativeOffset.top,
            left:originPointOnTarget.left + relativeOffset.left
         }
      },

      /*
       * Выдает из модели offset targetRelative блока
       */
      _getOffsetOfTargetRelative: function(){
         // offset targetRelative блока === offset его верхней левой точки
         return this._containerModels.targetRelative.getOffsetByCorner(TOP_LEFT_CORNER);
      },

      /**
       * Выдает координаты заданного типа
       * @returns {{}}
       * @private
       */
      _getCoordinatesOfTargetRelative: function(){
         var coordinates = {}, // результирующие координаты
            // угол на прямоугольнике имеющий наименьше координаты для заданного типа координат(совпадает с типом координат)
            closestCorner = this._coordinatesType,
            // offset closestCorner'a на позиционируемом контейнере
            closestPoint = this._containerModels.targetRelative.getOffsetByCorner(closestCorner),
            // угол на паренте который берется за точку отсчета
            originCorner = this._coordinatesType,
            // offset originCorner'a
            originPoint = this._containerModels.parentContainer.getOffsetByCorner(originCorner),

            // сдвиг сверху ближайшей точки на позиционируемом контейнере относительно точки отсчета
            relativeTop = closestPoint.top - originPoint.top,
            // сдвиг слева ближайшей точки на позиционируемом контейнере относительно точки отсчета
            relativeLeft = closestPoint.left - originPoint.left;

         // координата по вертикали (top/bottom)
         coordinates[this._coordinatesType.vertical] =  (this._coordinatesType.vertical === 'top') ? relativeTop : -relativeTop;
         // координата по горизонтали (top/bottom)
         coordinates[this._coordinatesType.horizontal] =  (this._coordinatesType.horizontal === 'left') ? relativeLeft : -relativeLeft;

         return coordinates;
      },

      /**
       * Применить координаты позиционируемого контейнера из модели
       * @private
       */
      _applyPositionOfTargetRelative: function(){
         // получаем нужного типа координаты
         var coordinates = (this._coordinatesType === null)
            // если тип координат не передан используем офсет
            ? this._getOffsetOfTargetRelative()
            // иначе получаем координаты заданного типа
            : this._getCoordinatesOfTargetRelative();

         // выставляем их через адаптер
         this._adapter.setCoordinatesOfTargetRelative(this._coordinatesType , coordinates);
      },

      /* Проверки входных данных (cтоит проверки типов вынести в отдельную сущность) */
      _isOffsetOk: function(offset) {
         if(typeof offset.top === 'number' && typeof offset.left === 'number'){
            return true;
         }else{
            throw new TypeError("Offset должен быть объектом типа {top:10,left:20}");
         }
      },

      _isCornerOk: function(corner) {
         if (corner.vertical in {'top': 1, 'bottom': 1} && corner.horizontal in {'left': 1, 'right': 1}) {
            return true;
         } else {
            throw new TypeError("Не верно задан угол : " + corner);
         }
      }


   });

   return TargetRelativePositionModel;
});