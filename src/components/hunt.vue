<template>
<div class="hunter" v-show="hunting">
    <input type="text" :placeholder="placeholder">
</div>
</template>

<script>
export default {
    props: {
        placeholder: ''
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
            if (new Date().getTime() - this.timeStamp < 600) {
                console.log(1);
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
