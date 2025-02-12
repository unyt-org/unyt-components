import { Icon } from "../icon/Icon.tsx";

export type QuantityAdjusterOptions = {
	min?: number,
	max?: number,
	value?: number
}
export const QuantityAdjuster = blankTemplate<QuantityAdjusterOptions>(function({min, max, value, ...props}) {
	return <div  {...props} stylesheet={"./QuantityAdjuster.css?"} class="unyt-quantity-adjuster">
		<button type="button" onclick:frontend={(e) => {
			// @ts-ignore $
			const input = e.currentTarget?.parentElement.querySelector("input")!;
			const min = input?.getAttribute("min") ?? 0;
			input.value = Math.max(parseInt(input.value) - 1, min);
			input.dispatchEvent(new Event("input"));
		}}><Icon name="fa-minus"/></button>
		<input pattern="[0-9]" min={min ?? 0} max={max ?? null as any} type="number" value={value ?? 0}/>
		<button type="button" onclick:frontend={(e) => {
			// @ts-ignore $
			const input = e.currentTarget.parentElement.querySelector("input")!;
			const max = input?.getAttribute("max") ?? Infinity;
			input.value = Math.min(parseInt(input.value) + 1, max);
			input.dispatchEvent(new Event("input"));
		}}><Icon name="fa-add"/></button>
	</div>
})