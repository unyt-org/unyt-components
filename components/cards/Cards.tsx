import { Link, type LinkOptions } from "../../elements/link/Link.tsx";
import { Component } from "uix/components/Component.ts";
import { Icon } from "../../elements/icon/Icon.tsx";
import { Tag } from "../../elements/tag/Tag.tsx";
import { blankTemplate, template } from "uix/html/template.ts"

export type CardOptions = {
	heading?: string,
	description?: string,
	link?: LinkOptions,
	tag?: string,
	icon?: string | HTMLElement,
	disableHover?: boolean;
	backgroundColor?: string;
	style?: Record<string, string | number>;
	large?: boolean,
	color?: string,
} & AppearanceOptions;

export type CardsOptions = {
	cards?: CardOptions[],
	minWidth?: number | string,
	gap?: number | string | [number | string, number | string],
	style?: Record<string, string | number>
} & AppearanceOptions;

type AppearanceOptions = {
	appearance: "border";
	border?: string | [string, string];
} | {
	appearance: "shadow" | "no-background" | "feature" | "default";
} | {
	appearance?: never;
};


export const Card = blankTemplate<CardOptions & {apperance?: string, border?: string | [string, string], children?: any}>(({appearance, color, children, backgroundColor, disableHover, heading, description, link, tag, icon, style, ...props}) => {
	return <div style={{
			...((style ?? {}) as Record<string, string>),
			[backgroundColor ? "--card-bg-primary" : "--noop"]: backgroundColor ?? "transparent",
			[color ? "--card-header-color" : "--noop"]: color ?? "transparent",
			"--card-border-start": "border" in props ? (typeof props.border === "string" ? props.border : props.border?.[0] ?? "var(--card-border-primary)") : "transparent",
			"--card-border-end": "border" in props ? (typeof props.border === "string" ? props.border : props.border?.[1] ?? "var(--card-border-primary)") : "transparent",
		}}
		onclick:frontend={() => {
			use("standalone", disableHover, link);
			if (!disableHover && link?.href) 
				globalThis.open(link.href, link.target ?? "_self");
		}}
		data-appearance={appearance ?? "default"}
		data-size={props.large ? "large" : "default"}
		data-disable-hover={disableHover ?? false}
		{...props}
		class={["unyt-card", ...(props.class ? [props.class] : [])].join(" ")}
		// href={link?.href}
		// target={link?.target}
		// heading={link?.label ?? link?.href}
		stylesheet={"./Card.css?"}>
		{(icon ?? tag) ? <header>
			{typeof icon === "string" ? <Icon name={icon}/> : icon}
			{tag ? <Tag>{tag}</Tag> : undefined}
		</header> : null}
		{heading ? <h2>{heading}</h2> : null}
		{description ? <div class="description">{description}</div> : null}
		{link && link.label ? <Link {...link} class="link"/> : undefined}
		{children}
	</div>;
});

export const Cards = blankTemplate<CardsOptions & {children?: any}>(({appearance, gap, style, cards, minWidth, children, ...props}) => {
	return <CardsWrapper style={{
		...((style ?? {}) as Record<string, string>),
		"--card-gap-x": typeof gap === "number" ? gap : gap?.[0] ?? "3rem",
		"--card-gap-y": typeof gap === "number" ? gap : gap?.[1] ?? "3rem",
	}} {...props} appearance={appearance} minWidth={minWidth ?? 200} cards={(children && children.length) ? (children as HTMLDivElement[]).map(e => {
		e.dataset.appearance = appearance ?? "default";
		return e;
	}) : (cards ?? []).map((props) => {
		return <Card {...props as any} appearance={appearance ?? "default"}/> as HTMLDivElement
	})}/>
});

@template(function({cards, appearance, minWidth, ...props}) {
	return <shadow-root>
		<link rel="stylesheet" href={"../../theme/unyt.css"}/>
		<div id="cards"
			data-apperance={appearance ?? "default"}
			stylesheet={"./Cards.css"}
			class={["unyt-cards", ...(props.class ? [props.class] : [])].join(" ")}
			style={{
				"--min-width": typeof minWidth === "number" ? `${minWidth}px` : (minWidth ?? "200px")
			}}>
			{cards}
		</div>
	</shadow-root>
})
export class CardsWrapper extends Component<{class?: string, appearance?: string, cards: HTMLDivElement[], minWidth?: number | string}> {
	@standalone @id cards!: HTMLDivElement;

	@standalone
	protected override onDisplay(): void | Promise<void> {
	}
}