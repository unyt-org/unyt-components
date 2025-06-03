import { UIX } from "uix";
import { include, standalone } from "uix/base/decorators.ts";
import { Component } from "uix/components/Component.ts";
import { Icon } from "../../elements/icon/Icon.tsx";
import { ToggleSwitch } from "../../elements/toggle-switch/ToggleSwitch.tsx";
import { Selector, SelectorWrapper } from "../../elements/selector/Selector.tsx";
import { BackgroundImage } from "../../elements/background-image/BackgroundImage.tsx";
import { template } from "uix/html/template.ts"
import { type CommonProperties } from "../../utils/locales.ts";
import { LocaleCode } from "../../utils/locales.ts";


export type FooterOptions = {
	mode?: "light" | "dark" | "auto";
	logo?: string | URL | { dark: string | URL, light: string | URL };
	compact?: boolean;
	backgroundColor?: string;
	disableReload?: boolean;
	disableLanguageSelector?: boolean;
	disableModeToggle?: boolean;
	termsLink?: string | URL;
	privacyLink?: string | URL;
	legalLink?: string | URL;
}

@template(function({mode, logo, disableLanguageSelector, disableModeToggle}) {
	const lang: LocaleCode = this.properties.lang ?? UIX?.language as LocaleCode ?? "en";
	if (logo === undefined)
		logo = {
			dark: "https://cdn.unyt.org/unyt-resources/logos/unyt/text-light-transparent-3.svg",
			light: "https://cdn.unyt.org/unyt-resources/logos/unyt/text-dark-transparent-3.svg"
		}
	return <>
		<div class="header">
			<BackgroundImage
					dark={(typeof logo != "string" && "dark" in logo) ? logo.dark : logo}
					light={(typeof logo != "string" && "dark" in logo) ? logo.light : logo}
					class={"logo"}
					mode={mode ?? "auto"}/>
			<a title='unyt.org' id="topAnchor">
				<Icon name="fa-chevron-up"/>
			</a>
		</div>
		<div class="content">
			<div class="references">
				{this.sitemapReferences.map(({topic, items}) => <section>
					<h1>{typeof topic === "string" ? topic : topic[lang]}</h1>
					{items.map(({name, link}) => (<a href={link}>{typeof name === "string" ? name : name[lang]}</a>))}
				</section>
				)}
			</div>
			<div class="settings">
				{disableLanguageSelector ? null : <Selector id="languageSelector" value={lang === "de" ? "de" : "en"} label={<Icon name="fa-globe"/> as HTMLElement} hideChevron>
					<option value="en">English</option>
					<option value="de">Deutsch</option>
				</Selector>}
				{disableModeToggle ? null : <ToggleSwitch id="modeToggle" label={this.sitemapStrings.darkMode[lang]} checked={
					((!mode || mode === "auto") ? (UIX?.Theme?.mode ?? "dark") : mode) === "dark"
				}/>}
			</div>

		</div>
	</>
})
@standalone
class Sitemap extends Component<CommonProperties & {logo?: string | URL | { dark: string | URL, light: string | URL }, disableLanguageSelector?: boolean, disableModeToggle?: boolean, disableReload?: boolean, mode?: "dark" | "light" | "auto"}> {
	@id modeToggle!: ToggleSwitch;
	@include sitemapReferences!: Array<{topic: string, items: Array<{name: string | Record<LocaleCode, string>, link: string | URL}>}>;
	@include sitemapStrings!: Record<string, Record<LocaleCode, string>>;
	@id languageSelector?: SelectorWrapper;
	@id topAnchor!: HTMLAnchorElement;

	protected override async onDisplay() {
		if (this.modeToggle)
			this.handleModeChange();
		this.topAnchor.onclick = () => this.onScrollTop();
		if (this.languageSelector) {
			const UIX = await (await import("../../utils/load-uix.ts" /*lazy*/)).loadUIX() as unknown as { language: string };
			await this.languageSelector?.anchored;
			this.languageSelector.onChange((lang) => {
				if (UIX && lang != UIX.language) {
					UIX.language = lang;
					if (!this.properties?.disableReload)
						globalThis.location.reload();
				}
			});
			if (typeof this.languageSelector.value === "string")
				this.languageSelector.value = UIX.language === "de" ? "de" : "en";
			else
				(this.languageSelector.value as Ref<string>).val = UIX.language === "de" ? "de" : "en";
		}

	}

	public onScrollTop() {
		globalThis.scrollTo({top: 0, behavior: "smooth"});
	}

	private async handleModeChange() {
		const { getThemeManager } = (await import("uix/base/theme-manager.ts" /*lazy*/));
		const themeManager = getThemeManager();
		this.modeToggle.onToggle((checked) => {
			themeManager.setMode(checked ? "dark" : "light");
		});
		themeManager.onModeChange((theme)=>{
			this.modeToggle.setChecked(theme === "dark");
		});
		this.modeToggle.setChecked(themeManager.mode === "dark");
	}
}
@template(function({legalLink, termsLink, privacyLink, mode, backgroundColor}) {
	const lang = this.properties.lang ?? "en";
	return <div class="unyt-navbar" stylesheet="./Navbar.css?" data-mode={mode} id="navbar" style={`--bg-color: ${backgroundColor ?? "transparent"}`}>
		<div class="copyright">&copy; <span>{new Date().getFullYear()} unyt.org e.V.</span></div>
		<div class="tos">
			<a href={termsLink ?? "https://unyt.org/terms-of-service"} target="_blank">{this.navbarStrings.terms[lang]}</a>
			<a href={privacyLink ?? "https://unyt.org/privacy"} target="_blank">{this.navbarStrings.privacy[lang]}</a>
			<a href={legalLink ?? "https://unyt.org/legal-notice"} target="_blank">{this.navbarStrings.about[lang]}</a>
		</div>
		<div class="references">
			{this.navbarReferences.map(({name, link, icon}) => <a title={name} href={link}>
				<Icon name={icon}/>
			</a>)}
		</div>
	</div>
})
@standalone
class Navbar extends Component<CommonProperties &{
	legalLink?: string | URL,
	termsLink?: string | URL,
	privacyLink?: string | URL,
	mode?: "auto" | "light" | "dark",
	backgroundColor?: string}> {
	@include navbarReferences!: Array<{name: string, link: URL, icon: string}>;
	@include navbarStrings!: Record<string, Record<LocaleCode, string>>;
}

@template(function({termsLink, privacyLink, legalLink, logo, disableLanguageSelector, disableModeToggle, backgroundColor, disableReload, compact, mode}) {
	return <shadow-root>
		<link rel="stylesheet" href={"../../theme/unyt.css"}/>
		<div id="footer" data-mode={mode ?? "auto"}>
			{compact ? null : <Sitemap 
				id="sitemap"
				lang={this.properties.lang}
				logo={logo}
				disableLanguageSelector={disableLanguageSelector ?? false}
				disableModeToggle={disableModeToggle ?? false}
				disableReload={disableReload ?? false}
				mode={mode ?? "auto"}/>}
			<Navbar 
				id="navbar"
				lang={this.properties.lang}
				mode={mode ?? "auto"}
				backgroundColor={backgroundColor}
				termsLink={termsLink ?? "https://unyt.org/terms-of-service"}
				privacyLink={privacyLink ?? "https://unyt.org/privacy"}
				legalLink={legalLink ?? "https://unyt.org/legal-notice"} />
		</div>
	</shadow-root>
})
@standalone({inheritedFields: ["properties"]})
export class Footer extends Component<FooterOptions & CommonProperties> {
	@id sitemap!: Sitemap;
	@id navbar!: Navbar;

	public get mode() {
		return this.sitemap.dataset.mode as "dark" | "light" | "auto";
	}
	public setMode(mode: "dark" | "light" | "auto") {
		this.sitemap.dataset.mode = mode;
		if (this.navbar)
			this.navbar.dataset.mode = mode
	}
}