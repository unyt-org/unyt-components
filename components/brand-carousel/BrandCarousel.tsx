export type BrandCarouselOptions = {
	gap?: number | string;
	style?: Record<string, string | number>;
}

export const BrandCarousel = blankTemplate<{children?: any} & BrandCarouselOptions>(({children, style, gap, ...props}) => 
	<div stylesheet="./BrandCarousel.css?" class="unyt-brand-carousel"  {...props} style={{
		...((style ?? {}) as Record<string, string>),
		[gap ? "--brand-carousel-gap" : ""]: gap ?? "",
	}}>
		<div class="unyt-brand-container unyt-brand-container-1">
			{children.map((child: HTMLElement) => child.cloneNode(true))}
		</div>
		<div class="unyt-brand-container unyt-brand-container-2">
			{children.map((child: HTMLElement) => child.cloneNode(true))}
		</div>
	</div>
);