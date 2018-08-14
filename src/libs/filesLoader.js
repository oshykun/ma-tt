const fs   = require('fs');
const path = require('path');

class FilesLoader {

	constructor(logger) {
		this._logger = logger;
		this._logger.debug(`${FilesLoader.name} - constructor`);
	}

	loadFilesSync(folderPath, excludeFiles = [], toSort) {
		let files = loadFolderRecursive(folderPath, excludeFiles, toSort);

		if (toSort) {
			files.sort(sortFiles);
		}

		return files.map(file => require(`${file}`));
	};
}

const loadFolderRecursive = (folderPath, excludeFiles = []) => {
	return fs.readdirSync(folderPath)
			 .reduce((result, file) => {
				 let fullPath = `${folderPath}/${file}`;
				 if (excludeFiles.includes(file)) {
					 return result;
				 }
				 let stat = fs.statSync(fullPath);
				 if (stat && stat.isDirectory()) {
					 result = result.concat(loadFolderRecursive(fullPath, excludeFiles));
				 }
				 if (path.extname(file) === '.js') {
					 result.push(fullPath);
				 }
				 return result;
			 }, []);
};

const sortFiles = (filePathA, filePathB) => {
	let fileA = filePathA.substring(filePathA.lastIndexOf('/') + 1, filePathA.length);
	let fileB = filePathB.substring(filePathB.lastIndexOf('/') + 1, filePathB.length);

	let aa = parseInt(fileA, 10);
	let bb = parseInt(fileB, 10);
	return aa - bb;
};

FilesLoader.diProperties = { name: 'filesLoader', type: 'class', singleton: true };
FilesLoader.inject       = ['logger'];

module.exports = FilesLoader;
