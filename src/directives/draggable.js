import Vue from 'vue';

export const draggable = Vue.directive('draggable', {
    bind(el, {arg}) {
        const style = {position: arg, cursor: 'pointer', userSelect: 'none'};
        Object.keys(style).forEach(i => el.style[i] = style[i]);
    },
    inserted(el, {arg, modifiers}) {
        const {random, center} = modifiers;
        const drag = {
            setRange() {
                el.range = arg === 'fixed' ? document.body : el.parentNode;
                el.ranW = el.range.clientWidth;
                el.ranH = el.range.clientHeight;
                el.minW = 0;
                el.minH = 0;
                el.maxW = el.ranW - el.clientWidth;
                el.maxH = el.ranH - el.clientHeight;
            },
            setPosition({left, top}) {
                const position = {
                    left: left < 0 ? el.minW : left > el.maxW ? el.maxW : left,
                    top: top < 0 ? el.minH : top > el.maxH ? el.maxH : top
                };
                Object.keys(position).forEach(i => el.style[i] = `${position[i]}px`);
            }
        };
        drag.setRange();
        if (random) {
            drag.setPosition({left: Math.random() * el.maxW, top: Math.random() * el.maxH});
        }
        if (center) {
            drag.setPosition({left: el.maxW / 2, top: el.maxH / 2});
        }
        el.onmousedown = ({clientX, clientY}) => {
            let disX = clientX - el.offsetLeft, disY = clientY - el.offsetTop;
            document.onmousemove = ({clientX, clientY}) => {
                drag.setPosition({left: clientX - disX, top: clientY - disY});
            };
            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        };
        window.onresize = () => {
            if (arg === 'fixed') drag.setRange();
        };
    }
});
