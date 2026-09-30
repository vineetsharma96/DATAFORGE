import { AIProviderType } from './research';

export interface ProviderStatus {
  provider: AIProviderType;
  name: string;
  isConnected: boolean;
  statusText: string;
  model: string;
  endpoint?: string;
  latencyMs?: number;
  lastChecked: string;
  error?: string;
}

export interface AIProviderConfig {
  activeProvider: AIProviderType;
  gemini: {
    apiKey: string;
    model: string;
  };
  ollama: {
    baseUrl: string;
    model: string;
  };
  dataMode: 'synthetic' | 'live' | 'hybrid';
  demoMode: boolean;
}
