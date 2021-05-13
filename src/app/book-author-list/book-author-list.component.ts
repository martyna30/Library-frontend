import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Author} from '../models-interface/author';

import {AuthorService} from '../../services/author.service';
import {AddComponent} from '../add/add.component';
import {AdDirective} from '../directive/ad.directive';
import {BookAuthorListContentComponent} from '../book-author-list-content/book-author-list-content.component';

@Component({
  selector: 'app-book-author-list',
  templateUrl: './book-author-list.component.html',
  styleUrls: ['./book-author-list.component.css']
})
export class BookAuthorListComponent implements OnInit, OnDestroy {
  isHidden = true;
  @Input() bookAuthorListContentComponents: BookAuthorListContentComponent[];

  @ViewChild('bookAuthorListContentsContainer', {read: ViewContainerRef}) bookAuthorListContentsContainer;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  showAddAuthorsForm() {
    if (this.isHidden) {
      this.isHidden = !this.isHidden;
    } else {
      this.isHidden = true;
    }
  }
  /*deleteFieldValue(index) {
    this.bookAuthors.splice(index, 1);
  }*/
  // tslint:disable-next-line:typedef
  addNextAuthor() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(BookAuthorListContentComponent);
    const componentRef = this.bookAuthorListContentsContainer.createComponent(componentFactory);

    componentRef.changeDetectorRef.detectChanges();
  }
}
