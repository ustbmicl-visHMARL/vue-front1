<template>
  <ContentWrap :title="t('lidaDemo.title')" :message="t('lidaDemo.message')">
    <iframe src="http://127.0.0.1:8088/demo" frameborder="0"></iframe>
  </ContentWrap>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()
</script>
