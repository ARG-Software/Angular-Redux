import { Observable, of } from "rxjs";
import { MimsSelectBoxModel } from "../mims-ui/input/select-box/models/select-box.model";

/**
 * Get today date and subtract the input number days
 * @param days number of days to subtract
 * @returns date in MM/DD/YYYY format with subtracted days
 */
export function getTodayDateMinusInputDays(days: number): string {
  const today = new Date();

  const subtractedDate = today.getDate() - days;
  today.setDate(subtractedDate);

  const formatSubtractedDate = today.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return formatSubtractedDate;
}

export function mapObjectTypeToRequested<T>(input: any): T {
  return input;
}

/**
 * Gets the difference of two objects array by a specific property
 * @param array1 main array of objects where the filter occurs
 * @param array2 array of objects to compare with
 * @param property property to compare objects
 * @returns new array with the difference
 */
export function getDiferenceBetweenObjectArraysByProperty(
  array1: any[],
  array2: any[],
  property: string
): any[] {
  const difference = array1.filter((op2) => {
    return !array2.some((op1) => {
      // tslint:disable-next-line:triple-equals
      return op1[property] == op2[property];
    });
  });
  return difference;
}

/**
 * Simulate api request
 * @returns empty Observable
 */
export function apiRequest(): Observable<any> {
  return of({});
}

export function convertApiDataToSelectBoxes(
  data: any[]
): [MimsSelectBoxModel[], MimsSelectBoxModel[]] {
  return data.map((arrayForSelectBox) =>
    arrayForSelectBox.map((elem: any) => ({
      name: elem.Name,
      value: elem.Id,
      selected: false,
    }))
  ) as [MimsSelectBoxModel[], MimsSelectBoxModel[]];
}
