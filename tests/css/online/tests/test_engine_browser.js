gemini.suite('SBIS3.ENGINE.Browser Online', function () {
	
    gemini.suite('base', function (test) {

        test.setUrl('/regression_engine_browser_online.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.view = '[name="browserView"]';
                this.search_input = '[name="browserSearch"] input';
                this.open_panel = '[name="OperationsPanelButton1"]';
                this.fast_filter = '[name="browserFastDataFilter"] .controls-DropdownList__textWrapper .controls-DropdownList__text';
                this.filter = '[name="filterLine"] .controls__filterButton__filterLine-items span';
				this.caption = '[name="BackButton-caption"]';
				this.dots = '.controls-BreadCrumbs__dots';
				this.a1 = 'div.js-controls-BreadCrumbs__crumb:nth-child(1)';
				this.a2 = 'div.js-controls-BreadCrumbs__crumb:nth-child(2)';
				this.a3 = 'div.js-controls-BreadCrumbs__crumb:nth-child(3)';
				this.a4 = 'div.js-controls-BreadCrumbs__crumb:nth-child(3) .controls-BreadCrumbs__hierWrapper:nth-child(2)';
				this.item34 = '.controls-DropdownList__item[data-id="34"]';
				this.item20 = '.controls-DropdownList__item[data-id="20"]'
				this.close_button = '.controls-PopupMixin__closeButton';
				this.arrow_down = '.controls-ComboBox__arrowDown';
				this.no_nds = '.controls-ComboBox__itemRow[data-id="1"]';
				this.yes_nds = '.controls-ComboBox__itemRow[data-id="2"]';
				this.apply = '.controls__filter-button__apply-filter .controls-Button__text';
				this.box = '.controls-OperationsMark-checkBox';
				this.item34_box = '[data-id="34"] .controls-ListView__itemCheckBox';
                
				actions.waitForElementToShow(this.view, 40000);
            })

            .capture('plain')

            .capture('into_folder', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('browserView').setCurrentRoot(33);
					window.$ws.single.ControlStorage.getByName('browserView').reload();
                });
				actions.waitForElementToShow(this.caption, 5000);
            })
			
			.capture('opened_dots', function (actions) {
				actions.click(this.dots);
				actions.waitForElementToShow(this.a1, 5000);
				actions.waitForElementToShow(this.a2, 5000);
				actions.waitForElementToShow(this.a3, 5000);
				actions.waitForElementToShow(this.a4, 5000);
            })

            .capture('opened_fast_filter', function (actions) {				
				actions.click(this.dots);
				actions.mouseMove(this.fast_filter);
				actions.waitForElementToShow(this.item20, 5000);
				actions.waitForElementToShow(this.item34, 5000);
            })
			
			.capture('opened_filter', function (actions) {
				actions.click(this.item34)
				actions.click(this.filter)
				actions.waitForElementToShow(this.apply, 5000);
				actions.waitForElementToShow(this.close_button, 5000);
				actions.waitForElementToShow(this.arrow_down, 5000);
            })
			
			.capture('opened_combobox_in_filter', function (actions) {
				actions.click(this.arrow_down)
            })
			
			.capture('filtred', function (actions) {
                actions.waitForElementToShow(this.no_nds, 5000);
				actions.waitForElementToShow(this.yes_nds, 5000);				
				actions.click(this.no_nds)				
				actions.click(this.apply)
            })
			
			.capture('opened_operations_panel', function (actions) {
				actions.click(this.open_panel)
            })
			
			.capture('selected_items', function (actions) {
				
				actions.click(this.box)
            })
			
			.capture('with_search_string', function (actions) {
				actions.sendKeys(this.search_input, 'за')
            })
			
			.capture('disabled_and_clicked_check_box', function (actions) {
				actions.click(this.box)
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('brows').setEnabled(false);
                });
				actions.waitForElementToShow(this.item34_box, 5000);
				actions.click(this.box)
            })
    });
	
	gemini.suite('lonf_filter_text', function (test) {

        test.setUrl('/regression_engine_browser_online_8.html').setCaptureElements('.controls-Browser__table-fullFilterBlock')

            .before(function (actions) {
                
				this.view = '[name="browserView"]';
                this.search_input = '[name="browserSearch"] input';
                this.input = '[sbisname="TextBox 1"] input';
                this.open_panel = '[name="OperationsPanelButton1"]';
                this.fast_filter = '[name="browserFastDataFilter"] .controls-DropdownList__textWrapper .controls-DropdownList__text';
                this.filter = '[name="filterLine"] .controls__filterButton__filterLine-items span';
				this.caption = '[name="BackButton-caption"]';
                
				actions.waitForElementToShow(this.view, 40000);
            })

            .capture('long_text', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('browserView').setCurrentRoot(33);
					window.$ws.single.ControlStorage.getByName('browserView').reload();
                });
				actions.waitForElementToShow(this.caption, 5000);
				actions.executeJS(function (window) {
                    window.$('[sbisname="filterLine"] .controls__filterButton__filterLine-items span').text('Точно точно точно точно точно точно точно точно точно точно точно точно  точно точно точно точно точно точно точно точно  точно точно точно точно точно точно точно точно  точно точно точно точно точно точно точно точно  точно точно точно точно точно точно точно точно нужно  точно точно точно точно точно точно точно точно точно точно  точно точно точно точно точно точно точно точно  точно точно точно точно точно точно точно точно  точно точно точно точно точно точно точно точно  точно точно точно точно точно точно точно точно  точно точно точно точно точно точно точно точно точно точно  точно точно точно точно точно точно точно точно  точно точно точно точно точно точно точно точно  точно точно точно точно точно точно точно точно  точно точно точно точно точно точно точно точно отобрать?');
                });
            })			
    });
	
	gemini.suite('back_button_editing', function (test) {

        test.setUrl('/regression_engine_browser_online_8.html').setCaptureElements('html')

            .before(function (actions) {
                
                this.view = '[name="browserView"]';
				this.search_input = '[name="browserSearch"] input';
                this.input = '[sbisname="TextBox 1"] input';
                this.open_panel = '[name="OperationsPanelButton1"]';
                this.fast_filter = '[name="browserFastDataFilter"] .controls-DropdownList__textWrapper .controls-DropdownList__text';
                this.filter = '[name="filterLine"] .controls__filterButton__filterLine-items span';
				this.data2 = '[data-id="2"]';
				this.data4 = '[data-id="31"]';
				this.caption = '.controls-BackButton__caption';
                
				actions.waitForElementToShow(this.view, 40000);
            })

            .capture('first_level', function (actions) {
                actions.click(this.data2);
				actions.mouseMove(this.caption);
            })

            .capture('second_level', function (actions) {
                actions.click(this.data4);
				actions.mouseMove(this.caption);
            })
    });
});