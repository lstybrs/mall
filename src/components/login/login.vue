<template>
<div class="login">
  <el-form class="login-from" :rules="loginFormRules" label-position="top" label-width="80px" :model="formdata">
    <h2>用户登录</h2>
  <el-form-item label="用户名">
    <el-input v-model="formdata.username" value="admin"></el-input>
  </el-form-item>
  <el-form-item label="密码">
    <el-input v-model="formdata.password" value="123456"></el-input>
  </el-form-item>
    <el-button @click.prevent="handleLogin()" class="login-btn" type="primary" plain>登录</el-button>
  </el-form>
</div>

</template>

<script>
    export default {
        name: "login",
        data(){
            return{
                formdata: {
                    username: 'admin',
                    password: '123456'
                },
                loginFormRules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入用户密码', trigger: 'blur' },
                        { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            async handleLogin(){
                const res = await this.$http.post('login',this.formdata)
                    //.then(res=>{})
                    const {data,meta:{msg,status}}=res.data
                    if(status===200){
                        localStorage.setItem('token',data.token)
                        this.$router.push({name:'home'})
                        this.$message.success('登录成功！');
                    }else {
                        this.$message.error('登录失败！');
                    }
            }
        }
    }
</script>

<style scoped>
  .login{
    height: 100%;
    background-color: #324152;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login-from{
    line-height: 5px;
  }
  .login .login-from{
    width: 400px;
    background-color: #fff;
    border-radius: 5px;
    padding: 30px;
  }
  .login .login-btn{
    width: 100%;
  }
  .login-btn{
    margin-top: 20px;
  }

</style>
