define('js!SBIS3.ENGINE.RecordsMarkPlugin.DialogSelector.AtPlace', [
    'js!SBIS3.CORE.CompoundControl',
    'html!SBIS3.ENGINE.RecordsMarkPlugin.DialogSelector.AtPlace',
    'js!SBIS3.ENGINE.RecordsMarkPlugin',
    'css!SBIS3.ENGINE.RecordsMarkPlugin.DialogSelector.AtPlace',
    'js!SBIS3.CORE.FieldString',
    'js!SBIS3.CORE.Button',
    'js!SBIS3.CORE.FieldCheckbox'], function(CompoundControl, dotTplFn, plugin) {
    /**
     * SBIS3.ENGINE.RecordsMarkAtPlace
     * @class SBIS3.ENGINE.RecordsMarkAtPlace
     * @extends $ws.proto.CompoundControl
     * @control
     */
    var moduleClass = CompoundControl.extend(/** @lends SBIS3.ENGINE.RecordsMarkAtPlace.prototype */{
        _dotTplFn: dotTplFn,
        $protected: {
            _options: {

            }
        },
        $constructor: function() {
        },

        _initColorElements: function(area){
           area._marksContainer.children().unbind().bind('click', function () {
              var
                 button = $(this),
                 name = area.getChildControlByName('Name').getContainer().find("#fld-Name");
              if (button.hasClass('colorSelector')){
                 if (button.hasClass('marked')){
                    button.removeClass('marked');
                    name.css({'color':'#000000'});
                 }
                 else{
                    area._colorElements.removeClass('marked');
                    button.addClass('marked');
                    name.css({'color':plugin.definedColors[area._colorElements.index(this)]});
                 }
              }
              else{
                 if (button.hasClass('markedLetter')){
                    button.removeClass('markedLetter');
                    switch(area._fontElements.index(this)) {
                       case 0:
                          name.css({'font-weight': 'normal'});
                          break;
                       case 1:
                          name.css({'font-style': 'normal'});
                          break;
                       case 2:
                       case 3:
                          name.css({'text-decoration': 'none'});
                          break;
                    }
                 }
                 else{
                    button.addClass('markedLetter');
                    switch(area._fontElements.index(this)) {
                       case 0:
                          name.css({'font-weight':'bold'});
                          break;
                       case 1:
                          name.css({'font-style':'italic'});
                          break;
                       case 2:
                          name.css({'text-decoration':'underline'});
                          area._fontElements.eq(3).removeClass('markedLetter');
                          break;
                       case 3:
                          name.css({'text-decoration':'line-through'});
                          area._fontElements.eq(2).removeClass('markedLetter');
                          break;
                    }
                 }
              }
           });
        },

        init: function() {
           moduleClass.superclass.init.call(this);
           var
              self = this,
              area = this.getTopParent().getChildControlByName('DialogSelector'),
              name = this.getChildControlByName('Name').getContainer().find("#fld-Name");
           area._marksContainer = self.getContainer().find('.recordsMarkPlugin-DialogSelectorAtPlace__marksContainer');
           area._colorElements = area._marksContainer.find('.colorSelector');
           area._fontElements = area._marksContainer.find('.fontSelector');
           //покажем rowOptions
           area._colorTable.getContainer().removeClass('withoutRowOptions');
           //скроем кнопку настроек
           area._markSettings.hide();
           //проставляем отметки в div относительно загруженного рекорда
           if (!self.getParent().isNewRecord()){
              var
                 record = self.getParent().getRecord(),
                 cod = record.get('Code'),
                 spec = plugin.specToObject(cod);
              if (spec.isBold){
                 area._fontElements.eq(0).addClass('markedLetter');
                 name.css({'font-weight':'bold'});
              }
              if (spec.isItalic){
                 area._fontElements.eq(1).addClass('markedLetter');
                 name.css({'font-style':'italic'});
              }
              if (spec.isUnderline){
                 area._fontElements.eq(2).addClass('markedLetter');
                 name.css({'text-decoration':'underline'});
              }
              if (spec.isStrike){
                 area._fontElements.eq(3).addClass('markedLetter');
                 name.css({'text-decoration':'line-through'});
              }
              area._colorElements.eq(plugin.definedColors.indexOf(spec.color)).addClass('marked');
              name.css({'color':spec.color});
           }
           else{
              area._marksContainer.children().eq(0).addClass('marked');
              area._addNewRecord = true;
           }

           self.subscribe("onDestroy", function(){
              //скроем rowOptions
              area._colorTable.getContainer().addClass('withoutRowOptions');
              //покажем кнопку настроек, если только закрытие редактирования по месту не вызвано открытие другого по "карандашику", иначе мигает
              if (area._dontNeedShowSettings){
                 area._dontNeedShowSettings = false;
                 if (!area._addNewRecord){
                    area._colorTable.sendCommand('newItem');
                 }
                 else{
                    area._addNewRecord = false;
                 }
              }
              else {
                 area._markSettings.show();
              }
           });

           self._initColorElements(area);
        },

        emptyValidation: function(){
            var value = this.getValue();
            if(value === undefined || value === null || value === '')
                return "Поле не может быть пустым.";
            else
                return true;
        }

    });
    return moduleClass;
});