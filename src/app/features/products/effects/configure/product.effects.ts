import { Injectable } from "@angular/core";
import * as loadingActions from "../../../../main/actions/loading.actions";
import * as fromMain from "../../../../main/main.reducers.index";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import {
  ConfigurationActionTypes,
  GetProductDetailsSuccess,
  ErrorConfiguration,
  SaveProductDetailsSuccess,
  GetProductDetails,
  SaveProductDetails,
} from "../../actions/configure.actions";
import { tap, map, switchMap, finalize, catchError } from "rxjs/operators";
import { ProductModelUI } from "../../models/configure.model";
import { of } from "rxjs";
import { mapObjectTypeToRequested } from "../../../../utils/funtion.utils";
import { IProductsDto } from "src/app/api/models/apimodels";
import { IProductService } from "src/app/api/services/interfaces/core/iproduct.service";

@Injectable()
export class ConfigureProductEffects {
  constructor(
    private actions$: Actions,
    private mainStore$: Store<fromMain.MainState>,
    private productService: IProductService
  ) {}

  public getProductDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType<GetProductDetails>(ConfigurationActionTypes.GetProductDetails),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap((action) =>
        this.productService.GetProduct(action.payload).pipe(
          map((productDetails: IProductsDto) => {
            const productDetailCasted =
              mapObjectTypeToRequested<ProductModelUI>(productDetails);
            return new GetProductDetailsSuccess(productDetailCasted);
          }),
          catchError((error) => of(new ErrorConfiguration(error))),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          )
        )
      )
    )
  );

  public saveProductDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType<SaveProductDetails>(ConfigurationActionTypes.SaveProductDetails),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap((action) => {
        const payloadConvertedToDto = mapObjectTypeToRequested<IProductsDto>(
          action.payload
        );
        return this.productService.UpdateProduct(payloadConvertedToDto).pipe(
          map(() => new SaveProductDetailsSuccess(action.payload)),
          catchError((error) => of(new ErrorConfiguration(error))),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          )
        );
      })
    )
  );
}
