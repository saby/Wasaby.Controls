define('Controls-demo/Input/DeprecatedNumber/NumberVdom', [
	'Core/Control',
	'wml!Controls-demo/Input/DeprecatedNumber/NumberVdom',
	'Controls/Input/Number',
	'css!Controls-demo/Input/DeprecatedNumber/NumberVdom'
], function ( Control, dotTplFn) {
	'use strict';
	var moduleClass = Control.extend({

		
		_template: dotTplFn,
		
		// общие опции, для использования всеми контролами на странице
		_trimAll: false, _readOnlyAll: false,
		_integersLengthAll: undefined, _precisionAll: undefined, _onlyPositiveAll: undefined,
		
		// индивидуальные опции
		
		_number0: '',
		_number1: '', _onlyPositive1: true,
		_number2: '', _integersLength2: 5,		
		_number3: '', _precision3: 2,
		_number4: '', _precision4: 0

	});

	return moduleClass;
});