<template>
  <q-page class="home-page bg-grey-1">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 ref="heroTitle" class="hero-title text-primary">By Sales</h1>
        <p ref="heroSubtitle" class="hero-subtitle">Uma nova forma de comprar</p>
        <div ref="heroButtons" class="hero-buttons">
          <q-btn 
            color="primary" 
            size="lg" 
            label="Explorar Produtos" 
            unelevated 
            @click="$router.push('/produtos')"
            class="hero-btn"
          />
          <q-btn 
            color="secondary" 
            size="lg" 
            label="Sobre Nós" 
            outline 
            @click="$router.push('/sobre')"
            class="hero-btn"
          />
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section q-pa-xl">
      <div class="text-center q-mb-xl">
        <h2 class="text-h3 text-primary q-mb-md">Por que escolher By Sales?</h2>
        <p class="text-h6 text-grey-7">Oferecemos a melhor experiência de compra online</p>
      </div>
      
      <div class="row q-gutter-lg justify-center">
        <div class="col-12 col-md-3 feature-item" v-for="feature in features" :key="feature.title">
          <q-card class="feature-card text-center shadow-2 hover-gradient-1">
            <q-card-section class="bg-white">
              <q-icon :name="feature.icon" size="4rem" color="primary" class="q-mb-md" />
              <div class="text-h6 text-primary q-mb-sm">{{ feature.title }}</div>
              <p class="text-grey-7">{{ feature.description }}</p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories-section q-pa-xl bg-white">
      <div class="text-center q-mb-xl">
        <h2 class="text-h3 text-primary q-mb-md">Categorias Populares</h2>
      </div>
      
      <div class="row q-gutter-md justify-center">
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 category-item" v-for="category in categories" :key="category.name">
          <q-card class="category-card shadow-2 hover-gradient-1 cursor-pointer" @click="navigateToCategory(category.route)">
            <q-img :src="category.image" class="category-image" />
            <q-card-section class="text-center">
              <div class="text-h6 text-primary">{{ category.name }}</div>
              <div class="text-caption text-grey-6">{{ category.count }} produtos</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section q-pa-xl">
      <q-card ref="ctaCard" class="cta-card shadow-2">
        <q-card-section class="text-center q-pa-xl bg-primary text-white">
          <h3 class="text-h4 q-mb-md">Pronto para começar?</h3>
          <p class="text-h6 q-mb-lg">Cadastre-se agora e aproveite ofertas exclusivas</p>
          <div class="cta-buttons">
            <q-btn 
              color="white" 
              text-color="primary" 
              size="lg" 
              label="Criar Conta" 
              unelevated 
              @click="$router.push('/cadastro')"
              class="q-mr-md"
            />
            <q-btn 
              color="transparent" 
              text-color="white" 
              size="lg" 
              label="Fazer Login" 
              outline 
              @click="$router.push('/login')"
            />
          </div>
        </q-card-section>
      </q-card>
    </section>

    <!-- Quick Actions -->
    <section class="quick-actions q-pa-md">
      <div class="row q-gutter-md justify-center">
        <q-btn 
          v-for="action in quickActions" 
          :key="action.label"
          :color="action.color" 
          :icon="action.icon" 
          :label="action.label" 
          size="md"
          unelevated 
          @click="$router.push(action.route)"
          class="quick-action-btn"
        />
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { gsap } from 'gsap';

const router = useRouter();

const heroTitle = ref();
const heroSubtitle = ref();
const heroButtons = ref();
const ctaCard = ref();

const features = ref([
  {
    title: 'Entrega Rápida',
    description: 'Receba seus produtos em até 24h',
    icon: 'local_shipping'
  },
  {
    title: 'Pagamento Seguro',
    description: 'Transações 100% seguras e protegidas',
    icon: 'security'
  },
  {
    title: 'Suporte 24/7',
    description: 'Atendimento disponível a qualquer hora',
    icon: 'support_agent'
  },
  {
    title: 'Melhor Preço',
    description: 'Garantimos os melhores preços do mercado',
    icon: 'local_offer'
  }
]);

const categories = ref([
  {
    name: 'Eletrônicos',
    count: 150,
    image: 'https://via.placeholder.com/300x200/5b21b6/ffffff?text=Eletrônicos',
    route: '/categoria/eletronicos'
  },
  {
    name: 'Roupas',
    count: 320,
    image: 'https://via.placeholder.com/300x200/818cf8/ffffff?text=Roupas',
    route: '/categoria/roupas'
  },
  {
    name: 'Casa & Jardim',
    count: 89,
    image: 'https://via.placeholder.com/300x200/5b21b6/ffffff?text=Casa+Jardim',
    route: '/categoria/casa-jardim'
  },
  {
    name: 'Esportes',
    count: 67,
    image: 'https://via.placeholder.com/300x200/818cf8/ffffff?text=Esportes',
    route: '/categoria/esportes'
  }
]);

const quickActions = ref([
  { label: 'Dashboard', icon: 'dashboard', color: 'primary', route: '/dashboard' },
  { label: 'Vendas', icon: 'point_of_sale', color: 'secondary', route: '/vendas' },
  { label: 'Clientes', icon: 'people', color: 'primary', route: '/clientes' },
  { label: 'Relatórios', icon: 'bar_chart', color: 'secondary', route: '/relatorios' },
  { label: 'Configurações', icon: 'settings', color: 'primary', route: '/configuracoes' }
]);

function navigateToCategory(route: string) {
  router.push(route);
}

onMounted(() => {
  const tl = gsap.timeline();
  
  tl.fromTo(heroTitle.value, 
    { opacity: 0, x: -100 }, 
    { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }
  )
  .fromTo(heroSubtitle.value, 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5'
  )
  .fromTo(heroButtons.value, 
    { opacity: 0, scale: 0 }, 
    { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.3'
  );
  
  setTimeout(() => {
    gsap.fromTo('.feature-item', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
    );
  }, 500);
  
  setTimeout(() => {
    gsap.fromTo('.category-item', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
    );
  }, 800);
  
  setTimeout(() => {
    if (ctaCard.value) {
      gsap.fromTo(ctaCard.value, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, 1200);
});
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #5b21b6 0%, #818cf8 100%);
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

.hero-content {
  max-width: 800px;
  padding: 2rem;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: white !important;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-btn {
  min-width: 180px;
}

.features-section {
  background: #f8fafc;
}

.feature-card {
  height: 100%;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.categories-section {
  background: white;
}

.category-card {
  transition: transform 0.3s ease;
  overflow: hidden;
}

.category-card:hover {
  transform: scale(1.05);
}

.category-image {
  height: 200px;
  object-fit: cover;
}

.cta-section {
  background: #f8fafc;
}

.cta-card {
  max-width: 800px;
  margin: 0 auto;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.quick-actions {
  background: white;
  border-top: 1px solid #e5e7eb;
}

.quick-action-btn {
  min-width: 140px;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>