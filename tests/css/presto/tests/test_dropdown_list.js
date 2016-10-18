/*
var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.DropdownList Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_dropdown_list_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DropdownList 1"]', 40000);
                this.list = find('[name="DropdownList 1"]');
				this.title = find('[name="DropdownList 1"] .controls-DropdownList__text');
				this.item4 = find('.controls-DropdownList__item[data-id="4"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.title);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="4"]', 1000);
				actions.mouseMove(this.input);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item4);
            })
			
			.capture('selected', function (actions) {
                actions.click(this.item4);
				actions.mouseMove(this.input);
            })
    });
	
	gemini.suite('custom_header_template', function (test) {

        test.setUrl('/regression_dropdown_list_online_4.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="DropdownList1"]', 40000);
                this.list = find('[sbisname="DropdownList1"]');
				this.title = find('[sbisname="DropdownList1"] .controls-DropdownList__text');
				this.item4 = find('.controls-DropdownList__item[data-id="4"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.title);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="4"]', 1000);
				actions.mouseMove(this.input);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item4);
            })
			
			.capture('selected', function (actions) {
                actions.click(this.item4);
				actions.mouseMove(this.input);
            })
    });

    gemini.suite('disabled_base', function (test) {

        test.setUrl('/regression_dropdown_list_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DropdownList 1"]', 40000);
                this.list = find('[name="DropdownList 1"]');
				this.title = find('[name="DropdownList 1"] .controls-DropdownList__text');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DropdownList1').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.title);
            })
    });
	
	gemini.suite('hover_mode', function (test) {

        test.setUrl('/regression_dropdown_list_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DropdownList 1"]', 40000);
                this.list = find('[name="DropdownList 1"]');
				this.title = find('[name="DropdownList 1"].controls-DropdownList.ws-init-done .controls-DropdownList__text');
				this.item4 = find('.controls-DropdownList__item[data-id="4"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('opened', function (actions) {
                actions.mouseMove(this.title);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="4"]', 1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item4);
            })
			
			.capture('selected', function (actions) {
                actions.click(this.item4);
				actions.mouseMove(this.input);
            })
    });

    gemini.suite('disabled_hover_mode', function (test) {

        test.setUrl('/regression_dropdown_list_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DropdownList 1"]', 40000);
                this.list = find('[name="DropdownList 1"]');
				this.title = find('[name="DropdownList 1"].controls-DropdownList.ws-init-done .controls-DropdownList__text');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DropdownList2').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.title);
            })
    });
	
	gemini.suite('multiselect', function (test) {

        test.setUrl('/regression_dropdown_list_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DropdownList 1"]', 40000);
                this.list = find('[name="DropdownList 1"]');
				this.title = find('[name="DropdownList 1"] .controls-DropdownList__text');
				this.item2 = find('.controls-DropdownList__item[data-id="2"]');
				this.item4 = find('.controls-DropdownList__item[data-id="4"]');
				this.apply = find('[sbisname="DropdownList_buttonChoose"] .controls-Button__text');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
				this.more = find('[sbisname="DropdownList_buttonHasMore"] .controls-Link-link');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.title);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="2"]', 1000);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="4"]', 1000);
				actions.waitForElementToShow('[sbisname="DropdownList_buttonHasMore"] .controls-Link-link', 1000);
				actions.mouseMove(this.input);
            })
			
			.capture('selected_items', function (actions) {
                actions.click(this.item2);
				actions.click(this.item4);
				actions.mouseMove(this.input);
            })
			
			.capture('hovered_apply', function (actions) {
				actions.mouseMove(this.apply);
            })
			
			.capture('hovered_more', function (actions) {
				actions.mouseMove(this.more);
            })
			
			.capture('selected', function (actions) {
                actions.click(this.apply);
				actions.mouseMove(this.input);
            })
    });

    gemini.suite('disabled_multiselect', function (test) {

        test.setUrl('/regression_dropdown_list_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DropdownList 1"]', 40000);
                this.list = find('[name="DropdownList 1"]');
				this.title = find('[name="DropdownList 1"] .controls-DropdownList__text');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DropdownList3').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.title);
            })
    });
});*/