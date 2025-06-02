import type { LocaleCode, LocalePath, LocaleString } from "./locales.ts";
import { RawHTML, rawHTML } from "uix/html/unsafe-html.ts";

const loadedLocales = new Map<LocaleCode, LocaleString>();

export interface CommonProperties {
  lang?: LocaleCode;
  currentPath?: string;
  csrfToken?: string;
}

const csrfStore = new Map<string, { expires: number }>();

export async function initLocales() {
  const languages: LocaleCode[] = ["en", "de"];

  for (const lang of languages) {
    const locale = await datex.get<LocaleString>(`./${lang}.dx`);
    loadedLocales.set(lang, locale);
  }
}

/**
 * Retrieves a localized string based on the given path and language.
 * If the value starts with "get ", a markdown file is loaded.
 *
 * @param path - The path to the string in the localization data, with dot notation for nested objects.
 * @param lang - The language code (default is "en").
 *
 * @returns A promise that resolves to the localized string.
 *
 * @throws {Error} If the path is not found or the value is not a string.
 */
export function getString<Formatted extends boolean = false>(
  path: LocalePath<LocaleString>,
  lang: LocaleCode = "en",
  formatted: Formatted = false as Formatted,
): Formatted extends true ? RawHTML : string {
  const localeData = loadedLocales.get(lang)!;

  if (!localeData) {
    throw new Error(`Locale "${lang}" not loaded. Call loadLocale() first.`);
  }

  const parts = path.split(".");
  let current: any = localeData;

  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      throw new Error(`Path "${path}" not found in locale "${lang}"`);
    }
  }

  if (typeof current !== "string") {
    throw new Error(`Expected string at "${path}" but got ${typeof current}`);
  }

  if (formatted) {
    return formatStringAsRawHTML(current) as Formatted extends true ? RawHTML
      : string;
  } else {
    return current as Formatted extends true ? RawHTML : string;
  }
}

export function getLangFromPath(path: string): LocaleCode {
  const langMatch = path.match(/^\/([a-z]{2})(\/|$)/);
  return (langMatch?.[1] as LocaleCode) || "en";
}

export function getLocalizedUrl(
  url: string | URL,
  lang: LocaleCode = "en",
): string {
  const urlStr = url.toString();
  if (!urlStr) return lang === "en" ? "/" : `/${lang}`;
  if (/^https?:\/\//i.test(urlStr)) {
    const urlObj = new URL(urlStr);

    if (!urlObj.hostname.includes("unyt.org")) {
      return urlStr;
    }

    const path = urlObj.pathname.replace(/^\/([a-z]{2}\/)?/, "");

    if (lang === "en") {
      urlObj.pathname = path ? `/${path}` : "/";
    } else {
      const langPrefix = `/${lang}/`;
      if (
        !urlObj.pathname.startsWith(langPrefix) &&
        urlObj.pathname !== `/${lang}`
      ) {
        urlObj.pathname = path ? `/${lang}/${path}` : `/${lang}`;
      }
    }

    return urlObj.toString();
  }

  let path = urlStr;
  path = path.replace(/^\/([a-z]{2}\/)?/, "");

  if (lang === "en") {
    return path ? `/${path}` : "/";
  } else {
    if (path.startsWith(`${lang}/`) || path === lang) {
      return `/${path}`;
    }
    return path ? `/${lang}/${path}` : `/${lang}`;
  }
}

export function formatStringAsRawHTML(string: string): RawHTML {
  // replace all **xy** and __xy__ with <b>xy</b>
  string = string.replace(
    /(\*\*|__)(.*?)\1/g,
    "<b>$2</b>",
  );
  // replace all *xy* and _xy_ with <i>xy</i>
  string = string.replace(
    /(\*|_)(.*?)\1/g,
    "<i>$2</i>",
  );
  // replace all ~~xy~~ with <s>xy</s>
  string = string.replace(
    /~~(.*?)~~/g,
    "<s>$1</s>",
  );
  // replace all `xy` with <code>xy</code>
  string = string.replace(
    /`(.*?)`/g,
    "<code>$1</code>",
  );
  // replace all [xy](url) with <a href="url">xy</a>
  string = string.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2">$1</a>',
  );

  return rawHTML(string);
}

await initLocales();