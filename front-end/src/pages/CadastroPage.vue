<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <q-card ref="signupCard" class="shadow-2">
          <q-card-section class="bg-white text-center">
            <div ref="signupTitle" class="text-h4 text-primary q-mb-md">Criar Conta</div>
            <AnimatedForm 
              :fields="formFields"
              submit-label="Criar Conta"
              :loading="loading"
              @submit="handleSubmit"
            />
            <q-btn 
              color="secondary" 
              label="Já tenho conta" 
              class="full-width q-mt-md" 
              outline 
              @click="$router.push('/login')"
            />
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
import AnimatedForm from 'src/components/AnimatedForm.vue';

const router = useRouter();
const loading = ref(false);

const signupCard = ref();
const signupTitle = ref();

const formFields = ref([
  { name: 'nome', label: 'Nome Completo', type: 'text', icon: 'person' },
  { name: 'email', label: 'Email', type: 'email', icon: 'email' },
  { name: 'telefone', label: 'Telefone', type: 'tel', icon: 'phone' },
  { name: 'senha', label: 'Senha', type: 'password', icon: 'lock' }
]);

function handleSubmit(formData: any) {
  loading.value = true;
  
  setTimeout(() => {
    loading.value = false;
    router.push('/dashboard');
  }, 2000);
}

onMounted(() => {
  const tl = gsap.timeline();
  
  tl.fromTo(signupCard.value, 
    { opacity: 0, scale: 0 }, 
    { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }
  )
  .fromTo(signupTitle.value, 
    { opacity: 0, x: -100 }, 
    { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4'
  );
});
</script>