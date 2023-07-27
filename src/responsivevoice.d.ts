declare module 'responsivevoice' {
    export function speak(text: string, voice: string, options?: object): void;
    export const voices: string[];
  }
  