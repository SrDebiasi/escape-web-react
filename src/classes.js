import Timetable       from './resources/Timetable'

//Define the classes to dinamically use it on resource to needed forges
Object.defineProperty(window,'Timetable',{value: Timetable});
