import { GradientText } from '../../elements/text/Text.tsx';
import { blankTemplate } from "uix/html/template.ts"

export type AmountCardOptions = {
	heading: string | HTMLElement;
	amount: string | HTMLElement | number;
	color?: string | string[];
	backgroundColor?: string,
	style?: Record<string, string | number>;
	align?: "left" | "center" | "right";
}

export const AmountCard = blankTemplate<AmountCardOptions>(({backgroundColor, color, heading, amount, style, ...props}) => {
	const defaultStyle = {
		[backgroundColor ? "--card-bg-primary" : "--noop"]: backgroundColor ?? "transparent", 
		textAlign: props.align ?? "center",
		...((style ?? {}) as Record<string, string>),
	};
	return <div style={defaultStyle} stylesheet={"./AmountCard.css?"} class="unyt-amount-card" {...props}>
		<h2>{amount}</h2>
		<GradientText colors={color ?? [
			["#d2a8ff", 12], ["#f778ba", 42], ["#ff7b72", 84]
		]}>{heading}</GradientText>
	</div>
});