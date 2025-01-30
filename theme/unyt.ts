import { Theme } from "uix/base/theme-manager.ts";
import { Path } from "datex-core-legacy/utils/path.ts";
export const unytLight = {
	name: "unyt-light",
	mode: "light",
	stylesheets: [new Path("./unyt.css"), new Path("./unyt-light.css")],
	appColor: '#212121'
} satisfies Theme;

export const unytDark = {
	name: "unyt-dark",
	mode: "dark",
	stylesheets: [new Path("./unyt.css"), new Path("./unyt-dark.css")],
	appColor: '#212121'
} satisfies Theme;