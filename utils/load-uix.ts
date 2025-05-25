declare global {
	// deno-lint-ignore no-var
	var uixLoadingPromise: Promise<typeof import("uix")>;
	var UIX: typeof import("uix") | undefined;
}

export const loadUIX = (): Promise<typeof UIX> => {
	if (globalThis.UIX)
		return globalThis.UIX!;
	if (globalThis.uixLoadingPromise) 
		return globalThis.uixLoadingPromise;
	// deno-lint-ignore no-async-promise-executor
	globalThis.uixLoadingPromise = new Promise<void>(async (resolve, reject) => {
		try {
			console.debug("Loading UIX...");
			console.time("uix");
			const { UIX } = await import("uix");
			console.timeLog("uix", "UIX loaded.", UIX);
			resolve(globalThis.UIX ?? UIX);
		} catch (error) {
			console.error("Failed to load UIX.", error);
			reject(error);
		}
	});
	return globalThis.uixLoadingPromise;
};
