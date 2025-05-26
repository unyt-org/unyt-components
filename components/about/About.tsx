import { LinkOptions } from '../../elements/link/Link.tsx';
import { Splitter } from "../splitter/Splitter.tsx";
import { Button } from '../../elements/button/Button.tsx';
import { Tag } from '../../elements/tag/Tag.tsx';
import { blankTemplate } from "uix/html/template.ts"
export type AboutOptions = {
	heading: string | HTMLElement;
	description: string | HTMLElement;
	tag?: string | HTMLElement;
	link?: LinkOptions;
	image?: string | URL;
}
export const About = blankTemplate<{children?: any} & AboutOptions>((props) => <div stylesheet="./About.css?" class="unyt-about">
	<Splitter>
		<div data-size="1">
			{props.tag ? <Tag>{props.tag}</Tag> : null}
			{props.heading ? <h1>{props.heading}</h1> : null}
			{props.description ? <p>{props.description}</p> : null}
			{props.link ? <Button {...props.link as any}/> : null}
		</div>
		{
			props.image ? <div data-size="1">
				<img src={props.image} alt=""/>
			</div> : null
		}
	</Splitter>
</div>);