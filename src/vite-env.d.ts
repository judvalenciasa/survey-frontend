/**
 * Archivo de definiciones de tipos para Vite
 * @description Proporciona tipos TypeScript para el entorno de desarrollo de Vite
 */
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Declaraciones para aliases de path
declare module '@/*' {
  const content: any
  export default content
}

declare module '@/components/*' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/layouts/*' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
