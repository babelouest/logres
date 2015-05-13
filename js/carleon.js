/**
 * Logres
 * Angharad web interface
 * Copyright 2015 Nicolas Mora mail@babelouest.org
 * Licenced under AGPL
 */
var carleon = {ready:false}

var tabConstGroupTemplate = '<div id="div-group-%TAB%-%GROUP%">\n\
	<label id="container-%TAB%-%GROUP%-label">%DISPLAY%</label>\n\
	<div id="containers-%TAB%-%GROUP%" class="block">\n\
		<div id="container-%TAB%-%GROUP%" class="div-container-inside" data-an-nb-elements="0"></div>\n\
	</div>\n\
</div>\n';

var cameraTemplate = '<div id="camera-%NAME%" class="camera-%CAMERA% small-block data-element" data-an-name="%NAME%" data-an-camera="%CAMERA%" data-an-position="%POSITION%">\n\
	<input type="button" class="admin-button %ADMINCLASS%" value="+" name="admin-camera-%NAME%" id="admin-camera-%NAME%" data-an-type="camera" data-an-name="%CAMERA%" data-an-tab="%TAB%" data-an-group="%GROUP%"/>\n\
	<img id="camera-status-%NAME%" alt="Not recording" src="images/recording-not.png"/><label id="camera-%NAME%-label" class="title-display">%DISPLAY%</label>\n\
	<p>\n\
		<label class="camera-label" data-i18n>Pictures layout</label>\n\
		<select name="camera-pictures-select-%NAME%" id="camera-pictures-select-%NAME%" data-an-camera="%CAMERA%" data-an-name="%NAME%" class="camera-list">\n\
			<option value="list" id="camera-pictures-select-%NAME%-list" data-i18n>List</option>\n\
			<option value="grid" id="camera-pictures-select-%NAME%-grid" data-i18n>Grid</option>\n\
		</select>\n\
	</p>\n\
	<p>\n\
		<label class="camera-label" data-i18n>Pictures type</label>\n\
		<select name="camera-switch-%NAME%" id="camera-switch-%NAME%" data-an-camera="%CAMERA%" class="camera-list">\n\
			<option value="sched" id="camera-switch-%NAME%-sched" data-i18n>Scheduled</option>\n\
			<option value="trigg" id="camera-switch-%NAME%-trigg" data-i18n>Triggered</option>\n\
			<option value="stream" id="camera-switch-%NAME%-stream" data-i18n>Real-time stream</option>\n\
		</select>\n\
	</p>\n\
	<p id="p-camera-list-%NAME%" class="camera-control">\n\
		<label for="camera-list-%NAME%" class="camera-label" data-i18n>Pictures list</label>\n\
		<select name="camera-list-%NAME%" id="camera-list-%NAME%" data-an-camera="%CAMERA%" data-an-name="%NAME%" class="camera-list" class="camera-list"></select>\n\
	</p>\n\
	<p id="p-camera-photo-%NAME%">\n\
		<a data-lightbox="camera-%NAME%" id="camera-photo-large-%NAME%" href="#" class="camera-photo-large">\n\
			<img src="#" id="camera-photo-%NAME%" width="640" height="480" class="camera-photo">\n\
		</a>\n\
	</p>\n\
  <ul id="camera-grid-%NAME%" class="camera-grid rig">\n\
  </ul>\n\
</div>\n';

var cameraGridPictureTemplate = '<li>\n\
	<a data-lightbox="camera-%NAME%" id="camera-photo-grid-large-%NAME%" href="%URL_LARGE%"><img src="%URL%" alt="%TITLE%"></a>\n\
</li>';

var mpcTemplate = '<div id="mpc-%NAME%" class="small-block data-element" data-an-name="%NAME%" data-an-mpc="%MPC%" data-an-position="%POSITION%">\n\
	<input type="button" class="admin-button %ADMINCLASS%" value="+" name="admin-mpc-%NAME%" id="admin-mpc-%NAME%" data-an-type="mpc" data-an-name="%MPC%" data-an-tab="%TAB%" data-an-group="%GROUP%"/>\n\
	<input type="button" name="toggle-mpc-%NAME%" id="toggle-mpc-%NAME%" value="%SHOW%" data-an-name="%MPC%" >\n\
  <img id="mpc-status-%NAME%" src="images/media-disabled.png" alt="" class="mpc-status-%MPC%"/>\n\
  <label>%DISPLAY%</label>\n\
	<div id="mpc-commands-%NAME%" class="hidden c-mpc-commands-%MPC%" data-an-state="0" data-an-mpc="%MPC%">\n\
		<label id="label-mpc-%NAME%-status" class="music-status mpc-status-%MPC%"></label>\n\
		<p>\n\
      <div id="div-mpc-%NAME%-stop">\n\
        <a href="#" id="mpc-%NAME%-stop" class="mpc-stop-%MPC%"><img src="images/media-playback-stop-big.png" /></a>\n\
      </div>\n\
      <div id="div-mpc-%NAME%-play">\n\
        <a href="#" id="mpc-%NAME%-play" class="mpc-play-%MPC%"><img src="images/media-playback-start-big.png" /></a>\n\
      </div>\n\
		</p>\n\
		<p>\n\
			<label id="label-mpc-%NAME%-volume" for="mpc-%NAME%" class="mpc-volume-%MPC%"></label>\n\
			<div id="mpc-slide-%NAME%" class="mpc-volume-slide-%MPC%"></div>\n\
		</p>\n\
	</div>\n\
</div>\n';

var radioTemplate = '<div id="radio-%NAME%" class="small-block data-element" data-an-name="%NAME%" data-an-radio="%RADIO%" data-an-position="%POSITION%">\n\
	<input type="button" class="admin-button %ADMINCLASS%" value="+" name="admin-radio-%NAME%" id="admin-radio-%NAME%" data-an-type="radio" data-an-name="%RADIO%" data-an-tab="%TAB%" data-an-group="%GROUP%"/>\n\
	<div id="inner-radio-%NAME%" class="inside">\n\
		<h3 data-i18n>%DISPLAY%</h3>\n\
		<h4 data-i18n>Player</h4>\n\
		<p>\n\
			<input type="button" id="radio-stream-data-toggle-%NAME%" name="radio-toggle-%NAME%" data-an-name="%NAME%" value="%SHOW%" />\n\
		</p>\n\
		<div id="radio-stream-data-%NAME%" class="c-radio-stream-data-%RADIO%" data-an-radio="%RADIO%" data-an-state="0">\n\
			<p id="p-radio-stream-%NAME%" class="radio">\n\
				<audio controls preload="auto" id="radio-stream-%NAME%">\n\
					<em>Sorry, no source defined.</em>\n\
				</audio>\n\
			</p>\n\
			<p id="p-radio-commands-%NAME%" class="radio">\n\
				<a href="#" id="a-radio-command-stop-%NAME%" class="radio-command-stop"><img src="images/media-playback-stop-big.png" /></a>\n\
				<a href="#" id="a-radio-command-start-%NAME%" class="radio-command-start"><img src="images/media-playback-start-big.png" /></a>\n\
				<a href="#" id="a-radio-command-next-%NAME%" class="radio-command-next"><img src="images/media-playback-next-big.png" /></a>\n\
			</p>\n\
			<h4 id="h4-radio-data-%NAME%" data-i18n>Last played songs</h4>\n\
			<p id="p-radio-data-toggle-%NAME%">\n\
				<input type="button" id="radio-data-toggle-%NAME%" name="radio-data-toggle-%NAME%" data-an-name="%NAME%" value="%SHOW%" />\n\
			</p>\n\
			<div id="radio-data-%NAME%" class="inside c-radio-data-%RADIO%" data-an-radio="%RADIO%" data-an-state="0">\n\
				<p id="p-radio-list-songs-%NAME%" class="radio">\n\
					<label for="radio-list-song-%NAME%" data-i18n>Song list</label>\n\
					<select id="radio-list-song-%NAME%" name="radio-list-song-%NAME%" class="radio-list-song-%RADIO%"></select>\n\
				</p>\n\
				<p id="p-radio-metadata-song-%NAME%" class="radio">\n\
					<label data-i18n class="radio-metatada-title">Title</label>\n\
					<label id="radio-metadata-song-title-%NAME%" class="radio-metatada-song radio-metadata-song-title-%RADIO%"></label><br/>\n\
					<label data-i18n class="radio-metatada-title">Artist</label>\n\
					<label id="radio-metadata-song-artist-%NAME%" class="radio-metatada-song radio-metadata-song-artist-%RADIO%"></label><br/>\n\
					<label data-i18n class="radio-metatada-title" id="label-radio-metadata-song-albumartist-%NAME%">Album artist</label>\n\
					<label id="radio-metadata-song-albumartist-%NAME%" class="radio-metatada-song radio-metadata-song-albumartist-%RADIO%"></label><br/>\n\
					<label data-i18n class="radio-metatada-title">Album</label>\n\
					<label id="radio-metadata-song-album-%NAME%" class="radio-metatada-song radio-metadata-song-album-%RADIO%"></label><br/>\n\
					<label data-i18n class="radio-metatada-title">Year</label>\n\
					<label id="radio-metadata-song-year-%NAME%" class="radio-metatada-song radio-metadata-song-year-%RADIO%"></label><br/>\n\
				</p>\n\
			</div>\n\
		</div>\n\
	</div>\n\
</div>\n';

/**
 * Initialize the carleon plugins configuration
 */
function gatherCarleonInformations() {
	var url = globalConfig.carleon_location;
	var response = sendGetRequest(url + '/');
	
	if (response.result) {
		carleon.apps = [];
		carleon.appsData = {};
		for (key in response.json.apps) {
			carleon.apps[response.json.apps[key].name] = response.json.apps[key];
		}
		carleon.ready = true;
		var resultProfile = sendGetRequest(globalConfig.carleon_location + carleon.apps['profiles'].url);
		
		if (resultProfile.result) {
			globalConfig.profile = resultProfile.json.profile;
		}
		
    // Init camera list
    var url = globalConfig.carleon_location + carleon.apps['camera'].url;
    var response = sendGetRequest(url);
    
    if (response.result) {
      carleon.appsData.cameras = [];
			for (cam in response.json.cameras) {
				carleon.appsData.cameras[response.json.cameras[cam].name] = response.json.cameras[cam];
			}
    } else {
      logMessage(logTypeError, $.t('Error loading camera list'));
    }
		
		// Init mpc list
		var url = globalConfig.carleon_location + carleon.apps['mpc'].url;
    var response = sendGetRequest(url);
    
    if (response.result) {
      carleon.appsData.mpcs = [];
			for (mpc in response.json.mpcs) {
				carleon.appsData.mpcs[response.json.mpcs[mpc].name] = response.json.mpcs[mpc];
			}
    } else {
      logMessage(logTypeError, $.t('Error loading mpc list'));
    }
		
		// Init radio list
		var url = globalConfig.carleon_location + carleon.apps['radio'].url;
    var response = sendGetRequest(url);
    
    if (response.result) {
      carleon.appsData.radios = [];
			for (radio in response.json.radios) {
				carleon.appsData.radios[response.json.radios[radio].name] = response.json.radios[radio];
			}
    } else {
      logMessage(logTypeError, $.t('Error loading radio list'));
    }
		
	} else {
		logMessage(logTypeError, $.t('Error loading Carleon configuration'));
	}
}

/**
 * Initialize the camera tab
 */
function initCameraTab() {
  if (carleon.ready && angharad.ready) {
		var curProfile = getCurrentProfile();
		var $container = $('#cameras-content');
		
		var html = tabConstGroupTemplate.replace(/%TAB%/g, tabCamerasId).replace(/%GROUP%/g, 0).replace(/%DISPLAY%/g, $.t('Scripts'));
		$(html).insertBefore($('#container-camera'));
		tabContent[tabCamerasId][0] = [];
		
		for (cam in carleon.appsData.cameras) {
			var curCam = carleon.appsData.cameras[cam];
			var $group = $('#container-camera');
			tabContent[tabCamerasId]['camera'] = [];
			tabContent[tabCamerasId]['camera'].push({type:"camera", name:curCam.name, description:curCam.description, group:curCam.name});
			displayCameraInGroup(curCam, tabCamerasId, 'camera', $group.attr('data-an-nb-elements'));
			
			for (tag in curCam.tags) {
				if (curCam.tags[tag].indexOf(globalConfig.tags_prefix + '#' + curProfile.id) == 0) {
					var tab = curCam.tags[tag].split('#')[2];
					var group = curCam.tags[tag].split('#')[3];
					var position = curCam.tags[tag].split('#')[4];
					var curName = tab + '-' + group + '-' + curCam.name;
          var $group = $('#div-group-'+tab+'-'+group);
					tabContent[tab][group].push({type:"camera", name:curCam.name, description:curCam.description, group:curCam.name});
					displayCameraInGroup(curCam, tab, group, position);
				}
			}
			updateCamera(curCam.name);
		}
  }
}

/**
 * Add a camera to the group
 * update the element by adding the proper tag
 */
function addCameraToGroup(camera, tab, group, position) {
	var curCamera = carleon.appsData.cameras[camera];
	var curProfileId = getCurrentProfile().id;
	var $group = $('#div-group-'+tab+'-'+group);
	var postParams = {};
	
	// Search if the selected switch is already in the group
	for (key in curCamera.tags) {
		if (curCamera.tags[key].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group) == 0) {
			return false;
		}
	}
	var tag = encodeURIComponent(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group + '#' + position);
	
	var url = globalConfig.carleon_location + carleon.apps['camera'].url + '?camera=' + curCamera.name + '&addtag=' + tag;
	var response = sendGetRequest(url);
	
	if (response.result) {
		displayCameraInGroup(curCamera, tab, group, position);
	} else {
		logMessage(logTypeError, $.t('Error while updating camera'));
	}
}

/**
 * Remove a camera from a group
 * update the group by removing the proper tag
 */
function removeCameraFromGroup(camera, tab, group) {
	var curCamera = carleon.appsData.cameras[camera];
	var curProfileId = getCurrentProfile().id;
	var $div = $('#camera-'+tab+'-'+group+'-'+camera);
	var postParams = {};
	var tag = undefined;
	
	for (key in curCamera.tags) {
		if (curCamera.tags[key].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group) == 0) {
			tag = encodeURIComponent(curCamera.tags[key]);
		}
	}
	
	var url = globalConfig.carleon_location + carleon.apps['camera'].url + '?camera=' + curCamera.name + '&removetag=' + tag;
	var response = sendGetRequest(url);
	
	if (response.result) {
		$div.fadeOut('fast', function() {
			$div.remove();
		});
	} else {
		logMessage(logTypeError, $.t('Error while updating script'));
	}
}

/**
 * Display the specified camera in the right place
 */
function displayCameraInGroup(curCamera, tab, group, position) {
	$group = $('#container-'+tab+'-'+group);
	var curName = tab + '-' + group + '-' + curCamera.name;
	if (tab == tabCamerasId) {
		curName = curCamera.name;
		$group = $('#container-camera');
	}
	
	var adminClass = '';
	if (tab == tabCamerasId) {
		adminClass = 'admin-modify-delete-no-dashboard';
	} else {
		adminClass = 'admin-modify-delete-dashboard';
	}
	
	var html = cameraTemplate.replace(/%NAME%/g, curName)
														.replace(/%CAMERA%/g, curCamera.name)
														.replace(/%DISPLAY%/g, $.t('Camera')+': '+curCamera.description)
														.replace(/%TAB%/g, tab)
														.replace(/%GROUP%/g, group)
														.replace(/%POSITION%/g, position)
														.replace(/%ADMINCLASS%/g, adminClass);
	
	insertElementInGroup(html, $group, position);

	if (getCurrentProfile().options.adminMode) {
		$('#admin-camera-'+curName).show();
	} else {
		$('#admin-camera-'+curName).hide();
	}
	
	$('#camera-switch-'+curName).change(function() {
    if ($('#camera-pictures-select-'+curName).val() == 'grid') {
      triggerImagesGrid(curName, $(this).attr('data-an-camera'));
    } else {
      triggerImagesListChange(curName, $(this).attr('data-an-camera'));
      $('#camera-list-'+curName).trigger('change');
    }
	});
	
	$('#camera-list-'+curName).change(function() {
		var cameraName = $(this).attr('data-an-camera');
		var name = $(this).attr('data-an-name');
		if ($('#camera-switch-'+name).val() != 'stream') {
			var url = globalConfig.carleon_location + carleon.apps['camera'].url + 'camera.php?camera='+cameraName+'&file='+$(this).val()+'&random='+Math.floor((Math.random()*100)+1);
			if ($('#camera-switch-'+name).val() == 'trigg') {
				url += '&alert';
			}
			$('#camera-photo-'+name).attr('src', url);
			$('#camera-photo-large-'+name).attr('href', url+'&large');
		}
	});
	
	$('#camera-pictures-select-'+curName).change(function() {
		var pictureSelect = $(this).val();
		var name = $(this).attr('data-an-name');
		var camera = $(this).attr('data-an-camera');
		if (pictureSelect == 'grid') {
			$('#p-camera-list-'+name).slideUp();
			$('#p-camera-photo-'+name).slideUp();
			$('#camera-grid-'+name).slideDown();
			triggerImagesGrid(name, camera);
		} else {
			$('#p-camera-list-'+name).slideDown();
			$('#p-camera-photo-'+name).slideDown();
			$('#camera-grid-'+name).slideUp();
			triggerImagesListChange(name, camera);
		}
	});
}

/**
 * Initialize a camera block
 */
function updateCamera(camera) {
	getCameraFiles(camera, true);
	getCameraFiles(camera, false);
	changeAllCameraListFiles(camera);
}

/**
 * get the camera files on the server
 */
function getCameraFiles(camera, alert) {
	var url = globalConfig.carleon_location + carleon.apps['camera'].url + '?camera='+camera;
	var type = (alert?'alert':'sched');
	url += (alert?'&alert':'');
	
	var response = sendGetRequest(url);
	
	if (response.result) {
		carleon.appsData.cameras[camera].detection = response.json.camera.detection;
		if (alert) {
			carleon.appsData.cameras[camera].alertFiles = response.json.camera.list;
		} else {
			carleon.appsData.cameras[camera].snapFiles = response.json.camera.list;
		}
	} else {
		logMessage(logTypeError, $.t('Error getting camera files for')+' '+camera);
	}
}

/**
 * 
 */
function changeAllCameraListFiles(camera) {
  $('.camera-'+camera).each(function() {
    var name = $(this).attr('data-an-name');
    if ($('#camera-pictures-select-'+name).val() == 'list') {
      triggerImagesListChange(name, camera);
    } else {
      triggerImagesGrid(name, camera);
    }
  });
}

/**
 * Update the displayed image on the board
 */
function triggerImagesListChange(name, camera) {
	var $selectList = $('#camera-list-'+name);
	var selectedElt = $selectList.val();
	var selected = '';
	var cameraSwitch = $('#camera-switch-'+name).val();
	$('#camera-status-'+name).attr('src', carleon.appsData.cameras[camera].detection?'images/recording.png':'images/recording-not.png');
	
	if (cameraSwitch == 'sched') {
		$selectList.empty();
		$selectList.append('<option value="lastsnap.jpg">'+$.t('Last snapshot')+'</option>\n');
		for (index in carleon.appsData.cameras[camera].snapFiles) {
			if (carleon.appsData.cameras[camera].snapFiles[index] == selectedElt) {
				selected = ' selected="true"';
			} else {
				selected = '';
			}
			$selectList.append('<option value="'+carleon.appsData.cameras[camera].snapFiles[index]+'"'+selected+'>'+carleon.appsData.cameras[camera].snapFiles[index]+'</option>\n');
		}
	} else if (cameraSwitch == 'trigg') {
		$selectList.empty();
		for (index in carleon.appsData.cameras[camera].alertFiles) {
			if (carleon.appsData.cameras[camera].alertFiles[index] == selectedElt) {
				selected = ' selected="true"';
			} else {
				selected = '';
			}
			$selectList.append('<option value="'+carleon.appsData.cameras[camera].alertFiles[index]+'"'+selected+'>'+carleon.appsData.cameras[camera].alertFiles[index]+'</option>\n');
		}
	} else if (cameraSwitch == 'stream') {
		var cameraName = $('#camera-switch-'+name).attr('data-an-camera');
		$selectList.empty();
		$selectList.append('<option data-i18n>'+$.t('Real-time stream')+'</option>\n');
		var url = globalConfig.carleon_location + carleon.apps['camera'].url + 'stream.php?camera='+cameraName;
		$('#camera-photo-'+name).attr('src', url);
		$('#camera-photo-large-'+name).attr('href', url+'&large');
	}
	$selectList.trigger('change');
}

/**
 * Update the images grid
 */
function triggerImagesGrid(name, camera) {
	var cameraSwitch = $('#camera-switch-'+name).val();
	$('#camera-status-'+name).attr('src', carleon.appsData.cameras[camera].detection?'images/recording.png':'images/recording-not.png');
	var $cameraGridUl = $('#camera-grid-'+name);
	$cameraGridUl.empty();
	if (cameraSwitch == 'sched') {
		var cpt=0;
		for (index in carleon.appsData.cameras[camera].snapFiles) {
			if (cpt < 16) {
				var url = globalConfig.carleon_location + carleon.apps['camera'].url + 'camera.php?camera='+camera+'&file='+carleon.appsData.cameras[camera].snapFiles[index];
				var title = carleon.appsData.cameras[camera].snapFiles[index];
				var htmlLi = cameraGridPictureTemplate.replace(/%NAME%/g, name)
																							.replace(/%URL%/g, url+'&grid')
																							.replace(/%URL_LARGE%/g, url+'&large')
																							.replace(/%TITLE%/g, title);
				$cameraGridUl.append(htmlLi);
			}
			cpt++;
		}
	} else if (cameraSwitch == 'trigg') {
		var cpt=0;
		for (index in carleon.appsData.cameras[camera].alertFiles) {
			if (cpt < 16) {
				var url = globalConfig.carleon_location + carleon.apps['camera'].url + 'camera.php?camera='+camera+'&file='+carleon.appsData.cameras[camera].alertFiles[index];
				var title = carleon.appsData.cameras[camera].alertFiles[index];
				var htmlLi = cameraGridPictureTemplate.replace(/%NAME%/g, name)
																							.replace(/%URL%/g, url+'&grid&alert')
																							.replace(/%URL_LARGE%/g, url+'&alert&large')
																							.replace(/%TITLE%/g, title);
				$cameraGridUl.append(htmlLi);
			}
			cpt++;
		}
	} else if (cameraSwitch == 'stream') {
	}
}

/**
 * Initialize the Music tab
 */
function initMusicTab() {
	var profile = getCurrentProfile();
	var profileToUpdate = false;
  if (carleon.ready && angharad.ready) {
		var $container = $('#container-music');
		var index = 0;
		
		if (profile.options.mpcs == undefined) {
			profile.options.mpcs = [];
			profileToUpdate = true;
		}
		
		for (mpc in carleon.appsData.mpcs) {
			tabContent[tabMusicId][index] = []
			var curMpc = carleon.appsData.mpcs[mpc];
			tabContent[tabMusicId][index].push({type:"mpc", name:curMpc.name, group:index, position:0});
			var html = tabConstGroupTemplate.replace(/%TAB%/g, tabMusicId).replace(/%GROUP%/g, index).replace(/%DISPLAY%/g, curMpc.display);
			
			$('#container-music').append(html);
			
			displayMpcInGroup(curMpc, tabMusicId, index, 0);
			var $group = $('#container-'+tabMusicId+'-'+index);
			
			for (tag in curMpc.tags) {
				if (curMpc.tags[tag].indexOf(globalConfig.tags_prefix + '#' + profile.id) == 0) {
					tab = curMpc.tags[tag].split('#')[2];
					group = curMpc.tags[tag].split('#')[3];
					position = curMpc.tags[tag].split('#')[4];
					displayMpcInGroup(curMpc, tab, group, position);
				}
			}
			index++;
      
      updateMpcDisplay(updateMpc(curMpc.name), curMpc.name);
		}
		
		// Initialize the interval for mpc display
		setInterval(function() {
			updateAllMpcDisplay();
		}, 10*1000);
		
		if (profile.options.radios == undefined) {
			profile.options.radios = [];
			profileToUpdate = true;
		}
		
		for (radio in carleon.appsData.radios) {
			tabContent[tabMusicId][index] = [];
			var curRadio = carleon.appsData.radios[radio];
			var radioProfileFound = false;
			for (key in profile.options.radios) {
				if (profile.options.radios[key].name == curRadio.name) {
					radioProfileFound = true;
				}
			}
			if (!radioProfileFound) {
				profile.options.radios.push({name:curRadio.name, stream:false, data:false});
				profileToUpdate = true;
			}
			tabContent[tabMusicId][index].push({type:"radio", name:curRadio.name, group:index, position:0});
			var html = tabConstGroupTemplate.replace(/%TAB%/g, tabMusicId).replace(/%GROUP%/g, index).replace(/%DISPLAY%/g, curRadio.display);
			
			$('#container-music').append(html);
			
			displayRadioInGroup(curRadio, tabMusicId, index, 0);
			var $group = $('#container-'+tabMusicId+'-'+index);
			
			for (tag in curRadio.tags) {
				if (curRadio.tags[tag].indexOf(globalConfig.tags_prefix + '#' + profile.id) == 0) {
					tab = curRadio.tags[tag].split('#')[2];
					group = curRadio.tags[tag].split('#')[3];
					position = curRadio.tags[tag].split('#')[4];
					displayRadioInGroup(curRadio, tab, group, position);
				}
			}
			index++;
		}
		// Initialize the interval for radio command
		updateAllRadioCommands();
		setInterval(function() {
			updateAllRadioCommands();
		}, 30*1000);
		
		// Initialize the interval for radio songs lists
		updateAllRadioSongList();
		setInterval(function() {
			updateAllRadioSongList();
		}, 30*1000);
		
		// Update profile if necessary
		if (profileToUpdate == true) {
			updateProfile(profile);
		}
	}
}

/**
 * Add a mpc to the group
 * update the element by adding the proper tag
 */
function addMpcToGroup(mpc, tab, group, position) {
	var curMpc = carleon.appsData.mpcs[mpc];
	var curProfileId = getCurrentProfile().id;
	var $group = $('#mpc-'+tab+'-'+group);
	var postParams = {};
	
	// Search if the selected switch is already in the group
	for (key in curMpc.tags) {
		if (curMpc.tags[key].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group) == 0) {
			return false;
		}
	}
	var tag = encodeURIComponent(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group + '#' + position);
	
	var url = globalConfig.carleon_location + carleon.apps['mpc'].url + '?server=' + curMpc.name + '&addtag=' + tag;
	var response = sendGetRequest(url);
	
	if (response.result) {
		displayMpcInGroup(curMpc, tab, group, position);
	} else {
		logMessage(logTypeError, $.t('Error while updating mpc'));
	}
}

/**
 * Remove a mpc from a group
 * update the group by removing the proper tag
 */
function removeMpcFromGroup(mpc, tab, group) {
	var curMpc = carleon.appsData.mpcs[mpc];
	var curProfileId = getCurrentProfile().id;
	var $div = $('#mpc-'+tab+'-'+group+'-'+mpc);
	var postParams = {};
	var tag = undefined;
	
	for (key in curMpc.tags) {
		if (curMpc.tags[key].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group) == 0) {
			tag = encodeURIComponent(curMpc.tags[key]);
		}
	}
	
	var url = globalConfig.carleon_location + carleon.apps['mpc'].url + '?server=' + curMpc.name + '&removetag=' + tag;
	var response = sendGetRequest(url);
	
	if (response.result) {
		$div.fadeOut('fast', function() {
			$div.remove();
		});
	} else {
		logMessage(logTypeError, $.t('Error while updating mpc'));
	}
}

/**
 * Display the mpc commands in the proper group and initialize the events
 */
function displayMpcInGroup(curMpc, tab, group, position) {
	$group = $('#container-'+tab+'-'+group);
	var curName = tab + '-' + group + '-' + curMpc.name;
	var adminClass = '';
	if (tab == tabMusicId) {
		adminClass = 'admin-modify-delete-no-dashboard';
	} else {
		adminClass = 'admin-modify-delete-dashboard';
	}
	var html = mpcTemplate.replace(/%NAME%/g, curName)
														.replace(/%MPC%/g, curMpc.name)
														.replace(/%DISPLAY%/g, curMpc.display)
														.replace(/%TAB%/g, tab)
														.replace(/%GROUP%/g, group)
														.replace(/%POSITION%/g, position)
														.replace(/%ADMINCLASS%/g, adminClass)
                            .replace(/%SHOW%/g, $.t('Show'));
	
	insertElementInGroup(html, $group, position);

	if (getCurrentProfile().options.adminMode) {
		$('#admin-mpc-'+curName).show();
	} else {
		$('#admin-mpc-'+curName).hide();
	}
	$('#mpc-slide-'+curName).empty().slider({
		min:0,
		max:100,
		step:1,
		value:0,
		change:function( event, ui ) {
			if (event.originalEvent) {
				var server = $(this).parent().attr('data-an-mpc');
				var url = globalConfig.carleon_location + carleon.apps['mpc'].url + '?server='+server+'&volume='+$(this).slider( 'value' );
				var response = sendGetRequest(url);
				
				if (response.result) {
					updateMpcDisplay(updateMpc(server), server);
				} else {
					logMessage(logTypeError, $.t('Error updating music volume on server')+' '+server);
				}
			}
		}
	});
	
	$('#mpc-' + curName + '-stop').click(function() {
		var mpc = $(this).parent().parent().attr('data-an-mpc');
		var url = globalConfig.carleon_location + carleon.apps['mpc'].url + '?server='+mpc+'&stop';
		var response = sendGetRequest(url);
		
		if (response.result) {
			updateMpcDisplay(response.json.mpc, mpc);
		} else {
			logMessage(logTypeError, $.t('Error updating music on server ')+mpc);
		}
		return false;
	});
	
	$('#mpc-' + curName + '-play').click(function() {
		var mpc = $(this).parent().parent().attr('data-an-mpc');
		var url = globalConfig.carleon_location + carleon.apps['mpc'].url + '?server='+mpc+'&play';
		var response = sendGetRequest(url);
		
		if (response.result) {
			updateMpcDisplay(response.json.mpc, mpc);
		} else {
			logMessage(logTypeError, $.t('Error updating music on server')+' '+mpc);
		}
		return false;
	});
	
	$('#toggle-mpc-'+curName).click(function() {
		var $divCommands = $('#mpc-commands-'+curName);
		var mpc = $(this).attr('data-an-name');
		if ($divCommands.attr('data-an-state') == '0') {
			$divCommands.attr('data-an-state', '1');
			$divCommands.slideDown();
			$('#toggle-mpc-'+curName).attr('value', $.t('Hide'));
			updateMpcDisplay(updateMpc(mpc), mpc);
		} else {
			$divCommands.attr('data-an-state', '0');
			$divCommands.slideUp();
			$('#toggle-mpc-'+curName).attr('value', $.t('Show'));
		}
	});
}

/**
 * Update all the mpc controls for this mpc
 */
function updateMpc(mpc) {
	var url = globalConfig.carleon_location + carleon.apps['mpc'].url + '?server='+mpc+'&status';
	var response = sendGetRequest(url);
	
	if (response.result) {
		return response.json.mpc;
	} else {
		logMessage(logTypeError, $.t('Error updating music information on server')+' '+mpc);
		return undefined
	}
}

/**
 * Update all mpcs
 */
function updateAllMpcDisplay() {
	for (mpc in carleon.appsData.mpcs) {
		var isOpened = false;
		$('.c-mpc-commands-'+mpc).each(function() {
			if ($(this).attr('data-an-state') == '1') {
				isOpened = true;
			}
		});
		if (isOpened) {
			updateMpcDisplay(updateMpc(mpc), mpc);
		}
	}
}

/**
 * Update the display for all mpcs of this name
 */
function updateMpcDisplay(mpcStatus, mpc) {
	if (mpcStatus != undefined) {
		if (mpcStatus.state == 'playing') {
			// Display stop button, hide play button
			$('.mpc-stop-'+mpc).slideDown();
			$('.mpc-play-'+mpc).slideUp();
		} else {
			// Display play button, hide stop button
			$('.mpc-stop-'+mpc).slideUp();
			$('.mpc-play-'+mpc).slideDown();
		}
		$('.mpc-status-'+mpc).text(mpcStatus.title);
    $('.mpc-volume-slide-'+mpc).slider('option', 'disabled', false);
		$('.mpc-volume-slide-'+mpc).slider('value', mpcStatus.volume);
		$('.mpc-volume-'+mpc).text($.t('Volume')+': '+mpcStatus.volume+' %');
    $('.mpc-status-'+mpc).attr('src', 'images/media-enabled.png');
	} else {
    // Hide buttons, disable slide
    $('.mpc-stop-'+mpc).slideUp();
    $('.mpc-play-'+mpc).slideUp();
    $('.mpc-volume-slide-'+mpc).slider('option', 'disabled', true);
    $('.mpc-status-'+mpc).attr('src', 'images/media-disabled.png');
  }
}

/**
 * Add a radio to the group
 * update the element by adding the proper tag
 */
function addRadioToGroup(radio, tab, group, position) {
	var curRadio = carleon.appsData.radios[radio];
	var curProfileId = getCurrentProfile().id;
	var $group = $('#radio-'+tab+'-'+group);
	var postParams = {};
	
	// Search if the selected switch is already in the group
	for (key in curRadio.tags) {
		if (curRadio.tags[key].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group) == 0) {
			return false;
		}
	}
	var tag = encodeURIComponent(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group + '#' + position);
	
	var url = globalConfig.carleon_location + carleon.apps['radio'].url + '?radio=' + curRadio.name + '&addtag=' + tag;
	var response = sendGetRequest(url);
	
	if (response.result) {
		displayRadioInGroup(curRadio, tab, group, position);
	} else {
		logMessage(logTypeError, $.t('Error while updating radio'));
	}
}

/**
 * Remove a radio from a group
 * update the group by removing the proper tag
 */
function removeRadioFromGroup(radio, tab, group) {
	var curRadio = carleon.appsData.radios[radio];
	var curProfileId = getCurrentProfile().id;
	var $div = $('#radio-'+tab+'-'+group+'-'+radio);
	var postParams = {};
	var tag = undefined;
	
	for (key in curRadio.tags) {
		if (curRadio.tags[key].indexOf(globalConfig.tags_prefix + '#' + curProfileId + '#' + tab + '#' + group) == 0) {
			tag = encodeURIComponent(curRadio.tags[key]);
		}
	}
	
	var url = globalConfig.carleon_location + carleon.apps['radio'].url + '?radio=' + curRadio.name + '&removetag=' + tag;
	var response = sendGetRequest(url);
	
	if (response.result) {
		$div.fadeOut('fast', function() {
			$div.remove();
		});
	} else {
		logMessage(logTypeError, $.t('Error while updating radio'));
	}
}

/**
 * Display the radio commands in the proper group and initialize the events
 */
function displayRadioInGroup(curRadio, tab, group, position) {
	var profile = getCurrentProfile();
	$group = $('#container-'+tab+'-'+group);
	var curName = tab + '-' + group + '-' + curRadio.name;
	var adminClass = '';
	if (tab == tabMusicId) {
		adminClass = 'admin-modify-delete-no-dashboard';
	} else {
		adminClass = 'admin-modify-delete-dashboard';
	}
	var html = radioTemplate.replace(/%NAME%/g, curName)
														.replace(/%RADIO%/g, curRadio.name)
														.replace(/%DISPLAY%/g, curRadio.display)
														.replace(/%TAB%/g, tab)
														.replace(/%GROUP%/g, group)
														.replace(/%POSITION%/g, position)
														.replace(/%ADMINCLASS%/g, adminClass)
                            .replace(/%SHOW%/g, $.t('Show'));
	
	insertElementInGroup(html, $group, position);

	if (profile.options.adminMode) {
		$('#admin-radio-'+curName).show();
	} else {
		$('#admin-radio-'+curName).hide();
	}
	
	for (radio in profile.options.radios) {
		if (profile.options.radios[radio].name == curRadio.name) {
			toggleRadioStream(curName, profile.options.radios[radio].stream);
			toggleRadioData(curName, profile.options.radios[radio].data);
		}
	}
	
	// If radio doesn't allow control, remove commands
	if (!curRadio.control) {
		$('#p-radio-commands-'+curName).remove();
		$('#h4-radio-data-'+curName).remove();
		$('#p-radio-data-toggle-'+curName).remove();
		$('#radio-data-'+curName).remove();
	}
	
	$('#radio-stream-data-toggle-'+curName).click(function() {
		var profile = getCurrentProfile();
		var curName = $(this).attr('data-an-name');
		for (radio in profile.options.radios) {
			if (profile.options.radios[radio].name == curRadio.name) {
				profile.options.radios[radio].stream = !profile.options.radios[radio].stream;
				if (!profile.options.radios[radio].stream) {
					profile.options.radios[radio].data = false;
				}
				toggleRadioStream(curName, profile.options.radios[radio].stream);
			}
		}
		updateProfile(profile);
	});
	
	$('#radio-data-toggle-'+curName).click(function() {
		var profile = getCurrentProfile();
		var curName = $(this).attr('data-an-name');
		for (radio in profile.options.radios) {
			if (profile.options.radios[radio].name == curRadio.name) {
				profile.options.radios[radio].data = !profile.options.radios[radio].data;
				toggleRadioData(curName, profile.options.radios[radio].data);
			}
		}
		updateProfile(profile);
	});
	
	$('#a-radio-command-start-'+curName).unbind('click').click(function() {
		sendRadioCommand($(this).parent().parent().attr('data-an-radio'), 'start');
		return false;
	});

	$('#a-radio-command-stop-'+curName).unbind('click').click(function() {
		sendRadioCommand($(this).parent().parent().attr('data-an-radio'), 'stop');
		return false;
	});

	$('#a-radio-command-next-'+curName).unbind('click').click(function() {
		sendRadioCommand($(this).parent().parent().attr('data-an-radio'), 'skip');
		return false;
	});
	
	$('#radio-list-song-'+curName).change(function() {
		if ($(this).val() == 'current') {
			updateRadioSongMetadata($(this).parent().parent().attr('data-an-radio'), '-1');
		} else {
			updateRadioSongMetadata($(this).parent().parent().attr('data-an-radio'), $(this).val());
		}
	});
}

/**
 * Send a command to a radio (stop, play, next)
 */
function sendRadioCommand(radio, command) {
	var url = globalConfig.carleon_location + carleon.apps['radio'].url + '?radio='+radio+'&request='+command;
	var response = sendGetRequest(url);
	
	if (response.result) {
		updateRadioCommands(radio);
	} else {
		logMessage(logTypeError, $.t('Unable to send command for radio')+' '+radio);
	}
}

/**
 * Updates the radio commands available for all the radios (stop, play, next)
 */
function updateAllRadioCommands() {
	// Loop in every radio
	for (key in carleon.appsData.radios) {
		// Find if current radio has opened players
		var radio = carleon.appsData.radios[key].name;
		var hasOpened = false;
		$('.c-radio-stream-data-'+radio).each(function() {
			if ($(this).attr('data-an-state') == '1') {
				hasOpened = true;
			}
		});
		if (hasOpened && carleon.appsData.radios[key].control) {
			// Update all the radio players command for this radio
			updateRadioCommands(radio);
		}
	}
}

/**
 * Updates the radio commands available (stop, play, next)
 */
function updateRadioCommands(radio) {
	var url = globalConfig.carleon_location + carleon.apps['radio'].url + '?radio='+radio+'&request=status';
	var response = sendGetRequest(url);
	
	if (response.result) {
		if (response.json.data == 'on') {
			var $pRadioCommands = $('#p-radio-commands');
			$('.c-radio-stream-data-'+radio).find('.radio-command-start').hide();
			$('.c-radio-stream-data-'+radio).find('.radio-command-stop').show();
			$('.c-radio-stream-data-'+radio).find('.radio-command-next').show();
		} else {
			$('.c-radio-stream-data-'+radio).find('.radio-command-start').show();
			$('.c-radio-stream-data-'+radio).find('.radio-command-stop').hide();
			$('.c-radio-stream-data-'+radio).find('.radio-command-next').hide();
		}
	} else {
		logMessage(logTypeError, $.t('Unable to get status for radio')+' '+radio);
	}
}

/**
 * Updates the radio commands available for all the radios (stop, play, next)
 */
function updateAllRadioSongList() {
	// Loop in every radio
	for (key in carleon.appsData.radios) {
		// Find if current radio has opened players
		var radio = carleon.appsData.radios[key].name;
		var hasOpened = false;
		$('.c-radio-data-'+radio).each(function() {
			if ($(this).attr('data-an-state') == '1') {
				hasOpened = true;
			}
		});
		if (hasOpened && carleon.appsData.radios[key].control) {
			// Update all the radio songs metadata for this radio
			updateRadioCurrentSong(radio);
			updateRadioSongList(radio);
		}
	}
}

/**
 * Update the list of the last songs played on the radio
 */
function updateRadioSongList(radio) {
	var url = globalConfig.carleon_location + carleon.apps['radio'].url + '?radio='+radio+'&list';
	var response = sendGetRequest(url);
	
	if (response.result) {
		carleon.appsData.radios[radio].list = response.json.list;
		$('.radio-list-song-'+radio).each(function() {
			var selectedSong = $(this).find('option:selected').text();
			$(this).empty();
			$(this).append('<option value="current">'+$.t('Current song')+'</option>');
			if (carleon.appsData.radios[radio].list.length >0) {
				for (i=0; i<carleon.appsData.radios[radio].list.length; i++) {
					$(this).append('<option value="'+i+'">'+carleon.appsData.radios[radio].list[i].artist + ' - ' + carleon.appsData.radios[radio].list[i].title+'</option>');
				}
				if (selectedSong != '') {
					$(this).find('option:contains('+selectedSong+')').prop('selected', true);
				}
			}
			$(this).trigger('change');
		});
	} else {
		logMessage(logTypeError, $.t('Unable to get the songs list for radio')+' '+radio);
	}
}

/**
 * Update the metadata for the currently played song
 */
function updateRadioCurrentSong(radio) {
	var url = globalConfig.carleon_location + carleon.apps['radio'].url + '?radio='+radio+'&on_air';
	var response = sendGetRequest(url);
	
	if (response.result) {
		carleon.appsData.radios[radio].on_air = response.json.song;
	} else {
		logMessage(logTypeError, $.t('Unable to get the songs list for radio')+' '+radio);
	}
}

/**
 * Update the metadata displayed regarding a radio song
 */
function updateRadioSongMetadata(radio, songIndex) {
	var song = undefined;
	if (songIndex == '-1') {
		// Display current song
		song = carleon.appsData.radios[radio].on_air;
	} else {
		song = carleon.appsData.radios[radio].list[songIndex];
	}
	$('.radio-metadata-song-title-'+radio).text(song.title);
	$('.radio-metadata-song-artist-'+radio).text(song.artist);
	if (song.albumartist === undefined) {
		$('.radio-metadata-song-albumartist-'+radio).text('');
	} else {
		$('.radio-metadata-song-albumartist-'+radio).text(song.albumartist);
	}
	$('.radio-metadata-song-album-'+radio).text(song.album);
	$('.radio-metadata-song-year-'+radio).text(song.year);
}

/**
 * Show or hide the radio stream commands
 */
function toggleRadioStream(curName, state) {
	if (state) {
		toggleRadioData(curName, false);
		// Show stream div only
		$('#radio-stream-data-'+curName).slideDown();
		$('#radio-stream-data-'+curName).attr('data-an-state', '1');
		$('#radio-stream-data-toggle-'+curName).attr('value', $.t('Hide'));
		updateRadioCommands($('#radio-stream-data-'+curName).attr('data-an-radio'));
	} else {
		// Hide stream and data divs
		$('#radio-stream-data-'+curName).slideUp();
		$('#radio-stream-data-'+curName).attr('data-an-state', '0');
		$('#radio-stream-data-toggle-'+curName).attr('value', $.t('Show'));
	}
}

/**
 * Show or hide the radio data commands
 */
function toggleRadioData(curName, state) {
	if (state) {
		// Show data div
		$('#radio-data-'+curName).slideDown();
		$('#radio-data-'+curName).attr('data-an-state', '1');
		$('#radio-data-toggle-'+curName).attr('value', $.t('Hide'));
		updateRadioCurrentSong($('#radio-data-'+curName).attr('data-an-radio'));
		updateRadioSongList($('#radio-data-'+curName).attr('data-an-radio'));
	} else {
		// Hide data div
		$('#radio-data-'+curName).slideUp();
		$('#radio-data-'+curName).attr('data-an-state', '0');
		$('#radio-data-toggle-'+curName).attr('value', $.t('Show'));
	}
}

/**
 * Refresh cameras
 */
function refreshCarleon() {
  refreshCameras();
  
  refreshMpcs();
}

/**
 * Refresh camera files
 */
function refreshCameras() {
  // Reload files
  for (camera in carleon.appsData.cameras) {
    updateCamera(camera);
  }
}

/**
 * Refresh mpc status
 */
function refreshMpcs() {
}
