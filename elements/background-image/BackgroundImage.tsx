export type BackgroundImageOptions = {
	dark?: URL | string,
	light?: URL | string,
	mode?: "auto" | "dark" | "light",
	style?: Record<string, string | number>
}
export const BackgroundImage = blankTemplate<BackgroundImageOptions>(({dark, style, light, mode, ...props}) => {
	return <div data-unyt-background-image data-mode={mode ?? "auto"} stylesheet={"./BackgroundImage.css?"} {...props} style={{
		...(style ?? {}) as Record<string, string>,
		"--url-dark": `url(${dark ?? light})`,
		"--url-light": `url(${light ?? dark})`,
		"--image-dark": `var(--unyt-light, var(--url-dark))`,
		"--image-light": `var(--unyt-dark, var(--url-light))`,
	}}/>;
});