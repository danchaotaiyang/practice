<template>
<div class="drag-wrap" ref="wrap" :style="style" @mousedown="startUp">
    <div ref="head" v-if="$slots.head">
        <slot name="head"></slot>
    </div>
    <div ref="body">
        <slot name="body"></slot>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            axiX: 0,
            axiY: 0,
            ranW: 0,
            ranH: 0,
            wrpW: 0,
            wrpH: 0,
            maxW: 0,
            maxH: 0
        };
    },
    props: {
        enable: {
            type: Boolean, default: true
        },
        confine: {
            type: Boolean, default: false
        },
        mode: {
            type: String, default: 'absolute'
        }
    },
    computed: {
        style() {
            let axiY = this.axiY, axiX = this.axiX;
            if (this.confine) {
                axiY = axiY < 0 ? 0 : axiY > this.maxH ? this.maxH : axiY;
                axiX = axiX < 0 ? 0 : axiX > this.maxW ? this.maxW : axiX;
            }
            return {position: this.mode, top: `${axiY}px`, left: `${axiX}px`};
        }
    },
    methods: {
        confined() {
            this.ranW = this.range.clientWidth;
            this.ranH = this.range.clientHeight;
            this.wrpW = this.wrap.clientWidth;
            this.wrpH = this.wrap.clientHeight;
            this.maxW = this.ranW - this.wrpW;
            this.maxH = this.ranH - this.wrpH;
        },
        startUp({clientX, clientY}) {
            this.disX = clientX - this.wrap.offsetLeft;
            this.disY = clientY - this.wrap.offsetTop;
            document.onmousemove = ({clientX, clientY}) => {
                this.axiX = clientX - this.disX;
                this.axiY = clientY - this.disY;
            };
            document.onmouseup = () => document.onmousemove = document.onmouseup = null;
        }
    },
    created() {
        window.onresize = this.confined;
    },
    mounted() {
        this.wrap = this.$refs.wrap;
        this.range = this.mode === 'fixed' ? document.body : this.wrap.parentNode;
        this.confined();
    },
    watch: {
        ranW(curW) {
            if (curW - this.wrpW > this.maxW) {
                this.axiX = curW - this.wrpW;
            }
        }
    }
}
</script>

<style scoped>
.drag-wrap {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>
