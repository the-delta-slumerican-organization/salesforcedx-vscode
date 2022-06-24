/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as fs from 'fs';

export function isNullOrUndefined(object: any): object is null | undefined {
  if (object === null || object === undefined) {
    return true;
  } else {
    return false;
  }
}

export function extractJsonObject(str: string): any {
  const jsonString = str.substring(
    str.indexOf('{'),
    str.lastIndexOf('}') + 1
  );

  return JSON.parse(jsonString);
}

// There's a bug in VS Code where, after a file has been renamed,
// the URI that VS Code passes to the command is stale and is the
// original URL.  See https://github.com/microsoft/vscode/issues/152993.
//
// To get around this, fs.realpathSync.native() is called to get the
// URI with the actual file name.
export function flushFilePath(filePath: string): string {
  return fs.realpathSync.native(filePath);
}

export function flushFilePaths(filePaths: string[]): string[] {
  for (let i = 0; i < filePaths.length; i++) {
    filePaths[i] = flushFilePath(filePaths[i]);
  }

  return filePaths;
}
