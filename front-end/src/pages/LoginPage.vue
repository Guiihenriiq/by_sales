<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row justify-center">
      <div class="col-12 col-md-6 col-lg-4">
        <q-card ref="loginCard" class="shadow-2">
          <q-card-section class="bg-white text-center">
            <div class="q-mb-md">
              <q-icon name="admin_panel_settings" size="48px" color="primary" />
            </div>
            <div ref="loginTitle" class="text-h4 text-primary q-mb-sm">By Sales Admin</div>
            <div class="text-subtitle2 text-grey-6 q-mb-lg">Painel Administrativo</div>
            <q-form ref="loginForm" class="q-gutter-md">
              <q-input
                v-model="email"
                label="Email"
                type="email"
                outlined
                color="primary"
                :disable="loading"
                @keyup.enter="login"
                :rules="[val => !!val || 'Email é obrigatório', val => /.+@.+\..+/.test(val) || 'Email inválido']"
              />
              <q-input
                v-model="senha"
                label="Senha"
                type="password"
                outlined
                color="primary"
                :disable="loading"
                @keyup.enter="login"
                :rules="[val => !!val || 'Senha é obrigatória']"
              />
              <q-btn 
                color="primary" 
                label="Entrar" 
                class="full-width" 
                unelevated 
                :loading="loading"
                @click="login"
              />
              <div class="text-center q-mt-md">
                <p class="text-caption text-grey-6">
                  Apenas administradores podem acessar este painel
                </p>
                <q-btn
                  flat
                  size="sm"
                  color="grey"
                  label="Preencher dados de teste"
                  @click="fillTestData"
                  class="q-mt-sm"
                />
              </div>
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
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
import { gsap } from 'gsap';

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

const email = ref('');
const senha = ref('');
const loading = ref(false);

const loginCard = ref();
const loginTitle = ref();
const loginForm = ref();

const login = async () => {
  if (!email.value || !senha.value) {
    $q.notify({
      type: 'negative',
      message: 'Preencha todos os campos'
    });
    return;
  }

  loading.value = true;
  
  try {
    console.log('Tentando login com:', email.value);
    const result = await authStore.login(email.value, senha.value);
    console.log('Resultado do login:', result);
    
    if (result.success) {
      $q.notify({
        type: 'positive',
        message: 'Login realizado com sucesso!'
      });
      await router.push('/dashboard');
    } else {
      $q.notify({
        type: 'negative',
        message: result.message || 'Erro ao fazer login'
      });
    }
  } catch (error) {
    console.error('Erro no login:', error);
    $q.notify({
      type: 'negative',
      message: 'Erro interno. Tente novamente.'
    });
  } finally {
    loading.value = false;
  }
};

const fillTestData = () => {
  email.value = 'admin@bysales.com';
  senha.value = 'admin123';
  $q.notify({
    type: 'info',
    message: 'Dados de teste preenchidos'
  });
};

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

