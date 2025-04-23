import { Component } from "uix/components/Component.ts";
import { blankTemplate, template } from "uix/html/template.ts"
export type PopoverOptions = {

}
export const Popover = blankTemplate<PopoverOptions & { children?: any}>(function({children, ...props}) {
	return <PopoverWrapper {...props} content={children}/>
})

@template(function({content}) {
	return <>{content}</>
})
export class PopoverWrapper extends Component<{content?: HTMLElement | HTMLElement[]}> {
	override onCreate() {
		this.setAttribute("popover", "");
	}

	@standalone
	public show() {
		this.showPopover();
	}

	@standalone
	public hide() {
		this.hidePopover();
	}
}