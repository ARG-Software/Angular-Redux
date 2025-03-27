import { inject, Injectable } from "@angular/core";
import * as loadingActions from "../../../../main/actions/loading.actions";
import * as fromMain from "../../../../main/main.reducers.index";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import {
  getProductDetails,
  getProductDetailsSuccess,
  productConfigurationError,
  saveProductDetails,
  saveProductDetailsSuccess,
} from "../../actions/configure.actions";
import { tap, map, switchMap, finalize, catchError } from "rxjs/operators";
import { ProductModelUI } from "../../models/configure.model";
import { of } from "rxjs";
import { mapObjectTypeToRequested } from "../../../../utils/funtion.utils";
import { IProductsDto } from "src/app/api/models/apimodels";
import { IProductService } from "src/app/api/services/interfaces/core/iproduct.service";

@Injectable()
export class ConfigureProductEffects {
  private actions$ = inject(Actions);
  private mainStore$ = inject<Store<fromMain.MainState>>(Store);
  private productService = inject<IProductService>(IProductService);

  getProductDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getProductDetails),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(({ productId }) =>
        this.productService.GetProduct(productId).pipe(
          map((res) =>
            getProductDetailsSuccess({
              product: mapObjectTypeToRequested(res),
            })
          ),
          catchError((error) => of(productConfigurationError({ error }))),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          )
        )
      )
    )
  );

  saveProductDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveProductDetails),
      tap(() => this.mainStore$.dispatch(new loadingActions.ShowLoading())),
      switchMap(({ product }) => {
        const dto = mapObjectTypeToRequested<IProductsDto>(product);
        return this.productService.UpdateProduct(dto).pipe(
          map(() => saveProductDetailsSuccess({ product })),
          catchError((error) => of(productConfigurationError({ error }))),
          finalize(() =>
            this.mainStore$.dispatch(new loadingActions.HideLoading())
          )
        );
      })
    )
  );
}
