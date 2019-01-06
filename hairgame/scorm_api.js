// Change these preset values to suit your taste and requirements.
var g_bShowApiErrors = false;
var g_strAPINotFound = "Management system interface not found.";
var g_strAPITooDeep = "Cannot find API - too deeply nested.";
var g_strAPIInitFailed = "Found API but LMSInitialize failed.";
var g_strAPISetError = "Trying to set value but API not available.";

var g_nSCO_ScoreMin = 0; 		// must be a number
var g_nSCO_ScoreMax = 100; 		// must be a number > nSCO_Score_Min
var g_SCO_MasteryScore = 99.9; // value by default; may be set to null
var g_bMasteryScoreInitialized = false;

/////////// API INTERFACE INITIALIZATION AND CATCHER FUNCTIONS ////////
var g_nFindAPITries = 0;
var g_objAPI = null;
var g_objAPIExtended = null;
var g_bInitDone = false;
var g_bFinishDone = false;
var	g_bSCOBrowse = false;
var g_dtmInitialized = new Date(); // will be adjusted after initialize

function AlertUserOfAPIError(strText) {
	if (g_bShowApiErrors) alert(strText)
}

function FindAPIWindow(win) {
	while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
		g_nFindAPITries ++;
		if (g_nFindAPITries > 500) {
			AlertUserOfAPIError(g_strAPITooDeep);
			return null;
		} 
		win = win.parent;
	}
	return win;
}

function APIOK() {
	return ((typeof(g_objAPI)!= "undefined") && (g_objAPI != null))
}

function APIExtendedOK() {
	return ((typeof(g_objAPIExtended)!= "undefined") && (g_objAPIExtended != null))
}

function SCOInitialize() {
	var err = true;
	var apiWindow;
	
	if (!g_bInitDone) {
		if ((window.parent) && (window.parent != window)){
			apiWindow = FindAPIWindow(window.parent);
			g_objAPI = apiWindow.API;
			g_objAPIExtended = apiWindow.API_Extended;
		}
		if ((g_objAPI == null) && (window.opener != null))	{
			apiWindow = FindAPIWindow(window.opener);
			g_objAPI = apiWindow.API;
			g_objAPIExtended = apiWindow.API_Extended;
		}
		if (!APIOK()) {
			AlertUserOfAPIError(g_strAPINotFound);
			err = false
		} else {
			err =  g_objAPI.LMSInitialize("");
			if (err == "true") {
				g_bSCOBrowse = (g_objAPI.LMSGetValue("cmi.core.lesson_mode") == "browse");
				if (!g_bSCOBrowse) {
					if (g_objAPI.LMSGetValue("cmi.core.lesson_status") == "not attempted") {
						err =  g_objAPI.LMSSetValue("cmi.core.lesson_status","incomplete")
					}
				}
			} else {
				AlertUserOfAPIError(g_strAPIInitFailed)
			}
		}
	}
	if (typeof(SCOInitData) != "undefined") {
		// The SCOInitData function can be defined in another script of the SCO
		// SCOInitData()
	}
	g_dtmInitialized = new Date();
	//alert(APIOK());
	return (err + "") // Force type to string
	
}

function SCOFinish() {
	if ((APIOK()) && (g_bFinishDone == false)) {
		if (typeof(SCOSaveData) != "undefined"){
			SCOReportSessionTime()
			// The SCOSaveData function can be defined in another script of the SCO
			// SCOSaveData();
		}
		g_bFinishDone = (g_objAPI.LMSFinish("") == "true");
		//alert("Finish");
	}
	return (g_bFinishDone + "" ) // Force type to string
}

// Call these catcher functions rather than trying to call the API adapter directly
function SCOGetValue(nam)			{return ((APIOK())?g_objAPI.LMSGetValue(nam.toString()):"")}
function SCOCommit(parm)			{return ((APIOK())?g_objAPI.LMSCommit(""):"false");}
function SCOGetLastError(parm){return ((APIOK())?g_objAPI.LMSGetLastError(""):"-1")}
function SCOGetErrorString(n)	{return ((APIOK())?g_objAPI.LMSGetErrorString(n):"No API")}
function SCOGetDiagnostic(p)	{return ((APIOK())?g_objAPI.LMSGetDiagnostic(p):"No API")}

//LMSSetValue is implemented with more complex data
//management logic below

var g_bMinScoreAcquired = false;
var g_bMaxScoreAcquired = false;

// Special logic begins here
function SCOSetValue(nam,val){
	//alert("nam=" + nam + " val=" + val);
	var err = "";
	if (!APIOK()){
			AlertUserOfAPIError(g_strAPISetError + "\n" + nam + "\n" + val);
			err = "false"
	} else if (nam == "cmi.core.score.raw") err = privReportRawScore(val)
	if (err == ""){
			err =  g_objAPI.LMSSetValue(nam,val.toString() + "");
			if (err != "true") return err
	}
	if (nam == "cmi.core.score.min"){
		g_bMinScoreAcquired = true;
		g_nSCO_ScoreMin = val
	}
	else if (nam == "cmi.core.score.max"){
		g_bMaxScoreAcquired = true;
		g_nSCO_ScoreMax = val
	}
	return err
}
function privReportRawScore(nRaw) { // called only by SCOSetValue
	if (isNaN(nRaw)) return "false";
	if (!g_bMinScoreAcquired){
		if (g_objAPI.LMSSetValue("cmi.core.score.min",g_nSCO_ScoreMin+"")!= "true") return "false"
	}
	if (!g_bMaxScoreAcquired){
		if (g_objAPI.LMSSetValue("cmi.core.score.max",g_nSCO_ScoreMax+"")!= "true") return "false"
	}
	if (g_objAPI.LMSSetValue("cmi.core.score.raw", nRaw)!= "true")	return "false";
	g_bMinScoreAcquired = false;
	g_bMaxScoreAcquired = false;
	if (!g_bMasteryScoreInitialized){
		var nMasteryScore = parseInt(SCOGetValue("cmi.student_data.mastery_score"),10);
		if (!isNaN(nMasteryScore)) g_SCO_MasteryScore = nMasteryScore
  }
	if (isNaN(g_SCO_MasteryScore)) return "false";
	var stat = (nRaw >= g_SCO_MasteryScore? "passed" : "failed");
	if (SCOSetValue("cmi.core.lesson_status",stat) != "true") return "false";
	return "true"
}

function MillisecondsToCMIDuration(n) {
//Convert duration from milliseconds to 0000:00:00.00 format
	var hms = "";
	var dtm = new Date();	dtm.setTime(n);
	var h = "000" + Math.floor(n / 3600000);
	var m = "0" + dtm.getMinutes();
	var s = "0" + dtm.getSeconds();
	var cs = "0" + Math.round(dtm.getMilliseconds() / 10);
	hms = h.substr(h.length-4)+":"+m.substr(m.length-2)+":";
	hms += s.substr(s.length-2)+"."+cs.substr(cs.length-2);
	return hms
}

// SCOReportSessionTime is called automatically by this script,
// but you may call it at any time also from the SCO
function SCOReportSessionTime() {
	var dtm = new Date();
	var n = dtm.getTime() - g_dtmInitialized.getTime();
	return SCOSetValue("cmi.core.session_time",MillisecondsToCMIDuration(n))
}

// Since only the designer of a SCO knows what completed means, another
// script of the SCO may call this function to set completed status. 
// The function checks that the SCO is not in browse mode, and 
// avoids clobbering a "passed" or "failed" status since they imply "completed".
function SCOSetStatusCompleted(){
	var stat = SCOGetValue("cmi.core.lesson_status");
	if (SCOGetValue("cmi.core.lesson_mode") != "browse"){
		if ((stat!="completed") && (stat != "passed") && (stat != "failed")){
			return SCOSetValue("cmi.core.lesson_status","completed")
		}
	} else return "false"
}

function SCOReportTotalTime() {
	var dtm = new Date();
	var n = dtm.getTime() - g_dtmInitialized.getTime();
	var s_hours = MillisecondsToCMIDuration(n).substring(0,4);
	var s_minutes = MillisecondsToCMIDuration(n).substring(5,7);
	var s_seconds = MillisecondsToCMIDuration(n).substring(8,10);
	var s_mseconds = MillisecondsToCMIDuration(n).substring(11,13);

	var total_time = LMSGetValue("cmi.core.total_time");
	var t_hours = total_time.substring(0,4) + s_hours;
	var t_minutes = total_time.substring(5,7) + s_minutes;
	var t_seconds = total_time.substring(8,10) + s_seconds;
	var t_mseconds = total_time.substring(11,13) + s_mseconds;
	total_time = t_hours+":"+t_minutes+":"+t_seconds+"."+t_mseconds
	//alert(t_hours);
	//alert(t_minutes);
	//alert(t_seconds);
	//alert(t_mseconds);
	//alert(total_time);
	return SCOSetValue("cmi.core.total_time",total_time)
}

function AppExit()
{
	SCOFinish();
	if (APIExtendedOK())
	{
		g_objAPIExtended.SetNavCommand("exit");
	}
	else
	{
		//alert("closing");
		window.parent.top.close();
	}
}

