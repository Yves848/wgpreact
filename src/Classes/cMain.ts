import { exec } from "child_process";
import path from 'node:path'
import { writeFileSync } from 'fs';
import { XMLParser } from 'fast-xml-parser';

export class wgProps {
  props : Map<string,string>;
  wgVersion : String;

  constructor (wgVersion : string) {
    this.wgVersion = wgVersion;
    //this.props =  new Map(Object.entries(cols));
    this.props =  new Map<string,string>();
  }

  getKey(value : string) : string {
    this.props.forEach((val,key) => {
      if (val === value) {
        return key;
      }
    });
    return '';
  }

  downloadWGRes(version : string, locale : string) {

  }
}
