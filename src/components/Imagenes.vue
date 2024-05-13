<template>
  <div v-for="(image, index) in images" :key="index" style="display: inline-block; width:49%;position:relative">
    <div style="position: absolute; top:5px; left:5px;background: white; font-weight: bold; font-size:8px">
        {{fecha+"/"+page+"  " + image.dni + " - " + image.fecha }}
    </div>
    <img
      :src="
        'https://sistemas.cepreuna.edu.pe/storage/vouchers/' + image.voucher
      "
      alt=""
      width="100%"
      height="375px"
    />
    
    <!-- <pre>{{ images }}</pre> -->
  </div>
</template>
<script>
export default {
    name: "ImagenesComponent",
  props: ['fecha', 'page'],
  data() {
    return {
      datos: [],
      images: [],
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
        const response = await fetch(
          `https://sistemas.cepreuna.edu.pe/api/v1/pagos/grupos/${this.fecha}/${this.page}`,
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
  },
};
</script>
<style scoped>
img {
  border: 1px solid black;
  /* width: 49%; */
  /* height: 375px; */
  object-fit: cover;
  object-position: 50% 35%;
}
</style>
