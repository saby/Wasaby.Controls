gemini.suite('SBIS3.CONTROLS.TreeCompositeViewList Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_tree_composite_view_list_online.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.tcv = '[name="TreeCompositeView 1"]';
				this.item4 = '[data-id="4"]';
				this.item4_checker = '[data-id="4"] .controls-ListView__itemCheckBox';
				this.item6 = '[data-id="6"]';
				this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.tcv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered_item', function (actions) {
                actions.mouseMove(this.item6);
            })

            .capture('selected_item', function (actions) {
                actions.click(this.item6);
            })
			
			.capture('hovered_folder', function (actions) {
                actions.mouseMove(this.item4);
				actions.waitForElementToShow(this.item4_checker, 5000);
            })

            .capture('selected_folder', function (actions) {
                actions.click(this.item4_checker);
            })
    });
	
	gemini.suite('empty_data', function (test) {

        test.setUrl('/regression_tree_composite_view_list_online_2.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tcv = '[name="TreeCompositeView 1"]';
				this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.tcv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TreeCompositeView 1').setEnabled(false);
                });
            })
    });
});