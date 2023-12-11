import useUserStore from '@/store/modules/user';
import { Base64 } from 'js-base64'
// 文件url预览
function reviewByUrl(url: string, callback: any) {
  const useStore = useUserStore();
  console.log(useStore)
  let src =
    //10.201.129.12:8012/
    `${import.meta.env.VITE_APP_BASE_PRE}/onlinePreview?url=` +
    encodeURIComponent(Base64.encode(url)) +
    "&watermarkTxt=" +
    encodeURIComponent(
      Base64.encode(useStore.nameT + `(${useStore.name})`)
    ) +
    "&t=" +
    encodeURIComponent(Base64.encode(new Date().getTime().toString()));
  if (callback) {
    return src;
  } else {
    window.open(src);
  }
  // fileviewToken({ url: url }).then((res) => {
  //   let src =
  //     //10.201.129.12:8012/
  //     `${process.env.VUE_APP_BASE_API}/fileview/onlinePreviewV2?url=` +
  //     encodeURIComponent(Base64.encode(url)) +
  //     "&watermarkTxt=" +
  //     encodeURIComponent(
  //       Base64.encode(store.state.user.nameT + `(${store.state.user.name})`)
  //     ) +
  //     "&token=" +
  //     encodeURIComponent(Base64.encode(res.data));
  //   if (callback) {
  //     return src;
  //   } else {
  //     window.open(src);
  //   }
  // });
}


export default {
  reviewByUrl
}