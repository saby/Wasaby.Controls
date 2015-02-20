/**
 * Created with JetBrains PhpStorm.
 * User: aa.adilov
 * Date: 27.11.12
 * Time: 12:46
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.MarkedRowOptionsPlugin", [ "js!SBIS3.CORE.DataViewAbstract" ], function(DataViewAbstract) {

/**
 * @class   $ws.proto.DataViewAbstract.MarkedRowOptionsPlugin
 * @extends $ws.proto.DataViewAbstract
 * @plugin
 */
$ws.proto.DataViewAbstract.MarkedRowOptionsPlugin = DataViewAbstract.extendPlugin(/** @lends $ws.proto.DataViewAbstract.MarkedRowOptionsPlugin.prototype */{
   $protected: {
      _options: {
         /**
          * @typedef {Object} markedRowOption
          * @property {Function} action Обработчик - действие над записями, вызываемое кликом на кнопку - указать заранее созданную функцию
          * @property {String} image Иконка операции, задаётся через sprite
          * @editor image ImageEditor
          */
         /**
          * @cfg {Object.<String, markedRowOption>} Операции для отмеченных записей
          * Значение опции задаётся объектом операций над отмеченными записями со своими подопциями.
          */
         markedRowOptions: {}
      },
      _isRenderedFootRowOptions: false //признак того, что опции над выделенными записями отрисованы в футере
   },
   $condition: function(){
      return !Object.isEmpty(this._options.markedRowOptions);
   },
   $constructor: function(){
      this.subscribe('onChangeSelection', this._onChangeSelectionHandler);
   },
   _onChangeSelectionHandler: function(){
      var hasSelection = this.getSelection(true).length;
      if(this._isRenderedFootRowOptions){
         if(!hasSelection) {
            this._drawRowOptionsButtons();
         }
      } else if(hasSelection) {
         this._drawRowOptionsButtons(true);
      }
   },
   _drawRowOptionsButtons: function(flag){
      if(!Object.isEmpty(this._options.markedRowOptions)){
         var blockId = 'ws-browser-block-options-'+ this.getId();
         if(flag){
            if(!this._foot.find('#'+ blockId).length){
               var pager = this._foot.find('.ws-browser-pager'),
                     divRowOptions = $('<div class="ws-browser-foot-row-options" id="'+ blockId +'"></div>'),
                     rowOption,
                     self = this;
               if(pager){
                  for(var option in this._options.markedRowOptions){
                     var markedOption = this._options.markedRowOptions[option],
                         isImageFromWS = markedOption.image.indexOf('ws:/') !== -1,
                         markedOptionConfig = [];
                     rowOption = $('<div class="ws-browser-foot-row-option" id="'+ option +'"></div>');
                     if(typeof(markedOption.action) === 'function'){
                        rowOption.bind('click', function(e){
                           self._options.markedRowOptions[e.currentTarget.id].action.apply(self, self.getSelection(true));
                        });
                     }
                     markedOptionConfig.push('<span class="ws-browser-foot-row-option-icon');
                     if(!isImageFromWS){
                        markedOptionConfig.push(' ' + markedOption.image);
                     }
                     markedOptionConfig.push('" ');
                     if(isImageFromWS){
                        markedOptionConfig.push('style="background: '+ ["url(", $ws.helpers.processImagePath(markedOption.image),") no-repeat scroll"].join(""));
                     }
                     markedOptionConfig.push('"></span><span class="ws-browser-foot-row-option-button">'+ option +'</span>');
                     divRowOptions.append(rowOption.append(markedOptionConfig.join('')));
                  }
                  pager.parent().append(divRowOptions);
               }
            }else{
               if(!this._isRenderedFootRowOptions) {
                  this._foot.find('#' + blockId).removeClass('ws-hidden');
               }
            }
            this._isRenderedFootRowOptions = true;
         }else if(this._isRenderedFootRowOptions){
            this._foot.find('#' + blockId).addClass('ws-hidden');
            this._isRenderedFootRowOptions = false;
         }

         //Если высота браузера (его подвала) изменилась - надо пересчитать
         this._notifyOnSizeChanged(true);
      }
   }
});

});