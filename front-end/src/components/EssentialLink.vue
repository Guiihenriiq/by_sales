<template>
  <q-item
    clickable
    :to="to"
    exact
    class="nav-item"
    :aria-label="`Navegar para ${title.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim()}: ${caption}`"
    role="menuitem"
    tabindex="0"
  >
    <q-item-section
      v-if="icon"
      avatar
      class="nav-icon-section"
    >
      <q-icon :name="icon" class="nav-icon" />
    </q-item-section>

    <q-item-section class="nav-content" style="flex: 1; min-width: 0;">
      <q-item-label class="nav-title" style="word-break: break-word;">{{ title }}</q-item-label>
      <q-item-label caption class="nav-caption" style="word-break: break-word; line-height: 1.3;">{{ caption }}</q-item-label>
    </q-item-section>

    <q-item-section side v-if="badge" class="nav-badge-section">
      <q-badge 
        :color="badgeColor || 'primary'" 
        :label="badge" 
        class="nav-badge pulse-badge"
        rounded
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
export interface EssentialLinkProps {
  title: string;
  caption?: string;
  to?: string;
  icon?: string;
  badge?: string;
  badgeColor?: string;
  adminOnly?: boolean;
};

withDefaults(defineProps<EssentialLinkProps>(), {
  caption: '',
  to: '/',
  icon: '',
  badge: '',
  badgeColor: 'primary',
  adminOnly: false,
});
</script>
