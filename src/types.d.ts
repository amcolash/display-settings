declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module 'xrandr' {
  export interface Screens {
    [name: string]: Screen;
  }

  export interface Screen {
    connected: boolean;
    modes: Mode[];
  }

  export interface Mode {
    current?: boolean;
    native?: boolean;
    height: number;
    rate: number;
    width: number;
    interlaced?: boolean;
  }

  function parse(string): Screens;
  export = parse;
}
