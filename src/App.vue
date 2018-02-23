<template>
<div id="app">
    <router-view/>
</div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style lang="scss" rel="stylesheet/scss">
@import "assets/css/layout";
body {
    margin: 0;
}
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
</style>
