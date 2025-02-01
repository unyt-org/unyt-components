export type TagOptions = {
	text?: string | HTMLElement,
	large?: boolean,
	small?: boolean,
	color?: string,
	backgroundColor?: string,
	borderColor?: string | [string, string],
	appearance?: "default" | "special"
}

export const Tag = blankTemplate<TagOptions & {children?: any}>(({appearance, children, large, small, color, backgroundColor, borderColor, text, ...props}) => 
	<span 
		data-size={large ? "large" : small ? "small" : "medium"}
		stylesheet={"./Tag.css"}
		style={{
			[color ? "--tag-text-primary" : ""]: color ?? "transparent",
			[backgroundColor ? "--tag-bg-primary" : ""]: backgroundColor ?? "transparent",
			[borderColor ? "--tag-border-start" : ""]: Array.isArray(borderColor) ? borderColor[0] : (borderColor ?? "transparent"),
			[borderColor ? "--tag-border-end" : ""]: Array.isArray(borderColor) ? borderColor[1] : (borderColor ?? "transparent"),
		}}
		class={["unyt-tag", appearance ?? "default"].join(" ")} {...props}>
		{text}
		{children}
	</span>
);