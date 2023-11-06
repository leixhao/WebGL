<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <svg-icon class-name="international-icon" icon-class="language" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :disabled="language === 'zh'" command="zh">
          简体中文
        </el-dropdown-item>
        <el-dropdown-item :disabled="language === 'en'" command="en">
          ENGLISH
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup name="LangSelect">
import useAppStore from '@/store/modules/app'
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus'
import { toRefs } from 'vue'

const appStore = useAppStore();
const { language }  = toRefs(appStore)

const { t, locale } = useI18n();

const handleSetLanguage = (lang) => {
  locale.value = lang;
  appStore.setLanguage(lang)

  ElMessage({
    message: t('app.langchanged'), //'设置语言成功',
    type: 'success'
  })
}

</script>

<style lang="scss" scoped>
.international {
  font-size: 14px !important;
  cursor: pointer;

  .international-icon {
    vertical-align: -4px;
    margin: 0px 0 0px 2px;
  }

  .lanTitle {
    line-height: 12px;
    margin: 12px 0 0 8px;
  }
}
</style>