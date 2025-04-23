import { blankTemplate } from "uix/html/template.ts"
export type SplitterOptions = {
	reverse?: boolean;
	horizontal?: boolean;
	vertical?: boolean;
	align?: "start" | "center" | "end";
	style?: Record<string, string | number>;
	gap?: number | string | [number | string, number | string],
}
export const Splitter = blankTemplate<SplitterOptions & { children?: any }>(({gap, align, reverse, children, horizontal, vertical, style, ...props}) => {
	const direction = horizontal ? "row" : vertical ? "column" : "row";
	(children as HTMLElement[]).forEach(child => {
		if (child && child.style && child.dataset)
			child.style.flex = child.dataset.size ?? "1";
	});
	const alignment = align === "center" ? "center" : align === "end" ? "flex-end" : "flex-start";
	return <div stylesheet={"./Splitter.css?"}
		style={{
			"flex-wrap": (horizontal || vertical) ? "nowrap" : "wrap",
			"flex-direction": direction + (reverse ? "-reverse" : ""),
			"align-items": alignment,
			"--gap-x": typeof gap === "number" ? gap : gap?.[0] ?? "40px",
			"--gap-y": typeof gap === "number" ? gap : gap?.[1] ?? "100px",
			...((style ?? {}) as Record<string, string>),
		}}
		{...props}
		class={["unyt-splitter", ...(props.class ? [props.class] : [])].join(" ")}>
		{children}
	</div>
});