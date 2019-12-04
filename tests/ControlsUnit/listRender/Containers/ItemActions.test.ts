import { assert } from 'chai';

import ItemActionsContainer from 'Controls/_listRender/Containers/ItemActions';

describe('Controls/_listRender/Containers/ItemActions', () => {
    describe('_beforeUpdate()', () => {
        it('reinitializes actions when model, actions or visibility callback are changed', () => {
            const oldCfg = {
                listModel: 1,
                itemActions: 2,
                itemActionVisibilityCallback: 3
            };
            const container = new ItemActionsContainer(oldCfg);
            container.saveOptions(oldCfg);

            let assignActionsCount = 0;
            container._assignItemActions = () => {
                assignActionsCount++;
            };
            container._initializedActions = true;

            container._beforeUpdate({ ...oldCfg });
            assert.strictEqual(assignActionsCount, 0);

            container._beforeUpdate({ ...oldCfg, listModel: 4 });
            assert.strictEqual(assignActionsCount, 1);

            container._beforeUpdate({ ...oldCfg, itemActions: 4 });
            assert.strictEqual(assignActionsCount, 2);

            container._beforeUpdate({ ...oldCfg, itemActionVisibilityCallback: 4 });
            assert.strictEqual(assignActionsCount, 3);
        });

        it('does nothing if actions are not yet initialized', () => {
            const oldCfg = {
                listModel: 1,
                itemActions: 2,
                itemActionVisibilityCallback: 3
            };
            const container = new ItemActionsContainer(oldCfg);
            container.saveOptions(oldCfg);

            let assignActionsCount = 0;
            container._assignItemActions = () => {
                assignActionsCount++;
            };

            container._beforeUpdate({ ...oldCfg, listModel: 4 });
            assert.strictEqual(assignActionsCount, 0);

            container._beforeUpdate({ ...oldCfg, itemActions: 4 });
            assert.strictEqual(assignActionsCount, 0);

            container._beforeUpdate({ ...oldCfg, itemActionsVisibilityCallback: 4 });
            assert.strictEqual(assignActionsCount, 0);
        });
    });

    it('_onContainerMouseEnter()', () => {
        const container = new ItemActionsContainer({});
        container.saveOptions({});

        let assignActionsCount = 0;
        container._assignItemActions = () => {
            assignActionsCount++;
        };

        container._onContainerMouseEnter();
        assert.strictEqual(assignActionsCount, 1);

        container._onContainerMouseEnter();
        assert.strictEqual(assignActionsCount, 1);
    });

    it('_assignItemActions()', () => {
        let assignItemActionsCalled = false;
        const listModel = {
            getItemActionsManager() {
                return {
                    assignItemActions() {
                        assignItemActionsCalled = true;
                    }
                };
            }
        };

        const container = new ItemActionsContainer({});
        container._assignItemActions(listModel);

        assert.isTrue(assignItemActionsCalled);
    });
});
