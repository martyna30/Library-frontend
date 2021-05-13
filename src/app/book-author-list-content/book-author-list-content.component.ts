import {Component, Input, OnDestroy, OnInit, AfterViewInit, TemplateRef, Type, ViewChild, ViewContainerRef} from '@angular/core';
import {AuthorService} from '../../services/author.service';

@Component({
  selector: 'app-book-authors',
  templateUrl: './book-author-list-content.component.html',
  styleUrls: ['./book-author-list-content.component.css']
})
export class BookAuthorListContentComponent implements OnInit, OnDestroy {

   @ViewChild('wrapper', {read: TemplateRef}) wrapper: TemplateRef<any>;

   constructor(private vcRef: ViewContainerRef) {}

   @Input()
   lp: number;
   @Input()
   authorForenameInput: string;
   @Input()
   authorSurnameInput: string;

  ngOnInit(): void {
    console.log('Dynamic Component has been initialized');
  }

  ngAfterViewInit(): void {
    this.vcRef.createEmbeddedView(this.wrapper);
    console.log('Dynamic Component after view init');
  }

  callMeFromParent() : void {
    console.log('Hello, i am method of dynamic component');
  }

  ngOnDestroy(): void {
    console.log('I have been destroyed!');
  }

}
