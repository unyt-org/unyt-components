import { Button, type ButtonOptions } from "../../elements/button/Button.tsx";
import { Splitter } from '../splitter/Splitter.tsx';
import { Icon } from "../../elements/icon/Icon.tsx";
import { Component } from "uix/components/Component.ts";

export type AlertOptions = {
	position?: "default" | "left-bottom" | "right-bottom" | "left-top" | "righ-top" | "center-top" | "center-bottom" | "center";
	margin?: number | string,
	padding?: number | string,
	style?: Record<string, string | number>,
	content?: string | HTMLElement,
	image?: string | URL,
	button?: ButtonOptions,
	hidden?: boolean,
	delay?: number,
	disableAnimation?: boolean
}
export const Alert = blankTemplate<AlertOptions & { hidden?: boolean, children?: any }>(function({content, image, button, children, ...props}) {
	const dom = (content || image || button) ? <div class="unyt-alert-content">
		{(image || content) ? <Splitter gap={20}>
			{image ? <div class="unyt-alert-image" data-size="0.1">
				<img src={image}/>
			</div> : null}
			{content ? <span class="description">
				{content}
			</span> : null}
		</Splitter> : null}
		{button ? <Button {...button as any}/> : null}
	</div> : children;

	return <AlertWrapper dom={dom as HTMLElement} {...props}/>;
});

@template(function({dom, padding, style, disableAnimation, hidden, margin, position, ...props}) {
	return <div style={{
		...((style ?? {}) as Record<string, string>),
		[margin ? "--alert-margin" : ""]: margin ?? "0",
		[padding ? "--alert-padding" : ""]: padding ?? "0",
	}} class="unyt-alert" data-animation={!disableAnimation} data-hidden={hidden ? "true" : "initial"} data-position={position ?? false} {...props} id="alert">
		<Icon id="close" name="fa-multiply" class="unyt-alert-close"/>
		{
			dom
		}
	</div>;
})
@standalone({inheritedFields: ["properties"]})
export class AlertWrapper extends Component<{dom: HTMLElement} & AlertOptions> {
	@id alert!: HTMLDivElement;
	@id close!: HTMLSpanElement;
	protected override onCreate(): void | Promise<void> {
		// @ts-ignore $
		delete this.properties.dom;
	}

	protected override onDisplay() {
		this.close.addEventListener("click", () => this.hide());
		if (!this.properties.hidden && !this.isVisible())
			setTimeout(() => this.show(), this.properties.delay ?? 1000);
	}

	public hide() {
		this.setVisible(false);
	}
	public show() {
		this.setVisible(true);
	}
	private setVisible(visible: boolean) {
		this.alert.dataset.hidden = (!visible).toString();
	}
	public isVisible() {
		return this.alert.dataset.hidden === "false";
	}
}