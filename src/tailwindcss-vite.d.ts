declare module '@tailwindcss/vite' {
  import type { PluginOption } from 'vite';

  const tailwindcss: (...args: unknown[]) => PluginOption;
  export default tailwindcss;
}
