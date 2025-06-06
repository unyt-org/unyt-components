import { template } from "uix/html/template.ts"
export type GradientTextOptions = {
	colors: string | string[] | [string, number][];
	style?: Record<string, string | number>;
}
export const GradientText = template<{children?: any} & GradientTextOptions>(({children, style, colors}) => {
	const fallbackColor = (Array.isArray(colors) ? Array.isArray(colors[0]) ? colors[0][0] : colors[0] : colors) ?? "var(--unyt-text-primary)";
	const fallback = `linear-gradient(100deg, ${fallbackColor}, ${fallbackColor})`;
	const background = (Array.isArray(colors) && colors.length > 1) ? `linear-gradient(100deg, ${
		colors.map((color, index) => {
			const percentage = (index * (100 / (colors.length - 1))).toFixed(2);
			return Array.isArray(color) ? `${color[0]} ${color[1]}%` : `${color} ${percentage}%`;
		}).join(", ")
	})` : Array.isArray(colors) ? fallback : colors ?? fallback;
	return <span style={{
		backgroundColor: "transparent",
		"background-image": background,
		"-webkit-text-fill-color": "transparent",
		"background-clip": "text",
		...(style ?? {} as Record<string, string>)
	}}>
		{children}
	</span>
});