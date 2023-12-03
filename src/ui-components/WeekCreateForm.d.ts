/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type WeekCreateFormInputValues = {
    weeksToRace?: number;
    buildPercent?: number;
    cutbackWeek?: number;
    cutbackAmount?: number;
    runsPerWeek?: number;
    startingMileage?: number;
    runPercents?: number[];
    notes?: string;
};
export declare type WeekCreateFormValidationValues = {
    weeksToRace?: ValidationFunction<number>;
    buildPercent?: ValidationFunction<number>;
    cutbackWeek?: ValidationFunction<number>;
    cutbackAmount?: ValidationFunction<number>;
    runsPerWeek?: ValidationFunction<number>;
    startingMileage?: ValidationFunction<number>;
    runPercents?: ValidationFunction<number>;
    notes?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type WeekCreateFormOverridesProps = {
    WeekCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    weeksToRace?: PrimitiveOverrideProps<TextFieldProps>;
    buildPercent?: PrimitiveOverrideProps<TextFieldProps>;
    cutbackWeek?: PrimitiveOverrideProps<TextFieldProps>;
    cutbackAmount?: PrimitiveOverrideProps<TextFieldProps>;
    runsPerWeek?: PrimitiveOverrideProps<TextFieldProps>;
    startingMileage?: PrimitiveOverrideProps<TextFieldProps>;
    runPercents?: PrimitiveOverrideProps<TextFieldProps>;
    notes?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type WeekCreateFormProps = React.PropsWithChildren<{
    overrides?: WeekCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: WeekCreateFormInputValues) => WeekCreateFormInputValues;
    onSuccess?: (fields: WeekCreateFormInputValues) => void;
    onError?: (fields: WeekCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: WeekCreateFormInputValues) => WeekCreateFormInputValues;
    onValidate?: WeekCreateFormValidationValues;
} & React.CSSProperties>;
export default function WeekCreateForm(props: WeekCreateFormProps): React.ReactElement;
