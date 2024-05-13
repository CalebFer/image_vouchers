<template>
  <div>
    <!-- <img
      v-for="(image, index) in images"
      :key="index"
      :src="
        'https://sistemas.cepreuna.edu.pe/storage/vouchers/' + image.voucher
      "
      alt=""
    /> --> 
    <div class="text-center">
      <button @click="combinarpdf" class="btn btn-dark my-2">
        Combinar pdf's
      </button>
      <div class="progress-bar-container mx-auto">
        <div class="progress-bar" :style="{ width: progress + '%' }">
          {{ progress + 1.25 + "%" }}
        </div>
      </div>
    </div>
    <!-- <h4 >{{ images[0]?.dni }}</h4> -->
    <embed
      v-for="(pdf, index) in images"
      :key="index"
      :src="'https://sistemas.cepreuna.edu.pe/storage/vouchers/' + pdf.voucher"
      type="application/pdf"
      width="100%"
      height="375px"
    />
    <!-- quiero combinar todos los pdf que estan en la ruta https://sistemas.cepreuna.edu.pe/api/v1/pagos/grupos/${this.fecha}/${this.page} -->
  </div>
</template>
<script>
/* global axios */
import { PDFDocument } from "pdf-lib";
export default {
  name: "ImagenesComponent",
  props: ["fecha", "page"],
  data() {
    return {
      datos: [],
      images: [],
      num_dni: [],
      progress: 0,
      //fecha: "2024-02-01",
      //page: 1,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get(
          `https://sistemas.cepreuna.edu.pe/api/v1/pagos/grupos/${this.fecha}/${this.page}`,
          {
            headers: {
              Authorization: "cepreuna_v1_api",
            },
          }
        );
        const data = response.data;
        // console.log("Data fetched:", data);
        this.datos = data;
        this.images = data.results_pdf;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    // quiero combinar todos los pdf que estan en la ruta https://sistemas.cepreuna.edu.pe/api/v1/pagos/grupos/${this.fecha}/${this.page}
    async combinarpdf() {
      // combinar todos los pdf que estan en la ruta https://sistemas.cepreuna.edu.pe/api/v1/pagos/grupos/${this.fecha}/${this.page} con la libreria pdf-lib
      const pdfDoc = await PDFDocument.create();

      // loop through the pdfs
      for (let i = 0; i < this.images.length; i++) {
        // update the progress bar
        this.progress = (i / this.images.length) * 100;
        // fetch the pdf
        const pdfBytes = await axios
          .get(`/proxy/${this.images[i].voucher}`, {
            responseType: "arraybuffer",
          })
          .then((res) => res.data);
        // load the pdf
        const loadedPdf = await PDFDocument.load(pdfBytes);
        const pages = loadedPdf.getPages();
        const firstPage = pages[0];
        // const { PDFPageDrawTextOptions } = require('pdf-lib');
        firstPage.drawText(
          `${this.fecha}/${this.page}------${this.images[i].nro_documento}-------Fecha_pago: ${this.images[i].fecha} - (${this.images[i].secuencia}) - ${this.images[i].monto}`,
          { x: 5, y: 5, size: 12 }
        );
        // loop through the pages
        for (let j = 0; j < loadedPdf.getPageCount(); j++) {
          // add the page to the combined pdf
          const [copiedPage] = await pdfDoc.copyPages(loadedPdf, [j]);
          pdfDoc.addPage(copiedPage);
        }
      }
      //descargar en una nueva ruta el pdf
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "combined.pdf";
      link.click();

      // return the combined pdf

      console.log("pdfDoc", pdfDoc);
      return pdfDoc;
    },
  },
};
</script>
<style scoped>
.progress-bar-container {
  width: 50%;
  height: 20px;
  background-color: #eee;
}

.progress-bar {
  height: 100%;
  background-color: #6699cc;
}
</style>
