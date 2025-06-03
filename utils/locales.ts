export type LocaleString = {
  components: {
    footer: {
      nothing: string;
      }
    }
};

export interface CommonProperties {
  lang?: LocaleCode;
  currentPath?: string;
  csrfToken?: string;
}

export type LocaleCode = "en" | "de";
export const supportedLanguages: LocaleCode[] = ["en", "de"];

type DotJoin<Prefix extends string, Suffix extends string> =
  `${Prefix}.${Suffix}`;

export type LocalePath<T> = {
  [Section in keyof T]: T[Section] extends string ? Section & string
    : T[Section] extends object
      ? DotJoin<Section & string, LocalePath<T[Section]>>
    : never;
}[keyof T];
