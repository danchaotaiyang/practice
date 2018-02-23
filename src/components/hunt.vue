<template>
<div class="hunter" v-if="hunting">
    <input type="text" placeholder="1">
</div>
</template>

<script>
export default {
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
                this._showHunter();
            }
            this._setTimeStamp();
        },
        _showHunter() {
            this.hunting = true;
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
}
</style>
