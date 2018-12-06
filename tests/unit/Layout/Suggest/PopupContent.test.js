define(['Controls/Container/Suggest/__PopupContent', 'wml!Controls/Container/Suggest/__PopupContent'], function(PopupContent, popupContentTemplate) {
   
   function removeConfigFromMarkup(markup) {
      return markup.replace(/ ?(ws-delegates-tabfocus|ws-creates-context|__config|config|tabindex|name)=".+?"/g, '');
   }
   
   describe('Controls.Container.Suggest.__PopupContent', function() {
      
      it('afterUpdate', function() {
         var options = {
            showContent: true
         };
   
         var oldOptions = {
            showContent: false
         };
   
         var layer = new PopupContent();
         var resized = false;
   
         layer.saveOptions(options);
         layer._notify = function(eventName) {
            if (eventName === 'controlResize') {
               resized = true;
            }
         };
   
         layer._afterUpdate(oldOptions);
   
         assert.isTrue(resized);
      });
      
   });
   
   describe('Controls.Container.Suggest.__PopupContent template tests', function() {
      
      it('showContent:false', function() {
         var standardMarkup = '<div class="controls-Suggest__suggestionsContainer ws-invisible"><div class="controls-Scroll ws-flexbox ws-flex-column controls-Suggest__scrollContainer" style="width:undefinedpx;" hasMarkup="true" data-component="Controls/Container/Scroll"><span class="ws-flex-grow-1 controls-Scroll__content ws-BlockGroup controls-Scroll__content_hideNativeScrollbar controls-Scroll__content_hidden"></span><div></div></div></div>';
         var templateMarkup = popupContentTemplate({_options: {showContent: false, content: ''}});
         
         assert.equal(removeConfigFromMarkup(templateMarkup), standardMarkup);
      });
      
      it('showContent:true', function() {
         var standardMarkup = '<div class="controls-Suggest__suggestionsContainer"><div class="controls-Scroll ws-flexbox ws-flex-column controls-Suggest__scrollContainer" style="width:undefinedpx;" hasMarkup="true" data-component="Controls/Container/Scroll"><span class="ws-flex-grow-1 controls-Scroll__content ws-BlockGroup controls-Scroll__content_hideNativeScrollbar controls-Scroll__content_hidden"></span><div></div></div></div>';
         var templateMarkup = popupContentTemplate({_options: {showContent: true, content: ''}});
         
         assert.equal(removeConfigFromMarkup(templateMarkup), standardMarkup);
      });
      
      it('target.offsetWidth:300px', function() {
         var standardMarkup = '<div class="controls-Suggest__suggestionsContainer ws-invisible"><div class="controls-Scroll ws-flexbox ws-flex-column controls-Suggest__scrollContainer" style="width:300px;" hasMarkup="true" data-component="Controls/Container/Scroll"><span class="ws-flex-grow-1 controls-Scroll__content ws-BlockGroup controls-Scroll__content_hideNativeScrollbar controls-Scroll__content_hidden"></span><div></div></div></div>';
         var templateMarkup = popupContentTemplate({_options: {target: {offsetWidth: 300}, content: ''}});
         
         assert.equal(removeConfigFromMarkup(templateMarkup), standardMarkup);
      });
      
   });
   
});