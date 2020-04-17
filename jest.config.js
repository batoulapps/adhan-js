module.exports = {
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An array of file extensions your modules use
  moduleFileExtensions: [
    "js",
    "json",
    "jsx",
    "ts",
    "tsx",
    "node"
  ],

  collectCoverageFrom: [
    "src/**/*.js"
  ],

  // The test environment that will be used for testing
  testEnvironment: "node",
};
