import {Text} from 'Controls/input';


var SuggestInputRender = Text.extend({
   _initProperties: function(options) {
      SuggestInputRender.superclass._initProperties.call(this, options);
      this._afterFieldWrapper.template = options.afterFieldWrapper;
   }
});

export = SuggestInputRender;

