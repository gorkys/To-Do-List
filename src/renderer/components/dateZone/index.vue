<template>
    <div id="dateZone">
        <el-row type="flex" justify="space-between" class="dateBox">
            <el-col id="date">
                <span style="font-size: 50px">{{day}}</span>
                <div>
                    <p>{{month}}</p>
                    <p>{{year}}</p>
                </div>
            </el-col>
            <el-col id="week"><span>{{week}}</span></el-col>
        </el-row>
    </div>
</template>

<script>
    import {format} from '../../utils/dateFormat'
    export default {
      name: 'index',
      components: {},
      mounted () {
      },
      computed: {},
      data () {
        return {
          week: format('week'),
          day: format('day'),
          month: format('month'),
          year: format('year')
        }
      },
      methods: {},
      watch: {}
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    #dateZone{
        margin-top: 10px;
        color: white;
        height: 60px;
        line-height: 60px;
        padding: 0 50px;
    }
    #date{
        div {
            display: inline-block;
            p {
                margin: 2px;
                height: 20px;
                line-height: 20px;
                font-size: 22px
            }
            &:first-of-type{
                text-align: start;
            }
        }
    }
    #week{
        text-align: end;
        span{
            font-size: 35px
        }
    }
</style>