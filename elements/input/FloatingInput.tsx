import { blankTemplate } from "uix/html/template.ts"

export const FloatingInput = blankTemplate<Partial<HTMLInputElement>>(({placeholder, ...props}) => 
<div class="input-container" stylesheet="./FloatingInput.css?" >
	<span>{placeholder}</span>
	<input 
		{...props as any}
		placeholder = {placeholder}
	/>
</div> as HTMLInputElement
);

