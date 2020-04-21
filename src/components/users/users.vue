<template>
  <el-card class="box-card">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row>
      <el-col>
        <div style="margin-top: 15px;">
          <el-input @clear="clearuser()" clearable placeholder="请输入内容" v-model="query" class="input-s">
            <el-button slot="append" icon="el-icon-search" @click.prevent="searchuser()"></el-button>
          </el-input>
          <el-button type="success" @click="showUser()">添加用户</el-button>
        </div>
      </el-col>
    </el-row>

    <el-table :data="userlist" style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="60">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>

      <el-table-column
        label="创建时间">
        <template slot-scope="userlist">
          {{userlist.row.create_time | fmtdate}}
        </template>
      </el-table-column>

      <el-table-column
        label="用户状态">
        <template slot-scope="userlist">
          <el-switch
            @change="changeMs(userlist.row)"
            v-model="userlist.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column
      label="操作"
      width="200">
        <template slot-scope="userlist">
          <el-row>
            <el-button @click="showEdit(userlist.row)" size="mini" type="primary" plain icon="el-icon-edit" circle></el-button>
            <el-button @click="showDelte(userlist.row.id)" size="mini" type="danger" plain icon="el-icon-delete" circle></el-button>
            <el-button @click="showRole(userlist.row)" size="mini" type="success" plain icon="el-icon-check" circle></el-button>
          </el-row>
        </template>
    </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="page">
    </el-pagination>

    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRol">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          {{currUserName}}
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="currRoule">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option :label="item.roleName" :value="item.id" v-for="(item,i) in this.roles" :key="i"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRol = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>

  </el-card>

</template>

<script>
    export default {
        name: "users",
        data(){
            return{
                query:'',
                pagenum:1,
                pagesize:2,
                userlist:[],
                total:-1,
                dialogFormVisibleAdd:false,
                dialogFormVisibleEdit:false,
                dialogFormVisibleRol:false,
                form:{
                    username:'',
                    password:'',
                    email:'',
                    mobile:''
                },
                roles:[],
                currUserName:"",
                currRoule:-1,
                currUserId: -1,
                formLabelWidth: '120px'
            }
        },
        created(){
            this.getUserList()
        },
        methods:{
            async getUserList(){
               const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
                const {meta:{status,msg},data:{users,total}} = res.data
                console.log(res);
                if(status===200){
                    this.userlist=users
                    this.total = total
                }
            },
            handleSizeChange(val) {
                this.pagesize = val

                this.getUserList()
            },
            handleCurrentChange(val) {
                this.pagenum = val

                this.getUserList()
            },
            searchuser(){
                this.getUserList()
            },
            clearuser(){
                this.getUserList()
            },
            showUser(){
                this.dialogFormVisibleAdd=true
                this.form = {}
            },
            async addUser(){
                const res = await this.$http.post('users',this.form)
                console.log(res);
                const {meta:{status,msg},data} = res.data
                if(status===201){
                    this.$message.success(msg)
                    this.dialogFormVisibleAdd = false
                    this.getUserList()
                    this.form = {}
                }else {
                    this.$message.warning(msg)
                }
            },
            showDelte(userId){
                this.$confirm('删除用户?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res = await this.$http.delete(`users/${userId}`)
                    if(res.data.meta.status === 200){
                        this.getUserList()
                        this.$message({
                            type: 'success',
                            message: '删除成功!',
                        });
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                  });
            },
            showEdit(user){
                console.log(user);
                this.form = user
                this.dialogFormVisibleEdit = true
            },
            async editUser(){
                const res = await this.$http.put(`users/${this.form.id}`,this.form)
                if(res.data.meta.status===200) {
                    this.dialogFormVisibleEdit = false
                }
            },
            async changeMs(user){
                const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
                console.log(res);
            },
            async showRole(user){
                this.currUserName = user.username
                this.currUserId = user.id
                const res1 = await this.$http.get(`roles`)
                this.roles =  res1.data.data
                const res = await this.$http.get(`users/${user.id}`)
                const {data:{data:rid}} =  res
                this.currRoule = rid.rid
                this.dialogFormVisibleRol = true
            },
            async setRole(){
                const res = await this.$http.put(`users/${this.currUserId}/role`,{
                    rid:this.currRoule,
                })
                if(res.data.meta.status !== 200) {
                    this.$message.success('更新角色失败！')
                }
                this.$message.success('更新角色成功！')
                this.dialogFormVisibleRol = false
            }
    }
    }
</script>

<style scoped>
  .box-card{
    height: 100%;
  }
  .input-s{
    width: 300px;
  }

</style>
