import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-note-edit',
  templateUrl: './note-edit.page.html',
  styleUrls: ['./note-edit.page.scss'],
})
export class NoteEditPage implements OnInit {

  noteForm: FormGroup;
  id = '';
  title = '';
  body = '';
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private formBuilder: FormBuilder
  ) { }

  getNote(id: any) {
    this.api.getNote(id).subscribe((data: any) => {
      this.id = data.id;
      this.noteForm.setValue({
        title: data.title,
        body: data.body,
      });
    });
  }

  onFormSubmit() {
    this.isLoadingResults = true;
    this.api.updateNote(this.id, this.noteForm.value)
      .subscribe((res: any) => {
          const id = res.id;
          this.isLoadingResults = false;
          this.router.navigate(['/note-detail', id]);
        }, (err: any) => {
          console.log(err);
          this.isLoadingResults = false;
        }
      );
  }

  noteDetails() {
    this.router.navigate(['/note-detail', this.id]);
  }

  ngOnInit() {
    this.getNote(this.route.snapshot.params['id']);
    this.noteForm = this.formBuilder.group({
      'title' : [null, Validators.required],
      'body' : [null, Validators.required],
    });
  }

}
