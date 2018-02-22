import Vue from 'vue';

export const draggable = Vue.directive('draggable', {
    bind(el, {arg}) {
        const style = {position: arg, cursor: 'pointer', userSelect: 'none'};
        Object.keys(style).forEach(i => el.style[i] = style[i]);
    },
    inserted(el, {arg}) {
        const setRange = () => {
            let range = arg === 'fixed' ? document.body : el.parentNode;
            el.minW = 0;
            el.minH = 0;
            el.maxW = range.clientWidth - el.clientWidth;
            el.maxH = range.clientHeight - el.clientHeight;
        };
        const setPosition = ({left, top}) => {
            const position = {
                left: left < 0 ? el.minW : left > el.maxW ? el.maxW : left,
                top: top < 0 ? el.minH : top > el.maxH ? el.maxH : top
            };
            Object.keys(position).forEach(i => el.style[i] = `${position[i]}px`);
        };
        setRange();
        setPosition({left: Math.random() * el.maxW, top: Math.random() * el.maxH});

        el.onmousedown = ({clientX, clientY}) => {
            let disX = clientX - el.offsetLeft, disY = clientY - el.offsetTop;
            document.onmousemove = ({clientX, clientY}) => {
                setPosition({left: clientX - disX, top: clientY - disY});
            };
            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        };
        window.onresize = () => {
            if (arg === 'fixed') setRange();
        };
    }
});

