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
          {{ progress.toFixed(2) + "%" }}
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
  try {
    // Actualizar la barra de progreso
    this.progress = ((i + 1) / this.images.length) * 100;

    // Obtener el PDF
    const response = await axios.get(`/proxy/${this.images[i].voucher}`, {
      responseType: "arraybuffer",
    });

    const pdfBytes = response.data;

    // Verificar si el archivo es un PDF válido
    const header = new TextDecoder("utf-8").decode(pdfBytes.slice(0, 8));
    if (!header.startsWith("%PDF-")) {
      console.error(`El archivo ${i + 1} no es un PDF válido. Se omitirá.`);
      continue; // Omitir este archivo y continuar con el siguiente
    }

    // Cargar el PDF
    const loadedPdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

    // Agregar texto a la primera página
    const pages = loadedPdf.getPages();
    const firstPage = pages[0];
    firstPage.drawText(
      `${this.fecha}/${this.page}------${this.images[i].nro_documento}-------Fecha_pago: ${this.images[i].fecha} - (${this.images[i].secuencia}) - ${this.images[i].monto}`,
      { x: 5, y: 5, size: 12 }
    );

    // Copiar páginas al PDF combinado
    for (let j = 0; j < loadedPdf.getPageCount(); j++) {
      const [copiedPage] = await pdfDoc.copyPages(loadedPdf, [j]);
      pdfDoc.addPage(copiedPage);
    }
  } catch (error) {
    console.error(`Error procesando el PDF ${i + 1}:`, error);
    continue; // Omitir este archivo y continuar con el siguiente
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
