<template>
  <div class="app-container">
    <div class="contnet" ref="box">
      <div class="left">
        <!-- 侧边栏内容 -->
        <div class="resize"></div>
      </div>
      <div class="right">
        <!-- 主体内容 -->
      </div>
    </div>
  </div>
</template>
<<<<<<< HEAD
<script setup lang="ts">
import { ref } from 'vue';
const list=ref({
  id:null
})
console.log(list.value?.id)
</script>
=======

<script setup>
import { ref, onMounted } from "vue";
function dragControllerDiv() {
  let resize = document.getElementsByClassName("resize");
  let boxDom = document.getElementsByClassName("contnet");
  let leftDom = document.getElementsByClassName("left");
  let rightDom = document.getElementsByClassName("right");
  for (let i = 0; i < resize.length; i++) {
    resize[i].onmousedown = function (e) {
      //颜色改变提醒
      resize[i].style.background = "#818181";
      var startX = e.clientX;
      resize[i].left = resize[i].offsetLeft;
      // 鼠标拖动事件
      document.onmousemove = function (e) {
        var endX = e.clientX;
        let moveLen = resize[i].left + (endX - startX);
        /* 左边最小值 */
        if (moveLen < boxDom[i].clientWidth * .4 ) moveLen = boxDom[i].clientWidth * .4; // 左边区域的最小宽度为页面宽度40%
        /* 左边最大值 */
        let leftMaxWith = boxDom[i].clientWidth * .6; // 页面的百分之60
        if (moveLen > leftMaxWith) moveLen = leftMaxWith;
        resize[i].style.left = moveLen; // 设置左侧区域的宽度
        leftDom[i].style.width = moveLen + "px";
        rightDom[i].style.width = boxDom[i].clientWidth - moveLen - 24 + "px";
      };
      document.onmouseup = function (evt) {
        resize[i].style.background = "#d6d6d6";
        document.onmousemove = null;
        document.onmouseup = null;
        resize[i].releaseCapture && resize[i].releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
      };
      resize[i].setCapture && resize[i].setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
      return false;
    };
  }
}
onMounted(() => {
  dragControllerDiv();
});
</script>

<style lang="scss" scoped>
.contnet {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;

  .left {
    position: relative;
    width: 49%;
    height: 490px;
    border: 1px solid #ccc;

    .resize {
      cursor: col-resize;
      position: absolute;
      top: 50%;
      right: -12px;
      background-color: #d6d6d6;
      border-radius: 0 4px 4px 0;
      width: 12px;
      height: 80px;
      transform: translateY(-50%);
    }
  }

  .right {
    width: 49%;
    height: 100%;
    border: 1px solid #ccc;
  }
}</style>
>>>>>>> 7dcf7170b5b12e2821f98faa30c7a5b76d246267
