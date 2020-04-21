<template>
  <el-card>
    <my-bread level1="权限管理" level2="权限列表"></my-bread>
    <el-table
      height="400px"
      :data="rightList"
      border
      style="width: 100%;margin-top: 20px">
      <el-table-column
        label="#"
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="180">
      </el-table-column>
      <el-table-column
        prop="level"
        label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level == 0">一级</span>
          <span v-if="scope.row.level == 1">二级</span>
          <span v-if="scope.row.level == 2">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
    export default {
        name: "right",
        data(){
            return{
                rightList:[]
            }
        },
        created() {
            this.getRight()
        },
        methods:{
            async getRight(){
                const res = await this.$http.get('rights/list')
                console.log(res);
                this.rightList = res.data.data
            }
        }
    }
</script>

<style scoped>

</style>
