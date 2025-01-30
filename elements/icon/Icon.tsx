const IDENTIFIER = "UIX-FA";
export type IconOptions = {
	name: string,
	class?: string | string[]
}
export const Icon = blankTemplate<IconOptions>(({name, ...props}) => {
	const userClasses = Array.isArray(props.class) ? props.class : props.class ? [props.class] : [];
	if (document.head && document.head.querySelector) {
		if (!document.head.querySelector(`link#${IDENTIFIER}`))
			document.head.append(<link
				id={IDENTIFIER}
				href={"https://dev.cdn.unyt.org/uix/style/fontawesome.css"}
				rel={"stylesheet"}/>);
	}
	delete props.class;
	return <span
		class={[`fa ${name}`, ...userClasses].join(" ")}
		{...props}/>
});