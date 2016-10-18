/*
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
                actions.mouseMove(this.title);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="2"]', 1000);
            })

            .capture('hovered_item', function (actions) {
				actions.mouseMove(this.item2);
            })

            .capture('selected_item', function (actions) {
				actions.click(this.item2);
                actions.click(this.box);
            })
    });

    gemini.suite('multiselect', function (test) {

        test.setUrl('/regression_fast_data_filter_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FastDataFilter"]', 40000);
                this.title = find('[sbisname="FastDataFilter"] .controls-DropdownList__text');
                this.item2 = find('.controls-DropdownList__item[data-id="2"]');
                this.item3 = find('.controls-DropdownList__item[data-id="3"]');
                this.close_icon = find('[sbisname="FastDataFilter"] .controls-DropdownList__crossIcon');
                this.accept = find('[sbisname="DropdownList_buttonChoose"] .controls-Button__text');
                this.box = find('[sbisname="TextBox 1"] input');
				this.more = find('[sbisname="DropdownList_buttonHasMore"] .controls-Link-link');
            })

            .capture('plain', function (actions) {
                actions.click(this.box);
            })

            .capture('opened', function (actions) {
                actions.mouseMove(this.title);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="2"]', 40000);
            })

            .capture('hovered_item', function (actions) {
                actions.mouseMove(this.item2);
            })
			
			.capture('hovered_more_link', function (actions) {
                actions.mouseMove(this.more);
            })

            .capture('selected_item', function (actions) {
                actions.click(this.item2);
                actions.wait(100);
                actions.click(this.item3);
                actions.wait(100);
                actions.click(this.accept);
                actions.wait(100);
                actions.click(this.box);
                actions.wait(100);
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
                actions.mouseMove(this.first_title)
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="2"]', 40000);
            })

            .capture('opened_two', function (actions) {
                actions.mouseMove(this.second_title)
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="2"]', 40000);
            })
    });
});*/