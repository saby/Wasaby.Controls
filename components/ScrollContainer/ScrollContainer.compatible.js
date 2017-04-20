/**
 * Created by dv.zuev on 11.04.2017.
 */

define('js!SBIS3.CONTROLS.ScrollContainer/ScrollContainer.compatible', [

   'js!SBIS3.CORE.CompoundControl',
   'Core/helpers/generate-helpers'
], function (CompoundControls, generate) {
   return {

      reviveInners: function(){
         return;
         if (window && this._container && typeof(this._options.content)==="string" && this._context){
            var elcont = $(this._container).find('.controls-ScrollContainer__content').eq(0);
            var tempcontent = elcont.html();
            if (tempcontent !== "") {
               this._options.content = function(){ return tempcontent};
               new CompoundControls({
                  element: elcont,
                  id: generate.randomId("cnt-"),
                  name: generate.randomId("name-"),
                  parent: this,
                  linkedContext: this._context
               });
            }
         }


      }
   }
});