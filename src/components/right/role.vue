<template>
  <el-card>
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <el-row class="addrole">
      <el-col>
        <el-button type="info" @click="AddRoleDialogVisibleL=true">添加角色</el-button>
      </el-col>
    </el-row>

    <el-table :data="Rolelist" style="width: 100%">
      <el-table-column
        type="expand" width="50">
        <template slot-scope="scope">

          <el-row v-for="(item1 , i) in scope.row.children" :key="i">
            <el-col :span="4">
              <el-tag closable @close="deleRight(scope.row,item1.id)">
                {{item1.authName}}
              </el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>

              <el-col :span="20">
                <el-row v-for="(item2 , i) in item1.children" :key="i">
                  <el-col :span="4">
                    <el-tag closable type="success" @close="deleRight(scope.row,item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <el-col :span="20">
                    <el-tag @close="deleRight(scope.row,item3.id)" closable type="warning" v-for="(item3 , i) in item2.children" :key="i">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

          <span v-if="scope.row.children.length===0">未分配权限</span>
        </template>
      </el-table-column>

      <el-table-column
        type="index"
        label="#"
        width="150">
      </el-table-column>

      <el-table-column
        prop="roleName"
        label="角色名称"
        width="200">
      </el-table-column>

      <el-table-column
        prop="roleDesc"
        label="角色描述"
      width="200">
      </el-table-column>

      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button @click="showEditDialog(scope.row.id)" size="mini" type="primary" plain icon="el-icon-edit" circle></el-button>
            <el-button @click="removeRoleById(scope.row.id)" size="mini" type="danger" plain icon="el-icon-delete" circle></el-button>
            <el-button @click="showRolelist(scope.row)" size="mini" type="success" plain icon="el-icon-check" circle></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

<!--:default-expanded-keys="arrexparnd"
   直接写default-expand-all-->


    <el-dialog title="添加权限" :visible.sync="dialogFormVisibleRight">

      <el-tree
        :data="treelist"
        ref="tree"
        show-checkbox
        node-key="id"
        :default-expanded-keys="arrexparnd"
        :default-checked-keys="arrcheck"
        :props="defaultProps">
      </el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
        <el-button type="primary" @click="setRoleR()">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="添加角色" :visible.sync="AddRoleDialogVisibleL" width="40%" @close="addRoleDialogClosed">
      <el-form
        :model="addRoleForm"
        ref="addRoleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddRoleDialogVisibleL = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="40%" @close="addRoleDialogClosed">
      <el-form
        :model="editRoleForm"
        ref="editRoleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>

  </el-card>
</template>

<script>
    export default {
        name: "role",
        data(){
            return{
                Rolelist:[],
                dialogFormVisibleRight:false,
                treelist:[],
                defaultProps:{
                    label:'authName',
                    children:'children'
                },
                arrexparnd:[],
                arrcheck:[],
                currRoleId:-1,
                AddRoleDialogVisibleL:false,
                editRoleDialogVisible:false,
                addRoleForm: {
                    roleName:'',
                    roleDesc:''
                },
                editRoleForm:{
                    roleName:'',
                    roleDesc:''
                }
            }
        },
        created() {
            this.getRolelist()
        },
        methods:{
            async getRolelist(){
                const res = await this.$http(`roles`)
                this.Rolelist = res.data.data

            },
            async deleRight(rold,rightId){
                const res = await  this.$http.delete(`roles/${rold.id}/rights/${rightId}`)
                rold.children = res.data.data
                // this.getRolelist()

            },
            async showRolelist(role){
                this.currRoleId = role.id
                const res = await this.$http.get(`rights/tree`)
                this.treelist = res.data.data
                let arrtemp1 = []
                this.treelist.forEach(item1 => {
                    arrtemp1.push(item1.id)
                    item1.children.forEach(item2 =>{
                        arrtemp1.push(item2.id)
                        item2.children.forEach(item3 => {
                            arrtemp1.push(item3.id)
                        })
                    })
                })
                this.arrexparnd = arrtemp1
                this.dialogFormVisibleRight = true


                let arrtemp2=[]
                role.children.forEach(item1 => {
                    arrtemp2.push(item1.id)
                    item1.children.forEach(item2 => {
                        arrtemp2.push(item2.id)
                        item2.children.forEach(item3 => {
                            arrtemp2.push(item3.id)
                        })
                    })
                })
                this.arrcheck = arrtemp2
            },
            async setRoleR(){
                let arr1 = this.$refs.tree.getCheckedKeys()
                let arr2 = this.$refs.tree.getHalfCheckedKeys()
                //...展开运算符
                let arr = [...arr1,...arr2]
                const res = await this.$http.post(`roles/${this.currRoleId}/rights`,{rids:arr.join(",")})
                this.getRolelist()
                this.dialogFormVisibleRight = false
            },
            addRoleDialogClosed () {
                this.$refs.addRoleFormRef.resetFields()
            },
            async addRoles () {
                    const { data: res } = await this.$http.post('roles', this.addRoleForm)
                    if (res.meta.status !== 201 || this.addRoleForm=='') {
                        this.$message.error('添加角色失败！')
                        return false
                    }
                    this.$message.success('添加角色成功！')
                    this.AddRoleDialogVisibleL = false
                    this.getRolelist()
            },
            async removeRoleById (id) {
                const confirmResult = await this.$confirm(
                    '此操作将永久删除该角色, 是否继续?',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).catch(err => err)
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除')
                }
                const { data: res } = await this.$http.delete('roles/' + id)
                if (res.meta.status !== 200) return this.$message.error('删除角色失败！')
                this.$message.success('删除用户成功！')
                this.getRolelist()
            },
            async showEditDialog (id) {
                const { data: res } = await this.$http.get('roles/' + id)
                if (res.meta.status !== 200) return this.$message.error('查询角色信息失败！')
                this.editRoleForm = res.data
                this.editRoleDialogVisible = true
            },
            async editRoles () {
                    const { data: res } = await this.$http.put(
                        'roles/' + this.editRoleForm.roleId,
                        {
                            roleName: this.editRoleForm.roleName,
                            roleDesc: this.editRoleForm.roleDesc
                        }
                    )
                    if (res.meta.status !== 200) {
                        this.$message.error('更新角色信息失败！')
                    }
                    this.editRoleDialogVisible = false
                    this.$message.success('更新角色信息成功！')
                    this.getRolelist()
            }
        }
    }
</script>

<style scoped>
  .addrole{
    margin-top: 10px;
  }
</style>
