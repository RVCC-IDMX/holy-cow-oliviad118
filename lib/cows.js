import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import replacer from "./replacer.js";

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
			filePath = cow;
		} else {
			filePath = path.join(__dirname, "/../cows", cow) + ".cow";
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
