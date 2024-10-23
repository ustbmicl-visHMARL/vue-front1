<template>
  <div class="container-list maxWH clearfix">
    <!-- 搜索 -->
    <div class="search">
      <el-form
        ref="searchForm"
        class="flex maxWH search-form"
        :model="searchForm"
        label-width="80px"
      >
        <el-select v-model="searchForm.querySearch" clearable placeholder="请选择搜索类型">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-form-item label="" prop="key">
          <el-input v-model.trim="searchForm.key" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item class="flex" style="margin-left: -70px; overflow: hidden">
          <el-button type="primary" @click.prevent.stop="search">搜索</el-button>
          <el-button @click.prevent.stop="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 添加 -->
    <el-button type="primary" @click.prevent.stop="handleContainerAddClick" style="margin: 15px 0"
      >添加容器</el-button
    >

    <el-button type="success" style="margin-left: 10px" @click="toDocument"> 查看文档 </el-button>

    <!-- 列表显示容器 -->
    <el-table :data="containerlist" border style="width: 100%" max-height="1000">
      <el-table-column prop="name" label="容器名" show-overflow-tooltip />
      <el-table-column prop="ports" label="端口" show-overflow-tooltip>
        <template #default="{ row }">
          <span>{{ row.ports.join(', ') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" show-overflow-tooltip />
      <el-table-column prop="nickName" label="昵称" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" show-overflow-tooltip>
        <template #default="{ row }">
          <p v-if="row.status === 0">创建</p>
          <p v-else-if="row.status === 1">启动</p>
          <p v-else-if="row.status === 2">关闭</p>
          <p v-else>未知状态</p>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip />
      <el-table-column label="操作" header-align="center" align="center" width="400">
        <template v-slot="scope">
          <div class="handler">
            <el-button @click.prevent="startContainer(scope.$index, containerlist)">
              启动
            </el-button>
            <el-button @click.prevent="openContainer(scope.$index, containerlist)" type="info">
              打开
            </el-button>
            <el-button @click.prevent="stopcontainer(scope.$index, containerlist)" type="danger">
              关闭
            </el-button>
            <el-button @click.prevent="delcontainer(scope.$index, containerlist)" type="danger">
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="page_sizes"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="container_count"
      style="padding: 10px 0"
    />
    <!-- 添加容器 -->
    <el-dialog title="添加容器" v-model:visible="containerAddDialog">
      <el-form ref="containerAddForm" :model="containerAddForm" label-width="120px" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input
            v-model.trim="containerAddForm.name"
            autocomplete="off"
            placeholder="请输入容器名称"
          />
        </el-form-item>
        <el-form-item label="选择添加的用户" prop="user">
          <el-select v-model="containerAddForm.userid" clearable placeholder="用户名">
            <el-option
              v-for="item in userlist"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择镜像" prop="image">
          <el-select v-model="containerAddForm.imageid" clearable placeholder="镜像">
            <el-option
              v-for="item in imagelist"
              :key="item.id"
              :label="item.version"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="端口映射">
          <div v-for="(item, index) in containerAddForm.ports" :key="index" class="port-mapping">
            <el-input
              v-model="item.external"
              placeholder="外部端口"
              style="width: 100px"
              type="number"
            />
            <span>:</span>
            <el-input
              v-model="item.internal"
              placeholder="内部端口"
              style="width: 100px"
              type="number"
            />
            <el-button v-if="index !== 0" @click="removePortMapping(index)" type="danger"
              >删除</el-button
            >
          </div>
          <el-button @click="addPortMapping" type="primary">添加端口映射</el-button>
        </el-form-item>
        <el-form-item label="额外配置" prop="extraConfig">
          <el-input
            type="textarea"
            v-model="containerAddForm.extraConfig"
            placeholder="请输入额外配置参数"
          />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer" align="center">
          <el-button type="primary" @click.prevent.stop="addcontainer('containerAddForm')"
            >确 定</el-button
          >
          <el-button @click.prevent.stop="resetForm('containerAddForm')">重 置</el-button>
        </div>
      </template>
    </el-dialog>
    <!--容器界面-->
    <el-dialog title="容器界面" v-model:visible="containerDialog" width="80%" height="100%">
      <iframe
        :src="docker_url_vue + ':' + startport"
        frameborder="0"
        width="100%"
        height="600px"
      ></iframe>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="containerDialog = false">关 闭</el-button>
          <el-button type="primary" @click.prevent.stop="UploadFile">上传文件</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
const docker_url = '127.0.0.1'
export default {
  name: 'containerList',
  data() {
    const port = ''
    const startport = 0
    const docker_url_vue = docker_url
    const options = [
      {
        value: 'name',
        label: '容器名'
      },
      {
        value: 'status',
        label: '容器状态'
      },
      {
        value: 'version_id',
        label: '版本'
      },
      {
        value: 'user_id',
        label: '用户id'
      }
    ]
    const validataTitle = (rule, value, callback) => {
      const reg = /^[a-zA-Z][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]$/
      if (value.trim().length <= 0) {
        callback(new Error('请输入容器名称'))
      } else if (!reg.test(value.trim())) {
        callback(new Error('容器名称由63位以内的数字、字母或连字符组成'))
      } else {
        callback()
      }
    }

    const validataPort = (rule, value, callback) => {
      const reg = /^[0-9]{4,5}$/
      if (value.trim().length <= 0) {
        callback(new Error('请输入端口号'))
      } else if (!reg.test(value.trim())) {
        callback(new Error('端口号由4到5位的数字组成'))
      } else {
        callback()
      }
    }

    // const validataDetail = (rule, value, callback) => {
    //     const reg = /^[0-9A-Za-z\u4e00-\u9fa5,!.*&^%#+=-_:;。，！…. ：；，「」——~、\s@]{15,100}$/
    //     if (value.trim().length <= 0) {
    //         callback(new Error('请输入容器详情'))
    //     } else if (!reg.test(value.trim())) {
    //         callback(new Error('容器详情由15到100位的数字、字母、汉字或部分符号组成'))
    //     } else {
    //         callback()
    //     }
    // }
    return {
      options,
      port,
      docker_url_vue,
      startport, //启动端口号
      // 表单验证规则
      rules: {
        name: [{ required: true, trigger: ['blur', 'change'], validator: validataTitle }]
        // container_detail: [{ required: true, trigger: 'blur', validator: validataDetail }],
        // ports: [{ required: true, trigger: 'blur', validator: validataPort }],
      },
      // 搜索容器列表的表单
      searchForm: {
        querySearch: '',
        key: ''
      },
      containerAddDialog: false, // 添加新容器的表单
      containerDialog: false, // 容器的表单
      page: 1, // 当前页
      limit: 8, // 初始化每页条目数
      page_sizes: [8, 16, 30, 50, 100], // 个数选择器
      // 添加容器的表单
      containerAddForm: {
        name: 'zhangsan',
        userid: '1',
        imageid: 0,
        ports: [{ external: '11', internal: '111' }],
        extraConfig: ''
      },
      user_id: '1',
      userlist: [],
      imagelist: [],
      containerlist: [],
      container_count: 0
    }
  },
  mounted() {
    this.getcontainerList()
  },
  methods: {
    // 处理添加容器表单被点击后
    async handleContainerAddClick() {
      // await this.$store.dispatch(
      //   'getimageList',
      //   JSON.stringify({ querySearch: '', value: '', page: null, limit: null })
      // )
      // await this.$store.dispatch(
      //   'getUserList',
      //   JSON.stringify({ querySearch: '', value: '', page: null, limit: null })
      // )
      console.log('你点击了添加容器按钮', this.containerAddDialog)
      this.containerAddDialog = true
    },
    // 重置表单
    resetForm(formname) {
      this.$refs[formname].resetFields()
    },
    // 打开文档链接
    toDocument() {
      window.open('https://www.yuque.com/xucheng-iq3fa/rltyby/nnneskleg2avp7i3?singleDoc#')
    },
    // 启动容器
    startContainer(index, rows) {
      const params = { id: rows[index].id, cmd: 'start' }

      this.startport = this.containerlist[index].ports[0]
      //this.startport = 8888

      console.log(this.startport)
      try {
        this.$store
          .dispatch('startcontainer', JSON.stringify(params))
          .then((res) => {
            this.$message({ type: 'success', message: res })
            // 重新获取容器列表
            this.getcontainerList()
          })
          .catch((err) => this.$message({ type: 'warning', message: err.message }))
      } catch (e) {
        this.$message({ type: 'warning', message: e.message })
      }
    },

    // 关闭容器
    // stopContainer(index, rows) {
    //     const params = { id: rows[index].id, cmd: 'start' }
    //     try {
    //         this.$store.dispatch('startcontainer', JSON.stringify(params))
    //             .then(res => {
    //                 this.resetForm(formname)
    //                 this.$message({ type: 'success', message: res })
    //                 // 重新获取容器列表
    //                 this.getcontainerList()
    //             }).catch(err => this.$message({ type: 'warning', message: err.message }))
    //     } catch (e) {
    //         this.$message({ type: 'warning', message: e.message })
    //     }
    // },

    // 搜索
    search() {
      this.page = 1
      this.limit = this.page_sizes[0]
      this.getcontainerList()
    },
    // 每页多少条目
    handleSizeChange(val) {
      this.limit = val
      this.page = 1
      this.getcontainerList()
    },
    // 当前第几页
    handleCurrentChange(val) {
      this.page = val
      this.getcontainerList()
    },
    addPort() {
      if (this.port) {
        this.containerAddForm.ports.push(this.port)
        this.port = ''
      }
    },
    removePort(index) {
      this.containerAddForm.ports.splice(index, 1)
    },
    // 添加容器
    async addcontainer(formname) {
      console.log('add', formname)
      await this.$refs[formname].validate(async (vaild) => {
        if (vaild) {
          console.log('start')
          try {
            await this.$store
              .dispatch('addcontainer', JSON.stringify(this.containerAddForm))
              .then((res) => {
                this.resetForm(formname)
                this.containerAddDialog = false
                this.$message({ type: 'success', message: res })
                // 重新获取容器列表
                this.getcontainerList()
              })
              .catch((err) => this.$message({ type: 'warning', message: err.message }))
          } catch (e) {
            this.$message({ type: 'warning', message: e.message })
          }
        }
      })
    },
    // 获取容器列表
    async getcontainerList() {
      try {
        const { page, limit } = this
        const querySearch = this.searchForm.querySearch
        const value = this.searchForm.key

        await this.$store.dispatch(
          'getcontainerList',
          JSON.stringify({ querySearch, value, page, limit })
        )
      } catch (e) {
        this.$message({ type: 'warning', message: e.message })
      }
    },
    // 关闭容器
    async stopcontainer(index, rows) {
      const title = rows[index].name
      const params = { id: rows[index].id }
      await this.$confirm(`是否关闭容器 [ ${title} ] ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            await this.$store
              .dispatch('stopcontainer', JSON.stringify(params))
              .then((res) => {
                this.$message({ type: 'success', message: res })
                // 重新获取容器列表
                this.getcontainerList()
              })
              .catch((err) => this.$message({ type: 'warning', message: err.message }))
          } catch (e) {
            this.$message({ type: 'warning', message: e.message })
          }
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消' })
        })
    },
    // 打开容器
    openContainer(index, containerlist) {
      const container = containerlist[index]
      const url = `${this.docker_url_vue}:${container.ports[0]}`
      window.open(url, '_blank')
    },

    // 删除容器
    async delcontainer(index, rows) {
      const title = rows[index].name
      const params = { id: rows[index].id }
      if (rows[index].status != 2) {
        return this.$message({ type: 'warning', message: '请先关闭容器' })
      }
      await this.$confirm(`是否删除容器 [ ${title} ] ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            await this.$store
              .dispatch('delcontainer', JSON.stringify(params))
              .then((res) => {
                this.$message({ type: 'success', message: res })
                // 重新获取容器列表
                this.getcontainerList()
              })
              .catch((err) => this.$message({ type: 'warning', message: err.message }))
          } catch (e) {
            this.$message({ type: 'warning', message: e.message })
          }
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消' })
        })
    },

    addPortMapping() {
      this.containerAddForm.ports.push({ external: '', internal: '' })
    },
    removePortMapping(index) {
      if (this.containerAddForm.ports.length > 1) {
        this.containerAddForm.ports.splice(index, 1)
      } else {
        this.$message.error('必须至少保留一个端口映射。')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container-list {
  .search {
    width: 100%;
    height: 80px;
    box-sizing: border-box;
    border: 1px solid rgb(220, 220, 220);
    padding-top: 15px;
    overflow: hidden;

    .search-form {
      min-width: 400px;
      justify-content: center;
    }
  }
}
</style>
