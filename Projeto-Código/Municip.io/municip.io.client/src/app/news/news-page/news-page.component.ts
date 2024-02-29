import { Component } from '@angular/core';
import { NewsService } from '../../services/news/news.service';
import { ActivatedRoute } from '@angular/router';
import { Roles, UserAuthService } from '../../services/user-auth.service';

@Component({
  selector: 'app-news-page',
  templateUrl: './news-page.component.html',
  styleUrl: './news-page.component.css'
})
export class NewsPageComponent {

  news: any;
  role: string = "";
  user: any;
  newUser: any;

  constructor(private newsService: NewsService, private activatedRoute: ActivatedRoute, private userAuthService: UserAuthService) { }

  ngOnInit() {
    this.news = this.activatedRoute.snapshot.data['news'];
    console.log("EVENTO SELECIONADO");
    console.log(this.news);

    this.userAuthService.getUserRole().subscribe(
      res => {
        if (res.role == Roles.Citizen) {
          this.role = res.role;

          this.userAuthService.getUserData().subscribe(
            res => {
              this.user = res;
              var emailToParse = this.user.email;
              var emailParsed = emailToParse.replace('@', '%40');
              
              this.userAuthService.getInfoByEmail(emailParsed).subscribe(
                res => {
                  this.newUser = res;         
                },
                error => {
                  console.error(error);

                }
              );
            },
            error => {
              console.error(error);
            }
          );
        }
      },
      error => {
        console.error(error);
      }
    );
  }

}
