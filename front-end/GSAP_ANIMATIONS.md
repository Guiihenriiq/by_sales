# Animações GSAP - By Sales Frontend

## 📋 Resumo das Implementações

Este projeto agora utiliza a biblioteca **GSAP (GreenSock Animation Platform)** para criar animações fluidas e interações dinâmicas em todas as telas.

## 🚀 Instalação e Configuração

### Dependências Adicionadas
- `gsap: ^3.12.2` - Biblioteca principal de animações

### Arquivos Criados/Modificados

#### 1. Boot File
- `src/boot/gsap.ts` - Configuração global do GSAP

#### 2. Composable
- `src/composables/useAnimations.ts` - Funções reutilizáveis de animação

#### 3. Estilos
- `src/css/animations.scss` - Classes CSS para animações
- `src/css/app.scss` - Import das animações

#### 4. Configuração
- `package.json` - Dependência GSAP adicionada
- `quasar.config.ts` - Boot file registrado

## 🎨 Animações Implementadas

### Componentes
- **EssentialLink.vue**: Fade in e hover scale nos itens de navegação

### Páginas
- **HomePage.vue**: Timeline complexa com slide, fade e stagger animations
- **LoginPage.vue**: Scale in do card e slide in do título
- **DashboardPage.vue**: Animações sequenciais para header, cards e gráficos
- **ProdutosPage.vue**: Stagger animation para produtos
- **VendasPage.vue**: Slide in do header e fade in da tabela
- **ClientesPage.vue**: Timeline para header, card e input de busca
- **CadastroPage.vue**: Animações complexas com stagger para inputs

### Layout
- **MainLayout.vue**: Animações no header e drawer
- **App.vue**: Transições de página com GSAP

## 🛠️ Funções Disponíveis no Composable

```typescript
const {
  fadeIn,        // Fade in com movimento Y
  slideIn,       // Slide in da esquerda/direita
  scaleIn,       // Scale in com bounce
  staggerFadeIn, // Animação sequencial em elementos
  createTimeline,// Cria timeline GSAP
  hoverScale,    // Efeito hover de escala
  gsap          // Instância GSAP
} = useAnimations();
```

## 📱 Responsividade e Acessibilidade

- Animações respeitam `prefers-reduced-motion`
- Suporte a modo escuro
- Animações otimizadas para diferentes tamanhos de tela

## 🎯 Tipos de Animação

### 1. **Entrada de Página**
- Fade in com movimento
- Scale in com bounce
- Slide in direcional

### 2. **Elementos Sequenciais**
- Stagger animations para listas
- Timeline coordenada

### 3. **Interações**
- Hover effects
- Click animations
- Focus states

### 4. **Transições**
- Navegação entre páginas
- Estados de loading

## 🔧 Como Usar

### Em um componente Vue:
```vue
<template>
  <div ref="myElement">Conteúdo</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAnimations } from 'src/composables/useAnimations';

const myElement = ref();
const { fadeIn } = useAnimations();

onMounted(() => {
  fadeIn(myElement.value, 0.8);
});
</script>
```

### Timeline complexa:
```typescript
onMounted(() => {
  const tl = createTimeline();
  
  tl.add(slideIn(title.value, 'left', 0.8))
    .add(fadeIn(content.value, 0.6), '-=0.4')
    .add(scaleIn(button.value, 0.5), '-=0.2');
});
```

## 🎨 Classes CSS Disponíveis

- `.gsap-fade-in` - Estado inicial para fade in
- `.gsap-slide-left` - Estado inicial para slide da esquerda
- `.gsap-slide-right` - Estado inicial para slide da direita
- `.gsap-scale-in` - Estado inicial para scale in
- `.gsap-hover-scale` - Hover com escala
- `.gsap-hover-lift` - Hover com elevação
- `.gsap-pulse` - Animação de pulso
- `.gsap-float` - Animação flutuante
- `.gsap-gradient-shift` - Gradiente animado

## 🚀 Próximos Passos

Para expandir as animações:

1. **Adicionar mais plugins GSAP** (ScrollTrigger, TextPlugin, etc.)
2. **Criar animações de loading** personalizadas
3. **Implementar micro-interações** em formulários
4. **Adicionar animações de dados** em gráficos
5. **Criar transições de estado** mais complexas

## 📚 Recursos

- [Documentação GSAP](https://greensock.com/docs/)
- [GSAP Cheat Sheet](https://greensock.com/cheatsheet/)
- [Vue 3 + GSAP Examples](https://greensock.com/vue/)

---

**Desenvolvido com ❤️ usando GSAP + Vue 3 + Quasar**