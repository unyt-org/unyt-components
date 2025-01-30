export type TimelineItemOption = {
	title?: string | HTMLElement;
	description?: string | HTMLElement;
}
export type TimelineOptions = {
	items?: TimelineItemOption[];
	gap?: number | string;
	offsetX?: number | string;
	offsetY?: number | string;
	bulletSize?: number | string;
	bulletOffset?: number | string;
}

export const TimelineItem = blankTemplate<TimelineItemOption & { children?: any }>(({title, description, children, ...props}) => 
	<div class="unyt-timeline-item" {...props}>
		{title ? <h3>{title}</h3> : null}
		{description ? <p>{description}</p> : null}
		{children}
	</div>
);

export const Timeline = blankTemplate<TimelineOptions & { children?: any }>(({style, bulletOffset, gap, offsetX, offsetY, bulletSize, items, children, ...props}) => 
	<div stylesheet="./Timeline.css" class="unyt-timeline"  style={{
		[gap ? "--timeline-gap" : ""]: gap ?? "0",
		[offsetX ? "--timeline-offset-x" : ""]: offsetX ?? "0",
		[offsetY ? "--timeline-offset-y" : ""]: offsetY ?? "0",
		[bulletSize ? "--timeline-bullet-size" : ""]: bulletSize ?? "0",
		[bulletOffset ? "--timeline-bullet-offset" : ""]: bulletOffset ?? "0",
		...((style ?? {}) as Record<string, string>),
	}} {...props}>
		{children && children.length ? children : (items ?? []).map(({title, description}) => 
			<TimelineItem title={title as string} description={description}/>)}
	</div>
);