import { Component } from "uix/components/Component.ts";
import { Icon } from "../icon/Icon.tsx";
import { Path } from "datex-core-legacy/utils/path.ts";

export type SelectorOptions = {
	value?: string | Ref<string>;
	label?: HTMLElement | string;
	keepOpen?: boolean;
	hideChevron?: boolean;
	hideCheck?: boolean;
	closeDelay?: number;
	openOnHover?: boolean;
	style?: Record<string, string | number>;
	appearance?: "default" | "filter"
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
		<link rel="stylesheet" href={"../theme/unyt.css"}/>
		{stylesheet ? <link rel="stylesheet" href={stylesheet}/> : undefined}
		{options && options.length ? <div data-appearance={appearance} id="dropdown" class="select">
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

	public value!: Ref<string>;

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

	private getOptionByValue(value?: string) {
		const fallback = this.dropdown.querySelector(".option") as HTMLDivElement | undefined;
		if (!value)
			return fallback;
		return this.dropdown.querySelector(`.option[data-value="${value}"]`) as HTMLDivElement ?? fallback;
	}

	private selectValue(value?: string) {
		if (value && this.value === value)
			return;
		const option = this.getOptionByValue(value);
		this.dropdown.querySelectorAll(".option").forEach((other) => other.classList.toggle("active", other === option));
		if (option) {
			if (this.value) this.value.val = value ?? '';
			if (this.label) this.label.textContent = option.innerText ?? '';
		}
	}
	private callbacks: Set<(value: string)=>void> = new Set();
	public onChange(callback: (value: string)=>void) {
		this.callbacks.add(callback);
	}

	private listenForHover() {
		this.selector.addEventListener("mouseenter", () => {
			this.dropdown.showPopover();
		});
		this.addEventListener("mouseleave", () => {
			this.dropdown.hidePopover();
		});
	}

	protected override async onDisplay() {
		if (!this.dropdown)
			return;
		if (this.properties.openOnHover)
			this.listenForHover();

		this.callbacks = new Set();
		if (!("Datex" in globalThis))
			await import("datex-core-legacy");

		this.value = typeof this.properties.value === "string" ? 
			$(this.properties.value) :
			this.properties.value ?? $('');
		this.dropdown.querySelectorAll<HTMLDivElement>(".option").forEach((option) => {
			option.addEventListener("click", () => {
				this.selectValue(option.dataset.value);
				if (!this.properties.keepOpen)
					setTimeout(() => this.dropdown.hidePopover(), this.properties.closeDelay ?? 0);
			});
		});
		effect(() => {
			use(this);
			this.selectValue(val(this.value));
			this.callbacks.forEach((callback) => callback(val(this.value)));
		});
	}
}