import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './core/login-page/login-page.component';
import { EditorPageComponent } from './core/editor-page/editor-page.component';

const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'editor', component: EditorPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }