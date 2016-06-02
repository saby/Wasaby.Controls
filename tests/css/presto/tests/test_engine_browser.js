/*
var gemini = require('gemini');

gemini.suite('SBIS3.ENGINE.Browser Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_engine_browser_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="browserView"]', 40000);
                this.view = find('[name="browserView"]');
				actions.waitForElementToShow('[name="browserSearch"]', 40000);
                this.search_input = find('[name="browserSearch"] input');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
				actions.waitForElementToShow('[name="OperationsPanelButton1"]', 40000);
                this.open_panel = find('[name="OperationsPanelButton1"]');
				actions.waitForElementToShow('[name="browserFastDataFilter"]', 40000);
                this.fast_filter = find('[name="browserFastDataFilter"] .controls-DropdownList__textWrapper .controls-DropdownList__text');
				actions.waitForElementToShow('[name="filterLine"]', 40000);
                this.filter = find('[name="filterLine"] .controls__filterButton__filterLine-items span');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('into_folder', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('browserView').setCurrentRoot(33);
					window.$ws.single.ControlStorage.getByName('browserView').reload();
                });
				actions.waitForElementToShow('[name="BackButton-caption"]', 1000);
            })
			
			.capture('opened_dots', function (actions, find) {
                this.dots = find('.controls-BreadCrumbs__dots');
				actions.click(this.dots);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(1)', 1000);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(2)', 1000);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(3)', 1000);
				actions.waitForElementToShow('div.js-controls-BreadCrumbs__crumb:nth-child(3) .controls-BreadCrumbs__hierWrapper:nth-child(2)', 1000);
            })

            .capture('opened_fast_filter', function (actions, find) {
				this.dots = find('.controls-BreadCrumbs__dots');
				actions.click(this.dots);
				actions.mouseMove(this.fast_filter);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="34"]', 1000);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="20"]', 1000);
            })
			
			.capture('opened_filter', function (actions, find) {
                this.item1 = find('.controls-DropdownList__item[data-id="34"]');
				actions.click(this.item1)
				actions.click(this.filter)
				actions.waitForElementToShow('.controls__filter-button__apply-filter', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.waitForElementToShow('.controls-ComboBox__arrowDown', 1000);
				actions.mouseMove(this.input);
            })
			
			.capture('opened_combobox_in_filter', function (actions, find) {
                this.arrow = find('.controls-ComboBox__arrowDown');
				actions.click(this.arrow)
				actions.mouseMove(this.input);
            })
			
			.capture('filtred', function (actions, find) {
                actions.waitForElementToShow('.controls-ComboBox__itemRow[data-id="1"]', 1000);
				actions.waitForElementToShow('.controls-ComboBox__itemRow[data-id="2"]', 1000);
				this.no_nds = find('.controls-ComboBox__itemRow[data-id="1"]');
				actions.click(this.no_nds)
				this.apply = find('.controls__filter-button__apply-filter .controls-Button__text');
				actions.click(this.apply)
				actions.mouseMove(this.input);
            })
			
			.capture('opened_operations_panel', function (actions) {
				actions.click(this.open_panel)
                actions.wait(1000);
				actions.mouseMove(this.input);
            })
			
			.capture('selected_items', function (actions, find) {
				this.box = find('.controls-OperationsMark-checkBox');
				actions.click(this.box)
				actions.mouseMove(this.input);
            })
			
			.capture('with_search_string', function (actions, find) {
				actions.sendKeys(this.search_input, 'за')
				actions.click(this.input);
            })
    });
	
	 gemini.suite('with_dialogs', function (test) {

        test.setUrl('/regression_browser_online.html').skip('firefox').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="browserView"]', 40000);
                this.view = find('[name="browserView"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
				actions.wait(10000);				
            })
			
			.capture('plain', function (actions, find) {
				actions.click(this.input);
				this.dialogs = find('[name="Диалоги"] .controls-Button__text')
				actions.click(this.dialogs);
				actions.waitForElementToShow('.ws-float-area-show-complete', 40000);
				actions.waitForElementToShow('.ws-window.ws-modal', 40000);
				actions.wait(1000);
            })
    });
});*/