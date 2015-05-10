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

var dashboardTabContent = [];

var dashboardContainerTemplate = '<label id="container-dashboard-%GROUP%-label">%DISPLAY%</label>\n\
<div id="container-dashboard-%GROUP%" class="block">\n\
	<div id="container-dashboard-%GROUP%" class="div-dashboard"></div>\n\
</div>';

var tabGroupTemplate = '<label id="container-%TAB%-%GROUP%-label">%DISPLAY%</label>\n\
<div id="container-%TAB%-%GROUP%" class="block">\n\
	<div id="container-%TAB%-%GROUP%" class="div-container-inside"></div>\n\
</div>';

/**
 * Main function
 */
$(document).ready(function() {
	
	initConfig();
	
	initEvents();
	
	gatherInformations();
	
	initDashboardTab();
	
	initSwitchesTab();
	
	initHeatersTab();
	
	initSensorsTab();
	
	initParametersTab();
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
	var resultProfile = sendGetRequest(globalConfig.carleon_location + '/profiles/');
	
	if (resultProfile.result) {
		globalConfig.profile = resultProfile.json.profile;
	}
	globalConfig.adminMode = false;
	
	$.i18n.init({fallbackLng:'en'}).done(function() {
		/* Context menus */
		$.contextMenu({
			selector: '.admin-modify-delete',
			trigger: 'left',
			callback: function (key, options) {
				if (key == 'edit') {
					if ($(this).attr('name').indexOf('admin-global-action') == 0) {
						editAction($(this));
					} else if ($(this).attr('name').indexOf('admin-global-script') == 0 || $(this).attr('name').indexOf('admin-script') == 0) {
						editScript($(this));
					} else if ($(this).attr('name').indexOf('admin-global-schedule') == 0 || $(this).attr('name').indexOf('admin-schedule') == 0) {
						editSchedule($(this));
					}
				} else {
					if ($(this).attr('name').indexOf('admin-global-action') == 0) {
						deleteAction($(this));
					} else if ($(this).attr('name').indexOf('admin-global-script') == 0 || $(this).attr('name').indexOf('admin-script') == 0) {
						deleteScript($(this));
					} else if ($(this).attr('name').indexOf('admin-global-schedule') == 0 || $(this).attr('name').indexOf('admin-schedule') == 0) {
						deleteSchedule($(this));
					}
				}
			},
			items: {
				'edit': {name: $.t('Edit'), icon: 'edit'},
				'delete': {name: $.t('Delete'), icon: 'delete'},
			}
		});
			
		$.contextMenu({
			selector: '.admin-modify',
			trigger: 'left',
			callback: function (key, options) {
				if (key == 'edit') {
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
					addToDashboard($(this));
				}
			},
			items: {
				'edit': {name: $.t('Edit'), icon: 'edit'},
				'add': {name: $.t('Add to dashboard'), icon: 'add'},
			}
		});

		$.contextMenu({
			selector: '.admin-modify-dashboard',
			trigger: 'left',
			callback: function (key, options) {
				if (key == 'edit') {
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
					removeFromDashboard($(this));
				}
			},
			items: {
				'edit': {name: $.t('Edit'), icon: 'edit'},
				'remove': {name: $.t('Remove from dashboard'), icon: 'delete'},
			}
		});
	});
  
  $('#admin-profile-new').val('');
  $('#new-group-0-input').val('');
  $('#new-group-1-input').val('');
  $('#new-group-2-input').val('');
  $('#new-group-3-input').val('');
  $('#new-group-4-input').val('');
  $('#new-group-5-input').val('');
  $('#new-group-6-input').val('');
  $('#new-group-7-input').val('');
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
			
			$(oldTab).fadeOut('fast', function() {
				$(newTab).fadeIn().removeClass('hidden');
				$(oldTab).addClass('hidden');
			});
			
			$('#logres-sidemenu a').removeClass('open');
			$(this).addClass('open');
		}
	});
	
	/* Administrator mode switch */
	$('#admin-toggle').change(function() {
		$('.admin-button').slideToggle();
		$('.p-hidden').slideToggle();
		globalConfig.adminMode = !globalConfig.adminMode;
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
			console.log($input);
      $input.val('');
			console.log($input);
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
      globalConfig.profile.default = 1;
      var url = globalConfig.carleon_location + '/profiles/';
      response = sendPostRequest(url, {action:'modifyprofile', profile:JSON.stringify(globalConfig.profile)});
      var message = $.t('Current profile set to default');
      var $label = $('#label-admin-default-profile');
      if (!response.result) {
        $(this).prop('checked', false);
      }
    }
  });
  
  /* New group */
  
  $groupInput = $('.new-group');
  
  $groupInput.bind("enterKey",function(e) {
    var curTab = $(this).attr('data-an-tab');
    var $div = $('#new-group-'+curTab+'-result');
    var response = addGroup(curTab, $(this).val());
    if (response.result) {
      var message = $.t('Group')+' '+$(this).val()+' '+$.t('created');
    } else {
      var message = $.t('Error adding group');
    }
    
    $div.text(message);
    $div.fadeIn().removeClass('hidden');
    setTimeout(function() {
      $div.fadeOut('fast', function() {
        $div.addClass('hidden');
        $div.text('');
      });
    }, 10*1000);
  });
  
  $groupInput.keyup(function(e) {
    if(e.keyCode == 13) {
      $(this).trigger("enterKey");
    }
  });

}

/**
 * Get all overviews from angharad server and carleon environment
 */
function gatherInformations() {
	gatherAngharadInformations();
}

/**
 * Return JSON result from a REST webservice in async mode using a HTTP GET, so no data is returned until function is complete
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
 * Return JSON result from a REST webservice in async mode using a HTTP POST, so no data is returned until function is complete
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
function addToDashboard($element) {
	if ($element.attr('data-an-type') === 'switch') {
		addSwitchToDashboard($element.attr('data-an-device'), $element.attr('data-an-switch'));
	} else if ($element.attr('data-an-type') === 'dimmer') {
		addDimmerToDashboard($element.attr('data-an-device'), $element.attr('data-an-dimmer'));
	} else if ($element.attr('data-an-type') === 'heater') {
		addHeaterToDashboard($element.attr('data-an-device'), $element.attr('data-an-heater'));
	} else if ($element.attr('data-an-type') === 'sensor') {
		addSensorToDashboard($element.attr('data-an-device'), $element.attr('data-an-sensor'));
	}
}

/**
 * Remove the selected element from dashboard
 */
function removeFromDashboard($element) {
	if ($element.attr('data-an-type') === 'switch') {
		removeSwitchFromDashboard($element.attr('data-an-device'), $element.attr('data-an-switch'));
	} else if ($element.attr('data-an-type') === 'dimmer') {
		removeDimmerFromDashboard($element.attr('data-an-device'), $element.attr('data-an-dimmer'));
	} else if ($element.attr('data-an-type') === 'heater') {
		removeHeaterFromDashboard($element.attr('data-an-device'), $element.attr('data-an-heater'));
	} else if ($element.attr('data-an-type') === 'sensor') {
		removeSensorFromDashboard($element.attr('data-an-device'), $element.attr('data-an-sensor'));
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
  var url = globalConfig.carleon_location + '/profiles/';
  return sendPostRequest(url, {action:'addprofile', profile:name});
}

/**
 * Remove current profile
 */
function removeCurrentProfile() {
	var url = globalConfig.carleon_location + '/profiles/';
	
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
	var url = globalConfig.carleon_location + '/profiles/';
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
  for (key in profile.tabs) {
    if (profile.tabs[key].id == tab) {
      tabFound = true;
      var lastId = 0;
      for (keyg in profile.tabs[key].groups) {
        if (profile.tabs[key].groups[keyg].id > lastId) {
          lastId = profile.tabs[key].groups[keyg].id;
        }
      }
      profile.tabs[key].groups.push({id:lastId+1, display:groupName});
    }
  }
  if (!tabFound) {
    profile.tabs.push({id:tab, groups:[ {id:"0", display:groupName} ] });
  }
  return updateProfile(profile);
}

/**
 * Add the specified group with its id to the specified tab
 */
function addGroupToTab(tab, groupId, groupName) {
	var template = tabGroupTemplate.replace(/%TAB%/g, tab).replace(/%GROUP%/g, groupId).replace(/%DISPLAY%/g, groupName);
}

/**
 * Return the list of groups available in the specified tab for the specified profile
 */
function getGroupList(tabId) {
	for (key in globalConfig.profile.tabs) {
		if (globalConfig.profile.tabs[key].id == tabId) {
			return globalConfig.profile.tabs[key].groups;
		}
	}
	return [];
}

/**
 * Display the message in the selected tab for duration seconds, then hides the message
 */
function displayTemporaryMessage(tabId, message, duration) {
	var $message = $('#tab-message-'+tabId);
	$message.text(message);
	$message.fadeIn().removeClass('hidden');
	setTimeout(function() {
		$message.fadeOut('fast', function() {
			$message.addClass('hidden');
			$message.text('');
		});
	}, duration*1000);
}

/**
 * Initialize the dashboard tab with all the elements required
 */
function initDashboardTab() {
	// Add the containers, then for each container, add each element into it
	var curProfile = getCurrentProfile();
	var groupList = getGroupList(tabDashboardId);
	$('#dashboard-title').text(curProfile.display)
	for (key in groupList) {
		var htmlGroup = dashboardContainerTemplate.replace(/%GROUP%/g, groupList[key].id).replace(/%DISPLAY%/g, groupList[key].display);
		var hasElement = false;
		$('#dashboard-content').append(htmlGroup);
		
		if (angharad.ready) {
			for (dekey in angharad.device) {
				for (sekey in angharad.device[dekey].sensors) {
					var curSensor = angharad.device[dekey].sensors[sekey];
					for (tagkey in curSensor.tags) {
						if (curSensor.tags[tagkey].indexOf(curProfile.id + '#' + tabDashboardId + '#' + groupList[key].id) == 0) {
							hasElement = true;
							displayDashboardSensor(angharad.device[dekey].name, angharad.device[dekey].sensors[sekey], groupList[key].id);
						}
					}
				}
				
				for (swkey in angharad.device[dekey].switches) {
					var curSwitch = angharad.device[dekey].switches[swkey];
					for (tagkey in curSwitch.tags) {
						if (curSwitch.tags[tagkey].indexOf(curProfile.id + '#' + tabDashboardId + '#' + groupList[key].id) == 0) {
							hasElement = true;
							displayDashboardSwitch(angharad.device[dekey].name, angharad.device[dekey].switches[swkey], groupList[key].id);
						}
					}
				}
				
				for (dikey in angharad.device[dekey].dimmers) {
					var curDimmer = angharad.device[dekey].dimmers[dikey];
					for (tagkey in curDimmer.tags) {
						if (curDimmer.tags[tagkey].indexOf(curProfile.id + '#' + tabDashboardId + '#' + groupList[key].id) == 0) {
							hasElement = true;
							displayDashboardDimmer(angharad.device[dekey].name, angharad.device[dekey].dimmers[dikey], groupList[key].id);
						}
					}
				}
				
				for (hekey in angharad.device[dekey].heaters) {
					var curHeater = angharad.device[dekey].heaters[hekey];
					for (tagkey in curHeater.tags) {
						if (curHeater.tags[tagkey].indexOf(curProfile.id + '#' + tabDashboardId + '#' + groupList[key].id) == 0) {
							hasElement = true;
							displayDashboardHeater(angharad.device[dekey].name, angharad.device[dekey].heaters[hekey], groupList[key].id);
						}
					}
				}
				
				if (!hasElement) {
				}
			}
		}
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

	var profilesList = sendGetRequest(globalConfig.carleon_location + '/profiles/?profiles');
	
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
		var changeProfile = sendGetRequest(globalConfig.carleon_location + '/profiles/?setprofile='+$(this).val());
		if (changeProfile.result) {
			location.reload();
		}
	});
	
	$('#admin-toggle').prop('checked', globalConfig.adminMode);
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
