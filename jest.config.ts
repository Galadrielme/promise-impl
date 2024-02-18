import type { Config } from "jest";

const config = async (): Promise<Config> => {
    return {
        "bail": 1,
        "verbose": true,
        "collectCoverage": true,
        "extensionsToTreatAsEsm": [".ts"],
        /**
        "fakeTimers": {
            enableGlobally: true
        },
         */
        "collectCoverageFrom": [ 
            "src/**/*.{ts}" 
        ],
        "testMatch": [ 
            "<rootDir>/tests/**/*.test.{js,ts}", 
        ],
        "testEnvironment": "node",
        "moduleFileExtensions": [
            "ts",
            "js"
        ],
        "modulePaths": [
            "<rootDit>"
        ]
    }
}

export default config;