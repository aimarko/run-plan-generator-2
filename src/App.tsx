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
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import { generateClient } from "aws-amplify/api";
import { createWeek } from './graphql/mutations';
import { updateWeek } from './graphql/mutations';

import { listWeeks, getWeek } from "./graphql/queries";

const client = generateClient();





const App = () => {



  async function fetchData() {
    // List all items
    const allWeeks = await client.graphql({
      query: listWeeks
    });

    // Do something with allWeeks
    setPrevPlans(allWeeks);
  }

  // Call the async function
  fetchData();






  const handleAddRun = async () => {
    try {

      const newWeek = await client.graphql({
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
            notes: parameters.notes,
          },
        },
      });

      // Assuming the mutation returns the created week
      setPrevPlans([newWeek.data.createWeek, ...prevPlans]);

      console.log('New week created:', newWeek);
    } catch (error) {
      console.error('Error adding data:', error);
      // Handle any other errors that might occur during the mutation
    }
  };

  const handleUpdateNote = async (weekId) => {
    try {
      const updatedWeek = await client.graphql({
        query: updateWeek,
        variables: {
          id: weekId,
          notes: parameters.notes,
        },
      });

      // Update the state with the updated week
      const updatedWeeks = prevPlans.map((week) =>
        week.id === weekId ? { ...week, notes: parameters.notes } : week
      );

      setPrevPlans(updatedWeeks);

      console.log('Week notes updated:', updatedWeek);
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };









  //sets up the state to hold previous runs
  //an array of arrays. each individual array has a set of parameters. 
  const [prevPlans, setPrevPlans] = React.useState<Week[]>([]);

  //setting up the dialog
  const [dialog, setDialog] = React.useState(false);

  //sets up array for parameters
  const [parameters, setParameters] = React.useState({
    weeksToRace: 0,
    buildPercent: 0,
    cutbackWeek: 0,
    cutbackAmount: 100,
    runsPerWeek: 0,
    startingMileage: 0,
    runPercents: Array.from({ length: 8 }, () => 0),
    notes: '',
  });



  //sets up the numbers for the dropdowns
  const raceWeekNumbers = Array.from({ length: 100 }, (_, index) => index + 1);


  //sets interface for prevPlans
  interface Week {
    id: number;
    weeksToRace: number;
    buildPercent: number;
    cutbackWeek: number;
    cutbackAmount: number;
    runsPerWeek: number;
    startingMileage: number;
    runPercents: number[];
    notes: string;
  }



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

  const handleRunPercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = Number(e.target.name.replace("runPercent", "")) - 1;
    const newRunPercents = [...parameters.runPercents];
    const newValue = e.target.value !== "" ? Number(e.target.value) : 0;
    newRunPercents[index] = newValue;
    setParameters((prevParameters) => ({
      ...prevParameters,
      runPercents: newRunPercents,
    }));
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
    setParameters((prevParameters) => ({
      ...prevParameters,
      [name]: parseFloat(value),
    }));
  };



  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setParameters((prevParameters) => ({
      ...prevParameters,
      notes: value,
    }));
  };




  //method to handle dialog close
  const handleCloseDialog = () => {
    setNoteDialog(false);
    setDialog(false);
  }

  //method to handle dialog open
  const handleOpenDialog = () => {


    // Find the index of the last non-zero element
    const newRunPercents = parameters.runPercents.slice(0, parameters.runsPerWeek);

    setParameters((prevParameters) => ({
      ...prevParameters,
      runPercents: newRunPercents,
    }))

    console.log("ugh-run percents", parameters.runPercents)

    generateWeeks();
    handleAddRun();
    setDialog(true);

  }

  const [noteDialog, setNoteDialog] = React.useState(false);
  const [currNote, setCurrNote] = React.useState('');
  const [updateNoteId, setUpdateNoteId] = React.useState(null);


  const handleNoteView = (index, weekId) => {
    setCurrNote(prevPlans[index].notes);
    setNoteDialog(true);
    setUpdateNoteId(weekId);
  };
















  return (
    <div className="app-container">

      <h1 className="title"> Running Plan Generator </h1>

      {/* Creates View Dialog*/}
      <Dialog open={dialog} onClose={handleCloseDialog}>
        <DialogTitle> Weekly Mileages </DialogTitle>
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
          <Typography variant="body1" gutterBottom>
            Notes: {parameters.notes}
          </Typography>
        </DialogContent>
        <Button
          variant="contained"
          color="primary"
          style={{ width: '100%', padding: '10px', marginTop: '8px' }}> Generate CSV </Button>
      </Dialog>

      <Dialog open={noteDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <TextField
            name="noteTextField"
            value={currNote}
            variant="outlined"
            onChange={(e) => setCurrNote(e.target.value)}
          />
          <Button onClick={() => handleUpdateNote(updateNoteId)}>Update Note</Button>
        </DialogContent>
      </Dialog>


      <div className="main-container">
        <div className="row-container">

          {/*creates the About Panel*/}
          <Paper className="about-panel form-and-about"> Insert about text here </Paper>

          {/*renders the form for input*/}
          <form className="run-input-form form-and-about" onSubmit={(e) => { e.preventDefault(); handleOpenDialog(); }}>

            <div className="label-input-container">
              <label> Weeks to Race:
                <select
                  name="weeksToRace"
                  onChange={handleInputChange}
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
                <input
                  type="text"
                  name="buildPercent"
                  placeholder="Build Percent"
                  onChange={handleInputChange}
                  required
                />
              </ label>
            </div>


            <div className="label-input-container"><label> Cutback week:
              <select
                name="cutbackWeek"
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
                <input
                  type="text"
                  name="cutbackAmount"
                  onChange={handleInputChange}
                  placeholder="Cut Back Percent"
                  required
                />
              </label>
            </div>



            <div className="label-input-container">
              <label> Runs per Week:
                <select
                  onChange={handleInputChange}
                  name="runsPerWeek"
                  required
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
                  <label>{`Run ${index + 1} Percent:`}</label>
                  <input
                    type="text"
                    name={`runPercent${index + 1}`}
                    onChange={handleRunPercentChange}
                    value={parameters.runPercents[index]}
                    placeholder={`Run ${index + 1} Percent`}

                    required
                  />
                </div>

              </div>
            ))}


            <label> Starting Mileage:
              <input
                type="text"
                name="startingMileage"
                value={parameters.startingMileage}
                onChange={handleInputChange}
                placeholder="Starting Mileage"
                required
              />
            </label>

            <label> Notes:
              <input
                type="text"
                name="notes"
                onChange={handleNotesChange}
                placeholder="Notes"
                required />
            </label>

            <Button type="submit" variant="contained" onClick={handleOpenDialog} color="primary"
              style={{ width: '100%', padding: '10px', marginTop: '8px' }} > View </Button>

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

                      <Button onClick={() => handleNoteView(index, weekElement.id)}>View Note</Button>


                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </TableContainer>
        </div>
      </div>






    </div>
  );
};

export default App;