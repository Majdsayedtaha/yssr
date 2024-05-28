import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MovementTransactionActions } from '../actions/MovementTransaction.action';
@Injectable({ providedIn: 'root' })
export class MovementTransactionService {
  private _movementTransactionActions: MovementTransactionActions;

  constructor(private _http: HttpClient) {
    this._movementTransactionActions = new MovementTransactionActions(_http);
  }

  addMovement(newMovement: any) {
    return this._movementTransactionActions.add(newMovement);
  }

  updateMovement(movementId: string, updatedMovement: any) {
    return this._movementTransactionActions.put(movementId, updatedMovement);
  }
  getMovementList(formParams: any) {
    return this._movementTransactionActions.get(formParams);
  }

  getMovementDetails(movementId: string) {
    return this._movementTransactionActions.getInfo(movementId);
  }

  deleteMovement(movementId: string) {
    return this._movementTransactionActions.delete(movementId);
  }
}
