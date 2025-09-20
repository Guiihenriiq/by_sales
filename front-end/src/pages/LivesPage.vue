<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bold text-primary q-mb-xs">Gerenciar Lives</h1>
        <p class="text-subtitle1 text-grey-7">Crie e gerencie suas lives promocionais</p>
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="Nova Live"
        @click="showForm = true"
        class="q-px-lg"
      />
    </div>

    <!-- Form Dialog -->
    <q-dialog v-model="showForm" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Criar Nova Live</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="createLive" class="q-gutter-md">
            <q-input
              v-model="formData.title"
              label="Título da Live"
              outlined
              required
            />
            
            <q-input
              v-model="formData.description"
              label="Descrição"
              type="textarea"
              rows="3"
              outlined
              required
            />
            
            <q-input
              v-model="formData.streamUrl"
              label="URL da Stream"
              outlined
              required
            />
            
            <q-input
              v-model="formData.thumbnailUrl"
              label="URL da Thumbnail"
              outlined
              required
            />
            
            <q-input
              v-model="formData.scheduledAt"
              label="Data e Hora"
              type="datetime-local"
              outlined
              required
            />
            
            <q-input
              v-model="formData.products"
              label="IDs dos Produtos (separados por vírgula)"
              outlined
              hint="Exemplo: produto1, produto2, produto3"
            />

            <div class="row q-gutter-sm">
              <q-btn
                type="submit"
                color="primary"
                label="Criar Live"
                :loading="loading"
              />
              <q-btn
                label="Cancelar"
                color="grey"
                flat
                @click="showForm = false"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Lives Grid -->
    <div class="row q-gutter-md">
      <div
        v-for="live in lives"
        :key="live.id"
        class="col-12 col-md-6 col-lg-4"
      >
        <q-card class="live-card">
          <q-img
            :src="live.thumbnailUrl"
            height="200px"
            class="relative-position"
          >
            <div class="absolute-top-right q-ma-sm">
              <q-badge
                :color="getStatusColor(live.status)"
                :label="getStatusLabel(live.status)"
              />
            </div>
            
            <div
              v-if="live.status === 'live'"
              class="absolute-top-left q-ma-sm"
            >
              <q-badge color="red" label="AO VIVO">
                <template v-slot:default>
                  <q-icon name="fiber_manual_record" size="xs" class="q-mr-xs animate-pulse" />
                  AO VIVO
                </template>
              </q-badge>
            </div>
          </q-img>

          <q-card-section>
            <div class="text-h6 q-mb-sm">{{ live.title }}</div>
            <p class="text-body2 text-grey-7 q-mb-md">{{ live.description }}</p>
            
            <div class="row items-center q-mb-sm">
              <q-icon name="event" size="sm" class="q-mr-xs" />
              <span class="text-caption">
                {{ formatDate(live.scheduledAt) }}
              </span>
            </div>

            <div v-if="live.status === 'live'" class="row items-center q-mb-md">
              <q-icon name="visibility" size="sm" class="q-mr-xs" />
              <span class="text-caption text-red">
                {{ live.viewerCount }} visualizações
              </span>
            </div>
          </q-card-section>

          <q-card-actions align="around">
            <q-btn
              v-if="live.status === 'scheduled'"
              color="green"
              icon="play_arrow"
              label="Iniciar"
              @click="openStreaming(live.id)"
              flat
            />
            
            <q-btn
              v-if="live.status === 'live'"
              color="red"
              icon="stop"
              label="Finalizar"
              @click="endLive(live.id)"
              flat
            />
            
            <q-btn
              color="primary"
              icon="edit"
              label="Editar"
              flat
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="lives.length === 0" class="text-center q-pa-xl">
      <q-icon name="videocam" size="80px" color="grey-5" />
      <div class="text-h6 q-mt-md text-grey-7">Nenhuma live encontrada</div>
      <p class="text-body2 text-grey-6">Crie sua primeira live promocional!</p>
    </div>

    <!-- Live Streaming Component -->
    <LiveStreaming
      v-if="selectedLiveId"
      v-model="showStreaming"
      :live-id="selectedLiveId"
      @stream-started="onStreamStarted"
      @stream-ended="onStreamEnded"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import LiveStreaming from 'src/components/LiveStreaming.vue';

interface Live {
  id: string;
  title: string;
  description: string;
  streamUrl: string;
  thumbnailUrl: string;
  scheduledAt: string;
  startedAt?: string;
  endedAt?: string;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  viewerCount: number;
  products?: string[];
}

const $q = useQuasar();

const lives = ref<Live[]>([]);
const showForm = ref(false);
const loading = ref(false);
const showStreaming = ref(false);
const selectedLiveId = ref('');

const formData = ref({
  title: '',
  description: '',
  streamUrl: '',
  thumbnailUrl: '',
  scheduledAt: '',
  products: ''
});

const fetchLives = async () => {
  try {
    const response = await api.get('/lives');
    lives.value = response.data;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar lives'
    });
  }
};

const createLive = async () => {
  loading.value = true;
  try {
    const products = formData.value.products 
      ? formData.value.products.split(',').map(p => p.trim()) 
      : [];
    
    await api.post('/lives', {
      ...formData.value,
      products
    });

    $q.notify({
      type: 'positive',
      message: 'Live criada com sucesso!'
    });

    showForm.value = false;
    formData.value = {
      title: '',
      description: '',
      streamUrl: '',
      thumbnailUrl: '',
      scheduledAt: '',
      products: ''
    };
    
    fetchLives();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao criar live'
    });
  } finally {
    loading.value = false;
  }
};

const startLive = async (id: string) => {
  try {
    await api.patch(`/lives/${id}/start`);
    $q.notify({
      type: 'positive',
      message: 'Live iniciada!'
    });
    fetchLives();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao iniciar live'
    });
  }
};

const endLive = async (id: string) => {
  try {
    await api.patch(`/lives/${id}/end`);
    $q.notify({
      type: 'positive',
      message: 'Live finalizada!'
    });
    fetchLives();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao finalizar live'
    });
  }
};

const getStatusColor = (status: string) => {
  const colors = {
    scheduled: 'blue',
    live: 'red',
    ended: 'grey',
    cancelled: 'orange'
  };
  return colors[status as keyof typeof colors] || 'grey';
};

const getStatusLabel = (status: string) => {
  const labels = {
    scheduled: 'Agendada',
    live: 'Ao Vivo',
    ended: 'Finalizada',
    cancelled: 'Cancelada'
  };
  return labels[status as keyof typeof labels] || status;
};

const openStreaming = (liveId: string) => {
  selectedLiveId.value = liveId;
  showStreaming.value = true;
};

const onStreamStarted = () => {
  fetchLives();
};

const onStreamEnded = () => {
  fetchLives();
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('pt-BR');
};

onMounted(() => {
  fetchLives();
});
</script>

<style scoped>
.live-card {
  transition: all 0.3s ease;
}

.live-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>