import { Icon } from "../icon/Icon.tsx";
import { ThemeSwitcher } from "../theme-switcher/ThemeSwitcher.tsx";
export type SearchbarOptions = {
	disableThemeSwitch?: boolean;
	disableLink?: boolean;
	linkLabel?: string;
	linkTarget?: URL | string;
	searchbarPlaceholder?: string;
	searchbarSize: number | string;
}
export const Searchbar = blankTemplate<SearchbarOptions>(({searchbarSize, searchbarPlaceholder, disableLink, disableThemeSwitch, linkLabel, linkTarget}) => 
	<div class="searchbar">
		{disableLink ? null : <span>
			<Icon name="fa-arrow-up-right-from-square"/>
			<a target="_blank" href={linkTarget ?? "https://unyt.org"}>{linkLabel ?? "unyt.org"}</a>
		</span>}
		<input style={{
			minWidth: searchbarSize ? searchbarSize : "250px",
		}} name="search" type="search" placeholder={searchbarPlaceholder ?? "Search"}/>
		{disableThemeSwitch ? null : <ThemeSwitcher compact/>}
	</div>
);