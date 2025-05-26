import { blankTemplate } from "uix/html/template.ts"
export type TimelineItemOption = {
	heading?: string | HTMLElement;
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

export const TimelineItem = blankTemplate<TimelineItemOption & { children?: any }>(({heading, description, children, ...props}) => 
	<div class="unyt-timeline-item" {...props}>
		{heading ? <h3>{heading}</h3> : null}
		{description ? <p>{description}</p> : null}
		{children}
	</div>
);

export const Timeline = blankTemplate<TimelineOptions & { children?: any }>(({style, bulletOffset, gap, offsetX, offsetY, bulletSize, items, children, ...props}) => 
	<div stylesheet="./Timeline.css?" class="unyt-timeline"  style={{
		[gap ? "--timeline-gap" : "--noop"]: gap ?? "0",
		[offsetX ? "--timeline-offset-x" : "--noop"]: offsetX ?? "0",
		[offsetY ? "--timeline-offset-y" : "--noop"]: offsetY ?? "0",
		[bulletSize ? "--timeline-bullet-size" : "--noop"]: bulletSize ?? "0",
		[bulletOffset ? "--timeline-bullet-offset" : "--noop"]: bulletOffset ?? "0",
		...((style ?? {}) as Record<string, string>),
	}} {...props}>
		{children && children.length ? children : (items ?? []).map(({heading, description}) => 
			<TimelineItem heading={heading as string} description={description}/>)}
	</div>
);