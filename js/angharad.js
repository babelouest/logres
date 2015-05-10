/**
 * Logres
 * Angharad web interface
 * Copyright 2015 Nicolas Mora mail@babelouest.org
 * Licenced under AGPL
 */
var angharad = {ready:false};

var switchDimmerContainerTemplate = '<div id="div-container-switches-dimmers-%DEVICE%" data-an-nb-elements="0">\n\
	<label id="container-switches-dimmers-%DEVICE%-label">%DISPLAY%</label>\n\
	<div id="container-switches-dimmers-%DEVICE%" class="block" data-an-nb-elements="0"></div>\n\
</div>\n';

var switchTemplate = '<div id="div-switch-%NAME%" class="%CLASS% group-switch-%GROUPNAME% switch-class data-element" data-an-position="%POSITION%">\n\
	<input type="button" class="admin-button %ADMINCLASS%" value="+" name="admin-switch-%NAME%" id="admin-switch-%NAME%" data-an-type="switch" data-an-device="%DEVICE%" data-an-name="%SWITCH%" data-an-tab="%TAB%" data-an-group="%GROUP%" data-an-unit=""/>\n\
	<input type="checkbox" value="sw-%NAME%" data-an-device="%DEVICE%" data-an-name="%SWITCH%" name="sw-%NAME%" id="sw-%NAME%" %CHECKED% data-an-display="%ENABLED%" class="switcher-checkbox sw-checkbox-%GROUPNAME%"/>\n\
	<label for="sw-%NAME%" id="label-sw-%NAME%" >%DISPLAY%</label>\n\
	<label id="message-%NAME%"></label>\n\
</div>\n';

var dimmerTemplate = '<div id="div-dimmer-%NAME%" class="%CLASS% group-dimmer-%GROUPNAME% dimmer-class data-element" data-an-position="%POSITION%">\n\
	<input type="button" class="admin-button %ADMINCLASS%" value="+" name="admin-dimmer-%NAME%" id="admin-dimmer-%NAME%" data-an-type="dimmer" data-an-device="%DEVICE%" data-an-name="%DIMMER%" data-an-unit="&#37;" data-an-tab="%TAB%" data-an-group="%GROUP%"/>\n\
	<label id="label-dimmer-%NAME%" for="di-%NAME%" data-an-label="%DISPLAY%">%DISPLAY%</label>\n\
	<div class="dimmer-row">\n\
		<div class="dimmer-0"><input type="button" name="di-set-0-%NAME%" id="di-set-0-%NAME%" value="0%" data-an-name-value="0" class="styled-button" data-an-device="%DEVICE%" data-an-name="%DIMMER%"></div>\n\
		<div class="dimmer-25"><input type="button" name="di-set-25-%NAME%" id="di-set-25-%NAME%" value="25%" data-an-name-value="25" class="styled-button" data-an-device="%DEVICE%" data-an-name="%DIMMER%"></div>\n\
		<div class="dimmer-50"><input type="button" name="di-set-50-%NAME%" id="di-set-50-%NAME%" value="50%" data-an-name-value="50" class="styled-button" data-an-device="%DEVICE%" data-an-name="%DIMMER%"></div>\n\
		<div class="dimmer-75"><input type="button" name="di-set-75-%NAME%" id="di-set-75-%NAME%" value="75%" data-an-name-value="75" class="styled-button" data-an-device="%DEVICE%" data-an-name="%DIMMER%"></div>\n\
		<div class="dimmer-100"><input type="button" name="di-set-100-%NAME%" id="di-set-100-%NAME%" value="100%" data-an-name-value="100" class="styled-button" data-an-device="%DEVICE%" data-an-name="%DIMMER%"></div>\n\
	</div>\n\
	<div id="label-di-slide-%NAME%" class="label-di-slide"></div>\n\
	<div class="dimmer di-slide" data-an-device="%DEVICE%" data-an-name="%DIMMER%" id="di-slide-%NAME%"></div>\n\
</div>\n';

var heaterContainerTemplate = '<div id="div-container-heater-%DEVICE%">\n\
	<label id="container-heater-%DEVICE%-label">%DISPLAY%</label>\n\
	<div id="container-heaters-%DEVICE%" class="block">\n\
		<div id="container-heater-%DEVICE%" class="div-heater" data-an-nb-elements="0"></div>\n\
	</div>\n\
</div>\n';

var heaterTemplate = '<div id="div-heater-%NAME%" class="%CLASS% group-heater-%GROUPNAME% heater-class data-element" data-an-position="%POSITION%">\n\
	<input type="button" class="admin-button %ADMINCLASS%" value="+" name="admin-heater-%NAME%" id="admin-heater-%NAME%" data-an-type="heater" data-an-device="%DEVICE%" data-an-name="%HEATER%" data-an-unit="%UNIT%" data-an-tab="%TAB%" data-an-group="%GROUP%"/>\n\
	<input type="checkbox" value="he-%NAME%" data-an-device="%DEVICE%" data-an-name="%HEATER%" data-an-unit="%UNIT%" name="he-%NAME%" id="he-%NAME%" %ISSET% />\n\
	<label id="label-heater-%NAME%" for="he-%NAME%" data-an-label="%DISPLAY%" class="label-he-slide">%DISPLAY%</label>\n\
	<div id="label-he-slide-%NAME%"></div><div class="heater he-slide" data-an-device="%DEVICE%" data-an-heater="%HEATER%" data-an-name="%NAME%" id="he-slide-%NAME%"></div>\n\
</div>\n';

var sensorContainerTemplate = '<div id="div-container-sensor-%DEVICE%">\n\
	<label id="container-sensor-%DEVICE%-label">%DISPLAY%</label>\n\
	<div id="container-sensors-%DEVICE%" class="block">\n\
		<div id="container-sensor-%DEVICE%" class="div-sensor" data-an-nb-elements="0"></div>\n\
	</div>\n\
</div>\n';

var sensorTemplate = '<div id="div-sensor-%NAME%" class="sensor %CLASS% group-sensor-%GROUPNAME% sensor-class data-element" data-an-name="%NAME%" data-an-position="%POSITION%">\n\
	<input type="button" class="admin-button %ADMINCLASS%" value="+" name="admin-sensor-%NAME%" id="admin-sensor-%NAME%" data-an-type="sensor" data-an-device="%DEVICE%" data-an-name="%SENSOR%" data-an-unit="%UNIT%" data-an-tab="%TAB%" data-an-group="%GROUP%"/>\n\
	<label id="label-sensor-%NAME%" for="value-sensor-%NAME%" class="sensor-display">%DISPLAY%</label>\n\
  <a href="#" id="graph-sensor-%NAME%" data-an-type="sensor" data-an-device="%DEVICE%" data-an-name="%SENSOR%" data-an-unit="%UNIT%"><img src="contextMenu/images/page_white_graph.png" alt="graph"/></a>\n\
	<label id="value-sensor-%NAME%" value="%SENSOR" data-sensor-unit="%UNIT%" class="sensor-value se-value-%NAME%">%VALUE% %UNIT%</label>\n\
</div>\n';

var scriptsContainerTemplate = '<div id="div-container-script">\n\
	<div id="fold-scripts" class="new-group-div"><label id="container-script-label"><img src="contextMenu/images/page_white_add.png"/> %DISPLAY%</label></div>\n\
	<div id="container-scripts" class="block">\n\
		<div id="new-script" class="div-hidden new-group-div">\n\
			<label id="new-script-title" class="title-display new-group" data-i18n><img src="contextMenu/images/page_white_add.png"/> Add a script</label>\n\
		</div>\n\
		<div id="container-script" data-an-nb-elements="0"><div>\n\
	</div>\n\
</div>\n';

var scriptTemplate = '<div id="div-script-%NAME%" class="script %CLASS% group-script-%GROUPNAME% script-class data-element" data-an-position="%POSITION%" data-an-name="%SCRIPT%" data-an-id="%NAME%">\n\
	<input type="button" class="admin-button %ADMINCLASS%" value="+" name="admin-script-%NAME%" id="admin-script-%NAME%" data-an-type="script" data-an-name="%SCRIPT%" data-an-tab="%TAB%" data-an-group="%GROUP%"/>\n\
	<a href="#" class="schedule-attached">\n\
		<img src="images/schedule-off.png" alt="schedules" id="schedule-attached-%NAME%" class="schedule-attached-img"/>\n\
		<span id="display-schedule-attached-%NAME%" class="display-schedule-attached"></span>\n\
	</a>\n\
  <input type="button" name="script-%NAME%" id="script-%NAME%" value="%DISPLAY%" data-an-script="%GROUPNAME%" class="script-button">\n\
</div>\n';

var scheduleHoverBlockTemplate = '<label id="schedule-hover-script-%NAME%">%DISPLAY%</label>\n';

var scheduleHoverTemplate = '<p id="schedule-hover-%NAME%">%DISPLAY%</p>';
var scheduleNoneHoverTemplate = '<p id="schedule-hover-none">%DISPLAY%</p>';

var schedulesContainerTemplate = '<div id="div-container-schedule">\n\
	<div id="fold-schedules" class="new-group-div"><label id="container-schedule-label"><img src="contextMenu/images/page_white_add.png"/> %DISPLAY%</label></div>\n\
	<div id="container-schedules" class="block">\n\
		<div id="new-schedule" class="div-hidden new-group-div">\n\
			<label id="new-schedule-title" class="title-display new-group" data-i18n><img src="contextMenu/images/page_white_add.png"/> Add a schedule</label>\n\
		</div>\n\
		<div id="container-schedule" data-an-nb-elements="0"><div>\n\
	</div>\n\
</div>\n';

var scheduleTemplate = '<div id="div-schedule-%NAME%" class="schedule-class data-element" data-an-position="%POSITION%">\n\
  <input type="button" data-an-schedule-id="%NAME%" class="admin-button admin-modify-delete" value="+" name="admin-schedule-%NAME%" id="admin-schedule-%NAME%" data-an-type="schedule" data-an-name="%NAME%"/>\n\
  <input type="checkbox" value="schedule-%NAME%" data-an-schedule="%NAME%" name="schedule-%NAME%" id="schedule-%NAME%" />\n\
  <label for="schedule-%NAME%" id="message-schedule-%NAME%"></label>\n\
  </div>\n';

var actionsContainerTemplate = '<div id="div-container-action">\n\
	<div id="fold-actions" class="new-group-div"><label id="container-actions-label"><img src="contextMenu/images/page_white_add.png"/> %DISPLAY%</label></div>\n\
	<div id="container-actions" class="block">\n\
		<div id="new-action" class="div-hidden new-group-div">\n\
			<label id="new-action-title" class="title-display new-group" data-i18n><img src="contextMenu/images/page_white_add.png"/> Add an action</label>\n\
		</div>\n\
		<div id="container-action" data-an-nb-elements="0"><div>\n\
	</div>\n\
</div>\n';

var actionTemplate = '<div id="div-action-%NAME%" class="action action-class data-element" data-an-position="%POSITION%" data-an-name="%NAME%">\n\
	<input type="button" class="admin-button admin-modify-delete" value="+" name="admin-action-%NAME%" id="admin-action-%NAME%" data-an-type="action" data-an-name="%NAME%"/>\n\
	<label for="action-%NAME%" id="label-action-%NAME%" class="title-display label-action">%DISPLAY%</label></a>\n\
</div>\n';

var monitorTemplate = '<div id="monitor-%NAME%">\n\
  <div id="div-monitor-title-%NAME%">\n\
    <label id="monitor-title-%NAME%">%DISPLAY%</label>\n\
  </div>\n\
  <div id="div-monitor-%NAME%" class="block">\n\
  <div id="div-monitor-add-element-%NAME%">\n\
    <label for="monitor-add-element-%NAME%" class="title-display" data-i18n>Add an element:</label>\n\
    <select id="monitor-add-element-%NAME%" name="monitor-add-element-%NAME%">\n\
    </select>\n\
    <select id="monitor-add-color-%NAME%" name="monitor-add-color-%NAME%">\n\
      <option value="" data-i18n>Color plots</option>\n\
      <option value="#00FFFF" style="background:Aqua" data-i18n>Aqua</option>\n\
      <option value="#A52A2A" style="background:Brown" data-i18n>Brown</option>\n\
      <option value="#0000FF" style="background:Blue" data-i18n>Blue</option>\n\
      <option value="#7FFF00" style="background:Chartreuse" data-i18n>Chartreuse</option>\n\
      <option value="#006400" style="background:DarkGreen" data-i18n>Dark Green</option>\n\
      <option value="#FF8C00" style="background:DarkOrange" data-i18n>Dark Orange</option>\n\
      <option value="#8B0000" style="background:DarkRed" data-i18n>Dark Red</option>\n\
      <option value="#00CED1" style="background:DarkTurquoise" data-i18n>Dark Turquoise</option>\n\
      <option value="#9400D3" style="background:DarkViolet" data-i18n>Dark Violet</option>\n\
      <option value="#008000" style="background:Green" data-i18n>Green</option>\n\
      <option value="#7CFC00" style="background:LawnGreen" data-i18n>Lawn Green</option>\n\
      <option value="#90EE90" style="background:LightGreen" data-i18n>Light Green</option>\n\
      <option value="#20B2AA" style="background:LightSeaGreen" data-i18n>Light Sea Green</option>\n\
      <option value="#778899" style="background:LightSlateGray" data-i18n>Light Slate Gray</option>\n\
      <option value="#00FF00" style="background:Lime" data-i18n>Lime</option>\n\
      <option value="#FF00FF" style="background:Magenta" data-i18n>Magenta</option>\n\
      <option value="#0000CD" style="background:MediumBlue" data-i18n>Medium Blue</option>\n\
      <option value="#00FA9A" style="background:MediumSpringGreen" data-i18n>Medium Spring Green</option>\n\
      <option value="#000080" style="background:Navy" data-i18n>Navy</option>\n\
      <option value="#FFA500" style="background:Orange" data-i18n>Orange</option>\n\
      <option value="#800080" style="background:Purple" data-i18n>Purple</option>\n\
      <option value="#FF0000" style="background:Red" data-i18n>Red</option>\n\
      <option value="#008080" style="background:Teal" data-i18n>Teal</option>\n\
      <option value="#40E0D0" style="background:Turquoise" data-i18n>Turquoise</option>\n\
      <option value="#EE82EE" style="background:Violet" data-i18n>Violet</option>\n\
      <option value="#FFFF00" style="background:Yellow" data-i18n>Yellow</option>\n\
      <option value="#9ACD32" style="background:YellowGreen" data-i18n>Yellow Green</option>\n\
    </select>\n\
    <input type="button" name="monitor-add-element-ok-%NAME%" id="monitor-add-element-ok-%NAME%" value="Add" data-an-name="%NAME%" data-i18n>\n\
  </div>\n\
  <div id="div-monitor-since-%NAME%">\n\
    <label for="monitor-since-%NAME%" class="title-display" data-i18n>Monitor since:</label>\n\
    <select id="monitor-since-%NAME%" name="monitor-since-%NAME%" data-an-name="%NAME%">\n\
      <option value="0" data-i18n>Last hour</option>\n\
      <option value="1" data-i18n>Last 2 hours</option>\n\
      <option value="2" data-i18n>Last 6 hours</option>\n\
      <option value="3" data-i18n>Last 12 hours</option>\n\
      <option value="4" data-i18n selected="true">Last day</option>\n\
      <option value="5" data-i18n>Last 2 days</option>\n\
      <option value="6" data-i18n>Last 3 days</option>\n\
      <option value="7" data-i18n>Last week</option>\n\
      <option value="8" data-i18n>Last month</option>\n\
    </select>\n\
  </div>\n\
  <div id="div-monitor-reload-%NAME%">\n\
    <label for="monitor-refresh-%NAME%" class="title-display" data-i18n>Refresh monitor:</label>\n\
    <input type="button" name="monitor-refresh-%NAME%" id="monitor-refresh-%NAME%" value="Refresh" data-an-name="%NAME%" data-i18n>\n\
  </div>\n\
  <div id="div-monitor-chart-%NAME%" class="monitor-chart"><div id="loading"><img src="images/loading.gif" class="centered" /></div></div>\n\
  <div id="div-monitor-series-%NAME%" class="monitor-series bootstrap-tagsinput">\n\
  </div>\n\
</div>\n';

/**
 * Get all angharad server initial informations
 * Devices, overviews, actions, scripts, schedules
 */
function gatherAngharadInformations() {
	// get devices list
	var devices = sendGetRequest(globalConfig.angharad_location + '/DEVICES');
	
	// For each device, get overview
	if (devices.result) {
		
		angharad.devices = [];
		for (de in devices.json.devices) {
			angharad.devices[devices.json.devices[de].name] = devices.json.devices[de];
		}
		
		angharad.device = [];
		
		for (dev in angharad.devices) {
			// For each device, get its overview
			var overviewDevice = sendGetRequest(globalConfig.angharad_location + '/OVERVIEW/' + dev);
			
			if (overviewDevice.result) {
				angharad.device[dev] = overviewDevice.json.device;
			}
		}
	}
	
	// get actions list
	var actions = sendGetRequest(globalConfig.angharad_location + '/ACTIONS');
	if (actions.result) {
		angharad.actions = [];
		for (key in actions.json.actions) {
			angharad.actions[actions.json.actions[key].id] = actions.json.actions[key];
		}
	}
	
	// get scripts list
	var scripts = sendGetRequest(globalConfig.angharad_location + '/SCRIPTS');
	if (scripts.result) {
		angharad.scripts = [];
		for (key in scripts.json.scripts) {
			angharad.scripts[scripts.json.scripts[key].id] = scripts.json.scripts[key];
		}
	}
	
	// get schedules list
	var schedules = sendGetRequest(globalConfig.angharad_location + '/SCHEDULES');
	if (schedules.result) {
		angharad.schedules = [];
		for (key in schedules.json.schedules) {
			angharad.schedules[schedules.json.schedules[key].id] = schedules.json.schedules[key];
		}
	}
	
	angharad.ready = true;
}

/**
 * Build switches and dimmer buttons and display them in the switches tab
 */
function initSwitchesTab() {
	var curProfileId = getCurrentProfile().id;
	if (angharad.ready) {
    var groupList = getGroupList(tabSwitchesDimmersId);
		for (dekey in angharad.device) {
			var device = angharad.device[dekey].name;
			var deviceDisplay = '';
			for (dev in angharad.devices) {
        tabContent[tabSwitchesDimmersId][angharad.devices[dev].name] = [];
				if (angharad.devices[dev].name === device) {
					deviceDisplay = angharad.devices[dev].display;
				}
			}
			var htmlDevice = switchDimmerContainerTemplate.replace(/%DEVICE%/g, device).replace(/%DISPLAY%/g, deviceDisplay);
			$('#switches-content').append(htmlDevice);
    }
    for (key in groupList) {
      tabContent[tabSwitchesDimmersId][groupList[key].id] = [];
      var htmlGroup = tabGroupTemplate.replace(/%TAB%/g, tabSwitchesDimmersId).replace(/%GROUP%/g, groupList[key].id).replace(/%DISPLAY%/g, groupList[key].display);
      $('#switches-content').append(htmlGroup);
    }
		for (dekey in angharad.device) {
			var device = angharad.device[dekey].name;
			var inDeviceGroup = false;
			var index=0;

			for (swkey in angharad.device[dekey].switches) {
				var curSwitch = angharad.device[dekey].switches[swkey];
				
				for (tag in curSwitch.tags) {
					if (curSwitch.tags[tag].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#') == 0) {
            if (tabContent[curSwitch.tags[tag].split('#')[2]] != undefined && tabContent[curSwitch.tags[tag].split('#')[2]][curSwitch.tags[tag].split('#')[3]]) {
              displaySwitchInGroup(device, curSwitch, curSwitch.tags[tag].split('#')[2], curSwitch.tags[tag].split('#')[3], parseInt(curSwitch.tags[tag].split('#')[4]));
            }
					}
				}
        displaySwitchInGroup(device, curSwitch, tabSwitchesDimmersId, '-1', index);
        index++;
			}
			
			for (dikey in angharad.device[dekey].dimmers) {
				var curDimmer = angharad.device[dekey].dimmers[dikey];
				
				for (tag in curDimmer.tags) {
					if (curDimmer.tags[tag].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#') == 0) {
            if (tabContent[curDimmer.tags[tag].split('#')[2]] != undefined && tabContent[curDimmer.tags[tag].split('#')[2]][curDimmer.tags[tag].split('#')[3]]) {
              displayDimmerInGroup(device, curDimmer, curDimmer.tags[tag].split('#')[2], curDimmer.tags[tag].split('#')[3], parseInt(curDimmer.tags[tag].split('#')[4]));
            }
					}
				}
        displayDimmerInGroup(device, curDimmer, tabSwitchesDimmersId, '-1', index);
        index++;
			}
		}
	}
}

/**
 * Initialize dimmer graphic elements
 */
function initDimmer(curName, curDimmer) {
  $('#label-di-slide-'+curName).html(curDimmer.value+' %');
  $('#di-slide-'+curName).slider({
    min:0,
    max:99,
    step:1,
    value:curDimmer.value,
    change:function( event, ui ) {
      if (event == null || event.originalEvent) {
        var dimmerId = $(this).attr('data-an-name');
        var deviceId = $(this).attr('data-an-device');
        var changeDimmer = sendGetRequest(globalConfig.angharad_location + '/SETDIMMER/'+deviceId+'/'+dimmerId+'/'+$(this).slider( 'value' ));
        if (!changeDimmer.result) {
          var $label = $('#label-dimmer-'+curName);
          var originalLabel = $label.attr('data-an-label');
          $label.text(originalLabel + ' - ' + $.t('Error setting dimmer'));
          setTimeout(function() {
            $label.text(originalLabel);
          }, 10000);
        } else {
          updateAllDimmers(deviceId, dimmerId, $(this).slider( 'value' ));
        }
      }
    }
  });
  $('#div-dimmer-'+curName).find('.dimmer-row input').click(function() {
    var dimmerId = $(this).attr('data-an-name');
    var deviceId = $(this).attr('data-an-device');
    var value = $(this).attr('data-an-name-value');
    var changeDimmer = sendGetRequest(globalConfig.angharad_location+'/SETDIMMER/'+deviceId+'/'+dimmerId+'/'+value);
    if (changeDimmer.result) {
      updateAllDimmers(deviceId, dimmerId, value);
    } else {
			logMessage(logTypeError, $.t('Error setting dimmer'));
    }
  });
}

/**
 * Build switches and dimmer buttons and display them in the switches tab
 */
function initHeatersTab() {
	var curProfileId = getCurrentProfile().id;
	if (angharad.ready) {
    var groupList = getGroupList(tabHeatersId);
		for (dekey in angharad.device) {
			var device = angharad.device[dekey].name;
			var deviceDisplay = '';
			var index=0;
			for (dev in angharad.devices) {
        tabContent[tabHeatersId][angharad.devices[dev].name] = [];
				if (dev === device) {
					deviceDisplay = angharad.devices[dev].display;
				}
			}
			var htmlDevice = heaterContainerTemplate.replace(/%DEVICE%/g, device).replace(/%DISPLAY%/g, deviceDisplay);
			$('#heaters-content').append(htmlDevice);
    }
    for (key in groupList) {
      tabContent[tabHeatersId][groupList[key].id] = [];
      var htmlGroup = tabGroupTemplate.replace(/%TAB%/g, tabHeatersId).replace(/%GROUP%/g, groupList[key].id).replace(/%DISPLAY%/g, groupList[key].display);
      $('#heaters-content').append(htmlGroup);
    }
		for (dekey in angharad.device) {
			var device = angharad.device[dekey].name;
			var inDeviceGroup = false;
			var $containerHeaters = undefined;
			for (hekey in angharad.device[dekey].heaters) {
				var curHeater = angharad.device[dekey].heaters[hekey];
				
				for (tag in curHeater.tags) {
					if (curHeater.tags[tag].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#') == 0) {
            if (tabContent[curHeater.tags[tag].split('#')[2]] != undefined && tabContent[curHeater.tags[tag].split('#')[2]][curHeater.tags[tag].split('#')[3]] != undefined) {
              displayHeaterInGroup(device, curHeater, curHeater.tags[tag].split('#')[2], curHeater.tags[tag].split('#')[3], parseInt(curHeater.tags[tag].split('#')[4]));
            }
					}
				}
        displayHeaterInGroup(device, curHeater, tabHeatersId, '-1', index);
        index++;
			}
		}
	}
}

/**
 * Initialize heater graphic elements (set, slider)
 */
function initHeater(curName, curHeater) {
	$('#label-he-slide-'+curName).html(curHeater.max_value+' '+curHeater.unit);
	$('#he-slide-'+curName).empty().slider({
		min:0,
		max:50,
		step:0.5,
		value:curHeater.max_value,
		disabled:!curHeater.set,
		heater:curHeater.name,
		change:function( event, ui ) {
			if (event.originalEvent) {
				var heaterId = $(this).attr('data-an-heater');
				var device = $(this).attr('data-an-device');
				var response = sendGetRequest(globalConfig.angharad_location+'/SETHEATER/'+device+'/'+heaterId+'/1/'+$(this).slider( 'value' ));
				if (!response.result) {
					var $label = $('#label-heater-'+curName);
					$label.text($label.attr('data-an-label') + ' - ' + $.t('Error setting heater'));
					setTimeout(function() {
						$label.text($label.attr('data-an-label'));
					}, 10000);
				} else {
					updateAllHeaters(device, heaterId, curHeater.set, $(this).slider( 'value' ), curHeater.unit);
				}
			}
		}
	});
	$('#he-'+curName).change(function() {
		var $check = $('#he-'+curName);
		var heaterId = $(this).attr('data-an-heater');
		var device = $(this).attr('data-an-device');
		var isChecked = $(this).prop('checked');
		var $check = $(this);
		var value = $('#he-slide-'+curName).slider( 'value' );
		var unit = $(this).attr('data-an-unit');
		var response = sendGetRequest(globalConfig.angharad_location+'/SETHEATER/'+device+'/'+heaterId+'/'+(isChecked?'1':'0')+'/'+value);
		if (!response.result) {
			var $label = $('#label-heater-'+curName);
			$label.text($label.attr('data-an-label') + ' - ' + $.t('Error setting heater'));
			$check.prop('checked', !isChecked);
			$check.prop('disabled', true);
			$('#he-slide-'+curName).slider('option', 'disabled', true);
			setTimeout(function() {
				$label.text($label.attr('data-an-label'));
				$check.prop('disabled', false);
				$('#he-slide-'+curName).slider('option', 'disabled', isChecked);
			}, 10000);
		} else {
			updateAllHeaters(device, heaterId, isChecked, value, unit);
		}
		$('#he-slide-'+curName).slider('option', 'disabled', !$(this).prop('checked'));
	});
	if (!curHeater.enabled) {
		$('#label-he-slide-'+curName).hide();
		$('#he-slide-'+curName).hide();
	}
}

/**
 * Build switches and dimmer buttons and display them in the switches tab
 */
function initSensorsTab() {
	var curProfileId = getCurrentProfile().id;
	if (angharad.ready) {
    var groupList = getGroupList(tabSensorsId);
		for (dekey in angharad.device) {
			var device = angharad.device[dekey].name;
			var deviceDisplay = '';
			var index=0;
			for (dev in angharad.devices) {
        tabContent[tabSensorsId][dev] = [];
				if (dev === device) {
					deviceDisplay = angharad.devices[dev].display;
				}
			}
			var htmlDevice = sensorContainerTemplate.replace(/%DEVICE%/g, device).replace(/%DISPLAY%/g, deviceDisplay);
			$('#sensors-content').append(htmlDevice);
    }
    for (key in groupList) {
      tabContent[tabSensorsId][groupList[key].id] = [];
      var htmlGroup = tabGroupTemplate.replace(/%TAB%/g, tabSensorsId).replace(/%GROUP%/g, groupList[key].id).replace(/%DISPLAY%/g, groupList[key].display);
      $('#sensors-content').append(htmlGroup);
    }
		for (dekey in angharad.device) {
			var device = angharad.device[dekey].name;
			var $containerSensors = undefined;
			for (sekey in angharad.device[dekey].sensors) {
				var curSensor = angharad.device[dekey].sensors[sekey];
				
				for (tag in curSensor.tags) {
					if (curSensor.tags[tag].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#') == 0) {
            if (tabContent[curSensor.tags[tag].split('#')[2]] != undefined && tabContent[curSensor.tags[tag].split('#')[2]][curSensor.tags[tag].split('#')[3]] != undefined) {
              displaySensorInGroup(device, curSensor, curSensor.tags[tag].split('#')[2], curSensor.tags[tag].split('#')[3], parseInt(curSensor.tags[tag].split('#')[4]));
            }
					}
				}
        displaySensorInGroup(device, curSensor, tabSensorsId, '-1', index);
        index++;
			}
		}
	}
}

/**
 * Initialize the Scripts, actions and scheduled tasks tab
 */
function initScriptsTab() {
	var profile = getCurrentProfile();
	var curProfileId = profile.id;
	if (angharad.ready) {
    
    // Scripts
		var htmlScripts = scriptsContainerTemplate.replace(/%DISPLAY%/g, $.t('All scripts'));
		var index = 0;
		$('#scripts-content').append(htmlScripts);
		tabContent[tabScriptsSchedulesId]['-1'] = [];
		
		for (key in angharad.scripts) {
			var curScript = angharad.scripts[key];
      
      for (tag in curScript.tags) {
        if (curScript.tags[tag].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#') == 0) {
          if (tabContent[curScript.tags[tag].split('#')[2]] != undefined && tabContent[curScript.tags[tag].split('#')[2]][curScript.tags[tag].split('#')[3]] != undefined) {
            displayScriptInGroup(curScript, curScript.tags[tag].split('#')[2], curScript.tags[tag].split('#')[3], parseInt(curScript.tags[tag].split('#')[4]));
          }
        }
      }
      
			displayScriptInGroup(curScript, tabScriptsSchedulesId, '-1', index);
			updateScriptHoverDisplay(curScript);
			index++;
		}
		
		$('#fold-scripts').click(function() {
			$('#container-scripts').slideToggle();
			if (profile.options.foldScripts == undefined) {
				profile.options.foldScripts = false;
			}
			profile.options.foldScripts = !profile.options.foldScripts;
			updateProfile(profile);
		});
		
		$('#new-script').click(function() {
			editScript(null);
		});
    
    // Schedules
		var htmlSchedules = schedulesContainerTemplate.replace(/%DISPLAY%/g, $.t('All schedules'));
		var index = 0;
		$('#scripts-content').append(htmlSchedules);
		tabContent[tabScriptsSchedulesId]['-1'] = [];
		
		for (key in angharad.schedules) {
			var curSchedule = angharad.schedules[key];
			displayScheduleInGroup(curSchedule, tabScriptsSchedulesId, '-1', index);
			index++;
		}
		
		$('#fold-schedules').click(function() {
			$('#container-schedules').slideToggle();
			if (profile.options.foldSchedules == undefined) {
				profile.options.foldSchedules = false;
			}
			profile.options.foldSchedules = !profile.options.foldSchedules;
			updateProfile(profile);
		});
		
		$('#new-schedule').click(function() {
			editSchedule(null);
		});
		
		$('.schedule-attached').click(function() {
			return false;
		});
		
    // Actions
		var htmlActions = actionsContainerTemplate.replace(/%DISPLAY%/g, $.t('All actions'));
		var index = 0;
		$('#scripts-content').append(htmlActions);
		tabContent[tabScriptsSchedulesId]['-1'] = [];
		
		for (key in angharad.actions) {
			var curAction = angharad.actions[key];
			displayActionInGroup(curAction, tabScriptsSchedulesId, '-1', index);
			index++;
		}
		
		$('#fold-actions').click(function() {
			$('#container-actions').slideToggle();
			if (profile.options.foldActions == undefined) {
				profile.options.foldActions = false;
			}
			profile.options.foldActions = !profile.options.foldActions;
			updateProfile(profile);
		});
		
		$('#new-action').click(function() {
			editAction(null);
		});
	}

	if (profile.options.foldScripts == true) {
		$('#container-scripts').show();
	} else {
		$('#container-scripts').hide();
	}
	
	if (profile.options.foldSchedules == true) {
		$('#container-schedules').show();
	} else {
		$('#container-schedules').hide();
	}
	
	if (profile.options.foldActions == true) {
		$('#container-actions').show();
	} else {
		$('#container-actions').hide();
	}
}

/**
 * Initialize the monitor tab
 */
function initMonitorTab() {
	var profile = getCurrentProfile();
  var monitors = profile.options.monitors;
  if (profile.options.monitors == undefined) {
    monitors = [];
    profile.options.monitors = [];
    updateProfile(profile);
  }
  
  // Whenever you click on new monitor, a new one appears
  $('#new-monitor').click(function() {
    var display = prompt($.t('Please enter a monitor display name'), $.t('New monitor'));
    if (display != null) {
      var name = $('#container-monitor').attr('data-an-nb-elements');
      displayMonitor($('#container-monitor'), name, display);
      profile.options.monitors.push({name:name,display:display,elements:[]});
      updateProfile(profile);
    }
  });
  
  // Loop in every monitors and display it
  for (mon in monitors) {
    displayMonitor($('#container-monitor'), monitors[mon].name, monitors[mon].display);
  }
}

/**
 * Load the monitor tab with all monitors graphs
 */
function loadMonitorTab() {
  var profile = getCurrentProfile();
  
  for (mon in profile.options.monitors) {
    updateMonitorDisplay(profile.options.monitors[mon].name);
  }
}

/**
 * Display the monitor with the selected graphs
 */
function displayMonitor($container, name, display) {
  var html = monitorTemplate.replace(/%NAME%/g, name)
                            .replace(/%DISPLAY%/g, display);
  var nbMonitors = parseInt($container.attr('data-an-nb-elements'));
  var options = '';
  
  // fille monitor-add-element- select with all switches, dimmers, heaters and sensors
  for (de in angharad.devices) {
    for (sw in angharad.device[de].sensors) {
      var curElt = angharad.device[de].sensors[sw];
      if (curElt.enabled) {
        options += '<option value="'+curElt.name+'" data-an-type="sensor" data-an-device="'+de+'">'+curElt.display+'</option>\n';
      }
    }
    for (sw in angharad.device[de].heaters) {
      var curElt = angharad.device[de].heaters[sw];
      if (curElt.enabled) {
        options += '<option value="'+curElt.name+'" data-an-type="heater" data-an-device="'+de+'">'+curElt.display+'</option>\n';
      }
    }
    for (sw in angharad.device[de].switches) {
      var curElt = angharad.device[de].switches[sw];
      if (curElt.enabled) {
        options += '<option value="'+curElt.name+'" data-an-type="switch" data-an-device="'+de+'">'+curElt.display+'</option>\n';
      }
    }
    for (sw in angharad.device[de].dimmers) {
      var curElt = angharad.device[de].dimmers[sw];
      if (curElt.enabled) {
        options += '<option value="'+curElt.name+'" data-an-type="dimmer" data-an-device="'+de+'">'+curElt.display+'</option>\n';
      }
    }
  }
  
  $container.append(html);
  $('#monitor-add-element-'+name).append(options);
  
  if (isNaN(nbMonitors)) {
    $container.attr('data-an-nb-elements', '0');
  } else {
    $container.attr('data-an-nb-elements', nbMonitors+1);
  }
  
  $('#monitor-add-element-ok-'+name).click(function() {
    var profile = getCurrentProfile();
    var name = $(this).attr('data-an-name');
    var monitor = undefined;
    var monitorIndex = undefined;
    var newEltName = $('#monitor-add-element-'+name).val();
    var newEltType = $('#monitor-add-element-'+name).find('option:selected').attr('data-an-type');
    var newEltDevice = $('#monitor-add-element-'+name).find('option:selected').attr('data-an-device');
    
    for (mon in profile.options.monitors) {
      if (profile.options.monitors[mon].name == name) {
        monitor = profile.options.monitors[mon];
        monitorIndex = mon;
      }
    }
    
    if (monitor == undefined) {
      logMessage(logTypeError, $.t('Error, monitor not found in profile'));
      return false;
    }
    
    // Check if a color has been selected
    if ($('#monitor-add-color-'+name).val() == '') {
      logMessage(logTypeError, $.t('Error, you must pick a color'));
      return false;
    }
    
    // Check if this element isn't already in this monitor
    for (elt in monitor.elements) {
      if (monitor.elements[elt] == newEltName) {
        logMessage(logTypeError, $.t('Error, the element selected is already in this monitor'));
        return false;
      }
    }
    
    monitor.elements.push({type:newEltType,device:newEltDevice,name:newEltName,color:$('#monitor-add-color-'+name).val()});
    profile.options.monitors[monitorIndex] = monitor;
    
    updateProfile(profile);
    
    updateMonitorDisplay(name);
    
    return true;
  });
  
  $('#monitor-since-'+name).change(function() {
    updateMonitorDisplay($(this).attr('data-an-name'));
  });
  
  $('#monitor-refresh-'+name).click(function() {
    updateMonitorDisplay($(this).attr('data-an-name'));
  });
}

/**
 * Display the monitor plots
 */
function updateMonitorDisplay(name) {
  var profile = getCurrentProfile();
  var monitor = undefined;
  var startDate = undefined;
  var plotMatrices = [];
  var colors = [];
  var curDate = new Date();
  
  for (mon in profile.options.monitors) {
    if (profile.options.monitors[mon].name == name) {
      monitor = profile.options.monitors[mon];
    }
  }
  
  if (monitor == undefined) {
    logMessage(logTypeError, $.t('Error, monitor not found in profile'));
    return false;
  }
  
  switch ($('#monitor-since-'+name).val()) {
    case '0':
      // Last hour
      startDate = parseInt((new Date(curDate.getTime() - (1000*60*60))).getTime()/1000);
      break;
    case '1':
      // Last 2 hours
      startDate = parseInt((new Date(curDate.getTime() - (2*1000*60*60))).getTime()/1000);
      break;
    case '2':
      // Last 6 hours
      startDate = parseInt((new Date(curDate.getTime() - (6*1000*60*60))).getTime()/1000);
      break;
    case '3':
      // Last 12 hours
      startDate = parseInt((new Date(curDate.getTime() - (12*1000*60*60))).getTime()/1000);
      break;
    case '4':
      // Last day
      startDate = parseInt((new Date(curDate.getTime() - (24*1000*60*60))).getTime()/1000);
      break;
    case '5':
      // Last 2 days
      startDate = parseInt((new Date(curDate.getTime() - (48*1000*60*60))).getTime()/1000);
      break;
    case '6':
      // Last 3 days
      startDate = parseInt((new Date(curDate.getTime() - (72*1000*60*60))).getTime()/1000);
      break;
    case '7':
      // Last week
      startDate = parseInt((new Date(curDate.getTime() - (168*1000*60*60))).getTime()/1000);
      break;
    case '8':
      // Last month
      startDate = parseInt((new Date(curDate.getTime() - (720*1000*60*60))).getTime()/1000);
      break;
    default:
      break;
  }
  
  // Loop in every monitored elements for this monitor, get the monitor values, then display all of them in the monitor div
  $('#div-monitor-series-'+name).empty();
  for (elt in monitor.elements) {
    var element = monitor.elements[elt];
    var plotMatrix = [];
    var url = globalConfig.angharad_location + '/MONITOR/' + element.device
              + '/' + (element.type=='switch'?element.name:'')
              + '/' + (element.type=='sensor'?element.name:'')
              + '/' + (element.type=='dimmer'?element.name:'')
              + '/' + (element.type=='heater'?element.name:'')
              + '/' + startDate;
    
    var response = sendGetRequest(url);
    
    if (response.result) {
      if (response.json.monitor.values.length > 0) {
        for (i in response.json.monitor.values) {
          var d = new Date(0);
          d.setUTCSeconds(response.json.monitor.values[i].date_time);
          plotMatrix.push([d, parseFloat(response.json.monitor.values[i].value)]); 
        }
        plotMatrices.push(plotMatrix);
        colors.push(element.color);
      }
      if (element.type == 'switch') {
        for (elt in angharad.device[element.device].switches) {
          if (angharad.device[element.device].switches[elt].name == element.name) {
            $('#div-monitor-series-'+name).append('<span id="span-tag-'+element.device+'-'+element.name+'" class="tag label label-info">'+
                                                  angharad.device[element.device].switches[elt].display+
                                                  '<span id="span-tag-remove-'+element.device+'-'+element.name+'" data-role="remove"></span></span>');
          }
        }
      } else if (element.type == 'dimmer') {
        for (elt in angharad.device[element.device].dimmers) {
          if (angharad.device[element.device].dimmers[elt].name == element.name) {
            $('#div-monitor-series-'+name).append('<span id="span-tag-'+element.device+'-'+element.name+'" class="tag label label-info">'+
                                                  angharad.device[element.device].dimmers[elt].display+
                                                  '<span id="span-tag-remove-'+element.device+'-'+element.name+'" data-role="remove"></span></span>');
          }
        }
      } else if (element.type == 'heater') {
        for (elt in angharad.device[element.device].heaters) {
          if (angharad.device[element.device].heaters[elt].name == element.name) {
            $('#div-monitor-series-'+name).append('<span id="span-tag-'+element.device+'-'+element.name+'" class="tag label label-info">'+
                                                  angharad.device[element.device].heaters[elt].display+
                                                  '<span id="span-tag-remove-'+element.device+'-'+element.name+'" data-role="remove"></span></span>');
          }
        }
      } else if (element.type == 'sensor') {
        for (elt in angharad.device[element.device].sensors) {
          if (angharad.device[element.device].sensors[elt].name == element.name) {
            $('#div-monitor-series-'+name).append('<span id="span-tag-'+element.device+'-'+element.name+'" class="tag label label-info">'+
                                                  angharad.device[element.device].sensors[elt].display+
                                                  '<span id="span-tag-remove-'+element.device+'-'+element.name+'" data-an-type="'+element.type+'" data-an-device="'+element.device+'" data-an-name="'+element.name+'" data-role="remove"></span></span>');
          }
        }
      }
      $('#span-tag-'+element.device+'-'+element.name).css('background-color', element.color);
      $('#span-tag-remove-'+element.device+'-'+element.name).click(function() {
        var profile = getCurrentProfile();
        for (mon in profile.options.monitors) {
          if (profile.options.monitors[mon].name == name) {
            var monitor = profile.options.monitors[mon];
            for (elt in monitor.elements) {
              var element = monitor.elements[elt];
              if (element.type == $(this).attr('data-an-type') && 
                  element.device == $(this).attr('data-an-device') && 
                  element.name == $(this).attr('data-an-name')) {
                    // Remove this element from the profile, then reload the chart
                monitor.elements.splice(elt, 1);
                profile.options.monitors[mon] = monitor;
                updateProfile(profile);
                updateMonitorDisplay(name);
              }
            }
          }
        }
      });
    } else {
      logMessage(logTypeError, $.t('Error getting monitor ')+url);
    }
  }
  
  if (plotMatrices.length > 0) {
    $('#div-monitor-chart-'+name).empty().fadeIn(function() {
      var plot = $.jqplot('div-monitor-chart-'+name, plotMatrices, {
          axes:{
              xaxis:{
                  renderer:$.jqplot.DateAxisRenderer,
                  tickOptions:{formatString:'%d/%m\n%H:%M'}
              },
              yaxis:{
                  tickOptions:{formatString:'%.2f'}
              }
          },
          highlighter:{
              show: true,
              sizeAdjust: 7.5
          },
          cursor:{
              show: false
          },
          series:[{showMarker:false}],
          seriesColors:colors,
          seriesDefaults: {
              rendererOptions: {
                  smooth: true
              }
          },
      });
    });
  } else {
    $('#div-monitor-chart-'+name).hide();
  }
}

/**
 * Change a switch value (open or close)
 */
function setSwitchValue(device, switcher, value) {
	var $message = $('#message-'+device+'-'+switcher);
	var $switch = $('#sw-'+device+'-'+switcher);
	$message.text('...');
	var switchResponse = sendGetRequest(globalConfig.angharad_location+'/SETSWITCH/'+device+'/'+switcher+'/'+value);
	if (switchResponse.result) {
		$message.text('');
		updateAllSwitch(device, switcher, value);
	} else {
		$message.text(' '+$.t('Error setting switch'));
		$switch.prop('checked', !$switch.prop('checked'));
		$switch.prop('disabled', true);
		setTimeout(function() {
			$message.text('');
			$switch.prop('disabled', false);
		}, 10000);
	}
}

/**
 * Update all switchers with the specified status
 */
function updateAllSwitch(device, switcher, value) {
  $('.sw-checkbox-'+device+'-'+switcher).each(function() {
    if ($(this).prop('checked') != (value=='1')) {
      $(this).prop('checked', (value=='1'));
    }
  });
}

/**
 * Update all dimmers with the specified value
 */
function updateAllDimmers(device, dimmer, value) {
  $('.group-dimmer-'+device+'-'+dimmer).each(function() {
    $(this).find('.di-slide').slider('value', value);
    $(this).find('.label-di-slide').html(value+' %');
  });
}

/**
 * Update all heaters with the specified values
 */
function updateAllHeaters(device, heater, heaterSet, value, unit) {
  $('.group-heater-'+device+'-'+heater).each(function() {
    updateOneHeater($(this).find('.he-slide').attr('data-an-name'), heaterSet, value, unit);
  });
}

/**
 * Update the specified heater with the specified values
 */
function updateOneHeater(curName, heaterSet, value, unit) {
	var $label = $('#label-he-slide-'+curName);
	var $slide = $('#he-slide-'+curName);
	var $check = $('#he-'+curName);
	
	$label.html(value+' '+unit);
	$slide.slider('option', 'disabled', !heaterSet);
	$slide.slider('option', 'value', value);
	$check.prop('checked', heaterSet);
}

/**
 * Update all sensors with the specified value and unit
 */
function updateAllSensor(device, sensor, value, unit) {
  $('.group-sensor-'+device+'-'+sensor).each(function() {
		updateSensor($(this).attr('data-an-name'), value, unit);
  });
}

/**
 * Update a sensor with the specified value and unit
 */
function updateSensor(curName, value, unit) {
	$('#value-sensor-'+curName).text(value + ' ' + unit);
}

/**
 * Open Edit switch dialog window
 */
function editSwitch($switchAdminButton) {
	for (var i=0; i<angharad.device[$switchAdminButton.attr('data-an-device')].switches.length; i++) {
		if ($switchAdminButton.attr('data-an-name') == angharad.device[$switchAdminButton.attr('data-an-device')].switches[i].name) {
			var curSwitch = angharad.device[$switchAdminButton.attr('data-an-device')].switches[i];
			var $dialog = $('#dialog-switch');
			$dialog.find('#dialog-switch-name').text(curSwitch.name);
			$dialog.find('#dialog-switch-display').val(curSwitch.display);
			$dialog.find('#dialog-switch-type').find('option[value="'+curSwitch.type+'"]').prop('selected', true);
			$dialog.find('#dialog-switch-enabled').prop('checked', curSwitch.enabled);
			$dialog.find('#dialog-switch-monitored').prop('checked', curSwitch.monitored);
			$dialog.find('#dialog-switch-monitored-every').find('option[value="'+(curSwitch.monitored_every==0?1:curSwitch.monitored_every)+'"]').prop('selected', true);
			
			if (!curSwitch.monitored) {
				$dialog.find('#p-dialog-switch-monitored-every').hide();
			} else {
				$dialog.find('#p-dialog-switch-monitored-every').show();
			}
			
			$dialog.find('#dialog-switch-monitored').unbind('change').change(function() {
				$dialog.find('#p-dialog-switch-monitored-every').slideToggle();
			});
			
			$dialog.on('keypress', function(e) {
				var code = (e.keyCode ? e.keyCode : e.which);
				if(code == 13) {
					var curName=curSwitch.name;
					var curDisplay=$(this).find('#dialog-switch-display').val();
					var curType=$(this).find('#dialog-switch-type').val();
					var curEnabled=$(this).find('#dialog-switch-enabled').prop('checked')?'true':'false';
					var curMonitored=$(this).find('#dialog-switch-monitored').prop('checked')?'true':'false';
					var curMonitoredEvery=$(this).find('#dialog-switch-monitored-every').val();
					var curTags=curSwitch.tags.join();
					
					okDialogSwitch($switchAdminButton.attr('data-an-device'), curName, curDisplay, curType, curEnabled, curMonitored, curMonitoredEvery, curTags);
					
					$( this ).dialog( 'close' );
				}
			});
			
			$dialog.dialog({
				autoOpen: false,
				width: 400,
				modal: true,
				title: $.t('Edit a switch'),
				buttons: [{
					text:$.t('Ok'),
					click:function() {
						var curName=curSwitch.name;
						var curDisplay=$(this).find('#dialog-switch-display').val();
						var curType=$(this).find('#dialog-switch-type').val();
						var curEnabled=$(this).find('#dialog-switch-enabled').prop('checked')?'true':'false';
						var curMonitored=$(this).find('#dialog-switch-monitored').prop('checked')?'true':'false';
						var curMonitoredEvery=$(this).find('#dialog-switch-monitored-every').val();
						var curTags=curSwitch.tags.join();
						
						okDialogSwitch($switchAdminButton.attr('data-an-device'), curName, curDisplay, curType, curEnabled, curMonitored, curMonitoredEvery, curTags);
						
						$( this ).dialog( 'close' );
					}
				}]
			});
			
			$dialog.dialog('open');
		}
	}
}

/**
 * Save switch data and update display
 */
function okDialogSwitch(curDevice, curName, curDisplay, curType, curEnabled, curMonitored, curMonitoredEvery, curTags) {
	var url = globalConfig.angharad_location+'/SETSWITCHDATA/';
	var response = sendPostRequest(url,
		{name: curName, device: curDevice, display: curDisplay, type: curType, enabled: curEnabled, monitored: curMonitored, monitored_every: curMonitoredEvery, tags: curTags}
	);
	
	if (response.result) {
		var json = response.json;
		var $p = $('#p-switch-'+curDevice+'-'+curName);
		if (json.switch.enabled) {
			$p.removeClass('p-hidden');
		} else {
			$p.addClass('p-hidden');
			$p.show();
		}
		if (json.switch.type == 0) {
			$p.removeClass('sw-type-nc');
			$p.removeClass('sw-type-tw');
		} else if (json.switch.type == 1) {
			$p.addClass('sw-type-nc');
			$p.removeClass('sw-type-tw');
		} else if (json.switch.type == 2) {
			$p.removeClass('sw-type-nc');
			$p.addClass('sw-type-tw');
		}
		var $label = $('#label-sw-'+curDevice+'-'+curName);
		$label.text(json.switch.display);
		
		for (var i=0; i<angharad.device[curDevice].switches.length; i++) {
			if (angharad.device[curDevice].switches[i].name == curName) {
				angharad.device[curDevice].switches[i] = json.switch;
			}
		}
	} else {
		logMessage(logTypeError, $.t('Error updating switch'));
	}
}

/**
 * Open dimmer edit dialog window
 */
function editDimmer($dimmerAdminButton) {
	for (var i=0; i<angharad.device[$dimmerAdminButton.attr('data-an-device')].dimmers.length; i++) {
		if ($dimmerAdminButton.attr('data-an-name') == angharad.device[$dimmerAdminButton.attr('data-an-device')].dimmers[i].name) {
			var curDimmer = angharad.device[$dimmerAdminButton.attr('data-an-device')].dimmers[i];
			var $dialog = $('#dialog-dimmer');
			$dialog.find('#dialog-dimmer-name').text(curDimmer.name);
			$dialog.find('#dialog-dimmer-display').val(curDimmer.display);
			$dialog.find('#dialog-dimmer-enabled').prop('checked', curDimmer.enabled);
			$dialog.find('#dialog-dimmer-monitored').prop('checked', curDimmer.monitored);
			$dialog.find('#dialog-dimmer-monitored-every').find('option[value="'+(curDimmer.monitored_every==0?1:curDimmer.monitored_every)+'"]').prop('selected', true);
			
			if (!curDimmer.monitored) {
				$dialog.find('#p-dialog-dimmer-monitored-every').hide();
			} else {
				$dialog.find('#p-dialog-dimmer-monitored-every').show();
			}
			
			$dialog.find('#dialog-dimmer-monitored').unbind('change').change(function() {
				$dialog.find('#p-dialog-dimmer-monitored-every').slideToggle();
			});
			
			$dialog.on('keypress', function(e) {
				var code = (e.keyCode ? e.keyCode : e.which);
				if(code == 13) {
					var curName=curDimmer.name;
					var curDisplay=$(this).find('#dialog-dimmer-display').val();
					var curEnabled=$(this).find('#dialog-dimmer-enabled').prop('checked')?'true':'false';
					var curMonitored=$(this).find('#dialog-dimmer-monitored').prop('checked')?'true':'false';
					var curMonitoredEvery=$(this).find('#dialog-dimmer-monitored-every').val();
					var curTags=curDimmer.tags.join();
					
					okDialogDimmer($dimmerAdminButton.attr('data-an-device'), curName, curDisplay, curEnabled, curMonitored, curMonitoredEvery, curTags);
					
					$( this ).dialog( 'close' );
				}
			});
			
			$dialog.dialog({
				autoOpen: false,
				width: 400,
				modal: true,
				title: $.t('Edit a dimmer'),
				buttons: [{
					text:$.t('Ok'),
					click:function() {
						var curName=curDimmer.name;
						var curDisplay=$(this).find('#dialog-dimmer-display').val();
						var curEnabled=$(this).find('#dialog-dimmer-enabled').prop('checked')?'true':'false';
						var curMonitored=$(this).find('#dialog-dimmer-monitored').prop('checked')?'true':'false';
						var curMonitoredEvery=$(this).find('#dialog-dimmer-monitored-every').val();
						var curTags=curDimmer.tags.join();
						
						okDialogDimmer($dimmerAdminButton.attr('data-an-device'), curName, curDisplay, curEnabled, curMonitored, curMonitoredEvery, curTags);
						
						$( this ).dialog( 'close' );
					}
				}]
			});
			
			$dialog.dialog('open');
		}
	}
}

/**
 * Save dimmer data
 */
function okDialogDimmer(curDevice, curName, curDisplay, curEnabled, curMonitored, curMonitoredEvery, curTags) {
	var url = globalConfig.angharad_location+'/SETDIMMERDATA/';
	var response = sendPostRequest(url,
		{name: curName, device: curDevice, display: curDisplay, enabled: curEnabled, monitored: curMonitored, monitored_every: curMonitoredEvery, tags: curTags}
	);
	
	if(response.result) {
		var json = response.json;
		if (json.dimmer.enabled) {
			$('#p-dimmer-'+curDevice+'-'+curName).removeClass('p-hidden');
		} else {
			$('#p-dimmer-'+curDevice+'-'+curName).addClass('p-hidden');
			$('#p-dimmer-'+curDevice+'-'+curName).show();
		}
		var $label = $('#label-dimmer-'+curDevice+'-'+curName);
		var $value = $('#value-dimmer-'+curDevice+'-'+curName);
		$label.text(json.dimmer.display);
		$value.text($value.attr('value'));
		
		for (var i=0; i<angharad.device[curDevice].dimmers.length; i++) {
			if (angharad.device[curDevice].dimmers[i].name == curName) {
				angharad.device[curDevice].dimmers[i] = json.dimmer;
			}
		}
	} else {
		logMessage(logTypeError, $.t('Error updating dimmer'));
	}
}

/**
 * Open heater edit dialog window
 */
function editHeater($heaterAdminButton) {
	for (var i=0; i<angharad.device[$heaterAdminButton.attr('data-an-device')].heaters.length; i++) {
		if ($heaterAdminButton.attr('data-an-name') == angharad.device[$heaterAdminButton.attr('data-an-device')].heaters[i].name) {
			var curHeater = angharad.device[$heaterAdminButton.attr('data-an-device')].heaters[i];
			var $dialog = $('#dialog-heater');
			$dialog.find('#dialog-heater-name').text(curHeater.name);
			$dialog.find('#dialog-heater-display').val(curHeater.display);
			$dialog.find('#dialog-heater-unit').val(curHeater.unit);
			$dialog.find('#dialog-heater-enabled').prop('checked', curHeater.enabled);
			$dialog.find('#dialog-heater-monitored').prop('checked', curHeater.monitored);
			$dialog.find('#dialog-heater-monitored-every').find('option[value="'+(curHeater.monitored_every==0?1:curHeater.monitored_every)+'"]').prop('selected', true);
			
			if (!curHeater.monitored) {
				$dialog.find('#p-dialog-heater-monitored-every').hide();
			} else {
				$dialog.find('#p-dialog-heater-monitored-every').show();
			}
			
			$dialog.find('#dialog-heater-monitored').unbind('change').change(function() {
				$dialog.find('#p-dialog-heater-monitored-every').slideToggle();
			});
			
			$dialog.on('keypress', function(e) {
				var code = (e.keyCode ? e.keyCode : e.which);
				if(code == 13) {
					var curName=curHeater.name;
					var curDisplay=$(this).find('#dialog-heater-display').val();
					var curUnit=$(this).find('#dialog-heater-unit').val();
					var curEnabled=$(this).find('#dialog-heater-enabled').prop('checked')?'true':'false';
					var curMonitored=$(this).find('#dialog-heater-monitored').prop('checked')?'true':'false';
					var curMonitoredEvery=$(this).find('#dialog-heater-monitored-every').val();
          var curTags=curHeater.tags.join();
					
					okDialogHeater($heaterAdminButton.attr('data-an-device'), curName, curDisplay, curUnit, curEnabled, curMonitored, curMonitoredEvery, curTags);
					
					$( this ).dialog( 'close' );
				}
			});
			
			$dialog.dialog({
				autoOpen: false,
				width: 400,
				modal: true,
				title: $.t('Edit a heater'),
				buttons: [{
					text:$.t('Ok'),
					click:function() {
						var curName=curHeater.name;
						var curDisplay=$(this).find('#dialog-heater-display').val();
						var curUnit=$(this).find('#dialog-heater-unit').val();
						var curEnabled=$(this).find('#dialog-heater-enabled').prop('checked')?'true':'false';
            var curMonitored=$(this).find('#dialog-heater-monitored').prop('checked')?'true':'false';
            var curMonitoredEvery=$(this).find('#dialog-heater-monitored-every').val();
            var curTags=curHeater.tags.join();
            
						okDialogHeater($heaterAdminButton.attr('data-an-device'), curName, curDisplay, curUnit, curEnabled, curMonitored, curMonitoredEvery, curTags);
						$( this ).dialog( 'close' );
					}
				}]
			});
			
			$dialog.dialog('open');
		}
	}
}

/**
 * Save heater data
 */
function okDialogHeater(curDevice, curName, curDisplay, curUnit, curEnabled, curMonitored, curMonitoredEvery, curTags) {
	var url = globalConfig.angharad_location+'/SETHEATERDATA/';
	var response = sendPostRequest(url,
		{name: curName, device: curDevice, display: curDisplay, unit: curUnit, enabled: curEnabled, monitored: curMonitored, monitored_every: curMonitoredEvery, tags: curTags}
	);
	
	if (response.result) {
		var json = response.json;
		if (json.heater.enabled) {
			$('#p-heater-'+curDevice+'-'+curName).removeClass('p-hidden');
		} else {
			$('#p-heater-'+curDevice+'-'+curName).addClass('p-hidden');
			$('#label-he-slide-'+deviceId+'-'+heater.name).show();
			$('#he-slide-'+deviceId+'-'+heater.name).show();
			$('#p-heater-'+curDevice+'-'+curName).show();
		}
		var $label = $('#label-heater-'+curDevice+'-'+curName);
		var $value = $('#label-he-slide-'+curDevice+'-'+curName);
		var $slide = $('#he-slide-'+curDevice+'-'+curName);
		$label.text(json.heater.display);
		$value.html($slide.slider('value')+' '+curUnit);
		
		for (var i=0; i<angharad.device[curDevice].heaters.length; i++) {
			if (angharad.device[curDevice].heaters[i].name == curName) {
				angharad.device[curDevice].heaters[i] = json.heater;
			}
		}
	} else {
		logMessage(logTypeError, $.t('Error updating heater'));
	}
}

/**
 * Open sensor edit dialog window
 */
function editSensor($sensorAdminButton) {
	for (var i=0; i<angharad.device[$sensorAdminButton.attr('data-an-device')].sensors.length; i++) {
		if ($sensorAdminButton.attr('data-an-name') == angharad.device[$sensorAdminButton.attr('data-an-device')].sensors[i].name) {
			var curSensor = angharad.device[$sensorAdminButton.attr('data-an-device')].sensors[i];
			var $dialog = $('#dialog-sensor');
			$dialog.find('#dialog-sensor-name').text(curSensor.name);
			$dialog.find('#dialog-sensor-display').val(curSensor.display);
			$dialog.find('#dialog-sensor-unit').val(curSensor.unit);
			$dialog.find('#dialog-sensor-enabled').prop('checked', curSensor.enabled);
			$dialog.find('#dialog-sensor-monitored').prop('checked', curSensor.monitored);
			$dialog.find('#dialog-sensor-monitored-every').find('option[value="'+(curSensor.monitored_every==0?1:curSensor.monitored_every)+'"]').prop('selected', true);
			
			if (!curSensor.monitored) {
				$dialog.find('#p-dialog-sensor-monitored-every').hide();
			} else {
				$dialog.find('#p-dialog-sensor-monitored-every').show();
			}
			
			$dialog.find('#dialog-sensor-monitored').unbind('change').change(function() {
				$dialog.find('#p-dialog-sensor-monitored-every').slideToggle();
			});
			
			$dialog.on('keypress', function(e) {
				var code = (e.keyCode ? e.keyCode : e.which);
				if(code == 13) {
					var curName=curSensor.name;
					var curDisplay=$(this).find('#dialog-sensor-display').val();
					var curUnit=$(this).find('#dialog-sensor-unit').val();
					var curEnabled=$(this).find('#dialog-sensor-enabled').prop('checked')?'true':'false';
					var curMonitored=$(this).find('#dialog-sensor-monitored').prop('checked')?'true':'false';
					var curMonitoredEvery=$(this).find('#dialog-sensor-monitored-every').val();
          var curTags=curSensor.tags.join();
					
					okDialogSensor($sensorAdminButton.attr('data-an-device'), curName, curDisplay, curUnit, curEnabled, curMonitored, curMonitoredEvery, curTags);
					
					$( this ).dialog( 'close' );
				}
			});
			
			$dialog.dialog({
				autoOpen: false,
				width: 400,
				modal: true,
				title: $.t('Edit a sensor'),
				buttons: [{
					text:$.t('Ok'),
					click:function() {
						var curName=curSensor.name;
						var curDisplay=$(this).find('#dialog-sensor-display').val();
						var curUnit=$(this).find('#dialog-sensor-unit').val();
						var curEnabled=$(this).find('#dialog-sensor-enabled').prop('checked')?'true':'false';
						var curMonitored=$(this).find('#dialog-sensor-monitored').prop('checked')?'true':'false';
						var curMonitoredEvery=$(this).find('#dialog-sensor-monitored-every').val();
            var curTags=curSensor.tags.join();
						
						okDialogSensor($sensorAdminButton.attr('data-an-device'), curName, curDisplay, curUnit, curEnabled, curMonitored, curMonitoredEvery, curTags);
						
						$( this ).dialog( 'close' );
					}
				}]
			});
			
			$dialog.dialog('open');
		}
	}
}

/**
 * Save sensor data
 */
function okDialogSensor(curDevice, curName, curDisplay, curUnit, curEnabled, curMonitored, curMonitoredEvery, curTags) {
	var url = globalConfig.angharad_location+'/SETSENSORDATA/';
	var response = sendPostRequest(url,
		{name: curName, device: curDevice, display: curDisplay, unit: curUnit, enabled: curEnabled, monitored: curMonitored, monitored_every: curMonitoredEvery, tags: curTags}
	);
	
	if (response.result) {
		var json = response.json;
		if (json.sensor.enabled) {
			$('#p-sensor-'+curDevice+'-'+curName).removeClass('p-hidden');
		} else {
			$('#p-sensor-'+curDevice+'-'+curName).addClass('p-hidden');
			$('#p-sensor-'+curDevice+'-'+curName).show();
		}
		var $label = $('#label-'+curDevice+'-'+curName);
		var $value = $('#value-'+curDevice+'-'+curName);
		$label.text(json.sensor.display+': ');
		$value.text($value.attr('value')+' '+json.sensor.unit);
		
		for (var i=0; i<angharad.device[curDevice].sensors.length; i++) {
			if (angharad.device[curDevice].sensors[i].name == curName) {
				angharad.device[curDevice].sensors[i] = json.sensor;
			}
		}
	} else {
		logMessage(logTypeError, $.t('Error updating sensor'));
	}
}

/**
 * Add a switch to the dashboard
 * update the element by adding the proper tag
 */
function addSwitchToGroup(device, switcher, tab, group, position) {
	var curSwitcher = undefined;
	var curProfileId = getCurrentProfile().id;
	var $group = $('#div-group-'+tab+'-'+group);
	
	// Look for the switch
	for (var i=0; i<angharad.device[device].switches.length; i++) {
		if (angharad.device[device].switches[i].name == switcher) {
			curSwitcher = angharad.device[device].switches[i];
		}
	}
	
	if (group == -1 && tab == tabSwitchesDimmersId) {
		// Add it in the device group
		displaySwitchInGroup(device, curSwitcher, tab, group, position);
		return true;
	}
	
	// Search if the selected switch is already in the dashboard
	for (key in curSwitcher.tags) {
		if (curSwitcher.tags[key].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group) == 0) {
			return false;
		}
	}
	
	curSwitcher.tags.push(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group + '#' + position);
	var newElt = {name: curSwitcher.name, device: device, display: curSwitcher.display, 
		 type: curSwitcher.type, enabled: curSwitcher.enabled, monitored: curSwitcher.monitored, 
		 monitored_every: curSwitcher.monitoredEvery, tags: curSwitcher.tags.join()};
	var url = globalConfig.angharad_location+'/SETSWITCHDATA/';
	var response = sendPostRequest(url, newElt);
	
	if (response.result) {
		var json = response.json;

		for (var i=0; i<angharad.device[device].switches.length; i++) {
			if (angharad.device[device].switches[i].name == json.switch.name) {
				angharad.device[device].switches[i].tags = json.switch.tags;
        displaySwitchInGroup(device, angharad.device[device].switches[i], tab, group, position);
				return true;
			}
		}
	} else {
		logMessage(logTypeError, $.t('Error updating switch'));
	}
}

/**
 * Display the switch in the dashboard
 */
function displaySwitchInGroup(device, curSwitch, tab, group, position) {
	$group = $('#container-'+tab+'-'+group);
	var curName = tab + '-' + group + '-' + device + '-' + curSwitch.name;
	if (group == -1 && tab == tabSwitchesDimmersId) {
		curName = device + '-' + curSwitch.name;
		$group = $('#container-switches-dimmers-'+device);
	}
	
	var adminClass = '';
	if (tab == tabDashboardId) {
		adminClass = 'admin-modify-dashboard';
	} else {
		adminClass = 'admin-modify-no-dashboard';
	}
	
	var switcherClass = '';
	if (curSwitch.type == 0) {
		// Normally on
		switcherClass = 'sw-type-no';
	} else if (curSwitch.type == 1) {
		// Normally on
		switcherClass = 'sw-type-nc';
	} else if (curSwitch.type == 2) {
		// Three-way
		switcherClass = 'sw-type-tw';
	}
	var html = switchTemplate.replace(/%NAME%/g, curName)
								.replace(/%DEVICE%/g, device)
								.replace(/%SWITCH%/g, curSwitch.name)
								.replace(/%GROUPNAME%/g, device+'-'+curSwitch.name)
								.replace(/%ENABLED%/g, curSwitch.enabled)
								.replace(/%CHECKED%/g, curSwitch.status==1?'checked="checked"':'')
								.replace(/%DISPLAY%/g, curSwitch.display)
								.replace(/%ADMINCLASS%/g, adminClass)
                .replace(/%TAB%/g, tab)
                .replace(/%GROUP%/g, group)
								.replace(/%POSITION%/g, position)
								.replace(/%CLASS%/g, (!curSwitch.enabled?'div-hidden':'')+' '+switcherClass);
	
	insertElementInGroup(html, $group, position);
	
	if (getCurrentProfile().options.adminMode) {
		$('#admin-switch-'+curName).show();
	} else {
		$('#admin-switch-'+curName).hide();
	}
	
	tabContent[tab][(group==-1?device:group)].push({type:"switch", device:device, 
													name:curSwitch.name,
													group:group,
													position:position});
													
	var $checkbox = $('#sw-'+curName);
	$checkbox.change(function() {
		var value = $(this).prop('checked')?'1':'0';
		setSwitchValue($(this).attr('data-an-device'), $(this).attr('data-an-name'), value);
	});
}

/**
 * Add a dimmer to the dashboard
 * update the element by adding the proper tag
 */
function addDimmerToGroup(device, dimmer, tab, group, position) {
	var curDimmer = undefined;
	var curProfileId = getCurrentProfile().id;
	var $group = $('#div-group-'+tab+'-'+group);
	
	// Look for the switch
	for (var i=0; i<angharad.device[device].dimmers.length; i++) {
		if (angharad.device[device].dimmers[i].name == dimmer) {
			curDimmer = angharad.device[device].dimmers[i];
		}
	}
	
	if (group == -1 && tab == tabSwitchesDimmersId) {
		// Add it in the device group
		displayDimmerInGroup(device, curDimmer, tab, group, position);
		return true;
	}
	
	// Search if the selected switch is already in the dashboard
	var foundIt = false;
	for (key in curDimmer.tags) {
		if (curDimmer.tags[key].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group) == 0) {
			foundIt = true;
		}
	}
	
	// If the selected switch isn't already in the dashboard, we add it
	if (foundIt) {
		return false;
	}
	
	curDimmer.tags.push(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group + '#' + position);
	var url = globalConfig.angharad_location+'/SETDIMMERDATA/';
	var response = sendPostRequest(url,
		{name: curDimmer.name, device: device, display: curDimmer.display, 
		 enabled: curDimmer.enabled, monitored: curDimmer.monitored, 
		 monitored_every: curDimmer.monitoredEvery, tags: curDimmer.tags.join()}
	);
	
	if (response.result) {
		var json = response.json;
    
		
		for (var i=0; i<angharad.device[device].dimmers.length; i++) {
			if (angharad.device[device].dimmers[i].name == json.dimmer.name) {
				angharad.device[device].dimmers[i].tags = json.dimmer.tags;
        displayDimmerInGroup(device, angharad.device[device].dimmers[i], tab, group, position);
			}
		}
	} else {
		logMessage(logTypeError, $.t('Error updating dimmer'));
	}
}

/**
 * Display the dimmer in the group
 */
function displayDimmerInGroup(device, curDimmer, tab, group, position) {
	$group = $('#container-'+tab+'-'+group);
	var curName = tab + '-' + group + '-' + device + '-' + curDimmer.name;
	if (group == -1 && tab == tabSwitchesDimmersId) {
		curName = device + '-' + curDimmer.name;
		$group = $('#container-switches-dimmers-'+device);
	}
	
	var adminClass = '';
	if (tab == tabDashboardId) {
		adminClass = 'admin-modify-dashboard';
	} else {
		adminClass = 'admin-modify-no-dashboard';
	}
	
	var html = dimmerTemplate.replace(/%NAME%/g, curName)
								.replace(/%DEVICE%/g, device)
								.replace(/%DIMMER%/g, curDimmer.name)
								.replace(/%GROUPNAME%/g, device+'-'+curDimmer.name)
								.replace(/%DISPLAY%/g, curDimmer.display)
								.replace(/%ADMINCLASS%/g, adminClass)
                .replace(/%TAB%/g, tab)
                .replace(/%GROUP%/g, group)
								.replace(/%POSITION%/g, position)
								.replace(/%CLASS%/g, (!curDimmer.enabled?'div-hidden':''));
	
	insertElementInGroup(html, $group, position);
	
	if (getCurrentProfile().options.adminMode) {
		$('#admin-dimmer-'+curName).show();
	} else {
		$('#admin-dimmer-'+curName).hide();
	}
	
	tabContent[tab][(group==-1?device:group)].push({type:"dimmer", device:device, 
													name:curDimmer.name,
													group:group,
													position:position});

  initDimmer(curName, curDimmer);
}

/**
 * Add a heater to the dashboard
 * update the element by adding the proper tag
 */
function addHeaterToGroup(device, heater, tab, group, position) {
	var curHeater = undefined;
	var curProfileId = getCurrentProfile().id;
	var $group = $('#div-group-'+tab+'-'+group);
	
	// Look for the switch
	for (var i=0; i<angharad.device[device].heaters.length; i++) {
		if (angharad.device[device].heaters[i].name == heater) {
			curHeater = angharad.device[device].heaters[i];
		}
	}
	
	if (group == -1 && tab == tabHeatersId) {
		// Add it in the device group
		displayHeaterInGroup(device, curHeater, tab, group, position);
		return true;
	}
	
	// Search if the selected switch is already in the group
	for (key in curHeater.tags) {
		if (curHeater.tags[key].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group) == 0) {
			return false;
		}
	}
	
	curHeater.tags.push(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group + '#' + position);
	var url = globalConfig.angharad_location+'/SETHEATERDATA/';
	var response = sendPostRequest(url,
		{name: curHeater.name, device: device, display: curHeater.display, 
		 unit: curHeater.unit, enabled: curHeater.enabled, monitored: curHeater.monitored, 
		 monitored_every: curHeater.monitoredEvery, tags: curHeater.tags.join()}
	);
	
	if (response.result) {
		var json = response.json;
		
		for (var i=0; i<angharad.device[device].heaters.length; i++) {
			if (angharad.device[device].heaters[i].name == json.heater.name) {
				angharad.device[device].heaters[i].tags = json.heater.tags;
        displayHeaterInGroup(device, angharad.device[device].heaters[i], tab, group, position);
			}
		}
	} else {
		logMessage(logTypeError, $.t('Error updating heater'));
	}
}

/**
 * Display the heater in the dashboard
 */
function displayHeaterInGroup(device, curHeater, tab, group, position) {
	$group = $('#container-'+tab+'-'+group);
	var curName = tab + '-' + group + '-' + device + '-' + curHeater.name;
	if (group == -1 && tab == tabHeatersId) {
		curName = device + '-' + curHeater.name;
		$group = $('#container-heater-'+device);
	}
	
	var adminClass = '';
	if (tab == tabDashboardId) {
		adminClass = 'admin-modify-dashboard';
	} else {
		adminClass = 'admin-modify-no-dashboard';
	}
	
	var html = heaterTemplate.replace(/%NAME%/g, curName)
								.replace(/%DEVICE%/g, device)
								.replace(/%HEATER%/g, curHeater.name)
								.replace(/%GROUPNAME%/g, device+'-'+curHeater.name)
								.replace(/%DISPLAY%/g, curHeater.display)
								.replace(/%UNIT%/g, curHeater.unit)
								.replace(/%ISSET%/g, (curHeater.set?'checked="checked"':''))
								.replace(/%ADMINCLASS%/g, adminClass)
                .replace(/%TAB%/g, tab)
                .replace(/%GROUP%/g, group)
								.replace(/%POSITION%/g, position)
								.replace(/%CLASS%/g, (!curHeater.enabled?'div-hidden':''));
	
	insertElementInGroup(html, $group, position);
	
	if (getCurrentProfile().options.adminMode) {
		$('#admin-heater-'+curName).show();
	} else {
		$('#admin-heater-'+curName).hide();
	}
	
	tabContent[tab][(group==-1?device:group)].push({type:"heater", device:device, name:curHeater.name, group:group, position:position});
	
	initHeater(curName, curHeater);
}

/**
 * Add a sensor to the group
 * update the element by adding the proper tag
 */
function addSensorToGroup(device, sensor, tab, group, position) {
	var curSensor = undefined;
	var curProfileId = getCurrentProfile().id;
	var $group = $('#div-group-'+tab+'-'+group);
	
	// Look for the switch
	for (var i=0; i<angharad.device[device].sensors.length; i++) {
		if (angharad.device[device].sensors[i].name == sensor) {
			curSensor = angharad.device[device].sensors[i];
		}
	}
	
	if (group == -1 && tab == tabSensorsId) {
		// Add it in the device group
		displaySensorInGroup(device, curSensor, tab, group, position);
		return true;
	}
	
	// Search if the selected switch is already in the group
	for (key in curSensor.tags) {
		if (curSensor.tags[key].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group) == 0) {
			return false;
		}
	}
	
	curSensor.tags.push(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group + '#' + position);
	var url = globalConfig.angharad_location+'/SETSENSORDATA/';
	var response = sendPostRequest(url,
		{name: curSensor.name, device: device, display: curSensor.display, 
		 unit: curSensor.unit, enabled: curSensor.enabled, monitored: curSensor.monitored, 
		 monitored_every: curSensor.monitoredEvery, tags: curSensor.tags.join()}
	);
	
	if (response.result) {
		var json = response.json;
    
		for (var i=0; i<angharad.device[device].sensors.length; i++) {
			if (angharad.device[device].sensors[i].name == json.sensor.name) {
				// Update tags
				angharad.device[device].sensors[i].tags = json.sensor.tags;
        displaySensorInGroup(device, angharad.device[device].sensors[i], tab, group, position);
			}
		}
	} else {
		logMessage(logTypeError, $.t('Error updating sensor'));
	}
}

/**
 * Display the sensor in the dashboard
 */
function displaySensorInGroup(device, curSensor, tab, group, position) {
	$group = $('#container-'+tab+'-'+group);
	var curName = tab + '-' + group + '-' + device + '-' + curSensor.name;
	if (group == -1 && tab == tabSensorsId) {
		curName = device + '-' + curSensor.name;
		$group = $('#container-sensor-'+device);
	}
	
	var adminClass = '';
	if (tab == tabDashboardId) {
		adminClass = 'admin-modify-dashboard';
	} else {
		adminClass = 'admin-modify-no-dashboard';
	}
	
	var html = sensorTemplate.replace(/%NAME%/g, curName)
								.replace(/%DEVICE%/g, device)
								.replace(/%SENSOR%/g, curSensor.name)
								.replace(/%GROUPNAME%/g, device+'-'+curSensor.name)
								.replace(/%DISPLAY%/g, curSensor.display)
								.replace(/%UNIT%/g, curSensor.unit)
								.replace(/%VALUE%/g, curSensor.value)
								.replace(/%ADMINCLASS%/g, adminClass)
                .replace(/%TAB%/g, tab)
                .replace(/%GROUP%/g, group)
								.replace(/%POSITION%/g, position)
								.replace(/%CLASS%/g, (!curSensor.enabled?'div-hidden':''));
	
	insertElementInGroup(html, $group, position);
	
	if (getCurrentProfile().options.adminMode) {
		$('#admin-sensor-'+curName).show();
	} else {
		$('#admin-sensor-'+curName).hide();
	}
	
	tabContent[tab][(group==-1?device:group)].push({type:"sensor", device:device, name:curSensor.name, group:group});
	
	if (!curSensor.enabled) {
		$('#div-sensor'+curName).hide();
	}
  
  $('#graph-sensor-'+curName).click(function() {
    monitorElement($(this));
    return false;
  });
}

/**
 * Add a script to the group
 * update the element by adding the proper tag
 */
function addScriptToGroup(script, tab, group, position) {
	var curScript = angharad.scripts[script];
	var curProfileId = getCurrentProfile().id;
	var $group = $('#div-group-'+tab+'-'+group);
	var postParams = {};
	
	// Search if the selected switch is already in the group
	for (key in curScript.tags) {
		if (curScript.tags[key].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group) == 0) {
			return false;
		}
	}
	curScript.tags.push(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group + '#' + position);
	
	postParams.tags = curScript.tags.join(',');
	postParams.id = curScript.id;
	postParams.name = curScript.name;
	postParams.enabled = curScript.enabled;
	postParams.device = curScript.device;
	postParams.actions='';
	for (key in curScript.actions) {
		if (postParams.actions != '') {
			postParams.actions += ';';
		}
		postParams.actions += curScript.actions[key].id + ',' + (curScript.actions[key].enabled?'1':'0');
	}
	
	var url = globalConfig.angharad_location+'/SETSCRIPT/';
	var response = sendPostRequest(url, postParams);
	
	if (response.result) {
		displayScriptInGroup(curScript, tab, group, position);
	} else {
		logMessage(logTypeError, $.t('Error updating script'));
	}
}

/**
 * Display the script in the group
 */
function displayScriptInGroup(curScript, tab, group, position) {
	$group = $('#container-'+tab+'-'+group);
	var curName = tab + '-' + group + '-' + curScript.id;
	if (group == -1 && tab == tabScriptsSchedulesId) {
		curName = curScript.id;
		$group = $('#container-script');
	}
	
	var adminClass = '';
	if (tab != tabScriptsSchedulesId) {
		adminClass = 'admin-modify-delete-dashboard';
	} else {
		adminClass = 'admin-modify-delete-no-dashboard';
	}
	
	var html = scriptTemplate.replace(/%NAME%/g, curName)
								.replace(/%DISPLAY%/g, curScript.name)
								.replace(/%GROUPNAME%/g, curScript.id)
								.replace(/%SCRIPT%/g, curScript.id)
								.replace(/%ADMINCLASS%/g, adminClass)
                .replace(/%TAB%/g, tab)
                .replace(/%GROUP%/g, group)
								.replace(/%POSITION%/g, position)
								.replace(/%CLASS%/g, (!curScript.enabled?'div-hidden':''));
	
  insertElementInGroup(html, $group, position);
	
	if (getCurrentProfile().options.adminMode) {
		$('#admin-script-'+curName).show();
		$('#div-script'+curName).show();
	} else {
		$('#admin-script-'+curName).hide();
		if (!curScript.enabled) {
			$('#div-script'+curName).hide();
		}
	}
	
	tabContent[tab][group].push({type:"script", id:curScript.id, name:curScript.name, group:group, position:position});
  
  $('#script-'+curName).click(function() {
    runScript($(this).attr('data-an-script'));
		return false;
  });
}

/**
 * Run the specified script
 */
function runScript(scriptId) {
  var url = globalConfig.angharad_location + '/RUNSCRIPT/' + scriptId;
  var response = sendGetRequest(url);
  
  if (response.result) {
    logMessage(logTypeInfo, $.t('Script executed succesfully'));
  } else {
    logMessage(logTypeError, $.t('Error running script'));
  }
}

/**
 * Display the schedule in the group
 */
function displayScheduleInGroup(curSchedule, tab, group, position) {
  $group = $('#container-schedule');
  
	var html = scheduleTemplate.replace(/%NAME%/g, curSchedule.id)
                              .replace(/%POSITION%/g, position);
  insertElementInGroup(html, $group, position);
  
  updateScheduleDisplay(curSchedule);

  $('#schedule-'+curSchedule.id).change(function() {
    var value = $(this).prop('checked')?'1':'0';
    var url = globalConfig.angharad_location + '/ENABLESCHEDULE/' + $(this).attr('data-an-schedule') + '/' + value;
    var response = sendGetRequest(url);
    
    if (response.result) {
      angharad.schedules[$(this).attr('data-an-schedule')] = response.json.schedule;
      updateScheduleDisplay(angharad.schedules[$(this).attr('data-an-schedule')]);
    } else {
      $(this).prop('checked', !$(this).prop('checked'));
      logMessage(logTypeError, $.t('Error, unable to edit schedule'));
    }
  });
	
	if (getCurrentProfile().options.adminMode) {
		$('#div-schedule-'+curSchedule.id).find('.admin-button').show();
	}
	
	tabContent[tab][group].push({type:"schedule", name:curSchedule.id, group:group});
}

/**
 * Display the action in the group
 */
function displayActionInGroup(curAction, tab, group, position) {
  $container = $('#container-action');
  
	var html = actionTemplate.replace(/%NAME%/g, curAction.id)
														.replace(/%DISPLAY%/g, curAction.name)
                            .replace(/%POSITION%/g, position);
	
  insertElementInGroup(html, $container, position);
  
	if (getCurrentProfile().options.adminMode) {
		$('#div-action-'+curAction.id).find('.admin-button').show();
	}
	
	tabContent[tab][group].push({type:"action", name:curAction.id, group:group});
}

/**
 * Enable or disable a schedule and udate its label
 */
function updateScheduleDisplay(curSchedule) {
  var $check = $('#schedule-'+curSchedule.id);
  var $label = $('#message-schedule-'+curSchedule.id);
	var curScript = angharad.scripts[curSchedule.script];
	
  $check.prop('checked', curSchedule.enabled);
  if (curSchedule.enabled) {
    $label.text(curSchedule.name + ', ' + $.t('Next launch')+': '+(new Date(curSchedule.next_time * 1000)).toLocaleString());
  } else {
    $label.text(curSchedule.name + ', ' + $.t('Disabled'));
  }
	updateScriptHoverDisplay(curScript);
}

/**
 * udate a sdcript label and display
 */
function updateScriptHoverDisplay(curScript) {
	var schedulesHtml = scheduleHoverBlockTemplate.replace(/%NAME%/g, curScript.id).replace(/%DISPLAY%/g, $.t('Schedules for this task:'));
	var hasSchedule = false;
	
	for (key in angharad.schedules) {
		if (angharad.schedules[key].script == curScript.id) {
			hasSchedule = true;
			var curSchedule = angharad.schedules[key];
			if (curSchedule.enabled) {
				schedulesHtml += scheduleHoverTemplate.replace(/%NAME%/g, curScript.id+'-'+curSchedule.id)
									.replace(/%DISPLAY%/g, curSchedule.name + ', ' + $.t('Next launch')+': '+(new Date(curSchedule.next_time * 1000)).toLocaleString());
			} else {
				schedulesHtml += scheduleHoverTemplate.replace(/%NAME%/g, curScript.id+'-'+curSchedule.id)
									.replace(/%DISPLAY%/g, curSchedule.name + ', ' + $.t('Disabled'));
			}
		}
	}
	
	if (!hasSchedule) {
		schedulesHtml += scheduleNoneHoverTemplate.replace(/%DISPLAY%/g, $.t('None'));
	}
	
	$('.group-script-'+curScript.id).each(function() {
		$(this).find('.label-script').text(curScript.name);
		$(this).find('.display-schedule-attached').html(schedulesHtml);
		if (hasSchedule) {
			$(this).find('.schedule-attached-img').attr('src', 'images/schedule.png');
		}
	});
}

/**
 * Remove a switch from a group
 * update the group by removing the proper tag
 */
function removeSwitchFromGroup(device, switcher, tab, group) {
	var curSwitcher = undefined;
	var curProfileId = getCurrentProfile().id;
	
	// Look for the switch
	for (var i=0; i<angharad.device[device].switches.length; i++) {
		if (angharad.device[device].switches[i].name == switcher) {
			curSwitcher = angharad.device[device].switches[i];
		}
	}
	
	// Search if the selected switch is in the group
	var foundIt = false;
	for (key in curSwitcher.tags) {
		if (curSwitcher.tags[key].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group) == 0) {
			foundIt = true;
		}
	}
	
	if (tab == tabSwitchesDimmersId && group == -1) {
		// This is the switch in the device group
		$div = $('#div-switch-' + device + '-' + curSwitcher.name);
		$div.fadeOut('fast', function() {
			$div.remove();
		});
	} else {
	
		// If the selected switch is in the group, we remove it
		if (!foundIt) {
			return false;
		}
		
		for (key in curSwitcher.tags) {
			if (curSwitcher.tags[key].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group) == 0) {
				// Remove current tag from the tags list
				curSwitcher.tags.splice(key, 1);
			}
		}
		
		var url = globalConfig.angharad_location+'/SETSWITCHDATA/';
		var response = sendPostRequest(url,
			{name: curSwitcher.name, device: device, display: curSwitcher.display, 
			 type: curSwitcher.type, enabled: curSwitcher.enabled, monitored: curSwitcher.monitored, 
			 monitored_every: curSwitcher.monitoredEvery, tags: curSwitcher.tags.join()}
		);
		
		if (response.result) {
			var json = response.json;
			$divSwitch = $('#div-switch-' + tab + '-' + group + '-' + device + '-' + curSwitcher.name);
			$divSwitch.fadeOut('fast', function() {
				$divSwitch.remove();
			});
			curSwitcher.tags = json.switch.tags;
			
			for (key in tabContent[tab][group]) {
				if (tabContent[tab][group][key].type == "switcher" && tabContent[tab][group][key].device == device && tabContent[tab][group][key].name == switcher) {
					tabContent[tab][group].splice(key, 1);
				}
			}
		} else {
			logMessage(logTypeError, $.t('Error updating switch'));
		}
	}
}

/**
 * Remove a dimmer from a group
 * update the group by removing the proper tag
 */
function removeDimmerFromGroup(device, dimmer, tab, group) {
	var curDimmer = undefined;
	var curProfileId = getCurrentProfile().id;
	
	// Look for the dimmer
	for (var i=0; i<angharad.device[device].dimmers.length; i++) {
		if (angharad.device[device].dimmers[i].name == dimmer) {
			curDimmer = angharad.device[device].dimmers[i];
		}
	}
	
	// Search if the selected dimmer is in the group
	var foundIt = false;
	for (key in curDimmer.tags) {
		if (curDimmer.tags[key].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group) == 0) {
			foundIt = true;
		}
	}
	
	if (tab == tabSwitchesDimmersId && group == -1) {
		// This is the dimmer in the device group
		$div = $('#div-dimmer-' + device + '-' + curDimmer.name);
		$div.fadeOut('fast', function() {
			$div.remove();
		});
	} else {
		// If the selected dimmer is in the group, we remove it
		if (!foundIt) {
			return false;
		}
		
		for (key in curDimmer.tags) {
			if (curDimmer.tags[key].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group) == 0) {
				// Remove current tag from the tags list
				curDimmer.tags.splice(key, 1);
			}
		}
		
		var url = globalConfig.angharad_location+'/SETDIMMERDATA/';
		var response = sendPostRequest(url,
			{name: curDimmer.name, device: device, display: curDimmer.display, 
			 type: curDimmer.type, enabled: curDimmer.enabled, monitored: curDimmer.monitored, 
			 monitored_every: curDimmer.monitoredEvery, tags: curDimmer.tags.join()}
		);
		
		if(response.result) {
			var json = response.json;
			$div = $('#div-dimmer-' + tab + '-' + group + '-' + device + '-' + curDimmer.name);
			$div.fadeOut('fast', function() {
				$div.remove();
			});
			curDimmer.tags = json.dimmer.tags;
			for (key in tabContent[tab][group]) {
				if (tabContent[tab][group][key].type == "dimmer" && tabContent[tab][group][key].device == device && tabContent[tab][group][key].name == dimmer) {
					tabContent[tab][group].splice(key, 1);
				}
			}
		} else {
			logMessage(logTypeError, $.t('Error updating dimmer'));
		}
	}
}

/**
 * Remove a heater from a group
 * update the group by removing the proper tag
 */
function removeHeaterFromGroup(device, heater, tab, group) {
	var curHeater = undefined;
	var curProfileId = getCurrentProfile().id;
	
	// Look for the heater
	for (var i=0; i<angharad.device[device].heaters.length; i++) {
		if (angharad.device[device].heaters[i].name == heater) {
			curHeater = angharad.device[device].heaters[i];
		}
	}
	
	// Search if the selected heater is in the group
	var foundIt = false;
	for (key in curHeater.tags) {
		if (curHeater.tags[key].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group) == 0) {
			foundIt = true;
		}
	}
	
	if (tab == tabHeatersId && group == -1) {
		// This is the heater in the device group
		$div = $('#div-heater-' + device + '-' + curHeater.name);
		$div.fadeOut('fast', function() {
			$div.remove();
		});
	} else {
		// If the selected heater is in the dashboard, we remove it
		if (!foundIt) {
			return false;
		}
		
		for (key in curHeater.tags) {
			if (curHeater.tags[key].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group) == 0) {
				// Remove current tag from the tags list
				curHeater.tags.splice(key, 1);
			}
		}
		
		var url = globalConfig.angharad_location+'/SETHEATERDATA/';
		var response = sendPostRequest(url,
			{name: curHeater.name, device: device, display: curHeater.display, 
			 type: curHeater.type, enabled: curHeater.enabled, monitored: curHeater.monitored, 
			 monitored_every: curHeater.monitoredEvery, tags: curHeater.tags.join()}
		);
		
		if (response.result) {
			var json = response.json;
			$div = $('#div-heater-' + tab + '-' + group + '-' + device + '-' + curHeater.name);
			$div.fadeOut('fast', function() {
				$div.remove();
			});
			curHeater.tags = json.heater.tags;
			for (key in tabContent[tab][group]) {
				if (tabContent[tab][group][key].type == "heater" && tabContent[tab][group][key].device == device && tabContent[tab][group][key].name == heater) {
					tabContent[tab][group].splice(key, 1);
				}
			}
		} else {
			logMessage(logTypeError, $.t('Error updating heater'));
		}
	}
}

/**
 * Remove a sensor from a group
 * update the group by removing the proper tag
 */
function removeSensorFromGroup(device, sensor, tab, group) {
	var curSensor = undefined;
	var curProfileId = getCurrentProfile().id;
	
	// Look for the sensor
	for (var i=0; i<angharad.device[device].sensors.length; i++) {
		if (angharad.device[device].sensors[i].name == sensor) {
			curSensor = angharad.device[device].sensors[i];
		}
	}
	
	// Search if the selected sensor is in the group
	var foundIt = false;
	for (key in curSensor.tags) {
		if (curSensor.tags[key].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group) == 0) {
			foundIt = true;
		}
	}
	
	if (tab == tabSensorsId && group == -1) {
		// This is the sensor in the device group
		$div = $('#div-sensor-' + device + '-' + curSensor.name);
		$div.fadeOut('fast', function() {
			$div.remove();
		});
	} else {
		// If the selected sensor is in the group, we remove it
		if (!foundIt) {
			return false;
		}
		
		
		for (key in curSensor.tags) {
			if (curSensor.tags[key].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group) == 0) {
				// Remove current tag from the tags list
				curSensor.tags.splice(key, 1);
			}
		}
		
		var url = globalConfig.angharad_location+'/SETSENSORDATA/';
		var response = sendPostRequest(url,
			{name: curSensor.name, device: device, display: curSensor.display, 
			 type: curSensor.type, enabled: curSensor.enabled, monitored: curSensor.monitored, 
			 monitored_every: curSensor.monitoredEvery, tags: curSensor.tags.join()}
		);
		
		if (response.result) {
			var json = response.json;
			$div = $('#div-sensor-' + tab + '-' + group + '-' + device + '-' + curSensor.name);
			$div.fadeOut('fast', function() {
				$div.remove();
			});
			curSensor.tags = json.sensor.tags;
			for (key in tabContent[tab][group]) {
				if (tabContent[tab][group][key].type == "sensor" && tabContent[tab][group][key].device == device && tabContent[tab][group][key].name == sensor) {
					tabContent[tab][group].splice(key, 1);
				}
			}
		} else {
			logMessage(logTypeError, $.t('Error updating sensor'));
		}
	}
}

/**
 * Remove a script from a group
 * update the group by removing the proper tag
 */
function removeScriptFromGroup(script, tab, group) {
	var curScript = angharad.scripts[script];
	var curProfileId = getCurrentProfile().id;
	var postParams = {};
	
	// Search if the selected sensor is in the group
	var foundIt = false;
	for (key in curScript.tags) {
		if (curScript.tags[key].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group) == 0) {
			foundIt = true;
		}
	}
	
	if (foundIt && !(tab == tabScriptsSchedulesId && group == -1)) {
		
		for (key in curScript.tags) {
			if (curScript.tags[key].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group) == 0) {
				// Remove current tag from the tags list
				curScript.tags.splice(key, 1);
			}
		}
		postParams.tags = curScript.tags.join(',');
		postParams.id = curScript.id;
		postParams.name = curScript.name;
		postParams.enabled = curScript.enabled;
		postParams.device = curScript.device;
		postParams.actions = '';
		for (key in curScript.actions) {
			if (postParams.actions != '') {
				postParams.actions += ';';
			}
			postParams.actions += curScript.actions[key].id + ',' + (curScript.actions[key].enabled?'1':'0');
		}
		
		var url = globalConfig.angharad_location+'/SETSCRIPT/';
		var response = sendPostRequest(url, postParams);
		
		if (response.result) {
			var $div = $('#div-script-'+tab+'-'+group+'-'+script);
			$div.fadeOut('fast', function() {
				$div.remove();
			});
			curScript.tags = response.json.script.tags;
			for (key in tabContent[tab][group]) {
				if (tabContent[tab][group][key].type == "script" && tabContent[tab][group][key].id == curScript.id) {
					tabContent[tab][group].splice(key, 1);
				}
			}
		} else {
			logMessage(logTypeError, $.t('Error while updating script'));
		}
	}
}

/**
 * Get the element at selected position in the selected group
 * If position is -1, then return the last element in the group
 * If there is no element at the specified position, return false
 */
function getElementAtPosition(tab, group, position) {
	if (position == -1) {
		if (tabContent[tab][group].length > 0) {
			return tabContent[tab][group][tabContent[tab][group].length - 1];
		} else {
			return false;
		}
	} else if (position >= 0) {
		if (tabContent[tab][group][position] == undefined) {
			return false;
		} else {
			return tabContent[tab][group][position];
		}
	} else {
		return false;
	}
}

/**
 * Edit a script or create a new one
 * Opens the Edit script dialog window
 */
function editScript($script) {
	var $dialog = $('#dialog-script');
	var title = $.t('Edit a script');
	if ($script == null) {
		title = $.t('Add a script');
	}
		
	initScriptDialog($dialog, $script);
	$dialog.on('keypress', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if(code == 13) {
			okScript($dialog);
		}
	});
	
	$dialog.dialog({
		autoOpen: false,
		width: 500,
		modal: true,
		title: title,
		buttons: [{
			text:$.t('Ok'),
			click:function() {
				okScript($dialog);
			}
		}]
	});
	
	$dialog.dialog('open');
	
}

/**
 * Initialize and opens the edit script dialog window
 */
function initScriptDialog($dialog, $script) {
	var $scriptActionsList = $('#dialog-script-actions');
	var $actionsList = $('#dialog-script-action-list');
		
	$scriptActionsList.empty();
	if ($script != null) {
		var script = angharad.scripts[$script.attr('data-an-name')];
		$('#dialog-script-id').val(script.id);
		$('#dialog-script-name').val(script.name);
		$('#dialog-script-enabled').prop('checked', script.enabled);
		$('#dialog-script-device').val('');
		$('#dialog-script-tags').val(script.tags);
		for (var i=0; i<script.actions.length; i++) {
			var action = script.actions[i];
			var htmlOption = '<option value="'+action.id+'" data-an-enabled="'+action.enabled+'" class="'+(action.enabled?'an-enabled':'an-disabled')+'">'+action.name+'</option>\n';
			$scriptActionsList.append(htmlOption);
		}
	} else {
		$('#dialog-script-id').val('');
		$('#dialog-script-name').val('');
		$('#dialog-script-enabled').prop('checked', true);
	}
	
	$actionsList.empty();
	for (key in angharad.actions) {
		var htmlOption = '<option value="'+angharad.actions[key].id+'">'+angharad.actions[key].name+'</option>\n';
		$actionsList.append(htmlOption);
	}
	
	$('#dialog-script-action-up').off('click').click(function () {
		var $actionSelected = $('#dialog-script-actions').find('option:selected');
		if ($actionSelected.prev() != undefined) {
			$actionSelected.insertBefore($actionSelected.prev());
		}
	});
	
	$('#dialog-script-action-down').off('click').click(function () {
		var $actionSelected = $('#dialog-script-actions').find('option:selected');
		if ($actionSelected.next() != undefined) {
			$actionSelected.insertAfter($actionSelected.next());
		}
	});
	
	$('#dialog-script-action-remove').off('click').click(function () {
		$('#dialog-script-actions').find('option:selected').remove();
	});
	
	$('#dialog-script-action-add').off('click').click(function () {
		var actionId = $('#dialog-script-action-list').find('option:selected').val();
		var actionName = $('#dialog-script-action-list').find('option:selected').text();
		
		var htmlOption = '<option value="'+actionId+'" data-an-enabled="true" class="an-enabled">'+actionName+'</option>';
		$scriptActionsList.append(htmlOption);
	});
  
  $('#dialog-script-actions').dblclick(function () {
    var $option = $(this).find("option:selected");
    if ($option.attr('data-an-enabled') == 'true') {
      $option.attr('data-an-enabled', 'false');
      $option.attr('class', 'an-disabled');
    } else {
      $option.attr('data-an-enabled', 'true');
      $option.attr('class', 'an-enabled');
    }
  });
}

/**
 * Add or edit a script when ok is clicked on the dialog window
 */
function okScript($dialog) {
	var url = globalConfig.angharad_location;
	var postParams = {};
	var isAdd = true;
	var scriptName = '';
	var scriptId = '';
	
	if ($dialog.find('#dialog-script-id').val() != '') {
		url += '/SETSCRIPT';
		postParams.id = $dialog.find('#dialog-script-id').val();
		postParams.device = angharad.scripts[postParams.id].device;
		isAdd = false;
	} else {
		url += '/ADDSCRIPT';
	}
	postParams.name = $dialog.find('#dialog-script-name').val();
	postParams.enabled = $dialog.find('#dialog-script-enabled').prop('checked')?'true':'false';
  postParams.tags = $dialog.find('#dialog-script-tags').val();
	
	postParams.actions='';
	$dialog.find('#dialog-script-actions option').each(function () {
		if (postParams.actions != '') {
			postParams.actions += ';';
		}
		postParams.actions += $(this).val() + ',' + ($(this).attr('data-an-enabled')=='true'?'1':'0');
	});
  
  if (postParams.name === '') {
    alert($.t('You must enter a script name'));
    return false;
  } else if (postParams.actions === '') {
    alert($.t('You must add at least one action'));
    return false;
  }
	
	var response = sendPostRequest(url, postParams);
	
	if (response.result) {
		var script = response.json.script;
		script.actions = [];
		var i=0;
		$dialog.find('#dialog-script-actions option').each(function () {
			script.actions[i] = {id:$(this).val(), name:$(this).text(), enabled:$(this).attr('data-an-enabled')=='true', rank:i+1};
			i++;
		});
		angharad.scripts[script.id] = script;
		if (isAdd) {
			// Add new script in the scripts tab
			displayScriptInGroup(script, tabScriptsSchedulesId, '-1', -1);
			updateScriptHoverDisplay(script);
    } else {
			// Edit all scripts in all tabs
			updateScriptHoverDisplay(script);
		}
	} else {
		logMessage(logTypeError, $.t('Error, unable to save script'));
	}
	$dialog.dialog( 'close' ); 
}

/**
 * Delete the specified script
 */
function deleteScript($script) {
	var scriptId = $script.attr('data-an-name');
	var url = globalConfig.angharad_location + '/DELETESCRIPT/' + scriptId;

	if (confirm($.t('Are you sure you want to delete this task ?'))) {
		var response = sendGetRequest(url);
		
		if (response.result) {
			$('.group-script-'+scriptId).each(function() {
				$(this).slideUp();
				$(this).remove();
				angharad.scripts.splice(scriptId, 1);
			});
		} else {
			logMessage(logTypeError, $.t('Error, unable to delete script'));
		}
	}
}

/**
 * Edit an existing schedule or create a new one
 */
function editSchedule(scheduleId) {
	var $dialog = $('#dialog-schedule');
	var title = $.t('Edit a scheduled task');
	if (scheduleId == null) {
		title = $.t('Add a scheduled task');
	}
	
	$dialog.on('keypress', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if(code == 13) {
			okSchedule($dialog);
		}
	});
	
	$dialog.dialog({
		autoOpen: false,
		width: 500,
		modal: true,
		title: title,
		buttons: [{
			text:$.t('Ok'),
			click:function() {
				okSchedule($dialog);
			}
		}]
	});
	
	$dialog.dialog('open');
	
	initDialogSchedule($dialog, scheduleId);
				
}

/**
 * Open the edit schedule dialog window
 */
function initDialogSchedule($dialog, scheduleId) {
	$('#dialog-schedule-date').datepicker({
		showOn: "button",
		buttonImage: "images/calendar.gif",
		buttonImageOnly: true,
		option: $.datepicker.regional["fr"],
		dateFormat: "dd/mm/yy"
	});
	
	$('#dialog-schedule-script').empty();
	for (var key in angharad.scripts) {
		if (angharad.scripts[key] != undefined && angharad.scripts[key].enabled) {
			var htmlOption = '<option value="'+angharad.scripts[key].id+'">'+angharad.scripts[key].name+'</option>\n';
			$('#dialog-schedule-script').append(htmlOption);
		}
	}
	
	$('#dialog-schedule-repeat').change(function () {
		if ($(this).prop('checked')) {
			$('.p-dialog-schedule-repeat-every').slideDown();
			$('#dialog-schedule-repeat-every').trigger('change');
			$('.p-dialog-schedule-remove-after-done').slideUp();
		} else {
			$('.p-dialog-schedule-repeat-every').slideUp();
			$('.p-dialog-schedule-repeat-value-dow').slideUp();
			$('.p-dialog-schedule-remove-after-done').slideDown();
		}
	});
	
	$('#dialog-schedule-repeat-every').change(function () {
		if ($(this).val() == '3') {
			$('.p-dialog-schedule-repeat-value-dow').slideDown();
			$('#dialog-schedule-repeat-value').slideUp();
		} else {
			$('.p-dialog-schedule-repeat-value-dow').slideUp();
			$('#dialog-schedule-repeat-value').slideDown();
		}
	});
	
	if (scheduleId == null) {
		$('#dialog-schedule-id').val('');
		$('#dialog-schedule-name').val('');
		$('#dialog-schedule-enabled').prop('checked', true);
		$('#dialog-schedule-script option:first').prop('selected', true);
		setDateDisplay(new Date());
		$('#dialog-schedule-repeat').prop('checked', false);
		$('#dialog-schedule-repeat-every option[value="0"]').prop('selected', true);
		$('#dialog-schedule-remove-after-done').prop('checked', false);
		$('.p-dialog-schedule-repeat-every').hide();
		$('.p-dialog-schedule-repeat-value-dow').hide();
    $('#dialog-schedule-repeat-value-dow-1').prop('checked', false);
    $('#dialog-schedule-repeat-value-dow-2').prop('checked', false);
    $('#dialog-schedule-repeat-value-dow-4').prop('checked', false);
    $('#dialog-schedule-repeat-value-dow-8').prop('checked', false);
    $('#dialog-schedule-repeat-value-dow-16').prop('checked', false);
    $('#dialog-schedule-repeat-value-dow-32').prop('checked', false);
    $('#dialog-schedule-repeat-value-dow-64').prop('checked', false);
	} else {
		var curDate = new Date(0);
		var curSchedule = angharad.schedules[scheduleId];
		$('#dialog-schedule-id').val(curSchedule.id);
		$('#dialog-schedule-name').val(curSchedule.name);
		$('#dialog-schedule-enabled').prop('checked', curSchedule.enabled);
		$('#dialog-schedule-remove-after-done').prop('checked', curSchedule.remove_after_done);
		$('#dialog-schedule-script option[value="'+curSchedule.script.id+'"]').prop('selected', true);
		$('#dialog-schedule-device option[value="'+curSchedule.device+'"]').prop('selected', true);
		curDate.setUTCSeconds(curSchedule.next_time);
		setDateDisplay(curDate);
		$('#dialog-schedule-repeat').prop('checked', curSchedule.repeat_schedule!=-1);
		$('#dialog-schedule-repeat-every option[value="'+curSchedule.repeat_schedule+'"]').prop('selected', true);
		if (curSchedule.repeat_schedule == 3) {
			// Day of week
			$('#dialog-schedule-repeat-value-dow-1').prop('checked', (curSchedule.repeat_schedule_value & 1));
			$('#dialog-schedule-repeat-value-dow-2').prop('checked', (curSchedule.repeat_schedule_value & 2));
			$('#dialog-schedule-repeat-value-dow-4').prop('checked', (curSchedule.repeat_schedule_value & 4));
			$('#dialog-schedule-repeat-value-dow-8').prop('checked', (curSchedule.repeat_schedule_value & 8));
			$('#dialog-schedule-repeat-value-dow-16').prop('checked', (curSchedule.repeat_schedule_value & 16));
			$('#dialog-schedule-repeat-value-dow-32').prop('checked', (curSchedule.repeat_schedule_value & 32));
			$('#dialog-schedule-repeat-value-dow-64').prop('checked', (curSchedule.repeat_schedule_value & 64));
		} else {
			$('#dialog-schedule-repeat-value').val(curSchedule.repeat_schedule_value);
		}
		$('#dialog-schedule-repeat').trigger('change');
		$('#dialog-schedule-repeat-every').trigger('change');
	}
}

/**
 * Initialize properly the date input
 */
function setDateDisplay(curDate) {
	var hh = curDate.getHours();
	var mm = curDate.getMinutes();
	
	$('#dialog-schedule-date').val($.datepicker.formatDate('dd/mm/yy', curDate));
	$('#dialog-schedule-hh option[value='+hh+']').prop('selected', true);
	$('#dialog-schedule-mm option[value='+mm+']').prop('selected', true);
}

/**
 * Call the webservice to add or modify a schedule
 */
function okSchedule($dialog) {
	var postParams = {};
	var url = globalConfig.angharad_location;
	var isAdd = true;
	
	if ($dialog.find('#dialog-schedule-name').val() == '') {
		alert($.t('You must enter a name for the scheduled task'));
		return false;
	}
	
	if ($dialog.find('#dialog-schedule-id').val() != '') {
		url += '/SETSCHEDULE';
		postParams.id = $dialog.find('#dialog-schedule-id').val();
		isAdd = false;
		postParams.tags = angharad.schedules[postParams.id].tags.join(',');
	} else {
		url += '/ADDSCHEDULE';
		postParams.tags = angharad.schedules[postParams.id].device;
	}
	postParams.name = $dialog.find('#dialog-schedule-name').val();
	postParams.enabled = $dialog.find('#dialog-schedule-enabled').prop('checked')?'true':'false';
	postParams.script = $dialog.find('#dialog-schedule-script').val();
	postParams.device = '';
	
	var now = new Date();
	var nextTime = $.datepicker.parseDate('dd/mm/yy', $dialog.find('#dialog-schedule-date').val());
	nextTime.setHours($dialog.find('#dialog-schedule-hh').val());
	nextTime.setMinutes($dialog.find('#dialog-schedule-mm').val());
	if (nextTime.getTime() < now.getTime() && !$dialog.find('#dialog-schedule-repeat').prop('checked')) {
		alert($.t('The next run must be in the future'));
		return false;
	}
  
  if ($dialog.find('#dialog-schedule-repeat').prop('checked')) {
    var repeatEvery = $dialog.find('#dialog-schedule-repeat-every').val();
    var repeatValue = $dialog.find('#dialog-schedule-repeat-value').val();
    if ((repeatEvery == 0 || repeatEvery == 1 || repeatEvery == 2 || repeatEvery == 4 || repeatEvery == 5) &&
    (repeatValue =='' || isNaN(repeatValue) || repeatValue <= 0)
    ) {
      alert($.t('You must enter a positive numeric value for the repeat frequency'));
      return false;
    }
  }
	postParams.next_time = nextTime.getTime() / 1000;
	postParams.remove_after_done = $dialog.find('#dialog-schedule-remove-after-done').prop('checked')?1:0;
	
	if ($dialog.find('#dialog-schedule-repeat').prop('checked')) {
		postParams.repeat_schedule = $dialog.find('#dialog-schedule-repeat-every').val();
		if (postParams.repeat_schedule == 3) {
			postParams.repeat_schedule_value = 0;
			for (var i=1; i<128; i *= 2) {
				postParams.repeat_schedule_value += $dialog.find('#dialog-schedule-repeat-value-dow-'+i).prop('checked')?i:0;
			}
		} else {
			postParams.repeat_schedule_value = $dialog.find('#dialog-schedule-repeat-value').val();
		}
	} else {
		postParams.repeat_schedule = -1;
	}
	
	var response = sendPostRequest(url, postParams);
	
	if (response.result) {
		var oldScript = '';
		if (!isAdd) {
			oldScript = angharad.schedules[response.json.schedule.id].script;
		}
		angharad.schedules[response.json.schedule.id] = response.json.schedule;
		if (isAdd) {
			displayScheduleInGroup(angharad.schedules[response.json.schedule.id], tabScriptsSchedulesId, '-1', -1);
		} else {
			updateScheduleDisplay(angharad.schedules[response.json.schedule.id]);
			if (oldScript.id != angharad.schedules[response.json.schedule.id].script) {
				updateScriptHoverDisplay(oldScript);
			}
			updateScriptHoverDisplay(angharad.scripts[response.json.schedule.script]);
		}
	} else {
		logMessage(logTypeError, $.t('Error while saving scheduled task'));
	}
	
	$dialog.dialog( 'close' );
}

/**
 * Call the webservice to remove a schedule
 */
function deleteSchedule(scheduleId) {
	var url = globalConfig.angharad_location + '/DELETESCHEDULE/'+scheduleId;
	
	if (confirm($.t('Are you sure you want to delete this scheduled task ?'))) {
		var response = sendGetRequest(url);
		
		if (response.result) {
			var script = angharad.schedules[scheduleId].script;
			angharad.schedules.splice(scheduleId, 1);
			updateScriptHoverDisplay(script);
			$('#div-schedule-'+scheduleId).slideUp();
			$('#div-schedule-'+scheduleId).remove();
			logMessage(logTypeInfo, $.t('Scheduled task deleted succesfully'));
		} else {
			logMessage(logTypeError, $.t('Error deleting scheduled task'));
		}
	}
}

/**
 * Edit an existing action or create a new one
 */
function editAction($action) {
	var $dialog = $('#dialog-action');
	var title = $.t('Edit an action');
	if ($action == null) {
		title = $.t('Add an action');
	}
	
	initActionDialog($dialog, $action);
	$dialog.on('keypress', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if(code == 13) {
			okAction($dialog);
		}
	});
	
	$dialog.dialog({
		autoOpen: false,
		width: 500,
		modal: true,
		title: title,
		buttons: [{
			text:$.t('Ok'),
			click:function() {
				okAction($dialog);
			}
		}]
	});
	
	$dialog.dialog('open');
	
}

/**
 * Initialize the action dialog window
 */
function initActionDialog($dialog, $action) {
	var $devicesList = $dialog.find('#dialog-action-device');
	var $switchesList = $dialog.find('#dialog-action-switcher');
	var $dimmersList = $dialog.find('#dialog-action-dimmer');
	var $heatersList = $dialog.find('#dialog-action-heater');
	var $scriptsList = $dialog.find('#dialog-action-script');
	var $typeList = $dialog.find('#dialog-action-type');
	var $paramsSetSwitch = $dialog.find('#dialog-action-params-setswitcher');
	var $paramsValue = $dialog.find('#dialog-action-params-value');
	var $pParams = $dialog.find('#p-dialog-action-params');
	var $pParamsSetSwitch = $dialog.find('#p-dialog-action-params-setswitcher');
	var $pParamsSetDimmer = $dialog.find('#p-dialog-action-params-setdimmer');
	var $pParamsValue = $dialog.find('#p-dialog-action-params-value');
	
  $scriptsList.empty();
	for (var key in angharad.scripts) {
    var htmlOption = '<option value="'+angharad.scripts[key].id+'">'+angharad.scripts[key].name+'</option>';
    $scriptsList.append(htmlOption);
	}
	
	$typeList.change(function () {
		switch ($(this).val().toString()) {
			case "0":
				// SET_SWITCH
				$devicesList.prop('disabled', false);
				$switchesList.prop('disabled', false);
				$dimmersList.prop('disabled', true);
				$heatersList.prop('disabled', true);
        $scriptsList.prop('disabled', true);
				$pParams.slideUp();
				$pParamsSetSwitch.slideDown();
				$pParamsSetDimmer.slideUp();
				$pParamsValue.slideUp();
				break;
			case "1":
				// TOGGLE_SWITCH
				$devicesList.prop('disabled', false);
				$switchesList.prop('disabled', false);
				$dimmersList.prop('disabled', true);
				$heatersList.prop('disabled', true);
        $scriptsList.prop('disabled', true);
				$pParams.slideUp();
				$pParamsSetSwitch.slideUp();
				$pParamsSetDimmer.slideUp();
				$pParamsValue.slideUp();
				break;
			case "2":
				// DIMMER
				$devicesList.prop('disabled', false);
				$switchesList.prop('disabled', true);
				$dimmersList.prop('disabled', false);
				$heatersList.prop('disabled', true);
        $scriptsList.prop('disabled', true);
				$pParams.slideUp();
				$pParamsSetSwitch.slideUp();
				$pParamsSetDimmer.slideDown();
				$pParamsValue.slideDown();
				break;
			case "3":
				// HEATER
				$devicesList.prop('disabled', false);
				$switchesList.prop('disabled', true);
				$dimmersList.prop('disabled', true);
				$heatersList.prop('disabled', false);
        $scriptsList.prop('disabled', true);
				$pParams.slideUp();
        $paramsSetSwitch.find('option[value="0"]').text($.t('Off'));
        $paramsSetSwitch.find('option[value="1"]').text($.t('On'));
				$pParamsSetSwitch.slideDown();
				$pParamsSetDimmer.slideUp();
				$pParamsValue.slideDown();
				break;
			case "77":
				// SCRIPT
				$devicesList.prop('disabled', true);
				$switchesList.prop('disabled', true);
				$dimmersList.prop('disabled', true);
				$heatersList.prop('disabled', true);
        $scriptsList.prop('disabled', false);
				$pParams.slideUp();
				$pParamsSetSwitch.slideUp();
				$pParamsSetDimmer.slideUp();
				$pParamsValue.slideUp();
				break;
			case "88":
				// SLEEP
			case "99":
				// SYSTEM
				$devicesList.prop('disabled', true);
				$switchesList.prop('disabled', true);
				$dimmersList.prop('disabled', true);
				$heatersList.prop('disabled', true);
        $scriptsList.prop('disabled', true);
				$pParams.slideUp();
				$pParamsSetSwitch.slideUp();
				$pParamsSetDimmer.slideUp();
				$pParamsValue.slideDown();
				break;
			default:
				break;
		}
	});
	
	$devicesList.change(function() {
		
		$switchesList.empty();
		var switches = angharad.device[$(this).val()].switches;
		for (var i=0; i<switches.length; i++) {
			if (switches[i].enabled) {
				var htmlOption = '<option value="'+switches[i].name+'">'+switches[i].display+'</option>\n';
				$switchesList.append(htmlOption);
			}
		}
		
		$dimmersList.empty();
		var dimmers = angharad.device[$(this).val()].dimmers;
		for (var i=0; i<dimmers.length; i++) {
			var htmlOption = '<option value="'+dimmers[i].name+'">'+dimmers[i].display+'</option>\n';
			$dimmersList.append(htmlOption);
		}
		
		$heatersList.empty();
		var heaters = angharad.device[$(this).val()].heaters;
		for (var i=0; i<heaters.length; i++) {
			var htmlOption = '<option value="'+heaters[i].name+'">'+heaters[i].display+'</option>\n';
			$heatersList.append(htmlOption);
		}
	});
	
	$switchesList.change(function() {
		var switcherName = $(this).val();
		var switcher = null;
		for (var i=0; i<angharad.device[$devicesList.val()].switches.length; i++) {
			if (angharad.device[$devicesList.val()].switches[i].name == switcherName) {
				switcher = angharad.device[$devicesList.val()].switches[i];
			}
		}
		if (switcher.type == 0) {
			$paramsSetSwitch.find('option[value="0"]').text($.t('Off'));
			$paramsSetSwitch.find('option[value="1"]').text($.t('On'));
		} else if (switcher.type == 1) {
			$paramsSetSwitch.find('option[value="0"]').text($.t('On'));
			$paramsSetSwitch.find('option[value="1"]').text($.t('Off'));
		} else if (switcher.type == 2) {
			$paramsSetSwitch.find('option[value="0"]').text($.t('Left'));
			$paramsSetSwitch.find('option[value="1"]').text($.t('Right'));
		}
	});
	
	$typeList.trigger('change');
  
	$devicesList.trigger('change');

	if ($action != null) {
		var action = angharad.actions[$action.attr('data-an-name')];
		$('#dialog-action-id').val(action.id);
		$('#dialog-action-name').val(action.name);
		$typeList.find('option[value="'+action.type+'"]').prop('selected', true);
		$devicesList.find('option[value="'+action.device+'"]').prop('selected', true);
		$typeList.trigger('change');
		$devicesList.trigger('change');
		$switchesList.find('option[value="'+action.switcher+'"]').prop('selected', true);
		$switchesList.trigger('change');
		$dimmersList.find('option[value="'+action.dimmer+'"]').prop('selected', true);
		if (action.type == 0 || action.type == 1) { // SETSWITCH || TOGGLESWITCH
			if (action.params == "1") {
				$paramsSetSwitch.find('option[value="1"]').prop('selected', true);
			} else {
				$paramsSetSwitch.find('option[value="0"]').prop('selected', true);
			}
			$paramsValue.val('');
		} else if (action.type == 2) { // DIMMER
      $paramsValue.val(action.params);
		} else if (action.type == 3) { // HEATER
			var values = action.params.split(',');
			$paramsSetSwitch.find('option[value="'+values[0]+'"]').prop('selected', true);
			$paramsValue.val(values[1]);
		} else if (action.type == 77) {
			$scriptsList.find('option[value="'+action.params+'"]').prop('selected', true);
		} else if (action.type == 99 || action.type == 88) {
			$paramsSetSwitch.find('option[value="0"]').prop('selected', true);
			$paramsValue.val(action.params);
		} else {
			$paramsSetSwitch.find('option[value="0"]').prop('selected', true);
			$paramsValue.val('');
		}
	} else {
		$('#dialog-action-id').val('');
		$('#dialog-action-name').val('');
		$typeList.find('option[value="0"]').prop('selected', true);
		$devicesList.find('option[0]').prop('selected', true);
		$switchesList.find('option[0]').prop('selected', true);
		$dimmersList.find('option[0]').prop('selected', true);
		$paramsSetSwitch.find('option[value="0"]').prop('selected', true);
		$paramsValue.val('');
	}
}

/**
 * Save the action parameters
 */
function okAction($dialog) {
	var url = globalConfig.angharad_location;
	var isAdd = true;
	var params = {};
	var $paramsSetSwitch = $dialog.find('#dialog-action-params-setswitcher');
	var $paramsValue = $dialog.find('#dialog-action-params-value');
  var $paramsScript = $dialog.find('#dialog-action-script');
	
	if ($dialog.find('#dialog-action-id').val() == '') {
		// Add action
		url += '/ADDACTION';
	} else {
		// Edit action
		url += '/SETACTION';
		isAdd = false;
		params.id = $dialog.find('#dialog-action-id').val();
		params.tags = angharad.actions[params.id].tags.join(',');
	}
		
	params.name = $dialog.find('#dialog-action-name').val();
	params.type = $dialog.find('#dialog-action-type').val();
	params.device = $dialog.find('#dialog-action-device').val();
	params.switcher = $dialog.find('#dialog-action-switcher').val();
	params.dimmer = $dialog.find('#dialog-action-dimmer').val();
	params.heater = $dialog.find('#dialog-action-heater').val();
	
	if (params.name == '') {
		alert($.t('Enter action name'));
		return false;
	}
	if (params.type == 0) { // SETSWITCH
		params.params = $paramsSetSwitch.val();
	} else if (params.type == 2) { // DIMMER
		if ($paramsValue.val() == '' || isNaN($paramsValue.val()) || $paramsValue.val() < 0 || $paramsValue.val() > 99) {
			alert($.t('Dimmer value must be numeric between 0 and 99'));
			return false;
		}
		params.params = $paramsValue.val();
	} else if (params.type == 3) { // HEATER
		if ($paramsValue.val() == '' || isNaN($paramsValue.val())) {
			alert($.t('Heat value must be numeric'));
			return false;
		}
		params.params = $paramsSetSwitch.val()+','+$paramsValue.val();
	} else if (params.type == 77) { // SCRIPT
    params.params = $paramsScript.val();
	} else if (params.type == 88) { // SLEEP
		if ($paramsValue.val() == '') {
			alert($.t('Duration must be in milliseconds'));
			return false;
		}
		params.params = $paramsValue.val();
	} else if (params.type == 99) { // SYSTEM
		if ($paramsValue.val() == '') {
			alert($.t('You must enter a server command'));
			return false;
		}
		params.params = $paramsValue.val();
	}
	
	var response = sendPostRequest(url, params);
	
	if (response.result) {
		var action = response.json.action;
		angharad.actions[action.id] = action;
		
		if (isAdd) {
			displayActionInGroup(action, tabScriptsSchedulesId, '-1', -1);
		} else {
			$('#label-action-'+action.id).text(action.name);
		}
	} else {
		logMessage(logTypeError, $.t('Error while saving action'));
	}
	
	$dialog.dialog( 'close' );
}

/**
 * Delete the specified action
 */
function deleteAction($action) {
	var actionId = $action.attr('data-an-name');
	var url = globalConfig.angharad_location + '/DELETEACTION/'+actionId;
	
	if (confirm($.t('Are you sure you want to delete this action ?'))) {
		var response = sendGetRequest(url);
		
		if (response.result) {
			angharad.actions.splice(actionId, 1);
			$('#div-action-'+actionId).slideUp();
			$('#div-action-'+actionId).remove();
			logMessage(logTypeInfo, $.t('Action removed succesfully'));
		} else {
			logMessage(logTypeError, $.t('Error removing action'));
		}
	}
}

/**
 * Refresh all angharad devices, scripts, schedules and actions
 */
function refreshAngharad(force) {
	if (angharad.ready) {
		// Refresh all devices
		var url = globalConfig.angharad_location;
    if (force) {
      url += '/REFRESH/';
    } else {
      url += '/OVERVIEW/';
    }
		for (device in angharad.devices) {
			var response = sendGetRequest(url + device);
			if (response.result) {
        angharad.device[response.json.device.name] = response.json.device;
				refreshDevice(response.json.device.name);
			} else {
				logMessage(logTypeError, $.t('Unable to refresh information for device ')+device);
			}
		}
		
		url = globalConfig.angharad_location + '/ACTIONS/';
		var response = sendGetRequest(url);
		if (response.result) {
			refreshActions(response.json.actions);
		} else {
			logMessage(logTypeError, $.t('Unable to refresh information for actions'));
		}
		
		url = globalConfig.angharad_location + '/SCRIPTS/';
		var response = sendGetRequest(url);
		if (response.result) {
			refreshScripts(response.json.scripts);
		} else {
			logMessage(logTypeError, $.t('Unable to refresh information for scripts'));
		}
		
		url = globalConfig.angharad_location + '/SCHEDULES/';
		var response = sendGetRequest(url);
		if (response.result) {
			refreshSchedules(response.json.schedules);
		} else {
			logMessage(logTypeError, $.t('Unable to refresh information for schedules'));
		}
	}
}

/**
 * Refresh a device
 */
function refreshDevice(device) {
	// Refresh switches, dimmers, heaters and sensors
	if (angharad.device[device].switches != undefined) {
		for (sw in angharad.device[device].switches) {
			var curSwitch = angharad.device[device].switches[sw];
			updateAllSwitch(device, curSwitch.name, curSwitch.status);
		}
	}

	if (angharad.device[device].dimmers != undefined) {
		for (di in angharad.device[device].dimmers) {
			var curDimmer = angharad.device[device].dimmers[di];
			updateAllDimmers(device, curDimmer.name, curDimmer.value);
		}
	}

	if (angharad.device[device].heaters != undefined) {
		for (he in angharad.device[device].heaters) {
			var curHeater = angharad.device[device].heaters[he];
			updateAllHeaters(device, curHeater.name, curHeater.set, curHeater.max_value, curHeater.unit);
		}
	}

	if (angharad.device[device].sensors != undefined) {
		for (se in angharad.device[device].sensors) {
			var curSensor = angharad.device[device].sensors[se];
			updateAllSensor(device, curSensor.name, curSensor.value, curSensor.unit);
		}
	}
}

/**
 * Refresh all actions
 */
function refreshActions(actions) {
  // Loop first in old actions to see if some are removed in the new list
  for (old_id in angharad.actions) {
    var found = false;
    for (new_ac in actions) {
      if (actions[new_ac].id == old_id) {
        found = true;
      }
    }
    if (!found) {
      $('#div-action-'+old_id).remove();
    }
  }
  
  // Then insert the new actions
  for (new_ac in actions) {
    if (angharad.actions[actions[new_ac].id] == undefined) {
      displayActionInGroup(actions[new_ac], tabScriptsSchedulesId, '-1', -1);
    }
  }
  
  // Finally, replace action list
  angharad.actions = [];
  for (new_ac in actions) {
    angharad.actions[actions[new_ac].id] = actions[new_ac];
  }
}

/**
 * Refresh all scripts
 */
function refreshScripts(scripts) {
  // Loop first in old scripts to see if some are removed in the new list
  for (old_id in angharad.scripts) {
    var found = false;
    for (new_sc in scripts) {
      if (scripts[new_sc].id == old_id) {
        found = true;
      }
    }
    if (!found) {
      $('.group-script-'+old_id).each(function() {
        $(this).remove();
      });
    }
  }
  
  // Then insert the new scripts
  for (new_sc in scripts) {
    var curScript = scripts[new_sc];
    for (tag in curScript.tags) {
      if (curScript.tags[tag].indexOf(globalConfig.tags_prefix + '#' + getCurrentProfile().id + '#') == 0) {
        if (tabContent[curScript.tags[tag].split('#')[2]] != undefined && tabContent[curScript.tags[tag].split('#')[2]][curScript.tags[tag].split('#')[3]] != undefined) {
          var inGroup = false;
          for (elt in tabContent[curScript.tags[tag].split('#')[2]][curScript.tags[tag].split('#')[3]]) {
            if (tabContent[curScript.tags[tag].split('#')[2]][curScript.tags[tag].split('#')[3]][elt].type == 'script' && tabContent[curScript.tags[tag].split('#')[2]][curScript.tags[tag].split('#')[3]][elt].id == curScript.id) {
              inGroup = true;
            }
          }
          if (!inGroup) {
            displayScriptInGroup(curScript, curScript.tags[tag].split('#')[2], curScript.tags[tag].split('#')[3], parseInt(curScript.tags[tag].split('#')[4]));
          }
        }
      }
    }
    if (angharad.scripts[scripts[new_sc].id] == undefined) {
      displayScriptInGroup(scripts[new_sc], tabScriptsSchedulesId, '-1', -1);
    }
  }
  
  // Finally, replace action list
  angharad.scripts = [];
  for (new_sc in scripts) {
    angharad.scripts[scripts[new_sc].id] = scripts[new_sc];
  }
}

/**
 * Refresh all schedules
 */
function refreshSchedules(schedules) {
  // Loop first in old schedules to see if some are removed in the new list
  for (old_id in angharad.schedules) {
    var found = false;
    for (new_sh in schedules) {
      if (schedules[new_sh].id == old_id) {
        found = true;
      }
    }
    if (!found) {
      $('#div-action-'+old_id).remove();
    }
  }
  
  // Then insert the new schedules
  for (new_sh in schedules) {
    if (angharad.schedules[schedules[new_sh].id] == undefined) {
      displayScheduleInGroup(schedules[new_sh], tabScriptsSchedulesId, '-1', -1);
    }
  }
  
  // Finally, replace action list
  angharad.schedules = [];
  for (new_sh in schedules) {
    angharad.schedules[schedules[new_sh].id] = schedules[new_sh];
  }
}

/**
 * Open a dialog window and display the monitor graph of the selected element
 */
function monitorElement($button) {
  var type = $button.attr('data-an-type');
	var device = $button.attr('data-an-device');
	var name = $button.attr('data-an-name');
	var unit = encodeURIComponent($button.attr('data-an-unit'));
	var startDate = '';
	var title = '';
  var elementsUrl = '';
  var switcher = '', dimmer = '', heater = '', sensor = '';

	if (type != 'sensor') {
		sensor = '';
	} else {
    sensor = name;
		sensors = angharad.device[device].sensors;
		for (var i=0; i<sensors.length; i++) {
			if (name == sensors[i].name) {
				title = sensors[i].display;
			}
		}
  }
  
	if (type != 'switch') {
		switcher = '';
	} else {
    switcher = name;
		switches = angharad.device[device].switches;
		for (var i=0; i<switches.length; i++) {
			if (name == switches[i].name) {
				title = switches[i].display;
			}
		}
	}
  
	if (type != 'dimmer') {
		dimmer = '';
	} else {
    dimmer = name;
		dimmers = angharad.device[device].dimmers;
		for (var i=0; i<dimmers.length; i++) {
			if (name == dimmers[i].name) {
				title = dimmers[i].display;
			}
		}
	}
  
	if (type != 'heater') {
		heater = '';
	} else {
    heater = name;
		heaters = angharad.device[device].heaters;
		for (var i=0; i<heaters.length; i++) {
			if (name == heaters[i].name) {
				title = heaters[i].display;
			}
		}
	}
	
	var curDate = new Date();
	var $dialog = $('#dialog-monitor');
	$dialog.find('#dialog-monitor-since').find('option[value="4"]').prop('selected', true);
	
	var iframe = '<iframe border="0" src="graph.html?device='+device+'&switcher='+switcher+'&sensor='+sensor+'&dimmer='+dimmer+'&heater='+heater+'&startDate='+startDate+'&unit='+unit+'" width="430px" height="350px"></iframe>';
	$dialog.find('#dialog-chart').html(iframe);
	
	$dialog.dialog({
		autoOpen: false,
		width: 460,
		height: 575,
		modal: true,
		title: title,
		buttons: [{
		text:$.t('Close'),
			open:function() {
				var $select = $dialog.find('#dialog-monitor-since');
				$select.unbind();
				$select.change(function() {
					switch ($select.val()) {
						case '0':
							// Last hour
							startDate = parseInt((new Date(curDate.getTime() - (1000*60*60))).getTime()/1000);
							break;
						case '1':
							// Last 2 hours
							startDate = parseInt((new Date(curDate.getTime() - (2*1000*60*60))).getTime()/1000);
							break;
						case '2':
							// Last 6 hours
							startDate = parseInt((new Date(curDate.getTime() - (6*1000*60*60))).getTime()/1000);
							break;
						case '3':
							// Last 12 hours
							startDate = parseInt((new Date(curDate.getTime() - (12*1000*60*60))).getTime()/1000);
							break;
						case '4':
							// Last day
							startDate = parseInt((new Date(curDate.getTime() - (24*1000*60*60))).getTime()/1000);
							break;
						case '5':
							// Last 2 days
							startDate = parseInt((new Date(curDate.getTime() - (48*1000*60*60))).getTime()/1000);
							break;
						case '6':
							// Last 3 days
							startDate = parseInt((new Date(curDate.getTime() - (72*1000*60*60))).getTime()/1000);
							break;
						case '7':
							// Last week
							startDate = parseInt((new Date(curDate.getTime() - (168*1000*60*60))).getTime()/1000);
							break;
						case '8':
							// Last month
							startDate = parseInt((new Date(curDate.getTime() - (720*1000*60*60))).getTime()/1000);
							break;
						default:
							break;
					}
					
					var iframe = '<iframe border="0" src="graph.html?device='+device+'&switcher='+switcher+'&sensor='+sensor+'&dimmer='+dimmer+'&heater='+heater+'&startDate='+startDate+'&unit='+unit+'" width="430px" height="350px"></iframe>';
					$dialog.find('#dialog-chart').html(iframe);
					
				});
			},
			click:function() {
				$( this ).dialog( 'close' );
			}
		}]
	});

	$dialog.dialog('open');
}
