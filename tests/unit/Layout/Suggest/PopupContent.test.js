define(['Controls/Container/Suggest/__PopupContent', 'wml!Controls/Container/Suggest/__PopupContent', 'Core/Deferred'], function(PopupContent, popupContentTemplate, Deferred) {
   
   function removeConfigFromMarkup(markup) {
      var result = markup.replace(/ ?(ws-delegates-tabfocus|ws-creates-context|__config|config|tabindex|name)=".+?"/g, '');
      return result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
   }
   
   function getMarkup(template, templateArgs) {
      var result = template(templateArgs);
      
      if (result instanceof Deferred) {
         return result.addCallback(function(res) {
            return removeConfigFromMarkup(res);
         });
      } else {
         return Deferred.success(removeConfigFromMarkup(result));
      }
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
         var resultSended = false;
   
         layer.saveOptions(options);
         layer._notify = function(eventName) {
            if (eventName === 'controlResize') {
               resized = true;
            }
            
            if (eventName === 'sendResult') {
               resultSended = true;
            }
         };
   
         layer._afterUpdate(oldOptions);
   
         assert.isTrue(resized);
         assert.isTrue(resultSended);
   
         resultSended = false;
         layer._positionFixed = true;
         layer._afterUpdate(oldOptions);
         assert.isFalse(resultSended);
   
         layer._positionFixed = false;
         layer._afterUpdate(oldOptions);
         assert.isFalse(resultSended);
      });
      
   });
   
   describe('Controls.Container.Suggest.__PopupContent template tests', function() {
      
      it('showContent:false', function(done) {
         var standardMarkup = '<div class="controls-Suggest__suggestionsContainer controls-Suggest__suggestionsContainer_popup_shadow_ controls-Suggest__suggestionsContainer_hidden" style="width:px;"><div class="controls-Scroll ws-flexbox ws-flex-column controls-Suggest__scrollContainer" hasMarkup="true" data-component="Controls/Container/Scroll"><span class="ws-flex-grow-1 controls-Scroll__content ws-BlockGroup controls-Scroll__content_hideNativeScrollbar controls-Scroll__content_hidden"></span><div></div></div></div>';
         
         getMarkup(popupContentTemplate, {_options: {showContent: false, target: {offsetWidth: ''}, content: '', stickyPosition: {verticalAlign: {side: ''}}}}).addCallback(function(res) {
            assert.equal(res, standardMarkup);
            done();
         });
      });
      
      it('showContent:true', function(done) {
         var standardMarkup = '<div class="controls-Suggest__suggestionsContainer controls-Suggest__suggestionsContainer_popup_shadow_" style="width:px;"><div class="controls-Scroll ws-flexbox ws-flex-column controls-Suggest__scrollContainer" hasMarkup="true" data-component="Controls/Container/Scroll"><span class="ws-flex-grow-1 controls-Scroll__content ws-BlockGroup controls-Scroll__content_hideNativeScrollbar controls-Scroll__content_hidden"></span><div></div></div></div>';
         
         getMarkup(popupContentTemplate, {_options: {showContent: true, target: {offsetWidth: ''},  content: '', stickyPosition: {verticalAlign: {side: ''}}}}).addCallback(function(res) {
            assert.equal(res, standardMarkup);
            done();
         });
      });
      
      it('target.offsetWidth:300px', function(done) {
         var standardMarkup = '<div class="controls-Suggest__suggestionsContainer controls-Suggest__suggestionsContainer_popup_shadow_ controls-Suggest__suggestionsContainer_hidden" style="width:300px;"><div class="controls-Scroll ws-flexbox ws-flex-column controls-Suggest__scrollContainer" hasMarkup="true" data-component="Controls/Container/Scroll"><span class="ws-flex-grow-1 controls-Scroll__content ws-BlockGroup controls-Scroll__content_hideNativeScrollbar controls-Scroll__content_hidden"></span><div></div></div></div>';
         
         getMarkup(popupContentTemplate, {_options: {target: {offsetWidth: 300}, content: '', stickyPosition: {verticalAlign: {side: ''}}}}).addCallback(function(res) {
            assert.equal(res, standardMarkup);
            done();
         });
      });
   
      it('verticalAling', function(done) {
         var standardMarkup = '<div class="controls-Suggest__suggestionsContainer controls-Suggest__suggestionsContainer_popup_shadow_top controls-Suggest__suggestionsContainer_hidden" style="width:300px;"><div class="controls-Scroll ws-flexbox ws-flex-column controls-Suggest__scrollContainer" hasMarkup="true" data-component="Controls/Container/Scroll"><span class="ws-flex-grow-1 controls-Scroll__content ws-BlockGroup controls-Scroll__content_hideNativeScrollbar controls-Scroll__content_hidden"></span><div></div></div></div>';
      
         getMarkup(popupContentTemplate, {_options: {target: {offsetWidth: 300}, content: '', stickyPosition: {verticalAlign: {side: 'top'}}}}).addCallback(function(res) {
            assert.equal(res, standardMarkup);
            done();
         });
      });
      
   });
   
});