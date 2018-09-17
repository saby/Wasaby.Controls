define('Controls-demo/Input/DeprecatedText/TextVdom', [
	'Core/Control',
	'wml!Controls-demo/Input/DeprecatedText/TextVdom',
	'Controls/Input/Text',
	'css!Controls-demo/Input/DeprecatedText/TextVdom'
], function ( Control, dotTplFn) {
	'use strict';
	var moduleClass = Control.extend({

		
		_template: dotTplFn,
		
		_valueChanged: function (event, text) {
			var
				root_div = document.querySelector('.test_root_div').controlNodes[0].control;
			root_div._info_txt='valueChanged="'+text+'"';
			root_div._forceUpdate();
		},
		_inputCompleted: function (event, text) {
			var
				root_div = document.querySelector('.test_root_div').controlNodes[0].control;
			root_div._info_txt='inputCompleted="'+text+'"';
			root_div._forceUpdate();
		},
		
		// общие опции, для использования всеми контролами на странице
		_constraintLatin: "[a-z, A-Z]",
		_trimAll: false, _readOnlyAll: false,
		
		// индивидуальные опции
		_info_txt: '', _infoPlaceholder: "информационное поле",
		_text1: '',
		_text2: 'with value',
		_text3: 'with value', _constraint3: "[0-9]", _maxLength3: 5, _selectOnClick3: true,
		_text4:'', _trim4: true,
		_text5: '', _readOnly5: true,
		
		_afterMount: function(){
			this._children['TextBox_6'].paste('ABC')
		}

	});

	return moduleClass;
});