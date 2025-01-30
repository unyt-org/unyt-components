export type TestimonialOptions = {
	quote?: string | HTMLElement;
	align?: "center" | "left" | "right";
	author?: {
		name: string;
		title: string;
		subtitle?: string;
		image: string | URL;
	}
};

export const Testimonial = blankTemplate<TestimonialOptions & { children?: any }>(props => 
<div stylesheet="./Testimonial.css" class="unyt-testimonial" style={{
	"align-items": props.align === "center" ? "center" : props.align === "right" ? "flex-end" : "flex-start",
	"text-align": props.align ?? "left",
}}>
	<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24"><path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/></svg>
	<blockquote>{props.quote}</blockquote>
	{props.author ? <div class="author">
		<img src={props.author.image} alt={props.author.name}/>
		<div>
			<h3>{props.author.name}</h3>
			<div>{props.author.title} {props.author.subtitle ? <span>• {props.author.subtitle}</span> : null}</div>
		</div>
	</div> : null}
	{props.children && props.children.length ? <div class="bottom">
		{props.children}
	</div> : null}
</div>);