import Vue from 'vue';

export const draggable = Vue.directive('draggable', {
    bind(el, {arg}) {
        const style = {position: arg, cursor: 'pointer', userSelect: 'none'};
        Object.keys(style).forEach(i => el.style[i] = style[i]);
    },
    inserted(el, {arg, modifiers}) {
        const {range, random, center} = modifiers;
        const drag = {
            initRange() {
                el.range = arg === 'fixed' ? document.body : el.parentNode;
                el.range.style.overflow = 'hidden';
                el.ranW = el.range.clientWidth;
                el.ranH = el.range.clientHeight;
                el.maxW = el.ranW - el.clientWidth;
                el.maxH = el.ranH - el.clientHeight;
            },
            setPosition({left, top}) {
                const styles = {
                    left: range && left < 0 ? 0 : range && left > el.maxW ? el.maxW : left,
                    top: range && top < 0 ? 0 : range && top > el.maxH ? el.maxH : top,
                    width: el.clientWidth,
                    height: el.clientHeight
                };
                Object.keys(styles).forEach(i => el.style[i] = `${styles[i]}px`);
            }
        };
        drag.initRange();
        drag.setPosition({
            left: random ? Math.random() * el.maxW : center ? el.maxW / 2 : 0,
            top: random ? Math.random() * el.maxH : center ? el.maxH / 2 : 0
        });
        el.onmouseenter = () => drag.initRange();
        el.onmousedown = ({clientX, clientY}) => {
            let disX = clientX - el.offsetLeft, disY = clientY - el.offsetTop;
            document.onmousemove = ({clientX, clientY}) => {
                drag.setPosition({left: clientX - disX, top: clientY - disY});
            };
            document.onmouseup = () => document.onmousemove = document.onmouseup = null;
        };
    }
});
