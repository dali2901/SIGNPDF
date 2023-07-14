<template>
    <div>
        <input type="file" accept="application/pdf" placeholder="選擇PDF檔案" @change="handleFileUpload" />
        <canvas ref="canvas" id="canvas" style="border: 1px solid #000"></canvas>
        <p>選擇簽名</p>
        <img class="sign" style="border: 1px solid #000" width="250" height="150" :src="imageSrc" @click="addSignature" />
        <button class="download" @click="downloadPDF">download PDF</button>
    </div>
</template>
  
<script>
// import fabric from "fabric";
import fabric from "fabric";
import pdfjsLib from "pdfjs";
import jsPDF from "jspdf";

export default {
    mounted() {

        this.canvas = new fabric.Canvas(this.$refs.canvas);
        this.canvas.renderAll();

    },
    data() {
        return {
            imageSrc: localStorage.getItem("img"),
            canvas: null
        };
    },
    methods: {
        async handleFileUpload(e) {

            if (!this.canvas) return;

            this.canvas.renderAll();
            const pdfData = await this.printPDF(e.target.files[0]);
            const pdfImage = await this.pdfToImage(pdfData);

            // 透過比例設定 canvas 尺寸
            this.canvas.setWidth(pdfImage.width / window.devicePixelRatio);
            this.canvas.setHeight(pdfImage.height / window.devicePixelRatio);

            // 將 PDF 畫面設定為背景
            this.canvas.setBackgroundImage(pdfImage, this.canvas.renderAll.bind(this.canvas));
        },
        async printPDF(pdfData) {
            const Base64Prefix = "data:application/pdf;base64,";

            // 將檔案處理成 base64
            pdfData = await this.readBlob(pdfData);

            // 將 base64 中的前綴刪去，並進行解碼
            const data = atob(pdfData.substring(Base64Prefix.length));

            // 利用解碼的檔案，載入 PDF 檔及第一頁
            const pdfDoc = await pdfjsLib.getDocument({ data }).promise;
            const pdfPage = await pdfDoc.getPage(1);

            // 設定尺寸及產生 canvas
            const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            // 設定 PDF 所要顯示的寬高及渲染
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            const renderContext = {
                canvasContext: context,
                viewport,
            };
            const renderTask = pdfPage.renderAll(renderContext);

            // 回傳做好的 PDF canvas
            return renderTask.promise.then(() => canvas);
        },
        async pdfToImage(pdfData) {
            // 設定 PDF 轉為圖片時的比例
            const scale = 1 / window.devicePixelRatio;

            // 回傳圖片
            return new fabric.Image(pdfData, {
                id: "renderPDF",
                scaleX: scale,
                scaleY: scale,
            });
        },
        readBlob(blob) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.addEventListener("load", () => resolve(reader.result));
                reader.addEventListener("error", reject);
                reader.readAsDataURL(blob);
            });
        },
        addSignature() {
            const sign = document.querySelector(".sign");
            if (!sign.src) return;
            fabric.Image.fromURL(sign.src, function (image) {
                image.set({
                    top: 400,
                    scaleX: 0.5,
                    scaleY: 0.5,
                });
                this.canvas.add(image);

            }.bind(this));
        },
        downloadPDF() {
            const pdf = new jsPDF();

            // 將 canvas 存為圖片
            const canvas = this.$refs.canvas;
            const image = canvas.toDataURL("image/png");

            // 設定背景在 PDF 中的位置及大小
            const width = pdf.internal.pageSize.width;
            const height = pdf.internal.pageSize.height;
            pdf.addImage(image, "png", 0, 0, width, height);

            // 將檔案取名並下載
            pdf.save("download.pdf");
        },
    },

};
</script>