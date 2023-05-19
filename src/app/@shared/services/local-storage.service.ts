import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  key: string = environment.crytoKey;

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
  
  public saveData(key: string, value: string) {
    localStorage.setItem(key, this.encrypt(value));
  }

  public saveStringifyData(key: string, value: any){
    const data = JSON.stringify(value);
    localStorage.setItem(key, this.encrypt(data));
  }

  public getData(key: string) {
    let data = localStorage.getItem(key) || "";
    return this.decrypt(data);
  }

  public getParseData(key: string) {
    let data = localStorage.getItem(key) || "";
    const dataStringified = this.decrypt(data);
    return dataStringified ? JSON.parse(dataStringified) : data;
  }
  
  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }

  private encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.key).toString();
  }

  private decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
  }
}
