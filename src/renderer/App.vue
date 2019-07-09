<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'to-do-list'
  }
</script>

<style lang="scss">
  html,body{
    height: 100%;
    overflow: hidden;
    padding: 0!important;
    background-color: rgba(0, 0, 0, 0)
  }
</style>
