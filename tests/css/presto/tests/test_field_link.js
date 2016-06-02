/*
var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.FieldLink Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_field_link_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldLinkSingleSelect"]', 40000);
                this.input = find('.controls-TextBox__field');
                this.open_menu = find('[sbisname="fieldLinkMenu"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.box = find('[sbisname="TextBox 1"] .controls-TextBox__field');
            })

            .capture('plain', function (actions) {
                actions.click(this.box);
            })
			
			.capture('hovered_open_catalog', function (actions) {
                actions.mouseMove(this.open_menu);
            })

            .capture('with_link', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldLinkSingleSelect').setSelectedKeys([0])
                });
				actions.click(this.box);
            })

            .capture('hovered_text', function (actions) {
                actions.mouseMove('.controls-FieldLink__linkItem-caption');
            })

            .capture('hovered_close_icon', function (actions) {
                actions.mouseMove('.controls-FieldLink__linkItem-cross');
            })
    });

    gemini.suite('with_multiselect', function (test) {

        test.setUrl('/regression_field_link_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldLinkMultiSelect"]', 40000);
                this.input = find('.controls-TextBox__field');
                this.open_menu = find('[sbisname="fieldLinkMenu"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.box = find('[sbisname="TextBox 1"] .controls-TextBox__field');
            })

            .capture('plain', function (actions) {
                actions.click(this.box);
            })
			
			.capture('hovered_open_catalog', function (actions) {
                actions.mouseMove(this.open_menu);
            })

            .capture('with_link', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldLinkMultiSelect').setSelectedKeys([0,2,3,4])
                });
                actions.click(this.box);
            })

            .capture('hovered_text_2', function (actions) {
                actions.mouseMove('[data-id="2"] .controls-FieldLink__linkItem-caption');
            })

            .capture('hovered_close_icon_2', function (actions) {
                actions.mouseMove('[data-id="2"] .controls-FieldLink__linkItem-cross');
            })

            .capture('hovered_more', function (actions) {
                actions.mouseMove('.controls-FieldLink__showAllLinks');
            })

            .capture('opened_more', function (actions) {
                actions.click('.controls-FieldLink__showAllLinks');
            })

            .capture('hovered_clear_all', function (actions) {
                actions.mouseMove('.controls-FieldLink__showAllLinks ~ a');
            })
    });
});*/