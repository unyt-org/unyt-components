import { Component } from "uix/components/Component.ts";
import { Selector } from "../../elements/selector/Selector.tsx";
import { Path } from "datex-core-legacy/utils/path.ts";
import { Icon } from "../../elements/icon/Icon.tsx";
import { BackgroundImage } from "../../elements/background-image/BackgroundImage.tsx";
import { blankTemplate, template } from "uix/html/template.ts"
import { HamburgerMenu } from "./HamburgerMenu.tsx";

export type HeaderOptions = {
	size?: number | string;
	mode?: "light" | "dark" | "auto";
	logo?: string | URL | { dark: string | URL, light: string | URL };
	label?: HTMLElement | string;
	backgroundColor?: string;
	position?: "sticky" | "fixed" | "relative" | "absolute";
	navigation?: Array<NavigationItem>;
	disableHamburgerMenu?: boolean;
	hamburgerMenuMaxWidth?: number | string;
	maxWidth?: number | string;
	banner?: string | HTMLElement;
	disableHoverNavigation?: boolean;
	iconRight?: string | HTMLElement;
	stylesheet?: URL | string;
}
export type NavigationItem = { title: string | HTMLElement, link?: string, children?: Array<NavigationItem | HTMLElement> }



export const Header = blankTemplate<HeaderOptions & { children?: any}>(({children, ...props}) => {
	const left = children?.find((child: HTMLElement) => child?.getAttribute("slot") === "left");
	const right = children?.find((child: HTMLElement) => child?.getAttribute("slot") === "right");
	return <HeaderWrapper {...props} left={left} right={right}/> as HTMLDivElement
})

@template(function({ iconRight, disableHoverNavigation, banner, maxWidth, left, right, hamburgerMenuMaxWidth, disableHamburgerMenu, position, navigation, backgroundColor, label, logo, mode, size, stylesheet }) {
	if (logo === undefined)
		logo = {
			dark: "https://cdn.unyt.org/unyt-resources/logos/unyt/text-light-transparent-3.svg",
			light: "https://cdn.unyt.org/unyt-resources/logos/unyt/text-dark-transparent-3.svg"
		}
	
	return <shadow-root>
		<link rel="stylesheet" href={"../../theme/unyt.css"}/>
		{stylesheet ? <link rel="stylesheet" href={stylesheet}/> : null}
		{banner ? <div id="banner" class="global-banner" data-mode={mode ?? "auto"} >
			<div class="content">
				{banner}
			</div>
			<Icon name="fa-times"/>
		</div> : null}
		<div id="header" data-mode={mode ?? "auto"} class="header" 
			style={{
				position: position ?? "unset",
				"--size": `${typeof size === "number" ? `${size}px` : (size ?? '70px')}`,
				"--header-bg-primary": `${backgroundColor ?? "transparent"}`
			}}>
			{disableHamburgerMenu ? null : <HamburgerMenu stylesheet="./HamburgerMenu.css?" id="hamburgerMenu" mode={mode ?? "auto"} maxWidth={hamburgerMenuMaxWidth} logo={logo} label={label instanceof HTMLElement ? (label.cloneNode(true) as HTMLElement) : label} navigation={navigation}/>}
			<a class="header-icon static" href="/" title="Home">
				<BackgroundImage
					dark={(typeof logo != "string" && "dark" in logo) ? logo.dark : logo}
					light={(typeof logo != "string" && "dark" in logo) ? logo.light : logo}
					class={"logo"}
					mode={mode ?? "auto"}/>

				{label ? (label instanceof HTMLElement ? (label.cloneNode(true) as HTMLElement) : <span class="label">{label}</span>) : undefined}
			</a>
			<a class="header-icon" href="/" title="Home">
				<BackgroundImage
					dark={(typeof logo != "string" && "dark" in logo) ? logo.dark : logo}
					light={(typeof logo != "string" && "dark" in logo) ? logo.light : logo}
					class={"logo"}
					mode={mode ?? "auto"}/>
				{label ? (label instanceof HTMLElement ? (label.cloneNode(true) as HTMLElement) : <span class="label">{label}</span>) : undefined}
			</a>
			<div id="content" class="content" style={{
				maxWidth: maxWidth ? (typeof maxWidth === "number" ? `${maxWidth + "px"}` : maxWidth) : "unset",
			}}>
				<div class="left">
					{
						navigation ? 
							this.getNavigation(navigation, disableHoverNavigation) : 
							Array.from((left?.children ?? []) as HTMLElement[])
					}
					
				</div>
				<div class="right">
					{...(right?.children ?? []) as HTMLElement[]}
				</div>
			</div>
			{iconRight ? typeof iconRight === "string" ? <Icon name={iconRight} class="action-right"/> : <div class="action-right">{iconRight}</div> : null}
		</div>
	</shadow-root>
})
@standalone
export class HeaderWrapper extends Component<HeaderOptions & { stylesheet?: URL | string, left?: HTMLSlotElement, right?: HTMLSlotElement }> {
	@id header!: HTMLDivElement;
	@id banner!: HTMLDivElement;
	@id content!: HTMLDivElement;
	@id hamburgerMenu?: HTMLElement;

	public getNavigation(nav?: NavigationItem[], disableHover?: boolean) {
		if (!nav || !nav.length)
			return null;
		return <header class="navigation">
			{nav.map(({ title, link, children }) => {
				const isLink = !(children && children.length);
				return <Selector openOnHover={!disableHover} stylesheet={new Path("./Selector.css")} 
					hideChevron={isLink}
					hideCheck
					label={(
						isLink ? <a href={link}>{title}</a> : <div>{title}</div>
					) as HTMLElement}>
					{
						(children ?? []).map((item) =>
							item instanceof HTMLElement ? item : <option value={""}>
								<a href={item.link}>{item.title}</a>
							</option>
						)
	
					}
				</Selector>
			})}
		</header>
	}

	public get mode() {
		return this.header.dataset.mode as "dark" | "light" | "auto";
	}
	public setMode(mode: "dark" | "light" | "auto") {
		this.header.dataset.mode = mode;
		if (this.banner)
			this.banner.dataset.mode = mode;
		if (this.hamburgerMenu)
			this.hamburgerMenu.dataset.mode = mode;
	}

	private listenForScroll() {
		const update = () => 
			this.header.classList.toggle("top", !((document.documentElement.scrollTop || document.body.scrollTop) === 0));
		globalThis.addEventListener("scroll", update.bind(this));
		if ("anchored" in this)
			(this.anchored as Promise<unknown>)!.then(() => update());
		else update();
	}

	private listenForOverflow() {
		function isOverflowing(container: HTMLElement) {
			return container.scrollWidth > container.offsetWidth;
		}
		const left = this.content.querySelector('.left') as HTMLDivElement;
		const onResize = () =>
			this.header.classList.toggle('compact', isOverflowing(left));
		const observer = new ResizeObserver(() => onResize());
		observer.observe(this.content);
		onResize();
	}
	private hideBanner() {
		localStorage.setItem("banner-hidden", "true");
		this.banner.classList.toggle("visible", false);
		setTimeout(() => this.banner.remove(), 1000);
	}
	private isBannerHidden() {
		return localStorage.getItem("banner-hidden") === "true";
	}

	protected override onDisplay(): void | Promise<void> {
		if (this.banner) {
			if (this.isBannerHidden())
				this.hideBanner();
			else this.banner.classList.toggle("visible", !this.isBannerHidden());
			this.banner.querySelector("&>span")?.addEventListener("click", () => this.hideBanner());
		}
		this.listenForOverflow();
		this.listenForScroll();
	}
}