import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";

export type ToggleEvent = CustomEventInit<{checked: boolean, originalEvent: Event}>;
export type ToggleSwitchOptions = {
	checked?: boolean | Ref<boolean>;
	size?: number;
	label?: Ref<string> | string | HTMLElement | {on: Ref<string> | string | HTMLElement, off: Ref<string> | string | HTMLElement};
	ontoggle?: (value: boolean) => void;
}

@template(function({size}) {
	const id = `switch-${crypto.randomUUID()}`;
	const checked = this.properties?.checked ?? false;
	return <div id="toggle-switch" class="unyt-toggle-switch" stylesheet={"./ToggleSwitch.css?"}>
		{this.properties?.label ? <label id="label" class="label" for={id}>
			{this.getLabel(val(checked))}
		</label> : null}
		<label class="toggle-switch" for={id} style={{
			[size ? "--size" : "--noop"]: size ?? 0
		}}>
			<input
				id={id}
				type="checkbox"
				checked={checked}/>
			<span class="slider"/>
		</label>
	</div>
})

@standalone({inheritedFields: ["properties"]})
export class ToggleSwitch extends Component<ToggleSwitchOptions> {
	@id label!: HTMLElement;

	protected override onCreate(): void | Promise<void> {
		if (this.properties.label instanceof Element)
			// @ts-ignore $
			delete this.properties.label;
	}

	private getSwitch() {
		return this.querySelector<HTMLInputElement>("input[type='checkbox']")!;
	}
	private getLabel(checked?: boolean) {
		const label = this.properties?.label;
		if (!label)
			return null;
		if (label instanceof HTMLElement || typeof label === "string" || (
			// @ts-ignore $
			globalThis.Datex?.Pointer &&
			// @ts-ignore $
			label instanceof globalThis.Datex?.Pointer
		)) return label as HTMLElement | string;
		const isChecked = checked === undefined ? this.isChecked() : checked;
		return isChecked ? 
			label.on :
			label.off ?? '';
	}
	
	public setChecked(val: boolean) {
		const input = this.getSwitch();
		if (input)
			input.checked = val;
		this.updateLabel();
	}

	public isChecked(): boolean {
		const input = this.getSwitch();
		return input?.checked ?? false;
	}

	public onToggle(callback: (value: boolean)=>void) {
		this.addEventListener("toggle", (_: ToggleEvent) => callback(this.isChecked()));
	}

	private updateLabel() {
		if (this.label) {
			const newLabel = this.getLabel();
			if (newLabel !== null)
				this.label.replaceChildren((newLabel ?? '') as string);
		}
	}

	protected override onDisplay(): void|Promise<void> {
		if (this.properties.ontoggle)
			this.onToggle((e) => this.properties.ontoggle!(e));
		this.getSwitch()?.addEventListener("input", (e) => {
			this.updateLabel();
			e.stopImmediatePropagation();
			this.dispatchEvent(new CustomEvent("toggle", {
				detail: {
					checked: this.isChecked(),
					originalEvent: e
				}
			}));
		});
	}
}