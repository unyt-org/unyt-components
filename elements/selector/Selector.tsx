import { Component } from "uix/components/Component.ts";
import { Icon } from "../icon/Icon.tsx";
import { Path } from "datex-core-legacy/utils/path.ts";
import { blankTemplate, template } from "uix/html/template.ts"
import { style } from "uix/html/style.ts"
import { getLiveNodes } from "uix/hydration/partial.ts";

export type SelectorOptions = {
	value?: string | Ref<string>;
	label?: HTMLElement | string;
	keepOpen?: boolean;
	hideChevron?: boolean;
	hideCheck?: boolean;
	closeDelay?: number;
	openOnHover?: boolean;
	style?: Record<string, string | number>;
	appearance?: "default" | "filter",
	positionX?: "left" | "right";
	positionY?: "top" | "bottom";
	marginX?: number;
	marginY?: number;
}

export const Selector = blankTemplate<SelectorOptions & {children?: any}>(function(props) {
	const options = [...props.children].map((option) => {
		if (option instanceof HTMLOptionElement)
			return <div 
				class="option"
				data-value={option.getAttribute("value")}>
					<div class="content">
						{...(option.childNodes as unknown as HTMLElement[])}
					</div>
					{!props.hideCheck ? <Icon name="fa-check"/> : undefined}
			</div> as HTMLElement
		return option as HTMLElement;
	});
	const styles=props.style ?? {};
	// @ts-ignore $
	delete props.children;
	// @ts-ignore $
	delete props.style;
	return <SelectorWrapper
		appearance={props.appearance ?? "default"}
		styles={styles}
		{...props as any}
		options={options}/>
});

@template(function({stylesheet, appearance, styles, options, hideChevron, label}) {
	return <shadow-root>
		<link rel="stylesheet" href={"../../theme/unyt.css"}/>
		{stylesheet ? <link rel="stylesheet" href={stylesheet}/> : undefined}
		{options && options.length ? <div part="select" data-appearance={appearance} id="dropdown" class="select">
			{options}
		</div> : null}
		<button data-appearance={appearance} class="value" id="selector" style={styles}>
			{label ?? <div id="label" class="label"/>}
			{!hideChevron ? <Icon id="chevron" name={"fa-chevron-down"}/> : undefined}
		</button>
	</shadow-root>
})
@style("./Selector.css")
@standalone({inheritedFields: ["properties"]})
export class SelectorWrapper extends Component<SelectorOptions & {
	appearance: string,
	styles: Record<string, string | number>,
	stylesheet?: string | Path | URL | null,
	options: HTMLElement[]
}> {
	@id selector!: HTMLButtonElement;
	@id label?: HTMLDivElement;
	@id dropdown!: HTMLDivElement;

	public value!: string | Ref<string>;

	protected override onCreate(): void | Promise<void> {
		// @ts-ignore $
		delete this.properties.options;
		// @ts-ignore $
		delete this.properties.label;
		if (!this.dropdown)
			return;
		this.dropdown.setAttribute("popover", "");
		this.selector.setAttribute("popovertarget", "dropdown");
		const initialOption = this.getOptionByValue(this.properties.value);
		if (!initialOption)
			return;
		if (!this.properties.value) {
			// @ts-ignore $
			this.properties.value = initialOption?.dataset.value ?? undefined
		}
		if (this.label)
			this.label.textContent = initialOption.innerText ?? '';
		initialOption.classList.add("active");
	}

	private setValue(value: string) {
		if (typeof this.value === "string")
			this.value = value;
		else if (this.value)
			(this.value as Ref<string>).val = value;
	}
	private getValue() {
		return typeof this.value === "string" ? this.value : (this.value as Ref<string>)?.val;
	}

	private getOptionByValue(value?: string) {
		const fallback = this.dropdown.querySelector(".option") as HTMLDivElement | undefined;
		if (!value)
			return fallback;
		return this.dropdown.querySelector(`.option[data-value="${value}"]`) as HTMLDivElement ?? fallback;
	}

	private selectValue(value?: string) {
		if (value && this.getValue() === value)
			return;
		const option = this.getOptionByValue(value);
		this.dropdown.querySelectorAll(".option").forEach((other) => other.classList.toggle("active", other === option));
		if (option) {
			if (this.getValue()) this.setValue(value ?? '');
			if (this.label) this.label.textContent = option.innerText ?? '';
		}
	}
	private callbacks: Set<(value: string)=>void> = new Set();
	public onChange(callback: (value: string)=>void) {
		this.callbacks.add(callback);
	}

	private listenForHover() {
		if (!('ontouchstart' in globalThis || navigator.maxTouchPoints > 0)) {
			this.selector.addEventListener("mouseenter", () => {
				this.dropdown.showPopover();
			});
			this.addEventListener("mouseleave", () => {
				this.dropdown.hidePopover();
			});
		}
		globalThis.addEventListener("scroll", () => {
			this.dropdown.hidePopover();
		});
	}

	protected override onDisplay() {
		if (!this.dropdown)
			return;
		if (this.properties.openOnHover)
			this.listenForHover();

		const posX: "left" | "right" | undefined  = this.properties.positionX;
		const posY: "top" | "bottom" | undefined = this.properties.positionY;
		const marginX = this.properties.marginX ?? 0;
		const marginY = this.properties.marginY ?? 0;

		this.dropdown.onbeforetoggle = () => {
			this.dropdown.style.opacity = "0";
		}
		this.dropdown.ontoggle = () => {
			const rect = this.selector.getBoundingClientRect();
			let left = 0, top = 0;
			if (posX === "left")
				left = rect.left - this.dropdown.offsetWidth - marginX;
			else if (posX === "right")
				left = rect.right + marginX;
			else 
				left = rect.left + marginX;
			if (posY == "top")
				top = rect.top - this.dropdown.offsetHeight - marginY;
			else if (posY === undefined)
				top = rect.bottom + marginY;
			else
				top = rect.top + marginY;
			this.dropdown.style.left = `${left}px`;
			this.dropdown.style.top = `${top}px`;
			this.dropdown.style.opacity = "1";
		}

		this.callbacks = new Set();
		if ("Datex" in globalThis) {
			this.value = typeof this.properties.value === "string" ? 
				$(this.properties.value) : 
				this.properties.value ?? $('');
			effect(() => {
				use(this);
				this.selectValue(val(this.value));
				this.callbacks.forEach((callback) => callback(val(this.value)));
			});
		}
		this.dropdown.querySelectorAll<HTMLDivElement>(".option").forEach((option) => {
			option.addEventListener("click", () => {
				this.selectValue(option.dataset.value);
				if (!this.properties.keepOpen)
					setTimeout(() => this.dropdown.hidePopover(), this.properties.closeDelay ?? 0);
			});
		});
	}
}