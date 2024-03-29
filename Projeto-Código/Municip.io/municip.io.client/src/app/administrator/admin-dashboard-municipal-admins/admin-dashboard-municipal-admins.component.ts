import { Component } from '@angular/core';
import { MunicipalityStatusService } from '../../services/municipality-status.service';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Componente responsável por exibir o painel de administradores municipais no painel de administração do administrador.
 */
@Component({
  selector: 'app-admin-dashboard-municipal-admins',
  templateUrl: './admin-dashboard-municipal-admins.component.html',
  styleUrl: './admin-dashboard-municipal-admins.component.css'
})
export class AdminDashboardMunicipalAdminsComponent {

  sortType = 'firstName';
  sortReverse = false;
  nameSearch: string = '';
  admins: any[] = [];
  municipalName = 'Inicial';
  isDialogOpen: boolean = false;
  selectedUser: any;

  constructor(private municipalityStatusService: MunicipalityStatusService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.municipalName = this.route.snapshot.params['municipalName'];
    this.municipalityStatusService.getMunicipalAdmins(this.municipalName).subscribe((admins: any) => {
      this.admins = admins;
    });
  }

  /**
   * Abre o diálogo para exibir informações detalhadas do usuário selecionado.
   * @param user O usuário selecionado.
   */
  openDialog(user: any) {
    this.selectedUser = user;
    this.isDialogOpen = true;
  }

  /**
   * Fecha o diálogo.
   */
  closeDialog() {
    this.isDialogOpen = false;
  }

  /**
   * Aprova um administrador municipal.
   * @param email O email do administrador municipal a ser aprovado.
   */
  approveAdmin(email: any) {
    this.municipalityStatusService.approveMunicipalAdmin(email).subscribe((admins: any) => {
      this.admins = admins;
    });
  }

  /**
   * Bloqueia um administrador municipal.
   * @param email O email do administrador municipal a ser bloqueado.
   */
  blockAdmin(email: any) {
    this.municipalityStatusService.blockMunicipalAdmin(email).subscribe((admins: any) => {
      this.admins = admins;
    });
  }

  /**
   * Exclui um administrador municipal.
   * @param email O email do administrador municipal a ser excluído.
   */
  deleteAdmin(email: any) {
    this.municipalityStatusService.deleteMunicipalAdmin(email).subscribe((admins: any) => {
      this.admins = admins;
    });
  }

  /**
   * Ordena a tabela de administradores municipais com base na coluna especificada.
   * @param column A coluna pela qual a tabela será ordenada.
   */
  sortTable(column: string): void {
    if (this.sortType === column) {
      this.sortReverse = !this.sortReverse;
    } else {
      this.sortType = column;
      this.sortReverse = false;
    }

    this.admins.sort((a: any, b: any) => {
      const valueA = a[column];
      const valueB = b[column];

      if (typeof valueA === 'string') {
        return this.sortString(valueA, valueB);
      } else {
        return this.sortNumeric(valueA, valueB);
      }
    });
  }

  /**
   * Filtra os administradores municipais com base no nome.
   */
  get filteredAdmins() {
    return this.admins.filter(m => m.firstName.toLowerCase().includes(this.nameSearch.toLowerCase()));
  }

  /**
   * Compara duas strings para ordenação.
   * @param a A primeira string.
   * @param b A segunda string.
   * @returns O valor da comparação.
   */
  private sortString(a: string, b: string): number {
    return a.localeCompare(b) * (this.sortReverse ? -1 : 1);
  }

  /**
   * Compara dois números para ordenação.
   * @param a O primeiro número.
   * @param b O segundo número.
   * @returns O valor da comparação.
   */
  private sortNumeric(a: number, b: number): number {
    return (a - b) * (this.sortReverse ? -1 : 1);
  }

  /**
   * Navega de volta para o painel de administração.
   */
  goBack() {
    this.router.navigate(['/admindashboard']);
  }
}
