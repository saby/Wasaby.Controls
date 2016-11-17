var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.NotificationWindows Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_info_windows_online.html').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('.butt1', 40000);
                this.success = find('.butt1');				
				actions.waitForElementToShow('.butt2', 40000);
                this.error = find('.butt2');
				actions.waitForElementToShow('.butt2_cust', 40000);
                this.custom = find('.butt2_cust');
				actions.waitForElementToShow('.butt3', 40000);
                this.message = find('.butt3');
				actions.waitForElementToShow('.butt4', 40000);
                this.longops = find('.butt4');
				actions.waitForElementToShow('.butt5', 40000);
                this.yes_no = find('.butt5');
				actions.waitForElementToShow('.butt6', 40000);
                this.yes_no_cancel = find('.butt6');
				actions.waitForElementToShow('.butt7', 40000);
                this.green = find('.butt7');
				actions.waitForElementToShow('.butt8', 40000);
                this.red = find('.butt8');
            })

            .capture('success_dialog', function (actions) {
				actions.click(this.success)
				actions.waitForElementToShow('.controls-NotificationPopup__header_caption', 5000)
				actions.wait(500);
            })
			
			.capture('error_dialog', function (actions) {
				actions.wait(5000);
				actions.click(this.error)
				actions.waitForElementToShow('.controls-NotificationPopup__header_caption', 5000)
				actions.wait(500);
            })
			
			.capture('custom_icon_dialog', function (actions) {
				actions.wait(5000);
				actions.click(this.custom)
				actions.waitForElementToShow('.controls-NotificationPopup__header_caption', 5000)
				actions.wait(500);
            })
			
			.capture('message_dialog', function (actions) {
				actions.wait(5000);
				actions.click(this.message)
				actions.waitForElementToShow('.message img', 5000)
				actions.wait(500);
            })
			
			.capture('green_dialog', function (actions) {
				actions.wait(5000);
				actions.click(this.green)
				actions.waitForElementToShow('[sbisname="okButton"]', 5000)
				actions.wait(500);
            })
			
			.capture('green_dialog_message', function (actions) {
				actions.click('[sbisname="okButton"]')
				actions.waitForElementToShow('.controls-NotificationPopup__header_caption', 5000)
				actions.wait(500);
            })

			.capture('red_dialog', function (actions) {
				actions.wait(5000);
				actions.click(this.red)
				actions.waitForElementToShow('[sbisname="okButton"]', 5000)
				actions.wait(500);
            })
			
			.capture('red_dialog_message', function (actions) {
				actions.click('[sbisname="okButton"]')
				actions.waitForElementToShow('.controls-NotificationPopup__header_caption', 5000)
				actions.wait(500);
            })

			.capture('yes_no_dialog', function (actions) {
				actions.wait(5000);
				actions.click(this.yes_no)
				actions.waitForElementToShow('[sbisname="positiveButton"]', 5000)
				actions.wait(500);
            })

			.capture('yes_no_dialog_message', function (actions) {
				actions.click('[sbisname="positiveButton"]')
				actions.waitForElementToShow('.controls-NotificationPopup__header_caption', 5000)
				actions.wait(500);
            })

			.capture('yes_no_cancel_dialog', function (actions) {
				actions.wait(5000);
				actions.click(this.yes_no_cancel)
				actions.waitForElementToShow('[sbisname="positiveButton"]', 5000)
				actions.wait(500);
            })

			.capture('yes_no_cancel_dialog_message', function (actions) {
				actions.click('[sbisname="positiveButton"]')
				actions.waitForElementToShow('.controls-NotificationPopup__header_caption', 5000)
				actions.wait(500);
            })

			.capture('long_message_dialog', function (actions) {
				actions.wait(5000);
				actions.click(this.longops)
				actions.waitForElementToShow('.longops img', 5000)
				actions.wait(500);
            })			
    });	
});