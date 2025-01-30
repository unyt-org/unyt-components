import { Link, type LinkOptions } from "../../elements/link/Link.tsx";
import { Component } from "uix/components/Component.ts";
import { Icon } from "../../elements/icon/Icon.tsx";
import { Tag } from "../../elements/tag/Tag.tsx";

export type CardOptions = {
	title?: string,
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


export const Card = blankTemplate<CardOptions & {apperance?: string, border?: string | [string, string], children?: any}>(({appearance, color, children, backgroundColor, disableHover, title, description, link, tag, icon, style, ...props}) => {
	const Elem = (disableHover && !link) ? "div" : "a";
	return <Elem style={{
			...((style ?? {}) as Record<string, string>),
			[backgroundColor ? "--card-bg-primary" : ""]: backgroundColor ?? "transparent",
			[color ? "--card-header-color" : ""]: color ?? "transparent",
			"--card-border-start": "border" in props ? (typeof props.border === "string" ? props.border : props.border?.[0] ?? "var(--card-border-primary)") : "transparent",
			"--card-border-end": "border" in props ? (typeof props.border === "string" ? props.border : props.border?.[1] ?? "var(--card-border-primary)") : "transparent",
		}}
		data-appearance={appearance ?? "default"}
		data-size={props.large ? "large" : "default"}
		data-disable-hover={disableHover ?? false}
		class={"unyt-card"}
		href={link?.href}
		target={link?.target}
		title={link?.label ?? link?.href}
		stylesheet={"./Card.css"}
		{...props}>
		{(icon ?? tag) ? <header>
			{typeof icon === "string" ? <Icon name={icon}/> : icon}
			{tag ? <Tag>{tag}</Tag> : undefined}
		</header> : null}
		{title ? <h2>{title}</h2> : null}
		{description ? <div class="description">{description}</div> : null}
		{link && link.label ? <Link {...link} class="link"/> : undefined}
		{children}
	</Elem> as HTMLDivElement;
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

@template(function({cards, appearance, minWidth}) {
	return <shadow-root>
		<link rel="stylesheet" href={"../theme/unyt.css"}/>
		<div id="cards"
			data-apperance={appearance ?? "default"}
			stylesheet={"./Cards.css"}
			class={"unyt-cards"}
			style={{
				"--min-width": typeof minWidth === "number" ? `${minWidth}px` : (minWidth ?? "200px")
			}}>
			{cards}
		</div>
	</shadow-root>
})
export class CardsWrapper extends Component<{appearance?: string, cards: HTMLDivElement[], minWidth?: number | string}> {
	@standalone @id cards!: HTMLDivElement;

	@standalone
	protected override onDisplay(): void | Promise<void> {
	}
}