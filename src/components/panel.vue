<template>
<div class="panel-wrap" ref="wrapper" :style="style" @mouseenter="confined" @mousedown="startUp">
    <div class="panel-head" v-if="head"></div>
    <slot class="panel-body"></slot>
    <slot class="panel-foot" name="foot"></slot>
</div>
</template>

<script>
export default {
    data() {
        return {
            axisX: 0,
            axisY: 0,
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
            let axisY = this.axisY, axisX = this.axisX;
            if (this.confine) {
                axisY = axisY < 0 ? 0 : axisY > this.maxH ? this.maxH : axisY;
                axisX = axisX < 0 ? 0 : axisX > this.maxW ? this.maxW : axisX;
            }
            return {position: this.mode, top: `${axisY}px`, left: `${axisX}px`};
        }
    },
    methods: {
        confined() {
            let range = this.mode === 'fixed' ? document.body : this.wrapper.parentNode;
            this.maxW = range.clientWidth - this.wrapper.clientWidth;
            this.maxH = range.clientHeight - this.wrapper.clientHeight;
        },
        startUp({clientX, clientY}) {
            this.disX = clientX - this.wrapper.offsetLeft;
            this.disY = clientY - this.wrapper.offsetTop;
            document.onmousemove = ({clientX, clientY}) => {
                this.axisX = clientX - this.disX;
                this.axisY = clientY - this.disY;
            };
            document.onmouseup = () => document.onmousemove = document.onmouseup = null;
        }
    },
    created() {
        window.onresize = this.confined;
    },
    mounted() {
        this.wrapper = this.$refs.wrapper;
    }
}
</script>

<style scoped>
.panel-wrap {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>
