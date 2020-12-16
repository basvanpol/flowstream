import { SelectConfirmationModalComponent } from './modals/select-confirmation-modal/select-confirmation-modal.component';
import { SelectItemDirective } from './../../directives/select-item/select-item.directive';
import { SubscriptionButtonComponent } from './../features/add-feed/subscription-button/subscription-button.component';
import { DynamicComponentModalHostDirective } from './modals/dynamic-component-modal/dynamic-component-modal-host.directive';
import { DynamicComponentModalComponent } from './modals/dynamic-component-modal/dynamic-component-modal.component';
import { HeaderBottomComponent } from './../core/header/header-bottom/header-bottom.component';
import { HeaderTopComponent } from './../core/header/header-top/header-top.component';
import { PaperComponent } from './post-views/paper/paper.component';
import { PostsViewContainerComponent } from './posts-view-container/posts-view-container.component';
import { ModalModule } from './modals/modal.module';
import { HeaderComponent } from '../core/header/header.component';
import { NgModule } from '@angular/core';
import { IconModule } from './icon-font/icon-font.module';
import { DefaultFormComponent } from './default-form/default-form.component';
import { RightSidebarComponent } from '../core/right-sidebar/right-sidebar.component';
import { LeftSidebarComponent } from '../core/left-sidebar/left-sidebar.component';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { SelectListComponent } from './select-list/select-list.component';
import { PostComponent } from './post/post.component';
import { PostContentComponent } from './post/post-content/post-content.component';
import { FeedResourceDateComponent } from './feed/feed-resource-date/feed-resource-date.component';
import { FeedResourceIconComponent } from './feed/feed-resource-icon/feed-resource-icon.component';
import { FeedResourceNameComponent } from './feed/feed-resource-name/feed-resource-name.component';
import { FeedResourceThumbComponent } from './feed/feed-resource-thumb/feed-resource-thumb.component';
import { ImageLoadedComponent } from './image-loaded/image-loaded.component';
import { PostThumbOptionsComponent } from './post/post-thumb-options/post-thumb-options.component';
import { ModalPostComponent } from './post-views/modal-post/modal-post.component';
import { DropdownComponent } from './dropdown/dropdown.component';


@NgModule({
    imports: [
        MaterialModule,
        FormsModule,
        IconModule,
        ModalModule
    ],
    declarations: [
        LeftSidebarComponent,
        RightSidebarComponent,
        GroupsListComponent,
        DefaultFormComponent,
        SelectListComponent,
        HeaderComponent,
        HeaderTopComponent,
        HeaderBottomComponent,
        PostsViewContainerComponent,
        PaperComponent,
        PostComponent,
        PostContentComponent,
        FeedResourceDateComponent,
        FeedResourceIconComponent,
        FeedResourceNameComponent,
        FeedResourceThumbComponent,
        ImageLoadedComponent,
        PostThumbOptionsComponent,
        ModalPostComponent,
        DynamicComponentModalComponent,
        DynamicComponentModalHostDirective,
        DropdownComponent,
        SubscriptionButtonComponent,
        SelectItemDirective,
        SelectConfirmationModalComponent
    ],
    exports: [
        IconModule,
        MaterialModule,
        FormsModule,
        LeftSidebarComponent,
        RightSidebarComponent,
        HeaderComponent,
        HeaderTopComponent,
        HeaderBottomComponent,
        GroupsListComponent,
        DefaultFormComponent,
        SelectListComponent,
        PostsViewContainerComponent,
        PaperComponent,
        PostComponent,
        PostContentComponent,
        FeedResourceDateComponent,
        FeedResourceIconComponent,
        FeedResourceNameComponent,
        FeedResourceThumbComponent,
        ImageLoadedComponent,
        PostThumbOptionsComponent,
        ModalPostComponent,
        DynamicComponentModalComponent,
        DynamicComponentModalHostDirective,
        DropdownComponent,
        SubscriptionButtonComponent,
        SelectItemDirective,
        SelectConfirmationModalComponent
    ],
    entryComponents: [
        ModalPostComponent,
        DynamicComponentModalComponent,
        SelectConfirmationModalComponent
    ],
})
export class SharedModule {}
