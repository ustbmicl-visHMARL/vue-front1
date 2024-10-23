<script setup lang="tsx">
import { ElButton, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const start = () => {
  router.push('/lida/index')
  ElMessage({
    message: '跳转成功',
    type: 'success'
  })
}
</script>

<template>
  <div class="welcome">
    <h1>算法实验管理展示系统</h1>
    <p>欢迎使用算法实验管理展示系统。你可以在左侧导航新建算法实验。</p>
    <p>lida可视化功能可以在左侧导航或点击下方按钮进入，祝你使用愉快！</p>
    <ElButton type="primary" @click="start">开始使用lida</ElButton>
  </div>
</template>

<style scoped>
.welcome {
  text-align: center;
  margin-top: 50px;
}

h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  font-weight: bold;
  margin-bottom: 20px;
}

p {
  font-size: 1.1rem;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 20px;
}
</style>
