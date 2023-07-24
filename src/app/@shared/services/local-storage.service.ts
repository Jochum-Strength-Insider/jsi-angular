import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  cryptoKey: string = environment.crytoKey;
  constructor() { }

  //localStorage.getItem('users')
  //localStorage.getItem('tasks')
  //localStorage.setItem("afterUrl", url);
  //localStorage.setItem("afterUrl", url);
  //localStorage.setItem("beforeUrl", url);
  //localStorage.getItem('codes')
  //localStorage.getItem('diet')
  // var email = window.localStorage.getItem('emailForSignIn');
  //localStorage.getItem('authUser'))
  // data: JSON.parse(localStorage.getItem('chartData')) || initialData,
  // localStorage.removeItem('program');
  // localStorage.removeItem('programKey');
  
  public saveData(key: string, value: string): void {
    localStorage.setItem(key, this.encrypt(value));
  }

  public saveStringifyData(key: string, value: any): void {
    const data = JSON.stringify(value);
    localStorage.setItem(key, this.encrypt(data));
  }

  public getData(key: string): any {
    let data = localStorage.getItem(key) || "";
    const decryptedData = this.decrypt(data);
    return decryptedData;
  }

  public getParseData(key: string): any {
    let data = localStorage.getItem(key) || "";
    const dataStringified = this.decrypt(data);
    return dataStringified ? JSON.parse(dataStringified) : data;
  }
  
  public removeData(key: string): void {
    localStorage.removeItem(key);
  }

  public clearData(): void {
    localStorage.clear();
  }

  private encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.cryptoKey).toString();
  }

  private decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.cryptoKey).toString(CryptoJS.enc.Utf8);
  }
}

// public getVersionKey(key: string): string {
//   return `${key}-version`;
// }

// public getData(key: string): CachedData {
//   let data = localStorage.getItem(key) || "";
//   let version = localStorage.getItem(this.getVersionKey(key)) || "0";
//   const decryptedData = this.decrypt(data);
//   return new CachedData(decryptedData, version);
// }

// public getParseData(key: string): CachedData {
//   let data = localStorage.getItem(key) || "";
//   let version = localStorage.getItem(this.getVersionKey(key)) || "0";

//   const dataStringified = this.decrypt(data);
//   const decryptedData = dataStringified ? JSON.parse(dataStringified) : data;
//   return new CachedData(decryptedData, version);
// }
