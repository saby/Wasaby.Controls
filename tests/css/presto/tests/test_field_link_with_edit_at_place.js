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
            })

            .capture('plain', function (actions, find) {
				/*actions.sendKeys(gemini.TAB);
				actions.sendKeys(gemini.TAB);
				actions.sendKeys(gemini.TAB);
				actions.mouseMove(this.item_1)
				actions.wait(500);
			})
    });
});*/