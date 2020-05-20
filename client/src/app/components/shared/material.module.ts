import { MatFormFieldModule } from '@angular/material/form-field';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTabsModule} from '@angular/material/tabs';
import { MatCheckboxModule, MatOptionModule, MatSelectModule } from '@angular/material';
import {MatExpansionModule} from '@angular/material/expansion';


@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatTabsModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatSelectModule,
        MatOptionModule

    ],
    exports: [
        CommonModule,
        MatDialogModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatTabsModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatSelectModule,
        MatOptionModule
    ]
})
export class MaterialModule {}
