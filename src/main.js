import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HelloWorld from './components/HelloWorld.vue'
import Imagenes from './components/Imagenes.vue'
import Pdfs from './components/Pdfs.vue'

// Importa los componentes para las rutas
// import Home from './components/Home.vue'
// import About from './components/About.vue'

// Define las rutas
const routes = [
    { path: '/', component: HelloWorld },
    { 
        path: '/imagenes/:fecha/:page', 
        component: Imagenes,
        props: true
    },
    { path: '/pdf/:fecha/:page', component: Pdfs, props: true },
]

// Crea el enrutador
const router = createRouter({
  history: createWebHistory(),
  routes, // short for `routes: routes`
})

// Crea la aplicación
const app = createApp(App)

// Usa el enrutador
app.use(router)

// Monta la aplicación
app.mount('#app')