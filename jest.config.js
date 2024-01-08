/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	testRegex: ".*\\.spec\\.ts$",
};
