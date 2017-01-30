   /* Ответственный за модуль: Дубровин Игорь Михайлович */
/** Created by im.dubrovin */
define('js!SBIS3.CONTROLS.ContainerModel',[],function() {
   /**
    * Модель контейнера - может использоваться в алгоритмах манипулируюх контейнерами,
    * например в алгоритме позиционирования контейнера относителоьно таргета
    * @author Дубровин Игорь Михайлович
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
    * @typedef {{vertical: VerticalAlignEnum, horizontal: HorizontalAlignEnum}} ContainerCorner - определение угла
    *
    * @typedef {{top: number, left: number}} Offset - отступ, например: {top: 10, left:20}
    */
   var TOP_LEFT_CORNER = {vertical:'top', horizontal:'left'},

   ContainerModel = $ws.core.extend({

      _height: 0,
      _width: 0,

      /* отступ левого верхнего угла контейнера от точки отсчета*/
      _offsetTop: 0,
      _offsetLeft: 0,


      /**
       * Возвращает ширину контейнера
       * @returns {number}
       */
      getWidth: function () {
         return this._width;
      },


      /**
       * Задает ширину контейнера
       * @param {number} val
       */
      setWidth: function (val) {
         if (typeof val === 'number') {
            this._width = val;
         } else {
            throw new TypeError("Ширина должна быть задана числом");
         }
      },


      /**
       * Возвращает высоту контейнера
       * @returns {number}
       */
      getHeight: function () {
         return this._height;
      },


      /**
       * Задает высоту контейнера
       * @param {number} val
       */
      setHeight: function (val) {
         if (typeof val === 'number') {
            this._height = val;
         } else {
            throw new TypeError("Высота должна быть задана числом");
         }
      },


      /**
       * Возвращает сдвиг заданного угла контейнера относительно левого верхнего угла внешенего контейнера
       * @param {ContainerCorner} corner
       * @returns {Offset}
       */
      getOffsetByCorner: function (corner) {
         if (this._isCornerOk(corner)) {
            var top = (corner.vertical === 'bottom') ? this.offsetTop + this._height : this.offsetTop,
            left = (corner.horizontal === 'right') ? this.offsetLeft + this._width : this.offsetLeft;
            return {top: top, left: left};
         }
      },


      /**
       * Задает сдвиг заданного угла контейнера относительно точки отсчета
       * @param {ContainerCorner} corner
       * @returns {Offset}
       */
      setOffsetByCorner: function (corner, offset) {
         if (this._isCornerOk(corner) && this._isOffsetOk(offset)) {
            this.offsetTop = (corner.vertical === 'bottom') ? offset.top - this._height : offset.top;
            this.offsetLeft = (corner.horizontal === 'right') ? offset.left - this._width : offset.left;
         }
      },

      /**
       * Размеры и сдвиг копируются из переднной модели конейнера
       * @param containerModel
       */
      clone: function(containerModel){
         this.setWidth( containerModel.getWidth() );
         this.setHeight( containerModel.getHeight() );
         this.setOffsetByCorner(TOP_LEFT_CORNER, containerModel.getOffsetByCorner(TOP_LEFT_CORNER));
      },



      /* Проверки входных данных */

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

   return ContainerModel;
});