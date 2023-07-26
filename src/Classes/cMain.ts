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

  getKey(value: string): string {
    this.props.forEach((val, key) => {
      if (val === value) {
        return key;
      }
    });
    return '';
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
      const cols = require('../dist-electron/resource.json');
      this.props = new Map(Object.entries(cols));
    }
    else {
      console.log(rsPath);
      mkdirSync(rsPath);
      let reqHeader = new Headers();
      reqHeader.append('Content-Type', 'text/xml');
      let initObject = {
        method: 'GET', headers: reqHeader,
      };
      const url = `https://raw.githubusercontent.com/microsoft/winget-cli/release-${this.wgVersion}/Localization/Resources/${this.wgLocale}/winget.resw`
      console.log(url);
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
      console.log(resFile);
      writeFileSync(resFile, js, {
        flag: 'w',
      });
    }
  }

  downloadWGRes(version: string, locale: string) {
    execCommand('');
  }
}
