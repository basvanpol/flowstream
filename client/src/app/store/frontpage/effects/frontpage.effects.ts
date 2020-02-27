import { IFrontPageEntityObject, IFrontPageEntity } from './../../../models/frontpage';
import { IUserFeedSubscription } from './../../../models/feed';

import { switchMap, map, catchError } from 'rxjs/operators';
import * as FrontPageActions from './../actions/frontpage.actions';
import { IFrontPageState } from './../reducers/frontpage.reducers';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from "@angular/core";
import { of } from 'rxjs';
import { FrontPageService } from '../../../services/http/frontpage.service';

@Injectable()
export class FrontPageEffects {
    errorMessage = "Unfortunately flow data couldn't be Loaded. Apologies for the inconvencience.";
    constructor(
        private actions$: Actions,
        private frontPageService: FrontPageService,
        private store: Store<IFrontPageState>) { }

    @Effect()
    saveFlow$ = this.actions$
        .pipe(
            ofType(FrontPageActions.GET_FRONTPAGE_POSTS),
            switchMap((action: FrontPageActions.GetFrontPagePosts) => {
                return this.frontPageService.getFrontPagePosts(<IUserFeedSubscription[]>action.payload)
                    .pipe(
                        map((res: any) => {

                            if (res) {
                                const frontPageEntities: IFrontPageEntity[] = this.parseEntitiesObjectArraytoArray(res.data);

                                return new FrontPageActions.GetFrontPagePostsSuccess(frontPageEntities);
                            }
                        })
                        , catchError((err) => {
                            return of(
                                new FrontPageActions.FrontPageDataError(this.errorMessage)
                            );
                        })
                    );
            }),
    );


    parseEntitiesObjectArraytoArray(entityObjectArray: IFrontPageEntityObject[]): IFrontPageEntity[] {

        const entityObject: IFrontPageEntityObject = entityObjectArray[0];
        const keysObject =  Object.keys(entityObject);
        const frontpageEntities: IFrontPageEntity[] = [];
        for (const title of keysObject) {
            const frontPageEntity: IFrontPageEntity = {
                title: title,
                posts: entityObject[title]
            };
            frontpageEntities.push(frontPageEntity);
        }

        return frontpageEntities;
    }

}

