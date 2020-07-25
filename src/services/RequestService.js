import { API_ACTIONS,API_ROOT } from '../constants/config'
import {AsyncStorage} from "react-native";
import NavigatorService from "./navigator";
import SimpleToast from "react-native-simple-toast";

let DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
}
const GET = 'GET'
const HEAD = 'HEAD'

export class RequestService {

  constructor(params) {
    if (!params.url) throw new Error('invalid request url')

    this.params = params
    this.call = this.call.bind(this)

    this.callCreate = this.callCreate.bind(this)
    this.callShow = this.callShow.bind(this)
    this.callUpdate = this.callUpdate.bind(this)
    this.callDestroy = this.callDestroy.bind(this)

    this.mountBody = this.mountBody.bind(this)
    this.mountRequest = this.mountRequest.bind(this)
    this.mountHeaders = this.mountHeaders.bind(this)
    this.mountFiles = this.mountFiles.bind(this)
  }

  callCreate() {
    this.params.method = API_ACTIONS.CREATE
    return this.call()
  }

  callShow() {
    this.params.method = API_ACTIONS.SHOW
    return this.call()
  }

  callUpdate() {
    this.params.method = API_ACTIONS.UPDATE
    return this.call()
  }

  callDestroy() {
    this.params.method = API_ACTIONS.DELETE
    return this.call()
  }

  timeout(ms, promise) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(new Error("timeout"))
      }, ms)
      promise.then(resolve, reject)
    })
  }

  async call() {
    // if (!this.params.method) return {}
    try{
      console.log('API_ROOT+this.params.url',API_ROOT+this.params.url);
      const asyncResponse = await this.timeout(10000,fetch(
          API_ROOT+this.params.url, this.mountRequest(this.params)))
      const { headers, status } = await asyncResponse
      const json = await asyncResponse.json()
      console.log('API response',json)
      if(json.message == "Invalid user token received"){
        AsyncStorage.getItem('token').then((value) =>{
          if(value){
            AsyncStorage.removeItem('token')
            AsyncStorage.removeItem('hasProfileInfo')
            AsyncStorage.removeItem('username')
            AsyncStorage.removeItem('healer')
            NavigatorService.reset('LoginScreen')
            SimpleToast.show('Please login again', SimpleToast.LONG, SimpleToast.BOTTOM)
          }
        })

        // AsyncStorage.getItem('token').then((value) => {
        //   let params = {url: 'customerlogout', body: {user_token: value}}
        //   new RequestService(params).callCreate().then(res => {
        //   }).catch(err => {
        //     console.log(err)
        //   })
        //
        //   // this.props.logoutAPP()
        // })
      }else{
        return  json
      }
    }
    catch(e)
    {
      console.log("===server error===",e.toString())
      return {"status":false,"message":"Something went wrong on server",data:[]}
    }
  }

  mountRequest() {
    let request = {
      method: this.params.method,
      headers:this.mountHeaders()
    }
    if (request.method !== GET && request.method !== HEAD) {
      request.body = this.mountBody()
    }
    return request
  }

  mountBody() {
    if (!this.params.body) return {}
    let body = JSON.stringify(this.params.body)
    return body
  }


  mountFiles(){
    let fileArray=[]
    let files = this.params.files
    for (var file in files) {
      let json={};
      json['filename']=file
      json['filepath']=files[file],
          json['filetype']='image/jpeg'
      fileArray.push(json)
    }
    return fileArray
  }

  mountHeaders() {
    let mountedHeaders = Object.assign(

        DEFAULT_HEADERS
    )

    if (this.params.headers) {
      mountedHeaders = Object.assign(
          mountedHeaders,
          this.params.headers
      )
    }

    return mountedHeaders
  }
}


export default RequestService;
