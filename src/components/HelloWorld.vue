<template>
  <div>
    <canvas ref="canvas" id="canvas" width="500" height="300" style="border: 1px solid #000" @mousedown="startPosition"
      @mouseup="finishedPosition" @mouseleave="finishedPosition" @mousemove="draw" @touchstart="startPosition"
      @touchend="finishedPosition" @touchcancel="finishedPosition" @touchmove="draw"></canvas>

    <img class="show-img" width="250" height="150" style="border: 1px solid" :src="imageSrc" />

    <div class="btn-group">
      <button class="clear" @click="reset">Clear</button>
      <button class="save" @click="saveImage">Save</button>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.initializeCanvas();
  },
  data() {
    return {
      isPainting: false,
      imageSrc: "",
    };
  },
  methods: {
    initializeCanvas() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");

      // 設定線條的相關數值
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
    },
    getPaintPosition(e) {
      const canvasSize = this.$refs.canvas.getBoundingClientRect();

      if (e.type === "mousemove") {
        return {
          x: e.clientX - canvasSize.left,
          y: e.clientY - canvasSize.top,
        };
      } else {
        return {
          x: e.touches[0].clientX - canvasSize.left,
          y: e.touches[0].clientY - canvasSize.top,
        };
      }
    },
    startPosition(e) {
      e.preventDefault();
      this.isPainting = true;
    },
    finishedPosition() {
      this.isPainting = false;
      const ctx = this.$refs.canvas.getContext("2d");
      ctx.beginPath();
    },
    draw(e) {
      if (!this.isPainting) return;
      const ctx = this.$refs.canvas.getContext("2d");
      const paintPosition = this.getPaintPosition(e);
      ctx.lineTo(paintPosition.x, paintPosition.y);
      ctx.stroke();
    },
    reset() {
      const ctx = this.$refs.canvas.getContext("2d");
      ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
    },
    saveImage() {
      const canvas = this.$refs.canvas;


      // 圖片儲存的類型選擇 png ，並將值放入 img 的 src
      const newImg = canvas.toDataURL("image/png");
      this.imageSrc = newImg;
      localStorage.setItem('img', newImg)
    },
  },
};
</script>
