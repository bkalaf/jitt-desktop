"use strict";
module.exports = {
    plugins: [
        require('postcss-import'),
        require('tailwindcss/nesting'),
        require('tailwindcss'),
        require('postcss-custom-properties'),
        require('autoprefixer'),
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('postcss-preset-env')({ stage: 1 })
    ]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdGNzcy5jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9wb3N0Y3NzLmNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNiLE9BQU8sRUFBRTtRQUNMLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztRQUN6QixPQUFPLENBQUMscUJBQXFCLENBQUM7UUFDOUIsT0FBTyxDQUFDLGFBQWEsQ0FBQztRQUN0QixPQUFPLENBQUMsMkJBQTJCLENBQUM7UUFDcEMsT0FBTyxDQUFDLGNBQWMsQ0FBQztRQUN2Qiw4REFBOEQ7UUFDOUQsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUM7S0FDOUM7Q0FDSixDQUFBIn0=