<template>
  <q-form class="animated-form">
    <div 
      v-for="field in fields" 
      :key="field.name"
      class="form-field"
    >
      <q-input
        v-model="formData[field.name]"
        :label="field.label"
        :type="field.type"
        outlined
        color="primary"
      >
        <template v-slot:prepend>
          <q-icon :name="field.icon" />
        </template>
      </q-input>
    </div>
    
    <q-btn 
      :loading="loading"
      color="primary" 
      :label="submitLabel"
      class="full-width q-mt-md"
      @click="onSubmit"
    />
  </q-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

interface FormField {
  name: string;
  label: string;
  type: string;
  icon: string;
}

interface Props {
  fields: FormField[];
  submitLabel?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  submitLabel: 'Enviar',
  loading: false
});

const emit = defineEmits(['submit']);

const formData = reactive<Record<string, any>>({});

props.fields.forEach(field => {
  formData[field.name] = '';
});

const onSubmit = () => {
  emit('submit', formData);
};
</script>

<style scoped>
.animated-form {
  max-width: 400px;
  margin: 0 auto;
}

.form-field {
  margin-bottom: 1rem;
}
</style>