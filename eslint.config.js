import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'

export default [
  // Configuración base para archivos JS
  js.configs.recommended,
  
  // Configuración para archivos Vue
  ...vue.configs['flat/recommended'],
  
  // Configuración para archivos TypeScript
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.app.json'
      },
      globals: {
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        navigator: 'readonly',
        setTimeout: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': typescript
    },
    rules: {
      ...typescript.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'import/no-unresolved': 'off'
    }
  },
  
  // Configuración específica para archivos Vue
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.app.json',
        extraFileExtensions: ['.vue']
      },
      globals: {
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        navigator: 'readonly',
        setTimeout: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': typescript
    },
    rules: {
      // Reglas de Vue más permisivas
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': ['warn', { 
        ignorePattern: '^_'
      }],
      'vue/no-mutating-props': 'warn',
      'vue/valid-template-root': 'warn',
      'vue/no-side-effects-in-computed-properties': 'warn',
      'vue/no-setup-props-destructure': 'off',
      'vue/no-v-html': 'off',
      
      // Reglas de TypeScript
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      
      // Reglas generales más permisivas para desarrollo
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-undef': 'off',
      'no-unused-vars': 'off', // Usar la versión de TypeScript
      'prefer-const': 'warn'
    }
  },
  
  // Ignorar ciertos archivos
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '*.config.js',
      '*.config.ts',
      'coverage/**',
      '.vscode/**',
      '.git/**'
    ]
  }
]
