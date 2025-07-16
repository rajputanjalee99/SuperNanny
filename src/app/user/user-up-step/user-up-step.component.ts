import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import {MatChipInputEvent} from '@angular/material/chips';
import { MatStepper } from '@angular/material/stepper';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { language } from 'src/app/data/languages';
import { GetProfileResponse } from 'src/app/models/model';
import { HttpService } from 'src/app/services/http/http.service';
import { environment } from 'src/environments/environment';
export interface Language {
  name: string;
}
@Component({
  selector: 'app-user-up-step',
  templateUrl: './user-up-step.component.html',
  styleUrls: ['./user-up-step.component.scss']
})
export class UserUpStepComponent implements OnInit {
  @ViewChild('mapSearchField') searchField!: ElementRef;
  @ViewChild(GoogleMap) map!: GoogleMap;
 
  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  zoom = 4;
  profile:any;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];
  selectedIndex:number = 0;
  env :any = environment;
  intialCoordinates = {
    lat: 46.53,
    lng: 8.35
  }
  url = '';  
  addOnBlur = true;
  // readonly separatorKeysCodes = [ENTER, COMMA] as const;
  languages: Language[] = language;
  // filteredLanguages: any[] = [];
  filteredLanguages: Observable<any[]>;
  mapConfigurations = {
    disableDefaultUI: true,
    fullscreenControl: true,
    zoomControl: true,
  }
  isLinear: boolean = true 
  firstFormGroup:FormGroup;
  secondFormGroup:FormGroup;
  uploadID: any = {
    front : {
      file : null,
      filename : "",
    },
    back : {
      file : null,
      filename : "",
    }
  }

  uploadPoliceVerification: any = {
    file : null,
    filename : "",
  }
  title= "Step Up Nanny Profile"
  constructor(
    private _formBuilder: FormBuilder, 
    private sanitize : DomSanitizer, 
    private service : HttpService,
    private router : Router
  ) {

    this.firstFormGroup = this._formBuilder.group({
      address: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      covid_vaccinated: [false],
      languages_spoken: [[], [Validators.required]],
      has_children: [false],
      childrens: [1,[Validators.min(1)]],
      languages_search: [''],
      work_experience: ['', Validators.required],
      languages: [[], ]
    });
    this.secondFormGroup = this._formBuilder.group({
      file_1: ['', Validators.required],
      file_2: ['', Validators.required],
      file_3: ['', Validators.required],
    });


    this.filteredLanguages = this.firstFormGroup.controls.languages_search.valueChanges.pipe(
      startWith(null),
      map((val: string | null) => (val ? this._filter(val) : this.languages.slice())),
      );
    console.log('this.filteredLanguages: ', this.filteredLanguages);
    this.firstFormGroup.controls.has_children.valueChanges.subscribe(value => {

      if(value == true){

        this.firstFormGroup.controls.childrens.addValidators([
          Validators.min(1),
          Validators.required,
        ])
        this.firstFormGroup.controls.childrens.updateValueAndValidity();


      }else{
        this.firstFormGroup.controls.childrens.clearValidators();
        this.firstFormGroup.controls.childrens.updateValueAndValidity();
      }

    })

  }

  ngOnInit(): void {
    // this.getProfile();
    this.getCurrentLocation()
  }

  addMarker(event: any) {
    if (event) {
      // this.searchField.nativeElement.
      var geocoder;
      geocoder = new google.maps.Geocoder();
      var latlng = new google.maps.LatLng(event.latLng?.lat(), event.latLng?.lng());
      const self = this;
      geocoder.geocode(
        { 'location': latlng },
        function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            console.log(results);

            if (results?.length) {
              const address = results[0].formatted_address;
              self.searchField.nativeElement.value = address;

              self.latitude(event.latLng?.lat())
              self.longitude(event.latLng?.lng())
              self.address(address)

            }

            // if (results[0]) {
            //     var add= results[0].formatted_address ;
            //     var  value=add.split(",");

            //     count=value.length;
            //     country=value[count-1];
            //     state=value[count-2];
            //     city=value[count-3];
            //     alert("city name is: " + city);
            // }
            // else  {
            //     alert("address not found");
            // }

            
          }
          else {
            alert("Geocoder failed due to: " + status);
          }
        }
      );
      // console.log(event);
      // console.log(new event.domEvent.view.google.maps.Marker({}))
      this.markerPositions = []
      this.markerPositions.push(event && event.latLng ? event.latLng.toJSON() : { lat: 0, lng: 0 });
    }

  }

  // mapCenter: google.maps.LatLng;
   getCurrentLocation() {
 
  
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
       
  
        const point: google.maps.LatLngLiteral = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        console.log(point,"point")
        var geocoder;
        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(point.lat, point.lng);

        

        const self = this;
        geocoder.geocode(
          { 'location': latlng },
          function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              console.log(results);
  
              if (results?.length) {
                const address = results[0].formatted_address;
                self.searchField.nativeElement.value = address;
  
                self.latitude(point.lat)
                self.longitude( point.lng)
                self.address(address)
  
              }

              
      }})
      this.center = { lat: point.lat, lng: point.lng }
     

      this.markerOptions = ({
        position: this.secondFormGroup.value.complete_address,
       
        title: 'Current Location'
      });
    
      this.markerPositions = []
      this.markerPositions.push( {lat: point.lat, lng: point.lng}  )
      console.log(this.markerPositions,'asdadad')
    },
      (error) => {
      
  
        if (error.PERMISSION_DENIED) {
          this.service.showErrorMessage({message:"Couldn't get your location ,Permission denied"});
        } else if (error.POSITION_UNAVAILABLE) {
          this.service.showErrorMessage({message: "Couldn't get your location,Position unavailable"})
          
        } else if (error.TIMEOUT) {
          this.service.showErrorMessage({message: "Couldn't get your location ,Timed out"})
        

        } else {
          this.service.showErrorMessage({message: `Error: ${error.code}`})
      
        }
      },
      { enableHighAccuracy: true }
    );
  }


  onSelectFrontFile(event:any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if(file.type.includes("image") || file.type.includes("pdf")){

        if(file.type.includes("image")){
          const previewFile = this.sanitize.bypassSecurityTrustResourceUrl(URL.createObjectURL(file))
          this.uploadID.front.filename = previewFile;
        }else{
          this.uploadID.front.filename = "./../../assets/img/pdf.png";
        }

        this.uploadID.front.file = file;
        this.secondFormGroup.controls.file_1.setValue(file.name)

      }else{
        alert("Only images and PDF are required");
      }
      event.srcElement.value = null;

      console.log(file);
    }
  }  

  onSelectBackFile(event:any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if(file.type.includes("image") || file.type.includes("pdf")){
        
        if(file.type.includes("image")){
          const previewFile = this.sanitize.bypassSecurityTrustResourceUrl(URL.createObjectURL(file))
          this.uploadID.back.filename = previewFile;
        }else{
          this.uploadID.back.filename = "./../../assets/img/pdf.png"; 
        }
          

        this.uploadID.back.file = file;
        this.secondFormGroup.controls.file_2.setValue(file.name)

      }else{
        alert("Only images and PDF are required");
      }
      event.srcElement.value = null;
      console.log(file);
    }
  }
  fileName:any
  onSelectVerififcationFile(event:any) {
    if (event.target.files && event.target.files[0]) {
      this.fileName=event.target.files[0]
      const file = event.target.files[0];
      const ext = "."+file.name.split(".").pop().toLowerCase()
      const allowedExt = [
        ".jpg",
        ".jpeg",
        ".png",
        ".docx",
        ".doc",
        ".pdf",
      ]

      if(allowedExt.indexOf(ext) >= 0){
        const previewFile = this.sanitize.bypassSecurityTrustResourceUrl(URL.createObjectURL(file))

        this.uploadPoliceVerification.filename = previewFile;
        this.uploadPoliceVerification.file = file;
        this.secondFormGroup.controls.file_3.setValue(file.name)
      }else{
        alert(`Only allowed ${allowedExt} extensions`)
      }

      event.srcElement.value = null;
      console.log(file);
    }
  }

  removeUploadId(type:string){

    this.uploadID[type].filename = "";
    this.uploadID[type].file = null;

    const control_name = type == "front" ? "file_1" : "file_2"

    this.secondFormGroup.controls[control_name].setValue("")
    
  }

  removePoliceVerification(){

    this.uploadPoliceVerification.filename = "";
    this.uploadPoliceVerification.file = null;
    this.secondFormGroup.controls["file_3"].setValue("")
  }

  add(event: MatChipInputEvent): void {
  }

  remove(language: Language): void {
    console.log('language: ', language);
    // const index = this.languages.indexOf(language);

    var old = <any> this.firstFormGroup.controls.languages_spoken.value;
    
    old = old.filter((item:any) => item.name != language.name)
    
    console.log('old: ', old);
    this.firstFormGroup.controls.languages_spoken.setValue(old)
    // if (index >= 0) {
    //   this.languages.splice(index, 1);
    // }
  }
  // google.maps.MapMouseEvent
 
  ngAfterViewInit() {

   // this.latitude("10")
   // console.log(google.maps.places)

    const searchBox = new google.maps.places.SearchBox(this.searchField.nativeElement)
    const self = this;
    // this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.searchField.nativeElement)

    searchBox.addListener("places_changed", function () {

      const places = searchBox.getPlaces();

      if (places?.length) {
        const lat = places ? places[0].geometry?.location?.lat() : 0
        console.log('lat: ', lat);
        const lng = places ? places[0].geometry?.location?.lng() : 0
        console.log('lng: ', lng);
        self.intialCoordinates = {
          lat: lat ? lat : 0,
          lng: lng ? lng : 0,
        }

        self.latitude(lat ? lat.toString() : "0")
        self.longitude(lng ? lng.toString() : "0")
        self.address(places ? places[0].formatted_address : "")

        self.markerPositions = []

        self.markerPositions.push({
          lat: lat ? lat : 0,
          lng: lng ? lng : 0,
        })

        // self.map.set;

        self.map.panTo({
          lat: lat ? lat : 0,
          lng: lng ? lng : 0,
        })
        // self.map.mar
        console.log(places)
      } else {
        console.log("No location selected")
      }



    })

  }

  get selectedLanguages(){
    return this.firstFormGroup.controls.languages_spoken.value
  }

  latitude(latitide:any){
    this.firstFormGroup.controls.latitude.setValue(latitide)
  }

  longitude(longitude:any){
    this.firstFormGroup.controls.longitude.setValue(longitude)
  }
  
  address(address:any){
    this.firstFormGroup.controls.address.setValue(address)
  }

  submitFirstForm(stepper: MatStepper): boolean {

    console.log(this.firstFormGroup);

    if(this.firstFormGroup.invalid){
      this.firstFormGroup.markAllAsTouched();
      return false
    }

    stepper.next();

    return true;
  }

  submitSecondForm(stepper: MatStepper): boolean {

    console.log(this.secondFormGroup);

    if(this.secondFormGroup.invalid){
      this.secondFormGroup.markAllAsTouched();
      return false
    }

    // stepper.next();

    // const form = {

    //   address: this.firstFormGroup.value.address,
    //   latitude: this.firstFormGroup.value.latitude,
    //   longitude: this.firstFormGroup.value.longitude,
    //   covid_vaccinated:this.firstFormGroup.value.covid_vaccinated ,
    //   languages_spoken: this.firstFormGroup.value.languages_spoken,
    //   has_children:this.firstFormGroup.value.has_children ,
    //   childrens: this.firstFormGroup.value.childrens,
    //   languages_search: this.firstFormGroup.value.languages_search,
    //   work_experience: this.firstFormGroup.value.work_experience,
    //   languages:this.firstFormGroup.value.languages,
    //   front_file : this.uploadID.front.file,
    //   back_file : this.uploadID.back.file,
    //   police_verification_file : this.uploadPoliceVerification.file,      
    // }

    // form.languages_spoken = JSON.stringify(form.languages_spoken)
    
    const form_data = new FormData();
    form_data.append( 'address', this.firstFormGroup.value.address);
    form_data.append(  'latitude', this.firstFormGroup.value.latitude );
    form_data.append( 'longitude', this.firstFormGroup.value.longitude);
    form_data.append( 'covid_vaccinated',this.firstFormGroup.value.covid_vaccinated );
     form_data.append( 'languages_spoken', JSON.stringify(this.firstFormGroup.value.languages_spoken) );
     form_data.append( 'has_children',this.firstFormGroup.value.has_children );
     form_data.append( 'childrens', this.firstFormGroup.value.childrens );

     form_data.append( 'work_experience', this.firstFormGroup.value.work_experience );
  
     form_data.append('front_file',this.uploadID.front.file);
     form_data.append('back_file',this.uploadID.back.file);
     form_data.append('police_verification_file',this.uploadPoliceVerification.file);
     
    // for ( var key in form ) {
    //     form_data.append(key, form[key]);
    // ssssss
    // console.log(form)

    this.service.profileApproval(form_data).subscribe((resp:any) => {
     
      console.log("Data updated",resp);
      if(resp.code == 200){
      this.service.setCookies({
        key : "is_profile_submitted",
        value : "true",
      });
      document.cookie = "profile_approval=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      this.service.setCookies({
        key : "profile_approval",
        value : "pending",
      })
      this.service.showSuccessMessage({
        message : "Profile Submitted For Approval successfull"
      })
      this.router.navigate(['user/profile-approval'])
    }
    },(error:HttpErrorResponse) => {
      this.service.showErrorMessage({
        message:error?.error?.errors?.msg
      })
    })


    return true;
  }

  files: File[] = [];
  onSelect(event: { addedFiles: any; }) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event: File) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

 async getProfile() {

    this.service.getProfile().subscribe((resp: GetProfileResponse) => {
      this.profile = resp.data;
      console.log("this. profile", this.profile)

      this.firstFormGroup.controls.latitude.patchValue(this.profile.location.coordinates[0])
      this.firstFormGroup.controls.longitude.patchValue(this.profile.location.coordinates[1])
      this.firstFormGroup.controls.address.patchValue(this.profile.address)
      this.profile.language_spoken.forEach((element:any) => {
        this.profile.language_spoken.controls.languages_spoken.value.push(element.name);
      })
      this.firstFormGroup.controls.has_children.patchValue(this.profile.has_childrens);
      this.firstFormGroup.controls.covid_vaccinated.patchValue(this.profile.covid_vaccinated);
      this.firstFormGroup.controls.childrens.patchValue(this.profile.no_of_childrens);
      this.firstFormGroup.controls.work_experience.patchValue(this.profile.work_experience);
      this.secondFormGroup.controls.file_1.patchValue(this.profile.id_proof.front)
      this.secondFormGroup.controls.file_2.patchValue(this.profile.id_proof.back)
      this.secondFormGroup.controls.file_3.patchValue(this.profile.police_verification_file)
      
      this.frontDocument();
      this.backDocument();
      this.policeVarification();
    })
  }

  async frontDocument(){
    let url =  encodeURI(this.profile.id_proof.front)
    let response = await fetch(this.env.SUPERVISOR_DOC + url);
            let data = await response.blob();
            let metadata = {
              type: 'image/jpeg'
            };
            let file = new File([data], this.profile.id_proof.front, metadata);
  
            this.uploadID.front.file = file;
            this.uploadID.front.filename = this.env.SUPERVISOR_DOC+this.profile.id_proof.front;

  }
  async backDocument(){
    let url =  encodeURI(this.profile.id_proof.back)
    console.log("hajsdh",this.env.SUPERVISOR_DOC + url)
    let response = await fetch(this.env.SUPERVISOR_DOC + this.profile.id_proof.back);
            let data = await response.blob();
            let metadata = {
              type: 'image/jpeg'
            };
            let file = new File([data], this.profile.id_proof.back, metadata);
  
            this.uploadID.back.file = file;
            this.uploadID.back.filename = this.env.SUPERVISOR_DOC+this.profile.id_proof.back;

  }
  async policeVarification(){
    let url =  encodeURI(this.profile.police_verification)
    let response = await fetch(this.env.SUPERVISOR_DOC + url);
            let data = await response.blob();
            let metadata = {
              type: 'image/jpeg'
            };
            let file = new File([data], this.profile.uploadPoliceVerification, metadata);
  
            this.uploadPoliceVerification.file = file;
            this.uploadPoliceVerification.filename = this.profile.police_verification;
            

  }

  selected(event:any): void {
    
    const old  = <any> this.firstFormGroup.controls.languages_spoken.value;
    console.log('old: ', old);

    if(!old.find((item:any) => item.name == event.option.viewValue)){
      old?.push({
        name : event.option.viewValue,
      })

      this.firstFormGroup.controls.languages_spoken.setValue(old)
    }
    this.firstFormGroup.controls.languages_search.setValue("")
    console.log("value is -> ",this.firstFormGroup.controls.languages_search)

    // this.fruitInput.nativeElement.value = '';
    // this..setValue(null);
  }

  private _filter(value: string): Language[] {
    const filterValue = value.toLowerCase();
    console.log('filterValue: ', filterValue);
    
    const fil = this.languages.filter(lang => lang.name.toLowerCase().includes(filterValue));
    console.log('fil: ', fil);

    return fil

  }

}

