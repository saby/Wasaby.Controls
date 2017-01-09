/*
var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.FieldLinkWithEditAtPlace Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_field_link_with_edit_in_place_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="DemoDataGrid"]', 40000);
                this.item_1 = find('[data-id="1"]')
				this.item_3 = find('[data-id="3"]')
				actions.click(this.item_3);
				this.editor_input = find('.controls-NumberTextBox__enable-arrow:nth-child(1) input')
				actions.sendKeys(this.editor_input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.editor_input, gemini.SHIFT+gemini.HOME);
            })

            .capture('plain', function (actions, find) {
				actions.mouseMove(this.item_1)
			})
    });
});*/