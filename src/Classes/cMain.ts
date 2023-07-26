import path from 'node:path'
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { XMLParser } from 'fast-xml-parser';
import { execCommand } from '../Utilities/childProcesses';
import { app } from 'electron';

export class WgProps {
  props: Map<string, string>;
  wgVersion: string = '';
  wgLocale: string = '';

  constructor() {
    this.props = new Map<string, string>();
    this.getLocale();
  }

  getKey(value: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.props.forEach((val, key) => {
        if (val === value) {
          resolve(key);
        }
      });
      reject('');
    })
  }

  async getVersion() {
    try {
      this.wgVersion = await execCommand("winget -v");
    }
    catch (e) {
      this.wgVersion = `Erreur : ${e}`;
    }
  }

  getLocale() {
    var l = app.getLocale();
    this.wgLocale = `${l}-${l.toUpperCase()}`
  }

  async downloadResources() {
    const rsPath: string = path.join(__dirname, this.wgVersion).trim();
    if (existsSync(rsPath)) {
      const file = path.join(rsPath,'resource.json');
      const cols = require(file);
      this.props = new Map(Object.entries(cols));
    }
    else {
      mkdirSync(rsPath);
      let reqHeader = new Headers();
      reqHeader.append('Content-Type', 'text/xml');
      let initObject = {
        method: 'GET', headers: reqHeader,
      };
      const url = `https://raw.githubusercontent.com/microsoft/winget-cli/release-${this.wgVersion}/Localization/Resources/${this.wgLocale}/winget.resw`
      var resp = await fetch(url, initObject);
      var data = await resp.text();
      const options = {
        ignoreAttributes: false,
        tagValueProcessor: (tagName, tagValue: any, jPath, hasAttributes, isLeafNode: boolean) => {
          if (isLeafNode) return tagValue;
          return "";
        }
      };
      const parser = new XMLParser(options);
      const json = parser.parse(data);
      for (var i = 0; i < json.root.data.length; i++) {
        this.props.set(json.root.data[i]["@_name"], json.root.data[i]["value"]);
      }
      var js = JSON.stringify(Object.fromEntries(this.props));
      const resFile = path.join(rsPath, "resource.json");
      writeFileSync(resFile, js, {
        flag: 'w',
      });
    }
  }

  downloadWGRes(version: string, locale: string) {
    execCommand('');
  }
}
