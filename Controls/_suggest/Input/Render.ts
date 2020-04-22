import {Text} from 'Controls/input';


var SuggestInputRender = Text.extend({
   _initProperties: function(options) {
      SuggestInputRender.superclass._initProperties.call(this, options);
      this._rightFieldWrapper.template = options.rightFieldWrapper;
   }
});

export = SuggestInputRender;

