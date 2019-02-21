define('Controls-demo/ProcessStateIndicator/Index', [
	'Core/Control',
	'wml!Controls-demo/ProcessStateIndicator/Index',	
	'css!Controls-demo/ProcessStateIndicator/Index',
], function(Control, template) {
	'use strict';


	function StringToNumArray(str){
		return str.split(',').map(Number);
	};

	function StringToStrArray(str){
		return str.split(',').map(String);
	};

	var Index = Control.extend(
		{
			_template: template,
			_stateNumber: 3,
			_eventName: 'no event',
			_stateStr: '',
			_state: [],
			_sectorNumber: 20,
			_colorsStr: '',
			_colors: [],

			_beforeMount: function() {
				this._colors = [];
				this._state = [33,33,33];
				this._stateStr = this._state.toString(),
				this._stateNumber = 3;
			},

			changeStateNumber: function(e, num){
				this._stateNumber = num;
				this._eventName = 'StateNumberChanged';
			},

			changeSectorNumber: function(e, num){
				this._sectorNumber = num;
				this._eventName = 'SectorNumberChanged';
			},

			changeState: function(e, state) {

				this._state = StringToNumArray(state);
				this._stateStr = this._state.toString();
				this._eventName = 'StateChanged';
			},

			changeColors: function(e, colors) {

				this._colors = StringToStrArray(colors);
				this._colorsStr = this._colors.toString();
				this._eventName = 'ColorsChanged';
			},

			reset: function() {
				this._eventName = 'no event';
			},

		});

	


	return Index;
});
