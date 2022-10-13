import ListReader from './ListReader';
import ListReaderWithRed from './ListReaderWithRed';
import ReduxListReader from './ReduxListReader';
import { update as updateStore } from '../store';

const l = n => `${ n }List`;
const c = n => `${ n }Count`;
const ln = n => `${ n }ListNow`;
const rcn = n => `${ n }RedCountNow`;

const entityNamesWithRed = [ "log", "resource", "fetch", "jquery", "stack" ];
const entityNamesSimple = [ "event", "profile" ];
const entityNames = /*[ "redux" ].*/entityNamesWithRed.concat(entityNamesSimple);

const is = {};
entityNames.forEach(n => {
	is[ l(n) ] = [];
	is[ c(n) ] = 0;
	is[ ln(n) ] = [];
	if (entityNamesWithRed.includes(n)) {
		is[ rcn(n) ] = 0;
	}
});
//is["reduxState"] = {};
//is["reduxFinalStates"] = [];


const createCallback = n => {
	console.log("Creating callback for ", n)
	const entityfy = s => `${ n }${ s[ 0 ].toUpperCase() }${ s.slice(1) }`;
	return state => {
		//console.log("Callback for ", n ," called with state: ", state)
		//console.log("Callstack: ")
		//console.log( (new Error()).stack)
		if(n == 'jquery') {
			console.log("jquery state: ", state)
		}
		if (!state) return;
		const namedState = {};
		Object.keys(state).forEach(key => {
			namedState[ entityfy(key) ] = state[ key ];
		});
		return updateStore(namedState);
	}
}

let readers = null;

export function init(lists) {
	readers = {};
	entityNamesSimple.forEach(n => readers[ n ] = new ListReader(createCallback(n)));
	entityNamesWithRed.forEach(n => readers[ n ] = new ListReaderWithRed(createCallback(n)));
	//readers.redux = new ReduxListReader(createCallback("redux"));
	entityNames.forEach(n => readers[ n ].list = lists[ n ] || []);
}
export function append(name, item) {
	if(name == 'jquery') console.log("Appending to jquery list: ", readers[name])
	readers[ name ].append(item);
}
export function setStartTime(time) {
	readers.resource.startTime = time;
}
const byTimeNames = [ "event", "stack" ]; // TEMP
const byIndexNames = entityNames.filter(n => !byTimeNames.includes(n));
export function goTo(time, index) {
	if (readers === null) return;
	if (typeof index === 'number') {
		byTimeNames.forEach(n => readers[ n ] && readers[ n ]._callback(readers[ n ].goTo(time)));
		byIndexNames.forEach(n => readers[ n ] && readers[ n ]._callback(readers[ n ].goToIndex(index)));
	} else {
		entityNames.forEach(n => readers[ n ] && readers[ n ]._callback(readers[ n ].goTo(time)));
	}
}
export function clean() {
	entityNames.forEach(n => delete readers[ n ]);
}
export const INITIAL_STATE = is;
