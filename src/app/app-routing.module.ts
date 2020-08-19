import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { PlayComponent } from './components/play/play.component';
import { RulesComponent } from './components/rules/rules.component';
import { ForumsComponent } from './components/forums/forums.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'play', component: PlayComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'forums', component: ForumsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', redirectTo: '/play', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
