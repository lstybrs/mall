<template>
  <el-container class="container">

<!-- 头-->
    <el-header class="header">
      <el-row>
        <el-col :span="4"><h3>我的系统</h3></el-col>
        <el-col :span="18" class="middle"><h3>电商管理系统</h3></el-col>
        <el-col :span="2"><div class="grid-content bg-purple"><a href="#" class="loginout" @click.prevent="handle()">退出</a></div></el-col>
      </el-row>
    </el-header>
    <el-container>

<!-- 侧边-->
      <el-aside width="200px" class="aside">
            <el-menu :router="true" :unique-opened="true">

              <el-submenu :index="''+item1.order" v-for="(item1,i) in menu" :key="i">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{item1.authName}}</span>
                </template>
                <el-menu-item :index="item2.path" v-for="(item2,i) in item1.children" :key="i">
                  <i class="el-icon-circle-check"></i>
                  <span>{{item2.authName}}</span>
                </el-menu-item>
              </el-submenu>
            </el-menu>
      </el-aside>
<!-- 主-->
      <el-main class="main"><router-view/></el-main>
    </el-container>
  </el-container>
</template>

<script>
    export default {
        name: "home",
        data(){
            return{
              menu:[]
            }
        },
        created(){
            this.getMenu()
        },
        // beforeCreate() {
        //     const token = localStorage.getItem('token')
        //     if(!token){
        //         this.$router.push({name:'login'})
        //     }
        // },
        methods:{
            async getMenu(){
                const res = await this.$http.get(`menus`)
                this.menu = res.data.data
            },
            handle(){
                localStorage.clear()
                this.$message.success('退出成功！');
                this.$router.push({name:'login'})
            }
        }
    }
</script>

<style scoped>
  .container{
    height: 100%;
  }
  .header{
    background-color: #b3c0d1;
  }
  .aside{
    background-color: #d3dce6;
  }
  .main{
    background-color: #e9eef3;
  }
  .middle{
    text-align: center;
  }
  .loginout{
    line-height: 60px;
    text-decoration: none;
    cursor: pointer;
  }

</style>
