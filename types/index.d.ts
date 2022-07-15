
declare module 'sharp' {
  interface SharpStatic {
    resize<T>(width: number, height: number, options?: T): void;
  }
}
