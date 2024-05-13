<template>
  <div class="hello text-center">
    <h1>Imagenes y Pdf's</h1>
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Imagenes</h5>
            <p class="card-text">total de paginas:{{ datos.total_pages }}</p>
            <p class="card-text">total de imagenes: {{ datos.total_count }}</p>
            <!-- //crea un boton para descargar las imagenes con su icono de imagen -->
            <router-link to="/imagenes/2024-02-01/01" class="btn btn-primary">
              <i class="fas fa-download"></i> Ir a imagenes</router-link
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
            <router-link to="/pdf/2024-02-01/01" class="btn btn-danger">
              <i class="fas fa-file-pdf"></i> Ir a pdf's</router-link
            >
          </div>
        </div>
      </div>
    </div>
    <div style="position:relative">
      <div style="position: absolute; top:5px; left:5px;background: white; font-weight: bold">
        <div>hola</div>
      </div>
      <img
        :src="
          'https://sistemas.cepreuna.edu.pe/storage/vouchers/' +
          images[4]?.voucher
        "
        alt=""
      />
    </div>
    <!-- <embed :src="'https://sistemas.cepreuna.edu.pe/storage/vouchers/' + pdfs[11]?.voucher" type="application/pdf" width="100%" height="375px" /> -->
    <!-- <pre>{{ images[2]?.voucher }}</pre> -->
    <!-- <pre>{{ pdf[2]?.voucher }}</pre> -->
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
        // console.log("Data fetched:", data);
        this.datos = data;
        this.images = data.results;
        this.pdfs = data.results_pdf;
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
