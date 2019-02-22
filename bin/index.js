#!/usr/bin/env node

// const download = require('download-git-repo');
// const ora = require('ora');
const program = require('commander');
const execSync = require('child_process').execSync;
const spawn = require('cross-spawn');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const os = require('os');

const packageJson = require('../package.json');

let projectName; // 项目名称

program
	.version(packageJson.version)
	.option('-c, --create <n>', 'create new page')
	.option('-s, --show-gui', 'show gui tool')
	.arguments('<project-directory>')
	.action(name => {
		projectName = name;
	})
    .parse(process.argv);

// 显示GUI工具
if (program.showGui) {
	process.chdir(path.resolve(process.cwd(), 'gui')); // node进程进入gui目录
	spawn.sync('npm', ['run', 'start']); // 运行electron
	return;
}

// 创建新页面
if (program.create) {
	const inProjectRoot = isInProjectRoot();
	if (!inProjectRoot) {
		console.error(chalk.red('please ensure in project root directory!'));
		process.exit(1);
	}
	console.log(`create page ${chalk.green(program.create)}`);
	return;
}

if (typeof projectName === 'undefined') {
	console.error(chalk.red('please provide the project name!'));
	process.exit(1);
}

createApp(projectName);

/**
 * @desc 判断是否在项目根目录
 */
function isInProjectRoot() {
	const currentPath = process.cwd();
	const packagePath = path.join(currentPath, 'package.json');
	return fs.existsSync(packagePath);
}

/**
 * @desc 创建新项目
 */
function createApp(name) {
	const root = path.resolve(name);
	const appName = path.basename(root); // 返回path的最后一部分

	fs.ensureDirSync(name); // 确保目录存在，如果不存在就创建该目录

	console.log(`create a new project in ${chalk.green(root)}`);

	initProjectTemplate(root, appName);
}

/**
 * @desc 初始化项目模板
 */
function initProjectTemplate(appPath, appName) {
	const templatePath = path.resolve(__dirname, '..', 'template');
	if (fs.existsSync(templatePath)) {
	    fs.copySync(templatePath, appPath);

	    const appPackage = require(path.join(appPath, 'package.json'));
	    appPackage.name = appName;
	    
	    // 修改package.json文件
		fs.writeFileSync(
			path.join(appPath, 'package.json'),
			JSON.stringify(appPackage, null, 2) + os.EOL
		);
	} else {
	    console.error(
	      `Could not locate supplied template: ${chalk.green(templatePath)}`
	    );
	    removeProject(appPath, appName);
	}
}
/**
 * @desc 删除项目
 */
function removeProject(appPath, appName) {
	console.log(
      `Deleting ${chalk.cyan(`${appName}`)} from ${chalk.cyan(
        path.resolve(appPath, '..')
      )}`
    );
	process.chdir(path.resolve(appPath, '..')); // 返回上一级目录
    fs.removeSync(path.join(appPath)); // 删除整个项目目录
    console.log('Done.');
    process.exit(1);
}