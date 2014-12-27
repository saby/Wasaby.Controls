/**
 * Created by iv.cheremushkin on 12.08.2014.
 */

define('js!SBIS3.CONTROLS.FloatArea', ['js!SBIS3.CORE.CompoundControl', 'js!SBIS3.CONTROLS.PopupMixin', 'html!SBIS3.CONTROLS.FloatArea', 'css!SBIS3.CONTROLS.FloatArea'], function(CompoundControl, PopupMixin, dotTpl) {

   'use strict';

   /**
    * Контрол, отображающий вложенные компоненты в виде диалоговго окна
    * @class SBIS3.CONTROLS.FloatArea
    * @extends $ws.proto.Control
    * @mixes SBIS3.CONTROLS.PopupMixin
    */

   var FloatArea = CompoundControl.extend([PopupMixin], /** @lends SBIS3.CONTROLS.FloatArea.prototype*/ {
      _dotTplFn : dotTpl,
      $protected: {
         _options: {
            /**
             * @typedef {Object} AnimationEnum
             * @variant no
             * @variant fade
             * @variant slide
             */
            /**
             * @cfg {AnimationEnum} Вид анимации появления
             */
            animation : 'no',
            template: null
         }
      },

      $constructor: function() {
         this._container.removeClass('ws-area');
      },

      //TODO должен быть нормально переписан в новом Control
      toggle: function(){
         if (this.isVisible()){
            this.hide();
         }else {
            this.show();
         }
      },

      /*TODO переопределяем метод compoundControl - костыль*/
      _loadControls: function(pdResult){
         return pdResult.done([]);
      },

      /*TODO свой механизм загрузки дочерних контролов - костыль*/
      _loadChildControls: function() {
         var def = new $ws.proto.Deferred();
         var self = this;
         self._loadControlsBySelector(new $ws.proto.ParallelDeferred(), undefined, '[data-component]')
            .getResult().addCallback(function () {
               def.callback();
            });
         return def;
      },

      /*TODO Метод скопирован из areaAbstract - костыль*/
      _getChildControls: function(excludeContainers) {
         var children = [];
         for (var i = 0, l = this._childControls.length; i < l; i++) {
            if (i in this._childControls) {
               var c = this._childControls[i];
               if (c) {
                  if (c instanceof $ws.proto.AreaAbstract) {
                     Array.prototype.push.apply(children, c.getChildControls(excludeContainers));
                     if (excludeContainers) {
                        continue;
                     }
                  }
                  children.push(c);
               }
            }
         }
         return children;
      }

   });

   return FloatArea;

});