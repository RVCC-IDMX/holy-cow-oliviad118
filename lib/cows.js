import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import replacer from "./replacer.js";
import { getCustomCowPath } from "./custom-cow-builder.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var textCache = {};
var cowsPath = path.join(__dirname, "../cows");

function cowNamesFromFiles (files) {
	return files.map(function (cow) {
		return path.basename(cow, ".cow");
	});
}

export function get(cow) {
	var text = textCache[cow];

	if (!text) {
		var filePath;

		if (cow.match(/\\/) || cow.match(/\//)) {
			// Full path provided
			filePath = cow;
		} else {
			// Check for custom cow first
			const customPath = getCustomCowPath(cow);
			if (customPath) {
				filePath = customPath;
			} else {
				// Fall back to built-in cows
				filePath = path.join(__dirname, "/../cows", cow) + ".cow";
			}
		}
		text = fs.readFileSync(filePath, "utf-8");
		textCache[cow] = text;
	}

	return function (options) {
		return replacer(text, options);
	};
}

export function list(callback) {
	return new Promise(function (resolve, reject) {
		fs.readdir(cowsPath, function (err, files) {
			if (err) {
				reject(err);
				callback(err);
			} else {
				resolve(files);
				callback(null, cowNamesFromFiles(files));
			}
		});
	});
}

export function listSync() {
	return cowNamesFromFiles(fs.readdirSync(cowsPath));
}
