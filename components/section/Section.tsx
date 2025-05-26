import { Tag } from "../../elements/tag/Tag.tsx";
import { blankTemplate } from "uix/html/template.ts"

export type SectionOptions = {
	heading?: string | HTMLElement;
	description?: string | HTMLElement;
	backgroundColor?: string;
	pos?: "left" | "right" | "center";
	align?: "left" | "right" | "center";
	tag?: string | HTMLElement;
	large?: boolean;
	medium?: boolean;
}
export const Section = blankTemplate<SectionOptions & {children?: any }>(({medium, description, backgroundColor, large, tag, pos, align, heading, children, ...props}) => 
	<section {...props} style={{
		"--section-bg": backgroundColor ?? "transparent",
	}} data-size={large ? "large" : medium ? "medium" : "default"} data-pos={pos ?? "center"} data-align={align ?? "center"} class={["unyt-section", ...(props.class ? [props.class] : [])].join(" ")} stylesheet="./Section.css?">
		<div class="inner">
			{tag ? <Tag>{tag}</Tag> : null}
			{heading ? <h1 class={large ? "large" : ""}>{heading}</h1> : null}
			{description ? <span class={"description"}>{description}</span> : null}
			<div class="content">
				{children}
			</div>
		</div>
	</section>
);