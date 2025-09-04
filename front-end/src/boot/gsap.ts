import { boot } from 'quasar/wrappers';
import { gsap } from 'gsap';

export default boot(({ app }) => {
  app.config.globalProperties.$gsap = gsap;
});

export { gsap };