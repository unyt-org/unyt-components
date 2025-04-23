import { blankTemplate } from "uix/html/template.ts"
export type BannerOptions = {
	title: string | HTMLElement,
	subtitle?: string | HTMLElement,
	backgroundColor?: string,
	style?: Record<string, string | number>,
	large?: boolean
}
export const Banner = blankTemplate<BannerOptions & {children?: any}>(props => <div style={{
	...((props.style ?? {}) as Record<string, string>),
	"--banner-bg-primary": props.backgroundColor ?? "transparent"
}} stylesheet={"./Banner.css"} class="unyt-banner" data-size={props.large ? "large" : "default"}>
	<div class="container">
		<h1>{props.title}</h1>
		{props.subtitle ? <span>{props.subtitle}</span> : null}
		<div class="content">
			{props.children}
		</div>
	</div>
</div>);