import { Platform, AlertController } from '@ionic/angular';
import { Component } from '@angular/core';
import { NFC, Ndef } from '@ionic-native/nfc/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private nfc: NFC, private ndef: Ndef, public pltf: Platform, public alertCtrl: AlertController) {
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
    console.log('Start');
    this.pltf.ready().then(() => {
      console.log('Platform is Ready');
      this.nfc.enabled().then(enabled => {
        console.log(`NFC Enable: ${enabled}`);
        this.nfc.addTagDiscoveredListener(success => {
          console.log(`On Scan Failure: ${success}`);
        }, failure => {
          console.log(`On Scan Failure: ${failure}`);
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
}
