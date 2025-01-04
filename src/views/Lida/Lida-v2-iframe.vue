<template>
  <ContentWrap :title="t('lidaDemo.title')" :message="t('lidaDemo.message')">
    <iframe
      src="http://127.0.0.1:8088/demo"
      frameborder="0"
      style="width: 100%; height: 600px"
    ></iframe>
  </ContentWrap>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()
</script>
<style>
iframe {
  width: 100%;
}
</style>
