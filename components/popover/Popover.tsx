import { Component } from "uix/components/Component.ts";
import { ScrollManager } from "./ScrollManager.ts";
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
	

	@standalone
	override async onDisplay() {
		let scrollManager: ScrollManager | undefined = globalThis.unytScrollManager;
		if (!scrollManager) {
			const { ScrollManager } = await import("./ScrollManager.ts");
			globalThis.unytScrollManager = scrollManager = new ScrollManager();
		}
		const element = document.createElement("div");
		element.classList.add("unyt-popover-backdrop");
		this.addEventListener("toggle", (event) => {
			document.body.querySelectorAll(".unyt-popover-backdrop").forEach(e => e.remove());
			if (event.newState === "open") {
				document.body.appendChild(element);
				scrollManager?.disableScroll();
			} else {
				scrollManager?.enableScroll();
			}
		});
	}
}