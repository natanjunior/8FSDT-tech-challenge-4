/// <reference types="nativewind/types" />

// Allow side-effect CSS imports (used by NativeWind's global.css)
declare module '*.css' {
  const content: unknown;
  export default content;
}
