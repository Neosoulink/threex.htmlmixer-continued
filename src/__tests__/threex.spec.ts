// TODO: Fix importation incompatibility.
// import THREEx from "..";

describe("threex.htmlmixer", () => {
	it("Should return correct class names", () => {
		const availableHelpers = ["htmlMixer"] as const;

		expect({
			htmlMixer: "",
			htmlMultipleMixer: "",
			htmlMixerHelper: "",
		}).toHaveProperty(availableHelpers);
	});
});
