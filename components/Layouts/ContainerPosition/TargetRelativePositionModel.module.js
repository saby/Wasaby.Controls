/* Ответственный за модуль: Дубровин Игорь Михайлович */
/* Created by im.dubrovin */
define('js!SBIS3.CONTROLS.TargetRelativePositionModel', ['js!SBIS3.CONTROLS.ContainerModel'], function(ContainerModel) {
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
      cornerToCornerOffset:1,
      adapter:1
   },
   TargetRelativePositionModel = $ws.core.extend({


      /**
       * @cfg {CoordinatesType} тип координат которые будут передаваться в метод _setOffsetOfTargetRelative, если опция не задана(undefined) то будет
       * передаваться offset html блока, если задано например {vertical:'top', horizontal:'right'} то будут переданы координаты html элемента {top: 10, right: 200}
       */
      _coordinatesType: undefined,

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
      _cornerToCornerOffset: {
         top: 0,
         left: 0
      },

      /*
      * @cfg {Offset} реалиация ITargetRelativePositionAdapter
      * */
      _adapter: null,


      // блоки/контейнеры учавствующие в позиционировании
      _blocks: {
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
         this._blocks.target = new ContainerModel();
         this._blocks.targetRelative = new ContainerModel();
         this._blocks.parentContainer = new ContainerModel();
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
      setCornerToCornerOffset: function(offset){
         if(this._isOffsetOk(offset)) {
            this._cornerToCornerOffset = offset;
         }
      },

      /**
       * Задать тип необходимых координат, например {}
       * @param {Corner} coordinatesType
       */
      setCoordinatesType: function(coordinatesType){
         if(typeof coordinatesType === "undefined" || this._isCornerOk(coordinatesType)) {
            this._coordinatesType = coordinatesType;
         }
      },

      /**
       * Пересчитать положение targetRelative в модели
       */
      recalculate: function(){
         this._refreshTargetRelative();
      },

      /**
       * Вернуть координаты по заданному типу координат исходя из текущего состояния модели
       * @returns {*}
       */
      getCoordinates:function(){
         var coordinates;

         if(!this._coordinatesType) {
            // если не задан тип координат то позиционируем с помощью css offset
            coordinates = this._blocks.targetRelative.getOffsetByCorner(TOP_LEFT_CORNER);
         }else{
            this._refreshParentContainer();
            coordinates = this._getCoordinatesOfTargetRelative(this._coordinatesType);
         }
         return coordinates;
      },

      /**
       * Применить координаты через адаптер
       * @param {Coordinates} coordinates
       */
      refreshPosition: function(coordinates){
         this._adapter.setOffsetOfTargetRelative(this._coordinatesType , coordinates);
      },

      /**
       * Задать коориднаты выбранной точки на позиционируемом контейнере(Y) относительно выбранной точки на таргете(X), вызвать перерисовку
       * @param offset
       */
      move: function(offset){
         // задатиь в модели сдвиг от таргета к targetRelative
         this.setCornerToCornerOffset(offset);
         // пересчитать модель
         this.recalculate();
         // получить координаты в нужном вииде
         var coordinates = this.getCoordinates();
         // применить координаты через адаптер(например к дом элементу)
         this.refreshPosition(coordinates);
      },

      /**
       * Обновляет  targetRelative контейнер(позиция, размеры) в модели
       * @private
       */
      _refreshTargetRelative: function(){
         /* Получаем offset target'a */
         this._blocks.target.setOffsetByCorner( TOP_LEFT_CORNER , this._adapter.getContainerOffset('target') );

         /* Получаем размеры target блока */
         this._blocks.target.setHeight( this._adapter.getContainerSize('target', 'height') );
         this._blocks.target.setWidth( this._adapter.getContainerSize('target', 'width') );

         /* Получаем размеры targetRelative блока */
         this._blocks.targetRelative.setHeight( this._adapter.getContainerSize('targetRelative', 'height') );
         this._blocks.targetRelative.setWidth( this._adapter.getContainerSize('targetRelative', 'width') );

         /* Получаем offset выбранного originCorner'a target'a */
         var resultOffset = this._blocks.target.getOffsetByCorner(this._originCornerOfTarget);

         /* Получаем offset выбранной точки отсчета targetRelative контейнера */
         resultOffset.top += this._cornerToCornerOffset.top;
         resultOffset.left += this._cornerToCornerOffset.left;

         /* Выставляем offset targetRelative контейнера по его originCorner*/
         this._blocks.targetRelative.setOffsetByCorner( this._originCornerOfTargetRelative , resultOffset );
      },

      /**
       * Обновляет parentContainer (позиция, размеры) в модели(необходимо для получения произвольного вида координат) получая данные через адаптер
       * @private
       */
      _refreshParentContainer: function(){
         this._blocks.parentContainer.setOffsetByCorner( TOP_LEFT_CORNER , this._adapter.getContainerOffset('parentContainer') );
         this._blocks.parentContainer.setHeight( this._adapter.getContainerSize('parentContainer', 'height') );
         this._blocks.parentContainer.setWidth( this._adapter.getContainerSize('parentContainer', 'width') );
      },

      /**
       * Возвращает позицию targetRelative контейнера в parentContainer'e, например {right:10,top:200}
       * @param {CoordinatesType} coordinatesType
       * @private
       */
      _getCoordinatesOfTargetRelative: function(coordinatesType){
         /* Для расчета координат внутри parent контейнера, например  {right:10,top:200}, проще всего использовать ближайшие углы(точки) на контейнерах,
         в данном случае вырхние правые углы на позиционируемом контейнере и на parent контейнере. */
         var coordinates = {},
            closestOffsetOfTargetRelative = this._blocks.targetRelative.getOffsetByCorner(coordinatesType),
            closestOffsetOfParent = this._blocks.parentContainer.getOffsetByCorner(coordinatesType);

         if(coordinatesType.vertical === 'top'){
            coordinates.top = closestOffsetOfTargetRelative.top - closestOffsetOfParent.top;
         }else{
            coordinates.bottom = closestOffsetOfParent.top - closestOffsetOfTargetRelative.top;
         }

         if(coordinatesType.horizontal === 'left'){
            coordinates.left = closestOffsetOfTargetRelative.left - closestOffsetOfParent.left;
         }else{
            coordinates.right = closestOffsetOfParent.left - closestOffsetOfTargetRelative.left;
         }

         return coordinates;
      },


      /* Проверки входных данных (cтоит проверки типов вынести в отдельную сущность) */
      _isOffsetOk: function (offset) {
         if(typeof offset.top === 'number' && typeof offset.left === 'number'){
            return true;
         }else{
            throw new TypeError("Offset должен быть объектом типа {top:10,left:20}");
         }
      },

      _isCornerOk: function (corner) {
         if (corner.vertical in {'top': 1, 'bottom': 1} && corner.horizontal in {'left': 1, 'right': 1}) {
            return true;
         } else {
            throw new TypeError("Не верно задан угол : " + corner);
         }
      }


   });

   return TargetRelativePositionModel;
});
