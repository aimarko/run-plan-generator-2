/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getWeek } from "../graphql/queries";
import { updateWeek } from "../graphql/mutations";
const client = generateClient();
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  runValidationTasks,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    const { hasError } = runValidationTasks();
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button size="small" variation="link" onClick={addItem}>
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function WeekUpdateForm(props) {
  const {
    id: idProp,
    week: weekModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    weeksToRace: "",
    buildPercent: "",
    cutbackWeek: "",
    cutbackAmount: "",
    runsPerWeek: "",
    startingMileage: "",
    runPercents: [],
    notes: "",
  };
  const [weeksToRace, setWeeksToRace] = React.useState(
    initialValues.weeksToRace
  );
  const [buildPercent, setBuildPercent] = React.useState(
    initialValues.buildPercent
  );
  const [cutbackWeek, setCutbackWeek] = React.useState(
    initialValues.cutbackWeek
  );
  const [cutbackAmount, setCutbackAmount] = React.useState(
    initialValues.cutbackAmount
  );
  const [runsPerWeek, setRunsPerWeek] = React.useState(
    initialValues.runsPerWeek
  );
  const [startingMileage, setStartingMileage] = React.useState(
    initialValues.startingMileage
  );
  const [runPercents, setRunPercents] = React.useState(
    initialValues.runPercents
  );
  const [notes, setNotes] = React.useState(initialValues.notes);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = weekRecord
      ? { ...initialValues, ...weekRecord }
      : initialValues;
    setWeeksToRace(cleanValues.weeksToRace);
    setBuildPercent(cleanValues.buildPercent);
    setCutbackWeek(cleanValues.cutbackWeek);
    setCutbackAmount(cleanValues.cutbackAmount);
    setRunsPerWeek(cleanValues.runsPerWeek);
    setStartingMileage(cleanValues.startingMileage);
    setRunPercents(cleanValues.runPercents ?? []);
    setCurrentRunPercentsValue("");
    setNotes(cleanValues.notes);
    setErrors({});
  };
  const [weekRecord, setWeekRecord] = React.useState(weekModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getWeek.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getWeek
        : weekModelProp;
      setWeekRecord(record);
    };
    queryData();
  }, [idProp, weekModelProp]);
  React.useEffect(resetStateValues, [weekRecord]);
  const [currentRunPercentsValue, setCurrentRunPercentsValue] =
    React.useState("");
  const runPercentsRef = React.createRef();
  const validations = {
    weeksToRace: [{ type: "Required" }],
    buildPercent: [{ type: "Required" }],
    cutbackWeek: [{ type: "Required" }],
    cutbackAmount: [{ type: "Required" }],
    runsPerWeek: [{ type: "Required" }],
    startingMileage: [{ type: "Required" }],
    runPercents: [{ type: "Required" }],
    notes: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          weeksToRace,
          buildPercent,
          cutbackWeek,
          cutbackAmount,
          runsPerWeek,
          startingMileage,
          runPercents,
          notes: notes ?? null,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: updateWeek.replaceAll("__typename", ""),
            variables: {
              input: {
                id: weekRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "WeekUpdateForm")}
      {...rest}
    >
      <TextField
        label="Weeks to race"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={weeksToRace}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              weeksToRace: value,
              buildPercent,
              cutbackWeek,
              cutbackAmount,
              runsPerWeek,
              startingMileage,
              runPercents,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.weeksToRace ?? value;
          }
          if (errors.weeksToRace?.hasError) {
            runValidationTasks("weeksToRace", value);
          }
          setWeeksToRace(value);
        }}
        onBlur={() => runValidationTasks("weeksToRace", weeksToRace)}
        errorMessage={errors.weeksToRace?.errorMessage}
        hasError={errors.weeksToRace?.hasError}
        {...getOverrideProps(overrides, "weeksToRace")}
      ></TextField>
      <TextField
        label="Build percent"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={buildPercent}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              weeksToRace,
              buildPercent: value,
              cutbackWeek,
              cutbackAmount,
              runsPerWeek,
              startingMileage,
              runPercents,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.buildPercent ?? value;
          }
          if (errors.buildPercent?.hasError) {
            runValidationTasks("buildPercent", value);
          }
          setBuildPercent(value);
        }}
        onBlur={() => runValidationTasks("buildPercent", buildPercent)}
        errorMessage={errors.buildPercent?.errorMessage}
        hasError={errors.buildPercent?.hasError}
        {...getOverrideProps(overrides, "buildPercent")}
      ></TextField>
      <TextField
        label="Cutback week"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={cutbackWeek}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              weeksToRace,
              buildPercent,
              cutbackWeek: value,
              cutbackAmount,
              runsPerWeek,
              startingMileage,
              runPercents,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.cutbackWeek ?? value;
          }
          if (errors.cutbackWeek?.hasError) {
            runValidationTasks("cutbackWeek", value);
          }
          setCutbackWeek(value);
        }}
        onBlur={() => runValidationTasks("cutbackWeek", cutbackWeek)}
        errorMessage={errors.cutbackWeek?.errorMessage}
        hasError={errors.cutbackWeek?.hasError}
        {...getOverrideProps(overrides, "cutbackWeek")}
      ></TextField>
      <TextField
        label="Cutback amount"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={cutbackAmount}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              weeksToRace,
              buildPercent,
              cutbackWeek,
              cutbackAmount: value,
              runsPerWeek,
              startingMileage,
              runPercents,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.cutbackAmount ?? value;
          }
          if (errors.cutbackAmount?.hasError) {
            runValidationTasks("cutbackAmount", value);
          }
          setCutbackAmount(value);
        }}
        onBlur={() => runValidationTasks("cutbackAmount", cutbackAmount)}
        errorMessage={errors.cutbackAmount?.errorMessage}
        hasError={errors.cutbackAmount?.hasError}
        {...getOverrideProps(overrides, "cutbackAmount")}
      ></TextField>
      <TextField
        label="Runs per week"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={runsPerWeek}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              weeksToRace,
              buildPercent,
              cutbackWeek,
              cutbackAmount,
              runsPerWeek: value,
              startingMileage,
              runPercents,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.runsPerWeek ?? value;
          }
          if (errors.runsPerWeek?.hasError) {
            runValidationTasks("runsPerWeek", value);
          }
          setRunsPerWeek(value);
        }}
        onBlur={() => runValidationTasks("runsPerWeek", runsPerWeek)}
        errorMessage={errors.runsPerWeek?.errorMessage}
        hasError={errors.runsPerWeek?.hasError}
        {...getOverrideProps(overrides, "runsPerWeek")}
      ></TextField>
      <TextField
        label="Starting mileage"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={startingMileage}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              weeksToRace,
              buildPercent,
              cutbackWeek,
              cutbackAmount,
              runsPerWeek,
              startingMileage: value,
              runPercents,
              notes,
            };
            const result = onChange(modelFields);
            value = result?.startingMileage ?? value;
          }
          if (errors.startingMileage?.hasError) {
            runValidationTasks("startingMileage", value);
          }
          setStartingMileage(value);
        }}
        onBlur={() => runValidationTasks("startingMileage", startingMileage)}
        errorMessage={errors.startingMileage?.errorMessage}
        hasError={errors.startingMileage?.hasError}
        {...getOverrideProps(overrides, "startingMileage")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              weeksToRace,
              buildPercent,
              cutbackWeek,
              cutbackAmount,
              runsPerWeek,
              startingMileage,
              runPercents: values,
              notes,
            };
            const result = onChange(modelFields);
            values = result?.runPercents ?? values;
          }
          setRunPercents(values);
          setCurrentRunPercentsValue("");
        }}
        currentFieldValue={currentRunPercentsValue}
        label={"Run percents"}
        items={runPercents}
        hasError={errors?.runPercents?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("runPercents", currentRunPercentsValue)
        }
        errorMessage={errors?.runPercents?.errorMessage}
        setFieldValue={setCurrentRunPercentsValue}
        inputFieldRef={runPercentsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Run percents"
          isRequired={true}
          isReadOnly={false}
          type="number"
          step="any"
          value={currentRunPercentsValue}
          onChange={(e) => {
            let value = isNaN(parseInt(e.target.value))
              ? e.target.value
              : parseInt(e.target.value);
            if (errors.runPercents?.hasError) {
              runValidationTasks("runPercents", value);
            }
            setCurrentRunPercentsValue(value);
          }}
          onBlur={() =>
            runValidationTasks("runPercents", currentRunPercentsValue)
          }
          errorMessage={errors.runPercents?.errorMessage}
          hasError={errors.runPercents?.hasError}
          ref={runPercentsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "runPercents")}
        ></TextField>
      </ArrayField>
      <TextField
        label="Notes"
        isRequired={false}
        isReadOnly={false}
        value={notes}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              weeksToRace,
              buildPercent,
              cutbackWeek,
              cutbackAmount,
              runsPerWeek,
              startingMileage,
              runPercents,
              notes: value,
            };
            const result = onChange(modelFields);
            value = result?.notes ?? value;
          }
          if (errors.notes?.hasError) {
            runValidationTasks("notes", value);
          }
          setNotes(value);
        }}
        onBlur={() => runValidationTasks("notes", notes)}
        errorMessage={errors.notes?.errorMessage}
        hasError={errors.notes?.hasError}
        {...getOverrideProps(overrides, "notes")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || weekModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || weekModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
