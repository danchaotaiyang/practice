import Vue from 'vue';

const setRange = (el) => {
    el.maxWidth = document.body.clientWidth - el.clientWidth;
    el.maxHeight = document.body.clientHeight - el.clientHeight;
};

export const drag = Vue.directive('drag', {
    bind(el) {
        const style = {position: 'fixed', cursor: 'pointer', userSelect: 'none'};
        Object.keys(style).forEach(i => el.style[i] = style[i]);
    },
    inserted(el) {
        setRange(el);
        window.onresize = () => setRange(el);

        const setPosition = (left, top) => {
            left < 0 && (left = 0) || left > el.maxWidth && (left = el.maxWidth);
            top < 0 && (top = 0) || top > el.maxHeight && (top = el.maxHeight);
            el.style.left = `${left}px`;
            el.style.top = `${top}px`;
        };

        setPosition(Math.random() * el.maxHeight, Math.random() * el.maxWidth);

        el.onmousedown = ({clientX, clientY}) => {
            let disX = clientX - el.offsetLeft,
                disY = clientY - el.offsetTop;

            document.onmousemove = ({clientX, clientY, pageX, pageY}) => {
                if (pageX < 0 || pageY < 0 || pageX > el.maxWidth || pageY > el.maxHeight) {
                    document.onmousemove = null;
                    document.onmouseup = null;
                }
                setPosition(clientX - disX, clientY - disY);
            };

            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        };
    }
});

