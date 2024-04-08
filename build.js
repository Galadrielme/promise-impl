const fs = require("fs");
const path = require("path");
const { exec } = require('child_process');
const json = require("./package.json");
const chalk = require("chalk");

{
    main();
}

async function main () {
    await Promise.all([
        initializePackageJson(),
        syncPackageVersion(),
        execCommand("tsc"),
        execCommand("npm run build:dev"),
        execCommand("npm run build:pro"),
        copyFilesToDist()
    ]).then(() => {
        console.log(chalk.blueBright("finish!!!"));
    }, (error) => {
        console.log(chalk.redBright("error!!!", error));
    });
}

/**
 * 同步package.json的version到项目内
 */
function syncPackageVersion () {
    const path = './src/version.ts';
    const time = (new Date()).toUTCString();
    const version = json.version;
    const promise = copyFile(path, path, content => {
        content = content.replace(/@since.*\n/, () => {
            return `@since ${ time }` + "\n";
        });
        content = content.replace(/export default.*(\n|$)/, () => {
            return `export default ${ JSON.stringify(version) };` + "\n";
        });
        return content;
    });
    promise.then(() => {
        console.log(chalk.greenBright("syncPackageVersion success:"), json.version, "@", time);
    });
    return promise;
}

/**
 * 复制文件到dist中
 */
function copyFilesToDist () {
    const isExpectFileName = (filepath) => /(\.js|\.d\.ts)$/.test(filepath);
    const files = [
        "LICENSE",
        "tsconfig.json",
        "main.js",
        "main.d.ts",
        "README.md",
        ...scanDirectory("./src", isExpectFileName)
    ];
    files.forEach(filepath => {
      copyFile(`./${ filepath }`, `./dist/${ filepath }`);
    })
}

/**
 * 初始化package.json
 */
function initializePackageJson () {
    const promise = copyFile(null, "./dist/package.json", () => {
        const packageJson = { ...json };
        {
          delete packageJson.scripts;
          delete packageJson.devDependencies;
        }
        return JSON.stringify(packageJson, null, 2);
    });

    return promise;
}

/**
 * 执行指令
 */
function execCommand (command) {
    const promise = new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            if (stdout) {
                resolve(stdout);
                return;
            }
            if (stderr) {
                reject(stderr);
                return;
            }
        });
    });
    promise.then(
      (stdout) => {
        console.log(chalk.greenBright(`exec ${ command } success:`), stdout);
      },
      (stderr) => {
        console.error(chalk.redBright(`exec ${ command } error:`), stderr);
      }
    )
    return promise;
}

/**
 * 复制文件
 */
function copyFile (from, to, update) {
    return new Promise((resolve, reject) => {
        let content = "";
        
        if (from) {
            content = fs.readFileSync(from).toString();
        }
        if (typeof update === "function") {
          content = update(content);
        }
        
        fs.writeFile(to, content, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(content);
        });
    });
}

/**
 * 扫描文件夹
 * 
 * @param { string } directory 
 * @param { string } match 
 */
function scanDirectory(directory, match) {
    const results = [];
    fs.readdirSync(directory).forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.lstatSync(fullPath);
        if (stat.isDirectory()) {
            // 递归扫描子目录
            const subResults = scanDirectory(fullPath, match);
            if (subResults.length > 0) {
                results.push(...subResults);
            }
        } else {
            if (match(fullPath)) {
                results.push(fullPath);
            }
        }
    });
    return results;
}