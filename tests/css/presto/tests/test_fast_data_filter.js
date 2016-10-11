gemini.suite('SBIS3.CONTROLS.FastDataFilter Presto', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_fast_data_filter_presto.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.fdf = '[sbisname="FastDataFilter"]';
                this.box = '[sbisname="TextBox 1"] input';
				this.title = '[sbisname="FastDataFilter"] .controls-DropdownList__text';
                this.item2 = '.controls-DropdownList__item[data-id="2"]';
                this.close_icon = '[sbisname="FastDataFilter"] .controls-DropdownList__crossIcon';
				
                actions.waitForElementToShow(this.fdf, 50000);
				actions.waitForElementToShow(this.box, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.box);
            })

            .capture('opened', function (actions) {
                actions.mouseMove(this.title);
				actions.waitForElementToShow(this.item2, 5000);
            })

            .capture('hovered_item', function (actions) {
				actions.mouseMove(this.item2);
            })

            .capture('selected_item', function (actions) {
				actions.click(this.item2);
                actions.click(this.box);
            })
			
			.capture('disabled', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FastDataFilter').setEnabled(false);
                });
            })
    });

    gemini.suite('multiselect', function (test) {

        test.setUrl('/regression_fast_data_filter_presto_2.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.fdf = '[sbisname="FastDataFilter"]';
                this.box = '[sbisname="TextBox 1"] input';
                this.title = '[sbisname="FastDataFilter"] .controls-DropdownList__text';
                this.item2 = '.controls-DropdownList__item[data-id="2"]';
                this.item3 = '.controls-DropdownList__item[data-id="3"]';
                this.close_icon = '[sbisname="FastDataFilter"] .controls-DropdownList__crossIcon';
                this.accept = '[sbisname="DropdownList_buttonChoose"]';
				
                actions.waitForElementToShow(this.fdf, 50000);
				actions.waitForElementToShow(this.box, 5000);
            })

            .capture('opened', function (actions) {
                actions.mouseMove(this.title);
				actions.waitForElementToShow(this.item2, 50000);
            })

            .capture('hovered_item', function (actions) {
                actions.mouseMove(this.item2);
            })

            .capture('selected_item', function (actions) {
                actions.click(this.item2);
                actions.click(this.item3);
                actions.click(this.accept);
                actions.click(this.box);
            })
			
			.capture('disabled', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FastDataFilter').setEnabled(false);
                });
            })
    });

    gemini.suite('inline_filters', function (test) {

        test.setUrl('/regression_fast_data_filter_presto_3.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.fdf = '[sbisname="FastDataFilter"]';
                this.box = '[sbisname="TextBox 1"] input';
                this.first_title = '[sbisname="FastDataFilter"] [data-id="first"] .controls-DropdownList__text';
                this.second_title = '[sbisname="FastDataFilter"] [data-id="second"] .controls-DropdownList__text';
				this.item2 = '.controls-DropdownList__item[data-id="2"]';
				
                actions.waitForElementToShow(this.fdf, 50000);
				actions.waitForElementToShow(this.box, 5000);
            })

            .capture('opened_one', function (actions) {
                actions.mouseMove(this.first_title)
				actions.waitForElementToShow(this.item2, 5000);
            })

            .capture('opened_two', function (actions) {
                actions.click(this.box);
				actions.mouseMove(this.second_title)
				actions.waitForElementToShow(this.item2, 5000);
            })
    });
});