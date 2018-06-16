<template>
<div class="hunter" v-show="hunting">
    <input type="text" :placeholder="placeholder">
</div>
</template>

<script>
export default {
    props: {
        interval: {
            type: Number,
            default: 600
        },
        placeholder: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            hunting: false
        };
    },
    methods: {
        _setTimeStamp() {
            this.timeStamp = new Date().getTime();
        },
        _keyShift() {
            if (new Date().getTime() - this.timeStamp < this.interval) {
                this._toggleHunter();
            }
            this._setTimeStamp();
        },
        _toggleHunter() {
            this.hunting = !this.hunting;
        }
    },
    created() {
        this._setTimeStamp();
        document.onkeyup = (e) => e.key === 'Shift' && this._keyShift();
    }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.hunter {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 600px;
    height: 50px;
    border: 1px solid #ccc;
}
</style>
