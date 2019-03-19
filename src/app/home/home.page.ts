import { Component } from '@angular/core';
import { Ndef, NFC } from '@ionic-native/nfc/ngx';
import { AlertController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public NFCRedodedData: any;
  constructor(public nfc: NFC, public ndef: Ndef, public pltf: Platform, public alertCtrl: AlertController) {
    console.log('Home Page');
    this.nfc.enabled().then(enabled => {
      console.log(`NFC Enable: ${enabled}`);
    })
      .catch(err => {
        console.log(err);
        this.presentAlert();
      });
  }

  onStartScan() {
    this.pltf.ready().then(() => {
      console.log('Platform is Ready');
      this.nfc.enabled().then(enabled => {
        console.log(`NFC Enable: ${enabled}`);
        this.nfc.addTagDiscoveredListener(success => {
          console.log(`On Scan Success: ${success}`);
        }, failure => {
          console.log(`On Scan Failure: ${failure}`);
        })
          .subscribe(event => {
            this.nfc.addMimeTypeListener('text/plain', success => {
              console.log(success);
            }, failure => {
              console.log(failure);
            }).subscribe(val => {
              console.log('Data', val);
              this.NFCRedodedData = val;
              if (val.tag) {
                const data = val.tag.ndefMessage['0'].payload;
                console.log('Stored Data', this.nfc.bytesToString(data));
              }
            });
          });
      })
        .catch(err => {
          console.log(`NFC Disable: ${err}`);
          this.presentAlert();
        });
    })
      .catch(err => {
        console.log(`Platform error: ${err}`);
      });
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'NFC Warning',
      message: 'Please, enable NFC to scan the NFC-Card',
      backdropDismiss: false,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.nfc.showSettings();
        }
      }]
    });
    return await alert.present();
  }

  getData(tag) {
    if (tag) {
      return JSON.stringify(tag);
    }
  }
}
