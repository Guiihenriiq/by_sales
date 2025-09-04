<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row justify-center">
      <div class="col-12 col-md-6 col-lg-4">
        <q-card ref="loginCard" class="shadow-2">
          <q-card-section class="bg-white text-center">
            <div ref="loginTitle" class="text-h4 text-primary q-mb-md">Login</div>
            <q-form ref="loginForm" class="q-gutter-md">
              <q-input
                v-model="email"
                label="Email"
                type="email"
                outlined
                color="primary"
              />
              <q-input
                v-model="senha"
                label="Senha"
                type="password"
                outlined
                color="primary"
              />
              <q-btn 
                color="primary" 
                label="Entrar" 
                class="full-width" 
                unelevated 
                @click="login"
              />
              <q-btn 
                color="secondary" 
                label="Criar Conta" 
                class="full-width" 
                outline 
                @click="$router.push('/cadastro')"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { gsap } from 'gsap';

const router = useRouter();
const email = ref('');
const senha = ref('');

const loginCard = ref();
const loginTitle = ref();
const loginForm = ref();

function login() {
  router.push('/dashboard');
}

onMounted(() => {
  const tl = gsap.timeline();
  
  tl.fromTo(loginCard.value, 
    { opacity: 0, scale: 0 }, 
    { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }
  )
  .fromTo(loginTitle.value, 
    { opacity: 0, x: -100 }, 
    { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4'
  )
  .fromTo(loginForm.value, 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2'
  );
});
</script>

