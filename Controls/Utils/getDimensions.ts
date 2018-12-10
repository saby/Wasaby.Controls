'use strict';

function getVisibleChildren(element : HTMLElement) : Array<HTMLElement> {
    return Array.prototype.filter.call(element.children, function(child: HTMLElement) {
        // https://drafts.csswg.org/cssom-view/#dom-htmlelement-offsetparent
        // offsetParent is null if:
        // 1) Either element or any of its parents is hidden via display style property
        // 2) The element’s computed value of the position property is fixed.
        // 3) It's either root or <body> element.
        // We don't care about the third case here, since it's a very rare case, and it's not very useful to get visible children of a root element anyway.
        if (child.offsetParent !== null) {
            return child;
        }
        if (window.getComputedStyle(child).display !== 'none') {
            return child;
        }
    });
}

/**
 * Returns the size of an element and its position relative to the viewport. Should be used when the element may have display: contents, but you still want to get its real size and position.
 * The function makes certain assumptions about the element if it has display: contents:
 * 1) The element is not a root element.
 * 2) The children of the element have the same height.
 * 3) The element doesn't have absolutely or stickily positioned children.
 * @param {HTMLElement} element
 * @returns {ClientRect}
 */
function getDimensions(element: HTMLElement) : ClientRect {
    let dimensions : ClientRect = element.getBoundingClientRect();

    if (dimensions.width !== 0 || dimensions.height !== 0) {
        return dimensions;
    }

    const visibleChildren = getVisibleChildren(element);

    if (visibleChildren.length === 0) {
        return dimensions;
    }

    const firstChildDimensions = visibleChildren[0].getBoundingClientRect();
    const lastChildDimensions = visibleChildren[visibleChildren.length - 1].getBoundingClientRect();

    dimensions = {
        width: lastChildDimensions.right - firstChildDimensions.left,
        height: firstChildDimensions.height,
        top: firstChildDimensions.top,
        right: lastChildDimensions.right,
        bottom: firstChildDimensions.bottom,
        left: firstChildDimensions.left
    };

    return dimensions;
}

export = getDimensions;