/*
#
#   radioDASH Client Javascript
#
#       Ⓒ2020 Joe Cupano, NE2Z
#
#       RELEASE: 20201224-2100
#       LICENSE: GPLv2
#
#
*/

/* -            
/* - VARIABLES    
/* -
*/

/* Object to hold imported radioDASH.json */
var myRadio = {
    DEFAULT: {
        radio: "DUMMYRF",
        oled: "128x32",
        node_address: "1",
        frequency: "911250",
        txpwr: "5",
        mycall: "NOCALL",
        myssid: "00",
        mybeacon: "TEST TEST TEST TEST",
        dstcall: "BEACON",
        dstssid: "99"
    },
    CURRENT: {
        radio: "RFM95",
        oled: "128x32",
        node_address: "1",
        frequency: "911250",
        txpwr: "5",
        mycall: "NOCALL",
        myssid: "00",
        mybeacon: "TEST TEST TEST TEST",
        dstcall: "BEACON",
        dstssid: "99"
    },
    RFM95: {
        gpio_rfm_cs: "1",
        gpio_rfm_irq: "22",
        node_address: "1",
        modemcfg: "Bw31_25Cr48Sf512",
        bandwidth: "31.25",
        spreadfactor: "512",
        codingrate: "48",
        rfm_crc: "1"
    },
    SX1262: {
        gpio_rfm_cs: "1",
        gpio_rfm_irq: "22",
        node_address: "1",
        modemcfg: "Bw31_25Cr48Sf512",
        bandwidth: "31.25",
        spreadfactor: "512",
        codingrate: "48",
        rfm_crc: "1"
    },
    DUMMYRF: {
        gpio_rfm_cs: "1",
        gpio_rfm_irq: "22",
        node_address: "1",
        modemcfg: "Bw31_25Cr48Sf512",
        bandwidth: "31.25",
        spreadfactor: "512",
        codingrate: "48",
        rfm_crc: "1"
    }
}

/* Current MSG Exchange*/
var myContact = {
	mycall: "NOCALLS",
	myssid: "00",
	mybeacon: "TEST TEST TEST TEST",
	dstcall: "BEACON",
	dstssid: "99",
	header: "NOCALLS-00>BEACON-99",
	sent: "",
	received: ""
}

/* Programmable Commands C1-C4 array. Format is Command, Operator, Value*/
var myC1 = ["","",""]
var myC2 = ["","",""]
var myC3 = ["","",""]
var myC4 = ["","",""]

/* Programmable Macros M1-M4 */
var myMacros = ["","","",""];

/* Last Seven Calls heard */
var myHeard = [ "NOCALLS", "NOCALLS", "NOCALLS", "NOCALLS", "NOCALLS", "NOCALLS", "NOCALLS"];

/* Radio and Msg Module Commands */
var radioCONN = 0;                                                  //  0 = Disconnected, 1 = Connected
var radioBEACON = 0;                                                //  0 = Beacon OFF, 1 = Beacon ON  
var radioTXPWR = 5;                                                 //  TX Power can be        5-21    
var radioLOG = 0;                                                   //  0 = Beacon OFF, 1 = Beacon ON
var radioMODE = "MODE";                                             //  MODE, LORA, AFSK, FSK, AX25, CW
var msgRECEIVED = "";												//  data RXed b4 process  
var msgBLASTED = "";												//  data displayed in RX_Window
var msgENTERED = "";												//  Typed into TX_Window      
var msgPARSED = [];													//  For processing two-part command
var msgSUBPARSED = [];												//  For processing two-part command  
var msgPARTICLE = [];												//  For processing two-part command  
var msgSENT = "";													//  msgINPUT that was TXed  

var previous_operation = "";
var current_operation = "";
var previous_entry = "";
var current_entry = "";
var new_entry;
var myHostname = location.hostname;
var wsURI = "wss://" + myHostname + ":8000/wss";					//  TEST Websocket URI 
var url = "https://" + myHostname + ":8000/cfg/radioDASH.json";		//  JSON file location
var getHasJson = new XMLHttpRequest();								//  Holds JSON from Radio
var setRadioCfg = new XMLHttpRequest();								//  Sends JSON to Radio

var rxDisplay = [];													//  Holds whole RX window as 27 lines of text
var rxDispY = 26;													//  Numbe of rowa for RX Window


/* -            
/* - FUNCTIONS
/* -
*/

/* --- Tuner-Module --- */

function updateTunerDisplay(myNum) {
	var el = document.getElementById('tuner-setting');
	el.textContent = myNum;
	console.log("TUNER: Display changed to " + myNum);
}

function btnNUM(knum) {
	current_entry = knum;
	if (previous_operation !== "DIGIT") {
		//Fresh Display
		previous_entry = knum;
		previous_operation = "DIGIT";
		console.log("TUNER: first number " + knum);
		updateTunerDisplay(current_entry);
	}
	else if (previous_operation == "DIGIT") {
		//Existing Digit
		current_entry += null;
		current_entry = `${previous_entry}${current_entry}`;
		previous_entry = current_entry;
		console.log("TUNER: next number " + knum);
		updateTunerDisplay(current_entry);
	}
	else {
		//Invalid
		current_entry = previous_entry;
	}
}

function btnDEC() {
	console.log("TUNER: btnDEC");
}

function btnHASH() {
	console.log("TUNER: btnHASH");
}

function btnFUN() {
	console.log("TUNER: btnFUN");
}

function btnRESET() {
	getHasJson.open('GET', url, true);
	getHasJson.send(null);
	getHasJson.onload = function() {
		if (getHasJson.readyState === getHasJson.DONE && getHasJson.status === 200) {
			myRadio = JSON.parse(getHasJson.responseText);
			console.log("TUNER: btnRESET");
		}
		previous_operation = "RESET";
		previous_entry = "";
		current_entry = "";
		updateTunerDisplay(myRadio.CURRENT.frequency);
	}
}

function btnCLR() {
    var el = document.getElementById('tuner-setting');
	el.textContent = 0;
	previous_entry = "";
	previous_operation == "CLR";
	console.log("TUNER: btnCLR");
}

function btnENTER() {
	myRadio.CURRENT.frequency = current_entry;
	socket.send("TUNER:" + myRadio.CURRENT.frequency);
	console.log("TUNER: " + myRadio.CURRENT.frequency);
	previous_operation = "ENTER";
	previous_entry = "";
	current_entry = "";
	updateTunerDisplay(myRadio.CURRENT.frequency);
}

/* --- Radio Panel-Module --- */

function btnRADIO() {
	console.log("RADIO: btnRADIO: clicked");
	var el_btnRADIO = document.getElementById('btnRADIO');
	if (radioCONN == 0) {
		radioCONN = 1;
		el_btnRADIO.style.background = "MediumSeaGreen";
		socket.send("RADIO:ON");
		console.log("RADIO: btnRADIO: Radio ON");
		previous_entry = 0;
		previous_operation = "RADIO_ON";
	 }
	 else if (radioCONN == 1){
		 radioCONN = 0;
		 el_btnRADIO.style.background = "Black";
		 socket.send("RADIO:OFF");
		 console.log("RADIO: btnRADIO: Radio OFF");
		 previous_entry = 0;
		 previous_operation = "RADIO_OFF";
	 }
 }

function btnTXPWR() {
	console.log("RADIOL: btnTXPWR: clicked");
	var el_btnTXPWR = document.getElementById('btnTXPWR');
	if (radioTXPWR == 5) {
		radioTXPWR = 10;
		el_btnTXPWR.style.background = "MediumSeaGreen";
		el_btnTXPWR.innerHTML = "MEDM";
		socket.send("TXPWR:MEDIUM");
		console.log("RADIO: btnTXPWR: MEDIUM");
		previous_entry = 0;
		previous_operation = "TXPWR_MEDIUM";
	 }
	 else if (radioTXPWR == 10){
		 radioTXPWR = 20;
		 el_btnTXPWR.style.background = "Orange";
		 el_btnTXPWR.innerHTML = "HIGH";
		 socket.send("TXPWR:HIGH");
		 console.log("RADIO: btnTXPWR: HIGH");
		 previous_entry = 0;
		 previous_operation = "TXPWR_HIGH";
	 }
	 else if (radioTXPWR == 20){
		radioTXPWR = 5;
		el_btnTXPWR.style.background = "Black";
		el_btnTXPWR.innerHTML = "PA";
		socket.send("TXPWR:LOW");
		console.log("RADIO: btnTXPWR: LOW");
		previous_entry = 0;
		previous_operation = "TXPWR_Low";
	}
}

function btnMODE() {
	console.log("RADIO: btnMODE: clicked");
	var el_btnMODE = document.getElementById('btnMODE');
	if (radioMODE == "MODE") {
		radioMODE = "LORA";
		el_btnMODE.innerHTML = "LORA";
		socket.send("MODE:LORA");
		console.log("RADIO: MODE: LORA");
		previous_entry = 0;
		previous_operation = "MODE_LORA";
	 }
	else if (radioMODE == "LORA") {
		radioMODE = "FSK";
		el_btnMODE.innerHTML = "FSK";
		socket.send("MODE:FSK");
		console.log("RADIO: MODE: FSK");
		previous_entry = 0;
		previous_operation = "MODE_FSK";
	 }
	 else if (radioMODE == "FSK") {
		radioMODE = "AFSK";
		el_btnMODE.innerHTML = "AFSK";
		socket.send("MODE:AFSK");
		console.log("RADIO: MODE: AFSK");
		previous_entry = 0;
		previous_operation = "MODE_AFSK";
	 }
	 else if (radioMODE == "AFSK") {
		radioMODE = "AX25";
		el_btnMODE.innerHTML = "AX25";
		socket.send("MODE:AX25");
		console.log("RADIO: MODE: AX25");
		previous_entry = 0;
		previous_operation = "MODE_AX25";
	 }
	 else if (radioMODE == "AX25") {
		radioMODE = "CW";
		el_btnMODE.innerHTML = "CW";
		socket.send("MODE:CW");
		console.log("RADIO: MODE: CW");
		previous_entry = 0;
		previous_operation = "MODE_CW";
	 }
	 else {
		radioMODE = "MODE";
		el_btnMODE.innerHTML = "MODE";
		socket.send("MODE:MODE");
		console.log("RADIO: MODE: MODE");
		previous_entry = 0;
		previous_operation = "MODE_MODE";
	 }

}

function btnBEACON() {
	console.log("RADIO: btnBEACON: clicked");
	var el_btnBEACON = document.getElementById('btnBEACON');
	if (radioBEACON == 0) {
		radioBEACON = 1;
		el_btnBEACON.style.background = "MediumSeaGreen";
		socket.send("BEACON:ON");
		console.log("RADIO: btnBEACON: Beacon ON");
		previous_entry = 0;
		previous_operation = "BEACON_ON";
	 }
	 else if (radioBEACON == 1){
		 radioBEACON = 0;
		 el_btnBEACON.style.background = "Black";
		 socket.send("BEACON:OFF");
		 console.log("RADIO: btnBEACON: Beacon OFF");
		 previous_entry = 0;
		 previous_operation = "BEACON_OFF";
	 }
}

/* --- Commands and Macros Module --- */

function btnC1() {
	/* Do something */
	previous_entry = "";
	previous_operation == "C1";
	console.log("CMD: btnC1: clicked");
}

function btnC2() {
	/* Do something */
	previous_entry = "";
	previous_operation == "C2";
	console.log("CMD: btnC2: clicked");
}

function btnC3() {
	/* Do something */
	previous_entry = "";
	previous_operation == "C3";
	console.log("CMD: btnC3: clicked");
}

function btnC4() {
	/* Do something */
	previous_entry = "";
	previous_operation == "C4";
	console.log("CMD: btnC4: clicked");
}

function btnM1() {
	console.log("MACRO: btnM1: clicked");
	msgENTERED = msgENTERED + myMacros[0];
	document.getElementById('msgENTRY').value = msgENTERED;
	previous_entry = "";
	previous_operation == "M1";
	console.log("MACRO: btnM1: " + myMacros[0]);
}

function btnM2() {
	console.log("MACRO: btnM2: clicked");
	msgENTERED = msgENTERED + myMacros[1];
	document.getElementById('msgENTRY').value = msgENTERED;
	previous_entry = "";
	previous_operation == "M2";
	console.log("MACRO: btnM2: " + myMacros[1]);
}

function btnM3() {
	console.log("MACRO: btnM3: clicked");
	msgENTERED = msgENTERED + myMacros[2];
	document.getElementById('msgENTRY').value = msgENTERED;
	previous_entry = "";
	previous_operation == "M3";
	console.log("MACRO: btnM3: " + myMacros[2]);
}

function btnM4() {
	console.log("MACRO: btnM4: clicked");
	msgENTERED = msgENTERED + myMacros[3];
	document.getElementById('msgENTRY').value = msgENTERED;
	previous_entry = "";
	previous_operation == "M4";
	console.log("MACRO: btnM4: " + myMacros[3]);
}


/* --- MSG Panel-Module --- */

function btnLOG() {
	console.log("MSG: btnLOG: clicked");
	var el_btnLOG = document.getElementById('btnLOG');
	if (radioLOG == 0) {
		radioLOG = 1;
		el_btnLOG.style.background = "MediumSeaGreen";
		socket.send("LOG:ON");
		console.log("MSG: btnLOG: Logging ON");
		previous_entry = 0;
		previous_operation = "LOG_ON";
	 }
	 else if (radioLOG == 1){
		 radioLOG = 0;
		 el_btnLOG.style.background = "Black";
		 socket.send("LOG:OFF");
		 console.log("MSG: btnLOG: Logging OFF");
		 previous_entry = 0;
		 previous_operation = "LOG_OFF";
	 }
}

function btnRCLR() {
	console.log("MSG: btnRCLR: clicked");
	msgENTERED = "";
	msgPARSED = "";
	previous_operation = "RCLR";
	rxwinRCLR();
}

function btnCALL() {
	console.log("MSG: btnCALL: clicked");
	msgENTERED = msgENTERED + myContact.mycall + "-" + myContact.myssid;
	document.getElementById('msgENTRY').value = msgENTERED;
}

function btnDEST() {
	console.log("MSG: btnDEST: clicked");
	msgENTERED = msgENTERED + myContact.dstcall + "-" + myContact.dstssid;
	document.getElementById('msgENTRY').value = msgENTERED;
}

function btnHEAD() {
	console.log("MSG: btnHEAD: clicked");
	myContact.header = myContact.mycall + "-" + myContact.myssid + ">" + myContact.dstcall + "-" + myContact.dstssid + "|";
	msgENTERED = msgENTERED + myContact.header;
	document.getElementById('msgENTRY').value = msgENTERED;
}

function btnHELP() {
	console.log("MSG: btnHELP: clicked");
	rxwinMSGhelp();
	rxwinMSG('-');
	previous_operation = "COMMAND";
}

function btnMCLR() {
	console.log("MSG: btnMCLR: clicked");
	msgENTERED = "";
	msgPARSED = "";
	previous_operation = "MCLR";
	document.getElementById('msgENTRY').value = "";
}

function btnSEND() {
	console.log("MSG: btnSEND: clicked");
	msgENTERED = document.getElementById('msgENTRY').value;
	console.log("PANEL: btnSEND", msgENTERED);

	/* --- Sort through commands first --- */
	
	msgPARSED = msgENTERED.split(" ");
		
	if (msgPARSED[0] === ".msgBCN") {                    /*  Set BEACON message  */
		msgSUBPARSED = msgENTERED.replace('msgBCN ', '')
		myContact.mybeacon = msgSUBPARSED;
		myRadio.CURRENT.mybeacon = myContact.mybeacon;
		message = "BEACON = " + myContact.mybeacon;
		rxwinMSG(message);
		console.log("CMD: set: Beacon MSG = " + myContact.mybeacon);
		previous_operation = "COMMAND";
	
	} else if (msgPARSED[0] === ".myCALL") {                  /*  Set myCALL and mySSID  */
		msgSUBPARSED = msgPARSED[1];
		msgPARTICLE = msgSUBPARSED.split("-");
		myContact.mycall = msgPARTICLE[0];
		myContact.myssid = msgPARTICLE[1];
		myRadio.CURRENT.mycall = myContact.mycall;
		myRadio.CURRENT.myssid = myContact.myssid;
		message = "CALL = " + myContact.mycall + "-" + myContact.myssid;
		rxwinMSG(message);
		console.log("CMD: set: CALL =" + myContact.mycall + "-" + myContact.myssid);
		previous_operation = "COMMAND";
	
	} else if (msgPARSED[0] === ".dstCALL") {                 /*  Set myContact.dstcall and myContact.dstssid  */
		msgSUBPARSED = msgPARSED[1];
		msgPARTICLE = msgSUBPARSED.split("-");
		myContact.dstcall = msgPARTICLE[0];
		myContact.dstssid = msgPARTICLE[1];
		myRadio.CURRENT.dstcall = myContact.dstcall;
		myRadio.CURRENT.dstssid = myContact.dstssid;
		message = "DEST = " + myContact.dstcall + "-" + myContact.dstssid;
		rxwinMSG(message);
		console.log("CMD: set: DEST =" + myContact.dstcall + "-" + myContact.dstssid);
		previous_operation = "COMMAND";
	
	} else if (msgPARSED[0] === ".macro1") {                 /*  Set Macro Button 1  */
		msgSUBPARSED = msgENTERED.replace('.macro1 ', '')
		myMacros[0] = msgSUBPARSED;
		message = "MACRO1 = " + myMacros[0];
		rxwinMSG(message);
		console.log("CMD: set: M1 =" + myMacros[0]);
		previous_operation = "COMMAND";
	
	} else if (msgPARSED[0] === ".macro2") {                 /*  Set Macro Button 2  */
		msgSUBPARSED = msgENTERED.replace('.macro2 ', '')
		myMacros[1] = msgSUBPARSED;
		message = "MACRO3 = " + myMacros[1];
		rxwinMSG(message);
		console.log("CMD: set: PANEL: btnM2: M2 = " + myMacros[1]);
		previous_operation = "COMMAND";
	
	} else if (msgPARSED[0] === ".macro3") {                 /*  Set Macro Button 3  */
		msgSUBPARSED = msgENTERED.replace('.macro3 ', '')
		myMacros[2] = msgSUBPARSED;
		message = "MACRO1 = " + myMacros[2];
		rxwinMSG(message);
		console.log("CMD: set: M3 = " + myMacros[2]);
		previous_operation = "COMMAND";
		
	} else if (msgPARSED[0] === ".macro4") {                 /*  Set Macro Button 4  */
		msgSUBPARSED = msgENTERED.replace('.macro4 ', '')
		myMacros[3] = msgSUBPARSED;
		message = "MACRO1 = " + myMacros[3];
		rxwinMSG(message);
		console.log("CMD: set: M4 = " + myMacros[3]);
		previous_operation = "COMMAND";

	/* Anything else is a message to be TX */
	} else {
		socket.send("TX:" + msgENTERED);
		rxwinMSG("TX: "+ msgENTERED);
		console.log("CMD: SEND:" + msgENTERED);
		previous_operation = "SENT";
	}

	msgENTERED = "";
	msgPARSED = "";
	previous_operation = "SENT";
	document.getElementById('msgENTRY').value = "";

}

/* --- Receiver-Window --- */

function rxwinRCLR() {
	console.log("rxWIN: RCLR");
	for (i = rxDispY; i > 0; i=i-1) {
		rxDisplay[i] = "-";
		var rxWINid = "rxWIN" + i;
		var el_RXwin = document.getElementById(rxWINid);
		el_RXwin.innerHTML = rxDisplay[i];
	  }
	  rxDisplay[0] = "-";
	  var el_RXwin = document.getElementById("rxWIN0");
	  el_RXwin.innerHTML = rxDisplay[0];
}

function rxwinMSG(message) {
  for (i = rxDispY; i > 0; i=i-1) {
	rxDisplay[i] = rxDisplay[i-1];
	var rxWINid = "rxWIN" + i;
    var el_RXwin = document.getElementById(rxWINid);
	el_RXwin.innerHTML = rxDisplay[i];
  }
  rxDisplay[0] = message;
  var el_RXwin = document.getElementById("rxWIN0");
  el_RXwin.innerHTML = message;
}

function rxwinMSGhelp() {
	rxDisplay [26] = "-"
	rxDisplay [25] = "................ radioDASH WebUI Instructions .............."
	rxDisplay [24] = "-"
	rxDisplay [23] = "......... KEYPAD .......... .......... RF CONTROLS ........."
	rxDisplay [22] = "-"
	rxDisplay [21] = "- FUN = Disabled ---------- -- RADIO = Radio on/off (toggle) "
  	rxDisplay [20] = "- RST = Reset Keypad ------ ----- PA = RF Power (LOW, MED, HIGH) "
  	rxDisplay [19] = "- CLR = Clear Display ----- --- MODE = LORA, FSK, AFSK, etc"
  	rxDisplay [18] = "- ENT = Update Radio Freq - ---- BCN = Beacon msg on/off (toggle)"
	rxDisplay [17] = "-"
	rxDisplay [16] = "..................... MESSAGE CONTROLS ....................."
	rxDisplay [15] = "-"
  	rxDisplay [14] = "- CALL = myCall Macro ----- ---- LOG = Log on/off (toggle)"
  	rxDisplay [13] = "- DEST = dstCall Macro ---- --- RCLR = Clear RX Window"
  	rxDisplay [12] = "- HEAD = Message Header---- --- MCLR = TX window clear"
  	rxDisplay [11] = "- HELP = This screen ------ --- SEND = Send whats in TX Window"
  	rxDisplay [10] = "- "
	rxDisplay [9] = ".................... TX WINDOW COMMANDS ...................."
	rxDisplay [8] = "-"	  
  	rxDisplay [7] = "- .myCALL NOCALL-00     Changes CALL macro to hold NOCALL-00"
  	rxDisplay [6] = "- .dstCALL BL0B-50      Changes DEST macro to hold BL0B-50"
  	rxDisplay [5] = "- .macro1 blah blah     Changes M1 button to hold blah blah"
  	rxDisplay [4] = "-"
	rxDisplay [3] = "..... TO SEND A MESSAGE"
	rxDisplay [2] = "-"  
  	rxDisplay [1] = "- Via Macro buttons click HEAD, M1, then SEND"
  	rxDisplay [0] = "- Type YourCall>DestCall|MESSAGE in TX window then click SEND"
}


/* --- Transmitter-Module --- */

function msgENTRY() {
	// Get the focus to the text input to enter a word right away.
	document.getElementById('msgENTRY').focus();

	
	// Getting the text from the input
	var msgENTERED = document.getElementById('msgENTRY').value;
  }


/* --- ROOT-Module --- */


/* -            
/* - MAIN
/* -
*/

/* Get radioDASH.json on page load */
getHasJson.open('GET', url, true);
getHasJson.send(null);
getHasJson.onload = function() {
	if (getHasJson.readyState === getHasJson.DONE && getHasJson.status === 200) {
		myRadio = JSON.parse(getHasJson.responseText)
	}
}
myMacros[0] = myRadio.CURRENT.mybeacon;   					// Set M1 to beacon Message
console.log("ROOT:  radioCONFIG retrieved");
console.log("ROOT:  myRadio.object LOADED");
console.log("ROOT:  INIT COMPLETE");
console.log("ROOT:  Hostname  :" + myHostname);
console.log("ROOT:  Websocket :" + wsURI);
previous_entry = "";  
previous_operation = "INIT";                                // Set last operation
updateTunerDisplay(myRadio.CURRENT.frequency);              // Update Tuner Display with Frequency

// Load RX Window with Help Message
rxwinMSGhelp();
rxwinMSG('-');

/* Establish Websocket */
socket = new WebSocket(wsURI);

socket.onopen = function(e) {
  console.log("WSS: [open] Connection established");
  console.log("WSS: Sending to server");
  socket.send("CONNECT:" + myHostname);
};

socket.onmessage = function(event) {
	var hasRXD = event.data.split(':');
	if (hasRXD[0] == "RX") {
		rxwinMSG("RX: " + hasRXD[1]);
		console.log("WSS: RX: " + hasRXD[1]);
	};
	console.log(`WSS: [message] Data received from server: ${event.data}`);
};

socket.onclose = function(event) {
  if (event.wasClean) {
    console.log(`WSS: [close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    console.log('WSS: [close] Connection died');
  }
};

socket.onerror = function(error) {
	var rxWINerror = "WSS:ERROR connecting to " + wsURI;
	rxwinMSG(rxWINerror);
	console.log(`WSS: [error] ${error.message}`);
};