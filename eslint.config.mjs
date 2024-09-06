import neostandard from "neostandard";
import jsPlugin from "@eslint/js";

export default [
    jsPlugin.configs.recommended,
    neostandard.plugins.promise.configs["flat/recommended"],
    ...neostandard({
        semi: true,
        ignores: ["js/lib/**/*", ".pnp*"],
        env: ["browser", "commonjs", "worker", "jquery", "es2021"],
        globals: {
            /* eslint-disable id-length */
            _: "readonly",
            ascii85: "readonly",
            pako: "readonly",
            SharkGame: "readonly",
            Decimal: "readonly",
            DecimalHalfRound: "readonly",
            panzoom: "readonly",

            res: "readonly",
            main: "readonly",
            rec: "readonly",
            gateway: "readonly",
            stats: "readonly",
            world: "readonly",
            home: "readonly",
            tree: "readonly",
            log: "readonly",
            mem: "readonly",
            sharktext: "readonly",
            sharkmath: "readonly",
            sharkcolor: "readonly",
            sharkmisc: "readonly",
            sharktime: "readonly",
            cad: "readonly",
        },
    }),
    {
        rules: {
            "no-unused-vars": [
                "error",
                {
                    varsIgnorePattern: "^__.+$",
                    argsIgnorePattern: "^_.+$",
                    args: "all",
                },
            ],
            "func-style": ["error", "declaration"],
            "no-inner-declarations": "off",
            "prefer-const": "error",
            "no-var": "error",
            "no-shadow": ["error", { builtinGlobals: true, hoist: "all", allow: ["name", "event"] }],
            eqeqeq: ["error", "smart"],
            "id-length": ["error", { min: 3, exceptionPatterns: ["i", "id", "to", "dt", "P", "A", "L", "R", "x", "y", "w", "h"] }],
            "no-fallthrough": ["error", { commentPattern: "fallthrough", reportUnusedFallthroughComment: true }],
            "@stylistic/indent": ["error", 4],
            "@stylistic/quotes": ["error", "double", { avoidEscape: true }],
            "@stylistic/comma-dangle": ["error", "always-multiline"],
            "@stylistic/space-before-function-paren": ["error", { anonymous: "always", named: "never", asyncArrow: "always" }],
        },
    },
];
