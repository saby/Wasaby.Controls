define('js!SBIS3.CONTROLS.RichEditor.ImagePropertiesDialog', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.RichEditor.ImagePropertiesDialog', 'js!SBIS3.CORE.Button', 'js!SBIS3.CORE.FieldInteger', 'js!SBIS3.CORE.FieldDropdown', 'js!SBIS3.CORE.FieldLabel'], function(CompoundControl, dotTplFn) {


   var moduleClass = CompoundControl.extend({
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
            currentHeight = image.style.height ||  $image.height() + 'px' || '',
            currentWidth = image.style.width || $image.width() + 'px' ||'',
            percentSizes = currentHeight.indexOf('%') !== -1 || currentWidth.indexOf('%') !== -1,
            horizontalAspect = naturalWidth / naturalHeight,
            verticalAspect = naturalHeight / naturalWidth,
            updateCtrlImageWidth = function() {
               var heightValue = ctrlImageHeight.getValue();
               if (ctrlValueType.getValue() === 'per') {
                  ctrlImageWidth.setValue(heightValue, undefined, heightValue === 0);
               } else {
                  ctrlImageWidth.setValue(heightValue !== null ? heightValue * horizontalAspect : null, undefined, heightValue === 0);
               }
            }.bind(ctrlImageHeight),
            validators =[{
               validator: function() {
                  var value = this.getValue();
                  return value !== 0;
               },
               errorMessage: 'Значение не может быть равно нулю!'
            }],
            valueTypeChange = function() {
               if (ctrlValueType.getValue() === 'per') {
                  ctrlImageWidth.setValue(parseInt(100*$image.width()/ctrlDialog._options.editorWidth,10));
                  ctrlImageHeight.setValue(parseInt(100*$image.width()/ctrlDialog._options.editorWidth,10));
               } else {
                  ctrlImageWidth.setValue($image.width());
                  ctrlImageHeight.setValue( $image.height());
               }
            };


         ctrlImageHeight.setValidators(validators);
         ctrlImageWidth.setValidators(validators);
         ctrlApplyButton.subscribe("onActivated", function() {
          if (ctrlImageWidth.validate() && ctrlImageHeight.validate()) {
             this.sendCommand('saveImage');
             ctrlDialog.close();
          }
         }.bind(this));
         
         ctrlImageHeight.subscribe("onChange", updateCtrlImageWidth);
         ctrlValueType.subscribe("onChange", valueTypeChange);
         
         ctrlImageWidth.subscribe("onChange", function(){
            var
               widthValue = ctrlImageWidth.getValue();
            if (ctrlValueType.getValue() === 'per') {
               ctrlImageHeight.setValue(widthValue, undefined, widthValue === 0);
            } else {
               ctrlImageHeight.setValue(widthValue !== null ? widthValue * verticalAspect : null, undefined, widthValue === 0);
            }
         });
         
         ctrlDialog.subscribe("onBeforeShow", function() {
            ctrlImageHeight.setValue(currentHeight.length ? parseInt(currentHeight, 10) : null, undefined, parseInt(currentHeight, 10) === 0);
            ctrlImageHeight.setTooltip(parseInt($image.height(), 10));
            ctrlImageWidth.setValue(currentWidth.length ? parseInt(currentWidth, 10) : null, undefined, parseInt(currentWidth, 10) === 0);
            ctrlImageWidth.setTooltip(parseInt($image.width(), 10));
            ctrlValueType.setValue(percentSizes ? 'per' : 'pix');
         });
         if (percentSizes) {
            var
               basis = currentHeight.indexOf('%') !== -1 ? currentHeight : currentWidth;
            currentHeight = currentWidth = basis;
         }
      }
   });
   moduleClass.title = 'Свойства';
   moduleClass.dimensions = {"autoWidth":false,"autoHeight":false,"resizable":false,"width":260,"height":84};
   return moduleClass;
});