define('Controls-demo/Input/DeprecatedNumber/NumberVdom', [
	'Core/Control',
	'wml!Controls-demo/Input/DeprecatedNumber/NumberVdom',
	'Controls/input',
	'css!Controls-demo/Input/DeprecatedNumber/NumberVdom'
], function ( Control, dotTplFn) {
	'use strict';
	var moduleClass = Control.extend({

		
		_template: dotTplFn,
		
		// общие опции, для использования всеми контролами на странице
		_trimAll: false, _readOnlyAll: false,
		_integersLengthAll: undefined, _precisionAll: undefined, _onlyPositiveAll: undefined,
		
		// индивидуальные опции
		
		_number0: null,
		_number1: null, _onlyPositive1: true,
		_number2: null, _integersLength2: 5,
		_number3: null, _precision3: 2,
		_number4: null, _precision4: 0

	});

	return moduleClass;
});