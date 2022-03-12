// this is a script that does things

const inputs = document.querySelectorAll("input");
const values = {
	env: {
		"UBERDUCK_USERNAME": "",
		"UBERDUCK_SECRET": "",
		"TWITCH_CLIENT_ID": "",
		"TWITCH_SECRET": "",
		"TWITCH_USERNAME": "",
		"MM_API_KEY": ""
	},
	config: {
		"MAX_MSG_LENGTH": 300,
		"MIN_BIT_AMOUNT": 1,
		"BITS_OR_CHANNEL_POINTS": "",
		"CHANNEL_POINTS_REWARD": "",
		"BLACKLISTED_WORDS": [],
		"QUERY_TRIES": 100,
		"FALLBACK_VOICE": "",
		"VOICE_ALIASES": {

		}
	}
};
const output = {
	env: "",
	config: ""
}

inputs.forEach(input => {
	input.addEventListener("input", e => {
		const {target} = e
		const outputType = target.parentElement.parentElement.id // for env or config.json

		let value;

		// this is pretty much only for the blacklisted words field in config.json
		if (target.dataset.type === "array") {
			value = target.value.split(",").map(s => s.trim());
		} else {
			value = target.valueAsNumber || target.value;
		}

		values[outputType][target.name] = value;
		updateOutput(outputType);
	})
})

// see output variable
function updateOutput(outputType) {
	const textArea = document.querySelector(`#${outputType} > * > textarea`)
	output[outputType] = "";

	if (outputType === "env") {
		Object.keys(values.env).forEach(key => {
			output[outputType] += `${key}=${values.env[key]} \n`
		});
	} else if (outputType === "config") {
		// this is bad. really, really bad.
		output[outputType] = JSON.stringify(values.config, null, 2)
			.replaceAll("\n    ", "") // getting the array onto one line
			.replace("\n  ]", "]");
	} else {
		console.error("This isn't supposed to happen!")
	}

	textArea.textContent = output[outputType];
}

// copyable spans
document.querySelectorAll(".copyable").forEach(span => {
	span.dataset.text = "click to copy!"
	span.addEventListener("click", e => {
		navigator.clipboard.writeText(e.target.textContent)
		.then(() => {
			e.target.dataset.text = "copied!"
		})
		.catch(() => {
			e.target.dataset.text = "copy failed…"
		})
	})
	span.addEventListener("mouseout", e => {
		e.target.dataset.text = "click to copy!"
	})
})

// copy button
document.querySelectorAll("button[value=cp]").forEach(button => {
	button.addEventListener("click", e => {
		const {target} = e;
		navigator.clipboard.writeText(target.parentElement.nextElementSibling.textContent)
		.then(() => {
			target.textContent = "copied!"
		})
		.catch(() => {
			target.textContent = "copy failed…"
		})
		button.addEventListener("mouseout", () => {
			target.textContent = "copy"
		})
	})
});

// download button
// <3 https://robkendal.co.uk/blog/2020-04-17-saving-text-to-client-side-file-using-vanilla-js
document.querySelectorAll("button[value=dl]").forEach(button => {
	button.addEventListener("click", e => {
		const {target} = e;
		const {textContent} = target.parentElement.nextElementSibling;
		// if json, use "application/json" type
		const type = target.dataset.saveas.endsWith(".json") ?
			"application/json" : "text/plain"

		if (target.dataset.saveas === ".env") {
			alert(`Just a heads-up: you're going to have to rename the file to ".env" - sorry for the inconvenience!`)
		}

		const a = document.createElement("a");
		const file = new Blob([textContent], {type});

		a.href = URL.createObjectURL(file);
		a.download = target.dataset.saveas; // filename
		a.click();

		URL.revokeObjectURL(a.href);
	})
});

// initial setting of areas
updateOutput("env");
updateOutput("config");
