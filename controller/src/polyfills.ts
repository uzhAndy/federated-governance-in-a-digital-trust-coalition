import { Buffer } from 'buffer';

(window as any).process = {
  env: { DEBUG: undefined },
};

(window as any).global = window;

global.Buffer = global.Buffer || Buffer;