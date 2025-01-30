import { Component } from "uix/components/Component.ts";
import { Icon } from "../../elements/icon/Icon.tsx";

export type CarouselOptions = {
	items?: HTMLElement[];
	disableAutoplay?: boolean;
	disablePauseOnHover?: boolean;
	disableArrows?: boolean;
	disableNavigation?: boolean;
	index?: number;
	navigationColor?: string;
	backgroundColor?: string;
	style?: Record<string, string | number>;
}

export const Carousel = blankTemplate<CarouselOptions & { children?: any }>(({items, children, ...props}): CarouselWrapper => {
	const list = items ?? children ?? [];
	return <CarouselWrapper {...props} items={list} count={list?.length ?? 0}/> as CarouselWrapper;
});

@template(function({style, disableNavigation, backgroundColor, navigationColor, disableArrows, items}) {
	return <shadow-root>
		<link rel="stylesheet" href={"../theme/unyt.css"}/>
		<div id="carousel" class="unyt-carousel" style={{"--carousel-text-primary": navigationColor ?? ""}} stylesheet={"./Carousel.css"}>
			{disableArrows ? null : <Icon name="fa-chevron-left" id="left"/>}
			<div class="unyt-carousel-content" style={{
				"background": backgroundColor ?? "transparent",
				...((style ?? {}) as Record<string, string>)
			}}>
				<div class="unyt-carousel-items">
					{items}
				</div>
			</div>
			{disableArrows ? null : <Icon name="fa-chevron-right" id="right"/>}
		</div>
		{disableNavigation ? null : <div style={{"--ui-color": navigationColor ?? ""}} stylesheet={"./Dots.css"} id="navigation" class="unyt-carousel-navigation">
				{items.map((_, i) => <span class="unyt-carousel-dot" data-index={i}/>)}
		</div>}
	</shadow-root>
})
@standalone({inheritedFields: ["properties"]})
export class CarouselWrapper extends Component<CarouselOptions & {count: number, items: HTMLElement[]}> {
	@id carousel!: HTMLDivElement;
	@id navigation?: HTMLDivElement;
	@id left?: HTMLSpanElement;
	@id right?: HTMLSpanElement;

	private index = 0;
	private timeout?: number;

	protected override onCreate(): void | Promise<void> {
		// @ts-ignore $
		delete this.properties.items;
	}

	override onDisplay() {
		this.index = this.properties.index ?? 0;
		this.update();

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
			this.navigation.querySelectorAll(".unyt-carousel-dot").forEach((dot, i) => {
				dot.classList.toggle("active", i === this.index);
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