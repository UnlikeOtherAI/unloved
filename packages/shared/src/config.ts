export type ThemeMode = 'light' | 'dark'

export interface AppConfig {
  theme: ThemeMode
}

export const DEFAULT_CONFIG: AppConfig = {
  theme: 'light',
}
