import 'css!Controls/Utils/getScrollbarWidth'

export function getScrollbarWidth(detection): number {
    if (detection.webkit || detection.chrome) {
        return 0;
    } else if (detection.isIE12) {
        return detection.IEVersion < 17 ? 12 : 16;
    } else if (detection.isIE10 || detection.isIE11) {
        return 17;
    } else if (typeof window !== 'undefined') {
        return _private.getScrollbarWidthByMeasuredBlock();
    }
}

// For unit test.
export const _private = {
    getScrollbarWidthByMeasuredBlock: function (): number {
        const measuredBlock: HTMLDivElement = document.createElement('div');
        measuredBlock.className = 'controls-Scroll__measuredBlock';
        document.body.appendChild(measuredBlock);
        const scrollbarWidth = measuredBlock.offsetWidth - measuredBlock.clientWidth;
        document.body.removeChild(measuredBlock);

        return scrollbarWidth;
    }
};
