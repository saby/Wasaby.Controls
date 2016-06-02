var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.Search Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_search_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGrid 1"]', 40000);
                this.data = find('[name="TreeDataGrid 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
				actions.waitForElementToShow('[sbisname="SearchForm 1"]', 40000);
                this.search = find('[sbisname="SearchForm 1"] input');
				this.reset = find('.controls-SearchForm__resetIcon');
				this.send = find('.controls-SearchForm__search');
            })

            .capture('with_text', function (actions) {
                actions.sendKeys(this.search, 'DataGridView');
				actions.wait(10000);
				actions.waitForElementToShow('.controls-SearchForm__resetIcon', 1000);
				actions.waitForElementToShow('.controls-SearchForm__search', 1000);
				actions.click(this.input);
            })

            .capture('hovered_button', function (actions) {
                actions.mouseMove(this.send);
            })
			
			.capture('hovered_reset', function (actions) {
                actions.mouseMove(this.reset);
            })
    });
});