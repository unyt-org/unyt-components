import { Component } from "uix/components/Component.ts";
import { Card } from "../cards/Cards.tsx";
import { Splitter } from '../splitter/Splitter.tsx';
import { Button } from "../../elements/button/Button.tsx";
import { Input } from "../../elements/input/Input.tsx";
import { template } from "uix/html/template.ts"

export type NewsletterBoxOptions = {
	backgroundColor?: string,
	style?: Record<string, string | number>
}

@template(function({backgroundColor}) {
	const newsletterId = crypto.randomUUID();
	return <shadow-root>
		<div stylesheet="NewsletterBox.css" class="unyt-newsletter-box">
			<Card disableHover appearance="border" backgroundColor={backgroundColor ?? "var(--unyt-bg-primary)"} border={["#c3abf0", "#e4767b"]}>
				<Splitter gap={30}>
					<div class="information">
						<h1 class="large">Subscribe to the unyt newsletter</h1>
						<span>Get updates and opportunities from across the unyt.org organization and community.</span>
					</div>
					<form id="form">
						<Splitter gap={10}>
							<Input id="email" required data-size={"2"} type="email" placeholder={"Your email address"} class="email"/>
							<div data-size="1">
								<Button disabled id="button">Abbonieren</Button>
							</div>
						</Splitter>
						<Splitter gap={10}>
							<Input required id={"unyt-newsletter-"+newsletterId} data-size={"1"} type="checkbox" class="privacy"/>
							<label data-size="10" for={"unyt-newsletter-"+newsletterId}>
								Voluptate ipsum qui consectetur exercitation duis tempor et mollit occaecat nulla amet quis. 
							</label>
						</Splitter>
					</form>
				</Splitter>
			</Card>
		</div>
	</shadow-root>
})
@standalone
export class NewsletterBox extends Component<NewsletterBoxOptions> {
	@id button!: HTMLButtonElement;
	@id form!: HTMLFormElement;
	@id email!: HTMLInputElement;

	private update() {
		this.button.disabled = this.form.reportValidity();
	}
	protected override onDisplay(): void | Promise<void> {
		this.email.addEventListener("change", () => {
			this.update();
		});

		// deno-lint-ignore no-extra-non-null-assertion
		this.shadowRoot?.querySelector(".privacy")!.addEventListener("change", () => {
			this.update();
		});

		this.button.addEventListener("click", () => {
			this.update();
		})
	}
}