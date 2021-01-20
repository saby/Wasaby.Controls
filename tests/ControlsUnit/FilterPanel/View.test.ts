import {View} from 'Controls/filterPanel';
import {assert} from 'chai';

describe('Controls/filterPanel:View', () => {

    describe('_groupClick', () => {
        const viewControl = new View({});
        let itemToggled = false;
        const displayItem = {
            isExpanded: () => true,
            getContents: () => 'elem',
            toggleExpanded: () => { itemToggled = true; }
        };
        const clickEvent = {
            target: {
                closest: (text) => {
                    return text === '.controls-FilterViewPanel__group';
                }
            }
        };

        it('displayItem is expanded', () => {
            viewControl._collapsedGroups = ['elem'];

            viewControl._groupClick(null, displayItem, clickEvent);
            assert.deepEqual(viewControl._collapsedGroups, []);
            assert.isTrue(itemToggled);
        });

        it('collapsedGroups includes item contents', () => {
            itemToggled = false;
            displayItem.isExpanded = () => false;
            viewControl._collapsedGroups = ['elem'];

            viewControl._groupClick(null, displayItem, clickEvent);
            assert.deepEqual(viewControl._collapsedGroups, []);
            assert.isTrue(itemToggled);
        });

        it('displayItem is collapsed', () => {
            itemToggled = false;
            viewControl._collapsedGroups = [];
            displayItem.isExpanded = () => true;

            viewControl._groupClick(null, displayItem, clickEvent);
            assert.deepEqual(viewControl._collapsedGroups, ['elem']);
            assert.isTrue(itemToggled);
        });

        it('displayItem is collapsed, without click on group caption', () => {
            itemToggled = false;
            viewControl._collapsedGroups = [];

            viewControl._groupClick(null, displayItem, null);
            assert.deepEqual(viewControl._collapsedGroups, ['elem']);
            assert.isFalse(itemToggled);
        });
    });
});
