/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { EOL } from 'os';
import { stub } from 'sinon';
import { OutputChannel, ViewColumn } from 'vscode';

export class MockChannel implements OutputChannel {
  public readonly name = 'MockChannel';
  public value = '';

  public append(value: string): void {
    this.value += value;
  }

  public appendLine(value: string): void {
    this.value += value;
    this.value += EOL;
  }

  public replace(value: string): void {
    this.value = value;
  }

  public clear(): void {}

  // @ts-ignore
  public show(preserveFocus?: boolean): void {}
  // @ts-ignore
  public show(column?: ViewColumn, preserveFocus?: boolean): void {}

  public hide(): void {}
  public dispose(): void {}
}

export const vscodeStub = {
  CancellationTokenSource: class {
    public listeners: any[] = [];
    public token = {
      isCancellationRequested: false,
      onCancellationRequested: (listener: any) => {
        this.listeners.push(listener);
        return {
          dispose: () => {
            this.listeners = [];
          }
        };
      }
    };
    public cancel = () => {
      this.listeners.forEach(listener => {
        listener.call();
      });
    };
    public dispose = () => {};
  },
  commands: stub(),
  Disposable: stub(),
  env: {
    machineId: '12345534'
  },
  Uri: {
    parse: stub()
  },
  ProgressLocation: {
    SourceControl: 1,
    Window: 10,
    Notification: 15
  },
  window: {
    showInformationMessage: () => {
      return Promise.resolve(null);
    },
    showWarningMessage: () => {
      return Promise.resolve(null);
    },
    showErrorMessage: () => {
      return Promise.resolve(null);
    },
    setStatusBarMessage: () => {
      return Promise.resolve(null);
    },
    withProgress: () => {
      return Promise.resolve(true);
    },
    // @ts-ignore
    createOutputChannel: mockChannel => {
      return mockChannel;
    },
    OutputChannel: { show: () => {} }
  },
  workspace: {
    getConfiguration: () => {
      return {
        get: () => true,
        update: () => true
      };
    },
    onDidChangeConfiguration: stub()
  }
};
