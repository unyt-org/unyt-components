import { Link, LinkOptions } from "../link/Link.tsx";
import { blankTemplate } from "uix/html/template.ts"
export type ButtonOptions = {
	primary?: boolean;
	secondary?: boolean;
	transparent?: boolean;
	type?: string;
	style?: Record<string, string | number>;
} & (
	LinkOptions | {
		onclick?: () => void
	}
);

export const Button = blankTemplate<ButtonOptions & Omit<Partial<HTMLButtonElement>, "children" | "style"> & { children?: any }>(props => 
	<button  {...props as any} stylesheet="./Button.css?" data-transparent={props.transparent ?? false} class={["unyt-button", (
		props.type ? props.type : (props.primary ? "primary" : "secondary")
	), ...(props.class ? [props.class] : [])].join(" ")}>
		{"href" in props ? <Link {...props} disableUnderline/> : <div {...props} data-button-content>
			{props.children}
		</div>}
	</button>
);