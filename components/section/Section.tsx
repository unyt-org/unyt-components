import { Tag } from "../../elements/tag/Tag.tsx";

export type SectionOptions = {
	title?: string | HTMLElement;
	description?: string | HTMLElement;
	backgroundColor?: string;
	pos?: "left" | "right" | "center";
	align?: "left" | "right" | "center";
	tag?: string | HTMLElement;
	large?: boolean;
	medium?: boolean;
}
export const Section = blankTemplate<SectionOptions & {children?: any }>(({medium, description, backgroundColor, large, tag, pos, align, title, children, ...props}) => 
	<section {...props} style={{
		"--section-bg": backgroundColor ?? "transparent",
	}} data-size={large ? "large" : medium ? "medium" : "default"} data-pos={pos ?? "center"} data-align={align ?? "center"} stylesheet="./Section.css">
		<div class="inner">
			{tag ? <Tag>{tag}</Tag> : null}
			{title ? <h1 class={large ? "large" : ""}>{title}</h1> : null}
			{description ? <span class={"description"}>{description}</span> : null}
			<div class="content">
				{children}
			</div>
		</div>
	</section>
);