<template>
    <div id="box">
        <titleBar></titleBar>
        <dateZone></dateZone>
        <el-progress class="progress"
                     :percentage="progress"
                     :text-inside="true"
                     :stroke-width="20">
        </el-progress>
        <todoList></todoList>
    </div>
</template>

<script>
    import titleBar from '../components/titlebar'
    import dateZone from '../components/dateZone'
    import todoList from '../components/todoList'
    import { mapActions, mapGetters } from 'vuex'
    export default {
      name: 'index',
      components: {titleBar, dateZone, todoList},
      mounted () {
        this.calcPercentage(this.$db.get('ListData').value())
      },
      data () {
        return {}
      },
      computed: {
        ...mapGetters([
          'progress'
        ])
      },
      methods: {
        ...mapActions([
          'calcPercentage'
        ])
      },
      watch: {}
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    #box{
        font-family: Comic Sans MS,Microsoft YaHei;
        padding: 0;
        user-select:none;
        cursor: context-menu;
        background-color: rgba(75, 75, 75, 0.8)
    }
    .progress{
        margin: 20px 50px 50px;
        border-radius: 1px;
        /deep/ .el-progress-bar__outer{
            border-radius: 2px;
            .el-progress-bar__inner {
                border-radius: 2px;
                background-color: #8EC5FC;
                background-image: linear-gradient(135deg,#E0C3FC 24%,#8EC5FC 75%);
                background-image: -webkit-linear-gradient(135deg,#E0C3FC 24%,#8EC5FC 75%);
            }
        }
    }
</style>