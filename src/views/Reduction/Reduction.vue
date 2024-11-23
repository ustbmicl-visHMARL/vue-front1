<template>
  <div class="reduction">
    <ContentWrap :title="t('router.reduction')">
      <ElSkeleton :loading="loading" animated />
      <iframe
        id="myIframe"
        src="http://127.0.0.1:8282/iframe.html?scenario=2"
        frameborder="0"
      ></iframe>
    </ContentWrap>
  </div>
</template>

<script setup lang="tsx">
import { ElSkeleton } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { onMounted, ref } from 'vue'

const { t } = useI18n()

const loading = ref(true)
onMounted(() => {
  const iframe = document.getElementById('myIframe') as HTMLIFrameElement
  const iframeOnload = function () {
    console.log('iframeOnload')
    loading.value = false
  }
  iframe.addEventListener('load', iframeOnload)
  window.addEventListener('message', function (event) {
    if (event.origin === 'http://127.0.0.1:8282') {
      console.log('@@@@', event.data)
    }
  })
})
</script>

<style>
.reduction {
  height: 100%;
}
.reduction .el-card {
  height: 100%;
}
.reduction .el-card .el-card__body {
  height: 90%;
}
.reduction .el-card .el-card__body > div {
  height: 100%;
}
.reduction iframe {
  height: 100%;
  width: 100%;
}
</style>
