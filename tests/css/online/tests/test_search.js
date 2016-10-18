gemini.suite('SBIS3.CONTROLS.Search Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_search_online.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.tdgv = '[name="TreeDataGrid 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                this.search = '[sbisname="SearchForm 1"] input';
				this.reset = '.controls-SearchForm__reset';
				this.send = '.controls-SearchForm__search';
				this.item6 = '[data-id="6"]';
				this.item10 = '[data-id="10"]';
				this.item11 = '[data-id="11"]';
				
                actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.search, 5000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('with_text', function (actions) {
                actions.sendKeys(this.search, 'DataGridView');
				actions.waitForElementToShow(this.item6, 5000);
				actions.waitForElementToShow(this.item10, 5000);
				actions.waitForElementToShow(this.item11, 5000);
				actions.waitForElementToShow(this.reset, 5000);
				actions.click(this.input);
            })

            .capture('hovered_button', function (actions) {
                actions.mouseMove(this.send);
            })
			
			.capture('hovered_reset', function (actions) {
                actions.mouseMove(this.reset);
            })
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('SearchForm 1').setEnabled(false);
                });
            })
			
			.capture('disabled_and_hovered_button', function (actions) {
                actions.mouseMove(this.send);
            })
    });
	
	gemini.suite('expanded', function (test) {

        test.setUrl('/regression_search_online_2.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tdgv = '[name="TreeDataGrid 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                this.search = '[sbisname="SearchForm 1"] input';
				this.reset = '.controls-SearchForm__reset';
				this.item6 = '[data-id="6"]';
				this.item10 = '[data-id="10"]';
				this.item11 = '[data-id="11"]';
				
                actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.search, 5000);
				actions.waitForElementToShow(this.input, 5000);
            })
			
			.capture('plain', function (actions) {
				actions.click(this.input);
            })

            .capture('with_text', function (actions) {
                actions.sendKeys(this.search, 'DataGridView');
				actions.waitForElementToShow(this.item6, 5000);
				actions.waitForElementToShow(this.item10, 5000);
				actions.waitForElementToShow(this.item11, 5000);
				actions.waitForElementToShow(this.reset, 5000);
				actions.click(this.input);
            })
    });
});