<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <q-card class="shadow-2">
          <q-card-section class="bg-primary text-white text-center">
            <q-avatar size="80px" class="q-mb-md">
              <img :src="perfil.avatar" />
            </q-avatar>
            <div class="text-h5">Editar Perfil</div>
            <div class="text-caption">Mantenha suas informações atualizadas</div>
          </q-card-section>

          <q-card-section class="bg-white">
            <q-form @submit="salvarPerfil" class="q-gutter-md">
              <div class="row q-gutter-md">
                <q-input
                  v-model="perfil.nome"
                  label="Nome Completo"
                  outlined
                  color="primary"
                  class="col"
                  :rules="[val => !!val || 'Nome é obrigatório']"
                />
                <q-input
                  v-model="perfil.sobrenome"
                  label="Sobrenome"
                  outlined
                  color="primary"
                  class="col"
                />
              </div>

              <q-input
                v-model="perfil.email"
                label="Email"
                type="email"
                outlined
                color="primary"
                :rules="[val => !!val || 'Email é obrigatório']"
              />

              <div class="row q-gutter-md">
                <q-input
                  v-model="perfil.telefone"
                  label="Telefone"
                  outlined
                  color="primary"
                  mask="(##) #####-####"
                  class="col"
                />
                <q-input
                  v-model="perfil.cpf"
                  label="CPF"
                  outlined
                  color="primary"
                  mask="###.###.###-##"
                  class="col"
                />
              </div>

              <q-input
                v-model="perfil.endereco"
                label="Endereço"
                outlined
                color="primary"
              />

              <div class="row q-gutter-md">
                <q-input
                  v-model="perfil.cidade"
                  label="Cidade"
                  outlined
                  color="primary"
                  class="col"
                />
                <q-select
                  v-model="perfil.estado"
                  :options="estados"
                  label="Estado"
                  outlined
                  color="primary"
                  class="col"
                />
              </div>

              <q-input
                v-model="perfil.cep"
                label="CEP"
                outlined
                color="primary"
                mask="#####-###"
              />

              <q-separator class="q-my-md" />

              <div class="text-h6 text-primary q-mb-md">Preferências</div>

              <div class="row q-gutter-md">
                <q-toggle
                  v-model="perfil.notificacoes.email"
                  label="Receber emails promocionais"
                  color="primary"
                />
                <q-toggle
                  v-model="perfil.notificacoes.sms"
                  label="Receber SMS"
                  color="primary"
                />
              </div>

              <q-toggle
                v-model="perfil.newsletter"
                label="Assinar newsletter"
                color="primary"
              />

              <div class="q-mt-lg">
                <q-btn 
                  type="submit"
                  color="primary" 
                  label="Salvar Alterações" 
                  class="full-width q-mb-sm" 
                  unelevated 
                  :loading="salvando"
                />
                <q-btn 
                  color="grey" 
                  label="Cancelar" 
                  class="full-width" 
                  outline 
                  @click="$router.go(-1)"
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
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const router = useRouter();

const salvando = ref(false);

const perfil = ref({
  avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
  nome: 'Carlos',
  sobrenome: 'Silva',
  email: 'carlos.silva@email.com',
  telefone: '(11) 99999-9999',
  cpf: '123.456.789-00',
  endereco: 'Rua das Flores, 123',
  cidade: 'São Paulo',
  estado: 'SP',
  cep: '01234-567',
  notificacoes: {
    email: true,
    sms: false
  },
  newsletter: true
});

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

async function salvarPerfil() {
  salvando.value = true;
  
  try {
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    $q.notify({
      message: 'Perfil atualizado com sucesso!',
      color: 'positive',
      position: 'top',
      icon: 'check_circle'
    });
    
    router.push('/');
  } catch (error) {
    $q.notify({
      message: 'Erro ao salvar perfil. Tente novamente.',
      color: 'negative',
      position: 'top',
      icon: 'error'
    });
  } finally {
    salvando.value = false;
  }
}
</script>

<style scoped>
.q-card {
  max-width: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.q-form {
  .q-field {
    transition: all 0.3s ease;
  }
  
  .q-field:focus-within {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(91, 33, 182, 0.15);
  }
}

.q-btn {
  border-radius: 8px;
  font-weight: 600;
}
</style>