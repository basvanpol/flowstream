import { FrontPageService } from './http/frontpage.service';
import { FilterService } from './filter/filter.service';
import { ParserService } from './parser/parser.service';
import { PostsService } from './http/posts.service';
import { AuthService } from './http/auth.service';
import { NgModule } from '@angular/core';
import { GroupService } from './http/group.service';
import { FlowService } from './http/flow.service';
import { TwitterService } from './http/twitter.service';
import { BaseHttpService } from './http/base.http.service';
import { FeedService } from './http/feed.service';

@NgModule({
    providers: [
        BaseHttpService,
        TwitterService,
        FeedService,
        FlowService,
        GroupService,
        AuthService,
        PostsService,
        ParserService,
        FilterService,
        FrontPageService
    ]
})
export class ServicesModule { }
