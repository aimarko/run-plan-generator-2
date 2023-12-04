import "./App.css";
import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import * as queries from './graphql/queries';
import toastr from 'toastr';

import { Circles } from 'react-loader-spinner'
import 'toastr/build/toastr.min.css';



import { Amplify } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';

import awsconfig from './aws-exports'; // path to your AWS Amplify configuration file



import { generateClient } from "aws-amplify/api";
import { createWeek } from './graphql/mutations';
import { updateWeek } from './graphql/mutations';

import { deleteWeek } from './graphql/mutations';


import { listWeeks, getWeek } from "./graphql/queries";
import { string } from "yargs";




const client = generateClient();

Amplify.configure(awsconfig);



const App = () => {




  useEffect(() => {
    const fetchData = async () => {
      try {
        // List all items
        //const allWeeks: Week[] = await client.graphql({ query: queries.listWeeks });
        const allWeeks: GraphQLResult<any> = await client.graphql({ query: listWeeks });

        console.log(allWeeks.data.listWeeks);


        setPrevPlans(allWeeks.data.listWeeks.items);
        setDataFetched(true);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);



  // Assuming the Week type is defined somewhere in your code
  interface Week {
    id: string;
    weeksToRace: number;
    buildPercent: number;
    cutbackWeek: number;
    cutbackAmount: number;
    runsPerWeek: number;
    startingMileage: number;
    runPercents: number[];
    notes: string;
    createdAt: string;
    updatedAt: string;
    __typename: string;
  }










  const [addingNote, setAddingNote] = React.useState(false);




  //random comment so it redeploys

  const handleAddRun = async () => {

    //gets rid of trailing zeroes
    const newRunPercents = parameters.runPercents.slice(0, parameters.runsPerWeek);

    setParameters((prevParameters) => ({
      ...prevParameters,
      runPercents: newRunPercents,
    }))

    generateWeeks();

    try {

      const newWeek: GraphQLResult<any> = await client.graphql({
        query: createWeek,
        variables: {
          input: {
            weeksToRace: parameters.weeksToRace,
            buildPercent: parameters.buildPercent,
            cutbackWeek: parameters.cutbackWeek,
            cutbackAmount: parameters.cutbackAmount,
            runsPerWeek: parameters.runsPerWeek,
            startingMileage: parameters.startingMileage,
            runPercents: parameters.runPercents,
            notes: currNote,
          },
        },
      });

      // Assuming the mutation returns the created week
      console.log(newWeek);

      setPrevPlans((prevPlans) => [newWeek.data.createWeek, ...prevPlans]);

      console.log('New week created:', newWeek);

      displayAddSuccess();

    } catch (error) {
      console.error('Error adding data:', error);
      // Handle any other errors that might occur during the mutation
    }


  };

  //keep track of when the data is fetched
  const [dataFetched, setDataFetched] = React.useState(false);




  const handleUpdateNote = async (weekId: string) => {
    try {
      // Use the current note from the state
      const updatedWeek = await client.graphql({
        query: updateWeek,
        variables: {
          id: weekId,
          notes: currNote,
        },
      });

      // Update the state with the updated notes
      const updatedWeeks = prevPlans.map((week) =>
        week.id === weekId ? { ...week, notes: currNote } : week
      );

      setPrevPlans(updatedWeeks);

      console.log('Week notes updated:', updatedWeek);
    } catch (error) {
      console.error('Error updating notes:', error);
    }

    displayUpdateSuccess();
  };

  const [percents100, setPercents100] = React.useState(false);
  const [percentsValidator, setPercentValidator] = React.useState('');




  const validatePercents = () => {

    let sum = 0;

    for (let i = 0; i < parameters.runsPerWeek; i++) {
      sum += parameters.runPercents[i];
    }

    if (sum != 100) {
      setPercents100(false);
      setPercentValidator("Percents are recommended to add to 100");
    }
    else {
      setPercents100(true);
    }
  }

  //success toaster
  const displayAddSuccess = () => {
    toastr.success('Plan added', 'Success', {
      positionClass: 'toast-bottom-right',
    });
  };

  //success update toaster
  const displayUpdateSuccess = () => {
    toastr.success('Plan Updated', 'Success', {
      positionClass: 'toast-bottom-right',
    });
  };

  //success Download toaster
  const displayDownloadSuccess = () => {
    toastr.success('Plan downloaded', 'Success', {
      positionClass: 'toast-bottom-right',
    });
  };

  //success delete toastr
  const displayDeleteSuccess = () => {
    toastr.success('Plan deleted', 'Success', {
      positionClass: 'toast-bottom-right',
    });
  };






  //handle delete week
  const handleDeleteWeek = async (weekId: string) => {
    try {
      const deletedWeek = await client.graphql({
        query: deleteWeek,
        variables: {
          input: {
            id: weekId
          }
        }
      });
      // Fetch the updated list of weeks after deletion
      const updatedWeeksResponse: GraphQLResult<any> = await client.graphql({
        query: listWeeks
      });

      // Update the state with the updated list of weeks
      setPrevPlans(updatedWeeksResponse.data.listWeeks.items);
    } catch (error) {
      console.error('Error updating notes:', error);
    }

    displayDeleteSuccess();
  };



  function convertArrayToCSV(allWeeksArray: number[][]) {
    // Generate dynamic headers for runs based on run percentages
    const runHeaders = Array.from({ length: parameters.runsPerWeek }, (_, index) =>
      `Run ${index + 1}: ${parameters.runPercents[index]}%`
    );

    // Combine all headers, including the static ones
    const allHeaders = ['Week Number', 'Total Mileage', ...runHeaders];

    // Create the CSV string with headers
    const csv = [
      allHeaders.join(','), // Headers row
      ...allWeeksArray.map((row) => {
        const formattedRow = [row[0], row[1], ...row.slice(2).map((run, index) => run)];
        return formattedRow.join(',');
      }) // Data rows
    ].join('\n');

    return csv;
  }

  const handleDownload = () => {
    const csv = convertArrayToCSV(weeksArray);

    // Create a Blob
    const blob = new Blob([csv], { type: 'text/csv' });

    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'running_plan.csv'; // Set your desired file name here

    // Append the link to the document
    document.body.appendChild(link);

    // Trigger a click on the link to start the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);

    displayDownloadSuccess();
  };


  const [runsChanged, setRunsChanged] = React.useState(false);



  //generates a CSV

  //sets up the state to hold previous runs
  //an array of arrays. each individual array has a set of parameters. 
  const [prevPlans, setPrevPlans] = React.useState<Week[]>([]);

  //setting up the dialog
  const [dialog, setDialog] = React.useState(false);

  //sets up array for parameters
  const [parameters, setParameters] = React.useState({
    weeksToRace: 1,
    buildPercent: 1,
    cutbackWeek: 1,
    cutbackAmount: 0,
    runsPerWeek: 0,
    startingMileage: 1,
    runPercents: Array.from({ length: 8 }, () => 0),
    notes: '',
  });



  //sets up the numbers for the dropdowns
  const raceWeekNumbers = Array.from({ length: 100 }, (_, index) => index + 1);






  const [weeksArray, setWeeksArray] = React.useState<number[][]>([]);




  //method to generate the runs. Creates array of runs for the week
  const generateRuns = (totalMileage: number) => {
    const runArray = [];
    for (let i = 0; i < parameters.runsPerWeek; i++) {
      runArray.push(
        roundToNearestTenth(totalMileage * (parameters.runPercents[i] / 100))
      );
    }
    return runArray;
  };


  const roundToNearestTenth = (number: number): number => {
    const roundedNumber = Number(number.toFixed(1));
    return roundedNumber;
  };

  const handleRunPercentChange = (event: Event, value: number | number[], activeThumb: number) => {
    const index = activeThumb - 1; // activeThumb is 1-based
    const newRunPercents = [...parameters.runPercents];
    const newValue = typeof value === 'number' ? value : 0;
    newRunPercents[index] = newValue;

    setParameters((prevParameters) => ({
      ...prevParameters,
      runPercents: newRunPercents,
    }));

    const isSum100 = newRunPercents.reduce((sum, value) => sum + value, 0) === 100;

    setPercents100(isSum100);


  };




  //method to generate all the weeks
  const generateWeeks = () => {
    const allWeeks = [];
    const firstWeek = [];

    let currMileage = parameters.startingMileage;

    firstWeek.push(1, parameters.startingMileage);
    firstWeek.push(...generateRuns(currMileage));



    allWeeks.push(firstWeek.slice());

    for (let i = 2; i < parameters.weeksToRace + 1; i++) {
      const currWeek = [];

      // deload week
      if (i % parameters.cutbackWeek === 0) {
        // updates the week using the cutback percent
        let cutMileage = roundToNearestTenth(currMileage * (parameters.cutbackAmount / 100));
        console.log('debug-currmileage', currMileage);
        console.log('debug-cutback', parameters.cutbackAmount);
        currWeek.push(i, cutMileage);
        currWeek.push(...generateRuns(cutMileage))
      } else {
        // updates the week using the normal build percent
        //ups the mileage
        currMileage = roundToNearestTenth(currMileage * (1 + (parameters.buildPercent / 100)));
        currWeek.push(i, currMileage);
        currWeek.push(...generateRuns(currMileage))

      }


      allWeeks.push(currWeek.slice());
    }



    setWeeksArray(allWeeks);
  };


  //methods to deal with input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name == "runsPerWeek") {
      setRunsChanged(true);
    }

    setParameters((prevParameters) => ({
      ...prevParameters,
      [name]: parseFloat(value),
    }));
  };




  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCurrNote(value);
  };



  const [usableWeekID, setUsableWeekId] = React.useState('');


  //method to handle dialog close
  const handleCloseDialog = () => {

    setDialog(false);
  }

  //method to handle dialog open
  const handleOpenDialog = (editNote: boolean, index: number, weekId: string) => {
    if (!dataFetched) {

      return;
    }

    //original dialog open
    if (!editNote) {

      // Find the index of the last non-zero element
      const newRunPercents = parameters.runPercents.slice(0, parameters.runsPerWeek);

      setParameters((prevParameters) => ({
        ...prevParameters,
        runPercents: newRunPercents,
      }))



      console.log("ugh-run percents", parameters.runPercents)

      generateWeeks();
      //handleAddRun();
      setDialog(true);

    }
    else {
      // Second dialog open
      // Find the index of the week with the specified weekId
      const weekIndex = prevPlans.findIndex((week) => week.id === weekId);
      setUsableWeekId(weekId);

      if (weekIndex !== -1) {
        const selectedWeek = prevPlans[weekIndex];


        setParameters((prevParameters) => ({
          ...prevParameters,
          ...selectedWeek,
        }));

        setParameters((prevParameters) => ({
          ...prevParameters,
          notes: currNote,
        }));


        setAddingNote(true);

        generateWeeks();



        setDialog(true);


        console.log("Updated parameters with data from week", weekId, ":", selectedWeek);
      } else {
        console.error("Week with ID", weekId, "not found in prevPlans.");
      }



    }



  }

  /*
  //opens notes dialog
  const [noteDialog, setNoteDialog] = React.useState(false);
  */

  //keeps track of the note value
  const [currNote, setCurrNote] = React.useState('');


  const [updateNoteId, setUpdateNoteId] = React.useState<string>('');





  /*
  const handleNoteView = (index: number, weekId: string) => {
    setCurrNote(prevPlans[index].notes);
    setNoteDialog(true);
    setUpdateNoteId(weekId);
  };
  */


















  return (
    <div className="app-container">

      <div> {!dataFetched ? (
        <Circles
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />) : null} 
      
      
        
        
      </div>

      <h1 className="title"> Running Plan Generator </h1>

      {/* Creates View Dialog*/}
      <Dialog className="view-dialog" open={dialog} onClose={handleCloseDialog}>
        <DialogTitle style={{ textAlign: 'center' }}> Weekly Mileages </DialogTitle>
        <DialogContent>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell> Week Number </TableCell>
                <TableCell> Total Mileage </TableCell>
                {Array.from({ length: parameters.runsPerWeek }).map((_, index) => (
                  <TableCell key={index}>Run {index + 1}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {weeksArray.map((singleWeek, index) => (
                <TableRow key={index}>
                  {singleWeek.map((data, dataIndex) => (
                    <TableCell key={dataIndex}>{data}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogContent>

          <div style={{ textAlign: "center" }}>
            <TextField
              name="noteTextField"
              label="Notes"
              value={currNote}
              variant="outlined"
              onChange={(e) => setCurrNote(e.target.value)}
            />
          </div>



        </DialogContent>
        <div className="two-buttons">
          <Button
            variant="contained"
            color="primary"
            style={{ width: '100%', padding: '10px', marginTop: '8px', marginRight: '4px' }}
            onClick={addingNote ? () => handleUpdateNote(usableWeekID) : handleAddRun}


          >
            Save to Database
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleDownload}
            style={{ width: '100%', padding: '10px', marginTop: '8px' }}> Download CSV </Button>
        </div>

      </Dialog>





      <div className="main-container">
        <div className="row-container">

          {/*creates the About Panel*/}
          <Paper className="about-panel form-and-about">
            <div style={{ textAlign: 'center' }}>
              <h3> About </h3>
            </div>
            <br />This app helps you automatically generate a new running plan, based on the principle of maximizing mileage. Weekly running mileage is strongly correlated with race times for distances from the 5K to the marathon!
            <br /><br /> Previously generated plans are included at the bottom for your convenience.
            <br /> <br />Use the "Notes" feature to label your plans and organize. <br /><br />
            <Typography>
              Learn more at{' '}
              <a
                href="https://www.scienceofultra.com/podcasts/136"
                target="_blank"
                rel="noopener noreferrer"
              >
                The Science of Ultra.
              </a>
            </Typography>

          </Paper>

          {/*renders the form for input*/}
          <form className="run-input-form form-and-about" onSubmit={(e) => { e.preventDefault(); handleOpenDialog(false, 2, 'randomstring'); }}>

            <div className="label-input-container">
              <label> Weeks to Race:
                <select
                  name="weeksToRace"
                  onChange={handleInputChange}
                  title="Enter how many weeks you want to train for"
                  required
                >
                  {raceWeekNumbers.map(number => (
                    <option key={number} value={number}> {number} </option>
                  ))}
                </select>
              </label>
            </div>


            <div className="label-input-container">
              <label> Build Percent:
                <select
                  name="buildPercent"
                  title="Enter the percentage increase you want to have each week. Recommended percents are between 5 and 10."
                  onChange={handleInputChange}
                  required
                >
                  {raceWeekNumbers.map(number => (
                    <option key={number} value={number}> {number} </option>
                  ))}
                </select>

              </ label>
            </div>


            <div className="label-input-container"><label> Cutback week:
              <select
                name="cutbackWeek"
                title="It's important to take a cutback week every so often to fully recover. A recommended cutback week amount is very 3 - 8 weeks."
                onChange={handleInputChange}
                required>
                {raceWeekNumbers.map(number => (
                  <option key={number} value={number}> {number} </option>
                ))}
              </select>
            </label>
            </div>

            <div className="label-input-container">
              <label> Cut Back Percent:
                <select
                  name="cutbackAmount"
                  onChange={handleInputChange}
                  required
                  title="Enter the percent of normal mileage each cutback week should be. This can be anywhere from 30 - 80% of a normal week."
                > {raceWeekNumbers.map(number => (
                  <option key={number} value={number}> {number} </option>
                ))}
                </select>
              </label>
            </div>



            <div className="label-input-container">
              <label> Runs per Week:
                <select
                  onChange={handleInputChange}
                  name="runsPerWeek"
                  required
                  title="Enter how many runs you would like to do per week"
                >
                  {raceWeekNumbers.map(number => (
                    <option key={number} value={number}> {number} </option>
                  ))}
                </select>
              </label>
            </div>



            {Array.from({ length: parameters.runsPerWeek }).map((_, index) => (
              <div key={index}>

                <div className="label-input-container">
                  <label>{`Run ${index + 1} Percent:`}
                    <Slider
                      aria-labelledby="input-slider"
                      defaultValue={50}
                      onChange={(event, value) => handleRunPercentChange(event, value, index + 1)}
                      name={`runPercent${index + 1}`}
                      step={1}
                      min={0}
                      max={100}
                      color={!percents100 ? "primary" : "secondary"}
                      value={parameters.runPercents[index]}
                      valueLabelDisplay="auto"
                      title="Choose what percent of the total mileage each run should be."

                    />


                  </label>

                </div>

              </div>
            ))}

            <div style={{ textAlign: 'center', marginBottom: '4px' }}> {runsChanged && !percents100 ? (
              <Chip
                variant="outlined"
                color="warning"
                label="Percents should add to 100." />


            ) : null} </div>


            <label> Starting Mileage:
              <select
                name="startingMileage"
                value={parameters.startingMileage}
                onChange={handleInputChange}
                placeholder="Starting Mileage"
                title="Enter your current weekly mileage"
                required>
                {raceWeekNumbers.map(number => (
                  <option key={number} value={number}> {number} </option>
                ))}
              </select>
            </label>


            <label> Notes:
              <input

                type="text"
                name="notes"
                title="Enter any notes to annotate your plan"
                onChange={handleNotesChange}
                placeholder="Notes"
              />
            </label>


            <Button type="submit" variant="contained" color="primary"
              style={{ width: '70%', padding: '10px', marginTop: '8px' }} > View </Button>



          </form>


        </div>


        {/* table for previous runs */}
        <div className="table-container">
          <Typography variant="h6" gutterBottom align="center">
            Previously Generated Plans
          </Typography>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>

                <TableCell align="center" sx={{ color: 'gray' }}>
                  Weeks To Race
                </TableCell>
                <TableCell align="center" sx={{ color: 'gray' }}>
                  Build Percent
                </TableCell>
                <TableCell align="center" sx={{ color: 'gray' }}>
                  Cutback Week
                </TableCell>
                <TableCell align="center" sx={{ color: 'gray' }}>
                  Cutback Percent
                </TableCell>
                <TableCell align="center" sx={{ color: 'gray' }}>
                  Runs per Week
                </TableCell>
                <TableCell align="center" sx={{ color: 'gray' }}>
                  Starting Mileage
                </TableCell>
                <TableCell align="center" sx={{ color: 'gray' }}>
                  Run Percents
                </TableCell>
                <TableCell align="center" sx={{ color: 'gray' }}> Note </TableCell>
                <TableCell align="center" sx={{ color: 'gray' }}>
                  Action
                </TableCell>

              </TableHead>
              <TableBody>

                {prevPlans.map((weekElement, index) => (
                  <TableRow key={index}>
                    <TableCell>{weekElement.weeksToRace}</TableCell>
                    <TableCell>{weekElement.buildPercent}</TableCell>
                    <TableCell>{weekElement.cutbackWeek}</TableCell>
                    <TableCell>{weekElement.cutbackAmount}</TableCell>
                    <TableCell>{weekElement.runsPerWeek}</TableCell>
                    <TableCell>{weekElement.startingMileage}</TableCell>
                    <TableCell>{weekElement.runPercents.join(', ')}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleOpenDialog(true, index, weekElement.id)}>View/Edit Note</Button>
                    </TableCell>
                    <TableCell> <Button onClick={() => handleDeleteWeek(weekElement.id)}> Delete Plan </Button> </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </TableContainer>
        </div>
      </div>






    </div >
  );
};

export default App;