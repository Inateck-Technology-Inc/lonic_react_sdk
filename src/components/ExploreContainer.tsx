import React,{ useState } from 'react';
import { IonButton } from '@ionic/react';
import './ExploreContainer.css';
import {ScannerManager} from "inateck-scanner-js-sdk"

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  const [obj, setObj] = useState({ deviceId: "", deviceName: "" }) 
  return (
    <>
    <IonButton onClick={()=>connectScanner()}>Connect</IonButton>
    <IonButton onClick={()=>disconnectScanner(obj.deviceId)}>disConnect</IonButton>
    <IonButton onClick={()=>updateIlluminationControl(obj.deviceId)}>updateIllumination</IonButton>
    <IonButton onClick={()=>cleanCache(obj.deviceId)}>CleanCache</IonButton>
    <IonButton onClick={()=>getBarcodesTypeSetting(obj.deviceId)}>GetBarcodesType</IonButton>
    <IonButton onClick={()=>getCacheQty(obj.deviceId)}>getCacheQty</IonButton>
    <IonButton onClick={()=>hasAutoUpdateCache(obj.deviceId)}>GetAutoUpdateCache</IonButton>
  </>
  );

  async function connectScanner(){
    try {
      await ScannerManager.initialize({ androidNeverForLocation: true });
      ScannerManager.startScan().then((list)=>{
        if(list.length>0){
          const appInfo = {
            appId: 'com.inateck.scanner',
            developerId: '****',
            appKey: '*****MMRULnayq4BLFXm47WGxVVQFXg=',
          }
          console.log(list)
          ScannerManager.connect(list[0].device.deviceId,appInfo,(value)=>{
            console.log(value)
          }).then((data)=>{
            console.log(data)
            setObj({deviceId: list[0].device.deviceId, deviceName: list[0].device.name??""})
            ScannerManager.getBasicProperties(list[0].device.deviceId,"firmware_version").then((data)=>{
              console.log("firmware_version "+data)
            })
            ScannerManager.getBasicProperties(list[0].device.deviceId,"battery").then((data)=>{
              console.log("readBatteryLevel "+data)
            })
          }).catch((err) => {
            console.error(err);
          })
        }
      }).catch((err) => {
        console.error(err);
      })
    } catch (error) {
      console.error(error);
    }
  }

  async function disconnectScanner(deviceId:string) {
    console.log(deviceId);
    ScannerManager.disconnect(deviceId).then(()=>{
      // code
    }).catch((err) => {
      console.error(err);
    })
  }
  
  async function updateIlluminationControl(deviceId:string){
    ScannerManager.editPropertiesInfoByKey(deviceId,"lighting_lamp_control","01").then((data)=>{
      console.log("update Illumination Control "+data)
    }).catch((err) => {
      console.error(err);
    })
  }

  async function getCacheQty(deviceId:string){
    ScannerManager.getPropertiesInfoByKey(deviceId,"cache").then((data)=>{
      console.log("get Cache "+data)
    }).catch((err) => {
      console.error(err);
    })
  }
  
  async function cleanCache(deviceId:string){
    ScannerManager.editPropertiesInfoByKey(deviceId,"cache","0").then((data)=>{
      console.log("clean Cache "+data)
    }).catch((err) => {
      console.error(err);
    })
  }
  
  async function getBarcodesTypeSetting(deviceId:string){
    ScannerManager.getAllBarcodeProperties(deviceId).then((data)=>{
      console.log(data)
    }).catch((err) => {
      console.error(err);
    })
  }
  
  async function hasAutoUpdateCache(deviceId:string){
    ScannerManager.getPropertiesInfoByKey(deviceId,"auto_upload_cache").then((data)=>{
      console.log(data)
    }).catch((err) => {
      console.error(err);
    })
  }
};

export default ExploreContainer;
