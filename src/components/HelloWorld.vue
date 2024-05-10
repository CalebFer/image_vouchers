<template>
  <div class="hello">
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Imagenes</h5>
            <p class="card-text">total de paginas:{{ datos.total_pages }}</p>
            <p class="card-text">total de imagenes: {{ datos.total_count }}</p>
            <!-- //crea un boton para descargar las imagenes con su icono de imagen -->
            <a href="#" class="btn btn-primary">
              <i class="fas fa-download"></i> Ir a descargar</a
            >
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">PDF's</h5>
            <p class="card-text">
              total de paginas:{{ datos.total_pages_pdf }}
            </p>
            <p class="card-text">total de pdf's: {{ datos.total_count_pdf }}</p>
            <!-- //crea un boton para descargar los pdf's con su icono de pdf -->
            <a href="#" class="btn btn-danger">
              <i class="fas fa-file-pdf"></i> Ir a descargar</a
            >
          </div>
        </div>
      </div>
    </div>
    <img :src="'https://sistemas.cepreuna.edu.pe/storage/vouchers/' + images[4]?.voucher" alt="">
    <pre>{{ images[2]?.voucher }}</pre>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      datos: [],
      images: [],
      pdfs: [],
      totalImages: 0,
      totalPdfs: 0,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await fetch(
          "https://sistemas.cepreuna.edu.pe/api/v1/pagos/grupos/2024-02-01/1",
          {
            headers: {
              Authorization: "cepreuna_v1_api",
            },
          }
        );
        const data = await response.json();
        console.log("Data fetched:", data);
        this.datos = data;
        this.images = data.results;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    getImageCount() {},
    getPdfCount() {
      // logic to get the total number of pdfs
      // return the count
    },
  },
};
</script>
