import { Component } from "uix/components/Component.ts";
import { Icon } from "../../elements/icon/Icon.tsx";
import { Popover } from "../popover/Popover.tsx";
import { Button } from "../../elements/button/Button.tsx";

export type CarouselOptions = {
	items?: HTMLElement[];
	disableAutoplay?: boolean;
	disablePauseOnHover?: boolean;
	disableArrows?: boolean;
	disableNavigation?: boolean;
	index?: number;
	navigationColor?: string;
	backgroundColor?: string;
	disablePopover?: boolean;
	style?: Record<string, string | number>;
}

export const Carousel = blankTemplate<CarouselOptions & { children?: any }>(({items, children, ...props}): CarouselWrapper => {
	const list = items ?? children ?? [];
	return <CarouselWrapper {...props} items={list} count={list?.length ?? 0}/> as CarouselWrapper;
});

@template(function({style, disableNavigation, backgroundColor, navigationColor, disableArrows, items}) {
	return <shadow-root>
		<link rel="stylesheet" href={"../../theme/unyt.css"}/>
		<Popover id="popover">
			<div class="popover-content"/>
			<div class="popover-actions">
				<Button id="minus"><Icon name="fa-minus"/></Button>
				<Button id="plus"><Icon name="fa-add"/></Button>
			</div>
		</Popover>
		<div id="carousel" class="unyt-carousel" style={{"--carousel-text-primary": navigationColor ?? ""}} stylesheet={"./Carousel.css"}>
			{disableArrows ? null : <Icon name="fa-chevron-left" id="left"/>}
			<div class="unyt-carousel-content" style={{
				"background": backgroundColor ?? "transparent",
				...((style ?? {}) as Record<string, string>)
			}}>
				<div id="scroller" class="unyt-carousel-scroller"/>
				<div class="unyt-carousel-items" id="items">
					{items}
				</div>
			</div>
			{disableArrows ? null : <Icon name="fa-chevron-right" id="right"/>}
		</div>
		{disableNavigation ? null : <div style={{[navigationColor ? "--ui-color" : ""]: navigationColor}} stylesheet={"./Dots.css"} id="navigation" class="unyt-carousel-navigation">
				{items.map((_, i) => <span class="unyt-carousel-dot" data-index={i}/>)}
		</div>}
	</shadow-root>
})
@standalone({inheritedFields: ["properties"]})
export class CarouselWrapper extends Component<CarouselOptions & {disablePopover?: number, count: number, items: HTMLElement[]}> {
	@id carousel!: HTMLDivElement;
	@id navigation?: HTMLDivElement;
	@id items: HTMLDivElement;
	@id scroller: HTMLDivElement;
	@id left?: HTMLSpanElement;
	@id right?: HTMLSpanElement;
	@id popover?: HTMLDivElement;

	private index = 0;
	private timeout?: number;

	protected override onCreate(): void | Promise<void> {
		// @ts-ignore $
		delete this.properties.items;
	}

	private handleDrag() {
		const getTransformX = (element: HTMLElement) => {
			const style = globalThis.getComputedStyle(element)
			const matrix = new DOMMatrixReadOnly(style.transform);
			return matrix.m41;
		}
		const pointerDrag = (scroller: HTMLElement, items: HTMLElement) => {
			let startOffset: number | undefined = undefined;
			let dragOffset = 0;
			const move = (event: PointerEvent) => {
				if (startOffset == undefined)
					return;
				dragOffset += event.movementX;
				items.style.transform = `translateX(${startOffset + dragOffset}px)`;

				if (Math.abs(dragOffset) > 100) {
					if (dragOffset > 0)
						this.previous();
					else
						this.next();
					release(event);
				}
			};
			const release = (event: PointerEvent) => {
				startOffset = undefined;
				dragOffset = 0;
				scroller.releasePointerCapture(event.pointerId);
				this.items.classList.toggle("dragging", false);
				this.items.style.transform = "";
			}
			if (!this.properties.disablePopover)
				scroller.addEventListener("click", () => {
					this.showPopup();
				});
			scroller.addEventListener("pointerdown", (event: PointerEvent) => {
				items.classList.toggle("dragging", true);
				scroller.setPointerCapture(event.pointerId);
				startOffset = getTransformX(items);
			});
			scroller.addEventListener("pointermove", (event: PointerEvent) => {
				scroller.hasPointerCapture(event.pointerId) && move(event);
			});
			scroller.addEventListener("pointerup", release);
		};
		pointerDrag(this.scroller, this.items);
	}

	private showPopup() {
		if (this.popover?.matches(':popover-open'))
			return;
		this.popover?.querySelector(".popover-content")?.replaceChildren(this.items.children[this.index].cloneNode(true));
		this.popover?.showPopover();

		const img = this.popover?.querySelector("img");
		if (img)
			import("./pinch-zoom.ts").then((zoom) => {
				const panzoom = zoom.default(img, {});
				this.popover!.querySelector<HTMLButtonElement>("#minus")!.onclick = panzoom.zoomOut;
				this.popover!.querySelector<HTMLButtonElement>("#plus")!.onclick = panzoom.zoomIn;
			});
	}

	override onDisplay() {
		this.index = this.properties.index ?? 0;
		this.update();
		this.handleDrag();

		if (!this.properties.disableAutoplay)
			this.startAutoplay();
		if (!this.properties.disablePauseOnHover) {
			this.addEventListener("mouseenter", () => this.stopAutoplay());
			this.addEventListener("mouseleave", () => {
				if (!this.properties.disableAutoplay)
					this.startAutoplay();
			});
		}
		if (this.left)
			this.left.addEventListener("click", () => this.previous());
		if (this.right)
			this.right.addEventListener("click", () => this.next());
		if (this.navigation)
			this.navigation.addEventListener("click", (e) => {
				console.log(e, "click")
				const target = e.target as HTMLElement;
				if (target.classList.contains("unyt-carousel-dot")) {
					const index = parseInt(target.dataset.index!);
					this.setIndex(index);
				}
			});
	}

	private update() {
		this.carousel.style.setProperty("--index", this.index.toString());
		if (this.navigation)
			this.navigation.querySelectorAll<HTMLDivElement>(".unyt-carousel-dot").forEach((dot, i) => {
				dot.classList.toggle("active", i === this.index);

				// SaFarI
				// Like, wtf, Safari is just not updating the style of the dots for some reason
				dot.style.opacity = (i === this.index) ? "0.8" : "0.1";
			});
	}

	public next() {
		this.index = (this.index + 1) % this.properties.count;
		this.update();
	}
	public previous() {
		this.index = (this.index - 1 + this.properties.count) % this.properties.count;
		this.update();
	}
	public setIndex(index: number) {
		this.index = Math.max(0, Math.min(index, this.properties.count - 1));
		this.update();
	}

	public startAutoplay() {
		this.stopAutoplay();
		this.timeout = setInterval(() => this.next(), 5000);
	}
	public stopAutoplay() {
		if (this.timeout) {
			clearInterval(this.timeout);
			this.timeout = undefined;
		}
	}
}