import { Component } from "uix/components/Component.ts";
import { NavigationItem } from "./Header.tsx";
import { ThemeSwitcher } from "../theme-switcher/ThemeSwitcher.tsx";
import { Icon } from "../../elements/icon/Icon.tsx";
import { BackgroundImage } from "../../elements/background-image/BackgroundImage.tsx";
import { template } from "uix/html/template.ts"

@template(function({mode, maxWidth, navigation, logo, label}) {
	return <>
		<button id="selector" class="hamburger-menu">
			<Icon name="fa-bars"/>
		</button>
		<div id="dropdown" class="hamburger-dropdown" style={{"--hamburger-max-size": maxWidth ?? "18.5rem"}}>
			<div class="header">
				<a class="header-icon" href="/" title="Home">
					<BackgroundImage
						dark={(typeof logo != "string" && "dark" in logo) ? logo.dark : logo}
						light={(typeof logo != "string" && "dark" in logo) ? logo.light : logo}
						class={"logo"}
						mode={mode ?? "auto"}/>
					{label ? <span class="label">{label}</span> : undefined}
				</a>
				<button id="close" class="close">
					<Icon name="fa-times"/>
				</button>
			</div>
			<div class="navigation-container">
				{this.getNavigation(navigation)}
			</div>
			<div class="footer">
				<a href="https://unyt.org" target={"_blank"}>
					<Icon name="fa-square-up-right"/> unyt.org
				</a>
				<ThemeSwitcher/>
			</div>
		</div>
	</>
})
@standalone
export class HamburgerMenu extends Component<{mode?: "dark" | "light" | "auto", maxWidth?: number | string, label?: HTMLElement | string, logo: string | URL | { dark: string | URL; light: string | URL; }, navigation?: Array<NavigationItem>}> {
	@id selector!: HTMLButtonElement;
	@id dropdown!: HTMLDivElement;
	@id close!: HTMLButtonElement;

	protected override onDisplay(): void | Promise<void> {
		this.close.addEventListener("click", () => {
			this.dropdown.hidePopover();
		});
	}

	private getNavigation(nav?: NavigationItem[]) {
		if (!nav || !nav.length)
			return null;
		const clone = (el?: HTMLElement | string) => el instanceof Element ? 
			el.cloneNode(true) as HTMLElement :
			el;
		return nav.map(({ title, link, children }) => {
			const isLink = !(children && children.length);
			return isLink ? <a href={link}>{clone(title)}</a> : <details>
				<summary>
					<div class="summary">
						{clone(title)}
					</div>
					<Icon name="fa-chevron-down"/>
				</summary>
				<div class="content">
					{children.map((item) =>
						(item instanceof Element) ? clone(item) : 
						<a href={item.link}>
							{clone(item.title)}
						</a>
					)}
				</div>
			</details>
		})
	}
	protected override onCreate(): void | Promise<void> {
		this.dropdown.setAttribute("popover", "");
		this.selector.setAttribute("popovertarget", "dropdown");
	}
}