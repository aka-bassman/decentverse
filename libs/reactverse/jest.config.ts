module.exports = {
  displayName: "reactverse",
  preset: "../../jest.preset.ts",
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../coverage/libs/reactverse",
};
