import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';

import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';

import { Router } from '@angular/router';
import { UserAuthService } from '../../services/user-auth.service';
import { EventsService, Event } from '../../services/events/events.service';
import { DocsService, DocumentTemplate } from '../../services/documents/docs.service';

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrl: './create-template.component.css'
})
export class CreateTemplateComponent {

  municipalityImage: string = "";
  municipalityName: string = "";
  propriedades: string[] = ["Primeiro Nome", "Apelido", "Email","Password","Nif","Género","Município","Endereço","CodigoPostal1","CodigoPostal2","DataNascimento"];


  error: string | null = null;


  isDialogOpen: boolean = false;


  /**
   * Construtor do componente.
   * @param authService
   * @param eventService
   * @param router
   */
  constructor( private authService: UserAuthService,
    private docsService : DocsService, private router: Router,
  ) {
    // Set the locale to pt in the calendar




  }

  /**
   * Método onInit 
   */

  ngOnInit(): void {
    this.authService.getUserData().subscribe((user) => {
      this.authService.getInfoByEmail(user.email).subscribe((account) => {
        this.authService.getInfoMunicipality(account.municipality).subscribe((municipality) => {
          this.municipalityImage = municipality.landscapePhoto;
          this.municipalityName = municipality.name;
        });
      });

    });



  }


  templateForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    templatetext: new FormControl('', [Validators.required])

  })



  get name() {
    return this.templateForm.get('name');
  }

  get description() {
    return this.templateForm.get('description');
  }

  get type() {
    return this.templateForm.get('type');
  }

  get price() {
    return this.templateForm.get('price');
  }

  get templatetext() {
    return this.templateForm.get('templatetext') ;
  }


OnSubmit() {
  if (this.templateForm.valid) {
    const template: DocumentTemplate = {
      name: this.templateForm?.get('name')?.value || "",
      description: this.templateForm?.get('description')?.value || "",
      type: this.templateForm?.get('type')?.value || "",
      price: Number(this.templateForm?.get('price')?.value) || 0,
      textTemplate: this.templateForm?.get('templatetext')?.value || '', // Provide a default value if FormControl value is null
      municipality: this.municipalityName || "vazio"
    };

    this.docsService.createTemplate(template).subscribe((template: any) => {
      this.isDialogOpen = true;
    });
  }
}
  /**
   * Método responsável por fechar o diálogo
   */
  closeDialog() {
    this.isDialogOpen = false;
    this.router.navigate(['/events']);
  }

  adicionarPropriedade() {
    const propriedadeSelecionada = (document.getElementById('propriedade') as HTMLSelectElement).value;
    const textArea = (document.getElementById('templatetext') as HTMLTextAreaElement);
    textArea.value += `[ ${propriedadeSelecionada} ]`;
  }








}


