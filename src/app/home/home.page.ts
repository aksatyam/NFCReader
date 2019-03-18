import { Platform } from '@ionic/angular';
import { Component } from '@angular/core';
import { NFC, Ndef } from '@ionic-native/nfc/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private nfc: NFC, private ndef: Ndef, public pltf: Platform) {
    console.log('Home Page');
  }

  onStartScan() {
    console.log('Start');
    this.pltf.ready().then(() => {
      console.log('Platform is Ready');
      this.nfc.enabled().then(enabled => {
        console.log(enabled);
        this.nfc.addNdefListener(onSuccess => {
          console.log('successfully attached ndef listener');
          console.log(onSuccess);
        }, onFailure => {
          console.log(onFailure);
        });
      })
      .catch(err => {
        console.log(err);
        this.nfc.showSettings();
      });
    })
    .catch(err => {
      console.log(`Platfor error: ${err}`);
    });
  }
}
