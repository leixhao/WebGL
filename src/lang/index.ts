import { createI18n } from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-plus/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-plus/lib/locale/lang/zh-cn' // element-ui lang
import enLocale from './en'
import zhLocale from './zh'



const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  }
}

const i18n = createI18n({
  // 设置语言 选项 en | zh
  locale: Cookies.get('language') || 'en',
  // 设置文本内容
  messages,
  legacy: false,
  silentTranslationWarn: true
})

export default i18n
