/**
 * Logres
 * Angharad web interface
 * Copyright 2015 Nicolas Mora mail@babelouest.org
 * Licenced under AGPL
 */
var globalConfig = {};
var tabDashboardId				= 0;
var tabSwitchesDimmersId	= 1;
var tabHeatersId					= 2;
var tabSensorsId					= 3;
var tabCamerasId					= 4;
var tabMusicId						= 5;
var tabScriptsSchedulesId	= 6;
var tabMonitorsId					= 7;
var tabPreferencesId			= 8;

var moveUp   = -1;
var moveDown = 1;

var logTypeInfo  = 0;
var logTypeWarn  = 1;
var logTypeError = 2;
var logManager = {};

var tabContent = [];
tabContent[tabDashboardId] = [];
tabContent[tabSwitchesDimmersId] = [];
tabContent[tabHeatersId] = [];
tabContent[tabSensorsId] = [];
tabContent[tabCamerasId] = [];
tabContent[tabMusicId] = [];
tabContent[tabScriptsSchedulesId] = [];
tabContent[tabMonitorsId] = [];

var tabGroupTemplate = '<div id="div-group-%TAB%-%GROUP%">\n\
	<input type="button" class="admin-button admin-group" value="+" name="admin-group-%TAB%-%GROUP%" id="admin-group-%TAB%-%GROUP%" data-an-type="group" data-an-tab="%TAB%" data-an-group="%GROUP%"/>\n\
	<label id="container-%TAB%-%GROUP%-label">%DISPLAY%</label>\n\
	<div id="containers-%TAB%-%GROUP%" class="block">\n\
		<div id="container-%TAB%-%GROUP%" class="div-container-inside" data-an-nb-elements="0"></div>\n\
	</div>\n\
</div>\n';

var logMessageTemplate = '<div class="log-message">\n\
  <span class="log-message-timestamp %CLASS%">%TIMESTAMP%</span>\n\
  <span class="log-message-text %CLASS%">%MESSAGE%</span>\n\
</div>';
/**
 * Entry point
 */
$(document).ready(function() {
	
	initConfig();
	
	initEvents();
	
	gatherInformations();
	
	initDashboardTab();

	initSwitchesTab();

	initHeatersTab();

	initSensorsTab();
	
	initCameraTab();
	
	initMusicTab();
	
	initScriptsTab();
	
	initMonitorTab()

	initParametersTab();
	
	// Translate application
	$(':root').i18n();
	
	/*$('*[data-i18n]').each(function() {
		if ($(this).is('input')) {
			$(this).attr('value', $.t($(this).attr('value')));
		}
	});*/

	// When everything is loaded, run refresh every 5 minutes
	setInterval(function() {
		refresh(false);
	}, 5*60*1000);
	
});

/**
 * Initialize configuration
 * global configuration
 * i18n
 */
function initConfig() {
	$.ajax({
			async: false,
			type: 'GET',
			url: 'config/config.json',
			success: function(data) {
					globalConfig = data;
			},
			fail: function() {
			}
	});

	$.i18n.init({fallbackLng:'en'}).done(function() {
		/* Context menus */			
		$.contextMenu({
			selector: '.admin-modify-no-dashboard',
			trigger: 'left',
			callback: function (key, options) {
				if (key == 'graph') {
					monitorElement($(this));
				} else if (key == 'edit') {
					if ($(this).attr('name').indexOf('admin-sensor-') == 0) {
						editSensor($(this));
					} else if ($(this).attr('name').indexOf('admin-switch-') == 0) {
						editSwitch($(this));
					} else if ($(this).attr('name').indexOf('admin-dimmer-') == 0) {
						editDimmer($(this));
					} else if ($(this).attr('name').indexOf('admin-heater-') == 0) {
						editHeater($(this));
					}
				} else if (key == 'add') {
					addToTab($(this), tabDashboardId);
				} else if (key == 'remove') {
					removeFromGroup($(this));
				} else if (key == 'moveUp') {
					moveInGroup($(this), moveUp);
				} else if (key == 'moveDown') {
					moveInGroup($(this), moveDown);
				} else if (key == 'moveGroupUp') {
					moveToGroup($(this), moveUp);
				} else if (key == 'moveGroupDown') {
					moveToGroup($(this), moveDown);
				}
			},
			items: {
				'edit': {name: $.t('Edit'), icon: 'edit'},
				'add': {name: $.t('Add to dashboard'), icon: 'add'},
				'graph': {name: $.t('Graph'), icon: 'graph'},
				'remove': {name: $.t('Remove from this group'), icon: 'delete'},
				'moveUp': {name: $.t('Move up'), icon: 'moveUp'},
				'moveDown': {name: $.t('Move down'), icon: 'moveDown'},
				'moveGroupUp': {name: $.t('Move to group up'), icon: 'moveGroupUp'},
				'moveGroupDown': {name: $.t('Move to group below'), icon: 'moveGroupDown'},
			}
		});

		$.contextMenu({
			selector: '.admin-modify-dashboard',
			trigger: 'left',
			callback: function (key, options) {
				if (key == 'graph') {
					monitorElement($(this));
				} else if (key == 'edit') {
					if ($(this).attr('name').indexOf('admin-sensor-') == 0) {
						editSensor($(this));
					} else if ($(this).attr('name').indexOf('admin-switch-') == 0) {
						editSwitch($(this));
					} else if ($(this).attr('name').indexOf('admin-dimmer-') == 0) {
						editDimmer($(this));
					} else if ($(this).attr('name').indexOf('admin-heater-') == 0) {
						editHeater($(this));
					}
				} else if (key == 'remove') {
					removeFromGroup($(this));
				} else if (key == 'moveUp') {
					moveInGroup($(this), moveUp);
				} else if (key == 'moveDown') {
					moveInGroup($(this), moveDown);
				} else if (key == 'moveGroupUp') {
					moveToGroup($(this), moveUp);
				} else if (key == 'moveGroupDown') {
					moveToGroup($(this), moveDown);
				}
			},
			items: {
				'edit': {name: $.t('Edit'), icon: 'edit'},
				'graph': {name: $.t('Graph'), icon: 'graph'},
				'remove': {name: $.t('Remove from the dashboard'), icon: 'delete'},
				'moveUp': {name: $.t('Move up'), icon: 'moveUp'},
				'moveDown': {name: $.t('Move down'), icon: 'moveDown'},
				'moveGroupUp': {name: $.t('Move to group up'), icon: 'moveGroupUp'},
				'moveGroupDown': {name: $.t('Move to group below'), icon: 'moveGroupDown'},
			}
		});
		
		$.contextMenu({
			selector: '.admin-modify-delete-no-dashboard',
			trigger: 'left',
			callback: function (key, options) {
				if (key == 'edit') {
					if ($(this).attr('data-an-type') == 'action') {
						editAction($(this));
					} else if ($(this).attr('data-an-type') == 'script') {
						editScript($(this));
					}
				} else if (key == 'delete') {
					if ($(this).attr('data-an-type') == 'action') {
						deleteAction($(this));
					} else if ($(this).attr('data-an-type') == 'script') {
						deleteScript($(this));
					}
				} else if (key == 'addTab0') {
					addToTab($(this), tabDashboardId);
				} else if (key == 'addTab1') {
					addToTab($(this), tabSwitchesDimmersId);
				} else if (key == 'addTab2') {
					addToTab($(this), tabHeatersId);
				} else if (key == 'addTab3') {
					addToTab($(this), tabSensorsId);
				} else if (key == 'addTab4') {
					addToTab($(this), tabCamerasId);
				} else if (key == 'addTab5') {
					addToTab($(this), tabMusicId);
				}
			},
			items: {
				'edit': {name: $.t('Edit'), icon: 'edit'},
				'delete': {name: $.t('Delete'), icon: 'delete'},
				'addTab': {
					name: $.t('Add to another tab'), 
					icon: 'add',
					items: {
						'addTab0': {name: $.t('Dashboard') },
						'addTab1': {name: $.t('Lights and switches') },
						'addTab2': {name: $.t('Heaters') },
						'addTab3': {name: $.t('Sensors') },
						'addTab4': {name: $.t('Cameras') },
						'addTab5': {name: $.t('Music') },
					}
				},
			}
		});

		$.contextMenu({
			selector: '.admin-modify-delete-dashboard',
			trigger: 'left',
			callback: function (key, options) {
				if (key == 'edit') {
					if ($(this).attr('data-an-type') == 'action') {
						editAction($(this));
					} else if ($(this).attr('data-an-type') == 'script') {
						editScript($(this));
					}
				} else if (key == 'delete') {
					if ($(this).attr('data-an-type') == 'action') {
						deleteAction($(this));
					} else if ($(this).attr('data-an-type') == 'script') {
						deleteScript($(this));
					}
				} else if (key == 'removeDashboard') {
					removeFromGroup($(this));
				} else if (key == 'moveUp') {
					moveInGroup($(this), moveUp);
				} else if (key == 'moveDown') {
					moveInGroup($(this), moveDown);
				} else if (key == 'moveGroupUp') {
					moveToGroup($(this), moveUp);
				} else if (key == 'moveGroupDown') {
					moveToGroup($(this), moveDown);
				}
			},
			items: {
				'edit': {name: $.t('Edit'), icon: 'edit'},
				'delete': {name: $.t('Delete'), icon: 'delete'},
				'removeDashboard': {name: $.t('Remove from the Dashboard'), icon: 'delete'},
				'moveUp': {name: $.t('Move up'), icon: 'moveUp'},
				'moveDown': {name: $.t('Move below'), icon: 'moveDown'},
				'moveGroupUp': {name: $.t('Move to group up'), icon: 'moveGroupUp'},
				'moveGroupDown': {name: $.t('Move to group below'), icon: 'moveGroupDown'},
			}
		});
		
		$.contextMenu({
			selector: '.admin-modify-delete',
			trigger: 'left',
			callback: function (key, options) {
				if (key == 'edit') {
					if ($(this).attr('data-an-type') == 'action') {
						editAction($(this));
					} else if ($(this).attr('data-an-type') == 'schedule') {
						editSchedule($(this).attr('data-an-name'));
					}
				} else if (key == 'delete') {
					if ($(this).attr('data-an-type') == 'action') {
						deleteAction($(this));
					} else if ($(this).attr('data-an-type') == 'schedule') {
						deleteSchedule($(this).attr('data-an-name'));
					}
				}
			},
			items: {
				'edit': {name: $.t('Edit'), icon: 'edit'},
				'delete': {name: $.t('Delete'), icon: 'delete'},
			}
		});
		
		$.contextMenu({
			selector: '.admin-group',
			trigger: 'left',
			callback: function (key, options) {
				if (key == 'edit') {
					editGroupDialog($(this).attr('data-an-tab'), $(this).attr('data-an-group'));
				} else if (key == 'delete') {
					deleteGroup($(this).attr('data-an-tab'), $(this).attr('data-an-group'));
				}
			},
			items: {
				'edit': {name: $.t('Edit group'), icon: 'edit'},
				'delete': {name: $.t('Delete group'), icon: 'delete'},
			}
		});
	});
  
  $('#admin-profile-new').val('');
	globalConfig.currentTab = tabDashboardId;
	logManager.ready = true;
	logManager.messages = [];
}

/**
 * Initialize display
 * - Tabs
 * - Localisation
 * - Context menu
 */
function initEvents() {
	$('#logres-sidemenu a').on('click', function(e){
		e.preventDefault();

		if(!$(this).hasClass('open')) {
			var oldTab = $('#logres-sidemenu a.open').attr('href');
			var newTab = $(this).attr('href');
			var curTab = parseInt($(this).attr('data-an-tab'));
			
			$(oldTab).fadeOut('fast', function() {
				$(newTab).fadeIn('fast', function() {
					loadTab(curTab);
				}).removeClass('hidden');
				$(oldTab).addClass('hidden');
			});
			
			$('#logres-sidemenu a').removeClass('open');
			$(this).addClass('open');
			
			globalConfig.currentTab = curTab;
		}
	});
	
	/* Administrator mode switch */
	$('#admin-toggle').change(function() {
		var profile = getCurrentProfile();
		if (profile.options.adminMode == undefined) {
			profile.options.adminMode = false;
		}
		$('.admin-button').slideToggle();
		$('.div-hidden').slideToggle();
		profile.options.adminMode = !profile.options.adminMode;
		updateProfile(profile);
	});
  
  /* New profile */
  $input = $('#admin-profile-new');
  
  $input.bind("enterKey",function(e) {
    $label = $('#admin-profile-new-result');
    var response = addProfile($(this).val());
    if (response.result) {
      var message = $.t('Profile')+' '+$(this).val()+' '+$.t('created');
			$('#admin-profiles-list').append($('<option>', {
				value:response.json.profile.id,
				text:response.json.profile.display,
				selected:false
			}));
      $(this).val('');
    } else {
      var message = $.t('Error adding profile');
    }
    
    $label.text(message);
    $label.fadeIn().removeClass('hidden');
    setTimeout(function() {
      $label.fadeOut('fast', function() {
        $label.addClass('hidden');
        $label.text('');
      });
    }, 10*1000);
  });
  
  $input.keyup(function(e) {
    if(e.keyCode == 13) {
      $(this).trigger("enterKey");
    }
  });
  
  /* Change current profile name */
  $input = $('#admin-rename-profile');
  
  $input.bind("enterKey", function(e) {
    $label = $('#admin-rename-profile-display');
		var profile = getCurrentProfile();
		profile.display = $(this).val();
    if (updateProfile(profile)) {
      var message = $.t('Profile')+' '+$(this).val()+' '+$.t('renamed');
			$('#admin-profiles-list').find('option').each(function() {
				if ($(this).val() == profile.id) {
					$(this).text(profile.display);
				}
			});
			$('#admin-cur-profile-display').text(profile.display);
			$('#dashboard-title').text(profile.display);
    } else {
      var message = $.t('Error renamimg profile');
    }
    
    $label.text(message);
    $label.fadeIn().removeClass('hidden');
    setTimeout(function() {
      $label.fadeOut('fast', function() {
        $label.addClass('hidden');
        $label.text('');
      });
    }, 10*1000);
  });
  
  $input.keyup(function(e) {
    if(e.keyCode == 13) {
      $(this).trigger("enterKey");
    }
  });
  
  /* Remove current profile */
  
  $button = $('#admin-profile-remove');
  
  $button.click(function () {
		removeCurrentProfile();
  });
  
  /* Set current profile as default */
  $('#admin-default-profile').change(function() {
    if ($(this).prop('checked')) {
      var url = globalConfig.carleon_location + carleon.apps.profiles.url;
			var profile = getCurrentProfile();
			
      profile.default = 1;
      response = sendPostRequest(url, {action:'modifyprofile', profile:JSON.stringify(profile)});
      logMessage(logTypeInfo, $.t('Current profile set to default'));

      if (!response.result) {
        $(this).prop('checked', false);
      }
    }
  });
  
  /* New group */
	
	$('.new-group').click(function () {
		newGroupDialog($(this).attr('data-an-tab'));
	});
	
	/* Refresh button */
	$('#admin-refresh').click(function() {
		refresh(true);
	});
	
	/* Language */
	$('#admin-lang-select option[value="'+$.i18n.options.lng+'"]').prop('selected', true);
	
	$('#admin-lang-select').change(function() {
		window.location = window.location.pathname + '?setLng=' + $(this).val();
	});
}

/**
 * Get all overviews from angharad server and carleon environment
 */
function gatherInformations() {
	gatherAngharadInformations();
	
	gatherCarleonInformations();
}

/**
 * Load the specified tab
 */
function loadTab(tabId) {
	switch (tabId) {
		case tabMonitorsId:
			loadMonitorTab();
			break;
		default:
			break;
	}
}

/**
 * Return JSON result from a REST webservice in sync mode using a HTTP GET, so no data is returned until function is complete
 */
function sendGetRequest(url) {
	var toReturn = { url: url };
  $.ajax({
    async: false,
    type: 'GET',
    url: url,
    success: function(data) {
      try {
        var jsonResult = $.parseJSON(data);
        if (jsonResult.result !== undefined && jsonResult.result == 'ok') {
          toReturn.result = true;
        } else {
          toReturn.result = false;
          toReturn.reason = 'error';
        }
        toReturn.json = jsonResult;
      } catch (err) {
        toReturn.result = false;
        toReturn.reason = 'json_error';
        toReturn.json = {};
        toReturn.error = err;
        toReturn.data = data;
      }
    },
    fail: function() {
      toReturn.result = false;
      toReturn.json = {};
      toReturn.reason = 'network_error';
    }
  });
	return toReturn;
}

/**
 * Return JSON result from a REST webservice in sync mode using a HTTP POST, so no data is returned until function is complete
 */
function sendPostRequest(url, data) {
	var toReturn = { url: url };
  $.ajax({
    async: false,
    type: 'POST',
    url: url,
    data: data,
    success: function(data) {
      try {
        var jsonResult = $.parseJSON(data);
        if (jsonResult.result !== undefined && jsonResult.result == 'ok') {
          toReturn.result = true;
        } else {
          toReturn.result = false;
          toReturn.reason = 'error';
        }
        toReturn.json = jsonResult;
      } catch (err) {
        toReturn.result = false;
        toReturn.reason = 'json_error';
        toReturn.json = {};
        toReturn.error = err;
        toReturn.data = data;
      }
    },
    fail: function() {
      toReturn.result = false;
      toReturn.json = {};
      toReturn.reason = 'network_error';
    }
  });
	return toReturn;
}

/**
 * Add the selected element to the dashboard
 */
function addToTab($element, tab) {
  var groups = getGroupList(tab);
  var groupId = undefined;

  // Look for the first group in the dashboard
  // If there is no group in the dashboard, we add one called 'Dashboard'
  if (groups.length == 0) {
    var newGroup = addGroup(tab, $.t('Dashboard'));
    if (newGroup) {
      addGroupToTab(tab, newGroup.id, newGroup.display);
      groupId = newGroup.id;
    }
  } else {
    groupId = groups[0].id;
  }
	var position = $('#container-'+tab+'-'+groupId).attr('data-an-nb-elements');

	if ($element.attr('data-an-type') === 'switch') {
		addSwitchToGroup($element.attr('data-an-device'), $element.attr('data-an-name'), tab, groupId, position);
	} else if ($element.attr('data-an-type') === 'dimmer') {
		addDimmerToGroup($element.attr('data-an-device'), $element.attr('data-an-name'), tab, groupId, position);
	} else if ($element.attr('data-an-type') === 'heater') {
		addHeaterToGroup($element.attr('data-an-device'), $element.attr('data-an-name'), tab, groupId, position);
	} else if ($element.attr('data-an-type') === 'sensor') {
		addSensorToGroup($element.attr('data-an-device'), $element.attr('data-an-name'), tab, groupId, position);
	} else if ($element.attr('data-an-type') === 'script') {
		addScriptToGroup($element.attr('data-an-name'), tab, groupId, position);
	} else if ($element.attr('data-an-type') === 'camera') {
		addCameraToGroup($element.attr('data-an-name'), tab, groupId, position);
	} else if ($element.attr('data-an-type') === 'mpc') {
		addMpcToGroup($element.attr('data-an-name'), tab, groupId, position);
	} else if ($element.attr('data-an-type') === 'radio') {
		addRadioToGroup($element.attr('data-an-name'), tab, groupId, position);
	}
	logMessage(logTypeInfo, $.t('Add this element to dashboard'));
}

/**
 * Remove the selected element from dashboard
 */
function removeFromDashboard($element) {
	if ($element.attr('data-an-type') === 'switch') {
		removeSwitchFromDashboard($element.attr('data-an-device'), $element.attr('data-an-name'));
	} else if ($element.attr('data-an-type') === 'dimmer') {
		removeDimmerFromDashboard($element.attr('data-an-device'), $element.attr('data-an-name'));
	} else if ($element.attr('data-an-type') === 'heater') {
		removeHeaterFromDashboard($element.attr('data-an-device'), $element.attr('data-an-name'));
	} else if ($element.attr('data-an-type') === 'sensor') {
		removeSensorFromDashboard($element.attr('data-an-device'), $element.attr('data-an-name'));
	}
}

/**
 * Return the current profile id
 */
function getCurrentProfile() {
	return globalConfig.profile;
}

/**
 * Add a profile
 */
function addProfile(name) {
  var url = globalConfig.carleon_location + carleon.apps.profiles.url;
  return sendPostRequest(url, {action:'addprofile', profile:name});
}

/**
 * Remove current profile
 */
function removeCurrentProfile() {
	var url = globalConfig.carleon_location + carleon.apps.profiles.url;
	
	var response = sendPostRequest(url, {action:'removeprofile', profile:globalConfig.profile.id});
	
	if (response.result) {
		location.reload();
	} else {
		var $label = $('#admin-profile-remove-label');
		$label.text($.t('Error while removing current profile'));
		$label.removeClass('hidden');
    setTimeout(function() {
      $label.fadeOut('fast', function() {
        $label.addClass('hidden');
        $label.text('');
      });
    }, 10*1000);
	}
}

/**
 * Change the current profile with the new data
 */
function updateProfile(profile) {
	var url = globalConfig.carleon_location + carleon.apps.profiles.url;
  var response = sendPostRequest(url, {action:'modifyprofile', profile:JSON.stringify(profile)});
	if (response.result) {
		globalConfig.profile = response.json.profile;
		return true;
	} else {
		return false;
	}
}

/**
 * Add a group to the specified tab for the current profile
 */
function addGroup(tab, groupName) {
  var tabFound = false;
	var profile = getCurrentProfile();
	var newGroup = {};
  for (key in profile.tabs) {
    if (profile.tabs[key].id == tab) {
      tabFound = true;
      var lastId = 0;
      for (keyg in profile.tabs[key].groups) {
        if (profile.tabs[key].groups[keyg].id > lastId) {
          lastId = profile.tabs[key].groups[keyg].id;
        }
      }
			newGroup = {id:lastId+1, display:groupName};
      profile.tabs[key].groups.push(newGroup);
    }
  }
  if (!tabFound) {
		newGroup = {id:0, display:groupName};
    profile.tabs.push({id:tab, groups:[ newGroup ] });
  }
	tabContent[tab][newGroup.id] = [];
  if (updateProfile(profile)) {
		return newGroup;
	} else {
		return false;
	}
}

/**
 * Edit a group name and updates the profile
 */
function editGroup(tab, groupId, groupName) {
	var profile = getCurrentProfile();
  for (key in profile.tabs) {
    if (profile.tabs[key].id == tab) {
      for (keyg in profile.tabs[key].groups) {
        if (profile.tabs[key].groups[keyg].id == groupId) {
          profile.tabs[key].groups[keyg].display = groupName;
        }
      }
    }
  }
  if (updateProfile(profile)) {
		return true;
	} else {
		return false;
	}
}

/**
 * Add the specified group with its id to the specified tab
 */
function addGroupToTab(tab, groupId, groupName) {
	var groupTemplate = tabGroupTemplate.replace(/%TAB%/g, tab).replace(/%GROUP%/g, groupId).replace(/%DISPLAY%/g, groupName);
	
	$('.tab-'+tab).each(function() {
		$(this).append(groupTemplate);
	});
	
	var $label = $('#container-'+tab+'-'+groupId+'-label');
	var $container = $('#container-'+tab+'-'+groupId);
	
	if (getCurrentProfile().options.adminMode == true) {
		$('#admin-group-'+tab+'-'+groupId).show();
	}
	
	$container.addClass('hidden');
	$container.slideDown().fadeIn('slow');
	$('#dashboard-no-element-label').hide();
}

/**
 * Change the group name in the tab
 */
function editGroupInTab(tab, groupId, groupName) {
	$('#container-'+tab+'-'+groupId+'-label').text(groupName);
}

/**
 * Return the list of groups available in the specified tab for the specified profile
 */
function getGroupList(tabId) {
	var profile = getCurrentProfile();
	for (key in profile.tabs) {
		if (profile.tabs[key].id == tabId) {
			return profile.tabs[key].groups;
		}
	}
	return [];
}

/**
 * Display the message in the selected tab for duration seconds, then hides the message
 */
function logMessage(type, message) {
	logManager.messages.push({type:type, message:message});
	var $popup = $('#top-popup');
	var $label = $('<label></label>');
  var curDate = (new Date()).toLocaleString();
  var logMessageClass = 'log-message-info';
	switch(type) {
		case logTypeInfo:
			logMessageClass = 'log-message-info';
			break;
		case logTypeWarn:
			logMessageClass = 'log-message-warn';
			break;
		case logTypeError:
			logMessageClass = 'log-message-error';
			break;
	}
  $label.addClass(logMessageClass);
  var html = logMessageTemplate.replace(/%TIMESTAMP%/g, curDate)
                                .replace(/%MESSAGE%/g, message)
                                .replace(/%CLASS%/g, logMessageClass);
  while ($('#admin-logs-container > .log-message').length > 100) {
    $('#admin-logs-container').find('.log-message').last().remove();
  }
	$('#admin-logs-container').prepend(html);
  
  $label.text(message);
	$popup.html($label);
	$popup.fadeIn().removeClass('hidden');
	setTimeout(function() {
		$popup.fadeOut('fast', function() {
			$popup.addClass('hidden');
			$popup.html('');
		});
	}, 10*1000);
}

/**
 * Initialize the dashboard tab with all the elements required
 */
function initDashboardTab() {
	// Add the containers, then for each container, add each element into it
	var curProfile = getCurrentProfile();
	var groupList = getGroupList(tabDashboardId);
	$('#dashboard-title').text(curProfile.display);
	if (groupList.length == 0) {
		addGroup(tabDashboardId, $.t('Dashboard'));
		groupList = getGroupList(tabDashboardId);
	}
	for (key in groupList) {
		tabContent[tabDashboardId][groupList[key].id] = [];
		var htmlGroup = tabGroupTemplate.replace(/%TAB%/g, tabDashboardId).replace(/%GROUP%/g, groupList[key].id).replace(/%DISPLAY%/g, groupList[key].display);
		$('#dashboard-content').append(htmlGroup);
	}
}

/**
 * Initialize the Parameters tab
 */
function initParametersTab() {
	var $curProfileLabel = $('#admin-cur-profile-display');
	var $profilesListSelect = $('#admin-profiles-list');
	var currentProfile = getCurrentProfile();
	
	$curProfileLabel.text(currentProfile.display);

	var profilesList = sendGetRequest(globalConfig.carleon_location + carleon.apps.profiles.url + '?profiles');
	
	if (profilesList.result) {
		for (key in profilesList.json.profiles) {
			var curProfile = profilesList.json.profiles[key];
			$profilesListSelect.append($('<option>', {
				value:curProfile.id,
				text:curProfile.display,
				selected:(curProfile.id == currentProfile.id)
			}));
		}
	}
	
	$profilesListSelect.change(function() {
		var changeProfile = sendGetRequest(globalConfig.carleon_location + carleon.apps.profiles.url + '?setprofile='+$(this).val());
		if (changeProfile.result) {
			location.reload();
		}
	});
	
	$('#admin-toggle').prop('checked', currentProfile.options.adminMode==true);
	
	if (currentProfile.options.adminMode) {
		$('.admin-button').slideDown();
		$('.div-hidden').slideDown();
	}
	
  $('#admin-default-profile').prop('checked', currentProfile.default);
  if (currentProfile.default == 1) {
    $('#admin-default-profile').prop('disabled', true);
		$('#admin-profile-remove').prop('disabled', true);
  } else {
    $('#admin-default-profile').prop('disabled', false);
		$('#admin-profile-remove').prop('disabled', false);
  }

  $('#admin-rename-profile').val(currentProfile.display);
}

/**
 * Open new group dialog window
 */
function newGroupDialog(tab) {
	var $dialog = $('#dialog-group');
	$dialog.find('#dialog-group-name').val('');
	$dialog.find('#dialog-group-id').val('');
	$dialog.find('#dialog-tab-id').val(tab);
	$dialog.attr('title', $.t('Add a new group'));
	$dialog.on('keypress', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if(code == 13) {
			var newGroup = addGroup($(this).find('#dialog-tab-id').val(), $(this).find('#dialog-group-name').val());
			addGroupToTab($(this).find('#dialog-tab-id').val(), newGroup.id, newGroup.display);
			$( this ).dialog( 'close' );
		}
	});
	
	$dialog.dialog({
		autoOpen: false,
		width: 400,
		modal: true,
		title: $.t('New group'),
		buttons: [{
			text:$.t('Ok'),
			click:function() {
				var newGroup = addGroup($(this).find('#dialog-tab-id').val(), $(this).find('#dialog-group-name').val());
				addGroupToTab($(this).find('#dialog-tab-id').val(), newGroup.id, newGroup.display);
				$( this ).dialog( 'close' );
			}
		}]
	});
	
	$dialog.dialog('open');
}

/**
 * Open a edit group dialog window
 */
function editGroupDialog(tab, group) {
	var $dialog = $('#dialog-group');
	var groups = getGroupList(tab);
	
	$dialog.find('#dialog-group-id').val(group);
	$dialog.find('#dialog-group-name').val('');
	$dialog.find('#dialog-tab-id').val(tab);
	for (key in groups) {
		if (groups[key].id == group) {
			$dialog.find('#dialog-group-name').val(groups[key].display);
		}
	}
	$dialog.attr('title', $.t('Edit a group'));
	$dialog.on('keypress', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if(code == 13) {
			if (editGroup($(this).find('#dialog-tab-id').val(), $dialog.find('#dialog-group-id').val(), $(this).find('#dialog-group-name').val())) {
				editGroupInTab($(this).find('#dialog-tab-id').val(), $dialog.find('#dialog-group-id').val(), $(this).find('#dialog-group-name').val());
			}
			$( this ).dialog( 'close' );
		}
	});
	
	$dialog.dialog({
		autoOpen: false,
		width: 400,
		modal: true,
		title: $.t('New group'),
		buttons: [{
			text:$.t('Ok'),
			click:function() {
				if (editGroup($(this).find('#dialog-tab-id').val(), $dialog.find('#dialog-group-id').val(), $(this).find('#dialog-group-name').val())) {
					editGroupInTab($(this).find('#dialog-tab-id').val(), $dialog.find('#dialog-group-id').val(), $(this).find('#dialog-group-name').val());
				}
				$( this ).dialog( 'close' );
			}
		}]
	});
	
	$dialog.dialog('open');
}

/**
 * Remove the selected group and all its elements inside
 */
function deleteGroup(tab, group) {
	var profile = getCurrentProfile();
	
	// Remove all elements on this group
	for (keyd in angharad.device) {
		for (keysw in angharad.device[keyd].switches) {
			for (keyt in angharad.device[keyd].switches[keysw].tags) {
				if (angharad.device[keyd].switches[keysw].tags[keyt].indexOf(globalConfig.tags_prefix + '#' + profile.id + '#' + tab + '#' + group) == 0) {
					removeSwitchFromGroup(keyd, angharad.device[keyd].switches[keysw].name, tab, group)
				}
			}
		}
		
		for (keydi in angharad.device[keyd].dimmers) {
			for (keyt in angharad.device[keyd].dimmers[keydi].tags) {
				if (angharad.device[keyd].dimmers[keydi].tags[keyt].indexOf(globalConfig.tags_prefix + '#' + profile.id + '#' + tab + '#' + group) == 0) {
					removeDimmerFromGroup(keyd, angharad.device[keyd].dimmers[keydi].name, tab, group)
				}
			}
		}
		
		for (keyhe in angharad.device[keyd].heaters) {
			for (keyt in angharad.device[keyd].heaters[keyhe].tags) {
				if (angharad.device[keyd].heaters[keyhe].tags[keyt].indexOf(globalConfig.tags_prefix + '#' + profile.id + '#' + tab + '#' + group) == 0) {
					removeHeaterFromGroup(keyd, angharad.device[keyd].heaters[keyhe].name, tab, group)
				}
			}
		}
		
		for (keyse in angharad.device[keyd].sensors) {
			for (keyt in angharad.device[keyd].sensors[keyse].tags) {
				if (angharad.device[keyd].sensors[keyse].tags[keyt].indexOf(globalConfig.tags_prefix + '#' + profile.id + '#' + tab + '#' + group) == 0) {
					removeSensorFromGroup(keyd, angharad.device[keyd].sensors[keyse].name, tab, group)
				}
			}
		}
	}
	
	// Remove current group
  for (key in profile.tabs) {
    if (profile.tabs[key].id == tab) {
      for (keyg in profile.tabs[key].groups) {
        if (profile.tabs[key].groups[keyg].id == group) {
          profile.tabs[key].groups.splice(keyg, 1);
        }
      }
    }
  }
  
  if (updateProfile(profile)) {
		$div = $('#div-group-' + tab + '-' + group);
		$div.fadeOut('fast', function() {
			$div.remove();
		});
		return true;
	} else {
		return false;
	}
}

/**
 * Remove an element fomr the current group
 */
function removeFromGroup($button) {
	var type = $button.attr('data-an-type');
	if (type == 'switch') {
		removeSwitchFromGroup($button.attr('data-an-device'), $button.attr('data-an-name'), $button.attr('data-an-tab'), $button.attr('data-an-group'));
	} else if (type == 'dimmer') {
		removeDimmerFromGroup($button.attr('data-an-device'), $button.attr('data-an-name'), $button.attr('data-an-tab'), $button.attr('data-an-group'));
	} else if (type == 'heater') {
		removeHeaterFromGroup($button.attr('data-an-device'), $button.attr('data-an-name'), $button.attr('data-an-tab'), $button.attr('data-an-group'));
	} else if (type == 'sensor') {
		removeSensorFromGroup($button.attr('data-an-device'), $button.attr('data-an-name'), $button.attr('data-an-tab'), $button.attr('data-an-group'));
	} else if (type == 'script') {
		removeScriptFromGroup($button.attr('data-an-name'), $button.attr('data-an-tab'), $button.attr('data-an-group'));
	} else if (type == 'camera') {
		removeCameraFromGroup($button.attr('data-an-name'), $button.attr('data-an-tab'), $button.attr('data-an-group'));
	} else if (type == 'mpc') {
		removeMpcFromGroup($button.attr('data-an-name'), $button.attr('data-an-tab'), $button.attr('data-an-group'));
	} else if (type == 'radio') {
		removeRadioFromGroup($button.attr('data-an-name'), $button.attr('data-an-tab'), $button.attr('data-an-group'));
	}
	
	logMessage(logTypeInfo, $.t('Element removed'));
}

/**
 * Move element to lower or upper group
 */
function moveToGroup($button, direction) {
	var type = $button.attr('data-an-type');
	var tab = $button.attr('data-an-tab');
	var curGroup = $button.attr('data-an-group');
	var nextGroup = undefined;
	var groupList = getGroupList(tab);
	
	// Look for the group to add to
	if (curGroup != -1) {
		for (var i=0; i<groupList.length; i++) {
			if (groupList[i].id == curGroup) {
				// Group found, look for the next or previous one
				if (groupList[i+direction] != undefined) {
					nextGroup = groupList[i+direction].id;
				} else {
					// If there is no next group, then if we are in the dashboard, loop
					// Otherwise put it in the device group
					if (tab == tabDashboardId) {
						if ((i+direction) < 0) {
							nextGroup = groupList[groupList.length-1].id;
						} else if ((i+direction) >= groupList.length) {
							nextGroup = groupList[0].id;
						}
					} else {
						nextGroup = -1;
					}
				}
			}
		}
	} else {
		if (groupList[0] != undefined) {
			nextGroup = groupList[0].id;
		}
	}
	
	if (nextGroup != undefined || nextGroup == curGroup) {
		// Group found, so basically, remove element from current group, and add it to next group
		
		var $group = $('#div-group-'+tab+'-'+nextGroup);
		var position = parseInt($group.attr('data-an-nb-elements'));
		if (isNaN(position)) {
			position = 0;
		}
		$group.attr('data-an-nb-elements', (position+1));
		if (type == 'switch') {
			removeSwitchFromGroup($button.attr('data-an-device'), $button.attr('data-an-name'), tab, curGroup);
			addSwitchToGroup($button.attr('data-an-device'), $button.attr('data-an-name'), tab, nextGroup, position);
		} else if (type == 'dimmer') {
			removeDimmerFromGroup($button.attr('data-an-device'), $button.attr('data-an-name'), tab, curGroup);
			addDimmerToGroup($button.attr('data-an-device'), $button.attr('data-an-name'), tab, nextGroup, position);
		} else if (type == 'heater') {
			removeHeaterFromGroup($button.attr('data-an-device'), $button.attr('data-an-name'), tab, curGroup);
			addHeaterToGroup($button.attr('data-an-device'), $button.attr('data-an-name'), tab, nextGroup, position);
		} else if (type == 'sensor') {
			removeSensorFromGroup($button.attr('data-an-device'), $button.attr('data-an-name'), tab, curGroup);
			addSensorToGroup($button.attr('data-an-device'), $button.attr('data-an-name'), tab, nextGroup, position);
		} else if (type == 'script') {
			removeScriptFromGroup($button.attr('data-an-name'), tab, curGroup);
			addScriptToGroup($button.attr('data-an-name'), tab, nextGroup, position);
		} else if (type == 'camera') {
			removeCameraFromGroup($button.attr('data-an-name'), tab, curGroup);
			addCameraToGroup($button.attr('data-an-name'), tab, nextGroup, position);
		} else if (type == 'mpc') {
			removeMpcFromGroup($button.attr('data-an-name'), tab, curGroup);
			addMpcToGroup($button.attr('data-an-name'), tab, nextGroup, position);
		} else if (type == 'radio') {
			removeRadioFromGroup($button.attr('data-an-name'), tab, curGroup);
			addRadioToGroup($button.attr('data-an-name'), tab, nextGroup, position);
		}
	} else {
		logMessage(logTypeError, $.t('Error, unable to move element'));
	}
}

/**
 * Move element up or down in the current group
 */
function moveInGroup($button, direction) {
	var position2 = parseInt($button.parent().attr('data-an-position'));
	var position1 = -1;
	// Select element, and element at position plus direction, then switch positions
	var $btn1 = $button;
	var $btn2 = undefined;
	if (direction == -1) {
		$btn2 = $btn1.parent().prev().find('.admin-button');
		position1 = position2 - 1;
	} else {
		$btn2 = $btn1.parent().next().find('.admin-button');
		position1 = position2 + 1;
	}
	if ($btn2.length > 0) {
		if ($btn1.attr('data-an-type') == 'switch') {
			removeSwitchFromGroup($btn1.attr('data-an-device'), $btn1.attr('data-an-name'), $btn1.attr('data-an-tab'), $btn1.attr('data-an-group'));
		} else if ($btn1.attr('data-an-type') == 'dimmer') {
			removeDimmerFromGroup($btn1.attr('data-an-device'), $btn1.attr('data-an-name'), $btn1.attr('data-an-tab'), $btn1.attr('data-an-group'));
		} else if ($btn1.attr('data-an-type') == 'heater') {
			removeHeaterFromGroup($btn1.attr('data-an-device'), $btn1.attr('data-an-name'), $btn1.attr('data-an-tab'), $btn1.attr('data-an-group'));
		} else if ($btn1.attr('data-an-type') == 'sensor') {
			removeSensorFromGroup($btn1.attr('data-an-device'), $btn1.attr('data-an-name'), $btn1.attr('data-an-tab'), $btn1.attr('data-an-group'));
		} else if ($btn1.attr('data-an-type') == 'script') {
			removeScriptFromGroup($btn1.attr('data-an-name'), $btn1.attr('data-an-tab'), $btn1.attr('data-an-group'));
		} else if ($btn1.attr('data-an-type') == 'camera') {
			removeCameraFromGroup($btn1.attr('data-an-name'), $btn1.attr('data-an-tab'), $btn1.attr('data-an-group'));
		} else if ($btn1.attr('data-an-type') == 'mpc') {
			removeMpcFromGroup($btn1.attr('data-an-name'), $btn1.attr('data-an-tab'), $btn1.attr('data-an-group'));
		} else if ($btn1.attr('data-an-type') == 'radio') {
			removeRadioFromGroup($btn1.attr('data-an-name'), $btn1.attr('data-an-tab'), $btn1.attr('data-an-group'));
		}
		if ($btn2.attr('data-an-type') == 'switch') {
			removeSwitchFromGroup($btn2.attr('data-an-device'), $btn2.attr('data-an-name'), $btn2.attr('data-an-tab'), $btn2.attr('data-an-group'));
		} else if ($btn2.attr('data-an-type') == 'dimmer') {
			removeDimmerFromGroup($btn2.attr('data-an-device'), $btn2.attr('data-an-name'), $btn2.attr('data-an-tab'), $btn2.attr('data-an-group'));
		} else if ($btn2.attr('data-an-type') == 'heater') {
			removeHeaterFromGroup($btn2.attr('data-an-device'), $btn2.attr('data-an-name'), $btn2.attr('data-an-tab'), $btn2.attr('data-an-group'));
		} else if ($btn2.attr('data-an-type') == 'sensor') {
			removeSensorFromGroup($btn2.attr('data-an-device'), $btn2.attr('data-an-name'), $btn2.attr('data-an-tab'), $btn2.attr('data-an-group'));
		} else if ($btn2.attr('data-an-type') == 'script') {
			removeScriptFromGroup($btn2.attr('data-an-name'), $btn2.attr('data-an-tab'), $btn2.attr('data-an-group'));
		} else if ($btn1.attr('data-an-type') == 'camera') {
			removeCameraFromGroup($btn1.attr('data-an-name'), $btn1.attr('data-an-tab'), $btn1.attr('data-an-group'));
		} else if ($btn1.attr('data-an-type') == 'mpc') {
			removeMpcFromGroup($btn1.attr('data-an-name'), $btn1.attr('data-an-tab'), $btn1.attr('data-an-group'));
		} else if ($btn1.attr('data-an-type') == 'radio') {
			removeRadioFromGroup($btn1.attr('data-an-name'), $btn1.attr('data-an-tab'), $btn1.attr('data-an-group'));
		}
		if ($btn1.attr('data-an-type') == 'switch') {
			addSwitchToGroup($btn1.attr('data-an-device'), $btn1.attr('data-an-name'), $btn1.attr('data-an-tab'), $btn1.attr('data-an-group'), position1);
		} else if ($btn1.attr('data-an-type') == 'dimmer') {
			addDimmerToGroup($btn1.attr('data-an-device'), $btn1.attr('data-an-name'), $btn1.attr('data-an-tab'), $btn1.attr('data-an-group'), position1);
		} else if ($btn1.attr('data-an-type') == 'heater') {
			addHeaterToGroup($btn1.attr('data-an-device'), $btn1.attr('data-an-name'), $btn1.attr('data-an-tab'), $btn1.attr('data-an-group'), position1);
		} else if ($btn1.attr('data-an-type') == 'sensor') {
			addSensorToGroup($btn1.attr('data-an-device'), $btn1.attr('data-an-name'), $btn1.attr('data-an-tab'), $btn1.attr('data-an-group'), position1);
		} else if ($btn1.attr('data-an-type') == 'script') {
			addScriptToGroup($btn1.attr('data-an-name'), $btn1.attr('data-an-tab'), $btn1.attr('data-an-group'), position1);
		} else if ($btn1.attr('data-an-type') == 'camera') {
			addCameraToGroup($btn1.attr('data-an-name'), $btn1.attr('data-an-tab'), $btn1.attr('data-an-group'), position1);
		} else if ($btn1.attr('data-an-type') == 'mpc') {
			addMpcToGroup($btn1.attr('data-an-name'), $btn1.attr('data-an-tab'), $btn1.attr('data-an-group'), position1);
		} else if ($btn1.attr('data-an-type') == 'radio') {
			addRadioToGroup($btn1.attr('data-an-name'), $btn1.attr('data-an-tab'), $btn1.attr('data-an-group'), position1);
		}
		if ($btn2.attr('data-an-type') == 'switch') {
			addSwitchToGroup($btn2.attr('data-an-device'), $btn2.attr('data-an-name'), $btn2.attr('data-an-tab'), $btn2.attr('data-an-group'), position2);
		} else if ($btn2.attr('data-an-type') == 'dimmer') {
			addDimmerToGroup($btn2.attr('data-an-device'), $btn2.attr('data-an-name'), $btn2.attr('data-an-tab'), $btn2.attr('data-an-group'), position2);
		} else if ($btn2.attr('data-an-type') == 'heater') {
			addHeaterToGroup($btn2.attr('data-an-device'), $btn2.attr('data-an-name'), $btn2.attr('data-an-tab'), $btn2.attr('data-an-group'), position2);
		} else if ($btn2.attr('data-an-type') == 'sensor') {
			addSensorToGroup($btn2.attr('data-an-device'), $btn2.attr('data-an-name'), $btn2.attr('data-an-tab'), $btn2.attr('data-an-group'), position2);
		} else if ($btn2.attr('data-an-type') == 'script') {
			addScriptToGroup($btn2.attr('data-an-name'), $btn2.attr('data-an-tab'), $btn2.attr('data-an-group'), position2);
		} else if ($btn1.attr('data-an-type') == 'camera') {
			addCameraToGroup($btn1.attr('data-an-name'), $btn1.attr('data-an-tab'), $btn1.attr('data-an-group'), position2);
		} else if ($btn1.attr('data-an-type') == 'mpc') {
			addMpcToGroup($btn1.attr('data-an-name'), $btn1.attr('data-an-tab'), $btn1.attr('data-an-group'), position2);
		} else if ($btn1.attr('data-an-type') == 'radio') {
			addRadioToGroup($btn1.attr('data-an-name'), $btn1.attr('data-an-tab'), $btn1.attr('data-an-group'), position2);
		}
	} else {
		logMessage(logTypeError, $.t('Error, unable to move element'));
	}
}

/**
 * Insert an element in a container in the proper position
 */
function insertElementInGroup(htmlElement, $group, position) {
	if ($group.attr('data-an-nb-elements') == 0 || position == -1) {
		$group.append(htmlElement);
	} else {
		$group.find('.data-element').each(function() {
			if (parseInt($(this).attr('data-an-position')) == (position-1)) {
				$(htmlElement).insertAfter($(this));
				return false;
			} else if (parseInt($(this).attr('data-an-position')) > position) {
				$(htmlElement).insertBefore($(this));
				return false;
			} else if ($(this).next().length == 0) {
				$(htmlElement).insertAfter($(this));
				return false;
			}
		});
	}
	$group.attr('data-an-nb-elements', parseInt($group.attr('data-an-nb-elements'))+1);
}

/**
 * Refresh command
 */
function refresh(force) {
	refreshAngharad(force);
	refreshCarleon();
}
