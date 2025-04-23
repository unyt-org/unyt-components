import { blankTemplate } from "uix/html/template.ts"

export const Input = blankTemplate<Partial<HTMLInputElement>>((props) =>
  <input 
	stylesheet="./Input.css?" 
	{...props as any}
	class={["unyt-input", ...(props.class ? [props.class] : [])].join(" ")}
/> as HTMLInputElement
);

