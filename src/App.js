import './App.css';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import { useState, useEffect } from 'react';
import { CssVarsProvider, extendTheme, useColorScheme } from '@mui/joy/styles';
import { WarningRounded as WarningRoundedIcon, SettingsTwoTone as SettingsTwoToneIcon} from '@mui/icons-material';
import ReactDOM from 'react-dom'
import { Button, ButtonGroup, Sheet, Card, Divider, Modal, ModalDialog, Typography, FormControl, FormLabel, Stack, Switch, Textarea, Select, Option } from '@mui/joy';

function updateHTML(){
  const divToUpdate = document.querySelector(".react-calendar__month-view > div")
  let childDivToUpdate = null;
  
  if(divToUpdate)
  {
    divToUpdate.style.height = "100%";
    divToUpdate.style.alignItems = "flex-start";
    childDivToUpdate = divToUpdate.querySelector("div");
  }
  if(childDivToUpdate)
  {
    childDivToUpdate.style.height = "100%";
    childDivToUpdate.style.display = "flex";
    childDivToUpdate.style.flexDirection = "column";
  }
}

function TitleBar(){
  return(
    <div className="titleBar">
      <Card color="neutral" variant="soft" size="xs" orientation="horizontal">
        <img src="/logo.png" style={{width:"70px", marginLeft:"-5px"}}></img>
        <span className='titleText'>TimeKeeper</span>
      </Card>
    </div>
  );
}

function InfoBox({selectedEvent, setSelectedEvent, events, setEvents, isCompletionSoundMuted, pickedSound}){
  const [isTemplateEvent, setIsTemplateEvent] = useState(selectedEvent.date.getTime() === new Date(0).getTime());
  useEffect(() => {
    setIsTemplateEvent(selectedEvent.date.getTime() === new Date(0).getTime());
  }, [selectedEvent]);

  return(
    <Card color="neutral" variant="outlined" 
                          invertedColors={true} 
                          className="infoBox" 
                          sx={{"--Card-radius": "0px", display:"flex", alignItems:"center"}}>
      <span className='eventTitleText'> {selectedEvent.title} </span>
      <span className="dateTimeText"> {isTemplateEvent ? " " : selectedEvent.date.toLocaleDateString()} </span>
      <Divider></Divider>
      <span className="descriptionText"> {selectedEvent.description} </span>
      <Sheet>
      {
        !isTemplateEvent && (
          <Sheet>
            <>
              <span>Mark As Complete: </span>
              <Switch size='sm'
                      sx={{marginLeft:"20px"}}
                      checked={selectedEvent.completionStatus}
                      onChange={(e) => {
                        editEventInArray(events, setEvents, selectedEvent, setSelectedEvent, selectedEvent.title, selectedEvent.description, e.target.checked);
                        var sound = document.getElementById(pickedSound);
                        if(e.target.checked === true && isCompletionSoundMuted === false)
                          sound.play();
                      }}
              >
              </Switch>
            </>
          </Sheet>
        )
      }
      </Sheet>
    </Card>
  );
}

function CreateButton({setCreateWindowVisible}){
  return(
    <Button variant="solid" color="primary" className='createButton' onClick={()=>{setCreateWindowVisible(true)}}>
      New Event
    </Button>
  );
}

function EditButton({setEditWindowVisible}){
  return(
    <Button variant="outlined" color="warning" className='editButton' onClick={()=>{setEditWindowVisible(true)}}>
      Edit Event
    </Button>
  );
}

function DeleteButton({setDeleteWindowVisible}){
  return(
    <Button variant="outlined" color="warning" className='deleteButton' onClick={()=>{setDeleteWindowVisible(true)}}>
      Delete Event
    </Button>
  );
}

function SettingsButton({setSettingsWindowVisible}){
  return(
    <Button variant="solid" color="primary" className='settingsButton' onClick={()=>{setSettingsWindowVisible(true)}}>
      Settings
    </Button>
  );
}

function CreateWindow({date, setCreateWindowVisible, events, setEvents}){

  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [completionStatus, setCompletionStatus] = useState(false);

  return(
    <ModalDialog aria-labelledby="basic-modal-dialog-title"
                  aria-describedby="basic-modal-dialog-description">
      <Typography id="basic-modal-dialog-title" level="h2">
          New Event - {date.toLocaleDateString()}
      </Typography>
      <Typography id="basic-modal-dialog-description">
        Fill in the information of the event.
      </Typography>
      <Divider sx={{marginBottom:"15px"}}></Divider>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            addEventToEventArray(date, title, description, completionStatus, events, setEvents);
            setCreateWindowVisible(false);
          }}
        >
          <Stack spacing={2.5}>
            <FormControl>
              <FormLabel style={{fontWeight:"bold"}}>Title</FormLabel>
              <Textarea autoFocus 
                      required 
                      placeholder="Type here..." 
                      onChange={(e) => setTitle(e.target.value)}
                      />
            </FormControl>
            <FormControl>
              <FormLabel style={{fontWeight:"bold"}}>Description</FormLabel>
              <Textarea required 
                      placeholder="Type here..." 
                      onChange={(e) => setDescription(e.target.value)}
                      />
            </FormControl>
            <FormControl>
              <FormLabel style={{fontWeight:"bold"}}>
                Mark As Complete: 
                <Switch style={{marginLeft:"79px"}}
                        checked={completionStatus}
                        onChange={(e) => setCompletionStatus(e.target.checked)} 
                >
                </Switch>
              </FormLabel>
            </FormControl>
            <Sheet sx={{display:"flex"}}>
              <Button style={{fontSize:"1em", flex:1}} variant="outlined" onClick={()=>{setCreateWindowVisible(false)}}>Cancel</Button>
              <Button style={{fontSize:"1em", flex:2, marginLeft:"50px"}} variant="solid" type="submit">Save</Button>
            </Sheet>
          </Stack>
        </form>
      </ModalDialog>
  );
}

function EditWindow({date, setEditWindowVisible, events, setEvents, selectedEvent, setSelectedEvent}){

  const [title, setTitle] = useState(selectedEvent.title);
  const [description, setDescription] = useState(selectedEvent.description);
  const [completionStatus, setCompletionStatus] = useState(selectedEvent.completionStatus);

  return(
    <ModalDialog aria-labelledby="basic-modal-dialog-title"
                  aria-describedby="basic-modal-dialog-description">
      <Typography id="basic-modal-dialog-title" level="h2">
          Edit Event - {date.toLocaleDateString()}
      </Typography>
      <Typography id="basic-modal-dialog-description">
        Edit the information of the event.
      </Typography>
      <Divider sx={{marginBottom:"15px"}}></Divider>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            editEventInArray(events, setEvents, selectedEvent, setSelectedEvent, title, description, completionStatus);
            setEditWindowVisible(false);
          }}
        >
          <Stack spacing={2.5}>
            <FormControl>
              <FormLabel style={{fontWeight:"bold"}}>Title</FormLabel>
              <Textarea autoFocus 
                      required 
                      placeholder="Type here..." 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      />
            </FormControl>
            <FormControl>
              <FormLabel style={{fontWeight:"bold"}}>Description</FormLabel>
              <Textarea required 
                      placeholder="Type here..." 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel style={{fontWeight:"bold"}}>
                Mark As Complete: 
                <Switch style={{marginLeft:"79px"}}
                        checked={completionStatus}
                        onChange={(e) => setCompletionStatus(e.target.checked)} 
                >
                </Switch>
              </FormLabel>
            </FormControl>
            <Sheet sx={{display:"flex"}}>
              <Button style={{fontSize:"1em", flex:1}} variant="outlined" onClick={()=>{setEditWindowVisible(false)}}>Cancel</Button>
              <Button style={{fontSize:"1em", flex:2, marginLeft:"50px"}} variant="solid" type="submit">Save</Button>
            </Sheet>
          </Stack>
        </form>
      </ModalDialog>
  );
}

function DeleteWindow({selectedEvent, setDeleteWindowVisible, events, setEvents}){
  return(
    <ModalDialog
      variant="outlined"
      role="alertdialog"
      aria-labelledby="alert-dialog-modal-title"
      aria-describedby="alert-dialog-modal-description"
    >
      <Typography
        id="alert-dialog-modal-title"
        level="h2"
        startDecorator={<WarningRoundedIcon />}
      >
        Confirmation
      </Typography>
      <Divider />
      <Typography id="alert-dialog-modal-description" textColor="text.tertiary">
        Are you sure you want to delete the event on {selectedEvent.date.toLocaleDateString()} titled "{selectedEvent.title}"
      </Typography>
      <Sheet sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
        <Button variant="plain" color="neutral" onClick={() => setDeleteWindowVisible(false)}>
          Cancel
        </Button>
        <Button variant="solid" color="danger" onClick={() => {
          removeEventFromArray(selectedEvent, events, setEvents);
          setDeleteWindowVisible(false)}
          }>
          Delete Event
        </Button>
      </Sheet>
    </ModalDialog>
  );
}

function SettingsWindow({setSettingsWindowVisible, setClearDataWindowVisible, isCompletionSoundMuted, setCompletionSoundMuted, pickedSound, setPickedSound}){
  const {mode: darkThemeStatus, setMode: setDarkThemeStatus} = useColorScheme();
  const [mounted, setMounted] = useState(false);
  const [tempDarkThemeStatus, setTempDarkThemeStatus] = useState(darkThemeStatus == "dark" ? "dark" : "light");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return(
    <ModalDialog
    variant="outlined"
    role="alertdialog"
    aria-labelledby="alert-dialog-modal-title"
    aria-describedby="alert-dialog-modal-description"
    >
      <Typography
        id="alert-dialog-modal-title"
        level="h2"
        startDecorator={<SettingsTwoToneIcon sx={{paddingTop:"2px", marginLeft:"-5px",maxHeight:"25px"}}/>}
        
      >
        Settings
      </Typography>
      <Divider />
      <form
          onSubmit={(event) => {
            setDarkThemeStatus(tempDarkThemeStatus);
            setSettingsWindowVisible(false);
            setClearDataWindowVisible(false);
          }}
      >
        <Stack spacing={2.5}>
            <FormLabel style={{fontWeight:"bold", marginTop:"20px"}}>
              Use Dark Theme
              <Switch style={{marginLeft:"99px"}}
                      checked={tempDarkThemeStatus == "dark" ? true : false}
                      onChange={(e) => setTempDarkThemeStatus(e.target.checked == true ? "dark" : "light")} 
              >
              </Switch>
            </FormLabel>
            <FormLabel style={{fontWeight:"bold", marginTop:"20px"}}>
              Mute Completion Sound
              <Switch style={{marginLeft:"46px"}}
                      checked={isCompletionSoundMuted}
                      onChange={(e) => setCompletionSoundMuted(e.target.checked)} 
              >
              </Switch>
            </FormLabel>
            <FormControl>
              <FormLabel style={{fontWeight:"bold", marginTop:"2px", marginBottom:"10px"}}>
                Completion Sound Effect
              </FormLabel>
              <Select defaultValue={pickedSound} onChange={(e)=> {
                if(e.target.innerHTML === "Sound 1")
                  setPickedSound("sound1");
                else if(e.target.innerHTML === "Sound 2")
                  setPickedSound("sound2");
                else if(e.target.innerHTML === "Sound 3")
                  setPickedSound("sound3");
              }}>
                <Option value="sound1">Sound 1</Option>
                <Option value="sound2">Sound 2</Option>
                <Option value="sound3">Sound 3</Option>
              </Select>
            </FormControl>
            <Button variant='soft' 
                    color='danger'
                    onClick={()=> {setClearDataWindowVisible(true);}}       
            >
              Clear Calendar Data
            </Button>
          <Sheet sx={{display:"flex"}}>
            <Button style={{fontSize:"1em", flex:1}} variant="outlined" onClick={()=>{
                                                                                      setSettingsWindowVisible(false)
                                                                                      setClearDataWindowVisible(false)
                                                                                      }}>Cancel</Button>
            <Button style={{fontSize:"1em", flex:2, marginLeft:"50px"}} variant="solid" type="submit">Save</Button>
          </Sheet>
        </Stack>
      </form>
    </ModalDialog>
  );
}

function ClearDataConfirmationWindow({isClearDataWindowVisible, setClearDataWindowVisible, eventsTemplate, setEvents, setSelectedEvent}){
  if(!isClearDataWindowVisible)
    return;
  return(
    <ModalDialog
    variant="outlined"
    role="alertdialog"
    aria-labelledby="alert-dialog-modal-title"
    aria-describedby="alert-dialog-modal-description"
    >
      <Typography
        id="alert-dialog-modal-title"
        level="h2"
        startDecorator={<WarningRoundedIcon />}
      >
        Confirmation
      </Typography>
      <Divider />
      <Typography id="alert-dialog-modal-description" textColor="text.tertiary">
        Are you sure you want to delete all your events? This cannot be undone.
      </Typography>
      <Sheet sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
        <Button variant="plain" color="neutral" onClick={() => setClearDataWindowVisible(false)}>
          Cancel
        </Button>
        <Button variant="solid" color="danger" onClick={() => {
          localStorage.clear();
          setEvents(eventsTemplate);
          setSelectedEvent(eventsTemplate[eventsTemplate.length-1].eventList[0]);
          setClearDataWindowVisible(false);
        }}>
          Delete All Events
        </Button>
      </Sheet>
    </ModalDialog>
  );
}

function checkDatesMatch(date1, date2)
{
  if(date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getYear() === date2.getYear())
    return true;

  return false;
}

function addEventToEventArray(date, title, description, completionStatus, events, setEvents){
  //create deep copy of the array by stringifying it and parsing it
  let tempArray = JSON.stringify(events);
  tempArray = JSON.parse(tempArray);
  //date objects have to be recreated after parsing
  if (tempArray) {
    tempArray = tempArray.map(event => ({
        ...event,
        date: new Date(event.date),
        eventList: event.eventList.map(e => ({
            ...e,
            date: new Date(e.date)
        }))
    }));
  }
  //find matching date, if none found, add new element to arrray representing new date
  for(let i = 0; i < tempArray.length; i++)
  {
    if(checkDatesMatch(tempArray[i].date, date))
    {
      tempArray[i].eventList.push({title: title, date: date, description: description, completionStatus: completionStatus})
      setEvents(tempArray);
      return;
    }
  }

  tempArray.push({
      date: date,
      eventList:
      [
        {
          title: title,
          date: date,
          description: description,
          completionStatus: completionStatus
        }
      ]
    })
    setEvents(tempArray);
}

function editEventInArray(events, setEvents, selectedEvent, setSelectedEvent, title, description, completionStatus)
{
  //create deep copy of the array by stringifying it and parsing it
  let tempArray = JSON.stringify(events);
  tempArray = JSON.parse(tempArray);
  //date objects have to be recreated after parsing
  if (tempArray) {
    tempArray = tempArray.map(event => ({
        ...event,
        date: new Date(event.date),
        eventList: event.eventList.map(e => ({
            ...e,
            date: new Date(e.date)
        }))
    }));
  }
  for(let i = 0; i < tempArray.length; i++)
  {
    if(checkDatesMatch(tempArray[i].date, selectedEvent.date))
    {
      let tempEventList = tempArray[i].eventList;
      for(let j = 0; j < tempEventList.length; j++)
      {
        if(checkEventsMatch(tempEventList[j], selectedEvent))
        {
          tempEventList[j].title = title;
          tempEventList[j].description = description;
          tempEventList[j].completionStatus = completionStatus;
          tempArray[i].eventList = tempEventList;
          setEvents(tempArray);
          setSelectedEvent(tempEventList[j]);
          return;
        }
      }
    }
  }
}

function checkEventsMatch(event1, event2)
{
  if(event1.title == event2.title && event1.title.date == event2.title.date && event1.description == event2.description && event1.completionStatus == event2.completionStatus)
    return true;
  return false;
}

function eventExists(event, events){
  for(let i = 0; i < events.length; i++)
  {
    if(checkDatesMatch(event.date, events[i].date))
    {
      let tempEventList = events[i].eventList;
      for(let j = 0; j < tempEventList.length; j++)
      {
        if(checkEventsMatch(event, tempEventList[j]))
          return true;
      }
    }
  }
  return false;
}

function removeEventFromArray(selectedEvent, events, setEvents)
{
  if(events.length == 1)
    return;

  let stringifiedEvents = JSON.stringify(events);
  let tempArray = JSON.parse(stringifiedEvents);
  //date objects have to be recreated after parsing
  if (tempArray) {
    tempArray = tempArray.map(event => ({
        ...event,
        date: new Date(event.date),
        eventList: event.eventList.map(e => ({
            ...e,
            date: new Date(e.date)
        }))
    }));
  }
  for(let i = 0; i < tempArray.length; i++)
  {
    if(checkDatesMatch(tempArray[i].date, selectedEvent.date))
    {
      let tempEventList = tempArray[i].eventList;
      for(let j = 0; j < tempEventList.length; j++)
      {
        if(checkEventsMatch(tempEventList[j], selectedEvent))
        {
          if(tempEventList.length == 1)
          {
            tempArray.splice(i,1);
            setEvents(tempArray);
            return;
          }
          tempEventList.splice(j, 1);
          tempArray[i].eventList = tempEventList;
          setEvents(tempArray);
          return;
        }
      }
    }
  }
}

function buttonClicked(setSelectedEvent, event){
  setSelectedEvent(event);
}

function drawCalendarTileDate(inputClass, date){
  //takes parameters: calendar-tile-date-xxxxx
  //xxxxx being either active, inactive or today
  inputClass = "calendar-tile-date-" + inputClass;
  return(
    <div className={inputClass}>
      <span style={{padding:"0%", margin:"0%"}}>{date.getDate()}</span>
    </div>
  )
}

function drawEvents(events,date,selectedEvent, setSelectedEvent){

  if(events == null)
    return;

  let foundMatchingDate = false;
  let eventsToDraw = null;

  for(let i = 0; i < events.length; i++)
  {
    if(events[i].date.getDate() === date.getDate() && events[i].date.getMonth() === date.getMonth() && events[i].date.getFullYear() === date.getFullYear())
    {
      foundMatchingDate = true;
      eventsToDraw = events[i];
      break;
    }
  }

  if(!foundMatchingDate)
    return;

    let htmlToReturn = [];

    for (let i = 0; i < eventsToDraw.eventList.length; i++) {
      const button = (
          <Button variant="soft"
                  size='xs'
                  className={
                    checkEventsMatch(selectedEvent, eventsToDraw.eventList[i]) 
                    ? "selectedEventStyle" 
                    : "eventStyle" 
                  }
                  key={i}
                  onClick={() => buttonClicked(setSelectedEvent, eventsToDraw.eventList[i])}
          >
            {eventsToDraw.eventList[i].title}
          </Button>
      );
      htmlToReturn.push(button);
    }

  return(
    <>
      {htmlToReturn.map(element => element)}
    </>
  );
}

function ViewButtons ({view, setCurrentView, viewChanged, setViewChanged, today, setSavedDate})
{
  const updateCurrentView = (event, newView) => {
    setCurrentView(newView);
    setViewChanged(viewChanged + 1);
  }

  const goToToday = () => {
    setSavedDate(today)
  }  

  return(
    <ButtonGroup
      style={{ flex: 1, order:2, justifyContent: "center", marginRight: "5px", maxWidth:"min-content" }}
      size="sm"
      variant="soft"
      color="primary"
    >
      <Button
        onClick={() => {updateCurrentView(null, 'month');
                        goToToday();
                       }}
      >
        Today
      </Button>
      <Button
        onClick={() => updateCurrentView(null, 'month')}
        variant={view === 'month' ? 'contained' : 'outlined'}
      >
        Month
      </Button>
      <Button
        onClick={() => updateCurrentView(null, 'year')}
        variant={view === 'year' ? 'contained' : 'outlined'}
      >
        Year
      </Button>
    </ButtonGroup>
  )
}

function App() {
  const [today, setToday] = useState(new Date());
  const eventsTemplate = [
    {
      //creates an event at the earliest possible date so that even if the user deletes all events, the structure of this array remains
      date: new Date(0),
      eventList:
      [
        {
          title: "You Have No Events!",
          date: new Date(0),
          description: "Create Your First Event To Display Its Information In This Box",
          completionStatus: false
        }
      ]
    },
    {
      date: today,
      eventList: 
      [
        {
          title: "Walk The Dog At The Park",
          date: today,
          description: "Take the dog to his favourite park so that he can meet some new dogs and make some friends",
          completionStatus: true
        },
        {
          title: "Test Title3",
          date: today,
          description: "Test Description3",
          completionStatus: false
        }
      ]
    }
  ];
  //tries to load events from local storage, if nothing is found, events is populated with a template instead
  const [events, setEvents] = useState(() => {
    let retrievedEvents = JSON.parse(localStorage.getItem("events"));
    //converts the parsed dates back to date objects
    if (retrievedEvents) {
        retrievedEvents = retrievedEvents.map(event => ({
            ...event,
            date: new Date(event.date),
            eventList: event.eventList.map(e => ({
                ...e,
                date: new Date(e.date)
            }))
        }));
        return retrievedEvents;
    } 
    return eventsTemplate;
  });
  const [savedDate, setSavedDate] = useState(new Date());
  const [viewChanged, setViewChanged] = useState(0);
  const [currentView, setCurrentView] = useState("month");
  const [navLabel, setNavLabel] = useState(null);
  const [isCreateWindowVisible, setCreateWindowVisible] = useState(false);
  const [isEditWindowVisible, setEditWindowVisible] = useState(false);
  const [isDeleteWindowVisible, setDeleteWindowVisible] = useState(false);
  const [isSettingsWindowVisible, setSettingsWindowVisible] = useState(false);
  const [isClearDataWindowVisible, setClearDataWindowVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(events[events.length-1].eventList[0]);
  const [isCompletionSoundMuted, setCompletionSoundMuted] = useState(false);
  const [pickedSound, setPickedSound] = useState("sound1");

  useEffect(() => {
    updateHTML();
  }, [viewChanged]);

  useEffect(() => {
    const label = document.querySelector(".react-calendar__navigation");
    setNavLabel(label);
  }, []);
  
  useEffect(() => {
    //updates the selectedEvent when the user creates, edits or deletes an event 
    if(!eventExists(selectedEvent, events))
      setSelectedEvent(events[events.length-1].eventList[0])
    //since localStorage only supports the storage of strings, the array has to be stringified first
    try
    {
      const arrayAsString = JSON.stringify(events);
      localStorage.setItem("events", arrayAsString);
      console.log("saved items");
    }
    catch(error)
    {
      console.error("Error saving events to local storage: ", error);
    }
  }, [events]);

  const renderTileContent = ({ activeStartDate, date, view }) => 
  {
    if(view==="month" )
    {
      if(date.getDate() == savedDate.getDate() && date.getMonth() == savedDate.getMonth() && date.getFullYear() == savedDate.getFullYear())
      {
        let calendarTileDate = drawCalendarTileDate("active", date);
        let eventsToDraw = drawEvents(events,date, selectedEvent, setSelectedEvent);
        return(
          <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100%", maxHeight:"100%"}}>
            <div style={{flex:0.1, alignSelf:"center"}}>
              {calendarTileDate}
            </div>
            <div className='eventContainerStyle'>
              {eventsToDraw}
            </div>
          </div>
        );
      }
      else if(date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear())
      {
        let calendarTileDate = drawCalendarTileDate("today", date);
        let eventsToDraw = drawEvents(events,date, selectedEvent, setSelectedEvent);
        return(
          <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100%", maxHeight:"100%", boxSizing:"border-box"}}>
            <div style={{flex:0.1, alignSelf:"center"}}>
              {calendarTileDate}
            </div>
            <div className='eventContainerStyle'>
              {eventsToDraw}
            </div>
          </div>
        );
      }
      else if(date.getDate())
      {
        let calendarTileDate = drawCalendarTileDate("inactive", date);
        let eventsToDraw = drawEvents(events,date, selectedEvent, setSelectedEvent);
        return(
          <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100%", maxHeight:"100%"}}>
            <div style={{flex:0.1, alignSelf:"center"}}>
              {calendarTileDate}
            </div>
            <div className='eventContainerStyle'>
              {eventsToDraw}
            </div>
          </div>
        );
      }
    }
  }  

  //extending the default joy ui themes with some custom css
  const theme = extendTheme({
    components: {
      JoyButton: {
        styleOverrides: {
          root: ({ ownerState, theme }) => ({
            ...(ownerState.size === 'xs' && {
              '--Icon-fontSize': '1rem',
              '--Button-gap': '0.25rem',
              minHeight: 'var(--Button-minHeight, 1.6rem)',
              fontSize: theme.vars.fontSize.xs,
              paddingBlock: '2px',
              paddingInline: '0.5rem',
            }),
            ...(ownerState.size === 'xl' && {
              '--Icon-fontSize': '2rem',
              '--Button-gap': '1rem',
              minHeight: 'var(--Button-minHeight, 4rem)',
              fontSize: theme.vars.fontSize.xl,
              paddingBlock: '0.5rem',
              paddingInline: '2rem',
            }),
          }),
        },
      },
    },
  });
  
  return (
  <CssVarsProvider theme={theme}>
    <audio id="sound1" src="/sounds/sound1.wav" type="audio/wav"></audio>
    <audio id="sound2" src="/sounds/sound2.wav" type="audio/wav"></audio>
    <audio id="sound3" src="/sounds/sound3.wav" type="audio/wav"></audio>
    <Modal open={isCreateWindowVisible} onClose={() => setCreateWindowVisible(false)}>
      <div>
        <CreateWindow date={savedDate} setCreateWindowVisible={setCreateWindowVisible} events={events} setEvents={setEvents}/>
      </div>
    </Modal>
    <Modal open={isEditWindowVisible} onClose={() => setEditWindowVisible(false)}>
      <div>
        <EditWindow date={savedDate} setEditWindowVisible={setEditWindowVisible} events={events} setEvents={setEvents} selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent}/>
      </div>
    </Modal>
    <Modal open={isDeleteWindowVisible} onClose={() => setDeleteWindowVisible(false)}>
      <div>
        <DeleteWindow selectedEvent={selectedEvent} setDeleteWindowVisible={setDeleteWindowVisible} events={events} setEvents={setEvents}/>
      </div>
    </Modal>
    <Modal open={isSettingsWindowVisible} onClose={() => {setSettingsWindowVisible(false); setClearDataWindowVisible(false)}}>
      <div>
        <SettingsWindow setSettingsWindowVisible={setSettingsWindowVisible} 
                        setClearDataWindowVisible={setClearDataWindowVisible}
                        isCompletionSoundMuted={isCompletionSoundMuted}
                        setCompletionSoundMuted={setCompletionSoundMuted}
                        pickedSound={pickedSound}
                        setPickedSound={setPickedSound}
        />
        <ClearDataConfirmationWindow isClearDataWindowVisible={isClearDataWindowVisible} 
                                     setClearDataWindowVisible={setClearDataWindowVisible} 
                                     eventsTemplate={eventsTemplate}
                                     setEvents={setEvents}
                                     setSelectedEvent={setSelectedEvent}
        />
      </div>
    </Modal>
    <div className="mainContainer">
      <Sheet color="neutral" variant="soft" className='leftContainer'>
        <TitleBar />
        <InfoBox selectedEvent={selectedEvent} 
                 setSelectedEvent={setSelectedEvent} 
                 events={events} setEvents={setEvents} 
                 isCompletionSoundMuted={isCompletionSoundMuted}
                 pickedSound={pickedSound}
        />
        <CreateButton setCreateWindowVisible={setCreateWindowVisible}/>
        <EditButton setEditWindowVisible={setEditWindowVisible}/>
        <DeleteButton setDeleteWindowVisible={setDeleteWindowVisible}/>
        <SettingsButton setSettingsWindowVisible={setSettingsWindowVisible}/>
      </Sheet>
      <Sheet color="neutral" variant="soft" className='rightContainer'>
        <>
          {navLabel && ReactDOM.createPortal(<ViewButtons view={currentView} 
                                                            setCurrentView={setCurrentView} 
                                                            setViewChanged={setViewChanged}
                                                            viewChanged={viewChanged}
                                                            today={today}
                                                            setSavedDate={setSavedDate}
                                                            />, navLabel)}
          <Calendar 
            onChange={setSavedDate} 
            activeStartDate={savedDate}
            onActiveStartDateChange={({ activeStartDate }) => setSavedDate(activeStartDate)}
            value={savedDate} 
            view={currentView}
            onViewChange={(action, activeStartDate, value, view ) => {
              setViewChanged(viewChanged+1);
              setCurrentView(view);
            }} 
            tileContent={renderTileContent}
            minDetail={"year"}
            next2Label={null}
            prev2Label={null}
          />
        </>
      </Sheet>
    </div>
  </CssVarsProvider>
  );
}

export default App;
