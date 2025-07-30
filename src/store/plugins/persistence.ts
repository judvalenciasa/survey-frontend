/**
 * Plugin de persistencia para stores Pinia
 * @description Proporciona persistencia automática en localStorage para campos específicos
 * @module Persistence Plugin
 */

import type { PiniaPluginContext } from "pinia";

/**
 * Configuración de campos a persistir por cada store
 * @description Define qué campos de cada store se guardan en localStorage
 */
const persistenceConfig = {
  auth: ["token", "user"],
  survey: [],
};

/**
 * Plugin de persistencia que se registra automáticamente con Pinia
 * @param context - Contexto del plugin de Pinia
 * @description Guarda y restaura automáticamente campos específicos del localStorage
 */
export function persistencePlugin({ store }: PiniaPluginContext) {
  const storeId = store.$id;
  const fieldsToSave =
    persistenceConfig[storeId as keyof typeof persistenceConfig];

  if (!fieldsToSave || fieldsToSave.length === 0) return;

  const storageKey = `pinia-${storeId}`;
  const savedData = localStorage.getItem(storageKey);
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);

      fieldsToSave.forEach((field) => {
        if (parsed[field] !== undefined) {
          store.$state[field] = parsed[field];
        }
      });
    } catch (error) {
      console.warn(`Error al restaurar datos del store ${storeId}:`, error);
      localStorage.removeItem(storageKey);
    }
  }

  store.$subscribe(
    (_mutation, state) => {
      const dataToSave: Record<string, any> = {};

      fieldsToSave.forEach((field) => {
        dataToSave[field] = state[field];
      });

      try {
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      } catch (error) {
        console.warn(`Error al guardar datos del store ${storeId}:`, error);
      }
    },
    { detached: true }
  );
}
