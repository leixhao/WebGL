<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <svg-icon class-name="international-icon" icon-class="language" />
      <span class="lanTitle">{{ userStore.data }}</span>
    </div>
    <el-dropdown-menu>
      <template #dropdown>
        <el-dropdown-item :disabled="userStore.language === 'zh_CN'" command="zh_CN">
          简体中文
        </el-dropdown-item>
        <el-dropdown-item :disabled="userStore.language === 'en_US'" command="en_US">
          ENGLISH
        </el-dropdown-item>
      </template>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script setup name="LangSelect">
import useUserStore from '@/store/modules/user'
const userStore = useUserStore();

const handleSetLanguage = (lang) => {
  this.$i18n.locale = lang
  userStore().setTranslate(lang)
  this.$message({
    message: this.$t('app.langchanged'), //'设置语言成功',
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
    margin: 10px 0 0 22px;
  }

  .lanTitle {
    line-height: 12px;
    margin: 12px 0 0 8px;
  }
}
</style>