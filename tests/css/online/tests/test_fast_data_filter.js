var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.FastDataFilter Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_fast_data_filter_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FastDataFilter"]', 40000);
                this.title = find('[sbisname="FastDataFilter"] .controls-DropdownList__text');
                this.item2 = find('.controls-DropdownList__item[data-id="2"]');
                this.close_icon = find('[sbisname="FastDataFilter"] .controls-DropdownList__crossIcon');
                this.box = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.box);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="2"]', 1000);
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

        test.setUrl('/regression_fast_data_filter_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FastDataFilter"]', 40000);
                this.title = find('[sbisname="FastDataFilter"] .controls-DropdownList__text');
                this.item2 = find('.controls-DropdownList__item[data-id="2"]');
				this.item2_box = '.controls-DropdownList__item[data-id="2"] .controls-DropdownList__itemCheckBox';
                this.item3 = find('.controls-DropdownList__item[data-id="3"]');
				this.item3_box = '.controls-DropdownList__item[data-id="3"] .controls-DropdownList__itemCheckBox';
                this.close_icon = find('[sbisname="FastDataFilter"] .controls-DropdownList__crossIcon');
                this.accept = find('[sbisname="DropdownList_buttonChoose"]');
                this.box = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.box);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="2"]', 40000);
            })

            .capture('hovered_item', function (actions) {
                actions.mouseMove(this.item2);
            })

            .capture('selected_item', function (actions) {
                actions.mouseMove(this.item2);
				actions.waitForElementToShow(this.item2_box, 2000);
				actions.click(this.item2_box);
                actions.wait(100);
                actions.click(this.item3_box);
                actions.wait(100);
                actions.click(this.accept);
                actions.wait(100);
                actions.click(this.box);
                actions.wait(100);
            })
			
			.capture('disabled', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FastDataFilter').setEnabled(false);
                });
            })
    });

    gemini.suite('inline_filters', function (test) {

        test.setUrl('/regression_fast_data_filter_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FastDataFilter"]', 40000);
                this.box = find('[sbisname="TextBox 1"] input');
                this.first_title = find('[sbisname="FastDataFilter"] [data-id="first"] .controls-DropdownList__text');
                this.second_title = find('[sbisname="FastDataFilter"] [data-id="second"] .controls-DropdownList__text')
            })

            .capture('plain', function (actions) {
                actions.click(this.box);
            })

            .capture('opened_one', function (actions) {
                actions.click(this.first_title)
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="2"]', 4000);
            })

            .capture('opened_two', function (actions) {
                actions.click(this.box);
				actions.click(this.second_title)
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="2"]', 4000);
            })
    });
});