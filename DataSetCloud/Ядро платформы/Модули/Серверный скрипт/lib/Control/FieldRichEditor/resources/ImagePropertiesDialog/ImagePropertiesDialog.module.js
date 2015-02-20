define('js!SBIS3.CORE.FieldRichEditor.ImagePropertiesDialog', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CORE.FieldRichEditor.ImagePropertiesDialog', 'js!SBIS3.CORE.Button', 'js!SBIS3.CORE.FieldInteger', 'js!SBIS3.CORE.FieldDropdown', 'js!SBIS3.CORE.FieldLabel'], function(CompoundControl, dotTplFn) {

   /**
    * SBIS3.CORE.FieldRichEditor.ImagePropertiesDialog
    * @class SBIS3.CORE.FieldRichEditor.ImagePropertiesDialog
    * @extends $ws.proto.CompoundControl
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CORE.FieldRichEditor.ImagePropertiesDialog.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            
         }
      },
      $constructor: function() {
      },

      init: function() {
         moduleClass.superclass.init.call(this);
         
         var
            ctrlDialog = this.getTopParent(),
            ctrlApplyButton = this.getChildControlByName("applyButton"),
            ctrlImageHeight = this.getChildControlByName("imageHeight"),
            ctrlImageWidth = this.getChildControlByName("imageWidth"),
            ctrlValueType = this.getChildControlByName('valueType'),
            $image = ctrlDialog._options.selectedImage,
            image = $image[0],
            naturalHeight = image.naturalHeight,
            naturalWidth = image.naturalWidth,
            currentHeight = image.style.height || '',
            currentWidth = image.style.width || '',
            percentSizes = currentHeight.indexOf('%') !== -1 || currentWidth.indexOf('%') !== -1,
            horizontalAspect = naturalWidth / naturalHeight,
            verticalAspect = naturalHeight / naturalWidth,
            updateCtrlImageWidth = function() {
               var heightValue = ctrlImageHeight.getValue();
               if (ctrlValueType.getValue() === 'per') {
                  ctrlImageWidth.setValue(heightValue);
               } else {
                  ctrlImageWidth.setValue(heightValue !== null ? heightValue * horizontalAspect : null);
               }
            }.bind(ctrlImageHeight);
         
         ctrlApplyButton.subscribe("onActivated", function() {
           ctrlDialog.close();
         }.bind(this));
         
         ctrlImageHeight.subscribe("onChange", updateCtrlImageWidth);
         ctrlValueType.subscribe("onChange", updateCtrlImageWidth);
         
         ctrlImageWidth.subscribe("onChange", function(){
            var
               widthValue = ctrlImageWidth.getValue();
            if (ctrlValueType.getValue() === 'per') {
               ctrlImageWidth.setValue(widthValue);
            } else {
               ctrlImageHeight.setValue(widthValue !== null ? widthValue * verticalAspect : null);
            }
         });
         
         ctrlDialog.subscribe("onBeforeShow", function() {
            ctrlImageHeight.setValue(currentHeight.length ? parseInt(currentHeight, 10) : null);
            ctrlImageHeight.setTooltip(parseInt($image.height(), 10));
            ctrlImageWidth.setValue(currentWidth.length ? parseInt(currentWidth, 10) : null);
            ctrlImageWidth.setTooltip(parseInt($image.width(), 10));
            ctrlValueType.setValue(percentSizes ? 'per' : 'pix');
         });
      }
   });
   moduleClass.title = 'Свойства';
   moduleClass.dimensions = {"autoWidth":false,"autoHeight":false,"resizable":false,"width":260,"height":84};
   return moduleClass;
});