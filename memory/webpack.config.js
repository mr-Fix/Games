import HTMLWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "url";

export default {
   entry: join(dirname(fileURLToPath(import.meta.url)), "/src/main.js"),
   output: { 
      path: join(dirname(fileURLToPath(import.meta.url)), "build"),
      clean: true,
   },

   plugins: [
      new HTMLWebpackPlugin({
         template: resolve(dirname(fileURLToPath(import.meta.url)), "index.html"),
      }),

      new CopyPlugin({
         patterns: [
            {
               from: join(resolve(dirname(fileURLToPath(import.meta.url)), "assets")),
               to: resolve(dirname(fileURLToPath(import.meta.url)), "build/assets"),
            },
         ],
      }),
   ],

   module: {
      rules: [
         {
            test: /\.js$/,
            exclude: /node_modules/,
            use: ["babel-loader"],
         },
         // {
         //    test: /\.(jpg|jpeg|png|svg|gif)$/i,
         //    type: "asset/resource",
         // },
      ],
   },

   devServer: {
      static: {
         directory: join(dirname(fileURLToPath(import.meta.url)), "src/assets"),
      },
      compress: false,
      port: 9000,
      hot: true,
   },
};
