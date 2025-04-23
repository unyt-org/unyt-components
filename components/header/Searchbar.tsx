import { Icon } from "../../elements/icon/Icon.tsx";
import { ThemeSwitcher } from "../theme-switcher/ThemeSwitcher.tsx";
import { blankTemplate } from "uix/html/template.ts"

export type SearchbarOptions = {
	disableThemeSwitch?: boolean;
	disableLink?: boolean;
	linkLabel?: string;
	linkTarget?: URL | string;
	searchbarPlaceholder?: string;
	searchbarSize?: number | string;
	value?: string | number | Ref<number | string>;
}
export const Searchbar = blankTemplate<SearchbarOptions>(({value, searchbarSize, searchbarPlaceholder, disableLink, disableThemeSwitch, linkLabel, linkTarget, ...props}) => 
	<div {...props} class="searchbar">
		{disableLink ? null : <span>
			<Icon name="fa-arrow-up-right-from-square"/>
			<a target="_blank" href={linkTarget ?? "https://unyt.org"}>{linkLabel ?? "unyt.org"}</a>
		</span>}
		<div class="searchbox">
			<input value={value} id="search-input" style={{
				minWidth: searchbarSize ? searchbarSize : "250px",
			}} name="search" type="search" placeholder={searchbarPlaceholder ?? "Search"}/>
			<button id="search-button">
				<Icon name="fa-search"/>
			</button>
		</div>
		{disableThemeSwitch ? null : <ThemeSwitcher compact/>}
	</div>
);