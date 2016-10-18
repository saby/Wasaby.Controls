gemini.suite('SBIS3.CONTROLS.TreeCompositeViewTable Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_tree_composite_view_table_online.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.tcv = '[name="TreeCompositeView 1"]';
				this.item4 = '[data-id="4"]';
				this.item4_checker = '[data-id="4"] .controls-ListView__itemCheckBox';
				this.item4_expand = '[data-id="4"] .controls-TreeView__expand';
				this.item6 = '[data-id="6"]';
				this.item14 = '[data-id="14"]';
				this.input = '[sbisname="TextBox 1"] input';
				this.delete_btn = '[data-id="delete"]';
				this.selected = '.controls-ListView__item__selected';
                
				actions.waitForElementToShow(this.tcv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered_item', function (actions) {
                actions.mouseMove(this.item6);
				actions.waitForElementToShow(this.delete_btn, 5000);
            })

            .capture('selected_item', function (actions) {
                actions.click(this.item6);
				actions.waitForElementToShow(this.selected, 5000);
            })
			
			.capture('hovered_folder', function (actions) {
                actions.mouseMove(this.item4);
				actions.waitForElementToShow(this.delete_btn, 5000);
				actions.waitForElementToShow(this.item4_checker, 5000);
            })

            .capture('selected_folder', function (actions) {
                actions.click(this.item4_checker);
				actions.waitForElementToShow(this.selected, 5000);
            })
			
			.capture('opened_folder', function (actions) {
                actions.click(this.item4_expand);
				actions.waitForElementToShow(this.item14, 5000);
            })
    });
	
	gemini.suite('empty_data', function (test) {

        test.setUrl('/regression_tree_composite_view_table_online_2.html').setCaptureElements('.capture')

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
	
	gemini.suite('ellipsis_column', function (test) {

        test.setUrl('/regression_tree_composite_view_table_online_4.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tcv = '[name="TreeCompositeView 1"]';
				this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.tcv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });
	
	gemini.suite('ellipsis_column_and_arrow_handler', function (test) {

        test.setUrl('/regression_tree_composite_view_table_online_5.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tcv = '[name="TreeCompositeView 1"]';
				this.input = '[sbisname="TextBox 1"] input';
				this.data3 = '[data-id="3"]';
				this.arrow = '.controls-TreeView__editArrow-container';
                
				actions.waitForElementToShow(this.tcv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.mouseMove(this.data3);
				actions.waitForElementToShow(this.arrow, 5000);
            })
    });
});