export type LinkOptions = {
	href: string,
	label?: string,
	target?: "_blank" | "_self" | "_parent" | "_top",
	style?: string,
	disableUnderline?: boolean,
};
export const Link = blankTemplate<{ children?: any } & LinkOptions >(({disableUnderline, children, href, label, target, ...props}) => {
	return <a data-disable-underline={disableUnderline ?? false} title={label ?? href} data-link="unyt-link" stylesheet={"./Link.css"} href={href} target={target} {...props}>
		<span>{(children && children.length) ? Array.from(children) : (label ?? href)}</span>
		<svg class="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none"><path fill="currentColor" d="M7.28033 3.21967C6.98744 2.92678 6.51256 2.92678 6.21967 3.21967C5.92678 3.51256 5.92678 3.98744 6.21967 4.28033L7.28033 3.21967ZM11 8L11.5303 8.53033C11.8232 8.23744 11.8232 7.76256 11.5303 7.46967L11 8ZM6.21967 11.7197C5.92678 12.0126 5.92678 12.4874 6.21967 12.7803C6.51256 13.0732 6.98744 13.0732 7.28033 12.7803L6.21967 11.7197ZM6.21967 4.28033L10.4697 8.53033L11.5303 7.46967L7.28033 3.21967L6.21967 4.28033ZM10.4697 7.46967L6.21967 11.7197L7.28033 12.7803L11.5303 8.53033L10.4697 7.46967Z"></path><path class="part" stroke="currentColor" d="M1.75 8H11" stroke-width="1.5" stroke-linecap="round"></path></svg>
	</a>
});