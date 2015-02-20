/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 10:22
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.FilterFloatArea", ["js!SBIS3.CORE.FloatArea", 'css!SBIS3.CORE.FilterFloatArea'], function( FloatArea ) {

   "use strict";

   $ws.single.DependencyResolver.register('SBIS3.CORE.FilterFloatArea', [], "SBIS3.CORE.FloatArea");

   /**
    * Всплывающая панель для фильтров, отличается внешним видом
    *
    * @class $ws.proto.FilterFloatArea
    * @extends $ws.proto.FloatArea
    * @control
    */
   $ws.proto.FilterFloatArea = FloatArea.extend(/** @lends $ws.proto.FilterFloatArea.prototype */{
      $protected: {
         _noStackShadowClassPostfix: 'filter'
      },

      _prepareCollapsedSides: function(){
         this._collapsedSides = {'left': true, 'right': true, 'top': true, 'bottom': false};
      },

      /**
       * Подготавливает блоки области
       * @private
       */
      _prepareArea: function(){
         $ws.proto.FilterFloatArea.superclass._prepareArea.apply(this, arguments);

         var side = this._options.controlsSide,
             filterClass = 'ws-float-area-filter-shadow';

         $('<div>', {'class': filterClass + '-stretch'}).appendTo(
            $('<div>', {'class': filterClass + ' ' + filterClass + '-' + side}).appendTo(this._containerShadow));
      },
      //В FilterFloaArea никогда не будет title, а его создание съедает 40px, не даем создавать контейнер для title
      _createTitle: function(){
      }
   });

   return $ws.proto.FilterFloatArea;
});
