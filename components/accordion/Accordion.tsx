import { Component } from "uix/components/Component.ts";
import { type LinkOptions, Link } from "../../elements/link/Link.tsx";

export type AccordionOptions = {
	left?: boolean;
	right?: boolean;
	allowMultiple?: boolean;
	openFirst?: boolean;
	items?: {
		opened?: boolean;
		title: string;
		content: string;
		link?: LinkOptions
	}[]
}

export const Accordion = blankTemplate(function(props: {children?: any[] } & AccordionOptions) {
	const children = props.items ? [
		...props.items.map((item, index) => <details {...((item.opened || (index === 0 && props.openFirst)) ? {open: ""} : {})}>
			<summary>{item.title}</summary>
			<div class="content">
				<p>{item.content}</p>
				{item.link ? <Link {...item.link} class="link"/> : undefined}
			</div>
		</details>)
	] : props.children;
	// @ts-ignore $
	delete props.children;
	return <AccordionWrapper {...props} items={children ?? []}/>
});

@template(function({allowMultiple, items, left, right}) {
	return <shadow-root>
		<link rel="stylesheet" href={"../theme/unyt.css"}/>
		<div id="items" class="items" data-multiple={allowMultiple ?? false} data-dir={(!left && !right) ? "right" : left ? "left" : "right"}>
			{items}
		</div>
	</shadow-root>
})
export class AccordionWrapper extends Component<AccordionOptions & {items: HTMLDetailsElement[]}> {
	@standalone @id items!: HTMLDivElement;

	protected override onCreate(): void | Promise<void> {
		// @ts-ignore $
		delete this.properties.options;
	}

	@standalone
	protected override onDisplay(): void | Promise<void> {
		if (!("multiple" in this.items.dataset)) {
			const details = this.items.querySelectorAll<HTMLDetailsElement>("details");
			details.forEach((detail) => {
				detail.addEventListener("toggle", () => {
					if (detail.open)
						details.forEach((otherDetail) => {
							if (otherDetail !== detail)
								otherDetail.open = false;
						});
				});
			});
		}
	}
}