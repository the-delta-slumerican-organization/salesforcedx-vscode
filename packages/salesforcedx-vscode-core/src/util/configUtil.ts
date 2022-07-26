/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {
  ConfigAggregator,
  ConfigFile,
  ConfigValue,
  Global
} from '@salesforce/core';
import * as path from 'path';
import { telemetryService } from '../telemetry';
import { getRootWorkspacePath } from './index';

export enum ConfigSource {
  Local,
  Global,
  None
}

function isNullOrUndefined(value: any) {
  return value === null || value === undefined;
}

function isUndefined(value: any) {
  return value === undefined;
}

// This class should be reworked or removed once the ConfigAggregator correctly checks
// local as well as global configs. It's also worth noting that ConfigAggregator, according
// to its docs checks local, global and environment and, for our purposes, environment may
// not be viable.

export class ConfigUtil {
  public static async getConfigSource(key: string): Promise<ConfigSource> {
    let value = await ConfigUtil.getConfigValue(key, ConfigSource.Local);
    if (!isNullOrUndefined(value)) {
      return ConfigSource.Local;
    }
    value = await ConfigUtil.getConfigValue(key, ConfigSource.Global);
    if (!isNullOrUndefined(value)) {
      return ConfigSource.Global;
    }
    return ConfigSource.None;
  }

  public static async getConfigValue(
    key: string,
    source?: ConfigSource.Global | ConfigSource.Local
  ): Promise<ConfigValue | undefined> {
    if (isUndefined(source) || source === ConfigSource.Local) {
      try {
        const rootPath = getRootWorkspacePath();
        const myLocalConfig = await ConfigFile.create({
          isGlobal: false,
          rootFolder: path.join(rootPath, Global.SF_STATE_FOLDER),
          filename: 'config.json'
        });
        const localValue = myLocalConfig.get(key);
        if (!isNullOrUndefined(localValue)) {
          return localValue;
        }
      } catch (err) {
        telemetryService.sendException('get_config_value_local', err.message);
        return undefined;
      }
    }
    if (isUndefined(source) || source === ConfigSource.Global) {
      try {
        const aggregator = await ConfigAggregator.create();
        const globalValue = aggregator.getPropertyValue(key);
        if (!isNullOrUndefined(globalValue)) {
          return globalValue;
        }
      } catch (err) {
        telemetryService.sendException('get_config_value_global', err.message);
        return undefined;
      }
    }
    return undefined;
  }
}
